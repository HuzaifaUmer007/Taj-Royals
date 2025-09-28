import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

// GET - Get all subcategories
export async function GET() {
  try {
    const subcategoriesRef = collection(db, 'subcategories');
    const snapshot = await getDocs(subcategoriesRef);
    
    const subcategories = [];
    snapshot.forEach((doc) => {
      subcategories.push({ id: doc.id, ...doc.data() });
    });
    
    return NextResponse.json({ success: true, subcategories });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch subcategories' }, { status: 500 });
  }
}

// POST - Create new subcategory
export async function POST(request) {
  try {
    const subcategoryData = await request.json();
    
    // Add timestamps
    const newSubcategory = {
      ...subcategoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'subcategories'), newSubcategory);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subcategory created successfully',
      subcategoryId: docRef.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json({ success: false, message: 'Failed to create subcategory' }, { status: 500 });
  }
}
