<template>
  <div class="container">
    <button class="cerrar" @click="$emit('close')">×</button>
    <h3>Editar Producto</h3>
    <div class="datos">
      <div class="dato-row">
        <p>Nombre: </p>
        <input type="text" v-model="nombre" />
      </div>
      <div class="dato-row">
        <p>Precio de Compra: </p>
        <input type="number" v-model="precioCompra" />
      </div>
      <div class="dato-row">
        <p>Stock: </p>
        <input type="number" v-model="stock" />
      </div>
      <div class="dato-row">
        <p>Nuevo Stock: </p>
        <input type="number" v-model="nuevoStock" />
      </div>
      <div class="dato-row">
        <p>Precio de Venta: </p>
        <input type="number" v-model="precioVenta" />
      </div>
      <div class="dato-row">
        <p>Marca: </p>
        <input type="text" v-model="marca" />
      </div>
      <div class="dato-row">
        <p>Categoría: </p>
        <input type="text" v-model="categoria" />
      </div>
      <div class="dato-row">
        <p>Cantidad Mínima: </p>
        <input type="number"
          placeholder="Ingrese la cantidad mínima"
          v-model="cantidadMinima"
          min="1"/>
      </div>
    </div>
    <div class="acciones">
      <button @click="editarProducto">Guardar Cambios</button>
    </div>
  </div>
</template>

<script>
import { putProducto } from '@/clientes/ProductoClientes';

export default {
  props: {
    productoEditar: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      nombre: '',
      precioCompra: 0,
      stock: 0,
      nuevoStock: 0,
      precioVenta: 0,
      marca: '',
      categoria: '',
      cantidadMinima: 1
    };
  },
  mounted() {
    const p = this.productoEditar;
    this.nombre = p.nombre;
    this.precioCompra = p.precioCompra;
    this.stock = p.stock;
    this.precioVenta = p.precioVenta;
    this.marca = p.marca;
    this.categoria = p.categoria;
    this.cantidadMinima = p.cantidadMinima || 1;
  },
  methods: {
    async editarProducto() {
      const producto = {
        nombre: this.nombre,
        precioCompra: this.precioCompra,
        stock: (this.stock + this.nuevoStock),
        precioVenta: this.precioVenta,
        marca: this.marca,
        categoria: this.categoria,
    cantidadMinima: this.cantidadMinima
      };
      try {
        await putProducto(producto, this.productoEditar.id);
        this.$emit('editar', producto); // Emite al padre
        this.$emit('close');
      } catch (error) {
        console.error("Error al editar producto:", error);
      }
    }
  }
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
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
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
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  padding: 8px 14px;
  transition: box-shadow 0.2s;
}
.dato-row:focus-within {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
}


.dato-row p {
  font-size: 16px;
  margin: 0 10px 0 0;
  min-width: 130px;
  text-align: left;
  color: #374151;
  font-weight: 500;
}


.dato-row input {
  flex: 1;
  width: 0;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1.5px solid #cbd5e1;
  background: #f1f5f9;
  font-size: 15px;
  transition: border 0.2s, box-shadow 0.2s;
}
.dato-row input:focus {
  outline: none;
  border: 1.5px solid #38bdf8;
  background: #fff;
  box-shadow: 0 0 0 2px #bae6fd;
}


.acciones {
  margin-top: 28px;
}
.acciones button {
  background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 38px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(56,189,248,0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}
.acciones button:hover {
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
  box-shadow: 0 4px 16px 0 rgba(56,189,248,0.18);
  transform: translateY(-2px) scale(1.03);
}

</style>