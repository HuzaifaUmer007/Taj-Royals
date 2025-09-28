'use client';

import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShopContext } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaChevronDown } from 'react-icons/fa'
const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const router = useRouter()
    const { showSearch, setShowSearch, getCartCount } = useContext(ShopContext);
    const { user, logout } = useAuth();


    return (
        <div className=' container flex items-center justify-between py-4 sm:py-5 px-4 sm:px-0 font-medium border-b border-gray-200'>
            <Link href='/'>
                <img src='/assets/logo.png' className='w-24 sm:w-36 h-auto' alt="Taj Royals Logo" />
            </Link>
            <ul className='hidden sm:flex gap-6 lg:gap-8 text-sm lg:text-base font-medium text-gray-700'>
                <Link href='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4  h-[1.5px] bg-gray-700 hidden' />
                </Link>
                <Link href='/collection' className='flex flex-col items-center gap-1 '>
                    <p>COLLECTION</p>
                    <hr className='w-2/4  h-[1.5px] bg-gray-700 hidden' />
                </Link>
                <Link href='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4  h-[1.5px] bg-gray-700 hidden' />
                </Link>
                <Link href='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4  h-[1.5px] bg-gray-700 hidden' />
                </Link>

            </ul>

            <div className='flex items-center gap-4 sm:gap-6'>
                <FaSearch onClick={() => setShowSearch(!showSearch)} className='w-5 h-5 cursor-pointer' />
                <div className='group relative'>
                    <FaUser onClick={() => user ? null : router.push('/login')} className='w-5 h-5 cursor-pointer' />
                    {
                        user ? (
                            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-700'>
                                    <p className='cursor-pointer hover:text-black'>My Profile</p>
                                    <p onClick={()=> router.push('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                                    <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                                </div>
                            </div>
                        ) : (
                            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-700'>
                                    <p onClick={() => router.push('/login')} className='cursor-pointer hover:text-black'>Login</p>
                                    <p onClick={() => router.push('/signup')} className='cursor-pointer hover:text-black'>Sign Up</p>
                                </div>
                            </div>
                        )
                    }
                </div>

                <Link href='/cart' className='relative'>
                    <FaShoppingCart className='w-5 h-5' />
                    <p className='absolute right-[-4px] bottom-[-4px] w-4 text-center leading-4 bg-black text-white rounded-full  aspect-square text-[8px]'>{getCartCount()}</p>
                </Link>
                <FaBars onClick={() => setVisible(true)} className='w-5 h-5 cursor-pointer sm:hidden' />
            </div>
            {/* sidebar menu for small screens */}
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 z-50 ${visible ? 'w-full sm:w-80' : 'w-0'}`}>
                <div className='flex flex-col h-full'>
                    <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                        <div className='flex items-center gap-3'>
                            <img src='/assets/logo.png' className='w-8 h-8' alt="Taj Royals Logo" />
                            <span className='text-lg font-semibold text-gray-800'>Taj Royals</span>
                        </div>
                        <button onClick={() => setVisible(false)} className='p-2 text-gray-600 hover:text-gray-800'>
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>
                    <div className='flex-1 py-4'>
                        <Link onClick={() => setVisible(false)} className='block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors' href='/'>
                            HOME
                        </Link>
                        <Link onClick={() => setVisible(false)} className='block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors' href='/collection'>
                            COLLECTION
                        </Link>
                        <Link onClick={() => setVisible(false)} className='block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors' href='/about'>
                            ABOUT
                        </Link>
                        <Link onClick={() => setVisible(false)} className='block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors' href='/contact'>
                            CONTACT
                        </Link>
                </div>
            </div>
            </div>

            {/* Mobile overlay */}
            {visible && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden'
                    onClick={() => setVisible(false)}
                />
            )}
        </div>
    )
}

export default Navbar