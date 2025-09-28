import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// GET - Get subcategory by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const subcategoriesRef = collection(db, 'subcategories');
    const q = query(subcategoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Subcategory not found' }, { status: 404 });
    }
    
    const subcategoryDoc = snapshot.docs[0];
    return NextResponse.json({ 
      success: true, 
      subcategory: { id: subcategoryDoc.id, ...subcategoryDoc.data() } 
    });
  } catch (error) {
    console.error('Error fetching subcategory by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch subcategory' }, { status: 500 });
  }
}

// PUT - Update subcategory by slug
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const subcategoryData = await request.json();
    
    const subcategoriesRef = collection(db, 'subcategories');
    const q = query(subcategoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Subcategory not found' }, { status: 404 });
    }
    
    const subcategoryDoc = snapshot.docs[0];
    const subcategoryRef = doc(db, 'subcategories', subcategoryDoc.id);
    
    const updateData = {
      ...subcategoryData,
      updatedAt: new Date()
    };
    
    await updateDoc(subcategoryRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Subcategory updated successfully' });
  } catch (error) {
    console.error('Error updating subcategory by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to update subcategory' }, { status: 500 });
  }
}

// DELETE - Delete subcategory by slug
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    const subcategoriesRef = collection(db, 'subcategories');
    const q = query(subcategoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Subcategory not found' }, { status: 404 });
    }
    
    const subcategoryDoc = snapshot.docs[0];
    const subcategoryRef = doc(db, 'subcategories', subcategoryDoc.id);
    
    await deleteDoc(subcategoryRef);
    
    return NextResponse.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete subcategory' }, { status: 500 });
  }
}
