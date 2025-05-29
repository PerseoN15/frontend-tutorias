import React from 'react';
import './BarraBusqueda.css';

const BarraBusqueda = ({ terminoBusqueda, setTerminoBusqueda }) => {
  const handleChange = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  return (
    <div className="barra-busqueda">
      <input
        type="text"
        placeholder="Buscar alumno por nombre, carrera o número de control..."
        value={terminoBusqueda}
        onChange={handleChange}
        className="input-busqueda"
      />
    </div>
  );
};

export default BarraBusqueda;
