import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiUsers, 
  FiUserCheck, 
  FiBook, 
  FiLogOut,
  FiChevronLeft,
  FiMenu
} from 'react-icons/fi';
import './Sidebar.css';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de cierre de sesión
    console.log('Cerrando sesión...');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
 
    { path: "/alumnos", name: "Alumnos", icon: <FiUsers /> },
    { path: "/tutores", name: "Tutores", icon: <FiUserCheck /> },
    { path: "/calificaciones", name: "Calificaciones", icon: <FiBook /> }
  ];

  return (
    <motion.div 
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      initial={{ width: 250 }}
      animate={{ width: collapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="sidebar-header">
        {!collapsed && <h2>Tutorías</h2>}
        <motion.button
          onClick={toggleSidebar}
          className="toggle-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {collapsed ? <FiMenu /> : <FiChevronLeft />}
        </motion.button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.path}
            className={({ isActive }) => 
              `link ${isActive ? 'active' : ''}`
            }
            onMouseEnter={() => setHoveredItem(item.path)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div
              className="link-content"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="link-icon">{item.icon}</span>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: collapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="link-text"
                >
                  {item.name}
                </motion.span>
              )}
            </motion.div>

            <AnimatePresence>
              {hoveredItem === item.path && collapsed && (
                <motion.div
                  className="tooltip"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <motion.div 
        className="logout-container"
        onMouseEnter={() => setHoveredItem('logout')}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <motion.button
          onClick={handleLogout}
          className="logout-btn"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="link-icon"><FiLogOut /></span>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="link-text"
            >
              Cerrar sesión
            </motion.span>
          )}
        </motion.button>

        <AnimatePresence>
          {hoveredItem === 'logout' && collapsed && (
            <motion.div
              className="tooltip"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              Cerrar sesión
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;