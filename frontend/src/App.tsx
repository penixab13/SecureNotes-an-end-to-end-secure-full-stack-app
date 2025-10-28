import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AuthService from './services/auth.service';
import Login from './components/Login';
import Register from './components/Register';
import Notes from './components/Notes';

type UserState = ReturnType<typeof AuthService.getCurrentUser>;

function App() {
  // L'état initial est toujours lu depuis localStorage
  const [currentUser, setCurrentUser] = useState<UserState>(AuthService.getCurrentUser());

  // Fonction pour mettre à jour l'état APRÈS une connexion réussie
  const handleLoginSuccess = () => {
    // Relire localStorage pour obtenir les données utilisateur mises à jour (avec le token et la clé)
    setCurrentUser(AuthService.getCurrentUser());
    console.log("App: handleLoginSuccess called, currentUser updated."); // Log de débogage
  };

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null);
    console.log("App: Logged out, currentUser set to null."); // Log de débogage
  };

  // Log initial pour voir l'état au montage
  console.log("App: Rendering with currentUser:", currentUser);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">SecureNotes</Link>
            <div>
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Welcome, {currentUser.username}</span>
                  {/* Utilisation de Link pour la cohérence SPA, onClick pour la logique */}
                  <Link to="/login" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out" onClick={logOut}>Logout</Link>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-blue-500 font-medium">Login</Link>
                  <Link to="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-8 flex justify-center">
          <Routes>
            {/* Passer la fonction onLoginSuccess au composant Login */}
            <Route path="/" element={currentUser ? <Navigate replace to="/notes" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/notes" element={currentUser ? <Notes /> : <Navigate replace to="/login" />} />
             {/* Passer la fonction onLoginSuccess au composant Login */}
            <Route path="/login" element={currentUser ? <Navigate replace to="/notes" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={currentUser ? <Navigate replace to="/notes" /> : <Register />} />
            <Route path="*" element={<Navigate replace to={currentUser ? "/notes" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
