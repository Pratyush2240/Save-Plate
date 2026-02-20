import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Demo auth
import { loginWithEmail, loginWithGoogle, getCurrentUser, isDemo } from '../demo/demoAuth';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.303 7.618C34.341 4.045 29.441 2 24 2C11.82 2 2 11.82 2 24s9.82 22 22 22s22-9.82 22-22c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691c-1.32.493-2.541 1.096-3.694 1.819L6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.32-4.402 2.108-7.219 2.108-5.225 0-9.655-3.449-11.231-8.168l-6.709 5.093C6.306 39.691 14.639 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.858 35.817 44 30.131 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isDemo()) {
        const user = loginWithEmail(email, password);
        if (user.role === 'customer') navigate('/customer'); else navigate('/restaurant');
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) throw new Error('Login failed: User data not found. Please sign up.');
      const userData = userDoc.data();
      if (userData.role === 'customer') navigate('/customer'); else navigate('/restaurant');
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (isDemo()) {
        const user = loginWithGoogle();
        if (user.role === 'customer') navigate('/customer'); else navigate('/restaurant');
        return;
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) throw new Error('No account found. Please sign up first to set your role.');
      const userData = userDoc.data();
      if (userData.role === 'customer') navigate('/customer'); else navigate('/restaurant');
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.log("Google sign-in cancelled by user.");
      } else {
        console.error("Error with Google sign in:", error);
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-manrope">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <Link to="/" className="text-3xl font-extrabold text-saveplate-green mb-4 inline-block">SavePlate</Link>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Log In</h2>
        
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-sm font-semibold text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saveplate-green"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saveplate-green"
            />
          </div>
          <button type="submit" className="w-full bg-saveplate-green text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors mt-4">
            Log In
          </button>
        </form>
        <p className="mt-6 text-sm">
          Need an account? <Link to="/signup" className="font-semibold text-saveplate-green hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}