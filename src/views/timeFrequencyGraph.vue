<template>
  <div class="container-box">
    <div class="header">
      <div class="header-warp">
        <div class="header-title">
          <span>重构时频图</span>
        </div>
      </div>
    </div>
    <backgroundCard>
      <!-- 这里是主体内容 -->
      <div class="main-body">
        <div class="fixedHeight">
          <div class="HeadScatter">
            <div class="scatter" ref="scatter"></div>
            <canvas id="canvas"></canvas>
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
        //散点图数据
        Scatter: [],
        chart: '',
        flag: 0,
        nowTime: Date.now(),
        option: {
          visualMap: {
            min: -120,
            max: -80,
            dimension: 1,
            orient: 'vertical',
            right: -6,
            top: 0,
            text: ['HIGH', 'LOW'],
            calculable: true,
            inRange: {
              //color: ['#1a49f2', '#1a9cf2', '#1ae0f2', '#1af2f2', '#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',]
              //color: ['#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',]
              color: ['#0033FF', '#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF33', '#00FF00',
                '#33FF00', '#66FF00', '#99FF00', '#CCFF00', '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF3300', '#FF0000']
            }
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: [{
            type: 'value',
            interval: 3,
            min: 2170, // 起始
            max: 2200 ,// 终止
            name: '频率(MHz)', // 纵坐标标题
            nameLocation: 'end',  // 纵坐标标题放在上方
            nameTextStyle: {
              fontSize: 12, // 字体大小
              color: '#333', // 字体颜色
            },
          }],
          grid: {
            left: '6%',   // 图表区域距离容器左侧10%
            right: '16%',  // 图表区域距离容器右侧10%
            top: '20%',    // 图表区域距离容器顶部20%，避免和图例重叠
            bottom: '13%'  // 图表区域距离容器底部10%
          },
          yAxis: [{
            type: 'value',
            min: 0, // 起始
            max: 100,
            name: '时间 (s)', // 纵坐标标题
            nameLocation: 'end',  // 纵坐标标题放在上方
            nameTextStyle: {
              fontSize: 12, // 字体大小
              color: '#333', // 字体颜色
            },
          }],
          series: [{
            name: 'price-area',
            type: 'scatter',
            symbolSize: 1,
            itemStyle: {
              normal: {
                borderWidth: 0.2,
              }
            },
            data: []
          }]
        },
        //color: ['#1a49f2', '#1a9cf2', '#1ae0f2', '#1af2f2', '#9bf3b8', '#23f100', '#66ea75', '#b7db7d', '#f1de86', '#debe7b', '#f2aa1a', '#f24c1a', '#f23a1a', '#f21a1a',],
        //color: ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00', '#CCFF00', '#99FF00', '#66FF00', '#33FF00',
        //        '#00FF00', '#00FF33', '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF', '#0066FF', '#0033FF'],

        color: ['#0033FF', '#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#00FFCC', '#00FF99', '#00FF66', '#00FF33', '#00FF00',
          '#33FF00', '#66FF00', '#99FF00', '#CCFF00', '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF3300', '#FF0000'],
        ctx: {},
      }
    },
    mounted() {
      this.chart = echarts.init(this.$refs['scatter']);
      this.createChart();
      this.setSize();
    },
    computed: {
      ...mapState({
        spectrum: state => state.data['spectrumdata'],
      })
    },
    watch: {
      spectrum() {
        this.editData();
      }
    },
    methods: {
      clear() {
        let scatter = document.querySelector('#canvas');
        let w = scatter.width;
        // let h = scatter.height;
        scatter.width = w;
        this.flag = 0;
      },
      drawDot(x, y, color) {
        let ctx = document.querySelector('#canvas').getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 5, 0, Math.PI * 2, true)
        ctx.fill()
        ctx.closePath();
      },
      editData() {
        this.flag += 5;
        if (this.flag == 180) {                //****************************************
          this.clear();
        }
        let myColor;
        this.spectrum.forEach((item, index) => {

          // console.log(item, '(**')
          let num = 0
          for (let i = -115; i <= -85; i += 1.5) {
            if (item >= i && item <= i + 1.5) {
              if (num > this.color.length) {
                num = this.color.length;
              }
              myColor = this.color[num];
            }
            num++;
          }
          if (index % 4 == 0) {

            this.drawDot(index / 4, this.flag, myColor)
          }
          //this.drawDot(index, this.flag, myColor)

        })
      },
      createChart() {
        this.chart.setOption(this.option);
      },
      setSize() {
        let canvas = document.querySelector('[data-zr-dom-id]');
        let scatter = document.querySelector('#canvas');
        console.log(canvas.clientWidth, '**', canvas.width)
        scatter.width = document.body.clientWidth  //* 0.8 - document.body.clientWidth * 0.4;   //********************
        scatter.height = canvas.clientHeight * 0.60;
      }
    }
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

  .scatter {
    display: flex;
    width: 100%;
    height: 100%;
    left: 0px;
    position: relative;
  }

  #canvas {
    position: absolute;
   height: 72%;
    width: 197%;
    top:28px;
    transform: rotateX(180deg);
    margin-left: 86px;
    margin-left: 6.1%;
  }

  .HeadScatter {
    position: relative;

  }
  .main-body {
    width: 100%;
    height: 100%;
  }
  .fixedHeight {
    width: 100%;
    height: 100%;
    display: flex;
  }
  .HeadScatter {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>