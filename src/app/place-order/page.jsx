'use client';
import React, { useContext, useState } from 'react'
import Title from '@/components/Title'
import CartTotal from '@/components/CartTotal'
import { ShopContext } from '@/context/ShopContext'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { saveOrder } from '@/lib/ordersService'
import axios from 'axios'
const PlaceOrder = () => {
  const {navigate,backendUrl,cartItems,getCartAmount,clearCart,delivery_fee,products} =useContext(ShopContext);
  const { user } = useAuth();

  const [method, setMethod] = useState('cod');
  const [formData,setFormData]=useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })

  const onChangeHandler=(e)=>{
const name=e.target.name;
const value=e.target.value;

setFormData(data=>({...data,[name]:value}))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
        alert('Please login to place an order');
        navigate('/login');
        return;
    }

    // Check if cart is empty
    if (getCartAmount() === 0) {
        alert('Your cart is empty');
        return;
    }

    try {
        console.log('Cart Items:', cartItems);
        console.log('Products:', products);
        
        let orderItems = [];
        for (const items in cartItems) {
            console.log('Processing cart item:', items);
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    console.log('Looking for product with ID:', items);
                    const itemInfo = structuredClone(products.find(product => 
                        product._id === items || product.id === items || product.slug === items
                    ));
                    console.log('Found product:', itemInfo);
                    if (itemInfo) {
                        itemInfo.size = item;
                        itemInfo.quantity = cartItems[items][item];
                        orderItems.push(itemInfo);
                        console.log('Added to order items:', itemInfo);
                    } else {
                        console.log('Product not found for ID:', items);
                    }
                }
            }
        }
        
        console.log('Final order items:', orderItems);

        // If no items found, try alternative approach
        if (orderItems.length === 0) {
          console.log('No items found, trying alternative approach...');
          // Create a simple order item with cart data
          for (const itemId in cartItems) {
            const sizeMap = cartItems[itemId];
            if (sizeMap && typeof sizeMap === 'object') {
              for (const size in sizeMap) {
                if (sizeMap[size] > 0) {
                  orderItems.push({
                    _id: itemId,
                    name: `Product ${itemId}`,
                    price: 0, // Will be calculated from cart amount
                    size: size,
                    quantity: sizeMap[size],
                    image: ['/assets/placeholder.png']
                  });
                }
              }
            }
          }
          console.log('Alternative order items:', orderItems);
        }

        let orderData= {
          address:formData,
          items:orderItems,
          amount:getCartAmount()+delivery_fee
        }

        switch(method){
          case"cod":
          try {
            // For now, we'll use a placeholder token since we're using Firebase Auth
            // In a real implementation, you'd get the Firebase ID token
            const res=await axios.post(backendUrl+'/api/order/place',orderData, {headers:{token: user.uid || 'firebase-user'}})
            if(res.data.success){
              clearCart();
              navigate('/orders')
            }else{
              alert(res.data.message || 'Failed to place order')
            }
          } catch (apiError) {
            // If backend is not available, save to Firestore
            console.log('Backend not available, saving to Firestore:', apiError.message);
            
            // Prepare order data for Firestore
            const orderData = {
              items: orderItems,
              address: formData,
              amount: getCartAmount() + delivery_fee,
              paymentMethod: method,
              status: 'Processing',
              user: user.uid,
              userEmail: user.email
            };
            
            // Save to Firestore
            const result = await saveOrder(orderData);
            
            if (result.success) {
              alert('Order placed successfully! (Saved to Firestore)');
              clearCart();
              navigate('/orders');
            } else {
              alert('Failed to save order. Please try again.');
              console.error('Firestore save error:', result.error);
            }
          }
          break;
          default:
            break;

        }

    } catch (error) {
        console.error('Error in onSubmitHandler:', error);
        alert('An error occurred while placing the order. Please try again.');
    }
};

  return (
    <ProtectedRoute>
    <form  onSubmit={onSubmitHandler} className='container flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVER'} text2={'INFORMATION'} />

        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="text" placeholder='First Name' value={formData.firstName} name="firstName" id="" required/>
          <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="text" placeholder='Last Name'value={formData.lastName} name="lastName" id="" required/>
        </div>
        <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="email" placeholder='Last Name'value={formData.email} name="email" id="" required/>
        <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="text" placeholder='Street'value={formData.street} name="street" id="" required/>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="text" placeholder='City' value={ formData.city} name="city" id=""required />
          <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="text" placeholder='State' value={ formData.state} name="state" id="" required />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="number" placeholder='Zip Code' value={formData.zipcode} name="zipcode" id="" />
          <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="text" placeholder='Country' value={ formData.country}  name="country" id="" required/>
        </div>
        <input onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' type="number" placeholder='Phone Number'value={formData.phone} name="phone" id="" required />

      </div>
      {/* rightside */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* payment method Selection  */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            {/* <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img src='/assets/stripe_logo.png' alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                  <img src='/assets/razorpay_logo.png' alt="" />
            </div> */}
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4  '>Cash on Delivery</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
              <button type='submit'  className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
    </ProtectedRoute>
  )
}

export default PlaceOrder