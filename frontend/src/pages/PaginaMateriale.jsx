import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaginaMateriale.css';
import spiraleImg from "../assets/Group 24.png";
import { useAuth } from '../context/AuthContext';

const P = { navy: '#344979', blue: '#5d6da5', lavBlue: '#5d6da5', lavLight: '#c6c6e8', blush: '#f7e5eb' };

const culori        = ['#3b4d9b'];
const culoriCaiete  = ['#3b4d9b'];
const culoriExamene = ['#f03a17', '#c9334c', '#a62c7b', '#8224ab', '#5b1bf1'];

const luniAn = ["IANUARIE","FEBRUARIE","MARTIE","APRILIE","MAI","IUNIE","IULIE","AUGUST","SEPTEMBRIE","OCTOMBRIE","NOIEMBRIE","DECEMBRIE"];

const apiFetch = (url, token, options = {}) =>
  fetch(url, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) }, credentials: 'include' });

const ArrowBtn = ({ color }) => (
  <div style={{ width: 40, height: 40, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${color}55`, cursor: 'pointer' }}>
    <span style={{ color: '#fff', fontSize: 18, lineHeight: 1 }}>›</span>
  </div>
);

const numeDinFisier = (file) => file?.name ? file.name.replace(/\.[^/.]+$/, "") : "";

const PaginaMateriale = () => {
  const { token } = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();

  const inputFisierMaterieRef = useRef(null);
  const inputFisierTemaRef    = useRef(null);

  const [materii,  setMaterii]  = useState([]);
  const [teme,      setTeme]     = useState([]);
  const [examene,  setExamene]  = useState([]);

  const [showPopup,        setShowPopup]        = useState(false);
  const [showPopupTeme,   setShowPopupTeme]   = useState(false);
  const [showPopupExamen, setShowPopupExamen] = useState(false);

  const [numeNou,        setNumeNou]        = useState('');
  const [numeNouTema,    setNumeNouTema]    = useState('');
  const [numeExamen,     setNumeExamen]     = useState('');
  const [dificultateSel, setDificultateSel] = useState(null);
  const [dataExamen,     setDataExamen]     = useState('');
  const [dataCalendar,   setDataCalendar]   = useState(new Date());

  const [fisierMaterie, setFisierMaterie] = useState(null);
  const [fisierTema,    setFisierTema]    = useState(null);

  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  //  funcționalitatea de notițe
  const [selectedSubject, setSelectedSubject] = useState(null); 
  const [notesList, setNotesList] = useState([]); 
  const [showNotesModal, setShowNotesModal] = useState(false);

  const showToast = (msg, type = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* normalizare */
  const normMaterie = (item) => ({ ...item, id: item._id || item.id, nume: item.title || item.name || 'Materie', culoare: item.color || item.culoare || '#7c83b3' });
  const normTema    = (item) => ({ ...item, id: item._id || item.id, nume: item.title || item.name || 'Temă',    culoare: item.color || item.culoare || '#5ca0e8' });
  const normExamen  = (item) => {
    const raw = item.date || item.data || item.examDate || '';
    const parts = String(raw).slice(0, 10).split('-');
    const dataText = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '';
    return { ...item, id: item._id || item.id, nume: item.title || item.name || 'Examen', culoare: item.color || item.culoare || '#f03a17', data: String(raw).slice(0, 10), dataText };
  };

 
  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [resM, resT, resE] = await Promise.all([
          apiFetch('/api/subjects', token),
          apiFetch('/api/homework', token),
          apiFetch('/api/exams',    token),
        ]);
        if (resM.ok) setMaterii((await resM.json()).map(normMaterie));
        if (resT.ok) setTeme((await resT.json()).map(normTema));
        if (resE.ok) setExamene((await resE.json()).map(normExamen));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [token]);


  const handleAlegeFisierMaterie = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'ppt', 'pptx'].includes(ext)) { showToast('Poți încărca doar PDF, PPT sau PPTX.', 'err'); return; }
    setFisierMaterie(file);
    if (!numeNou.trim()) setNumeNou(numeDinFisier(file));
  };

  const handleAlegeFisierTema = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'ppt', 'pptx'].includes(ext)) { showToast('Poți încărca doar PDF, PPT sau PPTX.', 'err'); return; }
    setFisierTema(file);
    if (!numeNouTema.trim()) setNumeNouTema(numeDinFisier(file));
  };

  const adaugaMaterie = async () => {
    const numeFinal = numeNou.trim() || numeDinFisier(fisierMaterie);
    if (!numeFinal) return;
    const r = await apiFetch('/api/subjects', token, { method: 'POST', body: JSON.stringify({ title: numeFinal, color: culori[materii.length % culori.length] }) });
    if (!r.ok) { showToast('Eroare la adăugare.', 'err'); return; }
    const saved = normMaterie(await r.json());
    setMaterii(p => [...p, saved]);
    const file = fisierMaterie;
    setNumeNou(''); setFisierMaterie(null); setShowPopup(false);
    if (inputFisierMaterieRef.current) inputFisierMaterieRef.current.value = '';
    
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const noteRes = await apiFetch('/api/materials/note/new', token, {
        method: 'POST',
        body: JSON.stringify({ materialId: saved.nume, nume: file.name })
      });
      if(noteRes.ok){
         const newNote = await noteRes.json();
         navigate(`/edit-material/${newNote._id}`, { state: { uploadedFile: file, uploadedFileUrl: URL.createObjectURL(file), uploadedFileName: file.name, uploadedFileType: ext } });
      }
    }
  };

  const adaugaTema = async () => {
    const numeFinal = numeNouTema.trim() || numeDinFisier(fisierTema);
    if (!numeFinal) return;
    const r = await apiFetch('/api/homework', token, { method: 'POST', body: JSON.stringify({ title: numeFinal, color: culoriCaiete[teme.length % culoriCaiete.length] }) });
    if (!r.ok) { showToast('Eroare la adăugare.', 'err'); return; }
    const saved = normTema(await r.json());
    setTeme(p => [...p, saved]);
    const file = fisierTema;
    setNumeNouTema(''); setFisierTema(null); setShowPopupTeme(false);
    if (inputFisierTemaRef.current) inputFisierTemaRef.current.value = '';
    
     if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const noteRes = await apiFetch('/api/materials/note/new', token, {
        method: 'POST',
        body: JSON.stringify({ materialId: saved.nume, nume: file.name })
      });
      if(noteRes.ok){
         const newNote = await noteRes.json();
         navigate(`/edit-material/${newNote._id}`, { state: { uploadedFile: file, uploadedFileUrl: URL.createObjectURL(file), uploadedFileName: file.name, uploadedFileType: ext } });
      }
    }
  };

  const adaugaExamen = async () => {
    if (!numeExamen.trim() || !dificultateSel || !dataExamen) return;
    const r = await apiFetch('/api/exams', token, { method: 'POST', body: JSON.stringify({ title: numeExamen, color: dificultateSel, date: dataExamen }) });
    if (r.ok) { const s = await r.json(); setExamene(p => [...p, normExamen(s)]); }
    setNumeExamen(''); setDificultateSel(null); setDataExamen(''); setShowPopupExamen(false);
  };

  const stergeMaterie = async (id) => { const r = await apiFetch(`/api/subjects/${id}`, token, { method: 'DELETE' }); if (r.ok) setMaterii(p => p.filter(m => (m._id || m.id) !== id)); };
  const stergeTema    = async (id) => { const r = await apiFetch(`/api/homework/${id}`, token, { method: 'DELETE' }); if (r.ok) setTeme(p => p.filter(t => (t._id || t.id) !== id)); };
  const stergeExamen  = async (id) => { const r = await apiFetch(`/api/exams/${id}`, token, { method: 'DELETE' }); if (r.ok) setExamene(p => p.filter(ex => (ex._id || ex.id) !== id)); };

  // deschidere a listei de notite 
  const handleSubjectClick = async (materie) => {
    setSelectedSubject(materie);
    try {
      const res = await apiFetch(`/api/materials/subject/${encodeURIComponent(materie.nume)}`, token);
      const data = await res.json();
      setNotesList(data);
      setShowNotesModal(true);
    } catch (e) {
      showToast("Eroare la încărcarea notițelor.", "err");
    }
  };

  const handleCreateNewNote = async () => {
    try {
      const res = await apiFetch(`/api/materials/note/new`, token, {
        method: 'POST',
        body: JSON.stringify({ materialId: selectedSubject.nume, nume: `Notiță ${notesList.length + 1}` })
      });
      const newNote = await res.json();
      navigate(`/edit-material/${newNote._id}`); 
    } catch (e) {
      showToast("Eroare la crearea notiței.", "err");
    }
  };

  const stergeNotita = async (id, e) => {
    e.stopPropagation(); 
    try {
      const r = await apiFetch(`/api/materials/note/${id}`, token, { method: 'DELETE' });
      if (r.ok) {
        setNotesList(p => p.filter(n => n._id !== id));
        showToast("Notiță ștearsă.", "ok");
      } else {
        showToast("Nu s-a putut șterge notița.", "err");
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare rețea.", "err");
    }
  };

  /*calendar */
  const an = dataCalendar.getFullYear();
  const lunaIdx = dataCalendar.getMonth();
  const zileInLuna = new Date(an, lunaIdx + 1, 0).getDate();
  const primaZiLuni = (new Date(an, lunaIdx, 1).getDay() + 6) % 7;
  const azi = new Date();

  const renderZile = () => {
    const els = [];
    for (let i = 0; i < primaZiLuni; i++) els.push(<span key={`g${i}`} />);
    for (let z = 1; z <= zileInLuna; z++) {
      const df = `${an}-${String(lunaIdx+1).padStart(2,'0')}-${String(z).padStart(2,'0')}`;
      const ex = examene.find(e => e.data === df);
      const isToday = z === azi.getDate() && lunaIdx === azi.getMonth() && an === azi.getFullYear();
      els.push(
        <span key={z} className={`cal-zi${isToday ? ' cal-azi' : ''}${ex ? ' cal-examen' : ''}`}
          style={ex ? { borderColor: ex.culoare } : {}}>
          {z}
        </span>
      );
    }
    return els;
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #e0e4f0, #ffffff)', fontFamily: 'Zilla Slab, serif' }}>
      <p style={{ color: P.blue, fontSize: 18, fontStyle: 'italic' }}>Se încarcă...</p>
    </div>
  );

  return (
    <div className="pm-wrapper">

     
      <div className="pm-topbar">
        <div>
          <h1 className="pm-page-title" style={{ 
            fontSize: '28px', 
            fontWeight: 900, 
            background: 'linear-gradient(45deg, #111625, #2c3e66, #465a8a)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Zilla Slab', serif",
            letterSpacing: '-0.5px',
            margin: 0
          }}>
            Materiale de studiu
          </h1>
          <p className="pm-page-sub" style={{ color: '#465a8a', fontSize: '13px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}></p>
        </div>
        
        <div className="pm-topbar-actions">
          <button className="pm-btn-add" onClick={() => setShowPopup(true)}>+ Materie</button>
          <button className="pm-btn-add" onClick={() => setShowPopupTeme(true)}>+ Temă</button>
          <button className="pm-btn-add" onClick={() => setShowPopupExamen(true)}>+ Examen</button>
        </div>
      </div>

      <div className="pm-body">

        
        <div className="pm-main">

          {/* materii */}
          <section className="pm-section">
            <h2 className="pm-section-title">Materiile tale</h2>
            <div className="pm-cards-list">
              {materii.length === 0 && <p className="pm-empty">Nicio materie adăugată încă.</p>}
              {materii.map(m => (
                <div key={m._id || m.id} className="pm-card" onClick={() => handleSubjectClick(m)} style={{ cursor: 'pointer' }}>
                  <div className="pm-card-stripe" style={{ background: m.culoare }} />
                  <div className="pm-card-body">
                    <p className="pm-card-title">{m.nume}</p>
                    <p className="pm-card-sub">Click pentru a vedea notițele</p>
                  </div>
                  <button className="pm-card-del" onClick={e => { e.stopPropagation(); stergeMaterie(m._id || m.id); }}>×</button>
                  <ArrowBtn color={m.culoare} />
                </div>
              ))}
            </div>
          </section>

          {/* teme */}
          <section className="pm-section">
            <h2 className="pm-section-title">Temele tale</h2>
            <div className="pm-cards-list">
              {teme.length === 0 && <p className="pm-empty">Nicio temă adăugată încă.</p>}
              {teme.map(t => (
                <div key={t._id || t.id} className="pm-card" onClick={() => handleSubjectClick(t)} style={{ cursor: 'pointer' }}>
                  <div className="pm-card-stripe" style={{ background: t.culoare }} />
                  <div className="pm-card-body">
                    <p className="pm-card-title">{t.nume}</p>
                    <p className="pm-card-sub">Temă / Proiect</p>
                  </div>
                  <button className="pm-card-del" onClick={e => { e.stopPropagation(); stergeTema(t._id || t.id); }}>×</button>
                  <ArrowBtn color={t.culoare} />
                </div>
              ))}
            </div>
          </section>

        </div>

      
        <aside className="pm-aside">

          <div className="pm-aside-card" id="calendar">
            <div className="pm-cal-header">
              <button className="pm-cal-btn" onClick={() => setDataCalendar(new Date(an, lunaIdx - 1, 1))}>‹</button>
              <h3 className="pm-cal-title">{luniAn[lunaIdx].slice(0,3)} {an}</h3>
              <button className="pm-cal-btn" onClick={() => setDataCalendar(new Date(an, lunaIdx + 1, 1))}>›</button>
            </div>
            <div className="pm-cal-days-header">
              {['L','M','M','J','V','S','D'].map((d, i) => (
                <span key={i} style={{ color: i >= 5 ? '#e53e3e' : P.lavBlue }}>{d}</span>
              ))}
            </div>
            <div className="pm-cal-grid">{renderZile()}</div>
          </div>

          <div className="pm-aside-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 800, fontSize: 14, color: P.navy, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Examene</h3>
              <button className="pm-btn-add pm-btn-add--sm" onClick={() => setShowPopupExamen(true)}>+ Adaugă</button>
            </div>
            {examene.length === 0
              ? <p className="pm-empty" style={{ fontSize: 13 }}>Niciun examen adăugat.</p>
              : examene.map(ex => (
                <div key={ex._id || ex.id} className="pm-examen-row">
                  <div className="pm-examen-dot" style={{ background: ex.culoare }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: P.navy, margin: 0 }}>{ex.nume}</p>
                    <p style={{ fontSize: 12, color: P.lavBlue, margin: 0 }}>{ex.dataText}</p>
                  </div>
                  <button className="pm-card-del" onClick={() => stergeExamen(ex._id || ex.id)}>×</button>
                </div>
              ))}
          </div>

        </aside>
      </div>

      {showNotesModal && (
        <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div className="pm-popup" onClick={e => e.stopPropagation()} style={{ width: '450px' }}>
            <h3 className="pm-popup-title" style={{ marginBottom: '10px' }}>Notițe: {selectedSubject?.nume}</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notesList.length === 0 && <p style={{ color: '#fff', opacity: 0.7, fontStyle: 'italic' }}>Nicio notiță creată.</p>}
              {notesList.map(note => (
                <div 
                  key={note._id} 
                  onClick={() => navigate(`/edit-material/${note._id}`)}
                  style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{note.nume}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => stergeNotita(note._id, e)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '22px', cursor: 'pointer', padding: '0 5px', lineHeight: '1' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff5050'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button className="pm-popup-btn" onClick={handleCreateNewNote}>+ Adaugă notiță nouă</button>
            <button className="pm-popup-btn pm-popup-btn--sec" onClick={() => setShowNotesModal(false)}>Închide</button>
          </div>
        </div>
      )}

      {/*popup materie */}
      {showPopup && (
        <div className="modal-overlay" onClick={() => { setShowPopup(false); setNumeNou(''); setFisierMaterie(null); }}>
          <div className="pm-popup" onClick={e => e.stopPropagation()}>
            <h3 className="pm-popup-title">Adaugă materie</h3>
            <input className="pm-popup-input" type="text" placeholder="Numele materiei / încarcă un fișier"
              value={numeNou} onChange={e => setNumeNou(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && adaugaMaterie()} autoFocus />
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 13, margin: '4px 0' }}>sau</p>
            <button className="pm-popup-btn pm-popup-btn--sec" onClick={() => inputFisierMaterieRef.current?.click()}>
              ↑ Încarcă un fișier (PDF / PPT)
            </button>
            <input ref={inputFisierMaterieRef} type="file" accept=".pdf,.ppt,.pptx" style={{ display: 'none' }} onChange={handleAlegeFisierMaterie} />
            {fisierMaterie && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center', margin: '4px 0' }}>{fisierMaterie.name}</p>}
            <button className="pm-popup-btn" onClick={adaugaMaterie}>Adaugă</button>
          </div>
        </div>
      )}

      {/*popup tema */}
      {showPopupTeme && (
        <div className="modal-overlay" onClick={() => { setShowPopupTeme(false); setNumeNouTema(''); setFisierTema(null); }}>
          <div className="pm-popup" onClick={e => e.stopPropagation()}>
            <h3 className="pm-popup-title">Adaugă temă</h3>
            <input className="pm-popup-input" type="text" placeholder="Numele temei / încarcă un fișier"
              value={numeNouTema} onChange={e => setNumeNouTema(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && adaugaTema()} autoFocus />
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 13, margin: '4px 0' }}>sau</p>
            <button className="pm-popup-btn pm-popup-btn--sec" onClick={() => inputFisierTemaRef.current?.click()}>
              ↑ Încarcă un fișier (PDF / PPT)
            </button>
            <input ref={inputFisierTemaRef} type="file" accept=".pdf,.ppt,.pptx" style={{ display: 'none' }} onChange={handleAlegeFisierTema} />
            {fisierTema && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center', margin: '4px 0' }}>{fisierTema.name}</p>}
            <button className="pm-popup-btn" onClick={adaugaTema}>Adaugă</button>
          </div>
        </div>
      )}

      {/*popup examen */}
      {showPopupExamen && (
        <div className="modal-overlay" onClick={() => setShowPopupExamen(false)}>
          <div className="pm-popup" onClick={e => e.stopPropagation()}>
            <h3 className="pm-popup-title">Adaugă examen</h3>
            <input className="pm-popup-input" type="text" placeholder="Nume examen"
              value={numeExamen} onChange={e => setNumeExamen(e.target.value)} />
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '4px 0 8px' }}>Dificultate</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              {culoriExamene.map((c, i) => (
                <div key={i} onClick={() => setDificultateSel(c)} title={["Foarte greu","Greu","Mediu","Ușor","Foarte ușor"][i]}
                  style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: 'pointer', border: dificultateSel === c ? '3px solid #fff' : '3px solid transparent', transform: dificultateSel === c ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.15s' }} />
              ))}
            </div>
            <input className="pm-popup-input" type="date" value={dataExamen} onChange={e => setDataExamen(e.target.value)} />
            <button className="pm-popup-btn" onClick={adaugaExamen}>Adaugă</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaMateriale;