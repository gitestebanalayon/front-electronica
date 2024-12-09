import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';


import 'vue-step-progress/dist/main.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/css/tabler.css';
import './assets/styles/styles.css'

const pinia = createPinia()
const app = createApp(App)

DataTable.use(DataTablesCore);
app.use(router)
app.use(pinia)
app.use(VueSweetalert2);

app.mount('#app')
