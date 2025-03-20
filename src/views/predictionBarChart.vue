
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
          <div class="actual_text">
            <span>实际占用情况</span>
          </div>
          <div class="predict_text">
            <span>2秒前预测占用情况</span>
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
      // 显示6条柱子
      // point: [429, 610, 1389, 1521, 431, 609],
      // 显示3条柱子
      point: [429, 431, 609],
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
      let self = this;
      const myChart = echarts.init(document.getElementById("mychart"));
      // 根据数据长度动态设置右侧内边距
      const rightPadding = this.point.length === 3 ? 20 : 10;
      const option = {
        legend: {
          selectedMode: false,
          top: "5%",
          left: "center",
          // 指定图例显示顺序为：实际值、预测值、无信号
          data: ["实际值", "预测值", "无信号"],
        },
        grid: {
          left: 20,
          right: 0,
          top: 100,
          bottom: 18,
        },
        xAxis: {
          type: "category",
          data: this.point.map((_, index) => "频点" + (index + 1)),
          axisLabel: {
            formatter: function (value) {
              // 用富文本样式 "pad" 包裹文本
              return "{pad|" + value + "}";
            },
            rich: {
              pad: {
                // 动态设置 padding: [上, 右, 下, 左]
                padding: [0, rightPadding, 0, 0],
              },
            },
          },
        },

        yAxis: {
          show: false,
          type: "value",
        },
        series: [
          {
            name: "实际值",
            type: "bar",
            barWidth: "30%",
            label: {
              show: true,
              formatter: function (data) {
                return self.act1[data.dataIndex] === 6 ? "无信号" : "有信号";
              },
            },
            stack: "same",
            itemStyle: {
              color: function (params) {
                return self.act1[params.dataIndex] === 6
                  ? "#e9e6e6"
                  : "#91cc75";
              },
            },
            data: this.act1New,
          },
          {
            name: "预测值",
            type: "bar",
            barWidth: "30%",
            label: {
              show: true,
              formatter: function (data) {
                return self.pre1[data.dataIndex] === 6 ? "无信号" : "有信号";
              },
            },
            stack: "same",
            itemStyle: {
              color: function (params) {
                return self.pre1[params.dataIndex] === 6
                  ? "#e9e6e6"
                  : "#5470c6";
              },
            },
            data: this.pre1New,
          },
          // 将虚拟系列“无信号”放到最后
          {
            name: "无信号",
            type: "bar",
            data: this.point.map(() => null),
            itemStyle: {
              color: "#e9e6e6", // 图例颜色为 #e9e6e6
            },
            tooltip: { show: false },
            silent: true,
            animation: false,
          },
        ],
      };

      myChart.setOption(option);
      // 随着屏幕大小调整图表
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
.actual_text {
  position: relative;
  bottom: 628px;
}
.actual_text span {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
.predict_text {
  position: relative;
  bottom: 460px;
}
.predict_text span {
  writing-mode: vertical-rl;
  text-orientation: upright;
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
</style>
