<template>
  <div class="ramRegionBlock">
    <div :id="boardContainerId"></div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      mounted: false,
      label: '',
      regions: [],
      cols: 0,
      rows: 0,
      totalBytes: 0,
      maxCols: 0,
      boardContainerId: 'boardContainer',
      cellsMatrix: [],
      boardManager: [],
    };
  },

  props: {
    dataUrl: {
      type: String,
      required: true,
    },
    colsLimit: {
      type: Number,
      required: false,
      default: 30,
    },
  },
  mounted() {
    let self = this;
    self.maxCols = self.colsLimit;
    self.boardContainerId = boardContainer + Math.random();
    self.getMemoryBloks();
  },
  methods: {
    getMemoryBloks() {
     
    },
    fillMatrixCells(cellPositionArray) {
      let self = this;
      var cellsMatrix = self.cellsMatrix;
      self.cellsMatrix.push(cellPositionArray);
      // if (cellsMatrix && cellsMatrix.length < 1) {

      // }
    },
    setTableStructure(maxCols) {
      let self = this;
      let bytes = self.totalBytes;
      var cols = 0;
      var rows = 0;
      for (var i = maxCols; i > 1; i--) {
        if (bytes % i == 0) {
          cols = i;
          rows = bytes / i;
          break;
        }
      }
      if (cols > 0 && rows > 0 && cols > rows) {
        self.cols = cols;
        self.rows = rows;
        //console.log(cols);
      } else {
        self.setTableStructure(maxCols + 1);
      }
    },
  },
  computed: {},
};
</script>
<style lang="css" scoped></style>
