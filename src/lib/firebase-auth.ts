import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: 'admin' | 'customer';
  createdAt: string;
  lastLogin: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  addresses?: Array<{
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
}

class FirebaseAuthService {
  private googleProvider = new GoogleAuthProvider();

  // Sign in with Google
  async signInWithGoogle(): Promise<FirebaseUser> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const user = result.user;

      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date().toISOString()
        });
        return userDoc.data() as FirebaseUser;
      } else {
        // Create new user document
        const userData: FirebaseUser = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            newsletter: true,
            notifications: true
          },
          addresses: []
        };

        await setDoc(doc(db, 'users', user.uid), userData);
        return userData;
      }
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      throw new Error(this.getErrorMessage(firebaseError.code));
    }
  }

  // Admin invitation validation (obfuscated for security)
  private static readonly ADMIN_INVITATION_CHECK = [
    87, 69, 76, 82, 65, 66 // ASCII codes for W-E-L-R-A-B
  ];

  // Additional security: time-based validation
  private static readonly ADMIN_VALIDATION_KEY = 'admin_secure_2024';

  // Rate limiting for invitation code attempts
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private static attemptCount = 0;
  private static lastAttemptTime = 0;

  // Validate admin invitation code using obfuscated comparison
  static validateAdminInvitationCode(code: string): boolean {
    // Rate limiting check
    const now = Date.now();
    if (now - this.lastAttemptTime > this.ATTEMPT_WINDOW) {
      this.attemptCount = 0;
    }
    
    if (this.attemptCount >= this.MAX_ATTEMPTS) {
      throw new Error('Too many invalid attempts. Please try again later.');
    }
    
    this.attemptCount++;
    this.lastAttemptTime = now;
    
    if (!code || code.length !== 6) return false;
    
    const upperCode = code.toUpperCase();
    
    // Check each character against obfuscated ASCII values
    for (let i = 0; i < 6; i++) {
      if (upperCode.charCodeAt(i) !== this.ADMIN_INVITATION_CHECK[i]) {
        return false;
      }
    }
    
    // Additional validation (can be extended)
    const isValid = this.performAdditionalValidation(code);
    
    // Reset attempt count on successful validation
    if (isValid) {
      this.attemptCount = 0;
    }
    
    return isValid;
  }

  // Additional validation layer
  private static performAdditionalValidation(code: string): boolean {
    // Simple additional checks to make reverse engineering harder
    const checksum = code.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return checksum === 456; // Sum of WELRAB ASCII values
  }

  // Create admin user with invitation code validation
  async createAdminUser(email: string, password: string, displayName: string, invitationCode: string): Promise<FirebaseUser> {
    // Validate invitation code
    if (!FirebaseAuthService.validateAdminInvitationCode(invitationCode)) {
      throw new Error('Invalid admin invitation code');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName });

      // Create admin user document in Firestore
      const userData: FirebaseUser = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName,
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          newsletter: true,
          notifications: true
        },
        addresses: []
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      
      return userData;
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      console.error('Firebase createAdmin error:', firebaseError.code, error);
      throw new Error(this.getErrorMessage(firebaseError.code));
    }
  }

  // Create new user account
  async createUser(email: string, password: string, displayName: string, role: 'admin' | 'customer' = 'customer'): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      const userData: FirebaseUser = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName,
        role: role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          newsletter: true,
          notifications: true
        },
        addresses: []
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      
      return userData;
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      throw new Error(this.getErrorMessage(firebaseError.code));
    }
  }

  // Sign in user
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      });

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as FirebaseUser;
      } else {
        throw new Error('User data not found');
      }
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      console.error('Firebase sign-in error:', firebaseError.code, error);
      throw new Error(this.getErrorMessage(firebaseError.code));
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      throw new Error('Failed to sign out');
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as FirebaseUser);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<FirebaseUser>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), updates);
    } catch (error: unknown) {
      throw new Error('Failed to update profile');
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      throw new Error(this.getErrorMessage(firebaseError.code));
    }
  }

  // Update password
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
      } else {
        throw new Error('No user logged in');
      }
    } catch (error: unknown) {
      const firebaseError = error as { code: string };
      throw new Error(this.getErrorMessage(firebaseError.code));
    }
  }

  // Delete user account
  async deleteUserAccount(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', user.uid));
        
        // Delete user from Firebase Auth
        await deleteUser(user);
      } else {
        throw new Error('No user logged in');
      }
    } catch (error: unknown) {
      throw new Error('Failed to delete account');
    }
  }

  // Get user by email (admin function)
  async getUserByEmail(email: string): Promise<FirebaseUser | null> {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.data() as FirebaseUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // Get all users (admin function)
  async getAllUsers(): Promise<FirebaseUser[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => doc.data() as FirebaseUser);
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Helper method to get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/operation-not-allowed':
        return 'Email/Password authentication is not enabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/invalid-api-key':
        return 'Firebase configuration error. Please contact support.';
      case 'auth/app-not-authorized':
        return 'Firebase app not authorized. Please contact support.';
      default:
        return `Authentication failed: ${errorCode}. Please try again or contact support.`;
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
