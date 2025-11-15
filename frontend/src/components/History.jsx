import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('http://localhost:8000/api/scans', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch scans');
      }

      setScans(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scan?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`http://localhost:8000/api/scans/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        setScans(scans.filter(scan => scan.id !== id));
        if (selectedScan?.id === id) setSelectedScan(null);
      }
    } catch (err) {
      alert('Failed to delete scan: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h2>Scan History</h2>
      
      {scans.length === 0 ? (
        <p>No scans yet. Start by scanning a product!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedScan ? '1fr 1fr' : '1fr', gap: '20px' }}>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Image</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Product</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scans.map(scan => (
                  <tr 
                    key={scan.id}
                    style={{ 
                      cursor: 'pointer', 
                      backgroundColor: selectedScan?.id === scan.id ? '#e3f2fd' : 'white'
                    }}
                    onClick={() => setSelectedScan(scan)}
                  >
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <img src={scan.imagePath} alt={scan.productName} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{scan.productName}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(scan.id); }}
                        style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedScan && (
            <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h3>Scan Details</h3>
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src={selectedScan.imagePath} 
                  alt={selectedScan.productName} 
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
              </div>
              <p><strong>Product Name:</strong> {selectedScan.productName}</p>
              <p><strong>Material Type:</strong> {selectedScan.materialType}</p>
              <p><strong>Recyclability:</strong> {selectedScan.recyclability}</p>
              <p><strong>Carbon Footprint:</strong> {selectedScan.carbonFootprint}</p>
              <p><strong>Disposal Method:</strong> {selectedScan.disposalMethod}</p>
              {selectedScan.alternativeSuggestions && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                  <strong>Alternative Suggestions:</strong>
                  <p>{selectedScan.alternativeSuggestions}</p>
                </div>
              )}
              <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
                Scanned on: {new Date(selectedScan.timestamp).toLocaleString()}
              </p>
              <button 
                onClick={() => setSelectedScan(null)}
                style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
