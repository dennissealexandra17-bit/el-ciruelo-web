<template>
  <div class="reportes-container">
    <h4>Reporte de Ventas y Ganancias por Producto</h4>
    <ProductoFiltro @filtrar="aplicarFiltro" :ocultar-categoria="true" />
   <!-- <FechasFiltro @filtrar="aplicarFiltro" /> -->
    <button class="boton-exportar" @click="exportarAExcel">Exportar a Excel</button>

    <table v-if="reporteFiltrado.length">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Marca</th>
          <th>Cantidad Vendida</th>
          <th>Fecha</th>
          <th>Precio Compra</th>
          <th>Precio Venta</th>
          <th>Total de Venta</th>
          <th>Ganancia Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reportePaginado" :key="item.productoId">
          <td>{{ item.nombre }}</td>
          <td>{{ item.marca }}</td>
          <td>{{ item.cantidadVendida }}</td>
          <td>{{ item.fecha }}</td>
          <td>${{ item.precioCompra.toFixed(2) }}</td>
          <td>${{ item.precioVenta.toFixed(2) }}</td>
          <td>${{ item.totalVenta.toFixed(2) }}</td>
          <td>${{ item.gananciaTotal.toFixed(2) }}</td>
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

    <div class="info-paginacion" v-if="reporteFiltrado.length">
      Mostrando registros del {{ inicio + 1 }} al {{ fin }} de un total de {{ reporteFiltrado.length }} registros
    </div>

    <div v-if="reporteFiltrado.length" class="total-ganancia">
      <strong>Ganancia Total:</strong> ${{ totalGanancia.toFixed(2) }}
    </div>

    <div v-else>
      No hay ventas registradas.
    </div>
  </div>
</template>

<script>
import VentaCliente from '@/clientes/VentaCliente.js';
import { getProductos } from '@/clientes/ProductoClientes.js';
import ProductoFiltro from "@/components/ProductoFiltro.vue";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FechasFiltro from "@/components/FechasFiltro.vue";

export default {
  components: {
    ProductoFiltro,
    FechasFiltro
  },
  data() {
    return {
      reporte: [],
      currentPage: 1,
      pageSize: 10,
      filtro: { nombre: '', marca: '' },
    };
  },
  async mounted() {
    await this.generarReporte();
  },
  computed: {
    reporteFiltrado() {
  return this.reporte.filter(item => {
    const nombre = item.nombre || '';
    const marca = item.marca || '';
    const filtroNombre = this.filtro.nombre || '';
    const filtroMarca = this.filtro.marca || '';

    const nombreOk = filtroNombre === '' || nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const marcaOk = filtroMarca === '' || marca.toLowerCase().includes(filtroMarca.toLowerCase());

    return nombreOk && marcaOk;
  });
}
,
    totalPages() {
      return Math.ceil(this.reporteFiltrado.length / this.pageSize);
    },
    reportePaginado() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.reporteFiltrado.slice(start, start + this.pageSize);
    },
    inicio() {
      return (this.currentPage - 1) * this.pageSize;
    },
    fin() {
      return Math.min(this.inicio + this.pageSize, this.reporteFiltrado.length);
    },
    totalGanancia() {
      return this.reporteFiltrado.reduce((acc, item) => acc + (parseFloat(item.gananciaTotal) || 0), 0);
    }
  },
  methods: {
    async generarReporte() {
      try {
        const ventasRes = await VentaCliente.obtenerTodasLasVentas();
        const ventas = ventasRes.data || ventasRes;
        const productos = await getProductos();

        const resumen = {};
        ventas.forEach(venta => {
          venta.detalles.forEach(detalle => {
            const prod = productos.find(p => p.id === detalle.productoId);
            if (!prod) return;

            if (!resumen[detalle.productoId]) {
              resumen[detalle.productoId] = {
                productoId: detalle.productoId,
                nombre: detalle.productoNombre || prod.nombre,
                marca: detalle.productoMarca || prod.marca,
                fecha: venta.fecha ? new Date(venta.fecha).toLocaleDateString() : 'N/A',
                categoria: prod.categoria || '',
                cantidadVendida: 0,
                precioCompra: prod.precioCompra || 0,
                precioVenta: detalle.precioUnitario || prod.precioVenta || 0,
                totalVenta: 0,
                gananciaTotal: 0,
              };
            }

            resumen[detalle.productoId].cantidadVendida += detalle.cantidad;
            resumen[detalle.productoId].totalVenta += (detalle.precioUnitario || prod.precioVenta || 0) * detalle.cantidad;
            resumen[detalle.productoId].gananciaTotal += ((detalle.precioUnitario || prod.precioVenta || 0) - (prod.precioCompra || 0)) * detalle.cantidad;
          });
        });

        this.reporte = Object.values(resumen);
      } catch (error) {
        console.error('Error generando reporte:', error);
      }
    },
    cambiarPagina(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    aplicarFiltro(filtro) {
      this.filtro = filtro;
      this.currentPage = 1;
    },
    exportarAExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.reporteFiltrado.map(item => ({
        Producto: item.nombre,
        Marca: item.marca,
        'Cantidad Vendida': item.cantidadVendida,
        Fecha: item.fecha,
        'Precio Compra': item.precioCompra,
        'Precio Venta': item.precioVenta,
        'Total de Venta': item.totalVenta,
        'Ganancia Total': item.gananciaTotal
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      saveAs(blob, `reporte_ventas_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
  },
};
</script>

<style scoped>
.reportes-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 0;
}
h4 {
  text-align: center;
  margin-bottom: 24px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
}
th, td {
  border: 1px solid #e5e7eb;
  padding: 10px;
  text-align: left;
}
th {
  background: #f1f5f9;
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
.total-ganancia {
  margin: 16px 0 8px 0;
  font-size: 16px;
  color: #22c55e;
  text-align: right;
}
.boton-exportar {
  margin-bottom: 12px;
  background: #22c55e;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.boton-exportar:hover {
  background: #16a34a;
}
</style>
