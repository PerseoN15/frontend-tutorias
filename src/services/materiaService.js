import API from './api';

export const obtenerMateriasPorCarrera = (carrera) =>
  API.get(`/materias?carrera=${encodeURIComponent(carrera)}`);
