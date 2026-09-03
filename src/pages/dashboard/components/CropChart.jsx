import React, { useState, useEffect } from 'react';
import { farmService } from '../../../services/farmService';
import { Pie } from 'react-chartjs-2';

export default function CropChart() {
  const [chartData, setChartData] = useState(null);

  const generateDynamicColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * (360 / count)) % 360;
      colors.push(`hsl(${hue}, 70%, 55%)`);
    }
    return colors;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await farmService.getChartByCrop();
        
        const itemsCount = data.length;

        setChartData({
          labels: data.map(item => item.crop_name),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: generateDynamicColors(itemsCount),
            borderWidth: 1,
          }]
        });
      } catch (error) {
        console.error('Erro no gráfico por cultura:', error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="card shadow-sm border-0 p-4 bg-white h-100">
      <h5 className="card-title text-muted mb-4 text-center fw-bold">Por Cultura Plantada</h5>
      <div style={{ maxHeight: '350px', minHeight: '350px' }} className="d-flex justify-content-center">
        {chartData ? <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /> : <div className="spinner-border text-success" />}
      </div>
    </div>
  );
}
