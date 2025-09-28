'use client';
import React from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

const CreateProductPage = () => {
  const router = useRouter()

  return (
    <div className=' bg-white '>
      <div className=' px-4 py-4'>
        <h1 className='text-2xl font-semibold text-black mb-4'>Add Product</h1>
        <ProductForm
          mode='create'
          onCancel={() => router.push('/dashboard/products')}
          onSuccess={() => router.push('/dashboard/products')}
        />
      </div>
    </div>
  )
}

export default CreateProductPage


