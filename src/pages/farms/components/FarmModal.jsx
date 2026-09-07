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
      setProducerId(farmToEdit.producer_id ? String(farmToEdit.producer_id) : '');
      setFarmName(farmToEdit.farm_name || '');
      setCity(farmToEdit.city || '');
      setState(farmToEdit.state || '');
      setTotalFarmArea(farmToEdit.total_farm_area || '');
      setArableArea(farmToEdit.arable_area || '');
      setVegetationArea(farmToEdit.vegetation_area || '');
      setHarvest(new Date().getFullYear()); // Mantém o ano atual como padrão para novas adições
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

  const handleRemoveCrop = async (crop, index) => {
    if (window.confirm(`Deseja realmente remover a cultura ${crop.crop_name}?`)) {
      if (crop.id) {
        try {
          await farmCropsService.remove(crop.id);
          setCurrentCrops(prev => prev.filter(c => c.id !== crop.id));
          if (onRefreshData) onRefreshData();
        } catch (error) {
          setLocalError('Erro ao excluir a cultura do servidor.');
        }
      } else {
        setCurrentCrops(prev => prev.filter((_, i) => i !== index));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!producerId) {
      setLocalError('Por favor, selecione um produtor responsável.');
      return;
    }

    const newCropsToSave = currentCrops
        .filter(crop => !crop.id)
        .map(crop => ({
          crop_name: crop.crop_name.toUpperCase(),
          harvest: Number(crop.harvest)
        }));

    onSave({
      id: farmToEdit?.id || null,
      producer_id: Number(producerId),
      farm_name: farmName,
      city,
      state: state.toUpperCase().substring(0, 2),
      total_farm_area: Number(totalFarmArea),
      arable_area: Number(arableArea),
      vegetation_area: Number(vegetationArea),
      newCrops: newCropsToSave
    });
  };

  const handleAddCrops = () => {
    if (!cropsString.trim()) {
      setLocalError('Por favor, digite pelo menos uma cultura agrícola.');
      return;
    }
    if (!harvest) {
      setLocalError('Por favor, defina o ano da safra para esta cultura.');
      return;
    }

    setLocalError('');

    const newCropsArray = cropsString
        .split(',')
        .map(crop => crop.trim())
        .filter(Boolean)
        .map(cropName => ({
          crop_name: cropName.toUpperCase(),
          harvest: Number(harvest)
        }));

    setCurrentCrops(prevCrops => [...prevCrops, ...newCropsArray]);
    setCropsString('');
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

                <div className="row g-3 mb-4">
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
                    <label className="form-label small fw-bold text-muted">Área Total (Hectares)</label>
                    <input type="number" step="0.01" className="form-control" required value={totalFarmArea} onChange={(e) => setTotalFarmArea(e.target.value)} />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Área Agricultável (Hectares)</label>
                    <input type="number" step="0.01" className="form-control" required value={arableArea} onChange={(e) => setArableArea(e.target.value)} />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted">Área de Vegetação (Hectares)</label>
                    <input type="number" step="0.01" className="form-control" required value={vegetationArea} onChange={(e) => setVegetationArea(e.target.value)} />
                  </div>
                </div>

                {/* 🛠️ SESSÃO DE ADIÇÃO DE CULTURAS POR SAFRA */}
                <div className="row g-2 align-items-end border-top pt-3">
                  <div className="col-12 col-md-3">
                    <label className="form-label small fw-bold text-muted">Ano da Safra</label>
                    <input type="number" className="form-control" value={harvest} onChange={(e) => setHarvest(e.target.value)} />
                  </div>
                  <div className="col-12 col-md-7">
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
                  <div className="col-12 col-md-2">
                    {/* Forçado type="button" para não submeter o form e d-block w-100 para alinhar perfeitamente */}
                    <button
                        type="button"
                        className="btn btn-primary d-block w-100 fw-bold"
                        title="Adicionar à Lista"
                        onClick={() => handleAddCrops(farmToEdit)}
                    >
                      <i className="bi bi-plus-lg me-1"></i> Incluir
                    </button>
                  </div>

                  {/* 📊 TABELA DINÂMICA DE CULTURAS POR SAFRA */}
                  <div className="col-12 mt-4">
                    <label className="form-label small fw-bold text-muted mb-2">
                      Lista de Culturas da Propriedade (Vinculadas por Safra):
                    </label>
                    <div className="card border shadow-sm">
                      <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="table table-sm table-hover align-middle mb-0 text-center">
                          <thead className="table-light sticky-top">
                          <tr>
                            <th className="py-2 text-start px-3">Cultura Agrícola</th>
                            <th className="py-2">Ano da Safra</th>
                            <th className="py-2 text-end px-3">Ação</th>
                          </tr>
                          </thead>
                          <tbody>
                          {currentCrops.length === 0 ? (
                              <tr>
                                <td colSpan="3" className="text-center text-muted py-4 small">
                                  <i className="bi bi-info-circle me-1"></i> Nenhuma cultura adicionada para esta fazenda ainda.
                                </td>
                              </tr>
                          ) : (
                              currentCrops.map((crop, index) => (
                                  <tr key={crop.id ? `db-${crop.id}` : `local-${index}`}>
                                    <td className="text-start fw-semibold text-dark py-2 px-3">
                                      {crop.crop_name.toUpperCase()}
                                    </td>
                                    <td>
                                      <span className="badge bg-light text-dark border">
                                        {crop.harvest}
                                      </span>
                                    </td>
                                    <td className="text-end py-2 px-3">
                                      <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger border-0"
                                          title="Remover cultura"
                                          onClick={() => handleRemoveCrop(crop, index)}
                                      >
                                        <i className="bi bi-trash3-fill"></i>
                                      </button>
                                    </td>
                                  </tr>
                              ))
                          )}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
