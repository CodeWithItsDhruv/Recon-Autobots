# Firebase Domain Authorization Fix

## 🚨 Error: `auth/unauthorized-domain`

This error occurs when your Vercel domain is not authorized in Firebase Authentication settings.

## 🔧 Solution Steps:

### Step 1: Access Firebase Console
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Select your `recon-autobots` project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**

### Step 2: Add Vercel Domains
Add these domains to your authorized domains list:

```
recon-autobots.vercel.app
*.vercel.app
localhost
127.0.0.1
```

### Step 3: Verify Domain List
Your authorized domains should include:
- `localhost` (for development)
- `127.0.0.1` (for development)
- `recon-autobots.vercel.app` (your production domain)
- `*.vercel.app` (wildcard for all Vercel domains)

### Step 4: Save Changes
Click **Save** to apply the changes.

### Step 5: Test Authentication
After adding the domains, test authentication on your live site:
- Try signing up with email/password
- Try Google Sign-in
- Check browser console for any remaining errors

## 🔍 Additional Troubleshooting:

### Check Current Domain
The app now logs the current domain in the console. Check your browser console to see:
```javascript
Environment check: {
  NODE_ENV: "production",
  Current domain: "recon-autobots.vercel.app",
  // ... other info
}
```

### Common Issues:
1. **Domain not added**: Make sure `recon-autobots.vercel.app` is in the list
2. **Wildcard not working**: Add both specific domain and `*.vercel.app`
3. **Case sensitivity**: Ensure domain case matches exactly
4. **Cache issues**: Clear browser cache and try again

### Alternative Domains to Add:
If you have multiple Vercel deployments, add:
```
recon-autobots.vercel.app
recon-autobots-git-main.vercel.app
recon-autobots-git-develop.vercel.app
*.vercel.app
```

## ✅ Verification:
After adding the domains, authentication should work without the `auth/unauthorized-domain` error.
