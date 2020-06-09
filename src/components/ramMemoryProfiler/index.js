import Vue from 'vue';
import RamView from './RamMainView';
import RamBoardView from './RamBoardView';
import RamRegionsListView from './RamRegionsList';

//Ram Main View
Vue.component('ram-main-view', RamView);
Vue.component('ram-regions-list', RamRegionsListView);
Vue.component('ram-board-view', RamBoardView);
