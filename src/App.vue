<template>
  <div id="app" class="container">
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
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
@import url('https://fonts.googleapis.com/css?family=Passion+One:900');

body {
  margin: 0;
  overflow: hidden;
}
</style>
