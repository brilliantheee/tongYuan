<template>
  <div>
    <div style="position: relative; height: 100%">
      <div id="h">
        <!-- <span style="font-size: 35px; color: white; margin-bottom: 10px"
          >请您选择区域</span
        > -->

        <!-- <br />
        区域选择:<el-select
          name=""
          id="selectID"
          clearable
          size="mini"
          class="select_box"
          placeholder="请选择区域"
          v-model="selectedMenu"
          @change="change($event)"
        >
          <el-option
            v-for="option in menuOptions"
            :value="option.value"
            :key="option.id"
            id="opt"
          >
            区域{{ option.text }}
          </el-option>
        </el-select>
        经度范围:
        <el-input
          id="lng"
          size="mini"
          type="text"
          class="input_box"
          placeholder="请输入经度"
          :value="selectedMenu[1]"
        />
        纬度范围:
        <el-input
          id="lat"
          size="mini"
          type="text"
          class="input_box"
          placeholder="请输入纬度"
          :value="selectedMenu[2]"
        />
        <br /> -->
        <el-row>
          <span class="select_content">调制方式:</span>
          <el-select
            v-model="M"
            clearable
            class="select_box2"
            placeholder="请选择调制方式"
            size="mini"
          >
            <el-option
              v-for="item in modulationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="select_content">频段范围:</span>
          <el-select
            class="select_box2"
            v-model="F"
            clearable
            size="mini"
            placeholder="请选择频段范围"
          >
            <el-option
              v-for="item in bandLimitsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="select_content">带宽:</span>
          <el-select
            v-model="B"
            clearable
            size="mini"
            class="select_box2"
            :disabled="F === '' || F === null"
            placeholder="请选择带宽"
          >
            <el-option
              v-for="item in bandwidthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          <span class="select_content">载频:</span>
          <el-input
            id="lng"
            size="mini"
            type="text"
            class="select_box2"
            :disabled="F === '' || F === null"
            placeholder="请输入载频"
            @input="validateInput"
            v-model="FC"
          />
          <span v-if="firstError" class="errorMsg"
            >输入范围应在{{ 1920 + Bdict[B] }}-{{ 2025 - Bdict[B] }}之间</span
          >
          <span v-if="secoundError" class="errorMsg"
            >输入范围应在{{ 27.5 + Bdict[B] }}-{{ 31 - Bdict[B] }}之间</span
          >
          <span class="select_content">FFT 点数:</span>
          <el-select
            v-model="N"
            size="mini"
            class="select_box2"
            clearable
            placeholder="请选择FFT点数"
          >
            <el-option
              v-for="item in FFTOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select
          ><span class="select_content">信道:</span>
          <el-select
            v-model="C"
            size="mini"
            class="select_box2"
            clearable
            placeholder="请选择信道"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          <span class="select_content">存储路径:</span>
          <el-input
            size="mini"
            type="text"
            class="select_box2"
            placeholder="请输入存储路径"
            v-model="PATH"
          />
        </el-row>
        <!-- <div v-if="selectedMenu !== ''"> -->
        <div>
          <el-radio v-model="radio" label="1">压缩</el-radio>
          <el-radio v-model="radio" label="2">不压缩</el-radio>
          <button
            @click="openStop"
            :class="{ grayedOut: buttonStop }"
            v-if="radio !== ''"
          >
            确定
          </button>
          <!-- <button @click="openIndex" style="margin-left: 5px" v-if="buttonStop">
            查询
          </button> -->
          <div v-if="ys">
            <span>角度:{{ jiao_du }}</span>
            <span style="margin-left: 150px; font-size: 15px"
              >当前时间:{{ local_time }}</span
            >
          </div>
        </div>
      </div>
      <div id="cesiumContainer" style="height: 100%; width: 100%"></div>
      <div v-if="selectedSatellite" :style="popupStyle" class="satellite-popup">
        <p>卫星名称: {{ selectedSatellite.name }}</p>
        <p>时间: {{ local_time }}</p>
        <!-- <p>实时经度: {{ currentLongitude }}</p>
        <p>实时纬度: {{ currentLatitude }}</p> -->
        <p>实时经度: {{ longitudeAndLatitude[0][1] }}</p>
        <p>实时纬度: {{ longitudeAndLatitude[0][0] }}</p>
        <p>星历:</p>
        <p>{{ selectedSatellite.tleLine1 }}</p>
        <p>{{ selectedSatellite.tleLine2 }}</p>
        <p>信号方向：{{ direction[0][0] }},{{ direction[0][1] }}</p>

        <el-button :disabled="!ys" @click="openIndex">查询</el-button>
      </div>
      <!-- <div id="home">
        <Button @click="openHome">查看</Button>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as satellite from "satellite.js"; // 引入 satellite.js 库
import { mapState, mapMutations } from "vuex";
export default {
  name: "IndexMap",
  data() {
    return {
      viewer: null, // Cesium Viewer实例

      satelliteEntities: new Map(), // 存储卫星实体
      selectedSatellite: null, // 被选中的卫星
      popupPosition: { x: 0, y: 0 }, // 弹窗位置
      currentLongitude: null, // 实时经度
      currentLatitude: null, // 实时纬度
      radio: "",
      M: "1",
      F: "1",
      B: "1",
      N: "1",
      C: "1",
      FC: "",
      PATH:"",
      firstError: false,
      secoundError: false,
      buttonStop: false,
      index1: 0,
      index2: 1,
      inde: 0,
      selectedMenu: "",
      t: "",
      ys: false,
      Bdict: {
        1: 10,
        2: 20,
        3: 30,
        4: 40,
        5: 0.1,
        6: 0.2,
        7: 0.4,
      },
      menuOptions: [
        // 下拉菜单的选项
        { value: ["1", "110°~120°", "30°~34°"], text: "1" },
        { value: ["2", "1°~120°", "3°~3°"], text: "2" },
        { value: ["3", "11°~120°", "0°~4°"], text: "3" },
        { value: ["4", "110°~120°", "30°~34°"], text: "4" },
        { value: ["5", "110°~120°", "30°~34°"], text: "5" },
        { value: ["6", "110°~120°", "30°~34°"], text: "6" },
        { value: ["7", "110°~120°", "30°~34°"], text: "7" },
      ],
      modulationOptions: [
        { value: "1", label: "QPSK" },
        { value: "2", label: "16QAM" },
        { value: "3", label: "32QAM" },
        { value: "4", label: "64QAM" },
      ],
      bandLimitsOptions: [
        { value: "1", label: "1920-2025MHz" },
        { value: "2", label: "27.5-31GHz" },
      ],
      FFTOptions: [
        { value: "1", label: "128" },
        { value: "2", label: "256" },
        { value: "3", label: "512" },
        { value: "4", label: "1024" },
        { value: "5", label: "2048" },
        { value: "6", label: "4096" },
      ],
      channelOptions: [
        { value: "1", label: "瑞丽信道" },
        { value: "2", label: "莱斯信道" },
        { value: "3", label: "NTN TDL-C信道" },
      ],
    };
  },

  computed: {
    ...mapState({
      satellites: (state) => state.satellites, // 映射 state.data 到 spectrumData
      jiao_du: (state) => state.data["jiaodu"],
      direction: (state) => state.data["direction"],
      longitudeAndLatitude: (state) => state.data["location"],
      local_time: (state) => state.data["local_time"],
      quyu: (state) => state.data["quyu"],
    }),
    popupStyle() {
      return {
        position: "absolute",
        top: `${this.popupPosition.y}px`,
        left: `${this.popupPosition.x}px`,
        backgroundColor: "green",
        padding: "10px",
        border: "1px solid black",
        zIndex: 10,
        width: "300px", // 固定宽度为300px
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // 添加阴影效果
      };
    },
    bandwidthOptions() {
      if (this.F === "1") {
        this.FC = "";
        this.firstError = false;
        this.secoundError = false;
        return [
          { value: "1", label: "10MHz" },
          { value: "2", label: "20MHz" },
          { value: "3", label: "30MHZ" },
          { value: "4", label: "40MHz" },
        ];
      } else if (this.F === "2") {
        this.FC = "";
        this.firstError = false;
        this.secoundError = false;
        return [
          { value: "5", label: "100MHZ" },
          { value: "6", label: "200MHz" },
          { value: "7", label: "400MHZ" },
        ];
      } else {
        this.B = "";
        this.FC = "";
        this.firstError = false;
        this.secoundError = false;
      }
    },
  },

  mounted() {
    // 初始化Cesium Viewer
    this.initCesium();
    // // 加载卫星数据
    // this.loadSatellites();
    // // 设置点击事件监听器
    // this.setClickHandler();
    // 假设接收到的后台数据
    // const backendData = {
    //   satelliteId: 2,
    //   direction: 180,
    // };
    // // 调用方法高亮对应卫星轨迹并更新视角
    // this.highlightSatellite(backendData.satelliteId, backendData.direction);
  },

  methods: {
    validateInput() {
      let number = parseInt(this.FC);
      //重置错误信息状态
      this.firstError = false;
      this.secoundError = false;
      if (this.F === "1") {
        if (number < 1920 || number > 2025) {
          this.firstError = true;
          this.secoundError = false;
        }
      } else if (this.F === "2") {
        if (number < 27.5 || number > 31) {
          this.firstError = false;
          this.secoundError = true;
        }
      }
    },
    ...mapMutations(["updateData", "addSatellites"]),
    initCesium() {
      // 配置Cesium资源路径
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Yzk5N2EzYi00NmVkLTQ5MzQtYWVjNy1iMWNlMzg1MjkwMTIiLCJpZCI6MTU3MDcxLCJpYXQiOjE2OTA1NTAwODl9.bnoI1f8fbtPOgGjyi0sXPY1iimv32O9XtRGGv4xCpKA";

      // 初始化Cesium Viewer
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: true, // 启用二三维视图切换控件
        timeline: true, // 启用时间线控件
        animation: true, // 启用动画控件
        navigationHelpButton: false,
        infoBox: false,
        scene3DOnly: false,
      });

      // 隐藏版权信息
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      let localDate = new Date();
      localDate.setHours(localDate.getHours() + 8);
      // 设置动画速度和时间范围
      const start = Cesium.JulianDate.fromDate(localDate);
      const stop = Cesium.JulianDate.addMinutes(
        start,
        120,
        new Cesium.JulianDate()
      );

      this.viewer.clock.startTime = start.clone();
      this.viewer.clock.stopTime = stop.clone();
      this.viewer.clock.currentTime = start.clone();
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      this.viewer.clock.multiplier = 30;
      this.viewer.clock.shouldAnimate = true; // 启动时间动画
      this.viewer.timeline.zoomTo(start, stop);

      this.viewer.clock.onTick.addEventListener(this.updateSatellitePositions);
    },

    loadSatellites() {
      this.satellites.forEach((satelliteData) => {
        const satrec = satellite.twoline2satrec(
          satelliteData.tleLine1,
          satelliteData.tleLine2
        );
        this.calculateAndDrawSatellitePath(
          satelliteData.id,
          satrec,
          satelliteData.time,
          satelliteData.seconds
        );
      });
    },

    openIndex() {
      this.$router.push("/indexNew");
    },
    openStop() {
      this.validateInput();
      //判断如果不合法，不提交
      if (this.firstError || this.secoundError) {
        return;
      }
      let firstEnter = true;
      this.buttonStop = true;
      const ws = new WebSocket("ws://192.168.240.151:8769");
      let radios = this.radio;
      this.ys = true;
      ws.onopen = () => {
        console.log(radios);
        let parmas = {
          M: this.M,
          F: this.F,
          B: this.B,
          N: this.N,
          C: this.C,
          A: this.selectedMenu[0],
          FC: this.FC,
          CD: true,
          PATH:this.PATH
        };
        if (radios == 1) {
          parmas.CD = true;
          ws.send(JSON.stringify(parmas));
        } else {
          parmas.CD = false;
          ws.send(JSON.stringify(parmas));
        }
      };
      ws.onmessage = (event) => {
        //console.log(data);
        let result = JSON.parse(event.data);
        //let result = event.data;
        console.log("result :>> ", result);
        this.updateData(result);
        if (firstEnter) {
          //记录卫星
          this.addSatellites(result);
          this.updateCesium(result);
          // 加载卫星数据
          this.loadSatellites();
          // 设置点击事件监听器
          this.setClickHandler();
          // 假设接收到的后台数据
          const backendData = {
            satelliteId: result.ID[0],
            direction: 180,
          };
          // 调用方法高亮对应卫星轨迹并更新视角
          this.highlightSatellite(
            backendData.satelliteId,
            backendData.direction
          );
          firstEnter = false;
        }
      };
      // ws.onmessage = function (event) {
      //   // 处理Python返回的响应
      //   console.log(event.data);
      // };
      ws.onerror = () => {
        setTimeout(() => this.openStop(), 1000);
      };
      ws.onclose = function () {
        // 关闭WebSocket连接
        console.log("Connection closed");
      };
    },
    updateCesium(result) {
      let localDate = new Date(result.local_time.replace(" ", "T"));

      localDate.setHours(localDate.getHours() + 8);
      // 设置动画速度和时间范围
      const start = Cesium.JulianDate.fromDate(localDate);
      // const stop = Cesium.JulianDate.addMinutes(
      //   start,
      //   120,
      //   new Cesium.JulianDate()
      // );
      const stop = Cesium.JulianDate.addSeconds(
        start,
        result.last_time,
        new Cesium.JulianDate()
      );

      this.viewer.clock.startTime = start.clone();
      this.viewer.clock.stopTime = stop.clone();
      this.viewer.clock.currentTime = start.clone();
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      this.viewer.clock.multiplier = 30;
      this.viewer.clock.shouldAnimate = true; // 启动时间动画
      this.viewer.timeline.zoomTo(start, stop);
    },
    calculateAndDrawSatellitePath(id, satrec, time, seconds) {
      const positions = [];
      // const now = Cesium.JulianDate.now();

      const now = Cesium.JulianDate.fromDate(new Date(time.replace(" ", "T")));

      const adjustedTime = Cesium.JulianDate.addHours(
        now,
        8,
        new Cesium.JulianDate()
      );

      const positionProperty = new Cesium.SampledPositionProperty();

      for (let i = 0; i <= seconds; i++) {
        const time = Cesium.JulianDate.addSeconds(
          adjustedTime,
          i,
          new Cesium.JulianDate()
        );
        const positionAndVelocity = satellite.propagate(
          satrec,
          Cesium.JulianDate.toDate(time)
        );
        const positionEci = positionAndVelocity.position;

        if (positionEci) {
          const gmst = satellite.gstime(Cesium.JulianDate.toDate(time));
          const positionGd = satellite.eciToGeodetic(positionEci, gmst);
          const longitude = Cesium.Math.toDegrees(positionGd.longitude);
          const latitude = Cesium.Math.toDegrees(positionGd.latitude);
          const height = positionGd.height * 1000;

          const cartesianPosition = Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            height
          );
          positions.push(cartesianPosition);
          positionProperty.addSample(time, cartesianPosition);
        }
      }

      const polyline = this.viewer.entities.add({
        id: `polyline_${id}`,
        polyline: {
          positions: positions,
          width: 2,
          material: Cesium.Color.fromCssColorString("#FFF").withAlpha(1),
        },
      });

      this.satelliteEntities.set(id, {
        satrec: satrec,
        positions: positions,
        marker: this.viewer.entities.add({
          id: `marker_${id}`,
          position: positionProperty,
          model: {
            uri: "./wx.gltf", // 模型文件路径
            minimumPixelSize: 64, // 模型的最小像素大小
          },
          orientation: new Cesium.VelocityOrientationProperty(positionProperty), // 自动根据位置计算方向
        }),
      });
    },

    updateSatellitePositions() {
      const now = this.viewer.clock.currentTime;
      this.satellites.forEach((satelliteData) => {
        const satEntity = this.satelliteEntities.get(satelliteData.id);
        if (!satEntity) return;
        const { satrec, marker } = satEntity;
        const positionAndVelocity = satellite.propagate(
          satrec,
          Cesium.JulianDate.toDate(now)
        );
        const positionEci = positionAndVelocity.position;
        if (positionEci) {
          const gmst = satellite.gstime(Cesium.JulianDate.toDate(now));
          const positionGd = satellite.eciToGeodetic(positionEci, gmst);
          const longitude = Cesium.Math.toDegrees(positionGd.longitude);
          const latitude = Cesium.Math.toDegrees(positionGd.latitude);
          const height = positionGd.height * 1000;

          const newPos = Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            height
          );
          marker.position = newPos;

          if (
            this.selectedSatellite &&
            this.selectedSatellite.id === satelliteData.id
          ) {
            this.updatePopupPosition(newPos);
            this.currentLongitude = longitude.toFixed(2);
            this.currentLatitude = latitude.toFixed(2);
          }
        }
      });
    },

    setClickHandler() {
      const handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      handler.setInputAction((click) => {
        const pickedObject = this.viewer.scene.pick(click.position);
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.id &&
          pickedObject.id.id
        ) {
          const satelliteId = pickedObject.id.id.split("_")[1];
          const satEntity = this.satelliteEntities.get(Number(satelliteId));
          if (satEntity) {
            this.selectedSatellite = this.satellites.find(
              (sat) => sat.id === Number(satelliteId)
            );
            const position = satEntity.marker.position.getValue(
              this.viewer.clock.currentTime
            );
            this.updatePopupPosition(position);
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            this.currentLongitude = Cesium.Math.toDegrees(
              cartographic.longitude
            ).toFixed(2);
            this.currentLatitude = Cesium.Math.toDegrees(
              cartographic.latitude
            ).toFixed(2);
          }
        } else {
          this.selectedSatellite = null;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    updatePopupPosition(cartesian3) {
      const canvasPosition =
        this.viewer.scene.cartesianToCanvasCoordinates(cartesian3);
      if (Cesium.defined(canvasPosition)) {
        this.popupPosition = { x: canvasPosition.x, y: canvasPosition.y };
      }
    },

    highlightSatellite(satelliteId, direction) {
      const satEntity = this.satelliteEntities.get(satelliteId);
      satEntity.marker.model.color = Cesium.Color.RED;
      const polyline = this.viewer.entities.getById(`polyline_${satelliteId}`);

      if (polyline) {
        polyline.polyline.material =
          Cesium.Color.fromCssColorString("#0de1cd").withAlpha(1);
        polyline.polyline.width = 4;
      }
    },
  },
};
</script>

<style>
#cesiumContainer {
  height: 100%;
}

.select_box {
  width: 160px;
  margin-bottom: 15px;
}
.select_box2 {
  width: 135px;
  margin-bottom: 15px;
  margin-right: 5px;
}
.select_content {
  width: 70px;
  text-align: right;
  display: inline-block;
}
.errorMsg {
  position: absolute;
  color: red;
  top: 28px;
  left: 30px;
  font-size: 14px;
}
.input_box {
  width: 120px;
  margin-bottom: 15px;
}
.satellite-popup {
  position: absolute;
  width: 300px;
  padding: 10px;
  border: 2px solid black;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #99b7ee !important;
  color: #fff;
}

.satellite-popup p {
  margin: 5px 0;
}
#home {
  padding: 7px 10px;
  position: fixed;
  top: 0px;
  right: 40px;
  width: 70px;
  background: #000;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  border-radius: 7px;
  z-index: 99;
}
#h {
  padding: 7px 10px;
  position: fixed;
  top: 0px;
  left: 10px;
  width: 650px;
  background: #000;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  border-radius: 7px;
  z-index: 99;
  color: white;
}
</style>
