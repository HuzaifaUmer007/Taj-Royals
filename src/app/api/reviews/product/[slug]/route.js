import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// GET - Get reviews by product slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // First get the product to get its ID
    const productsRef = collection(db, 'products');
    const productQuery = query(productsRef, where('slug', '==', slug));
    const productSnapshot = await getDocs(productQuery);
    
    if (productSnapshot.empty) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    const productId = productSnapshot.docs[0].id;
    
    // Get reviews for this product
    const reviewsRef = collection(db, 'reviews');
    const reviewsQuery = query(reviewsRef, where('productId', '==', productId));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    const reviews = [];
    reviewsSnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews by product slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST - Create review for product by slug
export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const reviewData = await request.json();
    
    // First get the product to get its ID
    const productsRef = collection(db, 'products');
    const productQuery = query(productsRef, where('slug', '==', slug));
    const productSnapshot = await getDocs(productQuery);
    
    if (productSnapshot.empty) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    const productId = productSnapshot.docs[0].id;
    
    // Add product info to review
    const newReview = {
      ...reviewData,
      productId,
      productSlug: slug,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'reviews'), newReview);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review created successfully',
      reviewId: docRef.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review for product:', error);
    return NextResponse.json({ success: false, message: 'Failed to create review' }, { status: 500 });
  }
}
