import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

const login = (usuarioData) => {
  const { token, usuario } = usuarioData;

  const userData = {
    token,
    ...usuario, 
  };

  setUsuario(userData);
  localStorage.setItem('usuario', JSON.stringify(userData));
};


  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    setTiempoRestante(null);
  };

  // ⏰ Cierre automático + contador
  useEffect(() => {
    let timeout;
    let alertaTimeout;
    let interval;

    const tiempoExpiracion = 10 * 60 * 1000; // 10 min
    const tiempoAlerta = 9 * 60 * 1000;      // 9 min
    let tiempoFinal = Date.now() + tiempoExpiracion;

    const resetTimer = () => {
      clearTimeout(timeout);
      clearTimeout(alertaTimeout);
      clearInterval(interval);
      tiempoFinal = Date.now() + tiempoExpiracion;

      interval = setInterval(() => {
        const tiempoMs = tiempoFinal - Date.now();
        setTiempoRestante(Math.max(0, Math.floor(tiempoMs / 1000)));
      }, 1000);

      alertaTimeout = setTimeout(() => {
        alert("⚠️ Inactividad detectada. Tu sesión se cerrará en 1 minuto si no interactúas.");
      }, tiempoAlerta);

      timeout = setTimeout(() => {
        logout();
        alert("🔒 Tu sesión ha sido cerrada por inactividad.");
        window.location.href = "/login";
      }, tiempoExpiracion);
    };

    const eventos = ['mousemove', 'keydown', 'click', 'scroll'];
    eventos.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      clearTimeout(alertaTimeout);
      clearInterval(interval);
      eventos.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, tiempoRestante }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
