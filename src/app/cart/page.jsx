'use client';
import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '@/context/ShopContext'
import { useAuth } from '@/context/AuthContext'
import Title from '@/components/Title'
import CartTotal from '@/components/CartTotal'
const Cart = () => {
  const { products, currency, cartItems, updateQuantity,navigate } = useContext(ShopContext)
  const { user } = useAuth()
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    console.log('Cart Items in cart page:', cartItems);
    console.log('Products in cart page:', products);
    
    const tempData = [];
    for (const items in cartItems) {
      console.log('Processing cart item in cart page:', items);
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          console.log('Adding to cart data:', { _id: items, size: item, quantity: cartItems[items][item] });
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
    console.log('Final cart data:', tempData);
    setCartData(tempData);
  }, [cartItems,products])
  return (
    <div className='container border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {
          cartData.map((item, index) => {
            const productData = products.find((product) => (
              product?._id === item._id || product?.id === item._id || product?.slug === item._id
            ));
            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData?.image?.[0] || '/assets/placeholder.png'} alt={productData?.name || 'Product'} />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData?.name || 'Product'}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData?.price || 0}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm;w-5 cursor-pointer' src='/assets/bin_icon.png' alt="" />
              </div>
            )
          })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[250px]'>
          <CartTotal />
          <div className=' w-full text-end'>
            <button 
              onClick={() => {
                if (!user) {
                  alert('Please login to proceed to checkout');
                  navigate('/login');
                  return;
                }
                navigate('/place-order');
              }} 
              className='bg-black text-sm text-white px-8 my-8 py-3'
            >
              {user ? 'PROCEED TO CHECKOUT' : 'LOGIN TO CHECKOUT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart