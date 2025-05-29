import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import Swal from 'sweetalert2';

function ModalAgregarAlumno({
  nuevoAlumno,
  previewImage,
  isDragging,
  handleAgregarAlumno,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  cerrarModal,
  setNuevoAlumno
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica de campos requeridos
    const camposObligatorios = ['numControl', 'nombre', 'carrera', 'semestre', 'edad'];
    for (let campo of camposObligatorios) {
      if (!nuevoAlumno[campo] || nuevoAlumno[campo].toString().trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Campo obligatorio',
          text: `El campo "${campo}" no puede estar vacío`,
          confirmButtonColor: '#800020'
        });
        return;
      }
    }

    // Si pasa la validación, ejecutamos el handler
    handleAgregarAlumno({ ...nuevoAlumno, foto: previewImage || '' });
  };

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="modal-contenido" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
        <h3>Agregar Nuevo Alumno</h3>
        <form onSubmit={handleSubmit}>
          {/* Campos */}
          {['numControl', 'nombre', 'carrera', 'semestre', 'edad'].map(field => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'edad' || field === 'semestre' ? 'number' : 'text'}
                value={nuevoAlumno[field] || ''}
                onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, [field]: e.target.value })}
                required
              />
            </div>
          ))}

          {/* Foto */}
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

          {/* Botones */}
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
  );
}

export default ModalAgregarAlumno;
