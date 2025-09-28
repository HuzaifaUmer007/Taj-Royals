import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET - Get subcategory by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const subcategoryRef = doc(db, 'subcategories', id);
    const subcategorySnap = await getDoc(subcategoryRef);
    
    if (!subcategorySnap.exists()) {
      return NextResponse.json({ success: false, message: 'Subcategory not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      subcategory: { id: subcategorySnap.id, ...subcategorySnap.data() } 
    });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch subcategory' }, { status: 500 });
  }
}

// PUT - Update subcategory by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const subcategoryData = await request.json();
    
    const subcategoryRef = doc(db, 'subcategories', id);
    const subcategorySnap = await getDoc(subcategoryRef);
    
    if (!subcategorySnap.exists()) {
      return NextResponse.json({ success: false, message: 'Subcategory not found' }, { status: 404 });
    }
    
    const updateData = {
      ...subcategoryData,
      updatedAt: new Date()
    };
    
    await updateDoc(subcategoryRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Subcategory updated successfully' });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json({ success: false, message: 'Failed to update subcategory' }, { status: 500 });
  }
}

// DELETE - Delete subcategory by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const subcategoryRef = doc(db, 'subcategories', id);
    const subcategorySnap = await getDoc(subcategoryRef);
    
    if (!subcategorySnap.exists()) {
      return NextResponse.json({ success: false, message: 'Subcategory not found' }, { status: 404 });
    }
    
    await deleteDoc(subcategoryRef);
    
    return NextResponse.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete subcategory' }, { status: 500 });
  }
}
