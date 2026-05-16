/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ringImage from '../assets/Ellipse_56.png';

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
];

function TimerSelection() {
  const navigate = useNavigate();

  const handleSelect = (modeId) => {
    if (modeId === 'pomodoro') navigate('/timer/pomodoro?study=25&break=5');
    else navigate(`/timer/${modeId}`);
  };

  return (
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
    </div>
  );
}

export default TimerSelection;
