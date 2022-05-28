<template>
  <!-- 容器 -->
  <el-card class="box-card">
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <el-dropdown class='el'>
        <span>
            <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table  style="width: 100%" border>
        <el-table-column label="排名" width="80" type="index">
        </el-table-column>
        <el-table-column label="搜搜关键字" width="180"> </el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <!-- 分页去 -->
      <el-pagination layout="prev, pager, next" :total="1000" class="pagination"> </el-pagination>
    </div>

  </el-card>
</template>

<script>
//引入echarts
import LineCharts from "./lineCharts";
export default {
  name: "",
  components: {
    LineCharts,
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
.header{
    overflow:hidden
}
.header span{
    float:left;
}
.header .el{
    float:right;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
