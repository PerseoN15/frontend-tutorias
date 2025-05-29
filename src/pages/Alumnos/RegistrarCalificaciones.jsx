import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import './RegistrarCalificaciones.css';
import { registrarCalificacionesAlumno } from '../../services/alumnoService'; 
import { validarCalificacion } from '../../validations/calificacionValidator';

function RegistrarCalificaciones() {
  const location = useLocation();
  const navigate = useNavigate();
  const alumno = location.state?.alumno;

  const [calificaciones, setCalificaciones] = useState([
    { materia: 'Contabilidad I', calificacion: '' },
    { materia: 'Auditoría I', calificacion: '' },
    { materia: 'Auditoría II', calificacion: '' },
    { materia: 'Impuestos I', calificacion: '' }
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const materias = alumno?.materiasAsignadas || [];
      const iniciales = materias.map(m => ({
        materiaId: m.materiaId._id,
        nombre: m.materiaId.nombre,
        calificacion: m.calificacion ?? ''
      }));
      setCalificaciones(iniciales);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [alumno]);

  const handleChange = (index, valor) => {
    // Validar que sea un número entre 0 y 100
    if (valor === '' || (Number(valor) >= 0 && Number(valor) <= 100)) {
      const nuevas = [...calificaciones];
      nuevas[index].calificacion = valor;
      setCalificaciones(nuevas);
    }
  };

  const getInputClassName = (calificacion) => {
    if (calificacion === '') return '';
    const num = Number(calificacion);
    if (num < 70) return 'calificacion-baja';
    return 'calificacion-alta';
  };

  const handleGuardar = async () => {
    // Validar que todas las calificaciones estén completas
    for (const item of calificaciones) {
      if (item.calificacion === '') {
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `La calificación de "${item.nombre}" no puede estar vacía`,
          confirmButtonColor: '#4f46e5',
          background: '#fff',
          backdrop: `
            rgba(79, 70, 229, 0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat
          `
        });
        return;
      }
      
      if (!validarCalificacion(item.calificacion)) {
        await Swal.fire({
          icon: 'error',
          title: 'Valor inválido',
          html: `❌ La calificación de <b>"${item.nombre}"</b> debe estar entre 0 y 100`,
          confirmButtonColor: '#4f46e5',
          footer: '<span style="color: #4f46e5">Por favor ingresa un valor válido</span>'
        });
        return;
      }
    }

    try {
      setIsLoading(true);

      const calificacionesParaGuardar = calificaciones.map(c => ({
        materiaId: c.materiaId,
        calificacion: parseInt(c.calificacion, 10)
      }));

      await registrarCalificacionesAlumno(alumno._id, calificacionesParaGuardar);

      // Mostrar alerta de éxito con estilo bonito
      await Swal.fire({
        title: '¡Éxito!',
        html: `
          <div style="text-align: center;">
            <svg width="80" height="80" viewBox="0 0 24 24" style="color: #10b981;">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"/>
            </svg>
            <h3 style="color: #10b981; margin-top: 15px;">Calificaciones registradas correctamente</h3>
            <p style="color: #6b7280;">Las calificaciones de <b>${alumno?.nombre}</b> han sido guardadas</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          navigate(`/detalle-alumno/${alumno._id}`);
        }
      });

    } catch (error) {
      console.error("Error al registrar calificaciones:", error.message);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        html: `
          <div style="text-align: center;">
            <svg width="80" height="80" viewBox="0 0 24 24" style="color: #ef4444;">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3 style="color: #ef4444; margin-top: 15px;">Error al registrar calificaciones</h3>
            <p style="color: #6b7280;">${error.message || 'Por favor intenta nuevamente'}</p>
          </div>
        `,
        confirmButtonColor: '#ef4444'
      });
      setIsLoading(false);
    }
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { 
        yoyo: Infinity,
        duration: 0.3
      } 
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="registro-calificaciones-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            className="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loader-spinner"></div>
          </motion.div>
        ) : (
          <>
            <motion.h2
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              Registrar Calificaciones para <span className="alumno-nombre">{alumno?.nombre || 'Alumno'}</span>
            </motion.h2>

            <motion.div 
              className="tabla-calificaciones"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {calificaciones.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="fila-calificacion"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.span 
                    className="materia-nombre"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {item.nombre}
                  </motion.span>
                  <motion.input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={item.calificacion}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className={`calificacion-input ${getInputClassName(item.calificacion)}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileFocus={{ 
                      scale: 1.05,
                      boxShadow: "0 0 0 2px #4f46e5"
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.button 
              className="btn-guardar"
              onClick={handleGuardar}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              Guardar Calificaciones
              <span className="btn-icon">→</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RegistrarCalificaciones;