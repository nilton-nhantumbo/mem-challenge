<template>
  <div class="ramBoardView">
    <div :id="boardContainerId"></div>
  </div>
</template>

<script>
import MainLoadingView from '../common/MainLoadingView';

//BoardManager
import RamBoardManager from '../../shared/RamBoardManager';

//event bus
import _eventBus from '../../shared/event-bus';

export default {
  data: function () {
    return {
      mounted: false,
      label: '',
      totalBytes: 0,
      maxCols: 0,
      boardContainerId: 'boardContainer',
      boardManager: {},
    };
  },

  props: {},
  mounted() {
    let self = this;
    self.boardContainerId = 'boardContainer' + Math.random();
    self.initDataFetcher();
  },
  methods: {
    initDataFetcher() {
      let self = this;
      _eventBus.$on('ram-data-fetched', (regions) =>
        self.startProfiling(regions),
      );
    },
    startProfiling(regions) {
      let self = this;
      //    console.log(regions);
      self.boardManager = new RamBoardManager(
        self.boardContainerId,
        regions,
        24,
      );
    },
  },
  computed: {},
};
</script>
<style lang="css" scoped></style>
