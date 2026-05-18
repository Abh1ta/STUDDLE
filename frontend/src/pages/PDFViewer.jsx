<<<<<<< HEAD
/* eslint-disable no-unused-vars */
=======
>>>>>>> origin/feature/update
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HIGHLIGHT_COLORS = [
  { name: 'Galben',  value: 'rgba(255, 220, 50,  0.45)', solid: '#FFD700' },
  { name: 'Verde',   value: 'rgba(80,  220, 120, 0.45)', solid: '#34C759' },
  { name: 'Roz',     value: 'rgba(255, 100, 160, 0.45)', solid: '#FF6EB4' },
  { name: 'Albastru',value: 'rgba(80,  160, 255, 0.45)', solid: '#4FA3FF' },
];

<<<<<<< HEAD
const API_BASE = 'http://localhost:5000/api';
=======
const API_BASE = '/api';
>>>>>>> origin/feature/update

const rectFrom = (x1, y1, x2, y2) => ({
  x: Math.min(x1, x2),
  y: Math.min(y1, y2),
  w: Math.abs(x2 - x1),
  h: Math.abs(y2 - y1),
});
const getCloudinaryPdfUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/fl_attachment/');
};
const hitTest = (rect, x, y) =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

export default function PDFViewer() {
  const { token } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const { fileUrl, fileId, fileName } = location.state || {};

  const [pdfDoc,    setPdfDoc]    = useState(null);
  const [numPages,  setNumPages]  = useState(0);
  const [scale,     setScale]     = useState(1.3);
  const [loading,   setLoading]   = useState(true);
  const [pdfError,  setPdfError]  = useState('');

<<<<<<< HEAD
  // annotations
  const [annotations,  setAnnotations]  = useState([]);   
  const [saving,       setSaving]       = useState(false);

  // tool state
=======
  // annot
  const [annotations,  setAnnotations]  = useState([]);   
  const [saving,       setSaving]       = useState(false);


>>>>>>> origin/feature/update
  const [tool,         setTool]         = useState('highlight'); 
  const [activeColor,  setActiveColor]  = useState(HIGHLIGHT_COLORS[0]);
  const [noteText,     setNoteText]     = useState('');
  const [noteDraft,    setNoteDraft]    = useState(null);  
  const [hovered,      setHovered]      = useState(null);  
<<<<<<< HEAD
  // drawing
=======

>>>>>>> origin/feature/update
  const drawing   = useRef(false);
  const startPos  = useRef({ x: 0, y: 0 });
  const pageRefs  = useRef({});   
  const overlayRefs = useRef({}); 
<<<<<<< HEAD

  
=======
  const pinchStartDist = useRef(null);
  const pinchStartScale = useRef(1);


>>>>>>> origin/feature/update
  useEffect(() => {
    if (!fileUrl) { setPdfError('Niciun fișier furnizat.'); setLoading(false); return; }

    const scriptId = 'pdfjs-script';
    const load = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      window.pdfjsLib.getDocument({ url: getCloudinaryPdfUrl(fileUrl),
  withCredentials: false, })
        .promise
        .then(doc => {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setPdfError('Nu s-a putut încărca PDF-ul.');
          setLoading(false);
        });
    };

    if (window.pdfjsLib) { load(); return; }

    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id  = scriptId;
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = load;
      document.head.appendChild(s);
    }
  }, [fileUrl]);

  useEffect(() => {
    if (!token || !fileId) return;
    fetch(`${API_BASE}/annotations/${fileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setAnnotations(Array.isArray(data) ? data : (data.annotations ?? [])))
      .catch(() => {});
  }, [token, fileId]);

  const renderPage = useCallback(async (pageNum) => {
    if (!pdfDoc) return;
    const canvas = pageRefs.current[pageNum];
    if (!canvas) return;

    const page     = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;

    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
  }, [pdfDoc, scale]);

  useEffect(() => {
    if (!pdfDoc) return;
    for (let p = 1; p <= numPages; p++) renderPage(p);
  }, [pdfDoc, numPages, scale, renderPage]);

  const saveAnnotations = async (next) => {
    if (!token || !fileId) return;
    setSaving(true);
    try {
      await fetch(`${API_BASE}/annotations/${fileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ annotations: next }),
      });
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const updateAnnotations = (next) => {
    setAnnotations(next);
    saveAnnotations(next);
  };

  const getPos = (e, pageNum) => {
    const overlay = overlayRefs.current[pageNum];
    if (!overlay) return { x: 0, y: 0 };
    const rect = overlay.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e, pageNum) => {
    if (tool === 'note') return; 
    if (tool === 'erase') {
      const { x, y } = getPos(e, pageNum);
      const next = annotations.filter(a => !(a.page === pageNum && hitTest(a, x, y)));
      if (next.length !== annotations.length) updateAnnotations(next);
      return;
    }
<<<<<<< HEAD
    // highlight
=======
  
>>>>>>> origin/feature/update
    drawing.current = true;
    startPos.current = getPos(e, pageNum);
  };

  const onMouseUp = (e, pageNum) => {
    if (!drawing.current) return;
    drawing.current = false;
    const end  = getPos(e, pageNum);
    const rect = rectFrom(startPos.current.x, startPos.current.y, end.x, end.y);
    if (rect.w < 5 || rect.h < 5) return;
    const next = [...annotations, {
      id:    crypto.randomUUID(),
      type:  'highlight',
      page:  pageNum,
      color: activeColor.value,
      ...rect,
    }];
    updateAnnotations(next);
  };

  const onOverlayClick = (e, pageNum) => {
    if (tool !== 'note') return;
    const { x, y } = getPos(e, pageNum);
    setNoteDraft({ page: pageNum, x, y });
    setNoteText('');
  };

  const commitNote = () => {
    if (!noteText.trim() || !noteDraft) { setNoteDraft(null); return; }
    const next = [...annotations, {
      id:   crypto.randomUUID(),
      type: 'note',
      page: noteDraft.page,
      x:    noteDraft.x,
      y:    noteDraft.y,
      w:    28,
      h:    28,
      text: noteText.trim(),
      color: activeColor.solid,
    }];
    updateAnnotations(next);
    setNoteDraft(null);
    setNoteText('');
  };

  const cursorForTool = tool === 'erase' ? 'cell' : tool === 'note' ? 'crosshair' : 'text';

  if (!fileUrl) {
    return (
      <div style={styles.errorWrap}>
        <p>Niciun fișier selectat. <button onClick={() => navigate(-1)} style={styles.backBtn}>Înapoi</button></p>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.topBar}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Înapoi</button>
        <span style={styles.fileName}>{fileName || 'Document'}</span>
        <div style={styles.topRight}>
          {saving && <span style={styles.savingBadge}>💾 Salvare…</span>}
          <button onClick={() => setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)))} style={styles.zoomBtn}>−</button>
          <span style={styles.zoomLabel}>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(3, +(s + 0.2).toFixed(1)))} style={styles.zoomBtn}>+</button>
        </div>
      </div>

      <div style={styles.toolbar}>
<<<<<<< HEAD
        {/* Tools */}
=======
       
>>>>>>> origin/feature/update
        <div style={styles.toolGroup}>
          {[
            { id: 'highlight', label: '🖊 Evidențiere' },
            { id: 'note',      label: '📝 Notă' },
            { id: 'erase',     label: '🧹 Șterge' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              style={{ ...styles.toolBtn, ...(tool === t.id ? styles.toolBtnActive : {}) }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tool !== 'erase' && (
          <div style={styles.colorGroup}>
            {HIGHLIGHT_COLORS.map(c => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => setActiveColor(c)}
                style={{
                  ...styles.colorDot,
                  background: c.solid,
                  outline: activeColor.name === c.name ? `3px solid #fff` : 'none',
                  transform: activeColor.name === c.name ? 'scale(1.25)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => {
            if (window.confirm('Ștergi toate adnotările?')) updateAnnotations([]);
          }}
          style={styles.clearBtn}
        >
          🗑 Șterge tot
        </button>
      </div>

<<<<<<< HEAD
      {/* ── BODY ── */}
      <div style={styles.body}>
=======
    
      <div
        style={styles.body}
        onWheel={e => {
          if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setScale(s => Math.min(3, Math.max(0.5, +(s + delta).toFixed(1))));
          }
        }}
        onTouchStart={e => {
          if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            pinchStartDist.current = Math.hypot(dx, dy);
            pinchStartScale.current = scale;
          }
        }}
        onTouchMove={e => {
          if (e.touches.length === 2 && pinchStartDist.current) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const ratio = dist / pinchStartDist.current;
            setScale(+(Math.min(3, Math.max(0.5, pinchStartScale.current * ratio))).toFixed(1));
          }
        }}
        onTouchEnd={() => { pinchStartDist.current = null; }}
      >
>>>>>>> origin/feature/update
        {loading && <div style={styles.loader}>Se încarcă PDF-ul…</div>}
        {pdfError && <div style={styles.loader}>{pdfError}</div>}

        {!loading && !pdfError && Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => {
          const pageAnnotations = annotations.filter(a => a.page === pageNum);
          return (
            <div key={pageNum} style={styles.pageWrap}>
              <div style={styles.pageLabel}>Pagina {pageNum}</div>
              <div style={{ position: 'relative', display: 'inline-block' }}>
<<<<<<< HEAD
                {/* PDF canvas */}
=======
                {/* PDF canva */}
>>>>>>> origin/feature/update
                <canvas
                  ref={el => { pageRefs.current[pageNum] = el; }}
                  style={styles.canvas}
                />

<<<<<<< HEAD
                {/* Annotation overlay */}
=======
              
>>>>>>> origin/feature/update
                <div
                  ref={el => { overlayRefs.current[pageNum] = el; }}
                  style={{ ...styles.overlay, cursor: cursorForTool }}
                  onMouseDown={e => onMouseDown(e, pageNum)}
                  onMouseUp={e => onMouseUp(e, pageNum)}
                  onClick={e => onOverlayClick(e, pageNum)}
                >
<<<<<<< HEAD
                  {/* Highlights */}
=======
               
>>>>>>> origin/feature/update
                  {pageAnnotations
                    .filter(a => a.type === 'highlight')
                    .map(a => (
                      <div
                        key={a.id}
                        onMouseEnter={() => setHovered(a.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          position: 'absolute',
                          left: a.x, top: a.y,
                          width: a.w, height: a.h,
                          background: a.color,
                          borderRadius: 3,
                          pointerEvents: tool === 'erase' ? 'auto' : 'none',
                          boxShadow: hovered === a.id ? '0 0 0 2px rgba(0,0,0,0.4)' : 'none',
                          transition: 'box-shadow 0.15s',
                        }}
                      />
                    ))}

<<<<<<< HEAD
                  {/* Notes */}
=======
                  {/* note */}
>>>>>>> origin/feature/update
                  {pageAnnotations
                    .filter(a => a.type === 'note')
                    .map(a => (
                      <div
                        key={a.id}
                        title={a.text}
                        onMouseEnter={() => setHovered(a.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          position: 'absolute',
                          left: a.x - 14, top: a.y - 14,
                          width: 28, height: 28,
                          borderRadius: '50%',
                          background: a.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, cursor: 'default',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                          border: '2px solid rgba(255,255,255,0.6)',
                          userSelect: 'none',
                          zIndex: 10,
                        }}
                      >
                        📝
                        {hovered === a.id && (
                          <div style={styles.noteTooltip}>{a.text}</div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

<<<<<<< HEAD
      {/* ── NOTE DIALOG ── */}
=======
      {/* note */}
>>>>>>> origin/feature/update
      {noteDraft && (
        <div style={styles.modalOverlay} onClick={() => setNoteDraft(null)}>
          <div style={styles.noteModal} onClick={e => e.stopPropagation()}>
            <p style={styles.noteModalTitle}>Adaugă o notă</p>
            <textarea
              autoFocus
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), commitNote())}
              placeholder="Scrie nota ta…"
              style={styles.noteTextarea}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setNoteDraft(null)} style={styles.cancelBtn}>Anulează</button>
              <button onClick={commitNote} style={styles.confirmBtn}>Salvează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#1e1e2e',
    fontFamily: "'Zilla Slab', serif",
    display: 'flex',
    flexDirection: 'column',
    color: '#e0dff4',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 24px',
    background: '#2a2a3d',
    borderBottom: '1px solid #3a3a55',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#c8c7e8',
    borderRadius: 8,
    padding: '6px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 600,
  },
  fileName: {
    flex: 1,
    fontWeight: 700,
    fontSize: 16,
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  zoomBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    borderRadius: 6,
    width: 32, height: 32,
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  zoomLabel: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 600,
    color: '#b0aed4',
  },
  savingBadge: {
    fontSize: 12,
    color: '#a0e0b0',
    background: 'rgba(80,200,120,0.15)',
    padding: '4px 10px',
    borderRadius: 6,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '10px 24px',
    background: '#25253a',
    borderBottom: '1px solid #35354f',
    flexWrap: 'wrap',
  },
  toolGroup: {
    display: 'flex',
    gap: 8,
  },
  toolBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#c0bfe0',
    borderRadius: 8,
    padding: '7px 16px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.15s',
  },
  toolBtnActive: {
    background: 'rgba(160,130,255,0.25)',
    border: '1px solid rgba(160,130,255,0.5)',
    color: '#ffffff',
  },
  colorGroup: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  colorDot: {
    width: 22, height: 22,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.15s, outline 0.15s',
  },
  clearBtn: {
    marginLeft: 'auto',
    background: 'rgba(255,80,80,0.12)',
    border: '1px solid rgba(255,80,80,0.25)',
    color: '#ff8080',
    borderRadius: 8,
    padding: '7px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 600,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px 24px 60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
  },
  pageWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  pageLabel: {
    fontSize: 12,
    color: '#6060a0',
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  canvas: {
    display: 'block',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    borderRadius: 4,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    userSelect: 'none',
  },
  noteTooltip: {
    position: 'absolute',
    bottom: '110%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#2a2a3d',
    border: '1px solid #4a4a6a',
    color: '#e0dff4',
    padding: '6px 10px',
    borderRadius: 8,
    fontSize: 13,
    whiteSpace: 'pre-wrap',
    maxWidth: 220,
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    pointerEvents: 'none',
    zIndex: 50,
  },
  loader: {
    color: '#8080b0',
    fontSize: 16,
    marginTop: 60,
  },
  errorWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'inherit',
    color: '#e0dff4',
    background: '#1e1e2e',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10,10,25,0.7)',
    backdropFilter: 'blur(6px)',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteModal: {
    background: '#2a2a3d',
    border: '1px solid #4a4a6a',
    borderRadius: 16,
    padding: 28,
    width: 340,
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  noteModalTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: '#ffffff',
    margin: 0,
  },
  noteTextarea: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#e0dff4',
    fontFamily: 'inherit',
    fontSize: 14,
    padding: 10,
    resize: 'vertical',
    minHeight: 100,
    outline: 'none',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#a0a0c0',
    borderRadius: 8,
    padding: '8px 18px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
  },
  confirmBtn: {
    background: 'rgba(160,130,255,0.3)',
    border: '1px solid rgba(160,130,255,0.5)',
    color: '#ffffff',
    borderRadius: 8,
    padding: '8px 18px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 700,
  },
<<<<<<< HEAD
};
=======
};
>>>>>>> origin/feature/update
