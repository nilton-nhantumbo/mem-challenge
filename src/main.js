
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import appUtils from './shared/utils';
import ramBoardManager from './shared/RamBoardManager';
import apiService from './services/api';

Vue.prototype.ApiService = new apiService(axios);
Vue.prototype.ramBoardManager = ramBoardManager;
Vue.prototype.Utils = appUtils;
window._eventBus = new Vue({});

Vue.config.devtools = true;
require('./components');
require('./Assets');

new Vue({
  render: (h) => h(App),
}).$mount('#app');
