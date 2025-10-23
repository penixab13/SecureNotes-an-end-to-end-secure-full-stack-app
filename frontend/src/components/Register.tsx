import { useState } from 'react'; // React import removed
import AuthService from '../services/auth.service';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');

  // Added type React.FormEvent
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setSuccessful(false);
    AuthService.register(username, password).then(
      (response) => { setMessage(response.data.message); setSuccessful(true); },
      (error) => {
        const resMessage = (error.response?.data?.message) || error.message || error.toString();
        setMessage(resMessage); setSuccessful(false);
      }
    );
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      <form onSubmit={handleRegister}>
        {!successful && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
              <input id="username" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input id="password" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Sign Up</button>
          </div>
        )}
        {message && <div className={`mt-4 text-center text-sm ${successful ? 'text-green-500' : 'text-red-500'}`}>{message}</div>}
      </form>
    </div>
  );
};
export default Register;
