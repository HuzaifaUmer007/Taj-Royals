// API service functions for Taj Royals

const API_BASE_URL = '/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Products API
export const productsAPI = {
  // Get all products
  getAll: () => apiCall('/products'),
  
  // Get product by ID
  getById: (id) => apiCall(`/products/${id}`),
  
  // Get product by slug
  getBySlug: (slug) => apiCall(`/products/slug/${slug}`),
  
  // Create product
  create: (productData) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  // Update product by ID
  updateById: (id, productData) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  // Update product by slug
  updateBySlug: (slug, productData) => apiCall(`/products/slug/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  // Delete product by ID
  deleteById: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
  
  // Delete product by slug
  deleteBySlug: (slug) => apiCall(`/products/slug/${slug}`, {
    method: 'DELETE',
  }),
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: () => apiCall('/categories'),
  
  // Get category by ID
  getById: (id) => apiCall(`/categories/${id}`),
  
  // Get category by slug
  getBySlug: (slug) => apiCall(`/categories/slug/${slug}`),
  
  // Create category
  create: (categoryData) => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  
  // Update category by ID
  updateById: (id, categoryData) => apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  
  // Update category by slug
  updateBySlug: (slug, categoryData) => apiCall(`/categories/slug/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  
  // Delete category by ID
  deleteById: (id) => apiCall(`/categories/${id}`, {
    method: 'DELETE',
  }),
  
  // Delete category by slug
  deleteBySlug: (slug) => apiCall(`/categories/slug/${slug}`, {
    method: 'DELETE',
  }),
};

// Subcategories API
export const subcategoriesAPI = {
  // Get all subcategories
  getAll: () => apiCall('/subcategories'),
  
  // Get subcategory by ID
  getById: (id) => apiCall(`/subcategories/${id}`),
  
  // Get subcategory by slug
  getBySlug: (slug) => apiCall(`/subcategories/slug/${slug}`),
  
  // Create subcategory
  create: (subcategoryData) => apiCall('/subcategories', {
    method: 'POST',
    body: JSON.stringify(subcategoryData),
  }),
  
  // Update subcategory by ID
  updateById: (id, subcategoryData) => apiCall(`/subcategories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subcategoryData),
  }),
  
  // Update subcategory by slug
  updateBySlug: (slug, subcategoryData) => apiCall(`/subcategories/slug/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(subcategoryData),
  }),
  
  // Delete subcategory by ID
  deleteById: (id) => apiCall(`/subcategories/${id}`, {
    method: 'DELETE',
  }),
  
  // Delete subcategory by slug
  deleteBySlug: (slug) => apiCall(`/subcategories/slug/${slug}`, {
    method: 'DELETE',
  }),
};

// Reviews API
export const reviewsAPI = {
  // Get all reviews
  getAll: () => apiCall('/reviews'),
  
  // Get review by ID
  getById: (id) => apiCall(`/reviews/${id}`),
  
  // Get reviews by product slug
  getByProductSlug: (slug) => apiCall(`/reviews/product/${slug}`),
  
  // Create review
  create: (reviewData) => apiCall('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  
  // Create review for product by slug
  createForProduct: (slug, reviewData) => apiCall(`/reviews/product/${slug}`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  
  // Update review by ID
  updateById: (id, reviewData) => apiCall(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),
  
  // Delete review by ID
  deleteById: (id) => apiCall(`/reviews/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  // Get all orders
  getAll: () => apiCall('/orders'),
  
  // Get order by ID
  getById: (id) => apiCall(`/orders/${id}`),
  
  // Get order by slug
  getBySlug: (slug) => apiCall(`/orders/slug/${slug}`),
  
  // Create order
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // Update order by ID
  updateById: (id, orderData) => apiCall(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  
  // Update order by slug
  updateBySlug: (slug, orderData) => apiCall(`/orders/slug/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  
  // Delete order by ID
  deleteById: (id) => apiCall(`/orders/${id}`, {
    method: 'DELETE',
  }),
  
  // Delete order by slug
  deleteBySlug: (slug) => apiCall(`/orders/slug/${slug}`, {
    method: 'DELETE',
  }),
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health'),
};
