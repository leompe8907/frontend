import React from 'react'

function CatchupList({responseData}) {
    
  const catchup = responseData.catchupeventos

  if (!catchup || typeof catchup !== "object" || Object.keys(catchup).length === 0) {
    return null; // No renderiza nada si catchup es null, undefined, vacío o cero
  }

  return (
    <div className='containerGeneralHours'>
      <div className="containerDate">
        <div className="duration">
          <table>
            <thead>
              <tr><th>Catchup</th></tr>
              <tr>
                <th>Evento</th>
                <th>Repeticiones</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(catchup).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CatchupList