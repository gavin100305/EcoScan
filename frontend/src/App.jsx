import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // Simple routing based on URL path
  const path = window.location.pathname;

  if (path === '/' && !user) {
    return <Landing />;
  }

  return (
    <div>
      {user ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;
