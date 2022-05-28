<template>
  <!-- 容器 -->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>销售类别占比</span>
      <div class="elrg">
        <el-radio-group v-model="radio1">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "",
  data(){
    return{
      radio1: '全部渠道',
    }
  },
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      title: {
        text: "视频",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: [
            { value: 1048, name: "搜索引擎" },
            { value: 735, name: "直接访问" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "联盟广告" },
            { value: 300, name: "视频广告" },
          ],
        },
      ],
    });
    //绑定事件
    lineCharts.on('mouseover',(params)=>{
        //获取鼠标移上去那条数据
        const {name,value} = params.data;
        //重新设置标题
        lineCharts.setOption({
          title:{
            text:name,
            subtext: value
          }
        })
    })
  }

};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 268.8px;
}
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    width: 100%;
  }
  .clearfix .elrg{
    float:right
  }
</style>
