'use client';
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '@/context/ShopContext';
import Title from '@/components/Title';
import ProductItem from '@/components/ProductItem';

const Collection = () => {
  const { products, search, showSearch, loading, error, fetchProducts } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Apply search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Apply subcategory filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Update the filtered products state
    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter(); // Apply filter again when 'relevant' is selected
        break;
    }
  };

  // Apply filters when category, subcategory, search, or products change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  // Apply sorting whenever the sort type changes
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className='container flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter options */}
      <div className='min-w-60'>
        <p className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          Filters
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src='/assets/dropdown_icon.png'
            alt=""
          />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Category</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type="checkbox"
                value={'Men'}
                onChange={toggleCategory}
              />
              MEN
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type="checkbox"
                value={'Kids'}
                onChange={toggleCategory}
              />
              KIDS
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type="checkbox"
                value={'Women'}
                onChange={toggleCategory}
              />
              WOMEN
            </p>
          </div>
        </div>
        {/* Subcategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Type</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type="checkbox"
                value={'Topwear'}
                onChange={toggleSubCategory}
              />
              TOPWEAR
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type="checkbox"
                value={'Bottomwear'}
                onChange={toggleSubCategory}
              />
              BOTTOMWEAR
            </p>
            <p className='flex gap-2'>
              <input
                className='w-3'
                type="checkbox"
                value={'Winterwear'}
                onChange={toggleSubCategory}
              />
              WINTERWEAR
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Product display */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTION'} />
          {/* Product sorting */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 text-sm px-2'
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='flex justify-center items-center py-20'>
            <div className='text-center'>
              <div className='w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-gray-600'>Loading products...</p>
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
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {filterProducts.length > 0 ? (
              filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  name={item.name}
                  id={item._id}
                  slug={item.slug}
                  price={item.price}
                  image={item.image}
                />
              ))
            ) : (
              <div className='col-span-full text-center py-20'>
                <p className='text-gray-600 text-lg'>No products found</p>
                <p className='text-gray-500 text-sm mt-2'>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
