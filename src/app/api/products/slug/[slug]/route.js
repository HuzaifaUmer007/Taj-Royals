import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// GET - Get product by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    const productDoc = snapshot.docs[0];
    return NextResponse.json({ 
      success: true, 
      product: { id: productDoc.id, ...productDoc.data() } 
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update product by slug
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const productData = await request.json();
    
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    const productDoc = snapshot.docs[0];
    const productRef = doc(db, 'products', productDoc.id);
    
    const updateData = {
      ...productData,
      updatedAt: new Date()
    };
    
    await updateDoc(productRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product by slug
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    const productDoc = snapshot.docs[0];
    const productRef = doc(db, 'products', productDoc.id);
    
    await deleteDoc(productRef);
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
}
