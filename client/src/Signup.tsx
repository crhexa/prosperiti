import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const siteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY_DEV;

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  //const router = useRouter();


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Trim inputs to remove extra spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (trimmedPassword !== confirmPassword.trim()) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });
  
      if (!response.ok) {
        const { message } = await response.json();
        setError(message || 'Signup failed.');
        return;
      }
  
      //router.push('//login'); // Redirect to login on success
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSignup}>
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          className="block w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="block w-full mb-3 p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="g-recaptcha mb-5" data-sitekey={siteKey}></div>
        {error && <div className="flex justify-center mb-3 mt-3"><p className="text-red-500">{error}</p></div>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Sign Up
        </button>
        <p className="text-center mt-3">
          Already have an account?{' '}
          <Link to="../login" className="text-blue-500 underline">Login</Link>
        </p>
      </form>
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    </div>
  );
}