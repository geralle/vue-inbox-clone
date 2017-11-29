import Vue from 'vue'
import App from './App.vue'
import Inbox from './Inbox.vue'

Vue.component('app-inbox', Inbox)

new Vue({
  el: '#app',
  render: h => h(App)
})
