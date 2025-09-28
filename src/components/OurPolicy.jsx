import React from 'react'
import { FaExchangeAlt, FaShieldAlt, FaHeadset } from 'react-icons/fa'

const OurPolicy = () => {
  return (
    <div className='container flex flex-col sm:flex-row justify-around gap-8 sm:gap-12 text-center py-16 sm:py-20 px-4 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <FaExchangeAlt className='w-12 h-12 m-auto mb-5 text-black' />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>We offer hassle free exchange policy</p>
        </div>
        <div>
            <FaShieldAlt className='w-12 h-12 m-auto mb-5 text-black DDBA58' />
            <p className='font-semibold'>7 Days Return Policy</p>
            <p className='text-gray-400'>We provide 7 days return policy</p>
        </div>
        <div>
            <FaHeadset className='w-12 h-12 m-auto mb-5 text-black DDBA58' />
            <p className='font-semibold'>Best Customer Support</p>
            <p className='text-gray-400'>We provide 24/7 customer support</p>
        </div>
    </div>
  )
}

export default OurPolicy