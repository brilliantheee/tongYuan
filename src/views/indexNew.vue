<template>
  <div class="Views">
    <div class="topClass">
      <div class="topMemu">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">信号数据处理</el-menu-item>
          <el-menu-item index="2">数据提取</el-menu-item>
        </el-menu>

        <div class="line"></div>
      </div>
      <div class="topSpeed">
        <div class="message-title">执行进度</div>
        <div class="message-box">
          <!-- <div class="message-list" ref="messageList">
              <div v-for="(message, index) in messages" :key="index" class="message">
                {{ message }}
              </div>
            </div> -->
        </div>
      </div>
    </div>
    <div v-if="!showPage">
      <!-- 信号生成 -->
      <div class="item-wrap item-wrap--signalGeneration">
        <signalGeneration />
      </div>
      <!-- 异常检查 -->
      <div class="item-wrap item-wrap--anomalyDetection">
        <anomalyDetection />
      </div>
      <!-- 压缩与重构 -->
      <div class="item-wrap item-wrap--compressionAReconstruction">
        <compressionAReconstruction />
      </div>
      <!-- 重构时频图 -->
      <div class="item-wrap item-wrap--timeFrequencyGraph">
        <timeFrequencyGraph />
      </div>
      <!-- 时频图数据 -->
      <div class="item-wrap item-wrap--frequencyGraphData">
        <frequencyGraphData />
      </div>
    </div>
    <div v-else>
      <!-- 干扰类型检测-->
      <div class="item-wrap item-wrap--typeDetection">
        <typeDetection />
      </div>
      <!-- 异常检测-->
      <div class="item-wrap item-wrap--unnormalDetection">
        <unnormalDetection />
      </div>
      <!-- 预测柱状图-->
      <div class="item-wrap item-wrap--predictionBarChart">
        <predictionBarChart />
      </div>
    </div>
  </div>
</template>
<script>
import signalGeneration from "./signalGeneration.vue";
import anomalyDetection from "./anomalyDetection";
import compressionAReconstruction from "./compressionAReconstruction";
import timeFrequencyGraph from "./timeFrequencyGraph";
import frequencyGraphData from "./frequencyGraphData";
import typeDetection from "./typeDetection";
import unnormalDetection from "./unnormalDetection";
import predictionBarChart from "./predictionBarChart";
export default {
  name: "indexNew",
  components: {
    signalGeneration,
    anomalyDetection,
    compressionAReconstruction,
    timeFrequencyGraph,
    frequencyGraphData,
    typeDetection,
    predictionBarChart,
    unnormalDetection,
  },
  computed: {},

  methods: {
    handleSelect(key, keyPath) {
      if (key === "2") {
        this.showPage = true;
      } else if (key === "1") {
        this.showPage = false;
      }
    },
  },

  data() {
    return {
      activeIndex: "1",
      showPage: false,
    };
  },
};
</script>

<style scoped lang="less">
.Views {
  width: 100%;
  height: 100%;
  background-color: rgb(219, 214, 214);
  margin: 0 auto;
  .topClass {
    display: flex;
    align-items: center;
  }
}

.topMemu {
  width: 45%;
}
.topSpeed {
  width: 55%;
  height: 60.98px;
  background-color: rgba(243, 98, 98, 0.077);
}

.item-wrap {
  position: absolute;
  &--signalGeneration {
    top: 9.0926vh;
    left: 80px;
    width: 590px;
    height: 32.5926vh;
  }
  &--typeDetection {
    top: 9.0926vh;
    left: 120px;
    width: 750px;
    height: 36.5926vh;
  }
  &--unnormalDetection {
    top: 53.0926vh;
    left: 120px;
    width: 750px;
    height: 39.5926vh;
  }
  &--predictionBarChart {
    top: 9.0926vh;
    right: 141px;
    width: 690px;
    height: 83.5926vh;
  }
  &--anomalyDetection {
    top: 10.0926vh;
    right: 141px;
    width: 860px;
    height: 24.5926vh;
  }
  &--compressionAReconstruction {
    top: 47.0926vh;
    left: 79px;
    width: 650px;
    height: 20.5926vh;
  }
  &--timeFrequencyGraph {
    top: 74.0926vh;
    left: 79px;
    width: 650px;
    height: 20.5926vh;
  }
  &--frequencyGraphData {
    top: 42.0926vh;
    right: 141px;
    width: 860px;
    height: 52.5926vh;
  }
}
</style>