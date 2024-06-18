import React from 'react'

function VodCont({responseData}) {

  // Supongo que aquí obtendrás el valor real de vodCount desde responseData
  const vod = responseData.vodCount; // Asigna el valor real

  // Verifica si vod es null, undefined, vacío o cero
  if (vod === null || vod === undefined || vod === '' || vod === 0) {
    return null; // No renderiza nada si vod es null, undefined, vacío o cero
  }

  return (
    <div className='containerGeneralHours'>
      <div className="date">
        <table>
          <thead>
            <tr>
              <th className='titulo'>VODs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className='datos'>{vod} Vistos</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VodCont