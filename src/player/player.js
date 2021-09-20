
import videojs from 'video.js'
import objectAssign from 'object-assign'



const defaultOptions = {
  controls: true, //控制条：boolean
  controlBar: {
      playToggle: {
          replay: false
      },
      progressControl: false
   }
}

export default {
  // eslint-disable-next-line no-unused-vars
  beforeMount(el, binding, vnode, prevVnode) {
    console.log('beforeMount')
    const self = binding.instance
    // console.log(el, binding, vnode, prevVnode)
    const instanceName = binding.arg || {}
    const options = objectAssign({}, {...binding.value} || {},defaultOptions)

    let player = null

    if (!el.children.length) {
      const video = document.createElement('video')
      video.className = 'video-js'
      el.appendChild(video)
    }


    if(!player){
      player = self[instanceName] = videojs(el.children[0], options, function() {
        console.log(self[instanceName])
        binding.value.player = self[instanceName]
      })
    }
    console.log('mounted',self.$set)

  },
  mounted(el, binding, vnode) {
    console.log('mounted')
    console.log(el, binding, vnode)


  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')

  },
  beforeUnmount() {
    console.log('beforeUnmount')

  },
  unmounted() {
    console.log('unmounted')
  },
}



