import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Scan from './pages/Scan';
import History from './pages/History';
import Result from './pages/Result';
import Compare from './pages/Compare';
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
  if (path === '/scan' && user) return <Scan />;
  if (path === '/history' && user) return <History />;
  if (path === '/result' && user) return <Result />;
  if (path === '/compare' && user) return <Compare />;

  // Default: redirect to scan if logged in, login if not
  return <div>{user ? <Scan /> : <Login />}</div>;
}

export default App;
