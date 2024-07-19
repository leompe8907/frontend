import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

function Llamada() {
  const [data, setData] = useState();
  const [ottHours, setOttHours] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [franjaOTT, setFranjaOtt] = useState();
  const [listOttEvents, setListOttEvents] = useState();
  const [frajaOttEventsMadrugada, setFrajaOttEventsMadrugada] = useState();
  const chartRef = useRef(); // Referencia al objeto de gráfico

  useEffect(() => {
    console.log("Estado actualizado:", data);
    console.log("Estado actualizado:", ottHours);

    // Renderiza el gráfico cuando se actualiza la lista de eventos OTT
    if (listOttEvents) {
      Madrugada();
      EventosOtt()
    }
  }, [data, ottHours, listOttEvents]);

  const handlesubmit = (e) => {
    axios.get(`http://localhost:8000/telemetria/home/${e}/`)
      .then(response => {
        const responseData = response.data;
        setData(responseData);
        dataHours(responseData);
        setFranjaOtt(responseData.franjahorariaott);
        setListOttEvents(responseData.listOTT);
        setFrajaOttEventsMadrugada(responseData.franjahorariaeventott.Madrugada);
      })
      .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
  }

  const dataHours = (data) => {
    setOttHours(data.totaldurationott.duration);
    setStart(data.totaldurationott.start_date);
    setEnd(data.totaldurationott.end_date);
  }

  // Función para generar un color aleatorio
  const randomColor = () => {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
  }

  // Función para renderizar el gráfico
  const EventosOtt = () => {
    const ctx = document.getElementById('EventosOtt');

    // Destruye el gráfico anterior si existe
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Crea un nuevo gráfico
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(listOttEvents),
        datasets: [{
          label: 'Horas por canal OTT',
          data: Object.values(listOttEvents),
          backgroundColor: Object.keys(listOttEvents).map(() => randomColor()), // Genera colores aleatorios para las barras
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        spacing: 40, // Espacio entre cada uno de los elementos del gráfico
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'right', // Puedes ajustar la posición según tus preferencias
            labels: {
              padding: 25, // Espacio entre cada uno de los elementos de las etiquetas
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${value} horas`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: isNaN(data.datasets[0].data[i]), // Oculta elementos con valores no numéricos
                      index: i
                    };
                  });
                }
                return [];
              }
            },
            itemStyle: {
              borderWidth: 20, // Ancho del borde
              borderColor: 'rgb(0, 0, 0)', // Color del borde
              padding: 30, // Espaciado interno
              borderRadius: 4 // Radio de borde
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + ' horas';
              }
            },
            displayColors: true,
            backgroundColor: 'rgb(0, 0, 0)',
            bodyFont: {
              size: 16
            },
            bodySpacing: 8,
            bodyAlign: 'center',
            padding: 16,
            cornerRadius: 8,
            position: 'nearest'
          }
        }
      }
    });

    // Almacena la referencia al objeto de gráfico para destruirlo más tarde
    chartRef.current = myChart;
  }

  const Madrugada = () => {
    const ctx = document.getElementById('EventosOtt');

    // Destruye el gráfico anterior si existe
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Crea un nuevo gráfico
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(listOttEvents),
        datasets: [{
          label: 'Horas por canal OTT',
          data: Object.values(listOttEvents),
          backgroundColor: Object.keys(listOttEvents).map(() => randomColor()), // Genera colores aleatorios para las barras
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        spacing: 40, // Espacio entre cada uno de los elementos del gráfico
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'right', // Puedes ajustar la posición según tus preferencias
            labels: {
              padding: 25, // Espacio entre cada uno de los elementos de las etiquetas
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${value} horas`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: isNaN(data.datasets[0].data[i]), // Oculta elementos con valores no numéricos
                      index: i
                    };
                  });
                }
                return [];
              }
            },
            itemStyle: {
              borderWidth: 20, // Ancho del borde
              borderColor: 'rgb(0, 0, 0)', // Color del borde
              padding: 30, // Espaciado interno
              borderRadius: 4 // Radio de borde
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + ' horas';
              }
            },
            displayColors: true,
            backgroundColor: 'rgb(0, 0, 0)',
            bodyFont: {
              size: 16
            },
            bodySpacing: 8,
            bodyAlign: 'center',
            padding: 16,
            cornerRadius: 8,
            position: 'nearest'
          }
        }
      }
    });

    // Almacena la referencia al objeto de gráfico para destruirlo más tarde
    chartRef.current = myChart;
  }

  return (
    <div className='containerGeneralBackground'>
      <div className='containerGeneralIzquierda'>
        <div className="tituloIzquierdo">
          <h1>Bienvenido a Telemetria</h1>
        </div>
        <div className='containerGeneral'>
          <div className='containerOption'>
            <p>Seleccione un numero</p>
          </div>
          <div className='containerOptionDays'>
            <button onClick={() => handlesubmit(7)}> 7 Dias </button>
            <button onClick={() => handlesubmit(15)}> 15 Dias</button>
            <button onClick={() => handlesubmit(30)}> 30 Dias</button>
            <button onClick={() => handlesubmit(180)}> 180 Dias</button>
            <button onClick={() => handlesubmit(360)}> 360 Dias</button>
          </div>
          {ottHours && <p>Total horas OTT: {ottHours}</p>}
          {start && <p>Periodo de inicio: {start}</p>}
          {end && <p>Periodo de fin: {end}</p>}
          <div>
            {listOttEvents && (
              <div>
                <h2>Tabla de Eventos</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Franja horaria</th>
                      <th>Horas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(listOttEvents).map((franja, index) => (
                      <tr key={index}>
                        <td>{franja}</td>
                        <td>{listOttEvents[franja]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <canvas id="EventosOtt" width="400" height="400"></canvas>
          </div>
          <div>
            {franjaOTT && (
              <div>
                <h2>Tabla de franjas horarias OTT</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Franja horaria</th>
                      <th>Horas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(franjaOTT).map((franja, index) => (
                      <tr key={index}>
                        <td>{franja}</td>
                        <td>{franjaOTT[franja]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div>
            {frajaOttEventsMadrugada && (
              <div>
                <h2>Madrugada</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Franja horaria</th>
                      <th>Horas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(frajaOttEventsMadrugada).map((franja, index) => (
                      <tr key={index}>
                        <td>{franja}</td>
                        <td>{frajaOttEventsMadrugada[franja]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Llamada;
