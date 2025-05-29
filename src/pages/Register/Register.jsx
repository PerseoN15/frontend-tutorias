import React, { useState, useEffect } from 'react';
import './Register.css';
import { useNavigate, Link } from 'react-router-dom';
import { register } from "../../services/authService";
import { checkUsernameExists } from '../../services/authService';

import Swal from 'sweetalert2';

function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '',
    contraseña: '',
  });

  const [errores, setErrores] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.register-container');
    if (container) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  const validar = () => {
    const errores = {};
    if (!formData.nombre.trim()) errores.nombre = "El nombre es obligatorio";
    if (!formData.contraseña) {
      errores.contraseña = "La contraseña es obligatoria";
    } else if (formData.contraseña.length < 6) {
      errores.contraseña = "La contraseña debe tener al menos 6 caracteres";
    }
    return errores;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Resetear la validación de nombre disponible cuando cambia
    if (name === 'nombre') {
      setUsernameAvailable(true);
    }
    
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: null,
      });
    }
  };

const checkUsernameAvailability = async () => {
  try {
    if (!formData.nombre.trim()) return false;

    const exists = await checkUsernameExists(formData.nombre);
    return !exists; // ✅ Si no existe, está disponible
  } catch (error) {
    console.error("Error al verificar nombre de usuario:", error);
    return false;
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const erroresValidados = validar();
  if (Object.keys(erroresValidados).length > 0) {
    setErrores(erroresValidados);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setIsSubmitting(false);
    return;
  }

  // ✅ Verificar si el nombre de usuario está disponible
  const isAvailable = await checkUsernameAvailability();
  if (!isAvailable) {
    setErrores({ ...errores, nombre: "Este nombre de usuario ya está registrado" });
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setIsSubmitting(false);

    Swal.fire({
      title: 'Usuario existente',
      text: 'El nombre de usuario ya está registrado. Por favor elige otro.',
      icon: 'error',
      confirmButtonColor: '#7B1F3E',
    });
    return;
  }

  try {
    const data = await register(formData);
    const container = document.querySelector('.register-container');
    container.style.transition = 'all 0.5s ease';
    container.style.transform = 'scale(1.05)';
    container.style.boxShadow = '0 0 20px rgba(123, 31, 62, 0.5)';

    Swal.fire({
      title: '¡Registro exitoso!',
      text: 'Serás redirigido al login',
      icon: 'success',
      confirmButtonColor: '#7B1F3E',
    }).then(() => {
      navigate('/login');
    });
  } catch (error) {
    Swal.fire({
      title: 'Error al registrar',
      text: error.message || 'Ocurrió un error durante el registro',
      icon: 'error',
      confirmButtonColor: '#7B1F3E',
    });
    setShake(true);
    setTimeout(() => setShake(false), 500);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className={`register-wrapper ${shake ? 'shake-animation' : ''}`}>
      <div className="register-container">
        <div className="register-header">
          <h2 className="register-title">Crear Cuenta</h2>
          <div className="register-decoration"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className={`form-group ${errores.nombre ? 'error' : ''}`}>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-input"
              placeholder="Nombre de usuario"
            />
            {errores.nombre && <span className="error-message">{errores.nombre}</span>}
            {!usernameAvailable && (
              <span className="error-message">Este nombre de usuario ya está registrado</span>
            )}
          </div>

          <div className={`form-group ${errores.contraseña ? 'error' : ''}`}>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="form-input"
              placeholder="Contraseña"
            />
            {errores.contraseña && <span className="error-message">{errores.contraseña}</span>}
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p className="login-link">
            ¿Ya tienes una cuenta? <Link to="/login" className="link">Inicia sesión</Link>
          </p>
          <Link to="/" className="back-button">
            <span>←</span> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;