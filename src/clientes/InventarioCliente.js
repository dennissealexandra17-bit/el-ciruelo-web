import axios from "axios";

const API_URL = "http://localhost:8081/facturacion/v1.1/inventario";

export const getStockReducido = () => axios.get(`${API_URL}/bajo-stock`);

