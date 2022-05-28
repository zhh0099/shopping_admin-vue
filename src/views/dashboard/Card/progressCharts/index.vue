<template>
  <div class="charts" ref="charts">
    
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: '',
  mounted(){
    var myChart = echarts.init(this.$refs.charts);
    var option;

    option = {
      tooltip: {
        axisPointer: {
          type: 'shadow',
        }
      },
      
      xAxis: {
        show:false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show:false,
        type: 'category',
      },
      series: [
        {
          type: 'bar',
          data: [78],
          //柱状图的宽度
          barWidth: 10,
          color: "yellowgreen",
          //背景颜色设置
          showBackground: true,
          //设置背景颜色
          backgroundStyle: {
            color: "#eee",
          },
          //文本标签
          label:{
             show:true,
             //改变文本内容
             formatter:'|',
             //文本标签位置调试
             position:'right'
          }
        },
        
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    };
    option && myChart.setOption(option);
  }
}
</script>

<style scoped>
 .charts {
  width: 100%;
  height: 100%;
}
</style>
