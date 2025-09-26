<template>
  <div class="container">
    <h2>Ventas</h2>

    <form class="form-venta" @submit.prevent="agregarVenta">
      <!-- Autocomplete producto -->
      <div class="form-group">
        <label for="productoNombre">Producto</label>
        <q-select
  v-model="productoSeleccionado"
  use-input
  input-debounce="300"
  @filter="filtrarProductos"
  option-label="label" 
  option-value="id"
  map-options
  :placeholder="productoSeleccionado ? '' : qSelectPlaceholder"
  :loading="cargandoProductos"
  @update:model-value="onProductoSeleccionado"
  clearable
  :options="productosFiltrados.map((p) => ({
    ...p,
    label: `${p.nombre} (${p.marca})`,
  }))"
/>
      </div>

      <div class="form-group">
        <label for="cantidad">Cantidad</label>
        <input
          id="cantidad"
          v-model.number="nuevaVenta.cantidad"
          type="number"
          min="1"
          placeholder="Cantidad"
          required
        />
      </div>

      <div class="form-group">
        <label for="precio">Precio unitario</label>
        <input
          id="precio"
          v-model.number="nuevaVenta.precio"
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio unitario"
          readonly
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="!nuevaVenta.productoId">
          Agregar Venta
        </button>
      </div>
    </form>

    <div v-if="ventas.length === 0" class="sin-productos">
      No hay ventas registradas.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, idx) in ventasPaginadas" :key="idx">
          <td>{{ idx + 1 + inicio }}</td>
          <td>{{ venta.productoNombre || (venta.detalles && venta.detalles[0]?.productoNombre) }}</td>
          <td>{{ venta.cantidad || (venta.detalles && venta.detalles[0]?.cantidad) }}</td>
          <td>${{ (venta.precio || venta.detalles?.[0]?.precioUnitario || 0).toFixed(2) }}</td>
          <td>${{ ((venta.cantidad || venta.detalles?.[0]?.cantidad || 0) * (venta.precio || venta.detalles?.[0]?.precioUnitario || 0)).toFixed(2) }}</td>
          <td>
            <button @click="eliminarVenta(idx + inicio)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="totalPages > 1" class="paginacion">
      <button :disabled="currentPage === 1" @click="cambiarPagina(currentPage - 1)">Anterior</button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ activo: page === currentPage }"
        @click="cambiarPagina(page)"
      >
        {{ page }}
      </button>
      <button :disabled="currentPage === totalPages" @click="cambiarPagina(currentPage + 1)">Siguiente</button>
    </div>

    <div class="info-paginacion" v-if="ventas.length">
      Mostrando registros del {{ inicio + 1 }} al {{ fin }} de un total de {{ ventas.length }} registros
    </div>
  </div>
</template>

<script>
import { getProductosByNombreLike } from "@/clientes/ProductoClientes";
import ventaService from "@/clientes/VentaCliente";
import { QSelect, QInput } from "quasar";

export default {
  components: {
    QSelect,
    QInput,
  },
  data() {
    return {
      ventas: [],
      productosFiltrados: [],
      cargandoProductos: false,
      qSelectPlaceholder: "Escribe para buscar producto",
      nuevaVenta: {
        productoId: null,
        productoNombre: "",
        cantidad: 1,
        precio: 0,
      },
      productoSeleccionado: null,
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.ventas.length / this.pageSize);
    },
    ventasPaginadas() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.ventas.slice(start, start + this.pageSize);
    },
    inicio() {
      return (this.currentPage - 1) * this.pageSize;
    },
    fin() {
      return Math.min(this.inicio + this.pageSize, this.ventas.length);
    }
  },
  methods: {
    async filtrarProductos(val, update, abort) {
      if (!val || val.length < 2) {
        update(() => {
          this.productosFiltrados = [];
        });
        return;
      }

      this.cargandoProductos = true;
      try {
        const productos = await getProductosByNombreLike(val);
        update(() => {
          this.productosFiltrados = productos;
          
        });
        
      } catch (error) {
        console.error("Error buscando productos:", error);
        update(() => {
          this.productosFiltrados = [];
        });
      } finally {
        this.cargandoProductos = false;
      }
    },

   onProductoSeleccionado(producto) {
  if (producto) {
    this.nuevaVenta.productoId = producto.id;
    this.nuevaVenta.productoNombre = producto.nombre;
    this.nuevaVenta.productoMarca = producto.marca; // 👈 Agrega esto
    this.nuevaVenta.precio = producto.precioVenta;
    this.textoBusquedaProducto = producto.nombre;
  } else {
    this.nuevaVenta = {
      productoId: null,
      productoNombre: "",
      productoMarca: "",        // 👈 reset
      cantidad: 1,
      precio: 0,
    };
    this.textoBusquedaProducto = "";
  }
}

,

    async agregarVenta() {
  if (!this.nuevaVenta.productoId) {
    alert("Selecciona un producto válido");
    return;
  }

  const payload = {
    fecha: new Date().toISOString().slice(0, 19), // 👈 formato compatible
    total: this.nuevaVenta.cantidad * this.nuevaVenta.precio,
    detalles: [
      {
        productoId: this.nuevaVenta.productoId,
        productoNombre: this.nuevaVenta.productoNombre,
        productoMarca: this.nuevaVenta.productoMarca,
        cantidad: this.nuevaVenta.cantidad,
        precioUnitario: this.nuevaVenta.precio,
        subtotal: this.nuevaVenta.cantidad * this.nuevaVenta.precio,
      },
    ],
  };

  console.log("Payload enviado:", payload);

  try {
    const response = await ventaService.crearVenta(payload);
    console.log("Respuesta del backend:", response);

    this.ventas.push({
      productoNombre: this.nuevaVenta.productoNombre,
      cantidad: this.nuevaVenta.cantidad,
      precio: this.nuevaVenta.precio,
    });

    this.productoSeleccionado = null;
    this.nuevaVenta = {
      productoId: null,
      productoNombre: "",
      productoMarca: "",
      cantidad: 1,
      precio: 0,
    };

  } catch (error) {
    console.error("Error completo al crear venta:", error);
    if (error.response) {
      console.error("Código HTTP:", error.response.status);
      console.error("Body de la respuesta:", error.response.data);
    }
    alert("Error al crear la venta, revisa consola.");
  }
},

    cambiarPagina(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    eliminarVenta(idx) {
      this.ventas.splice(idx, 1);
    },
  },
  async mounted() {
    try {
      const response = await ventaService.obtenerTodasLasVentas();
      // Normalizar datos del backend para que coincidan con la estructura local
      this.ventas = response.data.map(venta => {
        if (venta.detalles && venta.detalles.length > 0) {
          const detalle = venta.detalles[0];
          return {
            productoNombre: detalle.productoNombre,
            cantidad: detalle.cantidad,
            precio: detalle.precioUnitario,
            ...venta // mantener otros campos si existen
          };
        }
        return venta;
      });
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 0;
}

h2 {
  margin-bottom: 18px;
  color: #0ea5e9;
  font-size: 1.7rem;
  font-weight: 700;
}

.form-venta {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
  background: #f8fafc;
  padding: 24px 28px 18px 28px;
  border-radius: 18px;
  box-shadow: 0 1px 6px rgba(56, 189, 248, 0.07);
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  min-width: 160px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #0ea5e9;
  margin-bottom: 6px;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
  background: #fff;
}

.form-group input:focus {
  border-color: #38bdf8;
}

.form-actions {
  grid-column: 1 / span 3;
  display: flex;
  justify-content: center;
}

.form-actions button {
  background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.1);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}

.form-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions button:hover:not(:disabled) {
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
  box-shadow: 0 4px 16px rgba(56, 189, 248, 0.18);
  transform: translateY(-2px) scale(1.03);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  font-size: 15px;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f1f5f9;
  font-weight: 600;
  color: #374151;
}

tr:last-child td {
  border-bottom: none;
}

button {
  margin-right: 8px;
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: #38bdf8;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

td > button {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 0;
  box-shadow: none;
}

td > button:last-child {
  background: #ef4444;
  color: #fff;
  border: none;
  margin-left: 4px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

td > button:hover {
  opacity: 0.85;
}

.sin-productos {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-bottom: 24px;
}

.paginacion {
  display: flex;
  justify-content: center;
  margin: 18px 0 8px 0;
}
.paginacion button {
  margin: 0 2px;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.paginacion button.activo {
  background: #38bdf8;
  color: #fff;
}
.paginacion button:disabled {
  background: #f1f5f9;
  color: #bbb;
  cursor: not-allowed;
}
.info-paginacion {
  text-align: center;
  color: #555;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
