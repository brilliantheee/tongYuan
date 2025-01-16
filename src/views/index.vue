<template>
  <div id="app">
    <div class="Views">
      <el-button
        type="primary"
        style="margin-left: 30px; margin-top: 15px"
        @click="sendImg"
        >重构模型训练</el-button
      >
      <el-button type="primary" @click="sendT">态势模型训练</el-button>
      <!-- <SourceDataInit /> -->
      <SourceData />
      <Scatter />
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
// import { mapMutations } from "vuex";
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
  //},
};
</script>

<style scoped lang="less">
.Views {
  position: relative;
  width: 100%; //*****************************************
  //display: flex;
  //justify-content: space-between;
  //flex-wrap: wrap;
  & > div {
    width: 100%;
  }

  margin: 0 auto;
}

.fixedHeight {
  //height: 33.333vh;
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
</style>
