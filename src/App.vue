<template>
<router-link to="/" class="title-link">El Ciruelo</router-link>
  <NavBar />
  <router-view />

  
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}

</script>

<style>
.title-link {
  display: inline-block;
  font-size: 48px;
  margin: 32px 0 18px 0;
  color: #0a3871;
  font-family: 'Montserrat', 'Arial Black', 'Arial', sans-serif;
  font-weight: 900;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 #fff, 0 4px 12px #38bdf8;
  padding: 10px 38px;
  border-radius: 22px;
  background: linear-gradient(90deg, #e0f7fa 0%, #fffbe6 100%);
  border: 3px solid #38bdf8;
  box-shadow: 0 4px 24px rgba(56, 189, 248, 0.12);
  transition: transform 0.18s, box-shadow 0.18s, background 0.18s, color 0.18s;
}
.title-link:hover {
  background: linear-gradient(90deg, #ff9800 0%, #ffe066 100%);
  color: #fff;
  transform: scale(1.07) rotate(-2deg);
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.18);
  text-shadow: 2px 2px 0 #0a3871, 0 4px 12px #ff9800;
}
#app {
  font-family: 'Montserrat', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(135deg, #fffbe6 0%, #e0f7fa 100%);
  min-height: 100vh;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #52796f;
}

</style>
