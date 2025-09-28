'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaPlus, FaArrowLeft, FaTag, FaList, FaEdit, FaTrash } from 'react-icons/fa'
import { categoriesAPI, subcategoriesAPI } from '@/lib/api'
import { toast } from 'react-toastify'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('category') // 'category' or 'subcategory'
  const [selectedCategory, setSelectedCategory] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [categoriesResponse, subcategoriesResponse] = await Promise.all([
        categoriesAPI.getAll(),
        subcategoriesAPI.getAll()
      ])
      
      console.log('Categories response:', categoriesResponse)
      console.log('Subcategories response:', subcategoriesResponse)
      
      if (categoriesResponse.success) {
        const categoriesData = categoriesResponse.categories || []
        console.log('Categories data:', categoriesData)
        setCategories(categoriesData)
        if (!activeCategoryId && categoriesData.length > 0) {
          setActiveCategoryId(categoriesData[0].id)
        }
      }
      
      if (subcategoriesResponse.success) {
        const subcategoriesData = subcategoriesResponse.subcategories || []
        console.log('Subcategories data:', subcategoriesData)
        setSubcategories(subcategoriesData)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (e) => {
    const newName = e.target.value
    setFormData({
      name: newName,
      slug: generateSlug(newName)
    })
  }

  const handleSlugChange = (e) => {
    setFormData({
      ...formData,
      slug: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEdit) {
        if (formType === 'category') {
          const response = await categoriesAPI.updateById(editingId, {
            name: formData.name,
            slug: formData.slug
          })
          if (response.success) {
            setCategories(categories.map(cat => cat.id === editingId ? { ...cat, name: formData.name, slug: formData.slug } : cat))
            toast.success('Category updated')
          } else {
            throw new Error('Failed to update category')
          }
        } else {
          const response = await subcategoriesAPI.updateById(editingId, {
            name: formData.name,
            slug: formData.slug,
            categoryId: selectedCategory
          })
          if (response.success) {
            setSubcategories(subcategories.map(sub => sub.id === editingId ? { ...sub, name: formData.name, slug: formData.slug, categoryId: selectedCategory } : sub))
            toast.success('Subcategory updated')
          } else {
            throw new Error('Failed to update subcategory')
          }
        }
      } else {
        if (formType === 'category') {
          const response = await categoriesAPI.create({
            name: formData.name,
            slug: formData.slug
          })
          
          if (response.success) {
            setCategories([...categories, response.category])
            toast.success('Category created')
          } else {
            throw new Error('Failed to create category')
          }
        } else {
          const response = await subcategoriesAPI.create({
            name: formData.name,
            slug: formData.slug,
            categoryId: selectedCategory
          })
          
          if (response.success) {
            setSubcategories([...subcategories, response.subcategory])
            toast.success('Subcategory created')
          } else {
            throw new Error('Failed to create subcategory')
          }
        }
      }

      // Reset form
      setFormData({ name: '', slug: '' })
      setSelectedCategory('')
      setShowForm(false)
      setIsEdit(false)
      setEditingId(null)
    } catch (error) {
      console.error('Error creating item:', error)
      toast.error('Action failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category and all its subcategories?')) {
      try {
        await categoriesAPI.deleteById(categoryId)
        setCategories(categories.filter(cat => cat.id !== categoryId))
        toast.success('Category deleted')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Failed to delete category')
      }
    }
  }

  const deleteSubcategory = async (subcategoryId) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await subcategoriesAPI.deleteById(subcategoryId)
        setSubcategories(subcategories.filter(sub => sub.id !== subcategoryId))
        toast.success('Subcategory deleted')
      } catch (error) {
        console.error('Error deleting subcategory:', error)
        toast.error('Failed to delete subcategory')
      }
    }
  }

  const openForm = (type) => {
    setFormType(type)
    setShowForm(true)
    setFormData({ name: '', slug: '' })
    setSelectedCategory(type === 'subcategory' ? (activeCategoryId || '') : '')
    setIsEdit(false)
    setEditingId(null)
  }

  const openEditCategory = (category) => {
    setFormType('category')
    setIsEdit(true)
    setEditingId(category.id)
    setFormData({ name: category.name || '', slug: category.slug || '' })
    setSelectedCategory('')
    setShowForm(true)
  }

  const openEditSubcategory = (subcategory) => {
    setFormType('subcategory')
    setIsEdit(true)
    setEditingId(subcategory.id)
    setFormData({ name: subcategory.name || '', slug: subcategory.slug || '' })
    setSelectedCategory(subcategory.categoryId || '')
    setShowForm(true)
  }

  const activeCategory = categories.find(cat => cat && cat.id === activeCategoryId)
  const activeSubcategories = (subcategories || []).filter(sub => sub && sub.categoryId === activeCategoryId)

  return (
    <div className='max-w-6xl mx-auto p-6'>
      {/* Two-column Layout */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left: Categories list */}
        <aside className='md:col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden'>
          <div className='p-4 flex items-center justify-between border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-black'>Categories</h3>
            <button
              onClick={() => openForm('category')}
              className='bg-black text-white px-3 py-2 rounded hover:bg-gray-800 flex items-center gap-2'
            >
              <FaPlus className='w-4 h-4' />
              New
            </button>
          </div>
          <div className='divide-y'>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${cat.id === activeCategoryId ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{cat.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${cat.id === activeCategoryId ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>/{cat.slug}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className='p-4 text-gray-500'>No categories</div>
            )}
          </div>
        </aside>

        {/* Right: Selected category details */}
        <section className='md:col-span-2 bg-white border border-gray-200 rounded-lg p-6'>
          {activeCategory ? (
            <>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h2 className='text-2xl font-semibold text-black'>{activeCategory.name}</h2>
                  <p className='text-sm text-gray-600'>/{activeCategory.slug}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => openForm('subcategory')}
                    className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center gap-2'
                  >
                    <FaPlus className='w-4 h-4' />
                    Add Subcategory
                  </button>
                  <button
                    onClick={() => openEditCategory(activeCategory)}
                    className='px-4 py-2 border border-gray-300 text-black rounded hover:bg-gray-50'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(activeCategory.id)}
                    className='px-4 py-2 border border-gray-300 text-black rounded hover:bg-gray-50'
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h4 className='text-lg font-medium text-black mb-4 flex items-center gap-2'>
                <FaList className='w-4 h-4' />
                Subcategories ({activeSubcategories.length})
              </h4>

              {activeSubcategories.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {activeSubcategories.map((subcategory) => (
                    <div key={subcategory.id} className='bg-gray-50 rounded-lg p-4 flex items-center justify-between'>
                      <div>
                        <p className='font-medium text-black'>{subcategory.name}</p>
                        <p className='text-sm text-gray-500'>/{subcategory.slug}</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <button className='p-1 text-black hover:bg-gray-200 rounded' onClick={() => openEditSubcategory(subcategory)}>
                          <FaEdit className='w-3 h-3' />
                        </button>
                        <button 
                          onClick={() => deleteSubcategory(subcategory.id)}
                          className='p-1 text-red-600 hover:bg-red-100 rounded'
                        >
                          <FaTrash className='w-3 h-3' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-black italic'>No subcategories yet</p>
              )}
            </>
          ) : (
            <div className='text-gray-600'>Select a category to view details</div>
          )}
        </section>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-black'>Loading categories...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <p className='text-red-600 mb-4'>Error loading categories: {error}</p>
            <button
              onClick={fetchData}
              className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800'
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty state if no categories after loading */}
      {!loading && !error && (!categories || categories.length === 0) && (
        <div className='text-center py-20'>
          <p className='text-black text-lg'>No categories found</p>
          <p className='text-gray-500 text-sm mt-2'>Create your first category to get started</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <h2 className='text-2xl font-bold text-black mb-6'>
              {isEdit ? 'Update ' : 'Add '}{formType === 'category' ? 'Category' : 'Subcategory'}
            </h2>
            
            <form onSubmit={handleSubmit} className='space-y-4'>
              {formType === 'subcategory' && (
                <div>
                  <label className='block text-sm font-medium text-black mb-2'>
                    Parent Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                    required
                  >
                    <option value=''>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-black mb-2'>
                  {formType === 'category' ? 'Category' : 'Subcategory'} Name
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={handleNameChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder={`Enter ${formType} name`}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black mb-2'>
                  Slug
                </label>
                <input
                  type='text'
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder={`${formType}-slug`}
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>Auto-generated from name</p>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                </button>
                <button
                  type='button'
                  onClick={() => { setShowForm(false); setIsEdit(false); setEditingId(null); }}
                  className='px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
