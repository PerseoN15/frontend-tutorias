import React, { useState } from 'react';
import './CambiosCalificaciones.css';

function CambiosCalificaciones() {
  const [calificaciones, setCalificaciones] = useState([
    { id: 1, alumno: "Ana López", materia: "Matemáticas", calificacion: 85 },
    { id: 2, alumno: "Luis Pérez", materia: "Historia", calificacion: 92 }
  ]);

  const [modoEdicion, setModoEdicion] = useState(null);
  const [nuevaCalificacion, setNuevaCalificacion] = useState('');

  const iniciarEdicion = (id, calif) => {
    setModoEdicion(id);
    setNuevaCalificacion(calif);
  };

  const guardarCambio = (id) => {
    if (nuevaCalificacion === '' || isNaN(nuevaCalificacion) || nuevaCalificacion < 0 || nuevaCalificacion > 100) {
      alert("La calificación debe estar entre 0 y 100.");
      return;
    }

    const actualizadas = calificaciones.map((c) =>
      c.id === id ? { ...c, calificacion: Number(nuevaCalificacion) } : c
    );

    setCalificaciones(actualizadas);
    setModoEdicion(null);
    setNuevaCalificacion('');
    alert("Calificación actualizada");
    // Aquí iría el llamado axios.put al backend
  };

  return (
    <div className="cambios-container">
      <h3>Modificar calificaciones</h3>
      <table className="tabla-cambios">
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
              <td>
                {modoEdicion === c.id ? (
                  <input
                    type="number"
                    value={nuevaCalificacion}
                    onChange={(e) => setNuevaCalificacion(e.target.value)}
                  />
                ) : (
                  c.calificacion
                )}
              </td>
              <td>
                {modoEdicion === c.id ? (
                  <button onClick={() => guardarCambio(c.id)}>Guardar</button>
                ) : (
                  <button onClick={() => iniciarEdicion(c.id, c.calificacion)}>Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CambiosCalificaciones;
