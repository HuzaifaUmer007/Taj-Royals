'use client';
import React, { useState, useEffect } from 'react';
import { healthAPI, productsAPI, categoriesAPI, reviewsAPI } from '@/lib/api';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, apiCall) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error) {
      setResults(prev => ({ ...prev, [name]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const testAllEndpoints = async () => {
    await Promise.all([
      testEndpoint('health', () => healthAPI.check()),
      testEndpoint('products', () => productsAPI.getAll()),
      testEndpoint('categories', () => categoriesAPI.getAll()),
      testEndpoint('reviews', () => reviewsAPI.getAll()),
    ]);
  };

  useEffect(() => {
    testAllEndpoints();
  }, []);

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-8'>API Test Page</h1>
      
      <div className='mb-6'>
        <button
          onClick={testAllEndpoints}
          className='bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700'
        >
          Test All Endpoints
        </button>
        <button
          onClick={() => testEndpoint('seed', () => fetch('/api/seed-categories', { method: 'POST' }).then(res => res.json()))}
          className='bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700'
        >
          Seed Sample Data
        </button>
      </div>

      <div className='grid gap-6'>
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className='border rounded-lg p-4'>
            <h3 className='text-xl font-semibold mb-2 capitalize'>{name} API</h3>
            
            {loading[name] && (
              <div className='flex items-center gap-2 text-blue-600'>
                <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                Testing...
              </div>
            )}

            {!loading[name] && result && (
              <div className={`p-3 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className='font-medium'>
                  {result.success ? '✅ Success' : '❌ Error'}
                </p>
                {result.success ? (
                  <pre className='mt-2 text-sm overflow-auto max-h-40'>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                ) : (
                  <p className='mt-2 text-sm'>{result.error}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
        <h3 className='text-lg font-semibold mb-2'>API Endpoints Available:</h3>
        <ul className='text-sm space-y-1'>
          <li>• <code>GET /api/health</code> - Health check</li>
          <li>• <code>GET /api/products</code> - Get all products</li>
          <li>• <code>GET /api/categories</code> - Get all categories</li>
          <li>• <code>GET /api/reviews</code> - Get all reviews</li>
          <li>• <code>GET /api/orders</code> - Get all orders</li>
          <li>• <code>GET /api/products/slug/[slug]</code> - Get product by slug</li>
          <li>• <code>POST /api/products</code> - Create product</li>
          <li>• <code>PUT /api/products/[id]</code> - Update product</li>
          <li>• <code>DELETE /api/products/[id]</code> - Delete product</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest;
