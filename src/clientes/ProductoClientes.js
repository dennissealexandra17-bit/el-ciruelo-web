import axios from "axios";

const API_URL = "http://localhost:8081/facturacion/v1.1/productos";

export const postProducto = async (producto) => {
    try {
        const response = await axios.post(API_URL, producto);
        return response.data;
    } catch (error) {
        console.error("Error guardando producto:", error);
        throw error;
    }
}

export const putProducto = async (producto,id) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, producto);
        return response.data;
    } catch (error) {
        console.error("Error actualizando producto:", error);
        throw error;
    }
}

export const deleteProducto = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error eliminando producto:", error);
        throw error;
    }
}

export const getProductoByNombre = async (nombre) => {
    try {
        const response = await axios.get(`${API_URL}/nombre/${nombre}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener producto by nombre:", error);
        throw error;
    }
}

export const getProductoByCategoria = async (categoria) => {
    try {
        const response = await axios.get(`${API_URL}/categoria/${categoria}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener producto by categoria:", error);
        throw error;
    }
}

export const getProductosByMarca = async (marca) => {
  try {
    const response = await axios.get(`${API_URL}/marca/${marca}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos by marca ${marca}:`, error);
    throw error;
  }
}

export const getProductos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

export const getProductoByMarcaAndCategoria = async (marca, categoria) => {
    try {
        const response = await axios.get(`${API_URL}/marca_categoria/${categoria}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener producto by marca ${marca} and categoria ${categoria}:`, error);
        throw error;
    }
}

export const getProductosByMarcaAndCategoria = async (marca, categoria) => {
  try {
    const response = await axios.get(`${API_URL}/marca_categoria`, {
      params: { marca, categoria }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos by marca ${marca} and categoria ${categoria}:`, error);
    throw error;
  }
}

export const getProductosByNombreLike = async (nombre) => {
    try {
        const response = await axios.get(`${API_URL}/buscar`, {
            params: { nombre }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener productos by nombre like ${nombre}:`, error);
        throw error;
    }
}

