import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/productos/',
    name: 'producto',
    component: () => import('../views/ProductoView.vue')
  },
  {
    path: '/reportes/',
    name: 'reportes',
    component: () => import('../views/ReportesView.vue')
  },
  {
    path: '/ventas/',
    name: 'ventas',
    component: () => import('../views/VentasView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
