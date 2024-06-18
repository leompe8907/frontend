import React, { useRef, useEffect } from 'react';
import Chart from "chart.js/auto";

function FranjaDVB({ responseData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!responseData.franjahorariadvb || !chartRef.current) return;

    const { Mañana, Tarde, Noche, Madrugada } = responseData.franjahorariadvb;
    const ctx = chartRef.current.getContext('2d');

    // Destruir el gráfico existente si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Mañana', 'Tarde', 'Noche', 'Madrugada'],
        datasets: [
          {
            label: 'Horas',
            data: [Mañana, Tarde, Noche, Madrugada],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Retorna una función para limpiar el gráfico al desmontar el componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [responseData.franjahorariadvb]);

  if (
    !responseData.franjahorariadvb ||
    typeof responseData.franjahorariadvb !== 'object' ||
    Object.keys(responseData.franjahorariadvb).length === 0
  ) {
    return null;
  }

  const { Mañana, Tarde, Noche, Madrugada } = responseData.franjahorariadvb;

  return (
    <div className="container">
      <div className="container-titulo">
        <h2>Franja Horaria DVB</h2>
      </div>
      <div className="flex-container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Franja Horaria</th>
                <th>Horas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mañana</td>
                <td>{Mañana}</td>
              </tr>
              <tr>
                <td>Tarde</td>
                <td>{Tarde}</td>
              </tr>
              <tr>
                <td>Noche</td>
                <td>{Noche}</td>
              </tr>
              <tr>
                <td>Madrugada</td>
                <td>{Madrugada}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default FranjaDVB;
