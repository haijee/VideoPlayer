<template>
<div>
    <player  />
    <link href="https://unpkg.com/video.js@7/dist/video-js.min.css" rel="stylesheet" />
  <div 
  v-player:hello="options"  
  @handle="handle"
  ></div>
<button @click="handle">
  get
</button>
</div>

</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'

export default {
  name: 'App',
  components: {},
  setup(props) {
  console.log(props.title)
 const options =  {
    muted: true,
    controls: true,
    loop: false,
    autoplay: false,
    sources: [{
      src: "http://media.w3.org/2010/05/sintel/trailer.mp4", type: "video/mp4"
    }],
  }
  const state = reactive({
    options
    })
  const handle= ()=> {

    console.log('handle', state.options )
  
  }

    return {
      
      ...toRefs(state),
      handle,
    }
  }
}
</script>

<style>
</style>
