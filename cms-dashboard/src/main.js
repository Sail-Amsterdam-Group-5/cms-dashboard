
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

import '../src/assets/main.css';



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
