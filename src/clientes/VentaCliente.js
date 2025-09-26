import axios from "axios";

const API_URL = "http://localhost:8081/facturacion/v1.1/ventas";


export default {
  crearVenta(venta) {
    return axios.post(API_URL, venta);
  },

  obtenerVentaPorId(id) {
    return axios.get(`${API_URL}/${id}`);
  },

  obtenerTodasLasVentas() {
    return axios.get(API_URL);
  }
};

export const buscarFecha =async (fecha) =>{
    try {
        const response = await axios.get(`${API_URL}/fecha/${fecha}`);
        return response.data;
    } catch (error) {
        console.error("Error al buscar ventas por fecha:", error);
        throw error;
    }
};

export const buscarFechaRango = async (fechaInicio, fechaFin) => {
    try {
        const response = await axios.get(`${API_URL}/rango`, {
            params: {
                fechaInicio,
                fechaFin
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar ventas por rango de fechas:", error);
        throw error;
    }
}