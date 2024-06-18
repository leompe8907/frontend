import React, { useRef, useEffect } from 'react';
import Chart from "chart.js/auto";

function MadrugadaDVB({ responseData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  // Asumimos que responseData.franjahorariaeventdvb.Madrugada es el objeto proporcionado
  const Madrugada = responseData.franjahorariaeventodvb?.Madrugada;

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  useEffect(() => {
    if (!Madrugada || typeof Madrugada !== 'object' || Object.keys(Madrugada).length === 0) return;

    // Convertir el objeto Madrugada en un arreglo ordenado de mayor a menor
    const madrugadaArray = Object.entries(Madrugada).map(([channel, rating]) => ({ channel, rating }));
    madrugadaArray.sort((a, b) => b.rating - a.rating);

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: madrugadaArray.map(item => item.channel),
        datasets: [{
          label: 'Datos de Madrugada',
          data: madrugadaArray.map(item => item.rating),
          backgroundColor: madrugadaArray.map(() => getRandomColor()),
          borderColor: madrugadaArray.map(() => getRandomColor()),
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
  }, [Madrugada]);

  if (!Madrugada || typeof Madrugada !== 'object' || Object.keys(Madrugada).length === 0) {
    return null;
  }

  const madrugadaArray = Object.entries(Madrugada).map(([channel, rating]) => ({ channel, rating }));
  madrugadaArray.sort((a, b) => b.rating - a.rating);

  return (
    <div className="containerGeneralList">
      <div className="container-titulo">
        <h2>Franja Horaria Madrugada</h2>
      </div>
      <div className="GeneralList">
        <div className="containerList">
          <ul>
            {madrugadaArray.map((item, index) => (
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

export default MadrugadaDVB;
