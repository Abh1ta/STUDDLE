import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ActiveTimer.css';
import { useAvatar } from '../context/AvatarContext';
import { getCatImage } from '../utils/catImages';

const API_URL_SUBJECTS = '/api/subjects';
const API_URL_STUDY = '/api/study';

function generatePomodoroSessions(totalStudyMin) {
  const sessions = [];
  let remaining = totalStudyMin;
  let sessionCount = 1;
  while (remaining > 0) {
    const studyTime = Math.min(25, remaining);
    sessions.push({ type: 'study', minutes: studyTime, name: `Sesiunea ${sessionCount}` });
    remaining -= studyTime;
    if (remaining > 0) sessions.push({ type: 'break', minutes: 5, name: 'Pauză' });
    sessionCount++;
  }
  return sessions;
}

const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

function ActiveTimer() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { avatarData } = useAvatar();
  const catName = avatarData?.cat_name || 'Studdy';
  const customCatImage = getCatImage(avatarData?.skin_color, avatarData?.eye_color);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  const [activeNoteId, setActiveNoteId] = useState(null);
  const [availableNotes, setAvailableNotes] = useState([]);
  const [noteDropdownOpen, setNoteDropdownOpen] = useState(false);
  const [selectedNoteName, setSelectedNoteName] = useState('');


  const [penaltyResolved, setPenaltyResolved] = useState(null);

  useEffect(() => {
    if (selectedSubject) {
      fetch(`/api/materials/subject/${encodeURIComponent(selectedSubject)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setAvailableNotes(data);
          setActiveNoteId(null);
          setSelectedNoteName('');
        } else {
          setAvailableNotes([]);
          setActiveNoteId(null);
          setSelectedNoteName('');
        }
      })
      .catch(() => {
        setAvailableNotes([]);
        setActiveNoteId(null);
        setSelectedNoteName('');
      });
    } else {
      setAvailableNotes([]);
      setActiveNoteId(null);
      setSelectedNoteName('');
    }
  }, [selectedSubject]);

  const [phase, setPhase] = useState('setup');
  const [timerMode, setTimerMode] = useState('countdown');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [studyLimit, setStudyLimit] = useState(3600);
  const [continuousStudySecs, setContinuousStudySecs] = useState(0);
  const [snoozeCount, setSnoozeCount] = useState(0);

  const [sessionXp, setSessionXp] = useState(0);
  const backendSessionActive = useRef(false);

  const [pomodoroGoal, setPomodoroGoal] = useState(0);
  const [customStudy, setCustomStudy] = useState(50);
  const [customBreak, setCustomBreak] = useState(10);
  const [sessions, setSessions] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(API_URL_SUBJECTS, { headers: authHeaders });
        const data = await response.json();
        setSubjects(data.map((item) => ({ ...item, name: item.title || item.name })));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(API_URL_SUBJECTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ name: newSubjectName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Eroare backend:', errorData);
        alert(`Eroare: ${errorData.message || 'Nu s-a putut adăuga materia'}`);
        return;
      }

      const saved = await response.json();
      setSubjects([...subjects, { ...saved, name: saved.title || saved.name }]);
      setSelectedSubject(saved.title || saved.name);
      setNewSubjectName('');
      setSubjectOpen(false);
    } catch (e) {
      console.error('Eroare la adăugare materie:', e);
      alert(`Eroare: ${e.message}`);
    }
  };

  const startBackendSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const subjectObj = subjects.find((s) => s.name === selectedSubject);
      await fetch(`${API_URL_STUDY}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ subject_id: subjectObj ? subjectObj._id : null }),
      });
    } catch (error) {
      console.error('Eroare la pornirea sesiunii în backend:', error);
    }
  };

  
  const stopBackendSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${API_URL_STUDY}/stop`, {
        method: 'POST',
        headers: authHeaders,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.xpGained > 0) {
          setSessionXp((prev) => prev + data.xpGained);
        }
        if (data.penaltyResult?.resolved) {
          setPenaltyResolved(data.penaltyResult);
        }
      }
    } catch (error) {
      console.error('Eroare la oprirea sesiunii în backend:', error);
    }
  };
  

  useEffect(() => {
    const shouldBeActive = isRunning && phase === 'study';
    if (shouldBeActive && !backendSessionActive.current) {
      backendSessionActive.current = true;
      startBackendSession();
    } else if (!shouldBeActive && backendSessionActive.current) {
      backendSessionActive.current = false;
      stopBackendSession();
    }
  }, [isRunning, phase]);

  useEffect(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShowPopup(false);
    setShowEndPopup(false);
    setContinuousStudySecs(0);
    setSessionXp(0);
    setSnoozeCount(0);
    setPenaltyResolved(null); 

    if (mode === 'flowmodoro') {
      setPhase('study');
      setTimerMode('countup');
      setSecondsLeft(0);
    } else {
      setPhase('setup');
      setTimerMode('countdown');
    }
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        return timerMode === 'countup' ? prev + 1 : prev > 0 ? prev - 1 : 0;
      });
      if (phase === 'study') {
        setContinuousStudySecs((prevContinuous) => {
          const nextContinuous = prevContinuous + 1;
          if (nextContinuous >= studyLimit) {
            setShowPopup(true);
            setIsRunning(false);
          }
          return nextContinuous;
        });
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timerMode, phase, studyLimit]);

  useEffect(() => {
    if (timerMode === 'countdown' && secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setContinuousStudySecs(0);
      setSnoozeCount(0);
      if (mode === 'pomodoro') {
        const nextIndex = currentSessionIndex + 1;
        if (nextIndex < sessions.length) {
          setCurrentSessionIndex(nextIndex);
          setPhase(sessions[nextIndex].type);
          setSecondsLeft(sessions[nextIndex].minutes * 60);
        } else {
          setPhase('finished');
        }
      } else if (mode === 'custom') {
        const nextPhase = phase === 'study' ? 'break' : 'study';
        setPhase(nextPhase);
        setSecondsLeft((nextPhase === 'study' ? customStudy : customBreak) * 60);
      } else if (mode === 'flowmodoro') {
        setPhase('study');
        setTimerMode('countup');
        setSecondsLeft(0);
      }
    }
  }, [secondsLeft, timerMode, isRunning, mode, currentSessionIndex, sessions, customBreak, customStudy, phase]);

  const handleSetupStart = () => {
    setContinuousStudySecs(0);
    setSessionXp(0);
    setSnoozeCount(0);
    if (mode === 'pomodoro' && pomodoroGoal > 0) {
      const queue = generatePomodoroSessions(pomodoroGoal);
      setSessions(queue);
      setCurrentSessionIndex(0);
      setPhase('study');
      setSecondsLeft(queue[0].minutes * 60);
      setIsRunning(true);
    } else if (mode === 'custom' && customStudy > 0 && customBreak > 0) {
      setPhase('study');
      setSecondsLeft(customStudy * 60);
      setIsRunning(true);
    }
  };

  const handleFlowmodoroBreak = () => {
    setIsRunning(false);
    setShowPopup(false);
    setContinuousStudySecs(0);
    setSnoozeCount(0);
    const breakSecs = Math.max(60, Math.floor(secondsLeft / 5));
    setPhase('break');
    setTimerMode('countdown');
    setSecondsLeft(breakSecs);
  };

  const handleFinishSession = () => {
    setIsRunning(false);
    setShowPopup(false);
    setTimeout(() => {
      setShowEndPopup(true);
    }, 300);
  };

  const closeEndPopup = () => {
    setShowEndPopup(false);
    setContinuousStudySecs(0);
    setSessionXp(0);
    setSnoozeCount(0);
    setPenaltyResolved(null); 
    if (mode === 'flowmodoro') {
      setPhase('study');
      setTimerMode('countup');
      setSecondsLeft(0);
    } else {
      setPhase('setup');
    }
  };
  

  const handleSnooze = () => {
    if (snoozeCount < 3) {
      setSnoozeCount((prev) => prev + 1);
      setContinuousStudySecs(0);
      setShowPopup(false);
      setIsRunning(true);
    }
  };

  const getPhaseText = () => {
    if (phase === 'setup') return '';
    if (phase === 'finished') return 'Felicitări! Ai terminat totul.';
    if (mode === 'pomodoro') {
      const current = sessions[currentSessionIndex];
      const next = sessions[currentSessionIndex + 1];
      return current.type === 'study'
        ? `Acum: ${current.name} | Urmează: ${next ? next.name : 'Final'}`
        : `Acum: Pauză | Urmează: ${next ? next.name : 'Final'}`;
    }
    if (mode === 'custom')
      return phase === 'study' ? 'Acum: Studiu | Urmează: Pauză' : 'Acum: Pauză | Urmează: Studiu';
    if (mode === 'flowmodoro')
      return phase === 'study'
        ? 'Acum: Flowmodoro | Învață până simți că obosești'
        : 'Acum: Pauză | Revino la flow curând';
    return '';
  };

  return (
    <div
      className={`active-timer-page${activeNoteId && phase !== 'setup' ? ' with-editor' : ''}`}
      style={activeNoteId && phase !== 'setup' ? { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', padding: 0 } : {}}
    >
    
      {showPopup && (
        <div className="timer-popup-overlay">
          <div className="timer-popup-card">
            <h3 className="timer-popup-title">{catName} a obosit... luăm o pauză?</h3>
            <div className="timer-popup-img-box">
              <img src={customCatImage} alt={catName} className="studdy-avatar-popup" />
            </div>
            <div className="timer-popup-btns">
              <button
                className="popup-btn-yes"
                onClick={() => {
                  if (mode === 'flowmodoro') handleFlowmodoroBreak();
                  else {
                    setShowPopup(false);
                    setPhase('break');
                    setSecondsLeft(customBreak * 60);
                    setIsRunning(true);
                    setContinuousStudySecs(0);
                    setSnoozeCount(0);
                  }
                }}
              >
                Da, am nevoie
              </button>
              {snoozeCount < 3 ? (
                <button className="popup-btn-snooze" onClick={handleSnooze}>
                  Încă 2 minute ({3 - snoozeCount} rămase)
                </button>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '10px 0 0 0' }}>
                  Ai atins limita de amânări. Ia o pauză!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      
      {showEndPopup && (
        <div className="timer-popup-overlay">
          <div className="timer-popup-card">
            <h3 className="timer-popup-title" style={{ color: '#c9a0f0' }}>
              Sesiune Încheiată!
            </h3>
            <div className="timer-popup-img-box" style={{ borderColor: '#c9a0f0' }}>
              <img src={customCatImage} alt={`${catName} Fericit`} className="studdy-avatar-popup" />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '16px', lineHeight: '1.5' }}>
              Bravo! Ai acumulat <br />
              <strong style={{ color: '#ffffff', fontSize: '2.5rem', display: 'block', margin: '10px 0' }}>
                {sessionXp} XP
              </strong>
            </p>

           
            {penaltyResolved && (
              <div style={{
                background: 'rgba(100, 220, 130, 0.15)',
                border: '1px solid rgba(100, 220, 130, 0.45)',
                borderRadius: '12px',
                padding: '10px 16px',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                <p style={{ color: '#7fffaa', fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>
                  ✅ Penalizare rezolvată!
                </p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                  +{penaltyResolved.xp_restored} XP recuperat din penalizarea săptămânală.
                </p>
              </div>
            )}

            <div className="timer-popup-btns">
              <button className="popup-btn-yes" onClick={closeEndPopup}>
                Super, mulțumesc!
              </button>
            </div>
          </div>
        </div>
      )}

    
      <div
        className="active-timer-content"
        style={activeNoteId && phase !== 'setup' ? {
          flexDirection: 'row', padding: '6px 18px', justifyContent: 'space-between',
          alignItems: 'center', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)', zIndex: 50, margin: 0,
          maxWidth: '100%', width: '100%', minHeight: 0, gap: '12px',
        } : {}}
      >
        <button
          className="timer-back-btn"
          onClick={() => navigate('/timer')}
          style={activeNoteId && phase !== 'setup' ? { margin: 0 } : {}}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Înapoi
        </button>

        <div
          className="timer-main-card"
          style={activeNoteId && phase !== 'setup' ? {
            padding: '4px 10px', flexDirection: 'row', alignItems: 'center', gap: '12px',
            width: 'auto', margin: 0, background: 'transparent', border: 'none',
            boxShadow: 'none', backdropFilter: 'none', height: 'auto', minHeight: 0,
          } : {}}
        >
          {phase === 'setup' && mode === 'pomodoro' && (
            <>
              <h2 className="timer-setup-heading">Obiectiv Studiu (min)</h2>
              <div className="timer-setup-time-row">
                <input
                  className="timer-setup-digit-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={pomodoroGoal || ''}
                  onChange={(e) => setPomodoroGoal(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                />
                <span className="timer-setup-colon">:</span>
                <span className="timer-setup-digit-fixed">00</span>
              </div>
              <button className="timer-action-btn" onClick={handleSetupStart} disabled={!pomodoroGoal}>
                START
              </button>
            </>
          )}

          {phase === 'setup' && mode === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              <div>
                <h2 className="timer-setup-heading" style={{ fontSize: '1.2rem' }}>Durată Studiu</h2>
                <div className="timer-setup-time-row">
                  <input
                    className="timer-setup-digit-input"
                    style={{ fontSize: '4rem', width: '120px' }}
                    type="text"
                    inputMode="numeric"
                    value={customStudy || ''}
                    onChange={(e) => setCustomStudy(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                  />
                  <span className="timer-setup-colon" style={{ fontSize: '4rem' }}>:</span>
                  <span className="timer-setup-digit-fixed" style={{ fontSize: '4rem', width: '120px' }}>00</span>
                </div>
              </div>
              <div>
                <h2 className="timer-setup-heading" style={{ fontSize: '1.2rem' }}>Durată Pauză</h2>
                <div className="timer-setup-time-row">
                  <input
                    className="timer-setup-digit-input"
                    style={{ fontSize: '4rem', width: '120px' }}
                    type="text"
                    inputMode="numeric"
                    value={customBreak || ''}
                    onChange={(e) => setCustomBreak(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                  />
                  <span className="timer-setup-colon" style={{ fontSize: '4rem' }}>:</span>
                  <span className="timer-setup-digit-fixed" style={{ fontSize: '4rem', width: '120px' }}>00</span>
                </div>
              </div>
              <button
                className="timer-action-btn"
                onClick={handleSetupStart}
                disabled={!customStudy || !customBreak}
              >
                START
              </button>
            </div>
          )}

          {phase !== 'setup' && (
            <>
              <div
                className="timer-time-display"
                style={activeNoteId && phase !== 'setup' ? { fontSize: '2rem', letterSpacing: '2px', textShadow: 'none', lineHeight: 1 } : {}}
              >
                {formatTime(secondsLeft)}
              </div>
              {!(activeNoteId && phase !== 'setup') && (
                <p className="timer-phase-text">{getPhaseText()}</p>
              )}
              <div style={{ display: 'flex', gap: activeNoteId && phase !== 'setup' ? '8px' : '16px', justifyContent: 'center' }}>
                {phase === 'finished' ? (
                  <button className="timer-action-btn" onClick={handleFinishSession}>FINALIZAT</button>
                ) : (
                  <>
                    {mode === 'flowmodoro' && phase === 'study' ? (
                      <>
                        <button
                          className="timer-action-btn"
                          style={activeNoteId && phase !== 'setup' ? { padding: '6px 20px', fontSize: '0.78rem', letterSpacing: '1px' } : {}}
                          onClick={() => setIsRunning(!isRunning)}
                        >
                          {isRunning ? 'STOP' : secondsLeft === 0 ? 'START' : 'CONTINUĂ'}
                        </button>
                        {secondsLeft >= 5 && (
                          <button
                            className="timer-action-btn stop"
                            style={activeNoteId && phase !== 'setup' ? { padding: '6px 20px', fontSize: '0.78rem', letterSpacing: '1px' } : {}}
                            onClick={handleFlowmodoroBreak}
                          >
                            IA PAUZĂ (1/5)
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          className="timer-action-btn"
                          style={activeNoteId && phase !== 'setup' ? { padding: '6px 20px', fontSize: '0.78rem', letterSpacing: '1px' } : {}}
                          onClick={() => setIsRunning(!isRunning)}
                        >
                          {isRunning ? 'STOP' : 'CONTINUĂ'}
                        </button>
                        {!isRunning && (
                          <button
                            className="timer-action-btn stop"
                            style={activeNoteId && phase !== 'setup' ? { padding: '6px 20px', fontSize: '0.78rem', letterSpacing: '1px' } : {}}
                            onClick={handleFinishSession}
                          >
                            RENUNȚĂ
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {!(activeNoteId && phase !== 'setup') && (
          <div className="timer-subject-wrapper">
            <div
              className={`timer-subject-bar ${subjectOpen ? 'open' : ''}`}
              onClick={() => setSubjectOpen(!subjectOpen)}
            >
              {selectedSubject || (isLoadingSubjects ? '...' : 'Alege materie')}
              <svg className="subject-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {subjectOpen && (
              <div className="subject-dropdown">
                <div className="subject-add-row">
                  <input
                    type="text"
                    className="subject-add-input"
                    placeholder="Adaugă materie..."
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                  />
                  <button className="subject-add-btn" onClick={handleAddSubject} disabled={!newSubjectName.trim()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
                {subjects.map((s) => (
                  <div
                    key={s._id || s.name}
                    className={`subject-option ${selectedSubject === s.name ? 'selected' : ''}`}
                    onClick={() => { setSelectedSubject(s.name); setSubjectOpen(false); }}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!(activeNoteId && phase !== 'setup') && selectedSubject && availableNotes.length > 0 && (
          <div className="timer-subject-wrapper">
            <div
              className={`timer-subject-bar ${noteDropdownOpen ? 'open' : ''}`}
              onClick={() => setNoteDropdownOpen(!noteDropdownOpen)}
            >
              {selectedNoteName || 'Alege ce notiță deschidem'}
              <svg className="subject-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {noteDropdownOpen && (
              <div className="subject-dropdown">
                {availableNotes.map((note) => (
                  <div
                    key={note._id}
                    className={`subject-option ${activeNoteId === note._id ? 'selected' : ''}`}
                    onClick={() => { setActiveNoteId(note._id); setSelectedNoteName(note.nume); setNoteDropdownOpen(false); }}
                  >
                    {note.nume}
                  </div>
                ))}
                <div
                  className="subject-option"
                  style={{ fontStyle: 'italic', opacity: 0.7 }}
                  onClick={() => { setActiveNoteId(null); setSelectedNoteName('Fără notiță (Doar timer)'); setNoteDropdownOpen(false); }}
                >
                  Învață fără notiță
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeNoteId && phase !== 'setup' && (
        <div style={{ flex: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
          <iframe
            src={`/edit-material/${activeNoteId}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Editor Material"
          />
        </div>
      )}
    </div>
  );
}

export default ActiveTimer;