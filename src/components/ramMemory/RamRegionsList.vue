<template>
  <div class="container">
    <ul class="listContainer">
      <li
        class="listItem collapsible"
        v-for="(region, key) in regionsList"
        :key="key"
      >
        <div
          :class="regionListItemTitleClass(region)"
          v-on:click="
            region.data.regions ? onCollapsibleListItem(region.label) : null
          "
          :ref="region.label"
        >
          {{ region.label
          }}<span class="regionBytes">
            ({{ region.bytes
            }}{{ region.bytes == 1 ? ' byte' : ' bytes' }})</span
          >
        </div>
        <ul
          :ref="region.label + '_content'"
          v-if="region.data.regions"
          class="listItemContent"
        >
          <li
            class="listItem"
            v-for="(subRegion, subKey) in region.data.regions"
            :key="subKey"
          >
            <div class="listItemTitle">
              {{ subRegion.label
              }}<span class="regionBytes">
                ({{ subRegion.bytes
                }}{{ subRegion.bytes == 1 ? ' byte' : ' bytes' }}
              </span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      mounted: false,
      
    };
  },

  props: {
    regionsList: {
      required: true,
      type: Array,
      default: [],
    },
  },
  mounted() {
    let self = this;
    
  },
  methods: {
    onCollapsibleListItem(parentRef) {
      let self = this;
      var coll = self.$refs[parentRef][0];
      var i;

      coll.classList.toggle('active');
      var content = self.$refs[parentRef + '_content'][0];
      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    },
    regionListItemTitleClass(region) {
      let self = this;
      var clasx = 'listItemTitle';
      return region.data && region.data.regions
        ? clasx + ' withRegions'
        : clasx;
    },
  },
  computed: {},
};
</script>
<style lang="css" scoped>
.container {
  padding: 0px 8px;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

/* Style the button that is used to open and close the collapsible content */
.listItem {
  color: rgb(128, 128, 128);
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 13px;
  font-weight: 500;
}

.listItem .listItemTitle {
  border-bottom: solid 1px rgba(192, 192, 192, 0.322);
  padding: 8px 8px;
  width: 100%;
}

.listItemContent {
  display: none;
  overflow: hidden;
  font-size: 11px;
  padding-bottom: 8px;
  padding-left: 8px;
}

.listItemTitle.withRegions.active:after {
  content: '\2212';
}
.listItemTitle.withRegions {
  cursor: pointer;
}
.listItemTitle.withRegions:after {
  content: '\002B';
  color: rgb(175, 175, 175);
  font-weight: bold;
  float: right;
  margin-left: 5px;
}
.regionBytes {
  margin-left: 4px;
  font-weight: 300;
  color: rgb(163, 163, 163);
}
</style>
