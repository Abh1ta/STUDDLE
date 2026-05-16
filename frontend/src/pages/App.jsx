/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import catAvatar from '../assets/pisica.png';
import logoStuddle from '../assets/logoStuddle.png';
import bgPerson from '../assets/backgroundPerson.png';
<<<<<<< HEAD
import FriendRequestNotification from '../Components/FriendRequestNotification.jsx';
=======
import FriendRequestNotification from '../components/FriendRequestNotification.jsx';
import { useSidebar } from '../context/SidebarContext.jsx';
>>>>>>> varianta-mai-ok

const P = { navy: '#344979', blue: '#5d6da5', lav: '#9896bb', lavLight: '#c6c6e8', blush: '#f7e5eb' };

function App() {
<<<<<<< HEAD
=======
  const { collapsed } = useSidebar();
>>>>>>> varianta-mai-ok
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${P.blush} 0%, #ffffff 45%, ${P.lavLight}40 100%)`,
      fontFamily: "'Zilla Slab', serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', bottom: '-100px', left: '150px', width: '600px', height: '600px', borderRadius: '60%', background: `radial-gradient(circle, ${P.lavLight} 0%, ${P.lav} 60%)`, filter: 'blur(60px)', opacity: 0.3, zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-100px', right: '120px', width: '600px', height: '600px', borderRadius: '60%', background: `radial-gradient(circle, ${P.blush} 0%, ${P.lavLight} 80%)`, filter: 'blur(50px)', opacity: 0.45, zIndex: 0, pointerEvents: 'none' }} />

      <main style={{ position: 'relative', minHeight: '100vh', zIndex: 10 }}>
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>

          <img src={bgPerson} alt=""
<<<<<<< HEAD
            style={{ position: 'absolute', height: 'auto', width: '65%', left: '18%', bottom: '23%', zIndex: 5, pointerEvents: 'none', userSelect: 'none' }}
          />

          {/* Central message */}
          <div style={{ position: 'absolute', top: '30%', left: '42%', width: '600px', textAlign: 'center', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: P.navy, marginBottom: '2.5rem', lineHeight: '1.2' }}>
              Transformă învățatul într-o<br />aventură cu Studdle
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
=======
            style={{ position: 'absolute', height: 'auto', width: '65%', left: collapsed ? '15%' : '8%', bottom: '23%', zIndex: 5, pointerEvents: 'none', userSelect: 'none', transition: 'left 0.3s ease' }}
          />

          {/* Central message */}
          <div style={{ position: 'absolute', top: '30%', left: collapsed ? '45%' : '50%', width: collapsed ? '600px' : '500px', textAlign: 'center', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s ease' }}>
            <h1 style={{ fontSize: collapsed ? '42px' : '36px', fontWeight: 800, color: P.navy, marginBottom: '2.5rem', lineHeight: '1.2', transition: 'font-size 0.3s ease' }}>
              Transformă învățatul într-o<br />aventură cu Studdle
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
>>>>>>> varianta-mai-ok
              <Link to="/chat" style={{ textDecoration: 'none' }}>
                <button
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  style={{ boxShadow: `0 15px 30px -5px rgba(52,73,121,0.4)`, width: '200px', padding: '14px', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer', background: `linear-gradient(135deg, ${P.lav}, ${P.blue})`, transition: 'transform 0.3s ease', zIndex: 30, fontFamily: 'inherit', fontSize: '0.95rem' }}
                >
                  Comunică cu prietenii
                </button>
              </Link>

              <Link to="/materiale" style={{ textDecoration: 'none' }}>
                <button
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  style={{ boxShadow: `0 15px 30px -5px rgba(52,73,121,0.4)`, width: '200px', padding: '14px', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer', background: `linear-gradient(135deg, ${P.blue}, ${P.navy})`, transition: 'transform 0.3s ease', zIndex: 30, fontFamily: 'inherit', fontSize: '0.95rem' }}
                >
                  Vezi materialele tale
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive bottom circles */}
<<<<<<< HEAD
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '80px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '20px'}
        style={{ position: 'absolute', left: '-20px', bottom: '20px', width: '250px', height: '250px', backgroundColor: P.navy, borderRadius: '50%', opacity: 0.6, filter: 'blur(2px)', transition: 'bottom 0.6s ease-out', cursor: 'pointer', zIndex: 10 }} />
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '70px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '10px'}
        style={{ position: 'absolute', left: '120px', bottom: '10px', width: '200px', height: '200px', backgroundColor: P.lavLight, borderRadius: '50%', opacity: 0.75, filter: 'blur(3px)', transition: 'bottom 0.8s ease-out', cursor: 'pointer', zIndex: 10 }} />
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '90px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '10px'}
        style={{ position: 'absolute', right: '160px', bottom: '10px', width: '180px', height: '180px', backgroundColor: P.lav, borderRadius: '50%', opacity: 0.7, filter: 'blur(2px)', transition: 'bottom 0.5s ease-out', cursor: 'pointer', zIndex: 10 }} />
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '60px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '-20px'}
        style={{ position: 'absolute', right: '-40px', bottom: '-20px', width: '300px', height: '300px', backgroundColor: P.blush, borderRadius: '50%', opacity: 0.85, filter: 'blur(2px)', transition: 'bottom 0.7s ease-out', cursor: 'pointer', zIndex: 10 }} />
=======
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '-90px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '-130px'}
        style={{ position: 'absolute', left: '-20px', bottom: '-130px', width: '250px', height: '250px', backgroundColor: P.navy, borderRadius: '50%', opacity: 0.6, filter: 'blur(2px)', transition: 'bottom 0.6s ease-out', cursor: 'pointer', zIndex: 10 }} />
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '-50px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '-100px'}
        style={{ position: 'absolute', left: '120px', bottom: '-100px', width: '200px', height: '200px', backgroundColor: P.lavLight, borderRadius: '50%', opacity: 0.75, filter: 'blur(3px)', transition: 'bottom 0.8s ease-out', cursor: 'pointer', zIndex: 10 }} />
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '-30px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '-80px'}
        style={{ position: 'absolute', right: '160px', bottom: '-80px', width: '180px', height: '180px', backgroundColor: P.lav, borderRadius: '50%', opacity: 0.7, filter: 'blur(2px)', transition: 'bottom 0.5s ease-out', cursor: 'pointer', zIndex: 10 }} />
      <div onMouseEnter={(e) => e.currentTarget.style.bottom = '-120px'} onMouseLeave={(e) => e.currentTarget.style.bottom = '-170px'}
        style={{ position: 'absolute', right: '-40px', bottom: '-170px', width: '300px', height: '300px', backgroundColor: P.blush, borderRadius: '50%', opacity: 0.85, filter: 'blur(2px)', transition: 'bottom 0.7s ease-out', cursor: 'pointer', zIndex: 10 }} />
>>>>>>> varianta-mai-ok

      <FriendRequestNotification />
    </div>
  );
}

export default App;
