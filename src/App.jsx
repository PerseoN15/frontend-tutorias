import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './components/Sidebar.css';

import PaginaPrincipal from './pages/PaginaPrincipal/PaginaPrincipal';
import RutaPrivada from './routes/RutaPrivada';

import Login from "./pages/Login/Login";
import Register from './pages/Register/Register';
import Landing from './pages/Landing/Landing';
import Alumnos from './pages/Alumnos/Alumnos';
import Tutores from './pages/Tutores/Tutores';
import Calificaciones from './pages/Calificaciones/Calificaciones';
import NotFound from './pages/NotFound/NotFound';

import DetalleAlumno from './pages/Alumnos/DetalleAlumno';
import AsignarMaterias from './pages/Alumnos/AsignarMaterias';
import RegistrarCalificaciones from './pages/Alumnos/RegistrarCalificaciones';

function App() {
  const location = useLocation();
  const rutasSinSidebar = ['/', '/login', '/registro'];

  const mostrarSidebar = !rutasSinSidebar.includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {mostrarSidebar && <Sidebar />}
      <div
        style={{
          marginLeft: mostrarSidebar ? '220px' : '0',
          padding: '2rem',
          width: '100%',
        }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/PaginaPrincipal" element={<RutaPrivada><PaginaPrincipal /></RutaPrivada>} />

          {/* Rutas protegidas */}
          <Route path="/alumnos" element={<RutaPrivada><Alumnos /></RutaPrivada>} />
          <Route path="/tutores" element={<RutaPrivada><Tutores /></RutaPrivada>} />
          <Route path="/calificaciones" element={<RutaPrivada><Calificaciones /></RutaPrivada>} />
          <Route path="/detalle-alumno/:id" element={<RutaPrivada><DetalleAlumno /></RutaPrivada>} />
          <Route path="/alumnos/:id/asignar-materias" element={<RutaPrivada><AsignarMaterias /></RutaPrivada>} />
          <Route path="/alumnos/:id/registrar-calificaciones" element={<RutaPrivada><RegistrarCalificaciones /></RutaPrivada>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
