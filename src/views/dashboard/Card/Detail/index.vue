<template>
  <div>
    <div class="card-header">
      <span>{{title}}</span>
      <i class="el-icon-warning-outline"></i>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props:['title','count']
}
</script>

<style>
  .card-header{
    overflow:hidden
  }
  .card-header span{
    float:left;
    color:#BCC4C7
  }
  .card-header i{
    float:right;
  }
  .card-content{
    font-size:30px;
    margin: 10px 0px
  }
  .card-charts{
    height: 100px;
  }
  .card-footer{
    border-top: 1px solid #eee;
    padding:10px 0px
  }
</style>