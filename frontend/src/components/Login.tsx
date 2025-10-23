import { useState } from 'react'; // React import removed
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Added type React.FormEvent
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setLoading(true);
    AuthService.login(username, password).then(
      () => { navigate('/notes'); window.location.reload(); },
      (error) => {
        const resMessage = (error.response?.data?.message) || error.message || error.toString();
        setLoading(false); setMessage(resMessage);
      }
    );
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
          <input id="username" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
        {message && <div className="mt-4 text-center text-red-500 text-sm">{message}</div>}
      </form>
    </div>
  );
};
export default Login;
