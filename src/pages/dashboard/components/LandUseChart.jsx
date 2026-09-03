import React, { useState, useEffect } from 'react';
import { farmService } from '../../../services/farmService';
import { Pie } from 'react-chartjs-2';

export default function LandUseChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await farmService.getChartByLandUse();
        setChartData({
          labels: ['Área Agricultável (ha)', 'Vegetação Nativa (ha)'],
          datasets: [{
            data: [data.arable_area_total, data.vegetation_area_total],
            backgroundColor: ['#28a745', '#20c997'],
            borderWidth: 1,
          }]
        });
      } catch (error) {
        console.error('Erro no gráfico de uso de solo:', error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="card shadow-sm border-0 p-4 bg-white h-100">
      <h5 className="card-title text-muted mb-4 text-center fw-bold">Uso do Solo (ha)</h5>
      <div style={{ maxHeight: '550px' }} className="d-flex justify-content-center">
        {chartData ? <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /> : <div className="spinner-border text-success" />}
      </div>
    </div>
  );
}
