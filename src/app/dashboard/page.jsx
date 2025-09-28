import React from 'react'
import Link from 'next/link'
import { FaShoppingBag, FaClipboardList, FaTag, FaPlus } from 'react-icons/fa'

const page = () => {
  return (
    <div className='min-h-[100vh] bg-white'>
      <div className='max-w-screen-md mx-auto px-4 py-8'>
        <h1 className='text-2xl font-semibold text-black mb-6'>Dashboard</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          <Link href='/dashboard/products/create' className='inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded hover:bg-gray-800'>
            <FaPlus className='w-4 h-4' />
            Add Product
          </Link>
          <Link href='/dashboard/categories' className='inline-flex items-center justify-center gap-2 border border-gray-200 px-4 py-3 rounded text-black hover:bg-gray-50'>
            <FaTag className='w-4 h-4' />
            Categories
          </Link>
          <Link href='/dashboard/orders' className='inline-flex items-center justify-center gap-2 border border-gray-200 px-4 py-3 rounded text-black hover:bg-gray-50'>
            <FaClipboardList className='w-4 h-4' />
            Orders
          </Link>
        </div>
      </div>
    </div>
  )
}

export default page