'use client';

import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Assets from '../assets/assets';
import { usePathname } from 'next/navigation';

const SearchBar = () => {
    const {search,setSearch, showSearch,setShowSearch}=useContext(ShopContext);
    const [visible,setVisible]=useState(false);
    const pathname = usePathname();
    useEffect(()=>{
        if(pathname.includes('collection') && showSearch){
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    },[pathname,showSearch])
  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-cenetr border border border-gray-400 px-5 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
            <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bd-9nherot text-sm' placeholder='Search' />
        </div>
        <img onClick={()=>setShowSearch(false)} className='inline w-3 cursor-pointer' src={Assets.cross_icon} alt="" />
    </div>
  )
: null
}
export default SearchBar