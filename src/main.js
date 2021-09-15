import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import * as VueGoogleMaps from 'vue2-google-maps'


Vue.config.productionTip = false
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBhPd7BLmIlHh2QLQXx1IxysLclsDGG_6E',
    libraries: 'places,drawing,visualization,geometry'
  }
})
new Vue({
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
