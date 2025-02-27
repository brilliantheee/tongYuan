<template>
  <div class="PlanTabs fixedHeight">
    <el-tabs v-model="activeName" @tab-click="changeTabs">
      <el-tab-pane label="频谱态势预测" name="forecast" />
      <el-tab-pane label="异常检测" name="abnormal" />
      <!-- <el-tab-pane label="调制样式识别" name="planSphere" /> -->
    </el-tabs>
    <!--  预测  -->
    <div class="forecast" v-show="activeName == 'forecast'">
      <div class="frequency">
        <!-- <el-button v-for="index in 6" :key="index" @click="canShow(index)"
          >信号{{ index }}</el-button
        >
        <div class="pre">
          预测值:
          <p>{{ point == -1 ? predictValue[0] : predictValue[point - 1] }}</p>
        </div>
        <div class="act">
          实际值:
          <p>{{ point == -1 ? actualValue[0] : actualValue[point - 1] }}</p>
        </div> -->
        <!-- <el-button type="primary" style="margin-left: 20px" @click="toMap"
          >频谱地图</el-button
        > -->
        <!-- <div class="echart" id="mychart" :style="myChartStyle"></div> -->
        <div class="ww">
          <div id="mychart" class="echart"></div>
        </div>
        <!-- 表格 -->
        <!-- <el-table :data="signalData" height="337" border class="tabData">
          <el-table-column
            v-for="(item, index) in signTitle"
            :key="index"
            :type="index ? '' : 'index'"
            :label="item.title"
            :width="item.width || 'auto'"
            :prop="item.prop"
          >
          </el-table-column>
        </el-table> -->
      </div>
    </div>

    <div v-show="activeName==='forecast' "class="message-box1">
      <div class="message-title">准确率</div>
      <div class="message-box">
        <div class="message-list" ref="messageList">
          <!-- 消息列表 -->
          <div v-for="(message, index) in messages" :key="index" class="message">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
    <!--    异常检测    -->
    <div class="abnormal" v-show="activeName == 'abnormal'">
      <img :src="yolo_result" alt="" class="img" />
    </div>
    <!--    调制识别    -->
    <!-- <div class="planSphere" v-show="activeName == 'planSphere'">
      <img :src="psk_result" alt="" class="img" />
    </div> -->
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import * as echarts from "echarts";

  export default {
    name: "PlanTabs",
    data() {
      return {
        activeName: "forecast",
        pre1: "",
        pre2: "",
        act1: "",
        act2: "",
        flag: 0,
        messages: [],       // 存储消息列表
        maxMessages: 20,    // 最多保留的消息条数
        //实际值
        actualValue: [],
        // 预测值
        predictValue: [],
        //频点
        actualStatus: [],
        predictStatus: [],
        point: [429, 610, 1389, 1521, 431, 609],
        signTitle: [
          {
            title: "序号",
            prop: "",
            width: 80,
          },
          {
            title: "频点",
            prop: "point",
            width: 80,
          },
          {
            title: "预测状态",
            prop: "predictStatus",
            width: 80,
          },
          {
            title: "实际状态",
            prop: "actualStatus",
            width: 80,
          },
          {
            title: "预测值",
            prop: "predictValue",
          },
          {
            title: "实际值",
            prop: "actualValue",
          },
        ],
        signalData: [],
        myChartStyle: {
          float: "left",
          width: "100%",
          height: "400px",
        }, //图表样式
      };
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
    computed: {
      ...mapState({
        yolo_result: (state) => state.data["yolo_result"],
        psk_result: (state) => state.data["c_img"],
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
      // actual_status() {
      //   this.actualValue = [];
      //   this.predictValue = [];
      //   this.actualStatus = [];
      //   this.predictStatus = [];
      //   this.Rendering();

      //   //this.scrollToEnd();
      // },/
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

        this.actual_status.forEach((item, index) => {
          if (item == 1) {
            arr2.push(5);
          } else {
            arr2.push(6);
          }
        });
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
    methods: {
      toMap() {
        this.$router.push("/pmap");
      },
      simulateWebSocket() {
        // 模拟接收到的消息
        let newMessage = this.accuracy2;
        // 将新消息添加到消息数组的最前面
        this.messages.unshift(newMessage);

        // 如果消息数量超过最大值，删除最旧的消息
        if (this.messages.length > this.maxMessages) {
          this.messages.pop();  // 删除最旧的消息
        }

      },
      initEcharts() {
        //初始化图表
        const myChart = echarts.init(document.getElementById("mychart"));
        // 基本柱状图
        const option = {
          legend: {
            selectedMode: false,
          },
          grid: {
            left: 100,
            right: 100,
            top: 50,
            bottom: 50,
          },
          xAxis: {
            type: "category",
            data: this.point,
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
                  return data.value == 6 ? "无信号" : "有信号";
                },
              },
              // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
              stack: "same",
              // 将处理好的第一份数据传入data
              // 数据格式为[1,2,3,4,....]
              data: this.pre1,
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
                  return data.value == 6 ? "无信号" : "有信号";
                },
              },
              // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
              stack: "same",
              // 将处理好的第二份数据传入data
              data: this.act1,
            },
            {
              // 第二份数据的展示名称，此处为动态根据数据进行设置
              name: "预测值",
              // 柱状图
              type: "bar",
              bar: 0.2,
              barWidth: "30%",
              label: {
                show: true,
                formatter: function (data) {
                  return data.value == 6 ? "无信号" : "有信号";
                },
              },
              // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
              stack: "hom",
              // 将处理好的第二份数据传入data
              data: this.pre2,
            },
            {
              // 第二份数据的展示名称，此处为动态根据数据进行设置
              name: "实际值",
              // 柱状图
              type: "bar",
              barWidth: "30%",
              bar: 0.2,
              label: {
                show: true,
                formatter: function (data) {
                  return data.value == 6 ? "无信号" : "有信号";
                },
              },
              // 堆叠效果-两份数据配置同时使用相同的stack属性值即可
              stack: "hom",
              // 将处理好的第二份数据传入data
              data: this.act2,
            },
          ],
        };
        myChart.setOption(option);
        //随着屏幕大小调节图表
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      },
      // initEcharts() {
      //   let aa = this.predict_value;
      //   let a = [];
      //   aa.forEach((item, index) => {
      //     a[index] = item.toFixed(2);
      //   });
      //   // 基本柱状图
      //   const option = {
      //     xAxis: {
      //       data: this.point,
      //     },
      //     yAxis: {},
      //     series: [
      //       {
      //         type: "bar", //形状为柱状图
      //         data: a,
      //         label: {
      //           // 柱状图上方文本标签，默认展示数值信息
      //           show: true,
      //           position: "top",
      //         },
      //       },
      //     ],
      //   };
      //   const myChart = echarts.init(document.getElementById("mychart"));
      //   myChart.setOption(option);
      //   //随着屏幕大小调节图表
      //   window.addEventListener("resize", () => {
      //     myChart.resize();
      //   });
      // },
      Rendering() {
        let arr = [];
        this.actual_status.forEach((item, index) => {
          arr.push({
            point: this.point[index],
            predictStatus: this.predict_status[index] == 0 ? "无信号" : "有信号",
            actualStatus: item == 0 ? "无信号" : "有信号",
            predictValue: this.predict_value[index],
            actualValue: this.actual_value[index],
          });
        });
        this.signalData = arr;
        this.initEcharts();
        // this.predictValue.push(...this.predict_value);

        // setInterval(() => {
        //   this.actualValue.push(...this.actual_value);
        // }, 3000);
      },
      roundToTwo(num) {
        return parseFloat(num.toFixed(2));
      },
      canShow(index) {
        this.point = index;
      },
      setShow(item, index, type) {
        // console.log(item, '**')
        if (type == "blue") {
          if ((index >= 80 && item === 1) || index < 80) {
            console.log(item, index);
            return "blueTop";
          } else return "blueTop display";
        } else {
          if (index > 80 && item === 0) {
            return "redBottom";
          } else return "redBottom display";
        }
      },
    },
  };
</script>

<style scoped lang="less">
  .echart {
    width: 800px;
    height: 450px;
  }

  // .echart {
  //   &:before {
  //     content: "预测值";
  //     position: absolute;
  //     left: 70px;
  //     top: 100px;
  //   }

  //   &:after {
  //     content: "频点";
  //     position: absolute;
  //     right: 2px;
  //     bottom: 25px;
  //   }
  // }
  .line {
    border-top: 1px solid #878484;
    height: 0;
    width: 100;
    margin-top: 40px;
  }

  .PlanTabs {
    margin-top: 40px;
    margin-left: 40px;
    height: 350px;
    position: relative;
  }

  .forecast {
    width:710px // .topGroup,
    // .bottomGroup {
    //   position: relative;
    //   overflow-x: scroll;
    //   overflow-y: hidden;
    //   height: 130px;
    //   width: 20%;
    //   margin-left: 120px;
    // }
  }

  .tabData {
    width: 100%; //
  }

  .display {
    background: transparent !important;
  }

  .bottomGroup {
    margin-top: 70px;
    overflow-x: scroll;
  }

  .img {
    width: 700px;
    height: 400px;
    display: block;
    margin: 0 auto;
  }

  .specialRed {
    margin-top: 40px;

    .blueTop {
      background: #bf4449;
    }
  }

  .specialBlue {
    .redBottom {
      background: #2c806b;
    }
  }

  .specialCon {
    .redBottom {
      margin-top: 50px;
    }
  }

  .myTitle {
    position: absolute;
  }

  .bottomTitle {
    margin-top: 100px !important;
  }

  .abnormal {
    width: 40%;
  }

  .planSphere {
    width: 40%;
  }

  .message-box1 {
    position: absolute;
    right: 800px;
    bottom: 160px;
    width: 120px;
    margin-right: 280px;
    margin-top: 10px;
    height: 100px;
    color: 14px;
    border-radius: 4px;
  }

  .message-list {
    overflow-y: auto;
    padding: 10px;
    background-color: #f9f9f9;
    max-height: 100%;
    height: 32px;
    border-radius:4px
  }

  .message {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    background-color: #ffffff !important;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  .realTime {
    display: flex;
    flex-direction: row;
    align-items: center;
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
    font-size: 16px;
    font-weight: bold;
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
  }
</style>