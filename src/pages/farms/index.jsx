import React, { useState, useEffect } from 'react';
import { farmService } from '../../services/farmService';
import { ruralProducerService } from '../../services/ruralProducerService';
import FarmModal from './components/FarmModal'; 

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null); 
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [farmsData, producersData] = await Promise.all([
        farmService.findAll(),
        ruralProducerService.findAll()
      ]);
      setFarms(farmsData);
      setProducers(producersData);
    } catch (error) {
      console.error('Erro ao carregar dados de fazendas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedFarm(null);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (farm) => {
    setSelectedFarm(farm);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSaveFarm = async (formData) => {
    setErrorMsg('');

    if (formData.arable_area + formData.vegetation_area > formData.total_farm_area) {
      setErrorMsg(`A soma da área arável (${formData.arable_area} ha) e de vegetação (${formData.vegetation_area} ha) totaliza ${formData.arable_area + formData.vegetation_area} ha, ultrapassando a área total (${formData.total_farm_area} ha).`);
      return;
    }

    try {
      const cropsArray = formData.cropsString
        ? formData.cropsString.split(',').map(c => c.trim()).filter(Boolean)
        : [];

      if (formData.id) {
        const formattedCrops = cropsArray.map(name => {
          const match = selectedGridFarmCrops(formData.id)?.find(c => c.crop_name.toLowerCase() === name.toLowerCase());
          return match ? { id: match.id, crop_name: name } : { crop_name: name };
        });

        await farmService.update(formData.id, {
          producer_id: formData.producer_id,
          farm_name: formData.farm_name,
          city: formData.city,
          state: formData.state,
          total_farm_area: formData.total_farm_area,
          arable_area: formData.arable_area,
          vegetation_area: formData.vegetation_area,
          harvest: formData.harvest,
          crops: formData.newCrops || []
        });
      } else {
        await farmService.create({
          producer_id: formData.producer_id,
          farm_name: formData.farm_name,
          city: formData.city,
          state: formData.state,
          total_farm_area: formData.total_farm_area,
          arable_area: formData.arable_area,
          vegetation_area: formData.vegetation_area,
          harvest: formData.harvest,
          initial_crops: formData.newCrops || []
        });
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar fazenda.';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta propriedade rural?')) {
      try {
        await farmService.remove(id);
        loadData();
      } catch (error) {
        alert('Erro ao excluir fazenda.');
      }
    }
  };

  const selectedGridFarmCrops = (farmId) => {
    return farms.find(f => f.id === farmId)?.crops || [];
  };

  const getProducerName = (producerId) => {
    const producer = producers.find(p => p.id === producerId);
    return producer ? producer.producer_name : <span className="text-muted small">Desconhecido</span>;
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Gerenciamento de Fazendas</h2>
        <button className="btn btn-success d-flex align-items-center" onClick={handleOpenCreateModal}>
          <i className="bi bi-house-add-fill me-2"></i> Nova Fazenda
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
                  <th className="py-3">Fazenda</th>
                  <th className="py-3">Produtor Vinculado</th>
                  <th className="py-3">Localização</th>
                  <th className="py-3 text-end">Área Total</th>
                  <th className="py-3 text-center">Safra</th>
                  <th className="py-3">Culturas</th>
                  <th className="px-4 py-3 text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {farms.length === 0 ? (
                  <tr><td colSpan="8" className="text-center text-muted py-5">Nenhuma propriedade cadastrada.</td></tr>
                ) : (
                  farms.map((farm) => (
                    <tr key={farm.id}>
                      <td className="fw-semibold text-dark">{farm.farm_name}</td>
                      <td className="text-primary fw-medium">{getProducerName(farm.producer_id)}</td>
                      <td>{farm.city} - {farm.state}</td>
                      <td className="text-end fw-bold text-success">{Number(farm.total_farm_area).toFixed(2)} ha</td>
                      <td className="text-center"><span className="badge bg-light text-dark border">{farm.harvest}</span></td>
                      <td>
                        {farm.crops && farm.crops.length > 0 ? (
                          farm.crops.map(c => (
                            <span key={c.id} className="badge bg-success me-1">{c.crop_name}</span>
                          ))
                        ) : (
                          <span className="text-muted small">Nenhuma</span>
                        )}
                      </td>
                      <td className="px-4 text-end">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" title="Editar" onClick={() => handleOpenEditModal(farm)}><i className="bi bi-pencil-square"></i></button>
                          <button className="btn btn-outline-danger" title="Deletar" onClick={() => handleDelete(farm.id)}><i className="bi bi-trash3-fill"></i></button>
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

      <FarmModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveFarm}
        farmToEdit={selectedFarm}
        producers={producers}
        errorMsg={errorMsg}
        onRefreshData={loadData}
      />
    </div>
  );
}
