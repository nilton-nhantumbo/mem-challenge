//import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import appUtils from 'Shared/utils';
import ramBoardManager from 'Shared/RamBoardManager';
import apiService from 'Services/api';

Vue.prototype.ApiService = new apiService(axios);
Vue.prototype.ramBoardManager = ramBoardManager;
Vue.prototype.Utils = appUtils;
window._eventBus = new Vue({});

Vue.config.devtools = true;
//https: Vue.config.productionTip = false;
//if no js file name occurs then it will look for index.js.
require('./components');
require('./Assets');

new Vue({
  render: (h) => h(App),
}).$mount('#app');
