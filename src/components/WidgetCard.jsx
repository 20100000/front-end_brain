import React from 'react';

export default function WidgetCard({ title, value, icon }) {
  return (
    <div className="card shadow-sm border-0 p-4 h-100 bg-white rounded-3">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          {/* Título da Métrica em Cinza Menor */}
          <h6 className="text-muted text-uppercase small fw-bold mb-2 tracking-wide">
            {title}
          </h6>
          {/* Valor Numérico Grande */}
          <h3 className="mb-0 fw-extrabold text-dark">
            {value}
          </h3>
        </div>
        {/* Ícone Dinâmico do Bootstrap Icons */}
        <div className="fs-1 d-flex align-items-center">
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
}
