<template>
  <div id="app" class="container appFont">
    <MainView
      data-url="https://gitlab.com/mem-challenge/json/-/raw/master/RAM.json"
    />
  </div>
</template>

<script>
//Main component
import MainView from './components/ramMemory/RamMainView';

//fonts
import './assets/fonts';

export default {
  components: {
    MainView,
  },
  name: 'app',
};
</script>
<style lang="css">
body {
  margin: 0;
  overflow: hidden;
}
</style>
