import React, { useState } from 'react';
import { fetchData } from '../../component/FetchData/FetchData';
import "./options.scss";

import Hours from '../../component/DataHours/Hours'

import FranjaOTT from '../../component/DataFranja/FranjaOTT'

import MadrugadaOTT from '../../component/DataFranjaEventos/Madrugada/MadrugadaOTT'
import MañanaOTT from '../../component/DataFranjaEventos/Mañana/MañanaOTT'
import TardeOTT from '../../component/DataFranjaEventos/Tarde/TardeOTT'
import NocheOTT from '../../component/DataFranjaEventos/Noche/NocheOTT'
import CountOTT from '../../component/DataCount/CountOTT'

import FranjaDVB from '../../component/DataFranja/FranjaDVB'

import MadrugadaDVB from '../../component/DataFranjaEventos/Madrugada/MadrugadaDVB'
import MañanaDVB from '../../component/DataFranjaEventos/Mañana/MañanaDVB'
import TardeDVB from '../../component/DataFranjaEventos/Tarde/TardeDVB'
import NocheDVB from '../../component/DataFranjaEventos/Noche/NocheDVB'

import VodCont from '../../component/DataVod/VodCont'
import VodList from '../../component/DataVod/VodList'

import CountCatchup from '../../component/DataCatchup/CountCatchup'
import CatchupList from '../../component/DataCatchup/CatchupList'




function OptionsDays() {
    const [responseData, setResponseData] = useState(null)

    const handleSubmit = async (e) => {
      try {
        const data = await fetchData(e);
        setResponseData(data)
      } catch(error){
        console.error('Error al realizar la solicitud:', error);
      }
    }

  return (
    <>
      <div className='containerGeneralOption'>
        <div className="containerOption">
          <div className="optionText">
            <h1>Seleccione un numero de dias</h1>
          </div>
          <div className="optionDays">
            <button onClick={() => handleSubmit(7)}> 7 Dias </button>
            <button onClick={() => handleSubmit(15)}> 15 Dias</button>
            <button onClick={() => handleSubmit(30)}> 30 Dias</button>
            <button onClick={() => handleSubmit(180)}> 180 Dias</button>
            <button onClick={() => handleSubmit(360)}> 360 Dias</button>
            <button> Generar PDF</button>
          </div>
        </div>
        <div className="DataTop">
          <div className="events">
            {responseData && <Hours responseData={responseData}/>}
          </div>
          <div className="events">
            {responseData && <VodCont responseData={responseData}/>}
          </div>
          <div className="events">
            {responseData && <CountCatchup responseData={responseData}/>}
          </div>
        </div>
        <div className="DataFranja">
          <div className="franjaOTT">
            {responseData && <FranjaOTT responseData={responseData}/>}
            {responseData && <CountOTT responseData={responseData}/>}
            <div className="franjaEventos">
                {responseData && <MadrugadaOTT responseData={responseData}/>}
                {responseData && <MañanaOTT responseData={responseData}/>}
                {responseData && <TardeOTT responseData={responseData}/>}
                {responseData && <NocheOTT responseData={responseData}/>}
            </div>
          </div>
          <div className="franjaDVB">
            {responseData && <FranjaDVB responseData={responseData}/>}
            <div className="franjaEventos">
                {responseData && <MadrugadaDVB responseData={responseData}/>}
                {responseData && <MañanaDVB responseData={responseData}/>}
                {responseData && <TardeDVB responseData={responseData}/>}
                {responseData && <NocheDVB responseData={responseData}/>}
            </div>
          </div>
        </div>
        <div className="DataVod">
          <div className="VOD">
              {responseData && <VodList responseData={responseData}/>}
          </div>
          <div className="Catchup">
              {responseData && <CatchupList responseData={responseData}/>}
          </div>
        </div>
      </div>
    </>
  )
}

export default OptionsDays
