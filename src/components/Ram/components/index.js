import Vue from 'vue';
import MemoryRegionView from './Region.component';
import MemoryRegionBlockView from './RegionBlock.component';
import MemoryRegionContentView from './RegionContent.component';

//Ram Components

/*---Simple Region*/
Vue.component('memory-region', MemoryRegionView);

/*---Region with Blocks*/
Vue.component('memory-block', MemoryRegionBlockView);

/*---Region Content Viewer*/
Vue.component('memory-region-content', MemoryRegionContentView);
