# Firebase Authentication Setup Guide

## 🔥 Firebase Console Configuration

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `taj-royals-1f34c`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable the following providers:

#### Email/Password Authentication
- Click on **Email/Password**
- Enable **Email/Password** provider
- Click **Save**

#### Google Authentication
- Click on **Google**
- Enable **Google** provider
- Add your project's support email
- Click **Save**

### 2. Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Add app** → **Web** (if not already added)
4. Copy the configuration values

### 3. Environment Variables
Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=taj-royals-1f34c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=taj-royals-1f34c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=taj-royals-1f34c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7NDZ4CM35B
```

## 🚀 Features Added

### Authentication System
- ✅ **Email/Password Sign Up & Sign In**
- ✅ **Google Sign In**
- ✅ **Protected Checkout Flow** (Place Order requires authentication)
- ✅ **Automatic Redirects** (Login → Cart, Cart → Login)
- ✅ **User Session Management**
- ✅ **Logout Functionality**

### Pages Created
- `/login` - Sign in page (redirects to cart after login)
- `/signup` - Sign up page (redirects to cart after signup)
- `/place-order` - Protected checkout page (requires authentication)

### Components Created
- `AuthForm` - Reusable login/signup form
- `ProtectedRoute` - Route protection wrapper
- `AuthContext` - Authentication state management

## 🔧 Usage

### For Users
1. **Browse freely** - no login required for browsing
2. **Add items to cart** - no login required for shopping
3. **Login required for checkout** - when clicking "Proceed to Checkout"
4. **Automatic redirects** - login/signup redirects back to cart
5. **Use Google sign-in** for quick access

### For Developers
```jsx
import { useAuth } from '@/context/AuthContext';

const { user, signIn, signUp, signInWithGoogle, logout } = useAuth();
```

## 🛡️ Security Features
- **Protected checkout flow** - only authenticated users can place orders
- **Automatic session management** - persistent login state
- **Secure Firebase authentication** - industry-standard security
- **Toast notifications** for user feedback
- **Smart redirects** - users return to cart after login

## 📱 Next Steps
1. Configure Firebase Authentication in console
2. Add your environment variables
3. Test the authentication flow
4. Deploy with `firebase deploy --only hosting`
