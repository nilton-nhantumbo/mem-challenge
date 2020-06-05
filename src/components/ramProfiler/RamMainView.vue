<template>
  <div class="ramMainView">
    <main-loading-view
      class="loadingView"
      v-show="isLoading && !hasErrorLoading"
    />
    <div class="ramDataView" v-show="!isLoading && !hasErrorLoading">
      <div class="topnav">
        <div class="logoNav">
          <ram-icon class="logo" />
          <span class="text">Java Profiler</span>
        </div>
      </div>
      <div class="ramBoardViewContainer">
        <ram-board-view class="ramBoardView" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      mounted: false,
      label: '',
      regions: [],
      isLoading: true,
      hasErrorLoading: false,
    };
  },

  props: {
    dataUrl: {
      type: String,
      required: true,
    },
  },
  mounted() {
    let self = this;
    self.fetchRamData();
  },
  methods: {
    fetchRamData() {
      let self = this;
      self.ApiService.getRamRegions(self.dataUrl)
        .then((data) => {
          setTimeout(() => {
            console.log(data);
            self.sendDataToRam(data);
            self.isLoading = false;
          }, 4000);
        })
        .catch(
          (error) => (
            console.log(error),
            (self.errorLoading = true),
            (self.isLoading = false)
          ),
        );
    },
    sendDataToRam(regions) {
      let self = this;
      _eventBus.$emit('ram-data-fetched', regions);
    },
  },
  computed: {},
};
</script>
<style lang="css" scoped>
.ramMainView {
  display: flex;
}
.ramDataView {
  display: block;
  position: relative;
  align-items: center;
  align-content: center;
}

.topnav {
  overflow: hidden;
  height: 56px;
  width: 100%;
  background-color: #ffffff;
  /* margin: 24px; */
  margin-bottom: 24px;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  position: relative;
}
.logoNav {
  display: inline-flex;
  margin: 4px 0px 0px 8px;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.logoNav .text {
  font-family: 'Roboto';
  font-weight: 600;
  font-size: 16px;
  color: #00b5c6;
  margin-left: 16px;
}
.logoNav .logo {
  width: 46px;
}
.ramBoardViewContainer {
  display: block;
  align-content: center;
  justify-content: center;
}
.ramBoardView {
  position: relative;
}
</style>
