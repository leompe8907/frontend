import axios from 'axios';

export async function fetchData(e) {
  try {
    const response = await axios.get(`https://backend-mu-virid.vercel.app/telemetria/home/${e}/`);
    return response.data;
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}