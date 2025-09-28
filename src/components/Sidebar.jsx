import React from 'react'
import { NavLink } from 'react-router-dom'
import icon_add from '../assets/images/add_icon.png'
import order_icon from '../assets/images/order_icon.png'

const Sidebar = () => {
    return (
        <div className="w-[18%] min-h-screen border-r-2 ">
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px] '>
                <NavLink to="/add" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
                    <img className='w-5 h-5' src={icon_add} alt="" />
                    <p className='hidden sm:block'> Add Items</p>
                </NavLink>
                <NavLink to="/list" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
                    <img className='w-5 h-5' src={order_icon} alt="" />
                    <p className='hidden sm:block'> List Items</p>
                </NavLink>
                <NavLink to="/order" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
                    <img className='w-5 h-5' src={order_icon} alt="" />
                    <p className='hidden sm:block'> Order</p>
                </NavLink>
                
            </div>
        </div>
    )
}

export default Sidebar