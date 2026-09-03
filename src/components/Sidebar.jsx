import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-dark text-white p-3" style={{ width: '240px', minHeight: 'calc(100vh - 60px)', position: 'fixed', top: '60px', left: 0 }}>
      <p className="text-muted text-uppercase small fw-bold mb-3 px-2">Navegação</p>
      
      <div className="nav nav-pills flex-column">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `nav-link text-white mb-2 ${isActive ? 'bg-success active' : 'bg-transparent'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </NavLink>

        <NavLink 
          to="/producers" 
          className={({ isActive }) => `nav-link text-white mb-2 ${isActive ? 'bg-success active' : 'bg-transparent'}`}
        >
          <i className="bi bi-people me-2"></i> Produtores
        </NavLink>

        <NavLink 
          to="/farms" 
          className={({ isActive }) => `nav-link text-white mb-2 ${isActive ? 'bg-success active' : 'bg-transparent'}`}
        >
          <i className="bi bi-house-door me-2"></i> Fazendas
        </NavLink>
      </div>
    </div>
  );
}
