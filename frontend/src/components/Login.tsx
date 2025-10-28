import { useState } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

// Définir les props attendues par le composant
interface LoginProps {
  onLoginSuccess: () => void; // Fonction appelée après une connexion réussie
}

// Accepter les props
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setLoading(true);

    AuthService.login(username, password).then(
      () => {
        console.log("Login: AuthService.login successful."); // Log de débogage
        // FIX: Appeler la fonction de succès AVANT de naviguer
        onLoginSuccess();
        console.log("Login: onLoginSuccess called."); // Log de débogage
        navigate('/notes');
        console.log("Login: navigate('/notes') called."); // Log de débogage
        // Suppression de window.location.reload();
      },
      (error) => {
        // ... gestion des erreurs ...
        let resMessage = "Login failed. Please try again.";
        if (error.response) {
            if (error.response.status === 401) { resMessage = "Invalid username or password."; }
            else if (error.response.data?.message) { resMessage = error.response.data.message; }
        } else if (error.request) { resMessage = "No response from server."; }
        else { resMessage = error.message || error.toString(); }
        console.error("Login: AuthService.login failed:", error); // Log de débogage d'erreur
        setLoading(false); setMessage(resMessage);
      }
    );
  };

  // ... reste du JSX du formulaire ...
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      <form onSubmit={handleLogin}>
        {/* ... inputs ... */}
         <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
          <input id="username" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
        {message && <div className="mt-4 text-center text-red-500 text-sm">{message}</div>}
      </form>
    </div>
  );
};
export default Login;
