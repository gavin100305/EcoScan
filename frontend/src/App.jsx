import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Profile from './components/Profile';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? <Profile /> : <Auth />}
    </div>
  );
}

export default App;
