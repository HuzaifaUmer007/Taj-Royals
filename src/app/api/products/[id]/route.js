import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET - Get product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      product: { id: productSnap.id, ...productSnap.data() } 
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update product by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const productData = await request.json();
    
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    const updateData = {
      ...productData,
      updatedAt: new Date()
    };
    
    await updateDoc(productRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    await deleteDoc(productRef);
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
}
