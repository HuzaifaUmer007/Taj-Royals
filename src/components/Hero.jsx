import React from 'react'
import Image from 'next/image'

const Hero = () => {
    return (
        <div className=' container flex flex-col sm:flex-row border border-gray-400 min-h-[400px] sm:min-h-[500px]'>
            {/* hero left side */}
            <div className=' container w-full sm:w-1/2 flex items-center justify-center py-8 sm:py-16 px-6 sm:px-8'>
                <div className='text-[#414141] text-center sm:text-left'>
                    <div className='flex items-center justify-center sm:justify-start gap-2 mb-4'>
                        <div className='w-8 md:w-11 h-[2px] bg-[#414141]'></div>
                        <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                    </div>
                    <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6'>
                        Latest Arrivals
                    </h1>
                    <div className='flex items-center justify-center sm:justify-start gap-2'>
                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                        <div className='w-8 md:w-11 h-[2px] bg-[#414141]'></div>
                    </div>
                </div>
            </div>
            {/* hero right side */}
            <div className='w-full sm:w-1/2 relative'>
                <Image className='w-full h-64 sm:h-full ' src='/assets/hero_img.png' width={500} height={500} alt="Fashion Collection" />
            </div>
        </div>
    )
}

export default Hero