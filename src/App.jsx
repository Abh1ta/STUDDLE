import React from 'react';
import './App.css';
import { useNavigate, Link } from 'react-router-dom';

function App() {
  return (
    <div className="app-container">
      <header className="header">
      <div className="logo">
    <Link to="/">
    <img src="logostuddle.png" className="imglogo" alt="Logo Studdle" />
    </Link>
    </div>
        <div className="nav-links">
          <a href="./Login">SIGN IN</a>
          <a href="./SignUp">SIGN UP</a>
        </div>
      </header>
      {/* sectiunea 1 - hero */}
      <main className="hero">
        <div className="hero-image-container">
          <div className="placeholder-image">
             <img 
               className="pozaBaiat" 
               src="pozabaiat.png" 
               alt="Ilustrație student" 
               style={{ width: '350px', minWidth: '1000px', maxWidth: '400px', height: 'auto' }} 
             />
          </div>
        </div>
        
        <div className="hero-content">
          <h1>
            Studiază mai <span className="highlight-text">inteligent</span>,<br />
            nu mai mult
          </h1>
          <p>
            Prioritizează automat examenele și deadline-urile urgente. Cu foldere dedicate, monitorizarea timpului și sincronizare Google Calendar, nicio sarcină nu mai rămâne în urmă.
          </p>
        </div>
      </main>

      {/* sectiunea 2 - cards */}
      <section className="features-section">
        <div className="features-header">
          <p className="subtitle">DE CE STUDDLE?</p>
          <h2 className="main-title">
            Tot ce îți trebuie, <br /> 
            <span className="skew-text">fără haos.</span>
          </h2>
        </div>

        <div className="features-grid">
          {featuresData.map((item) => (
            <div key={item.id} className="feature-card">
              <img src={`/${item.img}`} alt={item.title} className="feature-icon" />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

     {/* sectiunea 3 pisica */}
      <section className="cat-section">
        <div className="cat-container">
          <img src="Siameza ochi albastri (1).png" alt="Pisica Studdle" className="cat-image" />
          <div className="cat-text">
            <h2>Ghidul tău pe parcursul orelor de studiu...</h2>
            <p>
              care este personalizabil! Pisica Studdy te va însoți atât pe parcursul 
              semestrelor, dar mai ales în timpul sesiunii în cele mai stresante momente.
            </p>
          </div>
        </div>
      </section>

      {/* sectiunea 4 - text */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>
            Ești pregătit să studiezi <span className="italic-purple">cu spor</span>,<span className="break-text"> din plăcere?</span>
          </h2>
          <Link to='/SignUp'>
          <button className="cta-button">Creează cont gratuit</button>
          </Link>
        </div>
      </section>


      <footer className="footer">
        <div className="footer-logo">
            <img src="logostuddle.png"></img></div>
      </footer>

    </div>
  );
}

const featuresData = [
  { id: 1, img: "calendar (2).png", title: "Sincronizare Calendar", desc: "Exportă automat examenele și deadline-urile în Google Calendar. Nicio dată importantă uitată." },
  { id: 2, img: "folder.png", title: "Foldere pe materii", desc: "Organizează totul pe discipline. Fiecare curs are spațiul lui, fișierele lui, notițele lui." },
  { id: 3, img: "ceas.png", title: "Monitorizare timp", desc: "Aflați cât timp petreceți pe fiecare materie și ajustați programul de studiu realist." },
  { id: 4, img: "clopotel.png", title: "Notificări inteligente", desc: "Remindere adaptate ritmului tău — nu spam, ci mementouri utile exact când ai nevoie." },
  { id: 5, img: "statistici.png", title: "Progres vizibil", desc: "Statistici clare care îți arată cât ai avansat, ce ai bifat și ce a mai rămas de făcut." },
  { id: 6, img: "prieteni.png", title: "Partajare cu prietenii", desc: "Lucrați la proiecte comune, împărțiți sarcini și rămâneți toți sincronizați fără efort." }
];

export default App;