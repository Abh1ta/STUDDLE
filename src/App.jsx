
import React from 'react';
import { Link } from 'react-router-dom';
import catAvatar from './assets/pisica.png';
import logoStuddle from './assets/logoStuddle.png';
import bgPerson from './assets/backgroundPerson.png';
function App() {
  return (
    <div className="min-h-screen bg-white font-sans relative overflow-hidden">
      {/* HEADER BAND */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-blue-100/70 -z-0" />

      <nav className="relative flex justify-between items-center px-12 h-28 z-10">
  {/* Logo */}
  <Link to="/" className="flex-shrink-0 flex items-center">
    <img
      src={logoStuddle}
      alt="Studdle logo"
      className="h-16 w-auto object-contain"
    />
  </Link>

  {/* Meniu + avatar */}
  <div className="flex items-center gap-8 text-sm font-bold text-blue-900/60">
    <a href="#" className="text-blue-900">ACASĂ</a>
    <a href="#" className="hover:text-blue-900 transition-colors">MATERIALE DE STUDIU</a>
    <a href="#" className="hover:text-blue-900 transition-colors">PRIETENI</a>
    <a href="#" className="hover:text-blue-900 transition-colors">SETĂRI</a>

    <Link
  to="/login"
  className="w-20 h-20 rounded-full border-2 border-white shadow-md overflow-hidden bg-white cursor-pointer hover:scale-110 transition-transform flex-shrink-0 flex items-center justify-center"
>
  <img 
    src={catAvatar} 
    alt="avatar" 
    className="w-full h-full object-cover" 
  />
</Link>
  </div>
</nav>
<main className="relative min-h-[calc(100vh-7rem)] px-10 z-10 overflow-hidden">
  
  {/* Container principal care NU este flex, pentru a permite suprapunerea */}
  <div className="relative w-full max-w-7xl mx-auto h-[calc(100vh-7rem)]">
    
    {/* Partea Stângă: Ilustrația ca element absolut */}
    <img
      src={bgPerson}
      alt=""
      aria-hidden="true"
      className="absolute left-5 bottom-30 h-[80%] w-auto object-contain object-left-bottom pointer-events-none select-none z-0" 
      /* h-[80%] o face să ocupe mult spațiu vertical, pornind de jos */
    />

    {/* Partea Dreaptă: Conținut text + butoane ca element absolut, suprapus */}
    <div className="absolute right-20 bottom-60 w-1/2 flex flex-col items-center text-center pr-10 z-10">
      <h1 className="text-3xl font-extrabold text-blue-950 mb-8 leading-tight">
        Transformă învățatul într-o<br />
        aventură cu Studdle
      </h1>

      <div className="flex justify-center gap-4">
        <button className="bg-gradient-to-br from-sky-400 to-blue-500 hover:brightness-110 text-white text-sm font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-200 transition-all whitespace-nowrap">
          Add assignment
        </button>
        <button className="bg-gradient-to-br from-indigo-400 to-purple-600 hover:brightness-110 text-white text-sm font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-200 transition-all whitespace-nowrap">
          View calendar
        </button>
      </div>
    </div>
  </div>
</main>
      
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FFD4B8] opacity-70 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] z-0" />
      {/* Mov pastel */}
      <div className="absolute -bottom-16 left-24 w-56 h-56 bg-[#E1C4FF] opacity-70 rounded-[55%_45%_60%_40%/45%_55%_50%_50%] z-0" />
      {/* Verde pastel */}
      <div className="absolute -bottom-12 right-40 w-40 h-40 bg-[#C3F0C9] opacity-70 rounded-full z-0" />
      {/* Albastru pastel */}
      <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-[#B8DFFF] opacity-80 rounded-[60%_40%_50%_50%/50%_50%_45%_55%] z-0" />
    </div>
  );
}

export default App;