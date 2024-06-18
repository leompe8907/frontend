import React from 'react'

function ListaDVB({responseData}) {
  const DVB = responseData.ListaDVB

  if (!DVB || DVB === 0 || DVB === "" || DVB === null || DVB === undefined) {
    return null
  }

  return (
    <>
      <div className="containerGeneralList">
        <div className="containerList">
          <table>
            <thead>
              <tr>
                <th>Eventos</th>
                <th>Duracion</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(DVB).map(([key,value]) =>(
                <tr key={key}> 
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ListaDVB