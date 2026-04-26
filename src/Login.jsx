import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-100 w-full max-w-md border border-blue-50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-blue-900 italic mb-2">STUDDLE</h2>
          <p className="text-gray-400 font-medium">Introdu datele pentru a intra în cont</p>
        </div>
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2 ml-1">Email student</label>
            <input 
              type="email" 
              className="w-full px-6 py-4 rounded-2xl bg-blue-50/50 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
              placeholder="nume@student.ro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-blue-900 mb-2 ml-1">Parolă</label>
            <input 
              type="password" 
              className="w-full px-6 py-4 rounded-2xl bg-blue-50/50 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-[#5D5FEF] hover:bg-[#4A4CCF] text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02] mt-4">
            Autentificare
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Nu ai un cont? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Creează unul acum</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;