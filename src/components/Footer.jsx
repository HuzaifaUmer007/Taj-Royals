import React from 'react'

const Footer = () => {
    return (
        <>
            <div className=' container flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-8 sm:gap-14 my-20 sm:my-40 px-4 text-sm'>
                <div>
                    <img src='/assets/logo.png' alt="Taj Royals Logo" className='w-32 mb-3' />
                    <p className='text-gray-600 leading-relaxed'>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo magni rem quisquam debitis mollitia, id distinctio ut possimus optio porro corrupti similique minima veritatis deserunt modi sed magnam fuga expedita.
                    </p>
                </div>
                <div>
                    <p className='text-lg sm:text-xl font-medium mb-4 sm:mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li className='hover:text-gray-800 cursor-pointer'>HOME</li>
                        <li className='hover:text-gray-800 cursor-pointer'>COLLECTION</li>
                        <li className='hover:text-gray-800 cursor-pointer'>ABOUT</li>
                        <li className='hover:text-gray-800 cursor-pointer'>CONTACT</li>
                    </ul>
                </div>
                <div>
                    <p className='text-lg sm:text-xl font-medium mb-4 sm:mb-5'>GET IN TOUCH</p>
                    <ul className='space-y-2'>
                        <li className='text-gray-600'>+1 (234) 556-7890</li>
                        <li className='text-gray-600'>contact@tajroyals.com</li>
                    </ul>
                </div>
            </div>
            <div className='border-t bg-black'>
                <div className='py-4 sm:py-6 px-4'>
                    <p className='text-center text-sm text-[#DDBA58]'>
                        © 2024 Taj Royals. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    )
}

export default Footer