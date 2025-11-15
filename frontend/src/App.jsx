import { useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // Simple routing based on URL path
  const path = window.location.pathname;

  if (path === '/' && !user) return <Landing />;
  if (path === '/login') return <Login />;
  if (path === '/signup') return <Signup />;

  return <div>{user ? <Dashboard /> : <Login />}</div>;
}

export default App;
