//import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import utils from 'Shared/utils';

Vue.prototype.Axios = axios;
Vue.prototype.Utils = utils;
Vue.config.devtools = true;
//https: Vue.config.productionTip = false;
//if no js file name occurs then it will look for index.js.
require('./components/ram');

new Vue({
  render: (h) => h(App),
}).$mount('#app');
