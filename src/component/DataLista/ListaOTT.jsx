import React from 'react'

function ListaOTT({responseData}) {

  const OTT = responseData.listOTT

  if (!OTT || Object.keys(OTT).length === 0 || typeof OTT !== "object") {
    return null
  }

  return (
    <>
      <div className="containerGeneralList">
        <div className="containerListOTT">
          <table>
            <thead>
              <tr>
                <th>Eventos</th>
                <th>Duracion</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(OTT).map(([key,value]) =>(
                <tr key={key}> 
                  <td>{key}</td>
                  <td>{value} Hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ListaOTT