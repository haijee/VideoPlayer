
import player from "./player.vue"
import vplayer from "./player.js"

const install = (app, opts = {}) => {
    app.component('player', player)
    app.directive('player', vplayer)
    app.opts = opts
}


export default {
  version: '0.1.0',
  install,
}
