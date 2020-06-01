<template>
  <div class="ramRegionBlock">
    <table>
      <tr v-for="(quantity, key) in getRows" :key="key">
        <td v-for="(quantity, key) in getCols" :key="key"></td>
      </tr>
    </table>
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
    self.getMemoryBloks();
  },
  methods: {
    getMemoryBloks() {
      let self = this;
      let url = self.dataUrl;
      self.Axios.get(url)
        .then(function (response) {
          // handling success
          console.log(response);
          let data = response.data;
          self.label = data.label;
          self.totalBytes = data.bytes;
          self.regions = response.data.regios;
          self.setTableStructure(self.maxCols);
        })
        .catch(function (error) {
          // handling error
          console.log(error);
        });
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
        console.log(cols);
      } else {
        maxCols = maxCols + 1;
        self.setTableStructure(maxCols);
      }
    },
  },
  computed: {
    getCols() {
      let self = this;
      return self.cols;
    },
    getRows() {
      let self = this;
      return self.rows;
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
