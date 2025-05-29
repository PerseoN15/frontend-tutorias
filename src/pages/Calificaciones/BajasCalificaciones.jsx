import React, { useState } from 'react';
import './BajasCalificaciones.css';

function BajasCalificaciones() {
  const [calificaciones, setCalificaciones] = useState([
    { id: 1, alumno: "Ana López", materia: "Matemáticas", calificacion: 85 },
    { id: 2, alumno: "Luis Pérez", materia: "Historia", calificacion: 92 }
  ]);

  const eliminarCalificacion = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar esta calificación?");
    if (confirmacion) {
      const actualizadas = calificaciones.filter((c) => c.id !== id);
      setCalificaciones(actualizadas);
      alert("✅ Calificación eliminada");
      // Aquí también iría el llamado al backend (axios.delete)
    }
  };

  return (
    <div className="bajas-container">
      <h3>Eliminar calificaciones</h3>
      {calificaciones.length === 0 ? (
        <p>No hay calificaciones registradas.</p>
      ) : (
        <table className="tabla-bajas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Alumno</th>
              <th>Materia</th>
              <th>Calificación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {calificaciones.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.alumno}</td>
                <td>{c.materia}</td>
                <td>{c.calificacion}</td>
                <td>
                  <button onClick={() => eliminarCalificacion(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BajasCalificaciones;

