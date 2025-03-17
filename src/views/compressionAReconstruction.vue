<template>
  <div class="container-box">
    <div class="header">
      <div class="header-warp">
        <div class="header-title">
          <span>压缩与重构</span>
        </div>
      </div>
    </div>
    <backgroundCard>
      <!-- 这里是主体内容 -->
      <div class="main-body">
        <div class="SourceData" ref="source"></div>
      </div>
    </backgroundCard>
  </div>
</template>
<script>
  import backgroundCard from "@/components/backgroundCard/index.vue";
  import * as echarts from "echarts";
  import { mapState } from "vuex";
  export default {
    components: { backgroundCard },
    mounted() {
      this.init();
      this.draw();
    },
    computed: {
      ...mapState({
        spectrum: (state) => state.data["spectrumdata"],
        reconstruction: (state) => state.data["reconstruction_data"]    
      }),
    },

    watch: {
      spectrum() {
        this.draw();
        if (this.load) this.load = false;
      },
      reconstruction() {
        this.draw();
        if (this.load) this.load = false;
      },
    },
    data() {
      return {
        myChart: {},
        dataOne: [122],
        dataTwo: [122],
        myDataOne: [],
        myDataTwo: [],
        option: {},
        flag: 0,
        load: true,
      };
    },

    methods: {
      init() {
        this.myChart = echarts.init(this.$refs.source);
      },
      draw(flag) {
        let data;
        let mydata;
        let myDataTwo;
        let dataTwo;
        this.myDataOne = this.spectrum;
        this.myDataTwo = this.reconstruction;
        this.dataOne = [];
        this.dataTwo = [];
        this.myDataOne.forEach((item, index) => {
          this.dataOne.push(2170 + 0.01 * index);
        });
        this.myDataTwo.forEach((item, index) => {
          this.dataTwo.push(2170 + 0.01 * index);
        })
        data = this.dataOne
        dataTwo = this.dataTwo
        mydata = this.myDataOne
        myDataTwo = this.myDataTwo
    
        this.option = {
          tooltip: {
            trigger: "axis",
            position: function (pt) {
              return [pt[0], "10%"];
            },
          },
          legend: {
            data: ['原始','重构'],
            top: '10%',  // 可根据需求调整位置
          },
          grid: {
            left: '10%',   // 图表区域距离容器左侧10%
            right: '12%',  // 图表区域距离容器右侧10%
            top: '20%',    // 图表区域距离容器顶部20%，避免和图例重叠
            bottom: '10%'  // 图表区域距离容器底部10%
          },
          // title: {
          //     left: 'center',
          //     text: '图标名称',
          // },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              name: '频率 (MHz)', // 横坐标标题
              nameLocation: 'end',  // 横坐标标题放在右边
              nameTextStyle: {
                fontSize: 12, // 字体大小
                color: '#333', // 字体颜色
              },
              nameGap: 5,
              data: data,
            },
          ],
          yAxis: {
            type: "value",
            boundaryGap: ["20%", "20%"],
            name: '谱密度 (dBm)', // 纵坐标标题
            nameLocation: 'end',  // 纵坐标标题放在上方
            nameTextStyle: {
              fontSize: 12, // 字体大小
              color: '#333', // 字体颜色
            },
            nameGap: 10,

            min: -120, // 起始
            max: -90, // 终
            // min: Math.min(...mydata) - 10,  // 自动计算y轴的最小值
            // max: Math.max(...mydata) + 10,  // 自动计算y轴的最大值
          },
          // dataZoom: [{
          //     type: 'inside',
          //     start: 0,
          //     end: 10
          // }, {
          //     start: 0,
          //     end: 10
          // }],
          series: [
            {
              name: "原始",
              type: "line",
              symbol: "none",
              sampling: "lttb",
              itemStyle: {
                color: "rgb(255, 70, 131)",
              },
              data: mydata,
            },
            {
              name: "重构",
              type: "line",
              symbol: "none",
              sampling: "lttb",
              itemStyle: {
                color: "rgb(0, 0, 255)", // 使用RGB值
              },
              data: myDataTwo,
            },
          ],
        };
        this.myChart.setOption(this.option, true);
      },
    },
  };
</script>
<style scoped lang="less">
  .container-box {
    height: 100%;
    width: 100%;
  }

  .container-box>.header {
    .header-warp {
      position: relative;

      display: flex;
      align-items: center;
      justify-content: space-between;

      width: calc(100% - 60px);
      height: 30px;
      margin-left: 30px;
/* 
      background-image: url(~@/assets/images/containerbox/b1.png); */
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
        transition: opacity .3s ease, filter .3s ease;

        &:hover {
          opacity: .8;

          filter: brightness(1.2);
        }

        &:active {
          opacity: .6;

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

      content: ' ';

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

          content: '';

          background-image: url(~@/assets/images/containerbox/right-double.png);
          background-size: 100% 100%;
        }
      }
    }
  }

  .main-body {
    width: 100%;
  }

  .SourceData {
    width: 100%;
    height: 100%;
  }
</style>