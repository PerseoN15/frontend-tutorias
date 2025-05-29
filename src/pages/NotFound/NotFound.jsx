import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="error-content">
        <div className="number-container">
          <div className="number-4">4</div>
          <div className="number-0">
            <div className="zero-inner"></div>
          </div>
          <div className="number-4 second-4">4</div>
        </div>
        <h2>¡Ups! Página no encontrada</h2>
        <p className="error-message">
          Esta pagina se cambió a la carrera Administración.
        </p>
        <Link to="/" className="btn-volver">
          ← Volver al inicio
        </Link>
      </div>
      <div className="astronaut">
        <div className="head"></div>
        <div className="arm left-arm"></div>
        <div className="arm right-arm"></div>
        <div className="body">
          <div className="panel"></div>
        </div>
        <div className="leg left-leg"></div>
        <div className="leg right-leg"></div>
        <div className="backpack"></div>
      </div>
    </div>
  );
};

export default NotFound;