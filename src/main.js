import { createApp } from 'vue'
import App from './App.vue'
import player from './player/index'

const app = createApp(App)
app.use(player)
app.mount('#app')
