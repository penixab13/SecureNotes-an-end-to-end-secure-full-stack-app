import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AuthService from './services/auth.service';
import Login from './components/Login';
import Register from './components/Register';
import Notes from './components/Notes';

// Define the type for the currentUser state
// Matches the return type of AuthService.getCurrentUser()
type UserState = ReturnType<typeof AuthService.getCurrentUser>;

function App() {
  const [currentUser, setCurrentUser] = useState<UserState>(AuthService.getCurrentUser());

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null); // Changed from undefined to null
  };

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
            <Route path="/" element={currentUser ? <Navigate replace to="/notes" /> : <Login />} />
            <Route path="/notes" element={currentUser ? <Notes /> : <Navigate replace to="/login" />} />
            <Route path="/login" element={currentUser ? <Navigate replace to="/notes" /> : <Login />} />
            <Route path="/register" element={currentUser ? <Navigate replace to="/notes" /> : <Register />} />
            <Route path="*" element={<Navigate replace to={currentUser ? "/notes" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
