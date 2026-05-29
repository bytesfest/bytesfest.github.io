import './assets/main.css'

import { createApp, type App as AppType } from 'vue'
import { createPinia } from 'pinia'
import CountdownView from './views/CountdownView.vue'

import App from './App.vue'
import router from './router'

const localTZ = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
const today = new Date(localTZ)
const localJune5th = new Date('2026-06-04T17:00:00.000Z')

let app: AppType

// before 5 June 2026
if (today < localJune5th) app = createApp(CountdownView)
else {
  app = createApp(App)
  app.use(router)
}

app.use(createPinia())
app.mount('#app')
