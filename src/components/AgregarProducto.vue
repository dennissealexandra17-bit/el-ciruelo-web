<template>
  <div class="container">
    <button class="cerrar" @click="$emit('close')">×</button>
    <h3>Agregar Producto</h3>
    <div class="datos">
      <div class="dato-row">
        <p>Nombre:</p>
        <input
          type="text"
          placeholder="Ingrese el nombre del producto"
          v-model="nombre"
        />
      </div>
      <div class="dato-row">
        <p>Precio de Compra:</p>
        <input
          type="number"
          placeholder="Ingrese el precio del producto"
          v-model="precioCompra"
        />
      </div>
      <div class="dato-row">
        <p>Stock:</p>
        <input
          type="number"
          placeholder="Ingrese la cantidad en stock"
          v-model="stock"
        />
      </div>
      <div class="dato-row">
        <p>Precio de Venta:</p>
        <input
          type="number"
          placeholder="Ingrese el precio de venta"
          v-model="precioVenta"
        />
      </div>
      <div class="dato-row">
        <p>Marca:</p>
        <input
          type="text"
          placeholder="Ingrese la marca del producto"
          v-model="marca"
        />
      </div>
      <div class="dato-row">
        <p>Categoria:</p>
        <input
          type="text"
          placeholder="Ingrese la categoria del producto"
          v-model="categoria"
        />
      </div>
      <div class="dato-row">
        <p>Cantidad Mínima:</p>
        <input
          type="number"
          placeholder="Ingrese la cantidad mínima"
          v-model="cantidadMinima"
          min="1"
        />
      </div>
    </div>
    <div class="acciones">
      <button @click="agregarProducto">Agregar</button>
    </div>
  </div>
</template>

<script>
import { postProducto } from "@/clientes/ProductoClientes";
export default {
  data() {
    return {
      nombre: "",
      precioCompra: 0,
      stock: 0,
      precioVenta: 0,
      marca: "",
      categoria: "",
      cantidadMinima: 1
    };
  },
  methods: {
    async agregarProducto() {
  const nuevoProducto = {
    nombre: this.nombre,
    precioCompra: this.precioCompra,
    stock: this.stock,
    precioVenta: this.precioVenta,
    marca: this.marca,
    categoria: this.categoria,
    cantidadMinima: this.cantidadMinima
  
  };
  if (this.cantidadMinima < 1) {
  alert("La cantidad mínima debe ser al menos 1");
  return;
}

  try {
    const respuesta = await postProducto(nuevoProducto);
    console.log("Producto agregado:", respuesta);
    this.$emit('close');
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}
,
  },
};
</script>

<style scoped>
.cerrar {
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  font-size: 28px;
  color: #888;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s;
}
.cerrar:hover {
  color: #ef4444;
}
.container {
  position: relative;
  text-align: center;
  margin: 30px auto;
  padding: 32px 24px 24px 24px;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.1);
  max-width: 480px;
  border: 1px solid #e0e7ef;
}

h3 {
  margin-bottom: 18px;
  color: #2d3748;
  font-weight: 700;
  letter-spacing: 1px;
}

.datos {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0px;
  gap: 10px;
}

.dato-row {
  display: flex;
  align-items: center;
  margin: 5px 0;
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
  padding: 8px 14px;
  transition: box-shadow 0.2s;
}
.dato-row:focus-within {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.dato-row p {
  font-size: 16px;
  margin: 0 10px 0 0;
  min-width: 130px;
  text-align: left;
  color: #0a3871;
  font-weight: 600;
}

.dato-row input {
  flex: 1;
  width: 0;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1.5px solid #38bdf8;
  background: #f8fafc;
  font-size: 15px;
  color: #0a3871;
  transition: border 0.2s, box-shadow 0.2s;
}
.dato-row input:focus {
  outline: none;
  border: 1.5px solid #ff9800;
  background: #fff;
  box-shadow: 0 0 0 2px #ffe066;
}

.acciones {
  margin-top: 28px;
}
.acciones button {
  background: linear-gradient(90deg, #38bdf8 0%, #ff9800 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 38px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(56, 189, 248, 0.1);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}
.acciones button:hover {
  background: linear-gradient(90deg, #ff9800 0%, #38bdf8 100%);
  box-shadow: 0 4px 16px 0 rgba(255, 152, 0, 0.18);
  transform: translateY(-2px) scale(1.03);
}
</style>
