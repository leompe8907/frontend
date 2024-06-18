import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registro de todos los componentes y el plugin
ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Title, Tooltip, Legend, ChartDataLabels
);

function CountOTT({ responseData }) {
  const CNT = responseData?.listCountEventOTT;
  const OTT = responseData?.listOTT;

  if (!CNT || Object.keys(CNT).length === 0 || typeof CNT !== "object" ||
      !OTT || Object.keys(OTT).length === 0 || typeof OTT !== "object") {
    return null;
  }

  const uniqueKeys = [...new Set([...Object.keys(CNT), ...Object.keys(OTT)])];
  const CNTData = uniqueKeys.map(key => CNT[key] || 0);
  const OTTData = uniqueKeys.map(key => OTT[key] || 0);

  const data = {
    labels: uniqueKeys,
    datasets: [
      {
        label: 'Usuarios',
        data: CNTData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        type: 'line',  // Line chart
        fill: false,
      },
      {
        label: 'Horas',
        data: OTTData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        type: 'bar',  // Bar chart
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      datalabels: {
        color: '#000000',
        anchor: 'start',
        align: 'top',
        rotation:-90,
        offset: 10, // Esto moverá las etiquetas un poco hacia abajo
        formatter: (value, context) => {
          return value > 0 ? value : '';
        }
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90
        }
      },
      y: {
        type: 'logarithmic',
        beginAtZero: true,
      }
    }
  };
  
  

  return (
    <div>
      <Chart type='bar' data={data} options={options} />
    </div>
  );
}

export default CountOTT;
