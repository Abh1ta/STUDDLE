import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import PaginaMateriale from './pages/PaginaMateriale';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<PaginaMateriale />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;