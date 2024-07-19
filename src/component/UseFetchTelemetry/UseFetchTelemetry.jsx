import { useState, useRef, useCallback } from 'react';
import { CV } from "../../cv/cv";
import pako from 'pako';

const UseFetchTelemetry = () => {
  const [telemetriaData, setTelemetriaData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [latestRecordId, setLatestRecordId] = useState(null);
  const limit = 1000;
  const stopFetchingRef = useRef(true);

  const handleStopFetching = (status) => {
    stopFetchingRef.current = status;
    setIsFetching(false);
  };

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching data from backend...');
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
  }, []);

  const handle204Response = async () => {
    console.log("Response status 204: Obteniendo todos los datos...");
    await fetchAllTelemetryData();
  };

  const handle200Response = async (highestRecordId) => {
    console.log("Response status 200: Obteniendo datos hasta el recordId almacenado...", highestRecordId);
    await fetchTelemetryDataUpTo(highestRecordId);
  };

  const fetchAllTelemetryData = async () => {
    try {
      let currentPage = 0;
      let allTelemetryData = {};

      while (stopFetchingRef.current) {
        console.log(`Fetching page ${currentPage}...`);
        const data = await fetchDataFromPage(currentPage);
        if (data.length === 0) break;

        processTelemetryData(data, allTelemetryData);

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

  const fetchTelemetryDataUpTo = async (highestRecordId) => {
    try {
      let currentPage = 0;
      let allTelemetryData = {};
      let foundRecord = false;

      while (stopFetchingRef.current) {
        console.log(`Fetching page ${currentPage}...`);
        const data = await fetchDataFromPage(currentPage);
        if (data.length === 0) break;

        for (let record of data) {
          if (record.recordId === highestRecordId) {
            foundRecord = true;
            handleStopFetching(false);
            break;
          }

          processRecord(record, allTelemetryData);
        }

        if (foundRecord) break;

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

  const fetchDataFromPage = async (pageNumber) => {
    console.log(`Calling CV API for page ${pageNumber}...`);
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

    console.log(`Received ${result.answer.telemetryRecordEntries.length} records from page ${pageNumber}`);
    return result.answer.telemetryRecordEntries;
  };

  const processTelemetryData = (data, allTelemetryData) => {
    data.forEach(record => {
      processRecord(record, allTelemetryData);
    });
  };

  const processRecord = (record, allTelemetryData) => {
    const modifiedRecord = {
      ...record,
      dataDate: getDataDate(record.timestamp),
      timeDate: getTimeDate(record.timestamp)
    };
    allTelemetryData[record.recordId] = modifiedRecord;
  };

  const sendDataToDjango = async (telemetryData) => {
    const chunkedData = chunkArray(telemetryData, 1000);

    for (const [index, chunk] of chunkedData.entries()) {
      console.log(`Sending chunk ${index + 1} of ${chunkedData.length} to backend...`);
      let attempt = 0;
      const maxRetries = 5;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          const compressedData = compressData(chunk);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // Timeout de 30 segundos

          const response = await fetch('http://127.0.0.1:8000/telemetria/dataTelemetria/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Encoding': 'gzip'
            },
            body: compressedData,
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Error al enviar datos a Django: ${response.statusText}`);
          }
          success = true; // Marca el envío como exitoso
        } catch (error) {
          console.error(`Error al enviar chunk ${index + 1}:`, error);
          attempt++;
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          } else {
            console.error('Máximo número de reintentos alcanzado');
          }
        }
      }

      if (!success) {
        // Si después de todos los reintentos no se tuvo éxito, arrojar un error.
        throw new Error('Failed to send data after multiple attempts');
      }
    }
  };

  const compressData = (data) => {
    const jsonData = JSON.stringify(data);
    return pako.gzip(jsonData, { level: 9 });
  };

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const getTimeDate = (timestamp) => {
    const data = new Date(timestamp);
    return data.getHours();
  };

  const getDataDate = (timestamp) => {
    const fecha = new Date(timestamp);
    return fecha.toISOString().split('T')[0];
  };

  return {
    telemetriaData,
    isFetching,
    latestRecordId,
    fetchData,
    handleStopFetching,
  };
};

export default UseFetchTelemetry;
