import React, { useState, useEffect } from 'react';

export default function ProducerModal({ show, onClose, onSave, producerToEdit, errorMsg }) {
  const [producerName, setProducerName] = useState('');
  const [document, setDocument] = useState('');

  useEffect(() => {
    if (producerToEdit && producerToEdit.id) {
      setProducerName(producerToEdit.producer_name || '');
      setDocument(producerToEdit.document || '');
    } else {
      setProducerName('');
      setDocument('');
    }
  }, [producerToEdit, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: producerToEdit?.id || null,
      producer_name: producerName,
      document: document,
    });
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className={`modal-header text-white ${producerToEdit?.id ? 'bg-primary' : 'bg-success'}`}>
            <h5 className="modal-title fw-bold">
              <i className={`bi ${producerToEdit?.id ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
              {producerToEdit?.id ? 'Editar Produtor Rural' : 'Cadastrar Produtor Rural'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {errorMsg && <div className="alert alert-danger p-2 small">{errorMsg}</div>}
              
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Nome / Razão Social</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={producerName} 
                  onChange={(e) => setProducerName(e.target.value)} 
                  placeholder="Ex: Tiago Honorio" 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">CPF ou CNPJ</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  disabled={!!producerToEdit?.id}
                  value={document} 
                  onChange={(e) => setDocument(e.target.value)} 
                  placeholder="Apenas números ou com pontos/traços" 
                />
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className={`btn px-4 text-white ${producerToEdit?.id ? 'bg-primary' : 'bg-success'}`}>
                {producerToEdit?.id ? 'Salvar Alterações' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
