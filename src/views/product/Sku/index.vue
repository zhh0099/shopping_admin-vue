<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-table border
        ref="singleTable"
        :data="records"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="100">
        </el-table-column>
        <el-table-column
          property="skuName"
          label="名称"
          width="width">
        </el-table-column>
        <el-table-column
          property="skuDesc"
          label="描述"
          width="width">
        </el-table-column>
        <el-table-column
          property="prop"
          width="width"
          label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" width="100px" height="100px">
          </template>
        </el-table-column>
        <el-table-column
          property="weight"
          width="100"
          label="重量(KG)">
        </el-table-column>
        <el-table-column
          property="price"
          width="100"
          label="价格(元)">
        </el-table-column>
        <el-table-column
          property="address"
          width="width"
          label="操作">
          <template slot-scope="{row,$index}">
            <el-button size="mini" type="success" icon="el-icon-sort-down"
            v-if="row.isSale==0"
            @click="sale(row)"></el-button>
            <el-button size="mini" type="success" icon="el-icon-sort-up" v-else 
            @click="cancel(row)"></el-button>
            <el-button size="mini" type="primary" @click="edit" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="info" icon="el-icon-info"
            @click="getSkuInfo(row)"></el-button>
            <el-popconfirm 
            title="这是一段内容确定删除吗"
            @onConfirm="deleteSku(row)">
              <el-button size="mini" type="danger" icon="el-icon-delete"
               slot="reference"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="getSkuList"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout="prev, pager, next,jumper,-> ,sizes,total"
        :total="total">
      </el-pagination>
      <el-drawer
      :visible.sync="show"
      :with-header="false"
      :show-close="false"
      size="45%"
      :before-close="handleClose">
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{skuInfo.skuName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16" >{{skuInfo.price}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="16">
            <template>
              <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin-right:10px">{{item.attrName}}--{{item.valueName}}</el-tag>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <el-carousel trigger="click" height="150px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>      
    </el-form>
  </div>
</template>

<script>
export default {
  name:'Sku',
  data(){
    return{
      //代表当前第几页
      page: 1,
      //每页显示多少条
      limit: 10,
      //存储分页器一共展示的数据
      total: 0,
      //存储SKU列表的数据
      records:[],
      skuInfo:{},//存储SKU信息
      show:false,
    }
  },
  //组件挂载完毕
  mounted(){
    //获取sku列表的方法
    this.getSkuList();
  },
  methods: {
    //获取sku列表数据的方法
    async getSkuList(val=1){
      console.log(`当前页: ${val}`);
      this.page=val;
      //解构出默认的参数
      const {page,limit}=this;
      let result =await this.$API.sku.reqSkuList(page,limit);
      console.log("sku列表的结果",result);
      if(result.code===200){
        this.records=result.data.records
        this.total=result.data.total
      }
    },
    handleSizeChange(val) {
      //修改参数
      console.log(`每页 ${val} 条`);
      this.limit=val;
      this.getSkuList();
    },
    //上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    //下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    //获取SKU详情的方法
    async getSkuInfo(row){
      let result = await this.$API.sku.reqSkuById(row.id);
      console.log("sku详情的结果",result);
      if (result.code == 200) {
        this.skuInfo=result.data;
        this.show=true;
      }
    },
    //关闭弹出框
    handleClose(done) {
      this.show=false;
      this.skuInfo={}
      done();
    },
    //删除SKU,有bug
    async deleteSku(row){
      console.log(row)
      let {page,records}=this;
      console.log(page,records);
      let result = await this.$API.sku.reqDeleteSku(row.id);
      console.log("删除sku详情的结果",result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSkuList(records.length > 1 ? page : page - 1);
      }
    }
  },
}
</script>
  
<style scoped>
  .el-row .el-col-5{
      font-size:18px;
      text-align:right;
   }
   .el-col{
     margin:10px 10px;
   }

   >>>.el-carousel__button{
    width:10px;
    height:10px;
    background:red;
    border-radius:50%;
  }
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>