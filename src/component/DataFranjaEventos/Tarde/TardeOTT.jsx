import React, { useRef, useEffect } from 'react';
import Chart from "chart.js/auto";

function TardeOTT({ responseData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  // Asumimos que responseData.franjahorariaeventott.Tarde es el objeto proporcionado
  const Tarde = responseData.franjahorariaeventott?.Tarde;

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  useEffect(() => {
    if (!Tarde || typeof Tarde !== 'object' || Object.keys(Tarde).length === 0) return;

    // Convertir el objeto Tarde en un arreglo ordenado de mayor a menor
    const TardeArray = Object.entries(Tarde).map(([channel, rating]) => ({ channel, rating }));
    TardeArray.sort((a, b) => b.rating - a.rating);

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: TardeArray.map(item => item.channel),
        datasets: [{
          label: 'Datos de Tarde',
          data: TardeArray.map(item => item.rating),
          backgroundColor: TardeArray.map(() => getRandomColor()),
          borderColor: TardeArray.map(() => getRandomColor()),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [Tarde]);

  if (!Tarde || typeof Tarde !== 'object' || Object.keys(Tarde).length === 0) {
    return null;
  }

  const TardeArray = Object.entries(Tarde).map(([channel, rating]) => ({ channel, rating }));
  TardeArray.sort((a, b) => b.rating - a.rating);

  return (
    <div className="containerGeneralList">
      <div className="container-titulo">
        <h2>Franja Horaria Tarde</h2>
      </div>
      <div className="GeneralList">
        <div className="containerList">
          <ul>
            {TardeArray.map((item, index) => (
              <li key={index}>{`${item.channel}: ${item.rating}`}</li>
            ))}
          </ul>
        </div>
        <div className="chart-franja">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default TardeOTT;