import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// import CountdownView from './views/CountdownView.vue'

// const app = createApp(CountdownView)
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
