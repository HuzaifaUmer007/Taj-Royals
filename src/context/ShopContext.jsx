'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsAPI, reviewsAPI } from '@/lib/api';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error('Error loading cart from localStorage:', error);
                }
            }
        }
    }, []);

    // Save cart to localStorage whenever cartItems changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const currency = '$';
    const delivery_fee = 40;
    const backendUrl = 'http://localhost:4000';

    // Fetch products from API
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await productsAPI.getAll();
            if (response.success) {
                setProducts(response.products);
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            // Fallback to sample data if API fails
            setProducts(sampleProducts);
        } finally {
            setLoading(false);
        }
    };

    // Sample products data (fallback data)
    const sampleProducts = [
        {
            _id: '1',
            name: 'Casual T-Shirt',
            slug: 'casual-t-shirt',
            price: 599,
            image: ['/assets/p_img1.png', '/assets/p_img2.png'],
            category: 'Men',
            subCategory: 'Casual',
            sizes: ['S', 'M', 'L', 'XL'],
            bestSeller: true,
            description: 'Comfortable cotton t-shirt for everyday wear',
            reviews: [
                {
                    id: 1,
                    name: 'John Smith',
                    email: 'john@example.com',
                    rating: 5,
                    title: 'Perfect fit and quality!',
                    comment: 'Excellent quality! The material is soft and comfortable. Perfect fit and great value for money. Will definitely order again.',
                    date: '2024-01-15',
                    size: 'M',
                    color: 'Blue'
                },
                {
                    id: 2,
                    name: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    rating: 4,
                    title: 'Good product overall',
                    comment: 'Good product overall. The design is nice and the quality is decent. Shipping was fast and packaging was good.',
                    date: '2024-01-10',
                    size: 'L',
                    color: 'Red'
                }
            ]
        },
        {
            _id: '2',
            name: 'Designer Dress',
            slug: 'designer-dress',
            price: 1299,
            image: ['/assets/p_img2.png', '/assets/p_img3.png'],
            category: 'Women',
            subCategory: 'Formal',
            sizes: ['XS', 'S', 'M', 'L'],
            bestSeller: true,
            description: 'Elegant dress perfect for office or events',
            reviews: [
                {
                    id: 3,
                    name: 'Emily Davis',
                    email: 'emily@example.com',
                    rating: 5,
                    title: 'Absolutely stunning!',
                    comment: 'This dress is absolutely beautiful! Perfect for formal events. The quality is excellent and it fits perfectly.',
                    date: '2024-01-12',
                    size: 'M',
                    color: 'Black'
                },
                {
                    id: 4,
                    name: 'Lisa Wilson',
                    email: 'lisa@example.com',
                    rating: 4,
                    title: 'Great dress',
                    comment: 'Very elegant dress. Good quality material and nice design. Would recommend for special occasions.',
                    date: '2024-01-08',
                    size: 'S',
                    color: 'Navy'
                }
            ]
        },
        {
            _id: '3',
            name: 'Sports Jacket',
            slug: 'sports-jacket',
            price: 899,
            image: ['/assets/p_img3.png', '/assets/p_img4.png'],
            category: 'Men',
            subCategory: 'Sports',
            sizes: ['M', 'L', 'XL'],
            bestSeller: false,
            description: 'Lightweight jacket for active lifestyle',
            reviews: [
                {
                    id: 5,
                    name: 'Mike Wilson',
                    email: 'mike@example.com',
                    rating: 5,
                    title: 'Perfect for workouts!',
                    comment: 'Amazing product! Exceeded my expectations. The fit is perfect and the material is high quality. Highly recommended!',
                    date: '2024-01-05',
                    size: 'L',
                    color: 'Black'
                }
            ]
        },
        {
            _id: '4',
            name: 'Denim Jeans',
            slug: 'denim-jeans',
            price: 999,
            image: ['/assets/p_img4.png', '/assets/p_img5.png'],
            category: 'Men',
            subCategory: 'Casual',
            sizes: ['30', '32', '34', '36'],
            bestSeller: true,
            description: 'Classic denim jeans with perfect fit',
            reviews: [
                {
                    id: 6,
                    name: 'David Brown',
                    email: 'david@example.com',
                    rating: 4,
                    title: 'Great jeans',
                    comment: 'Good quality denim. Fits well and comfortable to wear. Good value for money.',
                    date: '2024-01-03',
                    size: '32',
                    color: 'Blue'
                }
            ]
        },
        {
            _id: '5',
            name: 'Summer Top',
            slug: 'summer-top',
            price: 399,
            image: ['/assets/p_img5.png', '/assets/p_img6.png'],
            category: 'Women',
            subCategory: 'Casual',
            sizes: ['XS', 'S', 'M', 'L'],
            bestSeller: false,
            description: 'Light and breezy top for summer days',
            reviews: [
                {
                    id: 7,
                    name: 'Anna Taylor',
                    email: 'anna@example.com',
                    rating: 5,
                    title: 'Perfect summer top!',
                    comment: 'Love this top! Perfect for hot summer days. Lightweight and comfortable. Great quality.',
                    date: '2024-01-01',
                    size: 'M',
                    color: 'White'
                }
            ]
        }
    ];

    useEffect(() => {
        setProducts(sampleProducts);
    }, []);

    const getCartAmount = () => {
        let totalAmount = 0;
        
        for (const itemId in cartItems) {
            const sizeMap = cartItems[itemId];
            
            if (sizeMap && typeof sizeMap === 'object') {
                const productInfo = products.find((product) => 
                    product._id === itemId || product.id === itemId || product.slug === itemId
                );
                
                if (productInfo) {
                    const price = productInfo.price || 0;
                    const quantityForItem = Object.values(sizeMap).reduce((sum, qty) => sum + Number(qty || 0), 0);
                    totalAmount += price * quantityForItem;
                }
            } else if (typeof sizeMap === 'number') {
                const productInfo = products.find((product) => 
                    product._id === itemId || product.id === itemId || product.slug === itemId
                );
                
                if (productInfo) {
                    const price = productInfo.price || 0;
                    totalAmount += price * sizeMap;
                }
            }
        }
        return totalAmount;
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            const sizeMap = cartItems[itemId];
            if (sizeMap && typeof sizeMap === 'object') {
                totalCount += Object.values(sizeMap).reduce((sum, qty) => sum + Number(qty || 0), 0);
            } else if (typeof sizeMap === 'number') {
                totalCount += sizeMap;
            }
        }
        return totalCount;
    };

    const addToCart = async (itemId, size) => {
        if (!size) {
            alert('Please select a size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);
    };

    const updateQuantity = (itemId, size, newQuantity) => {
        let cartData = structuredClone(cartItems);
        
        if (newQuantity <= 0) {
            // Remove the item completely
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                // If no sizes left for this item, remove the item entirely
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {
            // Update quantity
            if (cartData[itemId]) {
                cartData[itemId][size] = newQuantity;
            } else {
                cartData[itemId] = {};
                cartData[itemId][size] = newQuantity;
            }
        }
        
        setCartItems(cartData);
    };

    const clearCart = () => {
        setCartItems({});
    };

    const addReview = async (productSlug, reviewData) => {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const response = await reviewsAPI.createForProduct(productSlug, {
                ...reviewData,
                date: currentDate
            });

            if (response.success) {
                // Update local state
                setProducts(prevProducts =>
                    prevProducts.map(product => {
                        if (product.slug === productSlug) {
                            const newReview = {
                                id: Date.now(),
                                ...reviewData,
                                date: currentDate
                            };
                            return {
                                ...product,
                                reviews: [...(product.reviews || []), newReview]
                            };
                        }
                        return product;
                    })
                );
                return { success: true, message: 'Review added successfully' };
            } else {
                throw new Error('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            return { success: false, message: error.message };
        }
    };

    const navigate = (path) => {
        router.push(path);
    };

    const logout = () => {
        setToken('');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        router.push('/login');
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const value = {
        products,
        currency,
        delivery_fee,
        backendUrl,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartAmount,
        token,
        setToken,
        navigate,
        logout,
        addReview,
        loading,
        error,
        fetchProducts
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
