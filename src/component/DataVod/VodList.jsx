import React from 'react'

function VodList({responseData}) {

  const vods = responseData.vodeventos

  if (!vods || typeof vods !== "object" || Object.keys(vods).length === 0) {
    return null; // No renderiza nada si vod es null, undefined, vacío o cero
  }

  return (
    <div className='containerGeneralVODs'>
      <div className="containerDateVODs">
        <table>
          <thead>
            <tr><th>VODs</th></tr>
          </thead>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Repeticiones</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(vods).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VodList
