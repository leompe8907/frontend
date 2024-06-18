import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Update() {
  const [responses, setResponses] = useState({
    dvb: null,
    ott: null,
    stopcatchup: null,
    endcatchup: null,
    stopvod: null,
    endvod: null,
  });

  //https://backend-mu-virid.vercel.app/

  const handlesubmit = async () => {
    try {
      const dvbResponse = await axios.post('https://backend-mu-virid.vercel.app/telemetria/dvb/');
      setResponses(prevState => ({ ...prevState, dvb: dvbResponse.data }));
    } catch (error) {
      console.error('Error:', error);
    }

    try {
      const ottResponse = await axios.post('https://backend-mu-virid.vercel.app/telemetria/ott/');
      setResponses(prevState => ({ ...prevState, ott: ottResponse.data }));
    } catch (error) {
      console.error('Error:', error);
    }

    try {
      const stopcatchupResponse = await axios.post('https://backend-mu-virid.vercel.app/telemetria/stopcatchup/');
      setResponses(prevState => ({ ...prevState, stopcatchup: stopcatchupResponse.data }));
    } catch (error) {
      console.error('Error:', error);
    }

    try {
      const endcatchupResponse = await axios.post('https://backend-mu-virid.vercel.app/telemetria/endcatchup/');
      setResponses(prevState => ({ ...prevState, endcatchup: endcatchupResponse.data }));
    } catch (error) {
      console.error('Error:', error);
    }

    try {
      const stopvodResponse = await axios.post('https://backend-mu-virid.vercel.app/telemetria/stopvod/');
      setResponses(prevState => ({ ...prevState, stopvod: stopvodResponse.data }));
    } catch (error) {
      console.error('Error:', error);
    }

    try {
      const endvodResponse = await axios.post('https://backend-mu-virid.vercel.app/telemetria/endvod/');
      setResponses(prevState => ({ ...prevState, endvod: endvodResponse.data }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    handlesubmit();
  }, []);

  return (
    <div>
      <p>Updating data...</p>
      <div>
        {responses.dvb && <p>DVB Response: {JSON.stringify(responses.dvb.message)}</p>}
        {responses.ott && <p>OTT Response: {JSON.stringify(responses.ott.message)}</p>}
        {responses.stopcatchup && <p>Stop Catchup Response: {JSON.stringify(responses.stopcatchup.message)}</p>}
        {responses.endcatchup && <p>End Catchup Response: {JSON.stringify(responses.endcatchup.message)}</p>}
        {responses.stopvod && <p>Stop VOD Response: {JSON.stringify(responses.stopvod.message)}</p>}
        {responses.endvod && <p>End VOD Response: {JSON.stringify(responses.endvod.message)}</p>}
      </div>
    </div>
  );
}
