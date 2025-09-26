<template>
  <div class="filtro-container">
    
    <input type="date" v-model="fecha" @input="emitirFiltro" placeholder="Buscar por fecha" /> 
    <input type="date" v-model="fechaInicio" @input="emitirFiltro" placeholder="Desde" />
    <input type="date" v-model="fechaFin" @input="emitirFiltro" placeholder="Hasta" />

    <button @click="limpiarFiltros">Limpiar Filtros</button>
  </div>
</template>


<script>
export default {
  name: 'FechasFiltro',
  data() {
    return {
      fecha: '',
      fechaInicio: '',
      fechaFin: ''
    };
  },
  methods: {
    emitirFiltro() {
      // Solo una fecha
      if (this.fecha && !this.fechaInicio && !this.fechaFin) {
        this.$emit('filtrar', { tipo: 'unica', fecha: this.fecha });
      }
      // Rango de fechas
      else if (this.fechaInicio && this.fechaFin) {
        this.$emit('filtrar', {
          tipo: 'rango',
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin
        });
      }
    },
    limpiarFiltros() {
      this.fecha = '';
      this.fechaInicio = '';
      this.fechaFin = '';
      this.$emit('filtrar', null); // sin filtro
    }
  }
};
</script>
<style scoped>
.filtro-container {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  justify-content: center;
  flex-wrap: wrap;
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
