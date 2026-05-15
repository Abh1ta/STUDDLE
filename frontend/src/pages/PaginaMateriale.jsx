/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaginaMateriale.css';
import spiraleImg from "../assets/Group 24.png";
import logoImg from "../assets/logostuddle.png";
import { useAuth } from '../context/AuthContext';
import StatisticiSection from './StatisticiSection';

const culori = ['#7c83b3', '#8398e7', '#3b4d9b', '#2a3b8f'];
const culoriCaiete = ['#5ca0e8', '#9bacff', '#8398e7'];
const culoriExamene = ['#f03a17', '#c9334c', '#a62c7b', '#8224ab', '#5b1bf1'];

const luniAn = [
  "IANUARIE", "FEBRUARIE", "MARTIE", "APRILIE", "MAI", "IUNIE",
  "IULIE", "AUGUST", "SEPTEMBRIE", "OCTOMBRIE", "NOIEMBRIE", "DECEMBRIE"
];

const apiFetch = (url, token, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

const PaginaMateriale = () => {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [materii, setMaterii] = useState([]);
  const [teme, setTeme] = useState([]);
  const [examene, setExamene] = useState([]);
  const [fisiere, setFisiere] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupTeme, setShowPopupTeme] = useState(false);
  const [showPopupExamen, setShowPopupExamen] = useState(false);

  const [numeNou, setNumeNou] = useState("");
  const [numeNouTema, setNumeNouTema] = useState("");
  const [numeExamen, setNumeExamen] = useState("");
  const [dificultateSel, setDificultateSel] = useState(null);
  const [dataExamen, setDataExamen] = useState("");
  const [dataCalendar, setDataCalendar] = useState(new Date());

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const fileInputMaterieRef = useRef(null);
  const fileInputTemaRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [resM, resT, resE, resF] = await Promise.all([
          apiFetch("/api/subjects", token),
          apiFetch("/api/homework", token),
          apiFetch("/api/exams", token),
          apiFetch("/api/files", token),
        ]);

        if (resM.ok) setMaterii(await resM.json());
        if (resT.ok) setTeme(await resT.json());
        if (resF.ok) {
          const filesData = await resF.json();
          setFisiere(filesData.files);
        }
        if (resE.ok) {
          const exData = await resE.json();
          setExamene(exData.map(ex => ({
            ...ex,
            id: ex._id,
            nume: ex.title,
            culoare: ex.color,
            data: ex.date,
            dataText: ex.date.split('-').reverse().join('/'),
          })));
        }
      } catch (err) {
        console.error("Eroare fetch initial:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, location]);

  const uploadFile = async (file, subjectId) => {
    if (!file) return;
    if (!subjectId) {
      setUploadError("Selectează mai întâi o materie pentru a atașa fișierul.");
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) {
      setUploadError("Doar fișiere PDF și TXT sunt acceptate.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_id", subjectId);
    formData.append("title", file.name);

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUploadSuccess(`"${file.name}" a fost încărcat cu succes!`);
        setFisiere(prev => [data.file, ...prev]);
        setTimeout(() => setUploadSuccess(""), 3000);
      } else {
        setUploadError(data.message || "Eroare la upload.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Eroare de rețea la upload.");
    } finally {
      setUploading(false);
    }
  };

  const stergeFisier = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest fișier?")) return;
    try {
      const res = await apiFetch(`/api/files/${id}`, token, { method: "DELETE" });
      if (res.ok) {
        setFisiere(prev => prev.filter(f => f._id !== id));
      }
    } catch (err) {
      console.error("Eroare ștergere fișier:", err);
    }
  };

  const handleOpenFile = (file) => {
    if (file.file_type === 'pdf') {
      navigate('/pdf-viewer', {
        state: {
          fileUrl: file.url,
          fileId: file._id,
          fileName: file.title,
        },
      });
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handleFileChangeMaterie = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const subjectId = selectedSubjectId || (materii[0]?._id || "");
    uploadFile(file, subjectId);
    e.target.value = "";
  };

  const handleFileChangeTema = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const subjectId = selectedSubjectId || (materii[0]?._id || "");
    uploadFile(file, subjectId);
    e.target.value = "";
  };

  const adaugaMaterie = async () => {
    if (!numeNou.trim()) return;
    const culoare = culori[materii.length % culori.length];
    try {
      const res = await apiFetch("/api/subjects", token, {
        method: "POST",
        body: JSON.stringify({ title: numeNou, color: culoare }),
      });
      if (res.ok) {
        const saved = await res.json();
        setMaterii(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error("Eroare adaugă materie:", err);
    }
    setNumeNou("");
    setShowPopup(false);
  };

  const stergeMaterie = async (id) => {
    if (!window.confirm("Ștergerea materiei va șterge și fișierele asociate. Continui?")) return;
    try {
      const res = await apiFetch(`/api/subjects/${id}`, token, { method: "DELETE" });
      if (res.ok) {
        setMaterii(prev => prev.filter(m => (m._id || m.id) !== id));
        setFisiere(prev => prev.filter(f => (f.subject_id?._id || f.subject_id) !== id));
      }
    } catch (err) {
      console.error("Eroare ștergere materie:", err);
    }
  };

  const adaugaTema = async () => {
    if (!numeNouTema.trim()) return;
    const culoare = culoriCaiete[teme.length % culoriCaiete.length];
    try {
      const res = await apiFetch("/api/homework", token, {
        method: "POST",
        body: JSON.stringify({ title: numeNouTema, color: culoare }),
      });
      if (res.ok) {
        const saved = await res.json();
        setTeme(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error("Eroare adaugă temă:", err);
    }
    setNumeNouTema("");
    setShowPopupTeme(false);
  };

  const stergeTema = async (id) => {
    try {
      const res = await apiFetch(`/api/homework/${id}`, token, { method: "DELETE" });
      if (res.ok) setTeme(prev => prev.filter(t => (t._id || t.id) !== id));
    } catch (err) {
      console.error("Eroare ștergere temă:", err);
    }
  };

  const adaugaExamen = async () => {
    if (!numeExamen.trim() || !dificultateSel || !dataExamen) return;
    try {
      const res = await apiFetch("/api/exams", token, {
        method: "POST",
        body: JSON.stringify({ title: numeExamen, color: dificultateSel, date: dataExamen }),
      });
      if (res.ok) {
        const saved = await res.json();
        setExamene(prev => [...prev, {
          ...saved,
          id: saved._id,
          nume: saved.title,
          culoare: saved.color,
          data: saved.date,
          dataText: saved.date.split('-').reverse().join('/'),
        }]);
      }
    } catch (err) {
      console.error("Eroare adaugă examen:", err);
    }
    setNumeExamen("");
    setDificultateSel(null);
    setDataExamen("");
    setShowPopupExamen(false);
  };

  const stergeExamen = async (id) => {
    try {
      const res = await apiFetch(`/api/exams/${id}`, token, { method: "DELETE" });
      if (res.ok) setExamene(prev => prev.filter(ex => (ex._id || ex.id) !== id));
    } catch (err) {
      console.error("Eroare ștergere examen:", err);
    }
  };

  const anCurent = dataCalendar.getFullYear();
  const lunaCurentaIndex = dataCalendar.getMonth();
  const zileInLuna = new Date(anCurent, lunaCurentaIndex + 1, 0).getDate();
  const primaZiLuni = (new Date(anCurent, lunaCurentaIndex, 1).getDay() + 6) % 7;

  const renderZileCalendar = () => {
    const elems = [];
    for (let i = 0; i < primaZiLuni; i++) elems.push(<span key={`gol-${i}`}></span>);
    for (let zi = 1; zi <= zileInLuna; zi++) {
      const dataFormatata = `${anCurent}-${String(lunaCurentaIndex + 1).padStart(2, '0')}-${String(zi).padStart(2, '0')}`;
      const examen = examene.find(ex => ex.data === dataFormatata);
      elems.push(
        <span
          key={zi}
          className={examen ? "zi-cerc-dinamic" : ""}
          style={examen ? { borderColor: examen.culoare } : {}}
        >
          {zi}
        </span>
      );
    }
    return elems;
  };

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'inherit' }}>Se încarcă...</div>;
  }

  return (
    <div className="pagina-wrapper">
      <main className="main-content">

        {/* MATERII SECTION HEADER WITH NEW BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px' }}>
          <h2 className="titlu-sectiune">Materiile tale</h2>
          
        </div>

        <div className="container-materii-border">
          <div className="grid-materii">
            <div className="card-materie" onClick={() => setShowPopup(true)}>
              <div className="card-header" style={{ backgroundColor: '#9bacff' }}>
                <div className="zona-click-tema">
                  <div className="icon-plus-tema">+</div>
                  Adaugă o materie/Incarcă un fisier
                </div>
              </div>
            </div>
            {materii.map(m => (
              <div key={m._id || m.id} className="card-materie">
                <div className="card-header" style={{ backgroundColor: m.color || m.culoare }}>
                  <span className="nume-materie-text">{m.title || m.nume}</span>
                  <span className="icon-sterge" onClick={e => { e.stopPropagation(); stergeMaterie(m._id || m.id); }}>×</span>
                </div>
                <div className="card-fisiere-list" style={{ padding: '10px', fontSize: '0.85rem' }}>
                  {fisiere
                    .filter(f => (f.subject_id?._id || f.subject_id) === (m._id || m.id))
                    .map(f => (
                      <div
                        key={f._id}
                        className="fisier-row"
                        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', cursor: 'pointer', background: 'rgba(255,255,255,0.3)', padding: '4px', borderRadius: '4px' }}
                        onClick={() => handleOpenFile(f)}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                          {f.file_type === 'pdf' ? '📄 ' : '📝 '}{f.title}
                        </span>
                        <span
                          className="icon-sterge-mic"
                          style={{ color: 'red', fontWeight: 'bold' }}
                          onClick={(e) => { e.stopPropagation(); stergeFisier(f._id); }}
                        >×</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TEME */}
        <h2 className="titlu-sectiune">Temele și proiectele tale</h2>
        <div className="container-materii-border">
          <div className="grid-materii">
            <div className="caiet-card" onClick={() => setShowPopupTeme(true)}>
              <img src={spiraleImg} alt="Spirale" className="imagine-spirale" />
              <div className="caiet-coton" style={{ backgroundColor: '#9bacff' }}></div>
              <div className="caiet-body">
                <div className="zona-click-tema">
                  <div className="icon-plus-tema">+</div>
                  Adaugă o temă
                </div>
              </div>
            </div>
            {teme.map(t => (
              <div key={t._id || t.id} className="caiet-card">
                <img src={spiraleImg} alt="Spirale" className="imagine-spirale" />
                <div className="caiet-coton" style={{ backgroundColor: t.color || t.culoare }}></div>
                <div className="caiet-body">
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span className="nume-tema-text">{t.title || t.nume}</span>
                      <span className="icon-sterge" onClick={() => stergeTema(t._id || t.id)}>×</span>
                    </div>
                    <div className="fisiere-tema-scroll" style={{ marginTop: '10px', fontSize: '0.75rem', overflowY: 'auto' }}>
                      {fisiere
                        .filter(f => (f.subject_id?._id || f.subject_id) === (t.subject_id || t._id))
                        .map(f => (
                          <div
                            key={f._id}
                            onClick={() => handleOpenFile(f)}
                            style={{ cursor: 'pointer', marginBottom: '2px', borderBottom: '1px solid #eee' }}
                          >
                            {f.title}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EXAMENE */}
        <h2 className="titlu-sectiune">Examenele tale</h2>
        <div className="container-materii-border">
          <div className="layout-examene">
            <div className="stanga-examene">
              <div className="zona-click-tema margin-jos-mare" onClick={() => setShowPopupExamen(true)}>
                <div className="icon-plus-tema" style={{ color: '#333', borderColor: '#333' }}>+</div>
                <span className="adaugaexamen">Adaugă un examen în listă</span>
              </div>
              <div className="lista-examene-adaugate">
                {examene.length === 0 ? (
                  <p className="placeholder-examene">Încă nu ai adăugat niciun examen.</p>
                ) : (
                  examene.map(ex => (
                    <div key={ex._id || ex.id} className="item-examen-real">
                      <div className="patrat-culoare" style={{ backgroundColor: ex.culoare }}></div>
                      <div className="detalii-examen">
                        <span className="nume-ex">{ex.nume}</span>
                        <span className="data-ex">{ex.dataText}</span>
                      </div>
                      <span className="icon-sterge" onClick={() => stergeExamen(ex._id || ex.id)}>×</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="dreapta-examene">
              <div className="calendar-static-card" id='calendar'>
                <div className="calendar-header">
                  <span className="sageata-cal" onClick={() => setDataCalendar(new Date(anCurent, lunaCurentaIndex - 1, 1))}>❮</span>
                  <h3 className="luna-titlu">{luniAn[lunaCurentaIndex]} {anCurent}</h3>
                  <span className="sageata-cal" onClick={() => setDataCalendar(new Date(anCurent, lunaCurentaIndex + 1, 1))}>❯</span>
                </div>
                <div className="zile-saptamana">
                  <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span>
                  <span style={{ color: '#f03a17' }}>S</span>
                  <span style={{ color: '#f03a17' }}>D</span>
                </div>
                <div className="zile-grid">{renderZileCalendar()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* STATISTICI */}
        
       <h2 className="titlu-sectiune">Statisticile tale</h2>
<StatisticiSection token={token} />

      </main>

      {/* POPUP MATERII */}
      {showPopup && (
        <div id="materi" className="modal-overlay" onClick={() => { setShowPopup(false); setUploadError(""); setUploadSuccess(""); }}>
          <div className="popup-container" onClick={e => e.stopPropagation()}>
            <p className="popup-text">Introdu numele<br />materiei</p>
            <input type="text" className="popup-input" value={numeNou}
              onChange={e => setNumeNou(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && adaugaMaterie()} autoFocus />
            <p className="popup-sau">sau</p>

            <input
              ref={fileInputMaterieRef}
              type="file"
              accept=".pdf,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChangeMaterie}
            />

            {materii.length > 0 && (
              <select
                className="popup-input"
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                style={{ marginBottom: '8px' }}
              >
                <option value="">— alege materia pentru fișier —</option>
                {materii.map(m => (
                  <option key={m._id} value={m._id}>{m.title}</option>
                ))}
              </select>
            )}

            <p
              className="popup-incarca"
              style={{ cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.6 : 1 }}
              onClick={() => !uploading && fileInputMaterieRef.current?.click()}
            >
              {uploading ? 'Se încarcă...' : 'încarcă un fișier (PDF / TXT)'}
            </p>

            {uploadError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</p>}
            {uploadSuccess && <p style={{ color: 'green', fontSize: '0.8rem', marginTop: '4px' }}>{uploadSuccess}</p>}

            <button className="btn-adauga-examen" style={{ marginTop: '20px' }} onClick={adaugaMaterie}>Adaugă</button>
          </div>
        </div>
      )}

      {/* POPUP TEME */}
      {showPopupTeme && (
        <div className="modal-overlay" onClick={() => { setShowPopupTeme(false); setUploadError(""); setUploadSuccess(""); }}>
          <div className="popup-container" onClick={e => e.stopPropagation()}>
            <p className="popup-text">Introdu numele<br />temei/proiectului</p>
            <input type="text" className="popup-input" value={numeNouTema}
              onChange={e => setNumeNouTema(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && adaugaTema()} autoFocus />
            <p className="popup-sau">sau</p>

            <input
              ref={fileInputTemaRef}
              type="file"
              accept=".pdf,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChangeTema}
            />

            {materii.length > 0 && (
              <select
                className="popup-input"
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                style={{ marginBottom: '8px' }}
              >
                <option value="">— alege materia pentru fișier —</option>
                {materii.map(m => (
                  <option key={m._id} value={m._id}>{m.title}</option>
                ))}
              </select>
            )}

            <p
              className="popup-incarca"
              style={{ cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.6 : 1 }}
              onClick={() => !uploading && fileInputTemaRef.current?.click()}
            >
              {uploading ? 'Se încarcă...' : 'încarcă un fișier (PDF / TXT)'}
            </p>

            {uploadError && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</p>}
            {uploadSuccess && <p style={{ color: 'green', fontSize: '0.8rem', marginTop: '4px' }}>{uploadSuccess}</p>}

            <button className="btn-adauga-examen" style={{ marginTop: '20px' }} onClick={adaugaTema}>Adaugă</button>
          </div>
        </div>
      )}

      {/* POPUP EXAMEN */}
      {showPopupExamen && (
        <div className="modal-overlay" onClick={() => setShowPopupExamen(false)}>
          <div className="popup-container-examen" onClick={e => e.stopPropagation()}>
            <p className="popup-label">Nume examen</p>
            <input type="text" className="popup-input-examen" value={numeExamen}
              onChange={e => setNumeExamen(e.target.value)} />
            <p className="popup-label">Alege gradul de dificultate</p>
            <div className="selector-culori">
              {culoriExamene.map((c, i) => (
                <div key={i} className="color-wrapper">
                  <div className="tooltip-dificultate" style={{ backgroundColor: c, filter: 'brightness(0.8)' }}>
                    {["Foarte greu", "Greu", "Mediu", "Ușor", "Foarte ușor"][i]}
                  </div>
                  <div
                    className={`patrat-culoare-selectabil ${dificultateSel === c ? 'activ' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setDificultateSel(c)}
                  ></div>
                </div>
              ))}
            </div>
            <p className="popup-label">Selectează data</p>
            <input type="date" className="popup-input-examen" value={dataExamen}
              onChange={e => setDataExamen(e.target.value)} />
            <button className="btn-adauga-examen" onClick={adaugaExamen}>Adaugă</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaMateriale;