<template>
  <div class="Views">
    <div class="topClass">
      <div class="topMemu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">信号数据处理</el-menu-item>
          <el-menu-item index="2">数据提取</el-menu-item>
        </el-menu>

        <div class="line"></div>
      </div>
      <div class="topSpeed">
        <div class="message-title">执行进度</div>
        <div class="message-box">
          <div class="message-list" ref="messageList">
            <div v-for="(message, index) in messages" :key="index" class="message">
              {{ message }}
            </div>
          </div>
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
      <!-- 压缩重构率 -->
      <div class="item-wrap item-wrap--freComponentRate">
        <freComponentRate />
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
  import freComponentRate from "./freComponentRate";
  import typeDetection from "./typeDetection";
  import unnormalDetection from "./unnormalDetection";
  import predictionBarChart from "./predictionBarChart";
  import { mapState, mapMutations } from "vuex";
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
      freComponentRate
    },
    computed: {
      ...mapState({
        logger: (state) => state.data["logger"]

      }),
    },
    watch: {
      logger() {
        this.simulateWebSocket();
      },

    },

    methods: {
      handleSelect(key, keyPath) {
        if (key === "2") {
          this.showPage = true;
        } else if (key === "1") {
          this.showPage = false;
        }
      },

      // 模拟 WebSocket 消息推送
      simulateWebSocket() {
        // 模拟接收到的消息
        let newMessage = this.logger;
        // 将新消息添加到消息数组的最前面
        this.messages.unshift(newMessage);

        // 如果消息数量超过最大值，删除最旧的消息
        if (this.messages.length > this.maxMessages) {
          this.messages.pop();  // 删除最旧的消息
        }

      },

      // 处理接收到的新消息
      receiveMessage(newMessage) {
        if (this.messages.length >= this.maxMessages) {
          this.messages.pop();  // 删除最旧的消息
        }
        this.messages.unshift(newMessage);  // 新消息放到最前面
        this.scrollToTop();  // 滚动到顶部
      },

      // 滚动到最新消息
      scrollToTop() {
        this.$nextTick(() => {
          const messageList = this.$refs.messageList;
          messageList.scrollTop = 0; // 保证滚动条在最上面
        });
      },
    },

    data() {
      return {
        activeIndex: "1",
        showPage: false,
        messages: [],       // 存储消息列表
        maxMessages: 1,    // 最多保留的消息条数
      };
    },
  };
</script>

<style scoped lang="less">
  .Views {
    width: 100%;
    height: 100%;
    background-color: rgba(76, 165, 253, 0.1);
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
    line-height: 60.98px;
    background-color: rgba(255, 255, 255);
  }

  .item-wrap {
    position: absolute;

    &--signalGeneration {
      top: 9.0926vh;
      left: 80px;
      width: 650px;
      height: 23.5926vh;
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
      top: 9.0926vh;
      right: 141px;
      width: 860px;
      height: 23.5926vh;
    }

    &--compressionAReconstruction {
      top: 38.0926vh;
      left: 79px;
      width: 650px;
      height: 24.5926vh;
    }

    &--timeFrequencyGraph {
      top: 69.0926vh;
      left: 79px;
      width: 650px;
      height: 22.5926vh;
    }

    &--frequencyGraphData {
      top: 60.0926vh;
      right: 141px;
      width: 860px;
      height: 36.5926vh;
    }

    &--freComponentRate {
      top: 38.0926vh;
      right: 141px;
      width: 860px;
      height: 16.5926vh;
    }

  }

  .message-list::-webkit-scrollbar {
    width: 8px;
  }

  .message-list::-webkit-scrollbar-thumb {
    background-color: #bdbdbd;
    border-radius: 4px;
  }

  .message-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .message-title {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
  }

  .message-box {
    width: 760px;
    overflow: hidden;
    border: 1px solid #ccc;
    display: flex;
    margin-left: 10px;
    flex-direction: column;
    background-color: #f9f9f9;
    border-radius: 10px;
    height: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-y: hidden !important;
  }

  .message-box1 {
    width: 600px;
    height: 45px;
    margin-right: 280px;
    margin-top: 10px;
  }

  .message-list {
   
    overflow-y: hidden;
    padding: 5px;
    background-color: #f9f9f9;
    max-height: 100%;
  }

  .message {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 2px;
    border-radius: 5px;
    background-color: #ffffff !important;
    border-radius: 8px;
    border: 1px solid #ddd;
    height: 15px;
  }
  .topSpeed {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>