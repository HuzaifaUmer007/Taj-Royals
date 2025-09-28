'use client';
import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ShopContext } from '@/context/ShopContext';
import RelatedProduct from '@/components/RelatedProduct';

const Product = () => {
  const { slug} = useParams();
  const { products, currency, addToCart, addReview } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 0,
    title: '',
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProductData = () => {
    products.map((item) => {
      if (item.slug == slug) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [slug, products]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      // Add review to the product using API
      const result = await addReview(slug, {
        name: reviewForm.name,
        email: reviewForm.email,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        size: size || 'Not specified',
        color: 'Not specified'
      });

      if (result.success) {
        alert('Thank you for your review! It has been submitted successfully.');
        setReviewForm({
          name: '',
          email: '',
          rating: 0,
          title: '',
          comment: ''
        });
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!productData) return <div className='opacity-0'></div>;

  return (
    <>
      <Head>
        <title>{productData.metaTitle || productData.name}</title>
        {productData.metaDescription && (
          <meta name='description' content={productData.metaDescription} />
        )}
        {productData.metaKeywords && (
          <meta name='keywords' content={productData.metaKeywords} />
        )}
        {/* Open Graph basic tags */}
        <meta property='og:title' content={productData.metaTitle || productData.name} />
        {productData.metaDescription && (
          <meta property='og:description' content={productData.metaDescription} />
        )}
        {image && <meta property='og:image' content={image} />}
      </Head>
      <div className='container border-t pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <div 
                key={index} 
                className='relative w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer aspect-square'
                onClick={() => setImage(item)}
              >
                <Image 
                  src={item} 
                  alt={`Product view ${index + 1}`}
                  fill
                  className='object-cover'
                  sizes='(max-width: 640px) 24vw, 100%'
                />
              </div>
            ))}
          </div>
          <div className='w-full sm:w-[80%] aspect-square relative'>
            {image && (
              <Image 
                src={image} 
                alt={productData.name}
                fill
                className='object-contain'
                priority
              />
            )}
          </div>
        </div>

        {/* Product info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(4)].map((_, i) => (
                <Image key={i} src='/assets/star_icon.png' alt="" width={14} height={14} className="w-3.5" />
            ))}
            <Image src='/assets/star_dull_icon.png' alt="" width={14} height={14} className="w-3.5" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          
          <div className='flex flex-col gap-4 my-8'>
            <div className='flex items-center justify-between'>
              <p>Select Size</p>
              <button 
                onClick={() => setShowSizeChart(!showSizeChart)}
                className='text-blue-600 hover:text-blue-800 text-sm underline'
              >
                View Size Chart
              </button>
            </div>
            
            {/* Size Chart Modal */}
            {showSizeChart && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl font-semibold'>Size Chart</h3>
                    <button 
                      onClick={() => setShowSizeChart(false)}
                      className='text-gray-500 hover:text-gray-700 text-2xl'
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className='overflow-x-auto'>
                    <table className='w-full border-collapse border border-gray-300'>
                      <thead>
                        <tr className='bg-gray-50'>
                          <th className='border border-gray-300 px-4 py-2 text-left font-semibold'>Size</th>
                          <th className='border border-gray-300 px-4 py-2 text-center font-semibold'>S (In)</th>
                          <th className='border border-gray-300 px-4 py-2 text-center font-semibold'>M (In)</th>
                          <th className='border border-gray-300 px-4 py-2 text-center font-semibold'>L (In)</th>
                          <th className='border border-gray-300 px-4 py-2 text-center font-semibold'>XL (In)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className='border border-gray-300 px-4 py-2 font-medium'>Shoulder</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>14</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>14.5</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>15.5</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>16.5</td>
                        </tr>
                        <tr>
                          <td className='border border-gray-300 px-4 py-2 font-medium'>Chest</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>19</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>20</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>21</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>22</td>
                        </tr>
                        <tr>
                          <td className='border border-gray-300 px-4 py-2 font-medium'>Waist</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>17</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>18</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>19</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>20</td>
                        </tr>
                        <tr>
                          <td className='border border-gray-300 px-4 py-2 font-medium'>Sleeve</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>21</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>22</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>23</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>24</td>
                        </tr>
                        <tr>
                          <td className='border border-gray-300 px-4 py-2 font-medium'>Hip</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>20</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>21</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>22</td>
                          <td className='border border-gray-300 px-4 py-2 text-center'>23</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className='mt-4 text-sm text-gray-600'>
                    <p>*Shirt length and hem may vary according to the silhouette</p>
                  </div>
                  
                  <div className='mt-6 flex justify-end'>
                    <button 
                      onClick={() => setShowSizeChart(false)}
                      className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className='flex gap-2 flex-wrap'>
              {productData.sizes.map((item, index) => (
                <button 
                  key={index} 
                  onClick={() => setSize(item)} 
                  className={`py-2 px-4 ${item === size ? 'bg-black text-white' : 'bg-gray-100'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => addToCart(productData.slug, size)} 
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-800 transition-colors'
            disabled={!size}
          >
            {size ? 'Add To Cart' : 'Select Size'}
          </button>
          
          <hr className='mt-8 sm:w-4/5' />
          
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description, FAQs and Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-5 py-3 text-sm border-b-2 transition-colors ${
              activeTab === 'description' 
                ? 'border-black text-black font-semibold' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('faqs')}
            className={`px-5 py-3 text-sm border-b-2 transition-colors ${
              activeTab === 'faqs' 
                ? 'border-black text-black font-semibold' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            FAQs
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 text-sm border-b-2 transition-colors ${
              activeTab === 'reviews' 
                ? 'border-black text-black font-semibold' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews (122)
          </button>
        </div>
        
        {activeTab === 'description' && (
          <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
            <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
            <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className='flex flex-col gap-4 border px-6 py-6'>
            {productData.faqs && productData.faqs.length > 0 ? (
              <div className='space-y-3'>
                {productData.faqs.map((f, i) => (
                  <div key={i} className='border border-gray-200 rounded-lg p-4'>
                    <p className='font-semibold text-gray-900'>{f.question}</p>
                    <p className='text-sm text-gray-700 mt-1'>{f.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>No FAQs for this product.</p>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className='border px-6 py-6'>
            {/* Review Summary */}
            <div className='flex flex-col md:flex-row gap-8 mb-8'>
              <div className='md:w-1/3'>
                <div className='text-center'>
                  <div className='text-4xl font-bold text-gray-900 mb-2'>
                    {productData.reviews && productData.reviews.length > 0 
                      ? (productData.reviews.reduce((sum, review) => sum + review.rating, 0) / productData.reviews.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <div className='flex justify-center mb-2'>
                    {[...Array(5)].map((_, i) => {
                      const averageRating = productData.reviews && productData.reviews.length > 0 
                        ? productData.reviews.reduce((sum, review) => sum + review.rating, 0) / productData.reviews.length 
                        : 0;
                      return (
                        <Image 
                          key={i} 
                          src={i < Math.floor(averageRating) ? '/assets/star_icon.png' : '/assets/star_dull_icon.png'} 
                          alt="star" 
                          width={20} 
                          height={20} 
                          className="w-5 h-5" 
                        />
                      );
                    })}
                  </div>
                  <p className='text-sm text-gray-600'>
                    Based on {productData.reviews ? productData.reviews.length : 0} reviews
                  </p>
                </div>
              </div>
              
              <div className='md:w-2/3'>
                <div className='space-y-2'>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const ratingCount = productData.reviews ? productData.reviews.filter(review => review.rating === rating).length : 0;
                    const totalReviews = productData.reviews ? productData.reviews.length : 0;
                    const percentage = totalReviews > 0 ? (ratingCount / totalReviews) * 100 : 0;
                    
                    return (
                      <div key={rating} className='flex items-center gap-3'>
                        <span className='text-sm w-8'>{rating}</span>
                        <Image src='/assets/star_icon.png' alt="star" width={16} height={16} className="w-4 h-4" />
                        <div className='flex-1 bg-gray-200 rounded-full h-2'>
                          <div 
                            className='bg-yellow-400 h-2 rounded-full' 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className='text-sm text-gray-600 w-8'>{ratingCount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Write Review Form */}
            <div className='bg-gray-50 rounded-lg p-6 mb-8'>
              <h4 className='text-lg font-semibold text-gray-900 mb-4'>Write a Review</h4>
              <form onSubmit={handleReviewSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
                    <input
                      type='text'
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Enter your name'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                    <input
                      type='email'
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Enter your email'
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Rating</label>
                  <div className='flex items-center gap-2'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type='button'
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className='focus:outline-none'
                      >
                        <Image
                          src={star <= reviewForm.rating ? '/assets/star_icon.png' : '/assets/star_dull_icon.png'}
                          alt="star"
                          width={24}
                          height={24}
                          className="w-6 h-6 hover:scale-110 transition-transform"
                        />
                      </button>
                    ))}
                    <span className='ml-2 text-sm text-gray-600'>
                      {reviewForm.rating > 0 ? `${reviewForm.rating} star${reviewForm.rating > 1 ? 's' : ''}` : 'Select rating'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Review Title</label>
                  <input
                    type='text'
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Summarize your review'
                    required
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    rows={4}
                    placeholder='Tell us about your experience with this product...'
                    required
                  />
                </div>
                
                <div className='flex items-center gap-4'>
                  <button
                    type='submit'
                    disabled={isSubmittingReview}
                    className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2'
                  >
                    {isSubmittingReview ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={() => setReviewForm({name: '', email: '', rating: 0, title: '', comment: ''})}
                    className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
            
            {/* Individual Reviews */}
            <div className='space-y-6'>
              <h4 className='text-lg font-semibold text-gray-900 mb-4'>Customer Reviews</h4>
              
              {productData.reviews && productData.reviews.length > 0 ? (
                productData.reviews.map((review, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <div key={review.id} className='border-b border-gray-200 pb-6'>
                      <div className='flex items-start gap-4'>
                        <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-2'>
                            <h5 className='font-semibold text-gray-900'>{review.name}</h5>
                            <div className='flex'>
                              {[...Array(5)].map((_, i) => (
                                <Image 
                                  key={i} 
                                  src={i < review.rating ? '/assets/star_icon.png' : '/assets/star_dull_icon.png'} 
                                  alt="star" 
                                  width={16} 
                                  height={16} 
                                  className="w-4 h-4" 
                                />
                              ))}
                            </div>
                            <span className='text-sm text-gray-500'>{review.date}</span>
                          </div>
                          <h6 className='font-medium text-gray-800 mb-2'>{review.title}</h6>
                          <p className='text-gray-700 mb-2'>{review.comment}</p>
                          <div className='flex items-center gap-4 text-sm text-gray-500'>
                            <span>Size: {review.size}</span>
                            <span>Color: {review.color}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
      </div>
    </>
  );
};

export default Product;
