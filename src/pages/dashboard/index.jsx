import React, { useState, useEffect } from 'react';
import { farmService } from '../../services/farmService';
import WidgetCard from '../../components/WidgetCard';
import StateChart from './components/StateChart';
import CropChart from './components/CropChart';
import LandUseChart from './components/LandUseChart';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [amount, setAmount] = useState(0);
  const [hectares, setHectares] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const [resAmount, resHectares] = await Promise.all([
          farmService.getAmount(),
          farmService.getTotalHectares(),
        ]);
        setAmount(resAmount.total_farms);
        setHectares(resHectares.total_hectares);
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <h2 className="fw-bold text-dark mb-4">Painel Analítico de Monitoramento</h2>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6">
          <WidgetCard title="Total de Fazendas Cadastradas" value={`${amount} propriedades`} icon="bi-tree-fill text-success" />
        </div>
        <div className="col-12 col-md-6">
          <WidgetCard title="Total de Hectares Registrados" value={`${Number(hectares).toFixed(2)} ha`} icon="bi-globe-americas text-primary" />
        </div>
      </div>
      <hr></hr>
      <div className="row g-4">
        <div className="col-6 col-md-6">
          <StateChart />
        </div>
        <div className="col-6 col-md-6">
          <LandUseChart />
        </div>        
      </div>
      <hr></hr>
      <div className="row g-4">
         <div className="col-12 col-md-12">
          <CropChart />
        </div>
      </div>
    </div>
  );
}
