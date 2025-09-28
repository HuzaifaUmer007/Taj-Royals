import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET - Get review by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const reviewRef = doc(db, 'reviews', id);
    const reviewSnap = await getDoc(reviewRef);
    
    if (!reviewSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      review: { id: reviewSnap.id, ...reviewSnap.data() } 
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch review' }, { status: 500 });
  }
}

// PUT - Update review by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const reviewData = await request.json();
    
    const reviewRef = doc(db, 'reviews', id);
    const reviewSnap = await getDoc(reviewRef);
    
    if (!reviewSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }
    
    const updateData = {
      ...reviewData,
      updatedAt: new Date()
    };
    
    await updateDoc(reviewRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, message: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE - Delete review by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const reviewRef = doc(db, 'reviews', id);
    const reviewSnap = await getDoc(reviewRef);
    
    if (!reviewSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }
    
    await deleteDoc(reviewRef);
    
    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 });
  }
}
