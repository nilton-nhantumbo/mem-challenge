<template>
  <div class="ramContainer">
    <memory-block
      data-url="https://gitlab.com/mem-challenge/json/-/raw/master/RAM.json"
    />
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
    tipo: {
      default: 'sucesso',
    },
  },

  mounted() {
    let self = this;
  },
  methods: {},
  computed: {},
};
</script>

<style lang="css" scoped>
p {
  font-size: 4em;
  text-align: center;
}
</style>
