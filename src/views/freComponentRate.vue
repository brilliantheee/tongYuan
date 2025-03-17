
<template>
  <div class="container-box">
    <div class="header">
      <div class="header-warp">
        <div class="header-title">
          <span>压缩与重构结果</span>
        </div>
      </div>
    </div>
    <backgroundCard>
      <!-- 这里是主体内容 -->
      <div class="main-body">
        <div class="table-contain">
          <el-table :data="table" border style="width: 100%; margin-top: 10px"
            :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}"
            :header-cell-class-name="'header_name_style'" :cell-class-name="'tableCellClassName'">
            <el-table-column label="原始数据大小" prop="Data" width="auto" min-width="15%"> </el-table-column>
            <el-table-column label="压缩后数据大小" prop="CopData" width="auto" min-width="18%"> </el-table-column>
            <el-table-column label="压缩率" prop="CopRate" width="auto" min-width="18%"> </el-table-column>
            <el-table-column label="重构准确率" prop="CopAcc" width="auto" min-width="18%"> </el-table-column>
          </el-table>
        </div>
      </div>
    </backgroundCard>
  </div>
</template>
<script>
import backgroundCard from "@/components/backgroundCard/index.vue";
import { mapState } from "vuex";
export default {
  components: { backgroundCard },
  data() {
    return {
      tableData: [],
    };
  },

  computed: {
    ...mapState({
      table: (state) => state.data["compress_result"],
    }),
  },
  watch: {
  },
  methods: {
 
  },
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

    /* background-image: url(~@/assets/images/containerbox/b1.png); */
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
.main-body {
  width: 100%;
}
.table-contain {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
