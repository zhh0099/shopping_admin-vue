<template>
  <!-- 容器 -->
  <el-card class="box-card" style="margin: 10px 0px">
    <div  class="clearfix">
      <!--  @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          type="daterange"
          v-model="date"
          class="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <h3>门店{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindexs">4</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindexs">5</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindexs">6</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindexs">7</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>
    </div>
  </el-card>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
import dayjs from 'dayjs'
export default {
  name: "",
  data() {
      return {
        activeName: 'sale',
        mycharts:null,
        date:[]
      };
  },
  watch:{
    title(){
      console.log("修改配置数据");
      //重新修改图标的配置数据
      var option = {
        title: {
          text: this.title+'趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [22, 32, 204, 353, 387, 330, 220],
          }
        ]
      };
      this.mycharts.setOption(option)
    }
  },
  computed: {
    //计算属性-标题
    title() {
      //重新设置配置项
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  mounted(){
    this.mycharts = echarts.init(this.$refs.charts);
    var option = {
      title: {
        text: this.title+'趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220],
        }
      ]
    };
    this.mycharts.setOption(option)
  },
  methods: {
    //本天
    setDay(){
      const day=dayjs().format('YYYY-MM-DD');
      this.date = [day, day];
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.date = [start, end];
    },
    //本年
    setYear(){
      const start = dayjs().startOf('year').format("YYYY-MM-DD");
      const end = dayjs().endOf('year').format("YYYY-MM-DD");
      this.date = [start, end];
    }
  }
};
</script>

<style scoped>
  .clearfix{
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  .right {
    position: absolute;
    right: 0px;
  }
  .right span{
    margin: 0px 10px;
  }
  .date {
  width: 320px;
  margin: 0px 20px;
  }
  .tab{
    width: 100%;
  }
  .charts{
    width: 100%;
    height:300px
  }
  ul{
    padding: 0px
  }
  ul li{
    list-style: none;
    margin:20px 0px
  }
  ul li .rindexs{
    margin-left:6px;
    margin-right:24px
  }
  ul li .rindex{
    float: left;
    width: 20px;
    height: 20px;
    margin-right:20px;
    border-radius:50%;
    background: black;
    color: white;
    text-align: center;
  }
  ul li .rvalue{
    float: right
  }
</style>
