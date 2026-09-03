import React, { useState, useEffect } from 'react';
import { farmService } from '../../../services/farmService';
import { Pie } from 'react-chartjs-2';

export default function StateChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await farmService.getChartByState();
        setChartData({
          labels: data.map(item => item.state),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: ['#007bff', '#f08409', '#ffc107', '#dc3545', '#6c757d', '#17a2b8', '#00FF00', '#0000FF', '#FF00FF', '#FF00', '#FF0000'],
            borderWidth: 1,
          }]
        });
      } catch (error) {
        console.error('Erro no gráfico por estado:', error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="card shadow-sm border-0 p-4 bg-white h-100">
      <h5 className="card-title text-muted mb-4 text-center fw-bold">Fazendas por Estado (UF)</h5>
      <div style={{ maxHeight: '350px' }} className="d-flex justify-content-center">
        {chartData ? <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /> : <div className="spinner-border text-success" />}
      </div>
    </div>
  );
}
