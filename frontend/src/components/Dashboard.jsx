import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Scanner from './Scanner';
import History from './History';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('scan');
  const { user, signOut } = useAuth();

  return (
    <div>
      <nav style={{ 
        backgroundColor: '#1976d2', 
        color: 'white', 
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>EcoScan</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>{user?.email}</span>
          <button 
            onClick={signOut}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        padding: '20px 30px', 
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f5f5f5'
      }}>
        <button
          onClick={() => setActiveTab('scan')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'scan' ? '#1976d2' : 'white',
            color: activeTab === 'scan' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'scan' ? 'bold' : 'normal'
          }}
        >
          Scan Product
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'history' ? '#1976d2' : 'white',
            color: activeTab === 'history' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'history' ? 'bold' : 'normal'
          }}
        >
          History
        </button>
      </div>

      <div>
        {activeTab === 'scan' && <Scanner />}
        {activeTab === 'history' && <History />}
      </div>
    </div>
  );
}
