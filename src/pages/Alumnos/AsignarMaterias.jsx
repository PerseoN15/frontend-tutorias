import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiBook } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AsignarMaterias.css';
import { asignarMateriasAlumno } from '../../services/alumnoService';
import { obtenerMateriasPorCarrera } from '../../services/materiaService';

function AsignarMaterias() {
  const navigate = useNavigate();
  const location = useLocation();
  const alumno = location.state?.alumno;

  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);

  // Cargar materias disponibles según la carrera del alumno
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        if (alumno?.carrera) {
          const res = await obtenerMateriasPorCarrera(alumno.carrera);
          // Paso adicional para marcar materias ya asignadas
          const materiasMarcadas = res.data.map(materia => {
            const yaAsignada = alumno?.materiasAsignadas?.some(m => m.materiaId._id === materia._id);
            return { 
              id: materia._id,
              nombre: materia.nombre,
              semestre: materia.semestre,
              asignada: yaAsignada 
            };
          });
          setMateriasDisponibles(materiasMarcadas);
        }
      } catch (error) {
        console.error("❌ Error al cargar materias:", error.message);
      }
    };

    fetchMaterias();
  }, [alumno]);

  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [dropAreaActive, setDropAreaActive] = useState(false);

  // Efecto para animar las tarjetas al aparecer
  useEffect(() => {
    const cards = document.querySelectorAll('.materia-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-in');
    });
  }, [materiasDisponibles]);

  const handleDragStart = (e, materia) => {
    if (materia.asignada) {
      e.preventDefault(); // Evita que materias ya asignadas se arrastren
      return;
    }
    e.dataTransfer.setData('text/plain', materia.id);
    setDragItem(materia);
    setIsDragging(true);
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setIsDragging(false);
    setDropAreaActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDropAreaActive(true);
  };

  const handleDragLeave = () => {
    setDropAreaActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropAreaActive(false);
    
    const materiaId = e.dataTransfer.getData('text/plain');
    const materia = materiasDisponibles.find(m => m.id === materiaId);
    
    if (materia && !materiasSeleccionadas.some(m => m.id === materia.id) && !materia.asignada) {
      setMateriasSeleccionadas(prev => [...prev, materia]);
    }
  };

  const removeMateria = (id) => {
    setMateriasSeleccionadas(prev => prev.filter(m => m.id !== id));
  };

  const handleAsignar = async () => {
    if (materiasSeleccionadas.length === 0) return;

    try {
      const materiasParaGuardar = materiasSeleccionadas.map((m) => ({
        materiaId: m.id
      }));
      await asignarMateriasAlumno(alumno._id, materiasParaGuardar);

      toast.success(
        <div className="toast-custom">
          <div className="toast-header">
            <FiCheck className="toast-icon" />
            <h4>¡Materias asignadas con éxito!</h4>
          </div>
          <div className="toast-body">
            <p>Alumno: <strong>{alumno?.nombre || "---"}</strong></p>
            <p>Materias asignadas:</p>
            <ul className="materias-list">
              {materiasSeleccionadas.map((materia, index) => (
                <li key={index}>
                  <span className="materia-nombre">{materia.nombre}</span>
                  <span className="materia-semestre">(Sem {materia.semestre})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'toast-success',
          transition: 'bounce',
        }
      );

      // Redirigir tras unos segundos
      setTimeout(() => {
        navigate(`/detalle-alumno/${alumno._id}`);
      }, 3000);
    } catch (error) {
      console.error("❌ Error al asignar materias:", error.message);
      toast.error("Error al asignar materias. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="asignar-container">
      <div className="header-section">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Volver
        </button>
        <h2>
          <FiBook className="icon-title" /> Asignar Materias
        </h2>
      </div>

      <div className="alumno-info">
        <h3>{alumno?.nombre || "Alumno"}</h3>
        <p>Número de Control: {alumno?.numeroControl || "---"}</p>
      </div>

      <div className="materias-grid">
        <div className="materias-disponibles">
          <h4>Materias Disponibles</h4>
          <div className="cards-container">
            {materiasDisponibles.map((materia) => (
              <div
                key={materia.id}
                className={`materia-card ${materiasSeleccionadas.some(m => m.id === materia.id) ? 'selected' : ''} ${materia.asignada ? 'materia-desactivada' : ''}`}
                draggable={!materia.asignada}
                onDragStart={(e) => handleDragStart(e, materia)}
                onDragEnd={handleDragEnd}
              >
                <div className="card-header">
                  <h5>{materia.nombre}</h5>
                  {materia.asignada && <span className="asignada-badge">Ya asignada</span>}
                </div>
                <div className="card-footer">
                  <span className="semestre-badge">Semestre {materia.semestre}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={panelRef}
          className={`materias-seleccionadas ${dropAreaActive ? 'active' : ''} ${materiasSeleccionadas.length === 0 ? 'empty' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="panel-header">
            <h4>Materias a Asignar</h4>
            <span className="counter">{materiasSeleccionadas.length} seleccionadas</span>
          </div>
          
          {materiasSeleccionadas.length > 0 ? (
            <div className="selected-cards">
              {materiasSeleccionadas.map((materia) => (
                <div key={materia.id} className="selected-card">
                  <div className="card-content">
                    <span>{materia.nombre}</span>
                    <span className="semestre">Sem {materia.semestre}</span>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeMateria(materia.id)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="drop-message">
              <p>Arrastra materias aquí para asignarlas</p>
              <div className="drop-icon">
                <FiBook className="icon" />
                <FiArrowLeft className="arrow" />
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className={`btn-asignar ${materiasSeleccionadas.length === 0 ? 'disabled' : ''}`}
        onClick={handleAsignar}
        disabled={materiasSeleccionadas.length === 0}
      >
        <FiCheck /> Asignar {materiasSeleccionadas.length} Materias
      </button>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default AsignarMaterias;