import React, { useState } from 'react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister
      ? { username, email, password }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // redirect here, e.g. window.location.href = '/dashboard'
        console.log('Success:', data);
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-100 w-full max-w-md border border-blue-50">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-blue-900 italic mb-2">STUDDLE</h2>
          <p className="text-gray-400 font-medium">
            {isRegister ? 'Creează un cont nou' : 'Introdu datele pentru a intra în cont'}
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2 ml-1">Nume utilizator</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-blue-50/50 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
                placeholder="ion_popescu"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2 ml-1">Email student</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-blue-50/50 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
              placeholder="nume@student.ro"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2 ml-1">Parolă</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-blue-50/50 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5D5FEF] hover:bg-[#4A4CCF] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02] mt-4"
          >
            {loading ? 'Se încarcă...' : isRegister ? 'Creează cont' : 'Autentificare'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {isRegister ? 'Ai deja un cont? ' : 'Nu ai un cont? '}
            <span
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
            >
              {isRegister ? 'Autentifică-te' : 'Creează unul acum'}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;