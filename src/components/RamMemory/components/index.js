import Vue from 'vue';
import MemoryRegionView from './RegionView';
import MemoryRegionBlockView from './RegionBlockView';
import MemoryRegionContentView from './RegionContentView';

//Ram Components
/*---Simple Region*/
Vue.component('memory-region', MemoryRegionView);

/*---Region with Blocks*/
Vue.component('memory-block', MemoryRegionBlockView);

/*---Region Content Viewer*/
Vue.component('memory-region-content', MemoryRegionContentView);
