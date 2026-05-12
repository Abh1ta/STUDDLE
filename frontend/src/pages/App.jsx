/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import catAvatar from '../assets/pisica.png'; 
import logoStuddle from '../assets/logoStuddle.png';
import bgPerson from '../assets/backgroundPerson.png';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans relative overflow-hidden" style={{ fontFamily: "'Zilla Slab', serif" }}>
      
      <div 
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #a7c4da 0%, #95bbe7 60%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      <div 
        className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #a7c4da 0%, #dd95e7 60%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      

      <main className="relative min-h-[calc(100vh-7rem)] px-10 z-10 overflow-hidden">
        
        <div className="relative w-full max-w-7xl mx-auto h-[calc(100vh-7rem)]">
          
          <img
            src={bgPerson}
            alt=""
            aria-hidden="true"
            className="absolute h-[82%] w-auto object-contain pointer-events-none select-none z-0"
            style={{ left: '10%', bottom: '18%' }}
          />

          <div
            className="absolute z-10 flex flex-col items-center text-center"
            style={{
              left: '35%',
              right: '21%',
              top: '35%',
            }}
          >
            <h1 className="text-3xl font-extrabold text-blue-950 mb-8 leading-tight">
              Transformă învățatul într-o<br />
              aventură cu Studdle
            </h1>
            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-br from-sky-400 to-blue-500 hover:brightness-110 text-white text-sm font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-200 transition-all whitespace-nowrap">
                Adaugă o materie
              </button>
              <button className="bg-gradient-to-br from-indigo-400 to-purple-600 hover:brightness-110 text-white text-sm font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-200 transition-all whitespace-nowrap">
                Vezi calendarul
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FFD4B8] opacity-70 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] z-0" />
      <div className="absolute -bottom-16 left-24 w-56 h-56 bg-[#E1C4FF] opacity-70 rounded-[55%_45%_60%_40%/45%_55%_50%_50%] z-0" />
      <div className="absolute -bottom-12 right-40 w-40 h-40 bg-[#C3F0C9] opacity-70 rounded-full z-0" />
      <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-[#B8DFFF] opacity-80 rounded-[60%_40%_50%_50%/50%_50%_45%_55%] z-0" />
    </div>
  );
}

export default App;