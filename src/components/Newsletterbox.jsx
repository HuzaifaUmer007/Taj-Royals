'use client'
import React from 'react'

const Newsletterbox = () => {
    const onSubmitHandler=(event)=>{
        event.preventDefault();
    }
  return (
    <div className='container text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>
            Lorem ipsum dolor sit amet  exercitationem sapiente tenetur!
        </p>
        <form onSubmit={onSubmitHandler} className='w-full flex sm:w-1/2 items-center gap-3 mx-auto my-6  pl-3'>
            <input className='w-full sm:flex-1 border outline-none p-3' type="email" placeholder="Enter your Email" name='' id="" required/>
            <button type='submit' className='bg-black text-white text-xs px-10 py-4 ml-[-15px]'>Subscribe </button>
        </form>
    </div>
  )
}

export default Newsletterbox