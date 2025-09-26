<template>
  <div class="filtro-container">
    <input v-model="nombre" type="text" placeholder="Buscar por nombre..." @input="emitFiltro" />
    <input v-if="!ocultarCategoria" v-model="categoria" type="text" placeholder="Buscar por categoría..." @input="emitFiltro" />
    <input v-model="marca" type="text" placeholder="Buscar por marca..." @input="emitFiltro" />
    <button type="button" @click="limpiarFiltros">Limpiar Filtros</button>
  </div>
</template>

<script>
export default {
  name: 'ProductoFiltro',
  props: {
    ocultarCategoria: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nombre: '',
      categoria: '',
      marca: ''
    }
  },
  methods: {
    emitFiltro() {
      this.$emit('filtrar', {
        nombre: this.nombre,
        categoria: this.categoria,
        marca: this.marca
      });
    },
    limpiarFiltros() {
      this.nombre = '';
      this.categoria = '';
      this.marca = '';
      this.emitFiltro();
    }
  }
}
</script>

<style scoped>
.filtro-container {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  justify-content: center;
}
.filtro-container input {
  padding: 7px 12px;
  border-radius: 6px;
  border: 1.5px solid #cbd5e1;
  background: #f1f5f9;
  font-size: 15px;
  min-width: 180px;
  transition: border 0.2s, box-shadow 0.2s;
}
.filtro-container input:focus {
  outline: none;
  border: 1.5px solid #38bdf8;
  background: #fff;
  box-shadow: 0 0 0 2px #bae6fd;
}

button {
  padding: 7px 12px;
  border: none;
  border-radius: 6px;
  background: #38bdf8;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
</style>
