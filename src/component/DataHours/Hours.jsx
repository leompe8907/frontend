import React from 'react';

function HoursOTT({ responseData }) {

  // Acceder directamente a las propiedades del objeto responseData.totaldurationott
  const { duration, start_date, end_date } = responseData.totaldurationott;
  
  const DVB  = responseData.totaldurationdvb.duration;

  if(
    duration === undefined ||
    duration === null ||
    duration === ""
  ){
    return null;
  }

  return (
    <div className='containerGeneralHours'>
      <div className="date">
        <table>
          <thead>
            <tr>
              <th className='titulo'>Inicio</th>
              <th className='titulo'>Fin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='datos'>{start_date}</td>
              <td className='datos'>{end_date}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="info">
        <table>
          <thead>
            <tr>
              <th className='titulo'>OTT</th>
              <th className='titulo'>DVB</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='datos'>{duration} hrs</td>
              <td className='datos'>{DVB} hrs</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HoursOTT;
