import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaPlus, FaEllipsisV, FaSearch, FaUniversity, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Tutores.css';

function Tutores() {
  const [tutores, setTutores] = useState([
    {
      id: 1,
      nombre: "María González",
      correo: "maria@itsj.edu.mx",
      division: "Ciencias Sociales",
      grupo: "G-101",
      foto: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      nombre: "Carlos Ramírez",
      correo: "carlos@itsj.edu.mx",
      division: "Ciencias Exactas",
      grupo: "G-205",
      foto: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      nombre: "Laura Fernández",
      correo: "laura@itsj.edu.mx",
      division: "Ingenierías",
      grupo: "G-310",
      foto: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tutorEditar, setTutorEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null); // ID del tutor cuyo menú está abierto

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    division: '',
    grupo: ''
  });

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setCargando(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const handleBuscarClick = () => {
    setMostrarBusqueda(!mostrarBusqueda);
    if (mostrarBusqueda) {
      setBusqueda('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tutorEditar) {
      // Editar tutor existente
      setTutores(tutores.map(t => t.id === tutorEditar.id ? formData : t));
    } else {
      // Agregar nuevo tutor
      const nuevoTutor = {
        ...formData,
        id: Math.max(...tutores.map(t => t.id)) + 1,
        foto: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
      };
      setTutores([...tutores, nuevoTutor]);
    }
    setModalAbierto(false);
    setFormData({
      nombre: '',
      correo: '',
      division: '',
      grupo: ''
    });
    setTutorEditar(null);
  };

  const handleEditar = (tutor) => {
    setTutorEditar(tutor);
    setFormData(tutor);
    setModalAbierto(true);
    setMenuAbierto(null);
  };

  const handleEliminar = (id) => {
    setTutores(tutores.filter(t => t.id !== id));
    setMenuAbierto(null);
  };

  const tutoresFiltrados = tutores.filter(tutor => 
    tutor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    tutor.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    tutor.division.toLowerCase().includes(busqueda.toLowerCase()) ||
    tutor.grupo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="tutores-container">
      <motion.div 
        className="header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="titulo-seccion">
          <FaChalkboardTeacher className="icono-titulo" /> Gestión de Tutores
        </h2>
        <div className="acciones-principales">
          <motion.button 
            className="btn btn-buscar"
            onClick={handleBuscarClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSearch /> {mostrarBusqueda ? 'Ocultar' : 'Buscar'}
          </motion.button>
          <motion.button 
            className="btn btn-agregar"
            onClick={() => {
              setTutorEditar(null);
              setModalAbierto(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Agregar Tutor
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mostrarBusqueda && (
          <motion.div 
            className="busqueda-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Buscar por nombre, correo, división o grupo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-busqueda"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {cargando ? (
        <motion.div 
          className="cargando-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner"></div>
          <p>Cargando tutores...</p>
        </motion.div>
      ) : (
        <motion.div 
          className="tarjetas-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tutoresFiltrados.length > 0 ? (
            <div className="grid-tarjetas">
              {tutoresFiltrados.map((tutor) => (
                <motion.div
                  key={tutor.id}
                  className="tarjeta-tutor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                >
                  <div className="tarjeta-header">
                    <div className="foto-tutor">
                      <img src={tutor.foto} alt={tutor.nombre} />
                    </div>
                    <div className="info-principal">
                      <h3>{tutor.nombre}</h3>
                      <p className="correo">{tutor.correo}</p>
                    </div>
                    <div className="menu-acciones">
                      <button 
                        className="btn-menu"
                        onClick={() => toggleMenu(tutor.id)}
                      >
                        <FaEllipsisV />
                      </button>
                      
                      <AnimatePresence>
                        {menuAbierto === tutor.id && (
                          <motion.div 
                            className="menu-opciones"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                          >
                            <button 
                              className="opcion-menu opcion-editar"
                              onClick={() => handleEditar(tutor)}
                            >
                              Editar
                            </button>
                            <button 
                              className="opcion-menu opcion-eliminar"
                              onClick={() => handleEliminar(tutor.id)}
                            >
                              Eliminar
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="tarjeta-detalles">
                    <div className="detalle">
                      <FaUniversity className="icono-detalle" />
                      <span>{tutor.division}</span>
                    </div>
                    <div className="detalle">
                      <FaUsers className="icono-detalle" />
                      <span>{tutor.grupo}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="sin-resultados"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No se encontraron tutores
            </motion.div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {modalAbierto && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalAbierto(false)}
          >
            <motion.div 
              className="modal-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                <FaChalkboardTeacher /> {tutorEditar ? 'Editar Tutor' : 'Nuevo Tutor'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre completo:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>Correo electrónico:</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>División:</label>
                    <select
                      name="division"
                      value={formData.division}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione división</option>
                      <option value="Ciencias Sociales">Ciencias Sociales</option>
                      <option value="Ciencias Exactas">Ciencias Exactas</option>
                      <option value="Ingenierías">Ingenierías</option>
                      <option value="Humanidades">Humanidades</option>
                      <option value="Ciencias de la Salud">Ciencias de la Salud</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Grupo:</label>
                    <input
                      type="text"
                      name="grupo"
                      value={formData.grupo}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej. G-101"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <motion.button 
                    type="button" 
                    className="btn btn-cancelar"
                    onClick={() => setModalAbierto(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="btn btn-guardar"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tutorEditar ? 'Actualizar' : 'Guardar'}
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

export default Tutores;