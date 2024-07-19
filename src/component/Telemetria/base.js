import { useState, useEffect, useRef } from 'react';
import { CV } from "../../cv/cv";
import pako from 'pako';

const Telemetria = () => {
  const [telemetriaData, setTelemetriaData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [latestRecordId, setLatestRecordId] = useState(null);

  const limit = 1000;

  const stopFetchingRef = useRef(true);
  const handleStopFetching = (status) => {
    stopFetchingRef.current = status;
    setIsFetching(false);
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/telemetria/dataTelemetria/');
      
      if (response.status === 204) {
        await handle204Response();
      } else if (response.status === 200) {
        const result = await response.json();
        setLatestRecordId(result.recordId_max);
        await handle200Response(result.recordId_max);
      } else {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error al obtener datos de telemetría: ${error.message}`);
    }
  };

  const handle204Response = async () => {
    console.log("Response status 204: Obteniendo todos los datos...");
    try {
      let currentPage = 0;
      let allTelemetryData = {};

      while (stopFetchingRef.current) {
        const data = await fetchDataFromPage(currentPage);
        if (data.length === 0) break;
  
        data.forEach(record => {
          const modifiedRecord = {
            ...record,
            dataDate: getDataDate(record.timestamp),
            timeDate: getTimeDate(record.timestamp)
          };
          allTelemetryData[record.recordId] = modifiedRecord;
        });
  
        currentPage += limit;
      }
  
      setTelemetriaData(allTelemetryData);
      handleStopFetching(true);
      
      await sendDataToDjango(Object.values(allTelemetryData));
    } catch (error) {
      console.error('Error fetching telemetry data:', error);
      handleStopFetching(null);
    }
  };

  const fetchDataFromPage = async (pageNumber) => {
    const result = await new Promise((resolve) => {
      CV.call(
        "getListOfTelemetryRecords",
        {
          sessionId: localStorage.getItem("sessionID"),
          offset: pageNumber,
          limit: limit,
          orderBy: "recordId",
          orderDir: "DESC"
        },
        (result) => resolve(result)
      );
    });

    if (!result.success) {
      throw new Error(`Error al obtener datos: ${result.errorMessage}`);
    }

    return result.answer.telemetryRecordEntries;
  };

  const handle200Response = async (highestRecordId) => {
    console.log("Response status 200: Obteniendo datos hasta el recordId almacenado...", highestRecordId);
    try {
      let currentPage = 0;
      let allTelemetryData = {};
      let foundRecord = false;
  
      while (stopFetchingRef.current) {
        const data = await fetchDataFromPage(currentPage);
        if (data.length === 0) break;
  
        for (let record of data) {
          if (record.recordId === highestRecordId) {
            foundRecord = true;
            handleStopFetching(false);
            break;
          }
  
          const modifiedRecord = {
            ...record,
            dataDate: getDataDate(record.timestamp),
            timeDate: getTimeDate(record.timestamp)
          };
          allTelemetryData[record.recordId] = modifiedRecord;
        }
  
        if (foundRecord) {
          break;
        }
  
        currentPage += limit;
      }
  
      if (Object.keys(allTelemetryData).length > 0) {
        setTelemetriaData(allTelemetryData);
        await sendDataToDjango(Object.values(allTelemetryData));
      }
  
    } catch (error) {
      console.error('Error fetching telemetry data:', error);
      handleStopFetching(null);
    }
  };
  

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };
  

  const sendDataToDjango = async (telemetryData) => {
    const chunkedData = chunkArray(telemetryData, 1000); // Por ejemplo, dividir en lotes de 50 objetos

    for (const chunk of chunkedData) {
      try {
        const compressedData = compressData(chunk);
  
        const response = await fetch('http://127.0.0.1:8000/telemetria/dataTelemetria/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip'
          },
          body: compressedData,
        });
  
        if (!response.ok) {
          throw new Error(`Error al enviar datos a Django: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error al enviar datos a Django:', error);
        // Manejar el error según sea necesario
      }
    }
  };

  const compressData = (data) => {
    const jsonData = JSON.stringify(data);
    const compressedData = pako.gzip(jsonData, { level: 9 });
    return compressedData;
  };

  const getTimeDate = (timestamp) => {
    const data = new Date(timestamp);
    const hora = data.getHours();
    return hora;
  };

  const getDataDate = (timestamp) => {
    const fecha = new Date(timestamp);
    return fecha.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchData();
  }, []);

  return null; // Opcional: reemplazar con el contenido JSX necesario
};

export default Telemetria;
