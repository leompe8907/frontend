import React from 'react'

function CountCatchup({responseData}) {
  // Supongo que aquí obtendrás el valor real de vodCount desde responseData
  const catchup = responseData.catchupCount; // Asigna el valor real

  // Verifica si catchup es null, undefined, vacío o cero
  if (catchup === null || catchup === undefined || catchup === '' || catchup === 0) {
    return null; // No renderiza nada si catchup es null, undefined, vacío o cero
  }

  return (
    <div className='containerGeneralHours'>
      <div className="date">
        <table>
          <thead>
            <tr>
              <th className='titulo'>Catchups</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className='datos'>{catchup} Vistos</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CountCatchup