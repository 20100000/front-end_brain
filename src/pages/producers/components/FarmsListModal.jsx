import React from 'react';

export default function FarmsListModal({ show, onClose, producer }) {
  if (!show || !producer) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-house-fill text-success me-2"></i>
              Fazendas de: <span className="text-success">{producer.producer_name}</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {!producer.farms || producer.farms.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="bi bi-exclamation-circle fs-2 d-block mb-2 text-secondary"></i>
                Este produtor ainda não possui nenhuma fazenda vinculada.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2">Nome da Fazenda</th>
                      <th className="py-2">Localização</th>
                      <th className="py-2 text-end">Área Total (ha)</th>
                      <th className="py-2 text-center">Safra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {producer.farms.map((farm) => (
                      <tr key={farm.id}>
                        <td className="py-2 fw-semibold text-dark">{farm.farm_name}</td>
                        <td className="py-2">{farm.city} - {farm.state}</td>
                        <td className="py-2 text-end text-success fw-bold">
                          {Number(farm.total_farm_area).toFixed(2)}
                        </td>
                        <td className="py-2 text-center">
                          <span className="badge bg-light text-dark border">{farm.harvest}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
