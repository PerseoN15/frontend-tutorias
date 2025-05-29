import React, { useState } from 'react';
import './ConsultasCalificaciones.css';

function ConsultasCalificaciones() {
  const [calificaciones] = useState([
    { id: 1, alumno: "Ana López", materia: "Matemáticas", calificacion: 85 },
    { id: 2, alumno: "Luis Pérez", materia: "Historia", calificacion: 92 },
    { id: 3, alumno: "Ana López", materia: "Física", calificacion: 78 }
  ]);

  const [filtro, setFiltro] = useState({
    alumno: '',
    materia: ''
  });

  const handleChange = (e) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value,
    });
  };

  const resultadosFiltrados = calificaciones.filter((c) =>
    c.alumno.toLowerCase().includes(filtro.alumno.toLowerCase()) &&
    c.materia.toLowerCase().includes(filtro.materia.toLowerCase())
  );

  return (
    <div className="consultas-container">
      <h3>Consulta de Calificaciones</h3>

      <div className="consultas-filtros">
        <input
          type="text"
          name="alumno"
          placeholder="Filtrar por alumno"
          value={filtro.alumno}
          onChange={handleChange}
        />
        <input
          type="text"
          name="materia"
          placeholder="Filtrar por materia"
          value={filtro.materia}
          onChange={handleChange}
        />
      </div>

      <table className="tabla-consultas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {resultadosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="4">No se encontraron resultados.</td>
            </tr>
          ) : (
            resultadosFiltrados.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.alumno}</td>
                <td>{c.materia}</td>
                <td>{c.calificacion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ConsultasCalificaciones;
