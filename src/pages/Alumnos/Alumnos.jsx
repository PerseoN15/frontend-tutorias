import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiChevronDown, FiChevronUp, FiUser, FiEdit2, FiTrash2, FiCalendar, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  obtenerAlumnos,
  crearAlumno,
  eliminarAlumno,
  actualizarAlumno
} from '../../services/alumnoService';
import './Alumnos.css';

function Alumnos() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [nuevoAlumno, setNuevoAlumno] = useState({
    numControl: '',
    nombre: '',
    carrera: '',
    semestre: '',
    edad: '',
    materiasAsignadas: [],
    foto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [campoBusqueda, setCampoBusqueda] = useState('todos');
  const [mostrarOpcionesBusqueda, setMostrarOpcionesBusqueda] = useState(false);

  // Definir las carreras disponibles
  const carrerasDisponibles = ['ISC', 'LA', 'LCP', 'IM'];

  const camposFiltro = [
    { value: 'todos', label: 'Todos los campos' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'numControl', label: 'Número de control' },
    { value: 'carrera', label: 'Carrera' },
    { value: 'semestre', label: 'Semestre' },
    { value: 'edad', label: 'Edad' }
  ];

  // Obtener lista de alumnos al cargar
  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    try {
      const res = await obtenerAlumnos();
      setAlumnos(res.data);
    } catch (error) {
      console.error('❌ Error al cargar alumnos:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar alumnos',
        text: error.message,
        confirmButtonColor: '#800020'
      });
    }
  };

  // Función de validación para número de control
  const validarNumeroControl = (numControl) => {
    return /^\d{8}$/.test(numControl);
  };

  // Función para validar nombre
  const validarNombre = (nombre) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
  };

  // Función para verificar nombre duplicado
  const nombreExiste = (nombre) => {
    return alumnos.some(alumno => 
      alumno.nombre.toLowerCase() === nombre.toLowerCase() &&
      (!alumnoSeleccionado || alumno._id !== alumnoSeleccionado._id)
    );
  };

  // Validación antes de guardar
  const validarFormulario = () => {
    // Validar número de control (solo en agregar)
    if (mostrarModalAgregar && !validarNumeroControl(nuevoAlumno.numControl)) {
      Swal.fire('Error', 'El número de control debe tener exactamente 8 dígitos', 'error');
      return false;
    }

    // Validar nombre
    const nombre = mostrarModalAgregar ? nuevoAlumno.nombre : alumnoSeleccionado.nombre;
    if (!nombre || !validarNombre(nombre)) {
      Swal.fire('Error', 'El nombre solo puede contener letras y espacios', 'error');
      return false;
    }

    if (nombreExiste(nombre)) {
      Swal.fire('Error', 'Este nombre ya está registrado', 'error');
      return false;
    }

    // Validar carrera
    const carrera = mostrarModalAgregar ? nuevoAlumno.carrera : alumnoSeleccionado.carrera;
    if (!carrera || !carrerasDisponibles.includes(carrera)) {
      Swal.fire('Error', 'Seleccione una carrera válida', 'error');
      return false;
    }

    // Validar semestre
    const semestre = mostrarModalAgregar ? nuevoAlumno.semestre : alumnoSeleccionado.semestre;
    if (!semestre || semestre < 1 || semestre > 12) {
      Swal.fire('Error', 'Seleccione un semestre válido (1-12)', 'error');
      return false;
    }

    // Validar edad
    const edad = mostrarModalAgregar ? nuevoAlumno.edad : alumnoSeleccionado.edad;
    if (!edad || edad < 15 || edad > 100) {
      Swal.fire('Error', 'La edad debe estar entre 15 y 100 años', 'error');
      return false;
    }

    return true;
  };

  const toggleMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800020',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await eliminarAlumno(id);
        await cargarAlumnos();
        Swal.fire(
          '¡Eliminado!',
          'El alumno ha sido eliminado.',
          'success'
        );
        setMenuAbierto(null);
      } catch (error) {
        console.error('❌ Error al eliminar alumno:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar alumno',
          text: error.message,
          confirmButtonColor: '#800020'
        });
      }
    }
  };

  const handleEditar = (alumno) => {
    console.log("Alumno recibido en editar:", alumno); 
    setAlumnoSeleccionado(alumno);
    setPreviewImage(alumno.foto || null);
    setMostrarModal(true);
    setMenuAbierto(null);
  };

  const handleVerAlumno = (alumno) => {
    navigate(`/detalle-alumno/${alumno._id}`, { state: { alumno } });
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMostrarModalAgregar(false);
    setAlumnoSeleccionado(null);
    setNuevoAlumno({
      numControl: '',
      nombre: '',
      carrera: '',
      semestre: '',
      edad: '',
      materiasAsignadas: [],
      foto: null
    });
    setPreviewImage(null);
  };

  const toggleBusqueda = () => {
    setBusquedaActiva(!busquedaActiva);
    if (busquedaActiva) {
      setTerminoBusqueda('');
    }
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    console.log("🔍 ID que se va a enviar:", alumnoSeleccionado?._id);

    try {
      await actualizarAlumno(alumnoSeleccionado._id, {
        ...alumnoSeleccionado,
        foto: previewImage || alumnoSeleccionado.foto
      });
      
      await cargarAlumnos();
      
      Swal.fire({
        icon: 'success',
        title: '¡Cambios guardados!',
        showConfirmButton: false,
        timer: 1500
      });
      
      cerrarModal();
    } catch (error) {
      console.error('❌ Error al actualizar alumno:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar alumno',
        text: error.message,
        confirmButtonColor: '#800020'
      });
    }
  };

const handleAgregarAlumno = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  // Validación frontend de duplicados
  const duplicado = alumnos.find(a => a.numControl === nuevoAlumno.numControl);
  if (duplicado) {
    Swal.fire({
      icon: 'warning',
      title: 'Número de control duplicado',
      text: 'Ya existe un alumno con ese número de control.',
      confirmButtonColor: '#800020'
    });
    return;
  }

  try {
    await crearAlumno({
      ...nuevoAlumno,
      foto: previewImage || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
    });

    await cargarAlumnos();

    Swal.fire({
      icon: 'success',
      title: '¡Alumno agregado!',
      showConfirmButton: false,
      timer: 1500
    });

    cerrarModal();
  } catch (error) {
    console.error('❌ Error al agregar alumno:', error.message);

    Swal.fire({
      icon: 'error',
      title: 'Error al agregar alumno',
      text: error.response?.data?.message || 'Error desconocido',
      confirmButtonColor: '#800020'
    });
  }
};


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        if (mostrarModal) {
          setAlumnoSeleccionado({
            ...alumnoSeleccionado,
            foto: reader.result
          });
        } else {
          setNuevoAlumno({
            ...nuevoAlumno,
            foto: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        if (mostrarModal) {
          setAlumnoSeleccionado({
            ...alumnoSeleccionado,
            foto: reader.result
          });
        } else {
          setNuevoAlumno({
            ...nuevoAlumno,
            foto: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Archivo no válido',
        text: 'Por favor, sube solo imágenes',
        confirmButtonColor: '#800020'
      });
    }
  }, [mostrarModal, alumnoSeleccionado, nuevoAlumno]);

const alumnosFiltrados = alumnos.filter(alumno => {
  if (!terminoBusqueda) return true;

  const termino = terminoBusqueda.toLowerCase();

  switch (campoBusqueda) {
    case 'nombre':
      return alumno.nombre.toLowerCase().includes(termino);
    case 'numControl':
      return alumno.numControl.includes(termino);
    case 'carrera':
      return alumno.carrera.toLowerCase().includes(termino);
    case 'semestre':
      return alumno.semestre.toString().includes(termino);
    case 'edad':
      return alumno.edad.toString().includes(termino);
    default:
      return (
        alumno.nombre.toLowerCase().includes(termino) ||
        alumno.numControl.includes(termino) ||
        alumno.carrera.toLowerCase().includes(termino) ||
        alumno.semestre.toString().includes(termino) ||
        alumno.edad.toString().includes(termino)
      );
  }
});


  return (
    <div className="alumnos-container">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="titulo-principal"
      >
        Gestión de Alumnos
      </motion.h2>

      <div className="header-acciones">
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          className="btn-agregar"
          onClick={() => setMostrarModalAgregar(true)}
        >
          Agregar alumno
        </motion.button>

        <div className="contenedor-busqueda">
          {busquedaActiva ? (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              className="barra-busqueda"
            >
              <div className="busqueda-input-container">
                <FiSearch className="icono-busqueda" />
                <input
                  type="text"
                  placeholder={`Buscar en ${camposFiltro.find(c => c.value === campoBusqueda)?.label}...`}
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  autoFocus
                />
                {terminoBusqueda && (
                  <button 
                    onClick={() => setTerminoBusqueda('')} 
                    className="btn-limpiar-busqueda"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              
              <div className="select-filtro-container">
                <button 
                  className="btn-filtro"
                  onClick={() => setMostrarOpcionesBusqueda(!mostrarOpcionesBusqueda)}
                >
                  {camposFiltro.find(c => c.value === campoBusqueda)?.label}
                  {mostrarOpcionesBusqueda ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {mostrarOpcionesBusqueda && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="opciones-filtro"
                  >
                    {camposFiltro.map((campo) => (
                      <button
                        key={campo.value}
                        className={`opcion-filtro ${campoBusqueda === campo.value ? 'active' : ''}`}
                        onClick={() => {
                          setCampoBusqueda(campo.value);
                          setMostrarOpcionesBusqueda(false);
                        }}
                      >
                        {campo.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              <button onClick={toggleBusqueda} className="btn-cerrar-busqueda">
                <FiX size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleBusqueda}
              className="btn-busqueda"
            >
              <FiSearch size={20} />
              <span className="tooltip">Buscar alumnos</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid-alumnos">
        <AnimatePresence>
          <div className="resumen-alumnos">
            <p>
              Alumnos Irregulares:{" "}
              <strong>
                {alumnosFiltrados.filter(a => a.status === "Irregular").length}
              </strong>{" "}
              / Total: <strong>{alumnosFiltrados.length}</strong>
            </p>
          </div>

          {alumnosFiltrados.map((alumno) => (
            <motion.div
              key={alumno._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`tarjeta-alumno ${alumno.status === 'Irregular' ? 'alumno-irregular' : ''}`}
              layout
            >
              <div className="tarjeta-header">
                <img 
                  src={alumno.foto || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`} 
                  alt={alumno.nombre} 
                  className="foto-alumno" 
                />
                <div className="info-principal">
                  <h3>{alumno.nombre}</h3>
                  <p>No. Control: {alumno.numControl}</p>
                </div>
                <div className="menu-contenedor">
                  <button 
                    className="btn-menu" 
                    onClick={() => toggleMenu(alumno._id)}
                  >
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                  </button>

                  {menuAbierto === alumno._id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="menu-opciones"
                    >
                      <button onClick={() => handleVerAlumno(alumno)}>
                        <FiUser className="menu-icon" /> Ver Alumno
                      </button>
                      <button onClick={() => handleEditar(alumno)}>
                        <FiEdit2 className="menu-icon" /> Modificar
                      </button>
                      <button onClick={() => handleEliminar(alumno._id)}>
                        <FiTrash2 className="menu-icon" /> Eliminar
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="detalles-alumno">
                <div className="detalle-item">
                  <span>Carrera:</span>
                  <p>{alumno.carrera}</p>
                </div>
                <div className="detalle-item">
                  <span>Semestre:</span>
                  <p>{alumno.semestre}</p>
                </div>
                <div className="detalle-item">
                  <span>Edad:</span>
                  <p>{alumno.edad}</p>
                </div>
                <div className="detalle-item">
                  <span>Status:</span>
                  <p className={alumno.status === 'Irregular' ? 'texto-rojo' : 'texto-verde'}>
                    {alumno.status}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal para editar */}
      <AnimatePresence>
        {mostrarModal && alumnoSeleccionado && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-contenido"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>Editar Alumno</h3>
              <form onSubmit={handleGuardarCambios}>
                <div className="form-group">
                  <label>Número de Control</label>
                  <input 
                    type="text" 
                    value={alumnoSeleccionado.numControl || ''} 
                    readOnly
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Nombre</label>
                  <input 
                    type="text" 
                    value={alumnoSeleccionado.nombre || ''} 
                    onChange={(e) => {
                      const value = e.target.value;
                      if (validarNombre(value) || value === '') {
                        setAlumnoSeleccionado({
                          ...alumnoSeleccionado,
                          nombre: value
                        });
                      }
                    }}
                    required
                  />
                  {alumnoSeleccionado.nombre && !validarNombre(alumnoSeleccionado.nombre) && (
                    <p className="error-message">Solo se permiten letras y espacios</p>
                  )}
                  {nombreExiste(alumnoSeleccionado.nombre) && (
                    <p className="error-message">Este nombre ya está registrado</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Carrera</label>
                  <select
                    value={alumnoSeleccionado.carrera || ''}
                    onChange={(e) => setAlumnoSeleccionado({
                      ...alumnoSeleccionado,
                      carrera: e.target.value
                    })}
                    required
                  >
                    <option value="">Seleccione una carrera</option>
                    {carrerasDisponibles.map((carrera) => (
                      <option key={carrera} value={carrera}>{carrera}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Semestre</label>
                  <select
                    value={alumnoSeleccionado.semestre || ''}
                    onChange={(e) => setAlumnoSeleccionado({
                      ...alumnoSeleccionado,
                      semestre: e.target.value
                    })}
                    required
                  >
                    <option value="">Seleccione un semestre</option>
                    {Array.from({length: 12}, (_, i) => i + 1).map((semestre) => (
                      <option key={semestre} value={semestre}>{semestre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Edad</label>
                  <input 
                    type="number" 
                    value={alumnoSeleccionado.edad || ''} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setAlumnoSeleccionado({
                        ...alumnoSeleccionado,
                        edad: value
                      });
                    }}
                    required
                    min="15"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Foto del Alumno</label>
                  <div 
                    className={`upload-area ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {previewImage ? (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                        <button 
                          type="button" 
                          className="btn-cambiar-imagen"
                          onClick={() => document.getElementById('fileInputEdit').click()}
                        >
                          Cambiar imagen
                        </button>
                      </div>
                    ) : (
                      <div className="upload-instructions">
                        <FiUpload size={40} />
                        <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                        <button 
                          type="button" 
                          className="btn-seleccionar-imagen"
                          onClick={() => document.getElementById('fileInputEdit').click()}
                        >
                          Seleccionar imagen
                        </button>
                      </div>
                    )}
                    <input 
                      id="fileInputEdit"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <div className="modal-botones">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-cancelar"
                    onClick={cerrarModal}
                    type="button"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-guardar"
                    type="submit"
                  >
                    Guardar Cambios
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para agregar */}
      <AnimatePresence>
        {mostrarModalAgregar && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-contenido"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>Agregar Nuevo Alumno</h3>
              <form onSubmit={handleAgregarAlumno}>
                <div className="form-group">
                  <label>Número de Control</label>
                  <input 
                    type="text" 
                    value={nuevoAlumno.numControl} 
                    onChange={(e) => {
                      // Solo permite números y limita a 8 caracteres
                      const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setNuevoAlumno({
                        ...nuevoAlumno,
                        numControl: value
                      });
                    }}
                    required
                    maxLength={8}
                    pattern="\d{8}"
                    title="El número de control debe tener exactamente 8 dígitos"
                  />
                  {nuevoAlumno.numControl.length > 0 && !validarNumeroControl(nuevoAlumno.numControl) && (
                    <p className="error-message">El número de control debe tener 8 dígitos</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Nombre</label>
                  <input 
                    type="text" 
                    value={nuevoAlumno.nombre} 
                    onChange={(e) => {
                      const value = e.target.value;
                      if (validarNombre(value) || value === '') {
                        setNuevoAlumno({
                          ...nuevoAlumno,
                          nombre: value
                        });
                      }
                    }}
                    required
                  />
                  {nuevoAlumno.nombre && !validarNombre(nuevoAlumno.nombre) && (
                    <p className="error-message">Solo se permiten letras y espacios</p>
                  )}
                  {nombreExiste(nuevoAlumno.nombre) && (
                    <p className="error-message">Este nombre ya está registrado</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Carrera</label>
                  <select
                    value={nuevoAlumno.carrera}
                    onChange={(e) => setNuevoAlumno({
                      ...nuevoAlumno,
                      carrera: e.target.value
                    })}
                    required
                  >
                    <option value="">Seleccione una carrera</option>
                    {carrerasDisponibles.map((carrera) => (
                      <option key={carrera} value={carrera}>{carrera}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Semestre</label>
                  <select
                    value={nuevoAlumno.semestre}
                    onChange={(e) => setNuevoAlumno({
                      ...nuevoAlumno,
                      semestre: e.target.value
                    })}
                    required
                  >
                    <option value="">Seleccione un semestre</option>
                    {Array.from({length: 12}, (_, i) => i + 1).map((semestre) => (
                      <option key={semestre} value={semestre}>{semestre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Edad</label>
                  <input 
                    type="number" 
                    value={nuevoAlumno.edad} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setNuevoAlumno({
                        ...nuevoAlumno,
                        edad: value
                      });
                    }}
                    required
                    min="15"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Foto del Alumno (Opcional)</label>
                  <div 
                    className={`upload-area ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {previewImage ? (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                        <button 
                          type="button" 
                          className="btn-cambiar-imagen"
                          onClick={() => document.getElementById('fileInputAdd').click()}
                        >
                          Cambiar imagen
                        </button>
                      </div>
                    ) : (
                      <div className="upload-instructions">
                        <FiUpload size={40} />
                        <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                        <button 
                          type="button" 
                          className="btn-seleccionar-imagen"
                          onClick={() => document.getElementById('fileInputAdd').click()}
                        >
                          Seleccionar imagen
                        </button>
                      </div>
                    )}
                    <input 
                      id="fileInputAdd"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <div className="modal-botones">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-cancelar"
                    onClick={cerrarModal}
                    type="button"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-guardar"
                    type="submit"
                  >
                    Agregar Alumno
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Alumnos;