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
      let self = this;
      let url = self.dataUrl;
      self.Axios.get(url)
        .then(function (response) {
          // handling success
          //console.log(response);
          let data = response.data;
          self.label = data.label;
          self.totalBytes = data.bytes;
          self.regions = response.data.regios;
          self.setTableStructure(self.maxCols);
          self.boardManager = new self.BoardUtils(
            self.boardContainerId,
            self.rows,
            self.cols,
            24,
          );
          self.boardManager.drawBoard();
        })
        .catch(function (error) {
          // handling error
          console.log(error);
        });
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
    fillRegionsSpace() {
      let regions = self.regions;

      regions.forEach((region) => {});
    },
  },
  computed: {
    listMatrix() {
      let self = this;
      var cellsList = [];
      let cols = self.cols;
      let rows = self.rows;
      for (var row = 1; row <= rows; row++) {
        for (var col = 1; col <= cols; col++) {
          cellsList.push([row, col]);
        }
      }
      var cellsListMatrix = self.Utils.listToMatrix(cellsList, cols);
      self.cellsMatrix = cellsListMatrix;

      //console.log( self.cellsMatrix);

      return cellsListMatrix;
    },
  },
};
</script>
<style lang="css" scoped>
table {
  table-layout: fixed;
  border-collapse: collapse;
}
table td {
  width: 20px;
  height: 20px;
  overflow: hidden;
  border: 1px solid black;
}
</style>
