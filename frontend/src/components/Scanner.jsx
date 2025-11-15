import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleScan = async () => {
    if (!file || !user) return;

    setLoading(true);
    setError(null);

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8000/api/scans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Scan failed');
      }

      setResult(data.data);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h2>Scan Product</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        
        {preview && (
          <div style={{ marginTop: '10px' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <button
        onClick={handleScan}
        disabled={!file || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: file && !loading ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: file && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'Analyzing...' : 'Scan Product'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Scan Result</h3>
          <div style={{ marginBottom: '10px' }}>
            <img src={result.imagePath} alt={result.productName} style={{ maxWidth: '200px', borderRadius: '4px' }} />
          </div>
          <p><strong>Product:</strong> {result.productName}</p>
          <p><strong>Material:</strong> {result.materialType}</p>
          <p><strong>Recyclability:</strong> {result.recyclability}</p>
          <p><strong>Carbon Footprint:</strong> {result.carbonFootprint}</p>
          <p><strong>Disposal Method:</strong> {result.disposalMethod}</p>
          {result.alternativeSuggestions && (
            <p><strong>Alternatives:</strong> {result.alternativeSuggestions}</p>
          )}
          <p style={{ fontSize: '12px', color: '#666' }}>
            Scanned: {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
