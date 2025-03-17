
<template>
  <div class="container-box">
    <div class="header">
      <div class="header-warp">
        <div class="header-title">
          <span>时频图数据</span>
        </div>
      </div>
    </div>
    <backgroundCard>
      <!-- 这里是主体内容 -->
      <div class="main-body">

        <div class="fixedHeight">
          <el-table :data="tableData" height="330" border class="tabData">
            <el-table-column
              v-for="(item, index) in tabTitle"
              :key="index"
              :type="index ? '' : 'index'"
              :label="item.title"
              :width="item.width || 'auto'"
              :prop="item.prop"
            >
            </el-table-column>
            <el-table-column
              v-for="(item, index) in freTitle"
              :key="index"
              :prop="item.title"
              :label="item.title"
            >
              <template slot-scope="scope">
                <div :style="{ color: scope.row.Status == '正常' ? 'black' : 'red' }">
                  {{ scope.row.Status }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in nottit"
              :key="index"
              :label="item.title"
              :prop="item.prop"
            >
            </el-table-column>
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
      tabTitle: [
        {
          title: "序号",
          prop: "",
          width: 80,
        },
        {
          title: "中心频率/MHz",
          prop: "centerFrequency",
        },
        {
          title: "带宽/kHz",
          prop: "bandwidth",
        },
        {
          title: "频段不可用/KHz",
          prop: "exists_signal",
        },
        {
          title: "峰值功率",
          prop: "peakpower",
        },
      ],
      tableData: [],
    };
  },

  computed: {
    ...mapState({
      bandwidth: (state) => state.data["bandwidth"],
      //   symbolrates: (state) => state.data["symbolrates"],
      centerFrequency: (state) => state.data["centerfrequency"],
      //   peakPower: (state) => state.data["peakpower"],
      //   constellations: (state) => state.data["constellations"],
      exists_signal: (state) => state.data["exists_signal"],
      Not_exists_signal: (state) => state.data["Not_exists_signal"],
      Status: (state) => state.data["Status"],
    }),
  },
  watch: {
    exists_signal() {
      this.ProcessingData();
    },
  },
  methods: {
    ProcessingData() {
      let arr = [];
      this.bandwidth.forEach((item, index) => {
        arr.push({
          bandwidth: item,
          centerFrequency: this.centerFrequency[index],
          //   peakPower: this.peakPower[index],
          //   symbolrates: this.symbolrates[index],
          //   constellations: this.constellations[index],
          exists_signal:
            this.exists_signal[index][0] + "~" + this.exists_signal[index][1],
          Not_exists_signal:
            this.Not_exists_signal[index][0] +
            "~" +
            this.Not_exists_signal[index][1],
          Status:
            this.Status[index] == 0
              ? this.Status[index] == 2
                ? "宽带干扰"
                : "窄带干扰"
              : "正常",
        });
      });
      this.tableData = arr;
    },
    getColor(value) {
      return value == "正常" ? "black" : "red";
    },
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
</style>
