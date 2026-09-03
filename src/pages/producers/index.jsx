import React, { useState, useEffect } from 'react';
import { ruralProducerService } from '../../services/ruralProducerService';
import ProducerModal from './components/ProducerModal';
import FarmsListModal from './components/FarmsListModal';


export default function Producers() {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState(null); 
  const [errorMsg, setErrorMsg] = useState('');
  const [showFarmsModal, setShowFarmsModal] = useState(false);
  const [producerForFarms, setProducerForFarms] = useState(null);


  const loadProducers = async () => {
    try {
      setLoading(true);
      const data = await ruralProducerService.findAll();
      setProducers(data);
    } catch (error) {
      console.error('Erro ao buscar produtores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducers();
  }, []);

  const handleOpenFarmsModal = (producer) => {
    setProducerForFarms(producer);
    setShowFarmsModal(true);
  };


  const handleOpenCreateModal = () => {
    setSelectedProducer(null);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (producer) => {
    setSelectedProducer(producer);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSaveProducer = async (formData) => {
    setErrorMsg('');
    try {
      if (formData.id) {
        await ruralProducerService.update(formData.id, {
          producer_name: formData.producer_name,
        });
      } else {
        await ruralProducerService.create({
          producer_name: formData.producer_name,
          document: formData.document,
        });
      }

      setShowModal(false);
      loadProducers(); 
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao processar requisição.';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produtor? Todas as suas fazendas serão excluídas junto.')) {
      try {
        await ruralProducerService.remove(id);
        loadProducers();
      } catch (error) {
        alert('Erro ao excluir produtor.');
      }
    }
  };

  const formatDocument = (doc, type) => {
    if (!doc) return '';
    if (type === 'cpf' && doc.length === 11) return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    if (type === 'cnpj' && doc.length === 14) return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    return doc;
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Gerenciamento de Produtores</h2>
        <button className="btn btn-success d-flex align-items-center" onClick={handleOpenCreateModal}>
          <i className="bi bi-person-plus-fill me-2"></i> Novo Produtor
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 bg-white">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="py-3">Nome / Razão Social</th>
                  <th className="py-3">Documento</th>
                  <th className="py-3">Tipo</th>
                  <th className="py-3 text-center">Fazendas</th>
                  <th className="px-4 py-3 text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {producers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-5">Nenhum produtor encontrado.</td></tr>
                ) : (
                  producers.map((producer) => (
                    <tr key={producer.id}>
                      <td className="fw-semibold text-dark">{producer.producer_name}</td>
                      <td><code className="text-dark bg-light px-2 py-1 rounded">{formatDocument(producer.document, producer.document_type)}</code></td>
                      <td><span className={`badge ${producer.document_type === 'cpf' ? 'bg-info text-dark' : 'bg-primary'}`}>{producer.document_type.toUpperCase()}</span></td>
                      <td className="text-center">
                        <span 
                          className="badge bg-secondary rounded-pill px-3" 
                          style={{ cursor: 'pointer' }} 
                          title="Clique para ver as fazendas"
                          onClick={() => handleOpenFarmsModal(producer)}
                        >
                          {producer.farms?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 text-end">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" title="Editar" onClick={() => handleOpenEditModal(producer)}><i className="bi bi-pencil-square"></i></button>
                          <button className="btn btn-outline-danger" title="Deletar" onClick={() => handleDelete(producer.id)}><i className="bi bi-trash3-fill"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProducerModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProducer}
        producerToEdit={selectedProducer}
        errorMsg={errorMsg}
      />

      <FarmsListModal 
        show={showFarmsModal}
        onClose={() => setShowFarmsModal(false)}
        producer={producerForFarms}
      />
      
    </div>
  );
}
