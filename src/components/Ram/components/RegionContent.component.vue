<template>
  <div class="ramRegionz"></div>
</template>

<script>
export default {
  data: function () {
    return {
      mounted: false,
    };
  },

  props: {
    tipo: {
      default: 'sucesso',
    },
  },

  mounted() {
    this.mounted = true;
  },

  computed: {},
};
</script>
