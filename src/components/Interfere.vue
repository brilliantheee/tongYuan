<template>
  <div class="fixedHeight">
    <!-- <div class="tabTitle">
      <span>异常频段回溯</span>
    </div> -->
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
          <div
            :style="{
              color: scope.row.yichang !== '' ? 'red' : 'black',
            }"
          >
            {{ scope.row.yichang }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Interfere",
  data() {
    return {
      tabTitle: [
        {
          title: "序号",
          prop: "",
          width: 80,
        },
        {
          title: "信号频段",
          prop: "history_abnoraml_list",
        },
      ],
      freTitle: [
        {
          title: "异常类型",
          prop: "yichang",
        },
      ],

      tableData: [],
    };
  },
  computed: {
    ...mapState({
      // //底噪起伏
      // BottomNoise: (state) => state.data["history_abnoraml_list"],
      //宽带干扰
      history_abnoraml_list: (state) => state.data["history_abnoraml_list"],
      // //单音干扰
      // singlEtone: (state) => state.data["singletone_interference"],
    }),
  },
  watch: {
    history_abnoraml_list() {
      this.ProcessingData();
    },
  },
  methods: {
    ProcessingData() {
      let arr = [];
      //if (Number(this.BottomNoise)) {
      //arr.push({
      //bandwidth: this.BottomNoise,
      //type: '底噪起伏',
      //})
      //}
      this.history_abnoraml_list.forEach((item, index) => {
        arr.push({
          history_abnoraml_list:
            this.history_abnoraml_list[index][0][0] +
            "~" +
            this.history_abnoraml_list[index][0][1],
          // yichang: "存在异常",
          yichang:
            this.history_abnoraml_list[index][1] == "1"
              ? "窄带干扰"
              : this.history_abnoraml_list[index][1] == "2"
              ? "宽带干扰"
              : this.history_abnoraml_list[index][1] == "10"
              ? "叠加信号干扰"
              : this.history_abnoraml_list[index][1] == "11"
              ? "叠加信号干扰"
              : this.history_abnoraml_list[index][1] == "12"
              ? "叠加信号干扰"
              : "叠加信号干扰",
        });
      });
      this.tableData = arr;
      // console.log(arr);
    },
  },
};
</script>

<style scoped lang="less">
.tabData {
  width: 100%; //***********************************
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