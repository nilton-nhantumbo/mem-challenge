<template>
  <div class="container">
    <LoadingAnimation
      class="loadingAnimation"
      animation-duration="4000"
      color="#00b5c8"
      size="76"
    />
    <p class="loadingSubTitle">Getting Memory Data...</p>
    <div class="footer">
      <AppLogoIcon class="ramIcon" />
      <span class="creator">Developed by: </span
      ><span class="creatorName"> Nilton Nhantumbo</span>
    </div>
  </div>
</template>

<script>
//assets
import AppLogoIcon from '../../assets/jprofiler_ram_icon';
import LoadingAnimation from '../../assets/loading_animation';

export default {
  components: {
    LoadingAnimation,
    AppLogoIcon,
  },
};
</script>
<style lang="css" scoped>
.container {
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  padding-top: 25vh;
  display: block;
  position: relative;
  align-items: center;
  text-align: center;
  background-color: whitesmoke;
  font-family: 'Roboto';
}
.loadingAnimation {
  position: relative;
  left: 48vw;
}
.loadingSubTitle {
  margin-top: 28px;
  font-size: 18px;
}
.footer {
  display: flex;
  position: fixed;
  bottom: 8px;
  text-align: center;
  align-items: center;
  align-content: center;
  left: 42vw;
  font-size: 14px;
}

.footer .ramIcon {
  width: 24px;
}

.footer .creator {
  margin-left: 8px;
}

.creatorName {
  font-weight: 500;
  margin-left: 8px;
}
</style>
