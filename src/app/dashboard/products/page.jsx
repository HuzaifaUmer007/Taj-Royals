'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa'
import { productsAPI } from '@/lib/api'
import { toast } from 'react-toastify'
import ProductForm from '@/components/ProductForm'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null)

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await productsAPI.getAll()
      if (response.success) {
        setList(response.products)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const removeProduct = async (id) => {
    if (confirm('Are you sure you want to remove this product?')) {
      try {
        await productsAPI.deleteById(id)
        setList(list.filter(item => item.id !== id))
        toast.success('Product removed')
      } catch (error) {
        console.error('Error removing product:', error)
        toast.error('Failed to remove product')
      }
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setModalMode('edit')
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmitSuccess = async () => {
    await fetchProducts()
    setIsModalOpen(false)
  }
  return (
    <>
      <div className='mb-4'>
        <div className='flex justify-end'>
          <Link 
            href='/dashboard/products/create'
            className="inline-flex items-center justify-end bg-black text-white px-4 py-2 rounded hover:bg-gray-800 gap-2"
          >
            <FaPlus className='w-4 h-4' />
            Add Product
          </Link>
        </div>

        {/* Right: Products list */}
        <section className='md:col-span-2'>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-2xl font-semibold text-black'>All Products</p>
          </div>
      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-black'>Loading products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <p className='text-red-600 mb-4'>Error loading products: {error}</p>
            <button
              onClick={fetchProducts}
              className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800'
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      {!loading && !error && (
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border-b bg-gray-50 text-sm font-medium'>
            <span className='text-black'>Image</span>
            <span className='text-black'>Name</span>
            <span className='text-black'>Category</span>
            <span className='text-black'>Price</span>
            <span className='text-center text-black'>Actions</span>
          </div>
          {list.length > 0 ? (
            list.map((item, index) => (
              <div className='grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-4 px-4 border-b text-sm hover:bg-gray-50' key={index}>
                <div className='flex justify-center md:justify-start'>
                  <img className='w-16 h-16 object-cover rounded' src={item.image?.[0] || '/assets/placeholder.png'} alt={item.name} />
                </div>
                <div className='md:hidden'>
                  <p className='font-medium text-lg text-black'>{item.name}</p>
                  <div className='flex justify-between items-center mt-2'>
                    <p className='text-gray-600'>{item.category}</p>
                    <p className='font-semibold text-black'>${item.price}</p>
                  </div>
                </div>
                <p className='hidden md:block text-black'>{item.name}</p>
                <p className='hidden md:block text-gray-600'>{item.category}</p>
                <p className='hidden md:block font-semibold text-black'>${item.price}</p>
                <div className='flex justify-center md:justify-end gap-2'>
                  <button className='p-2 text-black hover:bg-gray-100 rounded' onClick={() => openEditModal(item)}>
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => removeProduct(item.id)}
                    className='p-2 text-red-600 hover:bg-red-50 rounded'
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-20'>
              <p className='text-black text-lg'>No products found</p>
              <p className='text-gray-500 text-sm mt-2'>Create your first product to get started</p>
            </div>
          )}
        </div>
      )}
        </section>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white w-full max-w-3xl mx-4 rounded-lg shadow-lg max-h-screen h-[90vh] flex flex-col'>
            <div className='flex items-center justify-between px-4 py-3 border-b'>
              <p className='font-semibold text-black'>{modalMode === 'edit' ? 'Edit Product' : 'Add Product'}</p>
              <button onClick={closeModal} className='px-3 py-1 border border-gray-300 rounded hover:bg-gray-50'>Close</button>
            </div>
            <div className='p-4 flex-1 overflow-y-auto'>
              <ProductForm
                mode={modalMode}
                initialProduct={editingProduct}
                onCancel={closeModal}
                onSuccess={handleSubmitSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List