import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// GET - Get order by slug (assuming order has a slug field)
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    const orderDoc = snapshot.docs[0];
    return NextResponse.json({ 
      success: true, 
      order: { id: orderDoc.id, ...orderDoc.data() } 
    });
  } catch (error) {
    console.error('Error fetching order by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT - Update order by slug
export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const orderData = await request.json();
    
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    const orderDoc = snapshot.docs[0];
    const orderRef = doc(db, 'orders', orderDoc.id);
    
    const updateData = {
      ...orderData,
      updatedAt: new Date()
    };
    
    await updateDoc(orderRef, updateData);
    
    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE - Delete order by slug
export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    const orderDoc = snapshot.docs[0];
    const orderRef = doc(db, 'orders', orderDoc.id);
    
    await deleteDoc(orderRef);
    
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order by slug:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete order' }, { status: 500 });
  }
}
