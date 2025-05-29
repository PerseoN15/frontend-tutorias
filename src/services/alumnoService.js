// frontend/src/services/alumnoService.js
import API from './api'; // Asegúrate que este archivo ya existe y contiene la instancia de Axios

// Obtener todos los alumnos
export const obtenerAlumnos = () => API.get('/alumnos');

// Obtener un alumno por ID
export const obtenerAlumnoPorId = (id) => API.get(`/alumnos/${id}`);

// Crear un nuevo alumno
export const crearAlumno = (data) => API.post('/alumnos', data);

// Editar alumno existente
export const actualizarAlumno = (id, data) => API.put(`/alumnos/${id}`, data);

// Eliminar alumno
export const eliminarAlumno = (id) => API.delete(`/alumnos/${id}`);

export const asignarMateriasAlumno = (idAlumno, materias) =>
  API.put(`/alumnos/${idAlumno}/asignar-materias`, { materias });

export const registrarCalificacionesAlumno = (id, calificaciones) =>
  API.put(`/alumnos/${id}/registrar-calificaciones`, { calificaciones });

export const eliminarMateriaAsignada = (idAlumno, materiaId) =>
  API.put(`/alumnos/${idAlumno}/eliminar-materia`, { materiaId });

export const eliminarTodasMateriasAlumno = (idAlumno) =>
  API.put(`/alumnos/${idAlumno}/eliminar-todas-materias`);



