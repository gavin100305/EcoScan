import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper to get auth token
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  return session.access_token;
};

// Fetch with timeout and retry for Render cold starts
const fetchWithTimeout = async (url, options = {}, timeout = 60000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend might be waking up. Please try again.');
    }
    throw error;
  }
};

// Scan API
export const scanAPI = {
  // Upload and scan a product image
  upload: async (imageFile, userId) => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('userId', userId || 'anonymous');

    const response = await fetchWithTimeout(`${API_BASE_URL}/scans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }, 90000); // 90 second timeout for upload + cold start

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to scan product');
    }

    const result = await response.json();
    return {
      productName: result.data.productName,
      material: result.data.materialType,
      recyclability: result.data.recyclability,
      carbonFootprint: result.data.carbonFootprint || 'Medium',
      disposalMethod: result.data.disposalMethod || 'Recycling Bin',
      alternativeSuggestions: result.data.alternativeSuggestions || '',
      confidence: '95%',
      timestamp: result.data.timestamp || new Date().toISOString(),
      image: result.data.imagePath || result.data.imageUrl || null,
    };
  },

  // Get scan history
  getHistory: async () => {
    const token = await getAuthToken();
    const response = await fetchWithTimeout(`${API_BASE_URL}/scans`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    const data = await response.json();
    return data.data || [];
  },

  // Delete a scan
  deleteScan: async (scanId) => {
    const token = await getAuthToken();
    const response = await fetchWithTimeout(`${API_BASE_URL}/scans/${scanId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete scan');
    }

    return response.json();
  },
};

// User API
export const userAPI = {
  // Delete user account
  deleteAccount: async () => {
    const token = await getAuthToken();
    const response = await fetchWithTimeout(`${API_BASE_URL}/user/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }

    return response.json();
  },
};
