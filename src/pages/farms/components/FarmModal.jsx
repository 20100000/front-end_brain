import React, { useState, useEffect } from 'react';
import { farmCropsService } from '../../../services/farmCropsService';

export default function FarmModal({ show, onClose, onSave, farmToEdit, producers, errorMsg, onRefreshData }) {
  const [producerId, setProducerId] = useState('');
  const [farmName, setFarmName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [totalFarmArea, setTotalFarmArea] = useState('');
  const [arableArea, setArableArea] = useState('');
  const [vegetationArea, setVegetationArea] = useState('');
  const [harvest, setHarvest] = useState(new Date().getFullYear());
  const [cropsString, setCropsString] = useState('');
  const [currentCrops, setCurrentCrops] = useState([]);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setLocalError('');
    if (farmToEdit && farmToEdit.id) {
      // Força o ID do produtor a ser uma string para o HTML <select> reconhecer a seleção atual
      setProducerId(farmToEdit.producer_id ? String(farmToEdit.producer_id) : '');
      setFarmName(farmToEdit.farm_name || '');
      setCity(farmToEdit.city || '');
      setState(farmToEdit.state || '');
      setTotalFarmArea(farmToEdit.total_farm_area || '');
      setArableArea(farmToEdit.arable_area || '');
      setVegetationArea(farmToEdit.vegetation_area || '');
      setHarvest(farmToEdit.harvest || new Date().getFullYear());
      setCurrentCrops(farmToEdit.crops || []);
      setCropsString('');
    } else {
      setProducerId('');
      setFarmName('');
      setCity('');
      setState('');
      setTotalFarmArea('');
      setArableArea('');
      setVegetationArea('');
      setHarvest(new Date().getFullYear());
      setCurrentCrops([]);
      setCropsString('');
    }
  }, [farmToEdit, show]);

  const handleRemoveCrop = async (cropId) => {
    if (window.confirm('Deseja realmente remover esta cultura desta propriedade?')) {
      try {
        await farmCropsService.remove(cropId);
        const updatedCrops = currentCrops.filter(c => c.id !== cropId);
        setCurrentCrops(updatedCrops);
        if (onRefreshData) onRefreshData();
      } catch (error) {
        setLocalError('Erro ao remover a cultura do banco de dados.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!producerId) {
      setLocalError('Por favor, selecione um produtor responsável.');
      return;
    }

    onSave({
      id: farmToEdit?.id || null,
      producer_id: Number(producerId), // Garante o envio do NOVO ID selecionado como Number para o back-end
      farm_name: farmName,
      city,
      state: state.toUpperCase().substring(0, 2),
      total_farm_area: Number(totalFarmArea),
      arable_area: Number(arableArea),
      vegetation_area: Number(vegetationArea),
      harvest: Number(harvest),
      cropsString
    });
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow">
          <div className={`modal-header text-white ${farmToEdit?.id ? 'bg-primary' : 'bg-success'}`}>
            <h5 className="modal-title fw-bold">
              <i className={`bi ${farmToEdit?.id ? 'bi-pencil-square' : 'bi-house-add-fill'} me-2`}></i>
              {farmToEdit?.id ? 'Editar Propriedade Rural' : 'Cadastrar Propriedade Rural'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {(errorMsg || localError) && <div className="alert alert-danger p-2 small">{errorMsg || localError}</div>}
              
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-muted">Produtor Responsável</label>
                  <select 
                    className="form-select" 
                    required 
                    value={String(producerId)} 
                    onChange={(e) => setProducerId(e.target.value)}
                  >
                    <option value="">Selecione um produtor...</option>
                    {producers.map(p => (
                      <option key={p.id} value={String(p.id)}>{p.producer_name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-muted">Nome da Fazenda</label>
                  <input type="text" className="form-control" required value={farmName} onChange={(e) => setFarmName(e.target.value)} />
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label small fw-bold text-muted">Cidade</label>
                  <input type="text" className="form-control" required value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label small fw-bold text-muted">Estado (UF)</label>
                  <input type="text" className="form-control text-uppercase" maxLength="2" required value={state} onChange={(e) => setState(e.target.value)} />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-bold text-muted">Ano da Safra</label>
                  <input type="number" className="form-control" required value={harvest} onChange={(e) => setHarvest(e.target.value)} />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-bold text-muted">Área Total (Hectares)</label>
                  <input type="number" step="0.01" className="form-control" required value={totalFarmArea} onChange={(e) => setTotalFarmArea(e.target.value)} />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-bold text-muted">Área Agricultável (Hectares)</label>
                  <input type="number" step="0.01" className="form-control" required value={arableArea} onChange={(e) => setArableArea(e.target.value)} />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small fw-bold text-muted">Área de Vegetação (Hectares)</label>
                  <input type="number" step="0.01" className="form-control" required value={vegetationArea} onChange={(e) => setVegetationArea(e.target.value)} />
                </div>

                {farmToEdit?.id && (
                  <div className="col-12">
                    <label className="form-label small d-block fw-bold text-muted mb-2">Culturas Atuais (Clique no X para remover):</label>
                    <div className="p-2 border rounded bg-light">
                      {currentCrops.length === 0 ? (
                        <span className="text-muted small px-1">Nenhuma cultura registrada para esta safra.</span>
                      ) : (
                        currentCrops.map(c => (
                          <span key={c.id} className="badge bg-success p-2 me-2 mb-1 inline-flex align-items-center">
                            {c.crop_name}
                            <button 
                              type="button" 
                              className="btn-close btn-close-white ms-2" 
                              style={{ fontSize: '0.65rem', padding: '2px' }}
                              onClick={() => handleRemoveCrop(c.id)}
                            ></button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">
                    {farmToEdit?.id ? 'Adicionar Novas Culturas (Separadas por vírgula)' : 'Culturas Plantadas (Separadas por vírgula)'}
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={cropsString} 
                    onChange={(e) => setCropsString(e.target.value)} 
                    placeholder="Ex: Soja, Milho, Feijão" 
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className={`btn px-4 text-white ${farmToEdit?.id ? 'bg-primary' : 'bg-success'}`}>
                {farmToEdit?.id ? 'Salvar Alterações' : 'Salvar Fazenda'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
