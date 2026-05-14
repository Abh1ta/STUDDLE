import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PaginaMateriale from './pages/PaginaMateriale';
import PaginaEditMateriale from './pages/PaginaEditMateriale';

import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />

        <main className="content">
          <Routes>
            <Route path="/" element={<PaginaMateriale />} />
            <Route path="/materie/:id" element={<PaginaEditMateriale />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;