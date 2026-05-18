import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CharacterCustomization.css';
import titleIcon from '../assets/caracterulMeu.png';
import { getCatImage } from '../utils/catImages';
import { useAvatar } from '../context/AvatarContext';

const coatOptions = [
  { id: 'siameza', color: '#cda485' },
  { id: 'orange',  color: '#df9f52' },
  { id: 'tuxedo',  color: 'linear-gradient(135deg, #eee 50%, #444 50%)' },
  { id: 'alba',    color: '#ffffff' },
  { id: 'neagra',  color: '#111111' },
];

const eyeOptions = [
  { id: 'albastri', color: '#7ba4e0' },
  { id: 'galbeni',  color: '#e8d671' },
  { id: 'negri',    color: '#111111' },
  { id: 'verzi',    color: '#83c285' },
];

const CharacterCustomization = () => {
  const [coat, setCoat] = useState('siameza');
  const [eyes, setEyes] = useState('albastri');
  const [catName, setCatName] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();
  const { avatarData, refreshAvatar } = useAvatar();

<<<<<<< HEAD
  // Incarca din Context cand intri pe pagina
=======
 
>>>>>>> origin/feature/update
  useEffect(() => {
    if (avatarData) {
      if (avatarData.skin_color) setCoat(avatarData.skin_color);
      if (avatarData.eye_color) setEyes(avatarData.eye_color);
      if (avatarData.cat_name) setCatName(avatarData.cat_name);
    }
  }, [avatarData]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
<<<<<<< HEAD
        await fetch('http://localhost:5000/api/settings/avatar', {
=======
        await fetch('/api/settings/avatar', {
>>>>>>> origin/feature/update
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            skin_color: coat,
            eye_color: eyes,
            cat_name: catName || 'Studdy'
          })
        });
        
        await refreshAvatar();
      }
      navigate('/home');
    } catch (err) {
      console.error("Eroare la salvare:", err);
      navigate('/home');
    }
  };

  const handleRandomize = () => {
    const randomCoat = coatOptions[Math.floor(Math.random() * coatOptions.length)].id;
    const randomEyes = eyeOptions[Math.floor(Math.random() * eyeOptions.length)].id;
    setCoat(randomCoat);
    setEyes(randomEyes);
  };

  useEffect(() => {
    setIsSwitching(true);
    const timer = setTimeout(() => setIsSwitching(false), 300);
    return () => clearTimeout(timer);
  }, [coat, eyes]);

  const currentImage = getCatImage(coat, eyes);

  return (
    <div className="customization-page">
      <div className="customization-header">
        <img src={titleIcon} alt="Caracterul meu" className="title-icon" />
        <h1 className="customization-title">Caracterul meu</h1>
      </div>

      <div className="customization-content">
        <div className="preview-panel">
          <input 
            type="text" 
            className="cat-name-input" 
            placeholder="Studdy" 
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            maxLength={20}
          />
          <div className="cat-preview-container">
            <img
              src={currentImage}
              alt="Pisica customizata"
              className={`cat-preview-img${isSwitching ? ' switching' : ''}`}
            />
          </div>
        </div>

        <div className="controls-panel">
          <div className="control-section">
            <div className="section-header">
              <h2 className="section-title">Coloristica</h2>
              <div className="section-line"></div>
            </div>
            <div className="swatches-flex">
              {coatOptions.map(opt => (
                <div
                  key={opt.id}
                  className={`swatch-circle${coat === opt.id ? ' active' : ''}`}
                  onClick={() => setCoat(opt.id)}
                  style={{ background: opt.color }}
                />
              ))}
            </div>
          </div>

          <div className="control-section">
            <div className="section-header">
              <h2 className="section-title">Culoarea ochilor</h2>
              <div className="section-line"></div>
            </div>
            <div className="swatches-flex">
              {eyeOptions.map(opt => (
                <div
                  key={opt.id}
                  className={`swatch-circle${eyes === opt.id ? ' active' : ''}`}
                  onClick={() => setEyes(opt.id)}
                  style={{ background: opt.color }}
                />
              ))}
            </div>
          </div>

          <div className="customization-actions">
            <button className="customization-btn random-btn" onClick={handleRandomize}>
              Surprinde-mă!
            </button>
            <button className="customization-btn save-btn" onClick={handleSave}>
              Salvează
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CharacterCustomization;
=======
export default CharacterCustomization;
>>>>>>> origin/feature/update
