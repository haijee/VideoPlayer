
import videojs from 'video.js'
import objectAssign from 'object-assign'

const DEFAULT_EVENTS = [
  'loadeddata',
  'canplay',
  'canplaythrough',
  'play',
  'pause',
  'waiting',
  'playing',
  'ended',
  'error'
]

const videoPlayerDirective = globalOptions => {

  // globalOptions
  globalOptions.events = globalOptions.events || []
  globalOptions.options = globalOptions.options || {}

  // Get videojs instace name in directive
  const getInstanceName = (el, binding, vnode) => {
    let instanceName = null
    if (binding.arg) {
      instanceName = binding.arg
    } else if (vnode.data.attrs && (vnode.data.attrs.instanceName || vnode.data.attrs['instance-name'])) {
      instanceName = (vnode.data.attrs.instanceName || vnode.data.attrs['instance-name'])
    } else if (el.id) {
      instanceName = el.id
    }
    return instanceName || 'player'
  }

  // dom
  const repairDom = el => {
    if (!el.children.length) {
      const video = document.createElement('video')
      video.className = 'video-js'
      el.appendChild(video)
    }
  }

  // init
  const initPlayer = (el, binding, vnode) => {

    const self = vnode.context
    const attrs = vnode.data.attrs || {}
    const options = binding.value || {}
    const instanceName = getInstanceName(el, binding, vnode)
    const customEventName = attrs.customEventName || 'statechanged'
    let player = self[instanceName]

    // options
    const componentEvents = attrs.events || []
    const playsinline = attrs.playsinline || false

    // ios fullscreen
    if (playsinline) {
      el.children[0].setAttribute('playsinline', playsinline)
      el.children[0].setAttribute('webkit-playsinline', playsinline)
      el.children[0].setAttribute('x5-playsinline', playsinline)
      el.children[0].setAttribute('x5-video-player-type', 'h5')
      el.children[0].setAttribute('x5-video-player-fullscreen', false)
    }

    // cross origin
    if (attrs.crossOrigin) {
      el.children[0].crossOrigin = attrs.crossOrigin
      el.children[0].setAttribute('crossOrigin', attrs.crossOrigin)
    }

    // initialize
    if (!player) {

      // videoOptions
      const videoOptions = objectAssign({}, {
        controls: true,
        controlBar: {
          remainingTimeDisplay: false,
          playToggle: {},
          progressControl: {},
          fullscreenToggle: {},
          volumeMenuButton: {
            inline: false,
            vertical: true
          }
        },
        techOrder: ['html5'],
        plugins: {}
      }, globalOptions.options, options)

      // plugins
      if (videoOptions.plugins) {
        delete videoOptions.plugins.__ob__
      }

      // console.log('videoOptions', videoOptions)

      // eventEmit
      const eventEmit = (vnode, name, data) => {
        const handlers = (vnode.data && vnode.data.on) || 
                         (vnode.componentOptions && vnode.componentOptions.listeners)
        if (handlers && handlers[name]) handlers[name].fns(data)
      }

      // emit event
      const emitPlayerState = (event, value) => {
        if (event) {
          eventEmit(vnode, event, player)
        }
        if (value) {
          eventEmit(vnode, customEventName, { [event]: value })
        }
      }
      
      // instance
      player = self[instanceName] = videojs(el.children[0], videoOptions, function() {

        // events
        const events = DEFAULT_EVENTS.concat(componentEvents).concat(globalOptions.events)

        // watch events
        const onEdEvents = {}
        for (let i = 0; i < events.length; i++) {
          if (typeof events[i] === 'string' && onEdEvents[events[i]] === undefined) {
            (event => {
              onEdEvents[event] = null
              this.on(event, () => {
                emitPlayerState(event, true)
              })
            })(events[i])
          }
        }

        // watch timeupdate
        this.on('timeupdate', function() {
          emitPlayerState('timeupdate', this.currentTime())
        })

        // player readied
        emitPlayerState('ready')
      })
    }
  }

  // dispose
  const disposePlayer = (el, binding, vnode) => {
    const self = vnode.context
    const instanceName = getInstanceName(el, binding, vnode)
    const player = self[instanceName]
    if (player && player.dispose) {
      if (player.techName_ !== 'Flash') {
        player.pause && player.pause()
      }
      player.dispose()
      repairDom(el)
      self[instanceName] = null
      delete self[instanceName]
    }
  }

  return {

    inserted: initPlayer,

    bind(el, binding, vnode) {
      console.log('--------')
      console.log(binding, vnode)
      repairDom(el)
    },
    
    update(el, binding, vnode) {
      const options = binding.value || {}
      disposePlayer(el, binding, vnode)
      if (options && options.sources && options.sources.length) {
          initPlayer(el, binding, vnode)
        }
    },

    unbind: disposePlayer
  }
}

export default videoPlayerDirective({})
