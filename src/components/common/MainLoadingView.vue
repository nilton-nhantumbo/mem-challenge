<template>
  <div class="container">
    <loading-animation
      class="loadingAnimation"
      animation-duration="4000"
      color="#00b5c8"
      size="76"
    />
    <h2 class="loadingTitle">Please wait!</h2>
    <p class="loadingSubTitle">We're getting things ready...</p>
    <div class="footer">
      <ram-icon class="ramIcon" />
      <span class="creator">Developed by: </span
      ><span class="creatorName"> Nilton Nhantumbo</span>
    </div>
  </div>
</template>

<script>
export default {};
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
.loadingTitle {
  margin-top: 24px;
  font-size: 28px;
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
