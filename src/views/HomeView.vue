<template>
  <div class="container tablas-lado">
    <div class="stock">
      <h5>Productos con Stock Reducido</h5>
      <div class="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Marca</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in productosReducidoStock" :key="prod.id">
              <td>{{ prod.productoNombre }}</td>
              <td>{{ prod.productoMarca }}</td>
              <td>{{ prod.cantidad }}</td>
            </tr>
            <tr v-if="productosReducidoStock.length === 0">
              <td colspan="2">No hay productos con bajo stock</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="ventas">
      <h5>Ventas del Día</h5>
      <div class="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Marca</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(venta, id) in ventasDelDia" :key="id">
              <td>{{ venta.detalles[0]?.productoNombre || "N/A" }}</td>
              <td>{{ venta.detalles[0]?.productoMarca || "N/A" }}</td>
              <td>{{ venta.detalles[0]?.cantidad || 0 }}</td>
              <td>${{ (venta.detalles[0]?.precioUnitario || 0).toFixed(2) }}</td>
              <td>${{ (venta.detalles[0]?.subtotal || 0).toFixed(2) }}</td>
            </tr>
            <tr v-if="ventasDelDia.length === 0">
              <td colspan="5">No hay ventas registradas hoy</td>
            </tr>
            <tr v-if="ventasDelDia.length > 0" class="total-row">
              <td colspan="4"><strong>Total del día:</strong></td>
              <td><strong>${{ totalVentasDelDia.toFixed(2) }}</strong></td>
            </tr>
            <tr>
              <td colspan="4"><strong>Total ganancias del día:</strong></td>
              <td><strong>${{ (totalGananciasDelDia || 0).toFixed(2) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import { getStockReducido } from "@/clientes/InventarioCliente";
import ventaService from "@/clientes/VentaCliente";
import { getProductos } from "@/clientes/ProductoClientes";

export default {
  data() {
    return {
      productosReducidoStock: [],
      ventas: [],
      productos: [],
      totalGananciasDelDia: 0,
    };
  },
  computed: {
    ventasDelDia() {
      const hoy = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
      return this.ventas.filter((venta) => {
        if (!venta.fecha) return false;
        const fechaVenta = new Date(venta.fecha).toISOString().split("T")[0];
        return fechaVenta === hoy;
      });
    },
    totalVentasDelDia() {
      return this.ventasDelDia.reduce((total, venta) => {
        const subtotal = venta.detalles[0]?.subtotal || 0;
        return total + subtotal;
      }, 0);
    },
  },
  methods: {
    async calcularTotalGananciasDelDia() {
      if (!this.productos.length) {
        this.productos = await getProductos();
      }

      let totalGanancia = 0;

      this.ventasDelDia.forEach((venta) => {
        venta.detalles.forEach((detalle) => {
          const producto = this.productos.find(
            (p) => p.id === detalle.productoId
          );
          if (producto) {
            const gananciaPorUnidad =
              producto.precioVenta - producto.precioCompra;
            totalGanancia += gananciaPorUnidad * detalle.cantidad;
          }
        });
      });

      this.totalGananciasDelDia = totalGanancia;
    },
  },
  async mounted() {
    try {
      const response = await getStockReducido();
      this.productosReducidoStock = response.data;
    } catch (error) {
      console.error("Error al cargar productos con bajo stock:", error);
    }

    try {
      const response = await ventaService.obtenerTodasLasVentas();
      this.ventas = response.data;
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }

    await this.calcularTotalGananciasDelDia();
  },
};
</script>

<style scoped>
.tablas-lado {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  align-items: stretch; /* 🔸 igual altura */
}

.stock,
.ventas {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  background: #fff8e1;
  padding: 28px 24px 18px 24px;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(255, 152, 0, 0.08);
  max-width: 700px;
  min-height: 400px;
}

.tabla-contenedor {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

tr td[colspan] {
  text-align: center;
  color: #ef4444;
  font-weight: 600;
}


.tabla-contenedor table {
  flex-grow: 1;
  height: 100%;
  width: 100%;
  table-layout: fixed; /* 🔸 asegura altura pareja por fila */
}
.stock, .ventas {
  height: 500px; /* fuerza igualdad total */
}


.tablas-lado {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: stretch; /* 💡 Esto hace que ambas secciones tengan igual altura */
  flex-wrap: wrap;
}

body,
.container {
  background: linear-gradient(135deg, #fffbe6 0%, #e0f7fa 100%);
  min-height: 100vh;
  font-family: "Montserrat", "Arial", sans-serif;
}
.container {
  text-align: center;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
}

.stock,
.ventas {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff8e1;
  padding: 28px 24px 18px 24px;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(255, 152, 0, 0.08);
  max-width: 700px;
  min-height: 400px; /* 🔸 Hace que ambas tengan altura mínima igual */
}

.stock table,
.ventas table {
  flex-grow: 1;
  height: 100%;
}



h5,
h3 {
  color: #ff9800;
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 18px;
  letter-spacing: 1px;
  font-family: "Montserrat", "Arial", sans-serif;
}
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 20px 0;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 8px rgba(56, 189, 248, 0.07);
  font-size: 16px;
  overflow: hidden;
}
th,
td {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid #ffe066;
}
th {
  background: #e0f7fa;
  font-weight: 700;
  color: #0ea5e9;
  font-size: 1rem;
}
tr:last-child td {
  border-bottom: none;
}
button {
  margin-right: 8px;
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  background: #38bdf8;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  font-size: 16px;
}
button.form-actions {
  background: linear-gradient(90deg, #ff9800 0%, #ffe066 100%);
  color: #1e293b;
  border: none;
  border-radius: 18px;
  padding: 14px 38px;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.18);
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  letter-spacing: 1px;
  font-family: "Montserrat", "Arial", sans-serif;
  border: 2px solid #ff9800;
}
button.form-actions:hover {
  background: linear-gradient(90deg, #ffe066 0%, #ff9800 100%);
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.28);
  transform: translateY(-4px) scale(1.07) rotate(-2deg);
}
/* Botón de acción con ícono */
.button-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #38bdf8 0%, #ff9800 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 28px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(56, 189, 248, 0.12);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}
.button-icon svg {
  width: 22px;
  height: 22px;
  vertical-align: middle;
  fill: currentColor;
}
.button-icon.agregar {
  background: linear-gradient(90deg, #38bdf8 0%, #22c55e 100%);
}
.button-icon.eliminar {
  background: linear-gradient(90deg, #ef4444 0%, #ff9800 100%);
}
.button-icon.editar {
  background: linear-gradient(90deg, #f59e42 0%, #38bdf8 100%);
}
.button-icon:hover {
  filter: brightness(1.08);
  transform: scale(1.05);
  box-shadow: 0 4px 16px 0 rgba(56, 189, 248, 0.18);
}
.nav-link {
  color: #1e293b;
  text-decoration: none;
  font-weight: 800;
  font-size: 20px;
  font-family: "Montserrat", "Arial", sans-serif;
  letter-spacing: 1px;
}
tr.total-row {
  background-color: #ffe066;
  font-weight: bold;
}
tr.total-row td {
  border-top: 2px solid #ff9800;
}
tr td[colspan] {
  text-align: center;
  color: #ef4444;
  font-weight: 600;
}
.stock th,
.ventas th {
  border-bottom: 2px solid #ff9800;
}
.stock h5,
.ventas h5 {
  margin-top: 0;
  margin-bottom: 12px;
}
</style>
