import React from 'react'
import Title from '@/components/Title'
import Newsletterbox from '@/components/Newsletterbox'
const contact = () => {
  return (
    <div className='container'>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img src='/assets/contact_img.png' className='w-full md:max-w-[480px]' alt="" />
        <div className="flex flex-col justify-centerr item-start gap-6">
          <p className='font-semibold- text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>54709 Wills Station <br />Suite #50, Washington, </p>
          <p className='text-gray-500'>Tel:(415) 555-132<br />admin@gmail.com </p>
          <p className='font-semibold- text-xl text-gray-600'>career at Forever</p>
          <p className='text-gray-500'>Learn more about our teams and job openings <br />Suite #50, Washington, </p>
          <button className='border border-black w-[150px] px-4 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore</button>
        </div>
      </div>
      <Newsletterbox/>
    </div>
  )
}

export default contact