import { useState } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    AuthService.register(username, password).then(
      (response) => {
        if (response.data.token) {
          const userData = { ...response.data, encryptionKey: password };
          localStorage.setItem('user', JSON.stringify(userData));
          
          navigate('/notes');
          // FIX: Suppression de window.location.reload();
        } else {
           setMessage("Registration successful, but auto-login failed. Please log in manually.");
           setLoading(false);
        }
      },
      (error) => {
        const resMessage = (error.response?.data?.message) || error.message || error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
          <input id="username" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
        </button>
        {message && <div className="mt-4 text-center text-red-500 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default Register;
