import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiUser, FiBook, FiAward, FiChevronRight,
  FiArrowLeft, FiEdit2, FiCheckCircle,
  FiTrash, FiCheck, FiX, FiPlus, FiMinus
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import './DetalleAlumno.css';
import {
  obtenerAlumnoPorId,
  eliminarMateriaAsignada,
  registrarCalificacionesAlumno,
  eliminarTodasMateriasAlumno
} from '../../services/alumnoService';

function DetalleAlumno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [nuevaCalificacion, setNuevaCalificacion] = useState('');

  useEffect(() => {
    const cargarAlumno = async () => {
      try {
        const res = await obtenerAlumnoPorId(id);
        setAlumno(res.data);
      } catch (error) {
        console.error("❌ Error al cargar alumno:", error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener alumno',
          text: error.message,
          confirmButtonColor: '#800020',
          background: '#ffffff',
          color: '#333333'
        });
      } finally {
        setLoading(false);
      }
    };

    cargarAlumno();
  }, [id]);

  const handleAsignarMaterias = () => {
    navigate(`/alumnos/${id}/asignar-materias`, { state: { alumno } });
  };

  const handleRegistrarCalificaciones = () => {
    navigate(`/alumnos/${id}/registrar-calificaciones`, {
      state: { alumno, materias: alumno?.materiasAsignadas || [] }
    });
  };

  const handleEliminarMateria = async (materiaId) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar materia?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      background: '#ffffff',
      color: '#333333'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await eliminarMateriaAsignada(alumno._id, materiaId);
        setAlumno(res.data.alumno);
        Swal.fire({
          title: '¡Eliminada!',
          text: 'La materia ha sido eliminada.',
          icon: 'success',
          background: '#ffffff',
          color: '#333333'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la materia',
          icon: 'error',
          background: '#ffffff',
          color: '#333333'
        });
      }
    }
  };

  const handleEliminarTodas = async () => {
    const confirm = await Swal.fire({
      title: '¿Eliminar todas las materias?',
      text: 'Esto eliminará TODAS las materias asignadas al alumno.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar todas',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      background: '#ffffff',
      color: '#333333'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await eliminarTodasMateriasAlumno(alumno._id);
        setAlumno(res.data.alumno);
        Swal.fire({
          title: 'Eliminadas',
          text: 'Todas las materias han sido eliminadas.',
          icon: 'success',
          background: '#ffffff',
          color: '#333333'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron eliminar las materias.',
          icon: 'error',
          background: '#ffffff',
          color: '#333333'
        });
      }
    }
  };

  const handleGuardarCalificacion = async (materiaId) => {
    if (!nuevaCalificacion || isNaN(nuevaCalificacion) || nuevaCalificacion < 0 || nuevaCalificacion > 100) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingresa una calificación válida (0-100)',
        icon: 'error',
        background: '#ffffff',
        color: '#333333'
      });
      return;
    }

    try {
      const res = await registrarCalificacionesAlumno(alumno._id, [
        { materiaId, calificacion: parseInt(nuevaCalificacion, 10) }
      ]);
      setAlumno(res.data.alumno);
      setEditando(null);
      Swal.fire({
        title: '✅ Guardado',
        text: 'La calificación ha sido actualizada.',
        icon: 'success',
        background: '#ffffff',
        color: '#333333'
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la calificación.',
        icon: 'error',
        background: '#ffffff',
        color: '#333333'
      });
    }
  };

  if (loading) return (
    <motion.div 
      className="detalle-alumno-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Cargando información del alumno...</p>
      </div>
    </motion.div>
  );

  if (!alumno) return (
    <motion.div 
      className="error-message"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p>No se encontró información del alumno.</p>
    </motion.div>
  );

  return (
    <motion.div 
      className="detalle-alumno-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="header-section">
        <motion.button 
          className="btn-volver" 
          onClick={() => navigate('/alumnos')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft className="btn-icon" /> Volver
        </motion.button>
        <h2><FiUser className="icon-title" /> Detalle del Alumno</h2>
      </div>

      <motion.div 
        className="card info-alumno"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="card-header">
          <FiUser className="card-icon" />
          <h3>Información del Alumno</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Número de Control:</span>
            <span className="info-value">{alumno.numControl}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{alumno.nombre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Edad:</span>
            <span className="info-value">{alumno.edad || '—'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Carrera:</span>
            <span className="info-value">{alumno.carrera}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Semestre:</span>
            <span className="info-value">{alumno.semestre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estatus:</span>
            <span className={`info-value ${alumno.status === 'Irregular' ? 'status-irregular' : 'status-regular'}`}>
              {alumno.status}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="card materias-alumno"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="card-header">
          <FiBook className="card-icon" />
          <h3>Materias por Semestre</h3>
        </div>
        <div className="tabla-semestre">
          {alumno.materiasAsignadas.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Semestre</th>
                  <th>Calificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {alumno.materiasAsignadas.map((m, i) => (
                    <motion.tr 
                      key={i} 
                      className="materia-row"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>
                        <FiChevronRight className="table-icon" /> 
                        {m.materiaId?.nombre || 'Materia'}
                      </td>
                      <td>{m.materiaId?.semestre || '—'}</td>
                      <td className={m.calificacion === 0 ? 'no-asignada' : ''}>
                        {m.calificacion ?? 'No asignada'}
                      </td>
                      <td className="acciones-cell">
                        <motion.button 
                          onClick={() => handleEliminarMateria(m.materiaId._id)} 
                          title="Eliminar"
                          className="btn-action btn-delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiTrash />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="no-materias">
              <FiBook className="no-materias-icon" />
              <p>No hay materias asignadas a este alumno</p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        className="card acciones"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-header">
          <FiEdit2 className="card-icon" />
          <h3>Acciones Disponibles</h3>
        </div>
        <div className="botones-acciones">
          <motion.button 
            className="btn btn-eliminar-todas"
            onClick={handleEliminarTodas}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMinus className="btn-icon" /> Eliminar Todas las Materias
          </motion.button>
          <motion.button 
            className="btn btn-asignar"
            onClick={handleAsignarMaterias}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus className="btn-icon" /> Asignar Materias
          </motion.button>
          <motion.button 
            className="btn btn-calificar"
            onClick={handleRegistrarCalificaciones}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiAward className="btn-icon" /> Registrar Calificaciones
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DetalleAlumno;