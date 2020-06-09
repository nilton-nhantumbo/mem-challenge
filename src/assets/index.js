import Vue from 'vue';
import RamErrorIcon from './jprofiler_error_icon';
import RamIcon from './jprofiler_ram_icon';
import RamMemIcon from './ram_memory_icon';
import LoaddingAnimation from './loading_animation';
require('./fonts');

//Ram Main View
Vue.component('app-error-icon', RamErrorIcon);
Vue.component('app-logo-icon', RamIcon);
Vue.component('ram-memory-icon', RamMemIcon);
Vue.component('loading-animation', LoaddingAnimation);
