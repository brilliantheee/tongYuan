<template>
  <div id="app">
    <div class="Views">
      <div class="buttom">
        <div class="buttomOne">
          <!-- <el-button
          class="common-button"
            type="primary"
            @click="sendImg"
           >重构模型训练</el-button
          >
          <el-button type="primary" @click="sendT">态势模型训练</el-button> -->
          <el-radio-group v-model="initData" size="mini">
            <el-radio-button label="chartOneData" @click="sendImg">重构模型训练</el-radio-button>
            <el-radio-button label="chartTwoData" @click="sendT">态势模型训练</el-radio-button>
          </el-radio-group>

        </div>
        <!-- <SourceDataInit /> -->
      </div>
      <div class="sourceEchart">
        <div class="buttomTwo">
          <div class="title">
            <span class="signtitle" v-if="sense===1">感知到信号</span>
            <span class="signtitle " v-else>未感知到信号</span>
            <span class="normaltitle " v-if="error===0">未发现异常</span>
            <span class="normaltitle " v-else>发现异常</span>
          </div>
          <el-radio-group v-model="chartOne" size="mini">
            <el-radio-button label="chartone">原始数据</el-radio-button>
            <el-radio-button label="charttwo">重构数据</el-radio-button>
          </el-radio-group>
        </div>
        <SourceData :type="chartOne" v-show="chartOne==='chartone'" />
        <SourceData :type="chartOne" v-show="chartOne==='charttwo'" />
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
      <div class="realTime">
        <Scatter />
        <div class="message-box1">
          <div class="message-title">执行进度</div>
          <div class="message-box">
            <div class="message-list" ref="messageList">
              <!-- 消息列表 -->
              <div v-for="(message, index) in messages" :key="index" class="message">
                {{ message }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="Analysis">
        <div class="SignalAnalysis">
          <SignalAnalysis />
        </div>
        <div class="Interfere">
          <Interfere />
        </div>
      </div>

      <!-- <div class="plan">
        <Scatter />
      </div> -->
      <div class="plan">
        <Reconsitution />
      </div>
    </div>
  </div>
</template>

<script>
  import SourceData from "@/components/SourceData";
  import SourceDataInit from "@/components/SourceDataInit";
  import { mapState, mapMutations } from "vuex";
  import SignalAnalysis from "@/components/SignalAnalysis";
  import Interfere from "@/components/Interfere";
  import PlanTabs from "@/components/PlanTabs";
  import Scatter from "@/components/Scatter";
  import Reconsitution from "@/components/Reconsitution";

  export default {
    name: "index",
    components: {
      Scatter,
      PlanTabs,
      Interfere,
      SignalAnalysis,
      SourceData,
      SourceDataInit,
      Reconsitution,
    },
    computed: {
      ...mapState({
        error: (state) => state.data["error"], // 映射 statspectrumDatae.data 到 
        sense: (state) => state.data["sense_result"],
        table: (state) => state.data["compress_result"],
        logger: (state) => state.data["logger"]

      }),
    },
    watch: {

      logger() {
        this.simulateWebSocket();
      },

    },
    methods: {
      sendImg() {
        const ws = new WebSocket("ws://192.168.45.151:8769");
        ws.onopen = function () {
          // 连接打开后发送指令
          ws.send("重构模型训练");
        };
      },
      sendT() {
        const ws = new WebSocket("ws://192.168.45.151:8769");
        ws.onopen = function () {
          // 连接打开后发送指令
          ws.send("态势模型训练");
        };
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
      showEchart() {
        this.chartOne = !this.chartOne
        console.log("sjjdsskdlddd", this.chartOne)
      },
      // 连接到 WebSocket
      //   connectWebSocket() {
      // this.socket = new WebSocket('ws://192.168.45.151:8769');

      // 接收到新消息时，处理消息
      //   this.socket.onmessage = (event) => {
      //     this.receiveMessage(event.data);
      //   };

      //   this.socket.onopen = () => {
      //   };

      //   this.socket.onerror = (error) => {
      //   };

      //   this.socket.onclose = () => {
      //   };
      // },
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

      ////

    },



    // created() {
    //   this.createWebsockets();
    // },
    //  methods: {
    // ...mapMutations(["updateData"]),
    // createWebsockets() {
    //   // let ws = new WebSocket("ws://192.168.132.151:8769");
    //   // let ws = new WebSocket("ws://192.168.132.187:8869");
    //   let ws = new WebSocket("ws://192.168.255.151:8769");
    //   // let ws = new WebSocket("ws://192.168.80.187:8869");
    //   // let ws = new WebSocket("ws://192.168.80.151:8769");
    //   //let ws = new WebSocket("ws://172.20.10.13:8769");
    //   ws.onopen = function () {
    //     console.log("WebSocket connected");
    //   };
    //   ws.onmessage = ({ data }) => {
    //     // console.log(data);
    //     let result = JSON.parse(data);
    //     // console.log(result, '信息')
    //     this.updateData(result);
    //   };
    //   ws.onerror = () => {
    //     setTimeout(() => this.createWebsockets(), 1000);
    //   };
    // },
    // },


    data() {
      return {
        chartOne: "chartone", //切换图1 图2
        initData: 'chartOneData',//切换重构模型训练 、态势模型训练
        isSign: 1, //是否感知信号
        isNomal: 1, //是否发现异常
        labels: ["原始数据大小", "压缩后数据大小", "压缩率", "重构准确率"],
        messages: [],       // 存储消息列表
        maxMessages: 20,    // 最多保留的消息条数
        socket: null,       // WebSocket 实例
      };
    }
  };
</script>

<style scoped lang="less">
  .Views {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    &>div {
      width: 100%;
    }

    margin: 0 auto;
  }

  .fixedHeight {
    height: 33.333vh;
    width: 100%;
  }

  .Analysis {
    top: 20px;
    width: 100%;
  }

  .SignalAnalysis {
    float: left;
    width: 62%;
  }

  .Interfere {
    float: left;
    width: 35%;
  }

  .plan {
    position: absolute;
    top: 0;

    left: 52%;
  }

  .common-button {
    width: 120px;
  }

  .buttom {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
  }

  .buttomTwo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-right: 1100px;
    margin-top: 10px;
    margin-left: 30px;
  }

  .normaltitle {
    display: inline-block;
    margin-left: 20px;
  }

  .buttomOne {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 30px;
  }

  .title {
    margin-left: 10px;
  }

  .table-contain {
    width: 840px;
    margin-left: 10px;
  }

  .message-box {
    width: 760px;
    height: 208px;
    overflow: hidden;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .message-box1 {
    width: 600px;
    margin-right: 280px;
    margin-top: 10px;
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #f9f9f9;
    max-height: 100%;
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
    font-size: 18px;
    font-weight: bold;
  }
</style>