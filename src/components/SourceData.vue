<template>
  <div id="SourceData">
    <div class="SourceData" ref="source"></div>
  </div>
</template>

<script>
  import * as echarts from "echarts";
  import { mapState } from "vuex";

  export default {
    name: "SourceData",
    props: {
      type: {
        type: String,    // 指定类型为 String
        default: 'chartOne'    // 设置默认值为 '01'
      }
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
        if(this.type==='chartone') {
          this.draw();
          if (this.load) this.load = false;
        }
      },
      reconstruction() {
        if(this.type==='charttwo') {
          this.draw();
          if (this.load) this.load = false;
        }
      },
      "type": {
      handler(val) {
        this.init();
        this.draw()
      },
      deep: true,
    },
    },
    methods: {
      init() {
        this.myChart = echarts.init(this.$refs.source);
      },
      draw(flag) {
        let data;
        let mydata;
        if (this.type === 'chartone') {
          this.myDataOne = this.spectrum;
          this.dataOne = [];
          this.myDataOne.forEach((item, index) => {
            this.dataOne.push(2170 + 0.01 * index);
          });
          data = this.dataOne
          mydata = this.myDataOne
        } else if (this.type === 'charttwo') {
          this.myDataTwo = this.reconstruction;
          console.log("sadasdasdasdasdasdas",this.myDataTwo)
          this.dataTwo = [];
          this.myDataTwo.forEach((item, index) => {
            this.dataTwo.push(2170 + 0.01 * index);
          });
          data = this.dataTwo
          mydata = this.myDataTwo
        }


        this.option = {
          tooltip: {
            trigger: "axis",
            position: function (pt) {
              return [pt[0], "10%"];
            },
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
                fontSize: 14, // 字体大小
                color: '#333', // 字体颜色
              },
              nameGap: 30,
              data: data,
            },
          ],
          yAxis: {
            type: "value",
            boundaryGap: ["20%", "20%"],
            name: '谱密度 (dBm)', // 纵坐标标题
            nameLocation: 'end',  // 纵坐标标题放在上方
            nameTextStyle: {
              fontSize: 14, // 字体大小
              color: '#333', // 字体颜色
            },
            nameGap: 40,

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
              name: "坐标",
              type: "line",
              symbol: "none",
              sampling: "lttb",
              itemStyle: {
                color: "rgb(255, 70, 131)",
              },
              data: mydata,
            },
          ],
        };
        this.myChart.setOption(this.option,true);
      },
    },
  };
</script>

<style scoped lang="less">
  .SourceData {
    width: 800px;
    height: 300px;
/* 
    &:before {
      content: "谱密度 (dBm)";
      position: absolute;
      left: 70px;
      top: 20px;
    }

    &:after {
      content: "频率 (MHz)";
      position: absolute;
      right: 5px;
      bottom: 25px;
    } */
  }
</style>