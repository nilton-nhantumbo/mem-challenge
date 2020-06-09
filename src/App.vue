<template>
  <div id="app" class="container appFont">
    <ram-main-view
      data-url="https://gitlab.com/mem-challenge/json/-/raw/master/RAM.json"
    />
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>
<style lang="css">
body {
  margin: 0;
  overflow: hidden;
}
</style>
