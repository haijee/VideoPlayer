export default () => a


const a = {

      bind:(el, binding, vnode)=>{
        console.log('我的自定义指令')

        console.log(el, binding, vnode)
      },
      // 当被绑定的元素插入到 DOM 中时……
      inserted:(el) => {
        console.log('我的自定义指令')

        console.log(el)
      },
      update: (el)=> {
        console.log(el)
      },
      unbind: (el)=> {
        console.log(el)

      },
}



