///o sa fie modificata :)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import './TimerSelection.css';

const timerModes = [
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    description: (
      <>
        Clasica tehnică în care lucrezi 25 minute cu pauză 5 minute. Ideal pentru{' '}
        <strong>disciplină</strong> și <em>sarcini rapide</em>.
      </>
    ),
  },
  {
    id: 'flowmodoro',
    title: 'Flowmodoro',
    description: (
      <>
        Lucrezi cât ai spor, apoi iei pauză 1/5 din timp. Ideal pentru <em>concentrare profundă</em>
        .
      </>
    ),
  },
  {
    id: 'custom',
    title: 'Ritm propriu',
    description: (
      <>
        Înveți după cum simți, cât simți. Ideal pentru <em>flexibilitate totală</em> și{' '}
        <em>relaxare</em>.
      </>
    ),
  },
];

function TimerSelection() {
  const navigate = useNavigate();

  const handleSelect = (modeId) => {
    // Acum toate modurile merg către ecranul de setup pentru a alege timpul
    navigate(`/timer/${modeId}`);
  };

  return (
    <div className="timer-selection-page">
      <Header />
      <main className="timer-selection-content">
        <h1 className="timer-selection-title">Alege tehnica de învățare</h1>

        <div className="timer-cards-grid">
          {timerModes.map((mode) => (
            <div key={mode.id} className="timer-card" onClick={() => handleSelect(mode.id)}>
              {/* Flashcard ring decoration */}
              <div className="flashcard-ring" />
              <div className="timer-card-text">
                <h2 className="timer-card-title">{mode.title}</h2>
                <p className="timer-card-description">{mode.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TimerSelection;
