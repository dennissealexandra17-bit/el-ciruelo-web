<template>
  <div class="producto-view">
     <div class="acciones-producto">
      <button @click="mostrarAgregar = true">Agregar Producto</button>
    </div>
    <AgregarProducto
      v-if="mostrarAgregar"
      @close="mostrarAgregar = false"
      @agregar="agregarProducto"
    />
    <EditarProducto
      v-if="mostrarEditar"
      :productoEditar="productoEditar"
      @editar="guardarProductoEditado"
      @close="cerrarFormulario"
    />
    <ProductoFiltro @filtrar="aplicarFiltro" />
    <ProductoTable
      :productos="productosFiltrados"
      @editar="editarProducto"
      @eliminar="eliminarProducto"
    />
    
  </div>
</template>

<script>
import {
  getProductos,
  postProducto,
  putProducto,
  deleteProducto,
} from "@/clientes/ProductoClientes";
import ProductoFiltro from "@/components/ProductoFiltro.vue";
import ProductoTable from "@/components/ProductoTable.vue";
import AgregarProducto from "@/components/AgregarProducto.vue";
import EditarProducto from "@/components/EditarProducto.vue"; // ✔ corregido

export default {
  components: {
    ProductoFiltro,
    ProductoTable,
    AgregarProducto,
    EditarProducto,
  },
  data() {
    return {
      productos: [],
      filtro: { nombre: "", categoria: "" , marca: "" },
      mostrarAgregar: false,
      mostrarEditar: false, // ✔ agregado
      productoEditar: null,
    };
  },
  async mounted() {
    await this.cargarProductos();
  },
  computed: {
    productosFiltrados() {
      return this.productos.filter((p) => {
        const nombreOk =
          this.filtro.nombre === "" ||
          p.nombre.toLowerCase().includes(this.filtro.nombre.toLowerCase());
        const catOk =
          this.filtro.categoria === "" ||
          p.categoria.toLowerCase().includes(this.filtro.categoria.toLowerCase());
        const marcaOk =
          this.filtro.marca === "" ||
          p.marca.toLowerCase().includes(this.filtro.marca.toLowerCase());
        return nombreOk && catOk && marcaOk;
      });
    },
  },
  methods: {
    async cargarProductos() {
      try {
        const productos = await getProductos();
        this.productos = productos;
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    },
    aplicarFiltro(filtro) {
      this.filtro = filtro;
    },
    async agregarProducto(producto) {
      try {
        await postProducto(producto);
        await this.cargarProductos();
        this.mostrarAgregar = false;
      } catch (error) {
        console.error("Error al agregar producto:", error);
      }
    },
    editarProducto(producto) {
      this.productoEditar = { ...producto };
      this.mostrarEditar = true;
    },
    async guardarProductoEditado(producto) {
      try {
        await putProducto(producto, this.productoEditar.id);
        this.productoEditar = null;
        this.mostrarEditar = false;
        await this.cargarProductos();
      } catch (error) {
        console.error("Error al editar producto:", error);
      }
    },
    cerrarFormulario() {
      this.productoEditar = null;
      this.mostrarEditar = false;
    },
    async eliminarProducto(producto) {
      try {
        await deleteProducto(producto.id);
        await this.cargarProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    },
  },
};
</script>

<style scoped>
.producto-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 0;
}
.acciones-producto {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}
.acciones-producto button {
  background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(56, 189, 248, 0.1);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}
.acciones-producto button:hover {
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
  box-shadow: 0 4px 16px 0 rgba(56, 189, 248, 0.18);
  transform: translateY(-2px) scale(1.03);
}
</style>
