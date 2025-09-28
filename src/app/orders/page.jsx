'use client';
import React, { useContext, useEffect, useState } from 'react'
import Title from '@/components/Title'
import { ShopContext } from '@/context/ShopContext'
import { useAuth } from '@/context/AuthContext'
import { getUserOrders, getAllOrders } from '@/lib/ordersService'
import axios from 'axios'
const Orders = () => {
  const { backendUrl, currency } = useContext(ShopContext)
  const { user } = useAuth()
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)
  
  const loadOrderData = async () => {
    setLoading(true);
    try {
      if (!user) {
        setLoading(false);
        return null;
      }

      // Try to load from backend first
      try {
        const res = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token: user.uid || 'firebase-user' } })
        if (res.data.success) {
          let allOrderItems = [];
          res.data.orders.map((order) => {
            order.items.map((item) => {
              item['status'] = order.status
              item['payment'] = order.payment
              item['paymentMethod'] = order.paymentMethod
              item['date'] = order.date
              allOrderItems.push(item)
            })
          })
          setOrderData(allOrderItems.reverse())
          return;
        }
      } catch (apiError) {
        console.log('Backend not available, loading from Firestore:', apiError.message);
      }

      // Fallback: Load from Firestore
      try {
        const result = await getUserOrders(user.email);
        
        if (result.success && result.orders.length > 0) {
          // Convert to the format expected by the UI
          let allOrderItems = [];
          result.orders.forEach(order => {
            order.items.forEach(item => {
              allOrderItems.push({
                ...item,
                status: order.status,
                payment: order.amount,
                paymentMethod: order.paymentMethod,
                date: order.createdAt?.toDate ? order.createdAt.toDate().toISOString() : order.createdAt
              });
            });
          });
          
          setOrderData(allOrderItems);
        } else {
          // Try getting all orders and filtering client-side by email
          try {
            const allOrdersResult = await getAllOrders();
            if (allOrdersResult.success) {
              const userOrders = allOrdersResult.orders.filter(order => 
                order.userEmail === user.email
              );
              
              if (userOrders.length > 0) {
                let allOrderItems = [];
                userOrders.forEach(order => {
                  order.items.forEach(item => {
                    allOrderItems.push({
                      ...item,
                      status: order.status,
                      payment: order.amount,
                      paymentMethod: order.paymentMethod,
                      date: order.createdAt?.toDate ? order.createdAt.toDate().toISOString() : order.createdAt
                    });
                  });
                });
                setOrderData(allOrderItems);
              } else {
                setOrderData([]);
              }
            } else {
              setOrderData([]);
            }
          } catch (allOrdersError) {
            console.error('Error getting all orders:', allOrdersError);
            setOrderData([]);
          }
        }
      } catch (firestoreError) {
        console.error('Error loading from Firestore:', firestoreError);
        
        // Final fallback: Load from localStorage
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
          try {
            const orders = JSON.parse(savedOrders);
            const userOrders = orders.filter(order => order.userEmail === user.email);
            
            let allOrderItems = [];
            userOrders.forEach(order => {
              order.items.forEach(item => {
                allOrderItems.push({
                  ...item,
                  status: order.status,
                  payment: order.amount,
                  paymentMethod: order.paymentMethod,
                  date: order.date
                });
              });
            });
            
            setOrderData(allOrderItems.reverse());
          } catch (error) {
            console.error('Error parsing saved orders:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadOrderData()
  }, [user])
  return (
    <div className='container border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-black'>Loading your orders...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && orderData.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-black text-lg'>No orders found</p>
          <p className='text-gray-500 text-sm mt-2'>Your orders will appear here when you place them</p>
        </div>
      )}

      {/* Orders List */}
      {!loading && orderData.length > 0 && (
        <div>
          {
            orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image?.[0] || '/assets/placeholder.png'} alt={item.name || 'Product'} />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 textbase-text-gray-700'>
                    <p className='text-lg'>{currency}{item.price}</p>
                    <p>Quantity:{item.quantity}</p>
                    <p>Size:{item.size}</p>

                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'> {new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment Method: <span className='text-gray-400'> {item.paymentMethod}</span></p>

                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>

                </div>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm '>Track Order</button>
              </div>
            </div>
          )
          )
        }
        </div>
      )}
    </div>
  )
}

export default Orders