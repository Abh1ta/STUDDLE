/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ringImage from '../assets/Ellipse_56.png';

const timerModes = [
  { id: 'pomodoro', title: 'Pomodoro', description: (<>Clasica tehnică în care lucrezi 25 minute cu pauză 5 minute. Ideal pentru <strong>disciplină</strong> și <strong>sarcini rapide</strong>.</>) },
  { id: 'flowmodoro', title: 'Flowmodoro', description: (<>Lucrezi cât ai spor, apoi iei pauză 1/5 din timp. Ideal pentru <strong>concentrare profundă</strong>.</>) },
  { id: 'custom', title: 'Ritm propriu', description: (<>Înveți după cum simți, setând propriile tale limite. Ideal pentru <strong>flexibilitate totală</strong> și <strong>relaxare</strong>.</>) },
];

function TimerSelection() {
  const navigate = useNavigate();

  const handleSelect = (modeId) => {
    if (modeId === 'pomodoro') navigate('/timer/pomodoro?study=25&break=5');
    else navigate(`/timer/${modeId}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #c6b8df 0%, #ffffff 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '180px',
      fontFamily: 'Roboto Slab, serif',
      margin: 0,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&display=swap');`}</style>
      
      <main style={{ width: '100%', maxWidth: '1400px', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 700, color: '#000000', marginBottom: '60px' }}>
          Alege tehnica de învățare
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
          {timerModes.map((mode) => (
            <div
              key={mode.id}
              className="timer-card"
              onClick={() => handleSelect(mode.id)}
              style={{
                backgroundColor: '#aab5ed78',
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
                  backgroundColor: '#F1EDF7', // MODIFICĂ AICI DOAR PENTRU STÂNGA
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
                  backgroundColor: '#D7CDE9', // MODIFICĂ AICI DOAR PENTRU MIJLOC
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
                  backgroundColor: '#DBD3EB', // MODIFICĂ AICI DOAR PENTRU DREAPTA
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

              {mode.id === 'flowmodoro' && (
                <img
                  src={ringImage}
                  alt="ring"
                  style={{
                    position: 'absolute',
                    left: '-29px',
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
    </div>
  );
}

export default TimerSelection;
