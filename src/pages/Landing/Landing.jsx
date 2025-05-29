import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-container">
      <div className="decorative-element"></div>
      <div className="decorative-element"></div>
      
      <div className="landing-content">
        <h1>Bienvenido al Sistema de Tutorías</h1>
        <p>Gestión académica más eficiente para tutores y alumnos. Conecta, colabora y alcanza tus metas educativas con nuestra plataforma integral.</p>
        
        <div className="landing-buttons">
          <Link to="/login" className="btn-landing">Iniciar sesión</Link>
          <Link to="/registro" className="btn-landing">Registrarse</Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;