import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// GET - Get category by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    const categoryDoc = snapshot.docs[0];
    return NextResponse.json({ 
      success: true, 
      category: { id: categoryDoc.id, ...categoryDoc.data() } 
    });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT - Update category by slug
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const categoryData = await request.json();
    
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    const categoryDoc = snapshot.docs[0];
    const categoryRef = doc(db, 'categories', categoryDoc.id);
    
    const updateData = {
      ...categoryData,
      updatedAt: new Date()
    };
    
    await updateDoc(categoryRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Delete category by slug
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    
    const categoryDoc = snapshot.docs[0];
    const categoryRef = doc(db, 'categories', categoryDoc.id);
    
    await deleteDoc(categoryRef);
    
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 });
  }
}
