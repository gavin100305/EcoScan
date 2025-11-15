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

// Scan API
export const scanAPI = {
  // Upload and scan a product image
  upload: async (imageFile, userId) => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('userId', userId || 'anonymous');

    const response = await fetch(`${API_BASE_URL}/scans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to scan product');
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
    const response = await fetch(`${API_BASE_URL}/scans`, {
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
    const response = await fetch(`${API_BASE_URL}/scans/${scanId}`, {
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
    const response = await fetch(`${API_BASE_URL}/user/delete`, {
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
