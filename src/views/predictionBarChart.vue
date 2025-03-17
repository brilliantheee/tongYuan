
<template>
  <div class="container-box">
    <div class="header">
      <div class="header-warp">
        <div class="header-title">
          <span>预测柱状图</span>
        </div>
      </div>
    </div>
    <backgroundCard>
      <!-- 这里是主体内容 -->
      <div class="main-body">
        <div class="mainBar">
          <div class="message-box1">
            <div class="message-title">准确率</div>
            <div class="message-box">
              <div class="message-list" ref="messageList">
                <div
                  v-for="(message, index) in messages"
                  :key="index"
                  class="message"
                >
                  {{ message }}
                </div>
              </div>
            </div>
          </div>
          <div class="frequency">
            <div id="mychart" class="echart"></div>
          </div>
        </div>
      </div>
    </backgroundCard>
  </div>
</template>
<script>
import backgroundCard from "@/components/backgroundCard/index.vue";
import { mapState } from "vuex";
import * as echarts from "echarts";
export default {
  components: { backgroundCard },
  data() {
    return {
      pre1New: "",
      pre1: "",
      pre2: "",
      act1: "",
      act2: "",
      flag: 0,
      act1New: "",
      messages: [], // 存储消息列表
      maxMessages: 20, // 最多保留的消息条数
      point: [429, 610, 1389, 1521, 431, 609],
    };
  },
  computed: {
    ...mapState({
      //实际值
      actual_status: (state) => state.data["actual_status"],
      //预测值
      predict_status: (state) => state.data["predict_status"],
      //实际值
      actual_value: (state) => state.data["actual_value"],
      //预测值
      predict_value: (state) => state.data["predict_value"],
      accuracy2: (state) => state.data["accuracy2"],
    }),
  },
  watch: {
    actual_value() {
      this.flag = this.flag + 1;
      let arr1 = [];
      let arr2 = [];

      this.predict_status.forEach((item, index) => {
        if (item == 1) {
          arr1.push(5);
        } else {
          arr1.push(6);
        }
      });
      this.pre1New = arr1.map(() => 5);

      this.actual_status.forEach((item, index) => {
        if (item == 1) {
          arr2.push(5);
        } else {
          arr2.push(6);
        }
      });
      this.act1New = arr2.map(() => 5);
      if (this.flag > 40) {
        if (this.flag % 2 == 1) {
          this.pre2 = arr1;
          this.act1 = arr2;
          this.act2 = [];
        } else {
          this.pre1 = arr1;
          this.act2 = arr2;
          this.act1 = [];
        }
        this.initEcharts();
      } else {
        this.pre2 = [];
        this.act1 = arr2;
        this.act2 = [];
        this.pre1 = [];

        this.initEcharts();
      }
    },
    accuracy2() {
      this.simulateWebSocket();
    },
  },
  mounted() {
    let arr = [];
    this.predict_status.forEach((item, index) => {
      if (item == 1) {
        arr.push(5);
      } else {
        arr.push(6);
      }
    });
    this.pre1 = arr;
    this.pre2 = [];
    this.initEcharts();
  },
  methods: {
    simulateWebSocket() {
      // 模拟接收到的消息
      let newMessage = this.accuracy2;
      // 将新消息添加到消息数组的最前面
      this.messages.unshift(newMessage);

      // 如果消息数量超过最大值，删除最旧的消息
      if (this.messages.length > this.maxMessages) {
        this.messages.pop(); // 删除最旧的消息
      }
    },
    initEcharts() {
      //初始化图表
      let self = this;
      const myChart = echarts.init(document.getElementById("mychart"));

      // 基本柱状图
      const option = {
        legend: {
          selectedMode: false,
          top: "5%", // 将图例放置在顶部
          left: "center", // 居中对齐
        },
        grid: {
          left: 0,
          right: 10,
          top: 100,
          bottom: 18,
        },
        xAxis: {
          type: "category",
          data: this.point.map(String),
        },
        yAxis: {
          show: false,

          type: "value",
        },
        series: [
          {
            // 第一份数据的展示名称，此处为动态根据数据进行设置
            // 柱状图
            name: "预测值",
            type: "bar",
            bar: 0.2,
            // 使用上面配置的调色盘
            barWidth: "30%",
            label: {
              show: true,
              formatter: function (data) {
                const signalFlags = self.pre1[data.dataIndex]; // 或者是传入的其他变量
                return signalFlags === 6 ? "无信号" : "有信号";
              },
            },
            // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
            stack: "same",
            // 将处理好的第一份数据传入data
            // 数据格式为[1,2,3,4,....]
            itemStyle: {
              color: function (params) {
                return self.pre1[params.dataIndex] === 6
                  ? "#e9e6e6"
                  : "#5470c6"; // 无信号灰色，默认蓝色
              },
            },
            data: this.pre1New,
          },
          {
            // 第二份数据的展示名称，此处为动态根据数据进行设置
            name: "实际值",
            // 柱状图
            type: "bar",
            bar: 0.2,
            barWidth: "30%",
            label: {
              show: true,
              formatter: function (data) {
                const signalFlag = self.act1[data.dataIndex]; // 或者是传入的其他变量
                return signalFlag === 6 ? "无信号" : "有信号";
              },
            },
            // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
            stack: "same",
            itemStyle: {
              color: function (params) {
                return self.act1[params.dataIndex] === 6
                  ? "#e9e6e6"
                  : "#91cc75"; // 无信号灰色，默认绿色
              },
            },
            // 将处理好的第二份数据传入data
            data: this.act1New,
          },
        ],
      };
      myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>
<style scoped lang="less">
.container-box {
  height: 100%;
  width: 100%;
}
.mainBar {
  height: 100%;
  width: 82%;
}

.echart {
  width: 100%;
  height: 670px;
}

.message-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.message-box1 {
  position: relative;
  left: 535px;
  width: 120px;
  height: 100px;
  border-radius: 4px;
}
.message-list {
  overflow-y: auto;
  padding: 10px;
  background-color: #e9e6e6;
  max-height: 100%;
  height: 32px;
  border-radius: 4px;
}
.frequency {
  width: 655px;
  position: relative;
  bottom: 80px;
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
