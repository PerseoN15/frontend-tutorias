import React, { useState } from 'react';
import './AltasCalificaciones.css';

function AltasCalificaciones() {
  const [formData, setFormData] = useState({
    alumno: '',
    materia: '',
    calificacion: ''
  });

  const [errores, setErrores] = useState({});

  const validar = () => {
    const errores = {};
    if (!formData.alumno) errores.alumno = "Selecciona un alumno.";
    if (!formData.materia) errores.materia = "Selecciona una materia.";
    if (!formData.calificacion) {
      errores.calificacion = "Ingresa una calificación.";
    } else if (isNaN(formData.calificacion) || formData.calificacion < 0 || formData.calificacion > 100) {
      errores.calificacion = "La calificación debe estar entre 0 y 100.";
    }
    return errores;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidados = validar();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    // Aquí irá el llamado al backend con axios (más adelante)
    console.log("✅ Enviando al backend:", formData);
    alert("Calificación registrada correctamente");
    setFormData({ alumno: '', materia: '', calificacion: '' });
    setErrores({});
  };

  return (
    <div className="altas-container">
      <h3>Registrar nueva calificación</h3>
      <form onSubmit={handleSubmit} className="altas-form">
        <label>Alumno:</label>
        <input
          type="text"
          name="alumno"
          value={formData.alumno}
          onChange={handleChange}
        />
        {errores.alumno && <span className="error">{errores.alumno}</span>}

        <label>Materia:</label>
        <input
          type="text"
          name="materia"
          value={formData.materia}
          onChange={handleChange}
        />
        {errores.materia && <span className="error">{errores.materia}</span>}

        <label>Calificación:</label>
        <input
          type="number"
          name="calificacion"
          value={formData.calificacion}
          onChange={handleChange}
        />
        {errores.calificacion && <span className="error">{errores.calificacion}</span>}

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default AltasCalificaciones;
