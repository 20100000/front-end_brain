import React from 'react';

export default function Header() {
  return (
    <nav className="navbar navbar-dark bg-dark px-4 shadow-sm" style={{ height: '60px', position: 'fixed', width: '100%', top: 0, zIndex: 1030 }}>
      <span className="navbar-brand mb-0 h1 fw-bold text-success">
        <i className="bi bi-leaf me-2"></i>Brain Agriculture
      </span>
      <div className="text-white small">
        <i className="bi bi-person-circle me-2"></i>Olá, Usuário
      </div>
    </nav>
  );
}
