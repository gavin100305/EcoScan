import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      <p>ID: {user?.id}</p>
      <button onClick={signOut} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Sign Out
      </button>
    </div>
  );
}
