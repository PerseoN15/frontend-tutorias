import React from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import "./ModalEditarAlumno.css";


Modal.setAppElement('#root');

const ModalEditarAlumno = ({
  modalEditarIsOpen,
  cerrarModalEditar,
  alumnoSeleccionado,
  setAlumnoSeleccionado,
  handleGuardarCambios,
  previewImage,
  setPreviewImage
}) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlumnoSeleccionado({ ...alumnoSeleccionado, [name]: value });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      isOpen={modalEditarIsOpen}
      onRequestClose={cerrarModalEditar}
      contentLabel="Editar Alumno"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Editar Alumno</h2>
      <form onSubmit={handleGuardarCambios} className="formulario">
        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={alumnoSeleccionado?.nombre || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="campo">
          <label>Edad:</label>
          <input
            type="number"
            name="edad"
            value={alumnoSeleccionado?.edad || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="campo">
          <label>Semestre:</label>
          <input
            type="number"
            name="semestre"
            value={alumnoSeleccionado?.semestre || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="campo">
          <label>Carrera:</label>
          <input
            type="text"
            name="carrera"
            value={alumnoSeleccionado?.carrera || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          <input type="file" accept="image/*" onChange={handleImagenChange} />
          {previewImage && <img src={previewImage} alt="Previsualización" className="preview" />}
        </div>

        <div className="acciones">
          <button type="submit" className="btn btn-guardar">Guardar</button>
          <button type="button" className="btn btn-cancelar" onClick={cerrarModalEditar}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalEditarAlumno;
