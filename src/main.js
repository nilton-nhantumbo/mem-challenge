//import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
//if no js file name occurs then it will look for index.js.
require('./components/ram');

new Vue({
  render: h => h(App),
}).$mount('#app');