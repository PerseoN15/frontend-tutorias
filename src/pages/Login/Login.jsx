import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { login } from "../../services/authService";
import { useAuth } from '../../context/AuthContext';
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaValido, setCaptchaValido] = useState(false);
  const navigate = useNavigate();
  const { login: guardarSesion } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    contraseña: '',
  });
  const [errores, setErrores] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validar = () => {
    const errores = {};
    if (!formData.nombre) errores.nombre = "El nombre de usuario es obligatorio";
    if (!formData.contraseña) errores.contraseña = "La contraseña es obligatoria";
    return errores;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errores[e.target.name]) {
      setErrores({
        ...errores,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidados = validar();
    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      return;
    }

    if (!captchaValido || !captchaToken) {
      setErrores({ general: "Completa el captcha para continuar" });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await login(formData.nombre, formData.contraseña, captchaToken);
      console.log("✅ Sesión iniciada:", data);
      guardarSesion(data);
      navigate('/PaginaPrincipal');
    } catch (err) {
      setErrores({ general: err.message || "Error al iniciar sesión" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-background"></div>
      
      <div className="login-container">
        <div className="login-header">
          <h2>Bienvenido de vuelta</h2>
          <p>Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        {errores.general && (
          <div className="login-error-message">
            {errores.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nombre">Usuario</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errores.nombre ? 'error-input' : ''}
              placeholder="Ingresa tu nombre de usuario"
            />
            {errores.nombre && <span className="error">{errores.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className={errores.contraseña ? 'error-input' : ''}
              placeholder="••••••••"
            />
            {errores.contraseña && <span className="error">{errores.contraseña}</span>}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Recordar mi sesión</label>
            </div>
            <Link to="/recuperar-contrasena" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <ReCAPTCHA
            sitekey="6LdLX04rAAAAAO2owXiSR88kYywL1AIyTyIr_3gx"
            onChange={(token) => {
              setCaptchaToken(token);
              setCaptchaValido(true);
            }}
            onExpired={() => {
              setCaptchaToken(null);
              setCaptchaValido(false);
            }}
          />
          {!captchaValido && <p className="error">Completa el captcha</p>}

          <button type="submit" disabled={isSubmitting} className="login-button">
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Procesando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes una cuenta? <Link to="/registro" className="register-link">Regístrate aquí</Link></p>
          <Link to="/" className="btn-volver">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;