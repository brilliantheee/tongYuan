<template>
  <div class="fixedHeight">
    <div class="tabTitle">
      <span>频段</span>
    </div>
    <el-table :data="tableData" height="330" border class="tabData">
      <el-table-column
        v-for="(item, index) in tabTitle"
        :key="index"
        :type="index ? '' : 'index'"
        :label="item.title"
        :width="item.width || 'auto'"
        :prop="item.prop"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in freTitle"
        :key="index"
        :prop="item.title"
        :label="item.title"
      >
        <template slot-scope="scope">
          <div :style="{ color: scope.row.Status == '正常' ? 'black' : 'red' }">
            {{ scope.row.Status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in nottit"
        :key="index"
        :label="item.title"
        :prop="item.prop"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SignalAnalysis",
  data() {
    return {
      tabTitle: [
        {
          title: "序号",
          prop: "",
          width: 80,
        },
        {
          title: "中心频率/MHz",
          prop: "centerFrequency",
        },
        {
          title: "带宽/kHz",
          prop: "bandwidth",
        },
        {
          title: "频段不可用/KHz",
          prop: "exists_signal",
          // prop: "centerFrequency",
        },
        // {
        //   title: "频段可用/kHz",
        //   prop: "Not_exists_signal",
        //   //prop: "bandwidth",
        // },
      ],

      // freTitle: [
      //   {
      //     title: "是否异常/dBm",
      //     prop: "Status",
      //     //prop: "peakPower",
      //   },
      // ],
      // nottit: [
      //   {
      //     title: "频段可用/kHz",
      //     prop: "Not_exists_signal",
      //     //prop: "bandwidth",
      //   },
      //   // {

      //   //   title: "频段不可用/KHz",
      //   //   prop: "exists_signal",
      //   //   // prop: "centerFrequency",
      //   // },
      // ],

      tableData: [],
    };
  },
  computed: {
    ...mapState({
      bandwidth: (state) => state.data["bandwidth"],
      //   symbolrates: (state) => state.data["symbolrates"],
      centerFrequency: (state) => state.data["centerfrequency"],
      //   peakPower: (state) => state.data["peakpower"],
      //   constellations: (state) => state.data["constellations"],
      exists_signal: (state) => state.data["exists_signal"],
      Not_exists_signal: (state) => state.data["Not_exists_signal"],
      Status: (state) => state.data["Status"],
    }),
  },
  watch: {
    exists_signal() {
      this.ProcessingData();
    },
  },
  methods: {
    ProcessingData() {
      let arr = [];
      this.bandwidth.forEach((item, index) => {
        arr.push({
          bandwidth: item,
          centerFrequency: this.centerFrequency[index],
          //   peakPower: this.peakPower[index],
          //   symbolrates: this.symbolrates[index],
          //   constellations: this.constellations[index],
          exists_signal:
            this.exists_signal[index][0] + "~" + this.exists_signal[index][1],
          Not_exists_signal:
            this.Not_exists_signal[index][0] +
            "~" +
            this.Not_exists_signal[index][1],
          Status:
            this.Status[index] == 0
              ? this.Status[index] == 2
                ? "宽带干扰"
                : "窄带干扰"
              : "正常",
        });
      });
      this.tableData = arr;
    },
    getColor(value) {
      return value == "正常" ? "black" : "red";
    },
  },
};
</script>

<style scoped lang="less">
.tabData {
  width: 100%; //***********************************
  // height: 300px;
}
.tabTitle {
  //************************************
  height: 20px;
  line-height: 20px;
}
span {
  //************************************
  font-size: 18px;
  font-weight: bold;
  margin-left: 20px;
}
</style>