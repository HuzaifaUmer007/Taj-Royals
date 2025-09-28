# Taj Royals API Documentation

This Next.js application includes a comprehensive API built with Next.js API routes and Firebase Firestore integration.

## Features

- 🔥 **Firebase Firestore Integration** - NoSQL database with real-time capabilities
- 📦 **Product Management** - Full CRUD operations with slug-based routing
- 🏷️ **Category & Subcategory Management** - Hierarchical category system
- ⭐ **Review System** - Product reviews with statistics
- 🛒 **Order Management** - Complete order lifecycle
- 🚀 **Next.js API Routes** - Serverless API endpoints
- 🔍 **Slug-based Operations** - SEO-friendly URLs

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `POST` | `/api/products` | Create new product |
| `GET` | `/api/products/[id]` | Get product by ID |
| `PUT` | `/api/products/[id]` | Update product by ID |
| `DELETE` | `/api/products/[id]` | Delete product by ID |
| `GET` | `/api/products/slug/[slug]` | Get product by slug |
| `PUT` | `/api/products/slug/[slug]` | Update product by slug |
| `DELETE` | `/api/products/slug/[slug]` | Delete product by slug |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | Get all categories |
| `POST` | `/api/categories` | Create new category |
| `GET` | `/api/categories/[id]` | Get category by ID |
| `PUT` | `/api/categories/[id]` | Update category by ID |
| `DELETE` | `/api/categories/[id]` | Delete category by ID |
| `GET` | `/api/categories/slug/[slug]` | Get category by slug |
| `PUT` | `/api/categories/slug/[slug]` | Update category by slug |
| `DELETE` | `/api/categories/slug/[slug]` | Delete category by slug |

### Subcategories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subcategories` | Get all subcategories |
| `POST` | `/api/subcategories` | Create new subcategory |
| `GET` | `/api/subcategories/[id]` | Get subcategory by ID |
| `PUT` | `/api/subcategories/[id]` | Update subcategory by ID |
| `DELETE` | `/api/subcategories/[id]` | Delete subcategory by ID |
| `GET` | `/api/subcategories/slug/[slug]` | Get subcategory by slug |
| `PUT` | `/api/subcategories/slug/[slug]` | Update subcategory by slug |
| `DELETE` | `/api/subcategories/slug/[slug]` | Delete subcategory by slug |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews` | Get all reviews |
| `POST` | `/api/reviews` | Create new review |
| `GET` | `/api/reviews/[id]` | Get review by ID |
| `PUT` | `/api/reviews/[id]` | Update review by ID |
| `DELETE` | `/api/reviews/[id]` | Delete review by ID |
| `GET` | `/api/reviews/product/[slug]` | Get reviews by product slug |
| `POST` | `/api/reviews/product/[slug]` | Create review for product |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get all orders |
| `POST` | `/api/orders` | Create new order |
| `GET` | `/api/orders/[id]` | Get order by ID |
| `PUT` | `/api/orders/[id]` | Update order by ID |
| `DELETE` | `/api/orders/[id]` | Delete order by ID |
| `GET` | `/api/orders/slug/[slug]` | Get order by slug |
| `PUT` | `/api/orders/slug/[slug]` | Update order by slug |
| `DELETE` | `/api/orders/slug/[slug]` | Delete order by slug |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | API health status |

## Database Schema

### Products Collection
```javascript
{
  name: string,
  slug: string,
  price: number,
  image: array,
  category: string,
  subCategory: string,
  sizes: array,
  bestSeller: boolean,
  description: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Categories Collection
```javascript
{
  name: string,
  slug: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Subcategories Collection
```javascript
{
  name: string,
  slug: string,
  categoryId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Reviews Collection
```javascript
{
  productId: string,
  productSlug: string,
  name: string,
  email: string,
  rating: number,
  title: string,
  comment: string,
  size: string,
  color: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Orders Collection
```javascript
{
  userId: string,
  address: object,
  items: array,
  amount: number,
  status: string,
  paymentMethod: string,
  slug: string, // Optional for slug-based operations
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install firebase
   ```

2. **Firebase Configuration**
   Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2025, 10, 21);
       }
     }
   }
   ```

## Usage Examples

### Get All Products
```javascript
const response = await fetch('/api/products');
const data = await response.json();
console.log(data.products);
```

### Get Product by Slug
```javascript
const response = await fetch('/api/products/slug/casual-t-shirt');
const data = await response.json();
console.log(data.product);
```

### Create New Product
```javascript
const productData = {
  name: 'New T-Shirt',
  slug: 'new-t-shirt',
  price: 29.99,
  category: 'Men',
  subCategory: 'Casual',
  description: 'A comfortable t-shirt',
  sizes: ['S', 'M', 'L', 'XL'],
  image: ['/images/tshirt1.jpg', '/images/tshirt2.jpg']
};

const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(productData)
});
```

### Create Review for Product
```javascript
const reviewData = {
  name: 'John Doe',
  email: 'john@example.com',
  rating: 5,
  title: 'Great product!',
  comment: 'Love this t-shirt, great quality!',
  size: 'M',
  color: 'Blue'
};

const response = await fetch('/api/reviews/product/casual-t-shirt', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(reviewData)
});
```

## Error Handling

All API endpoints return consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description"
}
```

## Response Format

All successful responses follow this format:

```javascript
{
  "success": true,
  "message": "Operation successful", // For POST/PUT/DELETE
  "data": { ... } // For GET requests
}
```

## Development

The API is built using Next.js API routes, which means:

- Each API endpoint is a separate file in the `src/app/api/` directory
- Routes are automatically generated based on the file structure
- No additional server setup required
- Automatic TypeScript support
- Built-in error handling

## Deployment

This API will work with any Next.js deployment platform:

- **Vercel** (Recommended)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Heroku**

The Firestore database will work seamlessly with any deployment platform.

## Security

- All endpoints are publicly accessible (as per your Firestore rules)
- Consider implementing authentication middleware for production
- Add input validation and sanitization
- Implement rate limiting for production use

## Support

For questions or issues, please check the Next.js documentation or Firebase Firestore documentation.
