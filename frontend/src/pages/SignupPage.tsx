import React, { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup(username, email, password);
      const { accessToken, userId } = res.data;
      localStorage.setItem('jwt', accessToken);
      localStorage.setItem('userId', userId);
      navigate('/chat');
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
        <input className="w-full p-2 border rounded mb-3" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Sign Up</button>
        <p className="mt-2 text-sm text-gray-500">Already have account? <Link to="/login" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
};
