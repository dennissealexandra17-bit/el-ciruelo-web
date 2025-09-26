<template>
  <div class="tabla-container">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Compra</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Marca</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productosPaginados" :key="producto.id">
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.precioCompra }}</td>
          <td>{{ producto.precioVenta }}</td>
          <td>{{ producto.stock }}</td>
          <td>{{ producto.marca }}</td>
          <td>{{ producto.categoria }}</td>
          <td>
            <button @click="$emit('editar', producto)">Editar</button>
            <button @click="$emit('eliminar', producto)">Eliminar</button>
          </td>
        </tr>
        <tr v-if="!productos.length">
          <td colspan="7" class="sin-productos">No hay productos para mostrar.</td>
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
    <div class="info-paginacion">
      Mostrando registros del {{ inicio + 1 }} al {{ fin }} de un total de {{ productos.length }} registros
    </div>
  </div>

  <div class="total-compra">
      <strong>Total Compra:</strong> ${{ totalCompra.toFixed(2)  }}
    </div>
</template>

<script>
export default {
  name: 'ProductoTable',
  props: {
    productos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.productos.length / this.pageSize);
    },
    productosPaginados() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.productos.slice(start, start + this.pageSize);
    },
    inicio() {
      return (this.currentPage - 1) * this.pageSize;
    },
    fin() {
      return Math.min(this.inicio + this.pageSize, this.productos.length);
    },
    totalCompra() {
  return this.productos.reduce(
    (acc, prod) =>
      acc + ((parseFloat(prod.precioCompra) || 0) * (parseFloat(prod.stockInicial) || 0)),
    0
  );
}

  },
  methods: {
    cambiarPagina(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  }
}
</script>

<style scoped>
.tabla-container {
  overflow-x: auto;
  margin-bottom: 24px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  font-size: 15px;
}
th, td {
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
button:last-child {
  background: #ef4444;
}
button:hover {
  opacity: 0.85;
}
.sin-productos {
  text-align: center;
  color: #888;
  font-style: italic;
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
.total-compra {
  margin: 16px 0 8px 0;
  font-size: 16px;
  color: #0ea5e9;
  text-align: right;
}
</style>
