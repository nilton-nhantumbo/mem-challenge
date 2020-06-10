<template>
  <div class="ramMainView">
    <MainLoadingView
      class="loadingView"
      v-show="isLoading && !hasErrorLoading"
    />
    <ErrorPageView class="loadingView" v-show="!isLoading && hasErrorLoading" />
    <div class="ramContentView" v-show="!isLoading && !hasErrorLoading">
      <div class="topnav">
        <div class="logoNav">
          <AppLogoIcon class="logo" />
          <span class="text">Java Profiler</span>
        </div>
      </div>
      <div class="ramDataView">
        <div class="ramRegionsView">
          <div class="regionTitleContainer">
            <p class="regionsTitle">Regions</p>
          </div>
          <div class="ramRegionsList">
            <RamRegionsListView :regions-list="regions" />
          </div>
        </div>
        <div class="ramBoardViewContainer">
          <div class="top ramInfo">
            <span class="title">Memory (RAM)</span>
            <span class="size">{{ ramSize }} bytes</span>
          </div>
          <RamBoardView class="ramBoardView" />
        </div>
        <div class="ramRegionsDataTypes">
          <p class="dataTypesTitle">Data Types</p>
          <ul
            v-if="dataTypes && !isLoading && !hasErrorLoading"
            class="dataTypeslist"
          >
            <li
              class="listItem"
              v-for="(dataType, dkey) in dataTypes"
              :key="dkey"
            >
              <div
                class="dataTypeColor"
                :style="{
                  backgroundColor: ramBoardManager.getColorByDataType(
                    dataType.name,
                  ),
                }"
              ></div>
              <span class="dataTypeName">
                {{ dataType.name }}
              </span>
              <span
                class="dataTypeNoText"
                v-if="!dataType.textualRepresentation"
              >
                ( No Textual Representation )
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Main Views
import RamMainView from './RamMainView';
import RamBoardView from './RamBoardView';
import RamRegionsListView from './RamRegionsList';

//extra
import ErrorPageView from '../common/ErrorPageView';
import MainLoadingView from '../common/MainLoadingView';

//assets
import AppLogoIcon from '../../assets/jprofiler_ram_icon';

//Api Service
import apiService from '../../services/api';

//BoardManager
import RamBoardManager from '../../shared/RamBoardManager';

//event bus
import _eventBus from '../../shared/event-bus';

export default {
  components: {
    RamMainView,
    RamBoardView,
    RamRegionsListView,
    MainLoadingView,
    ErrorPageView,
    AppLogoIcon,
  },
  data: function () {
    return {
      mounted: false,
      label: '',
      regions: [],
      dataTypes: [],
      ramSize: 0,
      isLoading: true,
      hasErrorLoading: false,
      ApiService: {},
      ramBoardManager: {},
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
    self.ramBoardManager = RamBoardManager;
    self.ApiService = new apiService();
    self.fetchRamData();
    self.onRetryFetchData();
  },
  methods: {
    fetchRamData() {
      let self = this;
      if (self.ApiService)
        self.ApiService.getRamRegions(self.dataUrl)
          .then((data) => {
            setTimeout(() => {
              if (data) {
                self.sendDataToRam(data);
                self.isLoading = false;
              }
            }, 4000);
          })
          .catch(
            (error) => (
              console.log('Request Error' + error),
              (self.hasErrorLoading = true),
              (self.isLoading = false)
            ),
          );
    },
    sendDataToRam(ramData) {
      let self = this;
      self.regions = ramData.data.regions;
      self.ramSize = ramData.data.bytes;
      self.dataTypes = ramData.dataTypes;
      _eventBus.$emit('ram-data-fetched', ramData);
    },
    onRetryFetchData() {
      let self = this;

      _eventBus.$on('fetch-mem-data', () => {
        self.isLoading = true;
        self.hasErrorLoading = false;
        self.fetchRamData();
      });
    },
  },
  computed: {},
};
</script>
<style lang="css" scoped>
.ramMainView {
  display: flex;
  width: 100%;
}

.topnav {
  overflow: hidden;
  height: 56px;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  position: relative;
}
.logoNav {
  display: inline-flex;
  margin: 4px 0px 0px 8px;
  text-align: center;
  align-items: center;
  justify-content: center;
  float: left;
}
.logoNav .text {
  font-family: 'Roboto';
  font-weight: 600;
  font-size: 16px;
  color: #00b5c6;
  margin-left: 16px;
}
.logoNav .logo {
  width: 42px;
}
.ramContentView {
  display: block;
  position: relative;
  width: 100%;
}

.ramDataView {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
}
.regionTitleContainer {
  text-align: center;
}
.regionTitleContainer .regionsTitle {
  font-size: 14px;
  font-weight: 500;
  color: rgba(99, 99, 99, 0.521);
  margin-top: 16px;
}

.ramRegionsView {
  display: block;
  margin-top: 24px;
  padding-right: 24px;
  border-right: 1px solid rgba(221, 221, 221, 0.7803921568627451);
}

.ramRegionsList {
  margin-top: 16px;
}

.ramInfo p {
  margin: 0;
}

.ramInfo {
  display: inline-block;
}

.ramInfo .title {
  font-size: 16px;
  font-weight: 400;
  margin-left: 3vw;
  color: rgba(57, 96, 97, 0.621);
}

.ramInfo .size {
  margin-left: 35vw;
  font-size: 16px;
  font-weight: 400;
  color: rgba(107, 120, 121, 0.521);
}

.ramBoardViewContainer {
  display: block;
  width: 920px;
  margin-top: 24px;
  margin-left: 48px;
}
.ramBoardView {
  position: relative;
}

.ramBoardView {
  z-index: 8;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 28px 48px 0px 28px;
  align-items: center;
  align-content: center;
  text-align: center;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.ramRegionsDataTypes {
  text-align: start;
}

.ramRegionsDataTypes {
  margin-top: 18px;
  padding-left: 24px;
  border-left: 1px solid rgba(221, 221, 221, 0.7803921568627451);
}

.ramRegionsDataTypes .dataTypesTitle {
  font-size: 14px;
  font-weight: 500;
  color: rgba(57, 96, 97, 0.621);
}

.dataTypeslist .listItem {
  display: flex;
  font-size: 13px;
  font-weight: 400;
  color: rgba(86, 95, 95, 0.849);
  margin-bottom: 6px;
}
.dataTypeslist .dataTypeColor {
  position: relative;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  background-color: rgb(165, 165, 165);
}
.dataTypeslist .dataTypeNoText {
  margin-left: 8px;
  font-weight: 300;
}
</style>
