import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/es' // idioma español
import '@quasar/extras/material-icons/material-icons.css' // íconos
import 'quasar/src/css/index.sass' // estilos de Quasar

const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // puedes agregar plugins como Notify más adelante
  lang: quasarLang,
})

app.use(router).mount('#app')
