import React, { useState } from 'react';
import './Calificaciones.css';

import AltasCalificaciones from './AltasCalificaciones';
import BajasCalificaciones from './BajasCalificaciones';
import CambiosCalificaciones from './CambiosCalificaciones';
import ConsultasCalificaciones from './ConsultasCalificaciones';

function Calificaciones() {
  const [vistaActual, setVistaActual] = useState("alta");

  const cambiarVista = (vista) => setVistaActual(vista);

  const renderVista = () => {
    switch (vistaActual) {
      case "alta": return <AltasCalificaciones />;
      case "baja": return <BajasCalificaciones />;
      case "cambio": return <CambiosCalificaciones />;
      case "consulta": return <ConsultasCalificaciones />;
      default: return <AltasCalificaciones />;
    }
  };

  return (
    <div className="calificaciones-container">
      <h2>Gestión de Calificaciones</h2>
      <div className="calificaciones-menu">
        <button onClick={() => cambiarVista("alta")}>Alta</button>
        <button onClick={() => cambiarVista("baja")}>Baja</button>
        <button onClick={() => cambiarVista("cambio")}>Cambio</button>
        <button onClick={() => cambiarVista("consulta")}>Consulta</button>
      </div>

      <div className="calificaciones-vista">
        {renderVista()}
      </div>
    </div>
  );
}

export default Calificaciones;
