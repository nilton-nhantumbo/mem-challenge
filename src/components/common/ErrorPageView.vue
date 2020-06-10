<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <AppErrorIcon />
      </div>
      <h2>Ooops...</h2>
      <p>
        Something went wrong, We couldn't get Memory data
      </p>
      <a href="#" v-on:click="reloadPage()">Try Again</a>
    </div>
  </div>
</template>

<script>
//assets
import AppErrorIcon from '../../assets/jprofiler_error_icon';

//event bus
import _eventBus from '../../shared/event-bus';

export default {
  components: {
    AppErrorIcon,
  },
  methods: {
    reloadPage() {
      _eventBus.$emit('fetch-mem-data');
    },
  },
};
</script>
<style lang="css" scoped>
#notfound {
  position: relative;
  height: 100vh;
  width: 100vw;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.notfound {
  max-width: 710px;
  width: 100%;
  padding-left: 190px;
  line-height: 1.4;
}

.notfound .notfound-404 {
  position: absolute;
  left: 0;
  top: 0;
  width: 150px;
  height: 150px;
}

.notfound h2 {
  font-family: 'Raleway', sans-serif;
  color: #292929;
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin-top: 0;
}

.notfound a {
  font-family: 'Raleway', sans-serif;
  font-size: 14px;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.notfound a {
  font-family: 'Raleway', sans-serif;
  font-size: 14px;
  text-decoration: none;
  text-transform: uppercase;
  background: #fff;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 40px;
  color: #292929;
  font-weight: 700;
  -webkit-box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 4px 15px -5px rgba(0, 0, 0, 0.3);
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
}

.notfound a:hover {
  color: #fff;
  background-color: #00b5c3;
}

@media only screen and (max-width: 480px) {
  .notfound {
    text-align: center;
  }
  .notfound .notfound-404 {
    position: relative;
    width: 100%;
    margin-bottom: 15px;
  }
  .notfound {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
