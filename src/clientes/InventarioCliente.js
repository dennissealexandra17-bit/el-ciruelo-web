import axios from "axios";


const API_URL = "https://web-production-5a574.up.railway.app/facturacion/v1.1/inventario";


export const getStockReducido = () => axios.get(`${API_URL}/bajo-stock`);

