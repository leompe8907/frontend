// components/Telemetria.js
import React, { useEffect } from 'react';
import UseFetchTelemetry from '../UseFetchTelemetry/UseFetchTelemetry';

const Telemetria = () => {
  const {
    telemetriaData,
    isFetching,
    fetchData,
  } = UseFetchTelemetry();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  // Renderizar datos de telemetría si es necesario
  return (
    <div>
      {Object.values(telemetriaData).map(record => (
        <div key={record.recordId}>
          {/* Mostrar información del registro */}
          <p>Fecha: {record.dataDate}</p>
          <p>Hora: {record.timeDate}</p>
          <p>Hora: {record.recorId}</p>
        </div>
      ))}
    </div>
  );
};

export default Telemetria;
