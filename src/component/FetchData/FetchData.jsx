import axios from 'axios';

export async function fetchData(e) {
  try {
    const response = await axios.get(`https://yabnet-telemetria-8d3a887e896e.herokuapp.com/telemetria/home/${e}/`);
    return response.data;
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}