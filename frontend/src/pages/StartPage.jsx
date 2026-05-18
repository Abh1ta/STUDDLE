/* eslint-disable no-unused-vars */
import React from 'react';
import './App.css';
<<<<<<< HEAD
import '../Components/Header.css'
=======
>>>>>>> origin/feature/update
import { Link } from 'react-router-dom';

import logoStuddle from '../assets/logoStuddle.png';
import pozaBaiat from '../assets/pozabaiat.png';
import pisica from '../assets/Siameza ochi albastri (1).png';

<<<<<<< HEAD
// Feature icons
=======
>>>>>>> origin/feature/update
import calendarIcon from '../assets/calendar.png';
import folderIcon from '../assets/folder.png';
import ceasIcon from '../assets/ceas.png';
import clopotelIcon from '../assets/clopotel.png';
import statisticiIcon from '../assets/statistici.png';
import prieteniIcon from '../assets/prieteni.png';

const featuresData = [
  { id: 1, icon: calendarIcon, title: "Sincronizare Calendar", desc: "Exportă automat examenele și deadline-urile în Google Calendar. Nicio dată importantă uitată." },
<<<<<<< HEAD
  { id: 2, icon: folderIcon,   title: "Foldere pe materii",    desc: "Organizează totul pe discipline. Fiecare curs are spațiul lui, fișierele lui, notițele lui." },
  { id: 3, icon: ceasIcon,     title: "Monitorizare timp",     desc: "Aflați cât timp petreceți pe fiecare materie și ajustați programul de studiu realist." },
  { id: 4, icon: clopotelIcon, title: "Notificări inteligente",desc: "Remindere adaptate ritmului tău — nu spam, ci mementouri utile exact când ai nevoie." },
  { id: 5, icon: statisticiIcon,title: "Progres vizibil",      desc: "Statistici clare care îți arată cât ai avansat, ce ai bifat și ce a mai rămas de făcut." },
  { id: 6, icon: prieteniIcon, title: "Partajare cu prietenii",desc: "Lucrați la proiecte comune, împărțiți sarcini și rămâneți toți sincronizați fără efort." }
=======
  { id: 2, icon: folderIcon, title: "Foldere pe materii", desc: "Organizează totul pe discipline. Fiecare curs are spațiul lui, fișierele lui, notițele lui." },
  { id: 3, icon: ceasIcon, title: "Monitorizare timp", desc: "Aflați cât timp petreceți pe fiecare materie și ajustați programul de studiu realist." },
  { id: 4, icon: clopotelIcon, title: "Notificări inteligente", desc: "Remindere adaptate ritmului tău — nu spam, ci mementouri utile exact când ai nevoie." },
  { id: 5, icon: statisticiIcon, title: "Progres vizibil", desc: "Statistici clare care îți arată cât ai avansat, ce ai bifat și ce a mai rămas de făcut." },
  { id: 6, icon: prieteniIcon, title: "Partajare cu prietenii", desc: "Lucrați la proiecte comune, împărțiți sarcini și rămâneți toți sincronizați fără efort." }
>>>>>>> origin/feature/update
];

function StartPage() {
  return (
    <div className="app-container">
<<<<<<< HEAD
       <header className="header">
      <div className="logo">
    <Link to="/">
<img src={logoStuddle} className="imglogo" alt="Logo Studdle" />
    </Link>
    </div>
        <div className="nav-links">
          <Link to="/login">SIGN IN</Link>
<Link to="/signup">SIGN UP</Link>
        </div>
      </header>

      {/* sectiunea 1 - hero */}
=======
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src={logoStuddle} className="imglogo" alt="Logo Studdle" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/login">SIGN IN</Link>
          <Link to="/signup">SIGN UP</Link>
        </div>
      </header>

>>>>>>> origin/feature/update
      <main className="hero">
        <div className="hero-image-container">
          <div className="placeholder-image">
            <img
              className="pozaBaiat"
              src={pozaBaiat}
              alt="Ilustrație student"
              style={{ width: '350px', minWidth: '1000px', maxWidth: '400px', height: 'auto' }}
            />
          </div>
        </div>
        <div className="hero-content">
<<<<<<< HEAD
          <h1>
=======
          <h1 style={{ fontWeight: '700' }}>
>>>>>>> origin/feature/update
            Studiază mai <span className="highlight-text">inteligent</span>,<br />
            nu mai mult
          </h1>
          <p>
            Prioritizează automat examenele și deadline-urile urgente. Cu foldere dedicate,
            monitorizarea timpului și sincronizare Google Calendar, nicio sarcină nu mai rămâne în urmă.
          </p>
        </div>
      </main>

<<<<<<< HEAD
      {/* sectiunea 2 - cards */}
      <section className="features-section">
        <div className="features-header">
          <p className="subtitle">DE CE STUDDLE?</p>
          <h2 className="main-title">
=======
      <section className="features-section">
        <div className="features-header">
          <p className="subtitle">DE CE STUDDLE?</p>
          <h2 className="main-title" style={{ fontWeight: '500' }}>
>>>>>>> origin/feature/update
            Tot ce îți trebuie, <br />
            <span className="skew-text">fără haos.</span>
          </h2>
        </div>
        <div className="features-grid">
          {featuresData.map((item) => (
            <div key={item.id} className="feature-card">
              <img src={item.icon} alt={item.title} className="feature-icon" />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

<<<<<<< HEAD
      {/* sectiunea 3 - pisica */}
=======
    
>>>>>>> origin/feature/update
      <section className="cat-section">
        <div className="cat-container">
          <img src={pisica} alt="Pisica Studdle" className="cat-image" />
          <div className="cat-text">
<<<<<<< HEAD
            <h2>Ghidul tău pe parcursul orelor de studiu...</h2>
            <p>
=======
            <h2 style={{ fontWeight: '700' }}>Ghidul tău pe parcursul orelor de studiu...</h2>
            <p style={{ fontSize: '1.2rem' }}>
>>>>>>> origin/feature/update
              care este personalizabil! Pisica Studdy te va însoți atât pe parcursul
              semestrelor, dar mai ales în timpul sesiunii în cele mai stresante momente.
            </p>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* sectiunea 4 - CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>
            Ești pregătit să studiezi <span className="italic-purple">cu spor</span>,
            <span className="break-text"> din plăcere?</span>
          </h2>
          <Link to="/signup ">
            <button className="cta-button">Creează cont gratuit</button>
=======
   
      <section className="cta-section">
        <div className="cta-content">
          <h2 style={{ fontWeight: '700' }}>
            Ești pregătit să studiezi <span className="italic-purple">cu spor</span>,
            <span className="break-text"> din plăcere?</span>
          </h2>
          <Link to="/signup">
            <button className="cta-button">
              <span style={{ fontSize: 22 }}>
                Creează cont gratuit
              </span>
            </button>
>>>>>>> origin/feature/update
          </Link>
        </div>
      </section>

<<<<<<< HEAD
      <footer className="footer">
        <div className="footer-logo">
          <img src={logoStuddle} alt="Logo Studdle" />
        </div>
      </footer>
=======
>>>>>>> origin/feature/update
    </div>
  );
}

export default StartPage;