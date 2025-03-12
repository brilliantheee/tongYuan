<template>
  <div class="main">
    <div class="bg-top"></div>
    <div class="bg-top-right"></div>
    <div class="bg-top-left"></div>
    <div class="bg-left"></div>
    <div class="bg-right"></div>
    <div class="bg-bottom"></div>
    <div class="bg-bottom-right"></div>
    <div class="bg-bottom-left"></div>
    <div class="bg-fff"></div>
    <slot></slot>
    <!-- 插入点 -->
  </div>
</template>

<script>
export default {
  name: "BackgroundDivs",
};
</script>

<style scoped>
.bg-top {
  background-image: url(~@/assets/images/containerbox/bg-top.png);
  position: absolute;
  top: 0;
  left: 30px;
  width: calc(100% - 60px);
  height: 30px;
  background-size: 100% 100%;
}

.bg-top-right {
  background-image: url(~@/assets/images/containerbox/bg-top-right.png);
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
}

.bg-top-left {
  background-image: url(~@/assets/images/containerbox/bg-top-left.png);
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
}

.bg-left {
  background-image: url(~@/assets/images/containerbox/bg-left.png);
  position: absolute;
  top: 30px;
  left: 0;
  width: 30px;
  height: calc(100% - 60px);
  background-repeat: repeat-y;
}
.bg-right {
  background-image: url(~@/assets/images/containerbox/bg-right.png);
  position: absolute;
  top: 30px;
  right: 0;
  width: 30px;
  height: calc(100% - 60px);
  background-repeat: repeat-y;
}

.bg-bottom {
  background-image: url(~@/assets/images/containerbox/bg-bottom.png);
  position: absolute;
  bottom: 0;
  left: 30px;
  width: calc(100% - 60px);
  height: 30px;
  background-size: 100% 100%;
}

.bg-bottom-right {
  background-image: url(~@/assets/images/containerbox/bg-bottom-right.png);
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
}

.bg-bottom-left {
  background-image: url(~@/assets/images/containerbox/bg-bottom-left.png);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 30px;
}

.bg-fff {
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
  left: 30px;
  top: 30px;
  width: calc(100% - 60px);
  height: calc(100% - 60px);
}
.main-body {
  position: relative;
  height: 100%;
}

.main {
  display: flex;
  padding: 16px;
  height: calc(100% - 30px);
  position: relative;
}
</style>