<template>
  <nav>
    <router-link class="nav-link" to="/productos/">Productos</router-link> 
        <router-link class="nav-link" to="/ventas/">Ventas</router-link> 

    <router-link class="nav-link" to="/reportes/">Reportes</router-link> 
  </nav>
</template>

<style scoped>
nav {
  font-weight: bold;
  color: #2c3e50;
  background: linear-gradient(90deg, #ffe066 0%, #ff9800 100%);
  border: none;
  border-radius: 18px;
  padding: 16px 14px;
  box-shadow: 0 2px 12px rgba(255, 152, 0, 0.10);
  display: flex;
  justify-content: center;
  gap: 18px;
}
.nav-link {
  background: #0ea5e9;
  color: #fff;
  padding: 8px 22px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.12s;
  letter-spacing: 1px;
  font-family: 'Montserrat', 'Arial', sans-serif;
  border: 2px solid #38bdf8;
}
.nav-link:hover {
  background: #ff9800;
  color: #fff;
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.18);
  transform: translateY(-2px) scale(1.07) rotate(-2deg);
  border-color: #ff9800;
}
</style>
