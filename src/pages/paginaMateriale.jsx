import React, { useState } from 'react';
import './paginaMateriale.css';

import spiraleImg from "../assets/Group 24.svg"; 
import logoImg from "../assets/logostuddle.png";

const PaginaMateriale = () => {
  const [materii, setMaterii] = useState([]);
  const [teme, setTeme] = useState([]);
  const [examene, setExamene] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupTeme, setShowPopupTeme] = useState(false);
  const [showPopupExamen, setShowPopupExamen] = useState(false);

  const [numeNou, setNumeNou] = useState("");
  const [numeNouTema, setNumeNouTema] = useState("");
  const [numeExamen, setNumeExamen] = useState("");

  const [dificultateSel, setDificultateSel] = useState(null);
  const [dataExamen, setDataExamen] = useState("");
  const [dataCalendar, setDataCalendar] = useState(new Date());

  const culori = ['#7c83b3', '#8398e7', '#3b4d9b', '#2a3b8f'];
  const culoriCaiete = ['#5ca0e8', '#9bacff', '#8398e7'];
  const culoriExamene = ['#f03a17', '#c9334c', '#a62c7b', '#8224ab', '#5b1bf1'];

  const deschidePagina = (nume) => {
    window.location.assign(`/materie/${nume}`);
  };

  const adaugaMaterie = () => {
    if (!numeNou.trim()) return;

    const culoareNoua = culori[materii.length % culori.length];

    setMaterii([
      ...materii,
      {
        id: Date.now(),
        nume: numeNou,
        culoare: culoareNoua
      }
    ]);

    setNumeNou("");
    setShowPopup(false);
  };

  const stergeMaterie = (id) => {
    setMaterii(materii.filter(m => m.id !== id));
  };

  const adaugaTema = () => {
    if (!numeNouTema.trim()) return;

    const culoareNoua = culoriCaiete[teme.length % culoriCaiete.length];

    setTeme([
      ...teme,
      {
        id: Date.now(),
        nume: numeNouTema,
        culoare: culoareNoua
      }
    ]);

    setNumeNouTema("");
    setShowPopupTeme(false);
  };

  const stergeTema = (id) => {
    setTeme(teme.filter(t => t.id !== id));
  };

  const adaugaExamen = () => {
    if (!numeExamen.trim() || !dificultateSel || !dataExamen) return;

    const partiData = dataExamen.split('-');
    const dataAfisare = `${partiData[2]}/${partiData[1]}/${partiData[0]}`;

    setExamene([
      ...examene,
      {
        id: Date.now(),
        nume: numeExamen,
        culoare: dificultateSel,
        data: dataExamen,
        dataText: dataAfisare
      }
    ]);

    setNumeExamen("");
    setDificultateSel(null);
    setDataExamen("");
    setShowPopupExamen(false);
  };

  const stergeExamen = (id) => {
    setExamene(examene.filter(ex => ex.id !== id));
  };

  const luniAn = [
    "IANUARIE", "FEBRUARIE", "MARTIE", "APRILIE", "MAI", "IUNIE",
    "IULIE", "AUGUST", "SEPTEMBRIE", "OCTOMBRIE", "NOIEMBRIE", "DECEMBRIE"
  ];

  const anCurent = dataCalendar.getFullYear();
  const lunaCurentaIndex = dataCalendar.getMonth();

  const zileInLuna = new Date(anCurent, lunaCurentaIndex + 1, 0).getDate();
  const primaZiLuni = (new Date(anCurent, lunaCurentaIndex, 1).getDay() + 6) % 7;

  const renderZileCalendar = () => {
    let elementeZile = [];

    for (let i = 0; i < primaZiLuni; i++) {
      elementeZile.push(<span key={`gol-${i}`}></span>);
    }

    for (let zi = 1; zi <= zileInLuna; zi++) {
      const dataFormatata = `${anCurent}-${String(lunaCurentaIndex + 1).padStart(2, '0')}-${String(zi).padStart(2, '0')}`;
      const examenInZiuaAsta = examene.find(ex => ex.data === dataFormatata);

      elementeZile.push(
        <span
          key={zi}
          className={examenInZiuaAsta ? "zi-cerc-dinamic" : ""}
          style={examenInZiuaAsta ? { borderColor: examenInZiuaAsta.culoare } : {}}
        >
          {zi}
        </span>
      );
    }

    return elementeZile;
  };

  return (
    <div className="pagina-wrapper">
      <main className="main-content">
        <h2 className="titlu-sectiune">Materiile tale</h2>

        <div className="container-materii-border">
          <div className="grid-materii">
            <div
              className="card-materie"
              onClick={() => setShowPopup(true)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="card-header"
                style={{ backgroundColor: '#9bacff' }}
              >
                <div className="zona-click-tema">
                  <div className="icon-plus-tema">+</div>
                  Adaugă o materie
                </div>
              </div>
            </div>

            {materii.map((m) => (
              <button
                key={m.id}
                type="button"
                className="card-materie card-materie-clickabila"
                onClick={() => deschidePagina(m.nume)}
                style={{ cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <div
                  className="card-header"
                  style={{ backgroundColor: m.culoare }}
                >
                  <span className="nume-materie-text">
                    {m.nume}
                  </span>

                  <span
                    className="icon-sterge"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      stergeMaterie(m.id);
                    }}
                  >
                    ×
                  </span>
                </div>
                <div className="card-body"></div>
              </button>
            ))}
          </div>
        </div>

        <h2 className="titlu-sectiune">
          Temele și proiectele tale
        </h2>

        <div className="container-materii-border">
          <div className="grid-materii">
            <div
              className="caiet-card"
              onClick={() => setShowPopupTeme(true)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={spiraleImg}
                alt="Spirale"
                className="imagine-spirale"
              />

              <div
                className="caiet-coton"
                style={{ backgroundColor: '#9bacff' }}
              ></div>

              <div className="caiet-body">
                <div className="zona-click-tema">
                  <div className="icon-plus-tema">+</div>
                  Adaugă o temă
                </div>
              </div>
            </div>

            {teme.map((t) => (
              <div 
                key={t.id} 
                className="caiet-card"
                onClick={() => deschidePagina(t.nume)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={spiraleImg}
                  alt="Spirale"
                  className="imagine-spirale"
                />

                <div
                  className="caiet-coton"
                  style={{ backgroundColor: t.culoare }}
                ></div>

                <div className="caiet-body">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <span className="nume-tema-text">
                      {t.nume}
                    </span>

                    <span
                      className="icon-sterge"
                      onClick={(e) => {
                        e.stopPropagation();
                        stergeTema(t.id);
                      }}
                      style={{ cursor: 'pointer', zIndex: 10, position: 'relative' }}
                    >
                      ×
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="titlu-sectiune">
          Examenele tale
        </h2>

        <div className="container-materii-border">
          <div className="layout-examene">
            <div className="stanga-examene">
              <div
                className="zona-click-tema margin-jos-mare"
                onClick={() => setShowPopupExamen(true)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="icon-plus-tema"
                  style={{
                    color: '#333',
                    borderColor: '#333'
                  }}
                >
                  +
                </div>

                <span className="adaugaexamen">
                  Adaugă un examen în listă
                </span>
              </div>

              <div className="lista-examene-adaugate">
                {examene.length === 0 ? (
                  <p className="placeholder-examene">
                    Încă nu ai adăugat niciun examen.
                  </p>
                ) : (
                  examene.map(ex => (
                    <div
                      key={ex.id}
                      className="item-examen-real"
                    >
                      <div
                        className="patrat-culoare"
                        style={{
                          backgroundColor: ex.culoare
                        }}
                      ></div>

                      <div className="detalii-examen">
                        <span className="nume-ex">
                          {ex.nume}
                        </span>

                        <span className="data-ex">
                          {ex.dataText}
                        </span>
                      </div>

                      <span
                        className="icon-sterge"
                        onClick={(e) => {
                          e.stopPropagation();
                          stergeExamen(ex.id);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        ×
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dreapta-examene">
              <div className="calendar-static-card">
                <div className="calendar-header">
                  <span
                    className="sageata-cal"
                    onClick={() =>
                      setDataCalendar(
                        new Date(anCurent, lunaCurentaIndex - 1, 1)
                      )
                    }
                  >
                    ❮
                  </span>

                  <h3 className="luna-titlu">
                    {luniAn[lunaCurentaIndex]} {anCurent}
                  </h3>

                  <span
                    className="sageata-cal"
                    onClick={() =>
                      setDataCalendar(
                        new Date(anCurent, lunaCurentaIndex + 1, 1)
                      )
                    }
                  >
                    ❯
                  </span>
                </div>

                <div className="zile-saptamana">
                  <span>L</span>
                  <span>M</span>
                  <span>M</span>
                  <span>J</span>
                  <span>V</span>

                  <span style={{ color: '#f03a17' }}>
                    S
                  </span>

                  <span style={{ color: '#f03a17' }}>
                    D
                  </span>
                </div>

                <div className="zile-grid">
                  {renderZileCalendar()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="titlu-sectiune">
          Statisticile tale
        </h2>

        <div className="container-materii-border statistics-clean-layout">
          <div className="zona-grafice-simpla">
            <div className="stat-chart-item">
              <h3 className="stat-subtitle">
                Ore de studiu (zile/săptămâni)
              </h3>

              <div className="chart-line-container">
                <div className="chart-baseline"></div>
              </div>
            </div>

            <div className="stat-chart-item">
              <h3 className="stat-subtitle">
                Materiale accesate
              </h3>

              <div className="chart-line-container">
                <div className="chart-baseline"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <div
          className="modal-overlay"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="popup-container"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="popup-text">
              Introdu numele
              <br />
              materiei
            </p>

            <input
              type="text"
              className="popup-input"
              value={numeNou}
              onChange={(e) => setNumeNou(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && adaugaMaterie()
              }
              autoFocus
            />

            <p className="popup-sau">sau</p>

            <p className="popup-incarca">
              încarcă un fișier
            </p>

            <button
              className="btn-adauga-examen"
              style={{ marginTop: '20px' }}
              onClick={adaugaMaterie}
            >
              Adaugă
            </button>
          </div>
        </div>
      )}

      {showPopupTeme && (
        <div
          className="modal-overlay"
          onClick={() => setShowPopupTeme(false)}
        >
          <div
            className="popup-container"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="popup-text">
              Introdu numele
              <br />
              temei/proiectului
            </p>

            <input
              type="text"
              className="popup-input"
              value={numeNouTema}
              onChange={(e) => setNumeNouTema(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && adaugaTema()
              }
              autoFocus
            />

            <p className="popup-sau">sau</p>

            <p className="popup-incarca">
              încarcă un fișier
            </p>

            <button
              className="btn-adauga-examen"
              style={{ marginTop: '20px' }}
              onClick={adaugaTema}
            >
              Adaugă
            </button>
          </div>
        </div>
      )}

      {showPopupExamen && (
        <div
          className="modal-overlay"
          onClick={() => setShowPopupExamen(false)}
        >
          <div
            className="popup-container-examen"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="popup-label">
              Nume examen
            </p>

            <input
              type="text"
              className="popup-input-examen"
              value={numeExamen}
              onChange={(e) => setNumeExamen(e.target.value)}
            />

            <p className="popup-label">
              Alege gradul de dificultate
            </p>

            <div className="selector-culori">
              {culoriExamene.map((c, i) => (
                <div key={i} className="color-wrapper">
                  <div
                    className="tooltip-dificultate"
                    style={{
                      backgroundColor: c,
                      filter: 'brightness(0.8)'
                    }}
                  >
                    {
                      [
                        "Foarte greu",
                        "Greu",
                        "Mediu",
                        "Ușor",
                        "Foarte ușor"
                      ][i]
                    }
                  </div>

                  <div
                    className={`patrat-culoare-selectabil ${
                      dificultateSel === c ? 'activ' : ''
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setDificultateSel(c)}
                  ></div>
                </div>
              ))}
            </div>

            <p className="popup-label">
              Selectează data
            </p>

            <input
              type="date"
              className="popup-input-examen"
              value={dataExamen}
              onChange={(e) => setDataExamen(e.target.value)}
            />

            <button
              className="btn-adauga-examen"
              onClick={adaugaExamen}
            >
              Adaugă
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaMateriale;