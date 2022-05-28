<template>
  <div id="main">
    
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: '',
  mounted(){
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      xAxis: {
        show:false,
        type: 'category',
      },
      yAxis: {
        show:false,
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130,120],
          type: 'bar'
        }
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
 #main {
  width: 100%;
  height: 100%;
}
</style>
