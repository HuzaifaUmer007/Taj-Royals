'use client';

import { React, useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([]);
    useEffect(() => {
        if (products.length > 0) {
            const bestProducts = products.filter((item) => item.bestSeller);
            setBestSeller(bestProducts.slice(0, 5));
        }
    }, [products]);

    return (
        <div className='container my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'Best'} text2={' Seller '} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui architecto maxime officiis iure tempore aut quisquam. Aliquam eaque illum ad praesentium maxime accusamus nobis, pariatur, nulla impedit eum expedita assumenda!</p>
            </div>
            {/* remdering products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestSeller.map((item, index) => (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller