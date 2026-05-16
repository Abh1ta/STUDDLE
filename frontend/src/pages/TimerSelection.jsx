<<<<<<< HEAD
/* eslint-disable no-unused-vars */
=======
>>>>>>> varianta-mai-ok
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ringImage from '../assets/Ellipse_56.png';

<<<<<<< HEAD
const P = { navy: '#344979', blue: '#5d6da5', lavBlue: '#9896bb', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const timerModes = [
  {
    id: 'pomodoro', title: 'Pomodoro',
    description: 'Clasica tehnică în care lucrezi 25 minute cu pauză 5 minute. Ideal pentru disciplină și sarcini rapide.',
    accent: P.navy,
  },
  {
    id: 'flowmodoro', title: 'Flowmodoro',
    description: 'Lucrezi cât ai spor, apoi iei pauză 1/5 din timp. Ideal pentru concentrare profundă.',
    accent: P.blue,
  },
  {
    id: 'custom', title: 'Ritm propriu',
    description: 'Înveți după cum simți, setând propriile tale limite. Ideal pentru flexibilitate totală și relaxare.',
    accent: P.lavBlue,
  },
=======
const timerModes = [
  { id: 'pomodoro', title: 'Pomodoro', description: (<>Clasica tehnică în care lucrezi 25 minute cu pauză 5 minute. Ideal pentru <strong>disciplină</strong> și <strong>sarcini rapide</strong>.</>) },
  { id: 'flowmodoro', title: 'Flowmodoro', description: (<>Lucrezi cât ai spor, apoi iei pauză 1/5 din timp. Ideal pentru <strong>concentrare profundă</strong>.</>) },
  { id: 'custom', title: 'Ritm propriu', description: (<>Înveți după cum simți, setând propriile tale limite. Ideal pentru <strong>flexibilitate totală</strong> și <strong>relaxare</strong>.</>) },
>>>>>>> varianta-mai-ok
];

function TimerSelection() {
  const navigate = useNavigate();

  const handleSelect = (modeId) => {
    if (modeId === 'pomodoro') navigate('/timer/pomodoro?study=25&break=5');
    else navigate(`/timer/${modeId}`);
  };

  return (
<<<<<<< HEAD
    <div
      className="min-h-screen flex flex-col items-center pt-16 pb-20 px-8"
      style={{ background: `linear-gradient(135deg, ${P.blush} 0%, #ffffff 40%, ${P.lavLight}55 100%)`, fontFamily: 'Zilla Slab, serif' }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P.lavLight}80 0%, transparent 70%)`, filter: 'blur(70px)' }} />

      <h1 className="text-3xl font-black mb-2 text-center" style={{ color: P.navy }}>Alege tehnica de învățare</h1>
      <p className="text-sm mb-12 text-center" style={{ color: P.lavBlue }}>Selectează modul care ți se potrivește</p>
      <div className="h-[2px] w-48 rounded-full mb-12 -mt-8" style={{ background: `linear-gradient(90deg, ${P.navy}, ${P.lavLight})` }} />

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
        {timerModes.map(mode => (
          <div
            key={mode.id}
            onClick={() => handleSelect(mode.id)}
            className="relative cursor-pointer rounded-3xl transition-all duration-200 hover:-translate-y-2"
            style={{
              width: '340px',
              minHeight: '190px',
              padding: '32px 28px 32px 56px',
              background: 'rgba(255,255,255,0.82)',
              border: `2px solid ${mode.accent}33`,
              boxShadow: `0 4px 20px ${mode.accent}22`,
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Colored dot top-left */}
            <div style={{
              position: 'absolute', top: '14px', left: '14px',
              width: '26px', height: '26px', borderRadius: '50%',
              background: mode.accent, opacity: 0.25,
              border: `2px solid ${mode.accent}`,
            }} />

            {/* Ring image */}
            <img src={ringImage} alt="ring" style={{
              position: 'absolute', left: '-24px', top: '22%',
              transform: 'translateY(-50%)', width: '50px', height: 'auto',
              filter: `drop-shadow(2px 3px 4px ${mode.accent}55)`,
              pointerEvents: 'none',
            }} />

            <h2 className="text-3xl font-black mb-3" style={{ color: mode.accent }}>{mode.title}</h2>
            <p className="text-base leading-relaxed" style={{ color: P.navy }}>{mode.description}</p>

            {/* Arrow */}
            <div className="absolute bottom-5 right-6 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg font-bold shadow"
              style={{ background: `linear-gradient(135deg, ${mode.accent}, ${P.navy})` }}>
              →
            </div>
          </div>
        ))}
      </div>
=======
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #8d91c7 0%, #e0c5e6a6 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '180px',
      fontFamily: 'Roboto Slab, serif',
      margin: 0,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&display=swap');`}</style>
      
      <main style={{ width: '100%', maxWidth: '1400px', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 700, color: '#26222b', marginBottom: '60px' }}>
          Alege tehnica de învățare
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
          {timerModes.map((mode) => (
            <div
              key={mode.id}
              className="timer-card"
              onClick={() => handleSelect(mode.id)}
              style={{
                backgroundColor: '#cacee27d',
                border: '2px solid #332D51',
                borderRadius: '12px',
                width: '420px',
                minHeight: '180px',
                padding: '35px 30px 35px 70px',
                position: 'relative',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '4px 5px 0px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              
              {/* --- 1. CERCUL PENTRU CARDUL DIN STÂNGA (Pomodoro) --- */}
              {mode.id === 'pomodoro' && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '0.7rem',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#D6C7E4', // MODIFICĂ AICI DOAR PENTRU STÂNGA
                  borderRadius: '50%',
                  border: '2px solid #332D51',
                  zIndex: 9, // Am pus zIndex mai mare să fie sigur vizibil
                }}></div>
              )}

              {/* --- 2. CERCUL PENTRU CARDUL DIN MIJLOC (Flowmodoro) --- */}
              {mode.id === 'flowmodoro' && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '0.7rem',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#A4A3D1', // MODIFICĂ AICI DOAR PENTRU MIJLOC
                  borderRadius: '50%',
                  border: '2px solid #332D51',
                  zIndex: 9,
                }}></div>
              )}

              {/* --- 3. CERCUL PENTRU CARDUL DIN DREAPTA (Ritm propriu) --- */}
              {mode.id === 'custom' && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '0.7rem',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#ADAAD5', // MODIFICĂ AICI DOAR PENTRU DREAPTA
                  borderRadius: '50%',
                  border: '2px solid #332D51',
                  zIndex: 9,
                }}></div>
              )}

              {mode.id === 'pomodoro' && (
                <img
                  src={ringImage}
                  alt="ring"
                  style={{
                    position: 'absolute',
                    left: '-28.5px',
                    top: '20%',
                    transform: 'translateY(-50%)',
                    width: '55px',
                    height: 'auto',
                    zIndex: 10,
                    pointerEvents: 'none',
                    filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))',
                  }}
                />
              )}

              {mode.id === 'flowmodoro' && (
                <img
                  src={ringImage}
                  alt="ring"
                  style={{
                    position: 'absolute',
                    left: '-28.5px',
                    top: '20%',
                    transform: 'translateY(-50%)',
                    width: '55px',
                    height: 'auto',
                    zIndex: 10,
                    pointerEvents: 'none',
                    filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))',
                  }}
                />
              )}

              {mode.id === 'custom' && (
                <img
                  src={ringImage}
                  alt="ring"
                  style={{
                    position: 'absolute',
                    left: '-28px',
                    top: '20%',
                    transform: 'translateY(-50%)',
                    width: '55px',
                    height: 'auto',
                    zIndex: 10,
                    pointerEvents: 'none',
                    filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))',
                  }}
                />
              )}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '2.6rem', fontWeight: 720, color: '#332D51', margin: '0 0 12px 0', lineHeight: 1.1 }}>
                  {mode.title}
                </h2>
                <p style={{ fontSize: '1.3rem', color: '#111111', lineHeight: 1.5, margin: 0 }}>
                  {mode.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </main>

      <style>{`
        .timer-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 7px 8px 0px rgba(0, 0, 0, 0.2);
        }
        p strong { font-weight: 700; }
        @media (max-width: 1300px) { .timer-card { width: 380px; } }
        @media (max-width: 1000px) { .timer-cards-grid { flex-direction: column; align-items: center; } }
      `}</style>
>>>>>>> varianta-mai-ok
    </div>
  );
}

<<<<<<< HEAD
export default TimerSelection;
=======
export default TimerSelection;
>>>>>>> varianta-mai-ok
