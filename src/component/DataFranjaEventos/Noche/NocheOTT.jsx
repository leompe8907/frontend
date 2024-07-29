import React, { useRef, useEffect } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from "chart.js/auto";

function NocheOTT({ responseData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  // Asumimos que responseData.franjahorariaeventott.Noche es el objeto proporcionado
  const Noche = responseData.franjahorariaeventott?.Noche;

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  useEffect(() => {
    if (!Noche || typeof Noche !== 'object' || Object.keys(Noche).length === 0) return;

    // Convertir el objeto Noche en un arreglo ordenado de mayor a menor
    const NocheArray = Object.entries(Noche).map(([channel, rating]) => ({ channel, rating }));
    NocheArray.sort((a, b) => b.rating - a.rating);

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: NocheArray.map(item => item.channel),
        datasets: [{
          label: 'Datos de Noche',
          data: NocheArray.map(item => item.rating),
          backgroundColor: NocheArray.map(() => getRandomColor()),
          borderColor: NocheArray.map(() => getRandomColor()),
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            rotation: -95,
            color: 'black',
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
            }
          },
          y: {
            type: 'logarithmic',
            beginAtZero: true,
          }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [Noche]);

  if (!Noche || typeof Noche !== 'object' || Object.keys(Noche).length === 0) {
    return null;
  }

  const NocheArray = Object.entries(Noche).map(([channel, rating]) => ({ channel, rating }));
  NocheArray.sort((a, b) => b.rating - a.rating);

  return (
    <div className="containerGeneralList">
      <div className="container-titulo">
        <h2>Franja Horaria Noche</h2>
      </div>
      <div className="GeneralList">
        <div className="containerList">
          <ul>
            {NocheArray.map((item, index) => (
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

export default NocheOTT;