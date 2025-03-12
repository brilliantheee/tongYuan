
<template>
  <div class="container-box">
    <div class="header">
      <div class="header-warp">
        <div class="header-title">
          <span>异常检测</span>
        </div>
      </div>
    </div>
    <backgroundCard>
      <!-- 这里是主体内容 -->
      <div class="main-body"></div>
    </backgroundCard>
  </div>
</template>
<script>
import backgroundCard from "@/components/backgroundCard/index.vue";
export default {
  components: { backgroundCard },
  data() {
    return {};
  },

  methods: {},
};
</script>
<style scoped lang="less">
.container-box {
  height: 100%;
  width: 100%;
}

.container-box > .header {
  .header-warp {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: calc(100% - 60px);
    height: 30px;
    margin-left: 30px;

    background-image: url(~@/assets/images/containerbox/b1.png);
    background-repeat: repeat-x;
    background-position: revert;
    background-size: 100% 100%;
  }

  .header-title {
    font-size: 18px;
    font-weight: bold;

    padding-left: 20px;

    transform: translate(-10px, -10px);

    color: #333;

    &--white {
      font-size: 20px;

      position: relative;
      left: -5px;

      padding-left: 0;

      color: #fff;

      &::before {
        display: none !important;
      }
    }

    &--with-action {
      cursor: pointer;
      transition: opacity 0.3s ease, filter 0.3s ease;

      &:hover {
        opacity: 0.8;

        filter: brightness(1.2);
      }

      &:active {
        opacity: 0.6;

        filter: brightness(1.4);
      }
    }
  }

  .header-form {
    transform: translate(20px, -10px);
  }

  .header-title::before {
    position: absolute;
    top: -10px;
    left: -20px;

    display: block;

    width: 45px;
    height: 45px;

    content: " ";

    background-image: url(~@/assets/images/containerbox/b4.png);
    background-size: 100% 100%;
  }

  .header-title {
    &.with-suffix-icon,
    &[with-suffix-icon] {
      &::after {
        display: inline-block;

        width: 15px;
        height: 12px;
        margin-left: 5px;

        content: "";

        background-image: url(~@/assets/images/containerbox/right-double.png);
        background-size: 100% 100%;
      }
    }
  }
}
</style>
