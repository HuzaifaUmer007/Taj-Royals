# Firestore Database Setup Guide

## 🔥 Firebase Console Configuration

### 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `taj-royals-1f34c`
3. Navigate to **Firestore Database**
4. Click **Create database**
5. Choose **Start in test mode** (for development)
6. Select a location (choose closest to your users)
7. Click **Done**

### 2. Configure Firestore Security Rules
1. Go to **Firestore Database** → **Rules**
2. Update the rules to allow authenticated users to read/write their own orders:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.user == request.auth.uid || 
         request.auth.uid == resource.data.user);
    }
    
    // Allow users to create new orders
    match /orders/{orderId} {
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.user;
    }
  }
}
```

3. Click **Publish**

### 3. Environment Variables
Make sure your `.env.local` file has the correct Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=taj-royals-1f34c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=taj-royals-1f34c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=taj-royals-1f34c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7NDZ4CM35B
```

## 🚀 Features Implemented

### Order Storage
- ✅ **Save Orders to Firestore** - Orders are stored in the `orders` collection
- ✅ **User-Specific Orders** - Each order is linked to the authenticated user
- ✅ **Order Metadata** - Includes timestamps, status, and user information
- ✅ **Automatic Fallback** - Falls back to localStorage if Firestore fails

### Order Retrieval
- ✅ **Fetch User Orders** - Gets all orders for the current user
- ✅ **Real-time Updates** - Orders are fetched fresh from Firestore
- ✅ **Proper Formatting** - Orders are formatted for display
- ✅ **Error Handling** - Graceful fallback to localStorage

### Data Structure
```javascript
// Order document structure in Firestore
{
  items: [
    {
      _id: "product_id",
      name: "Product Name",
      price: 599,
      size: "M",
      quantity: 2,
      image: ["image_url"]
    }
  ],
  address: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipcode: "10001",
    country: "USA",
    phone: "1234567890"
  },
  amount: 1238,
  paymentMethod: "cod",
  status: "Processing",
  user: "firebase_user_uid",
  userEmail: "user@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🧪 Testing the Integration

### 1. Test Order Placement
1. **Add items to cart**
2. **Login** (if not already logged in)
3. **Go to place-order page**
4. **Fill the form** with delivery details
5. **Click "PLACE ORDER"**
6. **Should see**: "Order placed successfully! (Saved to Firestore)"
7. **Check Firebase Console** → Firestore Database → orders collection

### 2. Test Order Retrieval
1. **Go to orders page**
2. **Should see your placed orders**
3. **Orders should show**:
   - Product details
   - Order status
   - Payment method
   - Order date
   - Total amount

### 3. Verify in Firebase Console
1. Go to **Firestore Database**
2. Click on **orders** collection
3. You should see your order documents
4. Each document should have the user ID and order details

## 🔧 Troubleshooting

### Common Issues:
1. **"Permission denied"** - Check Firestore security rules
2. **"No orders found"** - Verify user authentication
3. **"Firestore error"** - Check Firebase configuration
4. **Orders not showing** - Check user ID matching

### Debug Steps:
1. Check browser console for errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Ensure user is authenticated
5. Check Firestore collection in Firebase Console

## 📱 Next Steps
1. Configure Firestore security rules
2. Test order placement and retrieval
3. Deploy with `firebase deploy --only hosting`
4. Monitor orders in Firebase Console
