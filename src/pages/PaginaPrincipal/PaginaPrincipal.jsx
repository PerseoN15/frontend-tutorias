import React from 'react';
import { Link } from 'react-router-dom';
import './PaginaPrincipal.css';

const PaginaPrincipal = () => {
  return (
    <div className="landing-container">
      <div className="hero">
        <h1 className="titulo-principal">Bienvenido al Sistema de Tutorías ITSJ</h1>
        <p className="descripcion">
          Mejora la gestión académica y el seguimiento de alumnos con una plataforma intuitiva, eficaz y diseñada para el instituto superior de Jerez.
        </p>

      </div>
      <div className="features">
        <div className="feature-card">
          <h3>📚 Gestión de Alumnos</h3>
          <p>Visualiza, edita y da seguimiento al progreso de tus estudiantes fácilmente.</p>
        </div>
        <div className="feature-card">
          <h3>📝 Registro de Calificaciones</h3>
          <p>Agrega y actualiza las calificaciones de manera dinámica y visual.</p>
        </div>
        <div className="feature-card">
          <h3>📌 Asignación de Materias</h3>
          <p>Asigna materias según carrera y semestre con validaciones automáticas.</p>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipal;
