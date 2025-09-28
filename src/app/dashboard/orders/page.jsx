'use client';
import React, { useState, useEffect } from 'react';
import { FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { getAllOrders, updateOrderStatus } from '@/lib/ordersService';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders from Firestore
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllOrders();
      
      if (response.success) {
        setOrders(response.orders);
      } else {
        // Fallback to localStorage if Firestore fails
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
          const allOrders = JSON.parse(savedOrders);
          setOrders(allOrders);
        } else {
          setOrders([]);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, status: newStatus };
          }
          return order;
        });
        setOrders(updatedOrders);
        alert(`Order status updated to: ${newStatus}`);
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <FaBox className='text-black' />;
      case 'Packing':
        return <FaBox className='text-yellow-600' />;
      case 'Shipped':
        return <FaTruck className='text-orange-600' />;
      case 'Out for deliver':
        return <FaTruck className='text-purple-600' />;
      case 'Delivered':
        return <FaCheckCircle className='text-green-600' />;
      default:
        return <FaBox className='text-black' />;
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-2xl font-semibold text-black'>Orders Management</h3>
        <div className='text-sm text-black'>
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-black'>Loading orders...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <p className='text-red-600 mb-4'>Error loading orders: {error}</p>
            <button
              onClick={fetchOrders}
              className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800'
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && (
        <div className='space-y-4'>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div className='bg-white border border-gray-200 rounded-lg overflow-hidden' key={index}>
                <div className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      {getStatusIcon(order.status)}
                      <div>
                        <h4 className='font-semibold text-lg text-black'>Order #{order.id}</h4>
                        <p className='text-sm text-gray-600'>
                          {new Date(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <select
                      onChange={(e) => statusHandler(e, order.id)}
                      value={order.status}
                      className='px-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white'
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for deliver">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {/* Items */}
                    <div>
                      <h5 className='font-medium mb-2 text-black'>Items:</h5>
                      <div className='space-y-1'>
                        {order.items && order.items.map((item, idx) => (
                          <p key={idx} className='text-sm text-black'>
                            {item.name} × {item.quantity} <span className='text-xs bg-gray-100 px-2 py-1 rounded'>{item.size}</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                      <h5 className='font-medium mb-2 text-black'>Customer:</h5>
                      <p className='font-medium text-black'>{order.address?.firstName} {order.address?.lastName}</p>
                      <p className='text-sm text-gray-600 mt-1'>{order.address?.phone}</p>
                      <p className='text-sm text-gray-600 mt-1'>{order.address?.street}</p>
                      <p className='text-sm text-gray-600'>
                        {order.address?.city}, {order.address?.state} {order.address?.zipcode}
                      </p>
                      <p className='text-sm text-gray-600'>{order.address?.country}</p>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h5 className='font-medium mb-2 text-black'>Order Details:</h5>
                      <div className='space-y-1 text-sm text-black'>
                        <p>Items: {order.items?.length || 0}</p>
                        <p>Method: {order.paymentMethod}</p>
                        <p>Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid'}</p>
                        <p className='font-semibold text-lg text-black mt-2'>${order.amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-20'>
              <p className='text-black text-lg'>No orders found</p>
              <p className='text-gray-500 text-sm mt-2'>Orders will appear here when customers place them</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Order;
