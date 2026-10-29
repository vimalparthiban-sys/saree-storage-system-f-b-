// APPZYS E-Commerce REST API Client (Connects to Spring Boot 8080)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Helper for making JSON HTTP requests
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      let errorData = null;
      try {
        errorData = await res.json();
      } catch (_) {}
      
      const serverMsg = errorData?.message;
      if (serverMsg) {
        throw new Error(serverMsg);
      }
      if (res.status === 400 || res.status === 401) {
        throw new Error('Wrong password or email');
      }
      throw new Error(`Request failed (${res.status})`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API Warning] Request to ${url} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // 1. Health Check
  getHealth: async () => {
    return request('/health');
  },

  // 2. Products
  getProducts: async () => {
    return request('/products');
  },

  getProductById: async (id) => {
    return request(`/products/${id}`);
  },

  // 3. Reviews (Paginated 5 per page from MySQL)
  getReviews: async (productId, page = 1, size = 5) => {
    return request(`/reviews/${productId}?page=${page}&size=${size}`);
  },

  createReview: async (reviewData) => {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // 4. Orders
  createOrder: async (orderData) => {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getOrderById: async (orderId) => {
    return request(`/orders/${orderId}`);
  },

  getOrderByAwb: async (awb) => {
    return request(`/orders/tracking/${awb}`);
  },

  getOrdersByPhone: async (phone) => {
    return request(`/orders/user/${phone}`);
  },

  // 5. User Authentication & Accounts (MySQL)
  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  forgotPassword: async (identifier) => {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  validateOtp: async (data) => {
    return request('/auth/validate-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyOtp: async (otpData) => {
    return request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  },

  getAllUsers: async () => {
    return request('/auth/users');
  },
};

export default api;
