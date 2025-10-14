import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  stock: number;
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  reviews?: Array<{
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Timestamp;
  }>;
}

class FirebaseProductService {
  private productsCollection = collection(db, 'products');

  // Add new product
  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const productData = {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(this.productsCollection, productData);
      console.log('Product added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw new Error('Failed to add product');
    }
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(this.productsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  // Get active products only
  async getActiveProducts(): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection, 
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Failed to get active products:', error);
      return [];
    }
  }

  // Get product by ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const docRef = doc(this.productsCollection, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Product;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get product:', error);
      return null;
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection, 
        where('category', '==', category),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Failed to get products by category:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection, 
        where('featured', '==', true),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Failed to get featured products:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation. For production, consider using Algolia or similar
      const q = query(
        this.productsCollection, 
        where('status', '==', 'active'),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      
      const allProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      // Filter products that match search term
      return allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  }

  // Update product
  async updateProduct(productId: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const docRef = doc(this.productsCollection, productId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  }

  // Update product stock
  async updateProductStock(productId: string, newStock: number): Promise<boolean> {
    try {
      const docRef = doc(this.productsCollection, productId);
      await updateDoc(docRef, {
        stock: newStock,
        status: newStock > 0 ? 'active' : 'out_of_stock',
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Failed to update product stock:', error);
      return false;
    }
  }

  // Add product review
  async addProductReview(productId: string, review: {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
  }): Promise<boolean> {
    try {
      const docRef = doc(this.productsCollection, productId);
      const productDoc = await getDoc(docRef);
      
      if (productDoc.exists()) {
        const productData = productDoc.data() as Product;
        const reviews = productData.reviews || [];
        
        reviews.push({
          ...review,
          createdAt: Timestamp.now()
        });

        await updateDoc(docRef, {
          reviews: reviews,
          updatedAt: Timestamp.now()
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add product review:', error);
      return false;
    }
  }

  // Get low stock products
  async getLowStockProducts(minStock: number = 10): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection, 
        where('stock', '<=', minStock),
        where('status', '==', 'active'),
        orderBy('stock', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Failed to get low stock products:', error);
      return [];
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.productsCollection, productId));
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  }

  // Listen to products changes (real-time updates)
  onProductsChange(callback: (products: Product[]) => void): () => void {
    const q = query(this.productsCollection, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      callback(products);
    });
  }

  // Get product categories
  async getProductCategories(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const categories = [...new Set(products.map(product => product.category))];
      return categories.sort();
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection, 
        where('price', '>=', minPrice),
        where('price', '<=', maxPrice),
        where('status', '==', 'active'),
        orderBy('price', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      console.error('Failed to get products by price range:', error);
      return [];
    }
  }
}

export const firebaseProductService = new FirebaseProductService();
export default firebaseProductService;
