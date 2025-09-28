import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// GET - Get order by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      order: { id: orderSnap.id, ...orderSnap.data() } 
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT - Update order by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const orderData = await request.json();
    
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    const updateData = {
      ...orderData,
      updatedAt: new Date()
    };
    
    await updateDoc(orderRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE - Delete order by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    await deleteDoc(orderRef);
    
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete order' }, { status: 500 });
  }
}
