import { createApp } from 'vue'
import App from './App.vue'
import player from './player/index'

const app = createApp(App)
console.log(player)
app.use(player,{a:123})
app.mount('#app')
