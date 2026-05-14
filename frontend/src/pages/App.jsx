/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import catAvatar from '../assets/pisica.png'; 
import logoStuddle from '../assets/logoStuddle.png';
import bgPerson from '../assets/backgroundPerson.png';
import FriendRequestNotification from '../Components/FriendRequestNotification.jsx';

const stilMesajCentral = {
  container: {
    position: 'absolute',
    top: '30%',
    left: '42%',
    width: '600px',
    textAlign: 'center',
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  titlu: {
    fontSize: '42px',
    fontWeight: 800,
    color: '#172554',
    marginBottom: '2.5rem',
    lineHeight: '1.2'
  }
};

function App() {
  return (
    <div className="min-h-screen bg-white font-sans relative overflow-hidden" style={{ fontFamily: "'Zilla Slab', serif" }}>
      
      {/* Background Glows */}
      <div 
        className="absolute pointer-events-none"
        style={{ 
          bottom: '-100px', left: '150px', width: '600px', height: '600px', borderRadius: '60%', 
          background: 'radial-gradient(circle, #a7c4da 0%, #95bbe7 60%)', 
          filter: 'blur(50px)', opacity: 0.3, zIndex: 0 
        }} 
      />
      <div 
        className="absolute pointer-events-none"
        style={{ 
          top: '-100px', right: '120px', width: '600px', height: '600px', borderRadius: '60%', 
          background: 'radial-gradient(circle, #a7c4da 0%, #925f9b 80%)', 
          filter: 'blur(40px)', opacity: 0.2, zIndex: 0 
        }} 
      />

      <main className="relative min-h-screen z-10">
        <div className="relative w-full h-screen">
          
          <img
            src={bgPerson}
            alt=""
            className="absolute h-auto w-[65%] pointer-events-none select-none"
            style={{ left: '18%', bottom: '23%', zIndex: 5 }}
          />

          <div style={stilMesajCentral.container}>
            <h1 style={stilMesajCentral.titlu}>
              Transformă învățatul într-o<br />aventură cu Studdle
            </h1>

            <div className="flex justify-center gap-5">
              {/* Button 1: Add Subject */}
              <Link to="/chat" style={{ textDecoration: 'none' }}>
                <button 
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  style={{
                      boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.5)', 
                      width: '200px', 
                      padding: '14px', 
                      borderRadius: '50px', 
                      border: 'none', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      background: 'linear-gradient(to right, #5EB0E6, #457493)', 
                      transition: 'transform 0.3s ease', 
                      zIndex: 30 
                  }}
                >
                  Comunică cu prietenii
                </button>
              </Link>

              {/* Button 2: View Calendar */}
              <Link to="/materiale" style={{ textDecoration: 'none' }}>
                <button 
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  style={{ 
                      boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.5)', 
                      width: '200px', 
                      padding: '14px', 
                      borderRadius: '50px', 
                      border: 'none', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      background: 'linear-gradient(to right, #7C75A0, #332D51)', 
                      transition: 'transform 0.3s ease', 
                      zIndex: 30 
                  }}
                >
                  Vezi materialele tale
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Interactive Bottom Circles */}
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '80px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '20px'}
           style={{ position: 'absolute', left: '-20px', bottom: '20px', width: '250px', height: '250px', backgroundColor: '#554b7e', borderRadius: '50%', opacity: 0.8, filter: 'blur(2px)', transition: 'bottom 0.6s ease-out', cursor: 'pointer', zIndex: 10 }} />

      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '70px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '10px'}
           style={{ position: 'absolute', left: '120px', bottom: '10px', width: '200px', height: '200px', backgroundColor: '#a9c7f0', borderRadius: '50%', opacity: 0.8, filter: 'blur(3px)', transition: 'bottom 0.8s ease-out', cursor: 'pointer', zIndex: 10 }} />

      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '90px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '10px'}
           style={{ position: 'absolute', right: '160px', bottom: '10px', width: '180px', height: '180px', backgroundColor: '#7983c2', borderRadius: '50%', opacity: 0.8, filter: 'blur(2px)', transition: 'bottom 0.5s ease-out', cursor: 'pointer', zIndex: 10 }} />

      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '60px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '-20px'}
           style={{ position: 'absolute', right: '-40px', bottom: '-20px', width: '300px', height: '300px', backgroundColor: '#578fc0', borderRadius: '50%', opacity: 0.8, filter: 'blur(2px)', transition: 'bottom 0.7s ease-out', cursor: 'pointer', zIndex: 10 }} />

      <FriendRequestNotification />
    </div>
  );
}

export default App;