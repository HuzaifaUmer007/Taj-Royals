'use client';
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FaUpload, FaPlus, FaLink } from 'react-icons/fa'
import { productsAPI, categoriesAPI, subcategoriesAPI } from '@/lib/api'
import { toast } from 'react-toastify'
import { storage } from '@/lib/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function ProductForm({
  mode = 'create',
  initialProduct = null,
  onCancel,
  onSuccess
}) {
  const [image1, Setimage1] = useState(false)
  const [image2, Setimage2] = useState(false)
  const [image3, Setimage3] = useState(false)
  const [image4, Setimage4] = useState(false)
  const [imageAlt1, setImageAlt1] = useState(initialProduct?.imageAlts?.[0] || '')
  const [imageAlt2, setImageAlt2] = useState(initialProduct?.imageAlts?.[1] || '')
  const [imageAlt3, setImageAlt3] = useState(initialProduct?.imageAlts?.[2] || '')
  const [imageAlt4, setImageAlt4] = useState(initialProduct?.imageAlts?.[3] || '')
  const [name, setName] = useState(initialProduct?.name || '')
  const [slug, setSlug] = useState(initialProduct?.slug || '')
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [category, setCategory] = useState(initialProduct?.category || '')
  const [subCategory, setSubCategory] = useState(initialProduct?.subCategory || '')
  const [price, setPrice] = useState(initialProduct?.price?.toString?.() || '')
  const [bestSeller, setBestSeller] = useState(!!initialProduct?.bestSeller)
  const [latestCollection, setLatestCollection] = useState(!!initialProduct?.latestCollection)
  const [sizes, setSizes] = useState(Array.isArray(initialProduct?.sizes) ? initialProduct.sizes : [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [metaTitle, setMetaTitle] = useState(initialProduct?.metaTitle || '')
  const [metaDescription, setMetaDescription] = useState(initialProduct?.metaDescription || '')
  const [metaKeywords, setMetaKeywords] = useState(initialProduct?.metaKeywords || '')
  const [faqs, setFaqs] = useState(Array.isArray(initialProduct?.faqs) ? initialProduct.faqs : [])

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState(null)

  // Auto-generate slug from name
  const generateSlug = (productName) => {
    return productName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (e) => {
    const newName = e.target.value
    setName(newName)
    setSlug(generateSlug(newName))
  }

  // Prefill selects mapping names->ids
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setDataLoading(true)
      setDataError(null)
      try {
        const [catsRes, subsRes] = await Promise.all([
          categoriesAPI.getAll(),
          subcategoriesAPI.getAll()
        ])
        const cats = catsRes?.categories || []
        const subs = subsRes?.subcategories || []
        if (!mounted) return
        setCategories(cats)
        setSubcategories(subs)

        if (mode === 'edit' && initialProduct) {
          const cat = cats.find(c => c.name === initialProduct.category)
          if (cat) setSelectedCategoryId(cat.id)
          const sub = subs.find(s => s.name === initialProduct.subCategory)
          if (sub) setSelectedSubCategoryId(sub.id)
        } else {
          if (cats.length > 0) {
            setSelectedCategoryId(cats[0].id)
            setCategory(cats[0].name)
            const subsOf = subs.filter(s => s && s.categoryId === cats[0].id)
            if (subsOf.length > 0) {
              setSelectedSubCategoryId(subsOf[0].id)
              setSubCategory(subsOf[0].name)
            }
          }
        }
      } catch (err) {
        if (!mounted) return
        setDataError(err?.message || 'Failed to load data')
      } finally {
        if (mounted) setDataLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [mode, initialProduct])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // 1) Upload images to Firebase Storage and collect permanent URLs
      const imageFiles = [image1, image2, image3, image4]
      const uploadedUrls = []
      const baseSlug = (slug || name || 'product').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      for (let index = 0; index < imageFiles.length; index++) {
        const file = imageFiles[index]
        if (file) {
          const fileExt = (file.name && file.name.split('.').pop()) || 'png'
          const path = `products/${baseSlug}/${Date.now()}_${index + 1}.${fileExt}`
          const fileRef = storageRef(storage, path)
          await uploadBytes(fileRef, file)
          const url = await getDownloadURL(fileRef)
          uploadedUrls.push(url)
        } else if (mode === 'edit' && Array.isArray(initialProduct?.image) && initialProduct.image[index]) {
          // keep existing image if not replaced in edit mode
          uploadedUrls.push(initialProduct.image[index])
        }
      }

      // Ensure at least one image placeholder if none uploaded
      if (uploadedUrls.length === 0) {
        uploadedUrls.push('/assets/placeholder.png')
      }

      const productData = {
        name,
        slug,
        description,
        category: category.toLowerCase(),
        subCategory: subCategory.toLowerCase(),
        price: parseFloat(price),
        sizes,
        bestSeller,
        latestCollection,
        metaTitle,
        metaDescription,
        metaKeywords,
        faqs,
        image: uploadedUrls.filter(Boolean),
        imageAlts: uploadedUrls.map((_, i) => {
          const alts = [imageAlt1, imageAlt2, imageAlt3, imageAlt4]
          return (alts[i] || '').trim()
        })
      }

      let response
      if (mode === 'edit' && initialProduct?.id) {
        response = await productsAPI.updateById(initialProduct.id, productData)
      } else {
        response = await productsAPI.create(productData)
      }

      if (response.success) {
        toast.success(mode === 'edit' ? 'Product updated' : 'Product created')
        onSuccess && onSuccess(response.product || response)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  // TinyMCE editor (dynamic import to avoid SSR)
  const TinyMCEEditor = dynamic(
    () => import('@tinymce/tinymce-react').then((m) => m.Editor),
    { ssr: false, loading: () => null }
  )

  return (
    <form className='bg-white p-5 rounded-lg border border-gray-200 space-y-5' onSubmit={onSubmitHandler}>
      {dataLoading && (
        <p className='text-sm text-gray-500'>Loading categories…</p>
      )}
      {dataError && !dataLoading && (
        <p className='text-sm text-red-600'>Failed to load categories. Some fields may be unavailable.</p>
      )}

      {/* SEO (Meta) */}
      <div>
        <p className='mb-2 text-sm font-medium text-black'>SEO</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block mb-2 text-sm font-medium text-black'>Meta Title</label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='SEO meta title'
            />
          </div>
          <div>
            <label className='block mb-2 text-sm font-medium text-black'>Meta Keywords</label>
            <input
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='keyword1, keyword2, keyword3'
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block mb-2 text-sm font-medium text-black'>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
              rows='3'
              placeholder='SEO meta description for search engines'
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div>
        <p className='mb-2 text-sm font-medium text-black'>Upload Images</p>
        <p className='text-xs text-gray-500 mb-3'>PNG or JPG up to 5MB. Add descriptive alt text for accessibility.</p>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <label htmlFor='pf_image1' className='block cursor-pointer'>
              <div className='w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors'>
                {!image1 ? (
                  <FaUpload className='w-6 h-6 text-gray-400' />
                ) : (
                  <img className='w-full h-full object-cover rounded-lg' src={URL.createObjectURL(image1)} alt='Product 1' />
                )}
              </div>
              <input onChange={(e) => Setimage1(e.target.files[0])} type='file' id='pf_image1' hidden accept='image/*' />
            </label>
            <input
              type='text'
              value={imageAlt1}
              onChange={(e) => setImageAlt1(e.target.value)}
              className='w-full px-2 py-1 border border-gray-300 rounded text-xs'
              placeholder='Alt text 1'
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='pf_image2' className='block cursor-pointer'>
              <div className='w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors'>
                {!image2 ? (
                  <FaUpload className='w-6 h-6 text-gray-400' />
                ) : (
                  <img className='w-full h-full object-cover rounded-lg' src={URL.createObjectURL(image2)} alt='Product 2' />
                )}
              </div>
              <input onChange={(e) => Setimage2(e.target.files[0])} type='file' id='pf_image2' hidden accept='image/*' />
            </label>
            <input
              type='text'
              value={imageAlt2}
              onChange={(e) => setImageAlt2(e.target.value)}
              className='w-full px-2 py-1 border border-gray-300 rounded text-xs'
              placeholder='Alt text 2'
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='pf_image3' className='block cursor-pointer'>
              <div className='w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors'>
                {!image3 ? (
                  <FaUpload className='w-6 h-6 text-gray-400' />
                ) : (
                  <img className='w-full h-full object-cover rounded-lg' src={URL.createObjectURL(image3)} alt='Product 3' />
                )}
              </div>
              <input onChange={(e) => Setimage3(e.target.files[0])} type='file' id='pf_image3' hidden accept='image/*' />
            </label>
            <input
              type='text'
              value={imageAlt3}
              onChange={(e) => setImageAlt3(e.target.value)}
              className='w-full px-2 py-1 border border-gray-300 rounded text-xs'
              placeholder='Alt text 3'
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='pf_image4' className='block cursor-pointer'>
              <div className='w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors'>
                {!image4 ? (
                  <FaUpload className='w-6 h-6 text-gray-400' />
                ) : (
                  <img className='w-full h-full object-cover rounded-lg' src={URL.createObjectURL(image4)} alt='Product 4' />
                )}
              </div>
              <input onChange={(e) => Setimage4(e.target.files[0])} type='file' id='pf_image4' hidden accept='image/*' />
            </label>
            <input
              type='text'
              value={imageAlt4}
              onChange={(e) => setImageAlt4(e.target.value)}
              className='w-full px-2 py-1 border border-gray-300 rounded text-xs'
              placeholder='Alt text 4'
            />
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block mb-2 text-sm font-medium text-black'>Product Name</label>
          <input
            onChange={handleNameChange}
            value={name}
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
            placeholder='Enter product name'
            required
          />
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-black flex items-center gap-2'>
            <FaLink className='w-4 h-4' />
            Product Slug
          </label>
          <input
            onChange={(e) => setSlug(e.target.value)}
            value={slug}
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
            placeholder='product-slug-url'
          />
        </div>
        <div className='md:col-span-2'>
          <label className='block mb-2 text-sm font-medium text-black'>Product Description</label>
          <div className='border border-gray-300 rounded-lg overflow-hidden'>
            <TinyMCEEditor
              apiKey='6xo7c5i2xk0pppsg3eg4zyg28f06jz37zi9komrirnhkxykt'
              value={description}
              onEditorChange={(content) => setDescription(content)}
              init={{
                height: 300,
                menubar: false,
                statusbar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link','code', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar:
                  'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image | code preview',
                content_style: 'body { font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size:14px }'
              }}
            />
          </div>
        </div>
      </div>

      {/* Categorization & Price */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block mb-2 text-sm font-medium text-black'>Category</label>
          <select
            onChange={(e) => {
              const newId = e.target.value
              setSelectedCategoryId(newId)
              const cat = categories.find(c => c.id === newId)
              setCategory(cat ? cat.name : '')
              const subsOf = (subcategories || []).filter(s => s && s.categoryId === newId)
              const firstSub = subsOf[0]
              setSelectedSubCategoryId(firstSub ? firstSub.id : '')
              setSubCategory(firstSub ? firstSub.name : '')
            }}
            value={selectedCategoryId}
            disabled={dataLoading || !categories.length}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
          >
            <option value=''>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-black'>Subcategory</label>
          <select
            onChange={(e) => {
              const newId = e.target.value
              setSelectedSubCategoryId(newId)
              const sub = subcategories.find(s => s.id === newId)
              setSubCategory(sub ? sub.name : '')
            }}
            value={selectedSubCategoryId}
            disabled={dataLoading || !selectedCategoryId}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
          >
            <option value=''>Select a subcategory</option>
            {(subcategories || []).filter(s => s && s.categoryId === selectedCategoryId).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-black'>Price ($)</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
            type='number'
            placeholder='25'
            min='0'
            step='0.01'
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className='block mb-2 text-sm font-medium text-black'>Sizes</label>
        <div className='flex gap-2 flex-wrap'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              type='button'
              onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
              className={`px-3 py-1.5 rounded border text-sm transition-colors ${sizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div className='flex flex-wrap items-center gap-4'>
        <label className='inline-flex items-center gap-2 text-sm text-black'>
          <input
            checked={bestSeller}
            onChange={() => setBestSeller(!bestSeller)}
            type='checkbox'
            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          Best Seller
        </label>
        <label className='inline-flex items-center gap-2 text-sm text-black'>
          <input
            checked={latestCollection}
            onChange={() => setLatestCollection(!latestCollection)}
            type='checkbox'
            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          Latest Collection
        </label>
      </div>

      {/* FAQs */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-black'>FAQs</label>
          <button
            type='button'
            onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
            className='px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800'
          >
            Add FAQ
          </button>
        </div>
        {faqs.length === 0 && (
          <p className='text-xs text-gray-500'>No FAQs added yet.</p>
        )}
        <div className='space-y-4'>
          {faqs.map((faq, idx) => (
            <div key={idx} className='border border-gray-200 rounded p-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='md:col-span-2 flex items-center justify-between mb-1'>
                <span className='text-xs font-medium text-gray-600'>FAQ {idx + 1}</span>
              </div>
              <div>
                <label className='block mb-1 text-xs font-medium text-black'>Question {idx + 1}</label>
                <input
                  type='text'
                  value={faq.question}
                  onChange={(e) => {
                    const next = [...faqs]
                    next[idx] = { ...next[idx], question: e.target.value }
                    setFaqs(next)
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter question'
                />
              </div>
              <div>
                <label className='block mb-1 text-xs font-medium text-black'>Answer {idx + 1}</label>
                <input
                  type='text'
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...faqs]
                    next[idx] = { ...next[idx], answer: e.target.value }
                    setFaqs(next)
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter answer'
                />
              </div>
              <div className='md:col-span-2 flex justify-end'>
                <button
                  type='button'
                  onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                  className='px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50'
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className='flex justify-end gap-3'>
        {onCancel && (
          <button type='button' onClick={onCancel} className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'>
            Cancel
          </button>
        )}
        <button
          className='px-5 py-2.5 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : (mode === 'edit' ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  )
}


