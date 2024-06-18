import React, { useRef, useEffect } from 'react';
import Chart from "chart.js/auto";

function MañanaOTT({ responseData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  // Asumimos que responseData.franjahorariaeventott.Mañana es el objeto proporcionado
  const Mañana = responseData.franjahorariaeventott?.Mañana;

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  useEffect(() => {
    if (!Mañana || typeof Mañana !== 'object' || Object.keys(Mañana).length === 0) return;

    // Convertir el objeto Mañana en un arreglo ordenado de mayor a menor
    const MañanaArray = Object.entries(Mañana).map(([channel, rating]) => ({ channel, rating }));
    MañanaArray.sort((a, b) => b.rating - a.rating);

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MañanaArray.map(item => item.channel),
        datasets: [{
          label: 'Datos de Mañana',
          data: MañanaArray.map(item => item.rating),
          backgroundColor: MañanaArray.map(() => getRandomColor()),
          borderColor: MañanaArray.map(() => getRandomColor()),
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
  }, [Mañana]);

  if (!Mañana || typeof Mañana !== 'object' || Object.keys(Mañana).length === 0) {
    return null;
  }

  const MañanaArray = Object.entries(Mañana).map(([channel, rating]) => ({ channel, rating }));
  MañanaArray.sort((a, b) => b.rating - a.rating);

  return (
    <div className="containerGeneralList">
      <div className="container-titulo">
        <h2>Franja Horaria Mañana</h2>
      </div>
      <div className="GeneralList">
        <div className="containerList">
          <ul>
            {MañanaArray.map((item, index) => (
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

export default MañanaOTT;