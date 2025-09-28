import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET - Get category by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);
    
    if (!categorySnap.exists()) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      category: { id: categorySnap.id, ...categorySnap.data() } 
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT - Update category by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const categoryData = await request.json();
    
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);
    
    if (!categorySnap.exists()) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    const updateData = {
      ...categoryData,
      updatedAt: new Date()
    };
    
    await updateDoc(categoryRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, message: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Delete category by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const categoryRef = doc(db, 'categories', id);
    const categorySnap = await getDoc(categoryRef);
    
    if (!categorySnap.exists()) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    await deleteDoc(categoryRef);
    
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 });
  }
}
