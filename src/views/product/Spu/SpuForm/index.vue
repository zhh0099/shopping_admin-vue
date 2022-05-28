<template>
  <div>
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select  placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="SPU描述">
        <el-input type="textarea" 
        rows="4"
        placeholder="描述" 
        v-model="spu.description"></el-input>
      </el-form-item>
       <el-form-item label="SPU图片">
         <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发 
         file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
         on-preview：图片预览功能
         on-remove:删除图片的时候会触发
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="submitUpload"
          :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
       <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" 
        v-model="attrIdAndAttrName">
          <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"></el-option>
        </el-select>
        <el-button type="primary" :disabled="!attrIdAndAttrName"
        @click="addSaleAttr">添加销售属性</el-button>
        <el-table ref="singleTable" highlight-current-row
        style="width: 100%" border
        :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            width="80"
            label="序号"
            align="center">
          </el-table-column>
          <el-table-column
            property="saleAttrName"
            label="属性名"
            width="width">
          </el-table-column>
          <el-table-column
            property="prop"
            label="属性值名称列表"
            width="width">
            <template slot-scope="{row,$index}">
              <!-- row代表当前作用域插槽内要展示的这一行的数据，就是属性值 -->
              <!--:data="spu.spuSaleAttrList" table表格收集的是spuSaleAttrList
              所以row代表spuSaleAttrList的每一行的数据，即row为spuSaleAttrList[0],spuSaleAttrList[1]等等
              $index代表当前数据项在数组中的索引-->
              <!-- el-tag:用户展示已有属性值列表的数据的 -->
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag,row)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column
            property="prop"
            label="操作"
            width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteSaleAttrName(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data(){
    return{
      dialogImageUrl: '',
      dialogVisible: false,

      //spu属性初始化的时候是一个空的对象,在修改SPU的时候，会想服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      //存储品牌信息
      tradeMarkList:[],
      //存储SPU图片的数据
      spuImageList: [], 
      //销售属性的数据（项目全部的销售属性）
      saleAttrList: [],
      //收集未选择的销售属性的id-----
      attrIdAndAttrName: "", 
    }
  },
  methods: {
    //照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList,22222);
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      console.log("删除的图片信息：",file);
      //console.log(file, fileList);
      this.spuImageList=fileList;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      console.log("图片地址：",file.url);
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //上传图片成功时的回调
    submitUpload(response, file, fileList){
      console.log("上传的图片信息：",file);
      //收集图片的信息
      this.spuImageList=fileList;
    },
    //添加销售属性
    addSaleAttr(){
      let [baseSaleAttrId,saleAttrName]=this.attrIdAndAttrName.split(":");
      this.spu.spuSaleAttrList.push({baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]});
      this.attrIdAndAttrName='';
    },
    //删除销售属性
    deleteSaleAttrName(row){
      this.spu.spuSaleAttrList.splice(this.spu.spuSaleAttrList.indexOf(row),1);
    },
    //取消按钮
    cancel(){
      this.$emit('changeScene',{
        scene: 0,
        flag: "",
      })
      Object.assign(this._data, this.$options.data());
    },
    //初始化SpuForm数据
    async initSpuData(row){
      //console.log('我拿到了spuform对象');
      //获取SPU信息的数据
      console.log("每列的数据信息",row);
      let spuResult=await this.$API.spu.reqSpu(row.id);
      if(spuResult.code===200){
        //在修改spu的时候,需要向服务器发请求的，把服务器返回的数据（对象），赋值给spu属性
        this.spu = spuResult.data;
        console.log("spu数据信息",this.spu);
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
        console.log("品牌的信息",this.tradeMarkList);
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImageResult.code == 200) {
        let listArr=spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改.给数组加上name和url属性
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据赋值给
        this.spuImageList = listArr;
        console.log("整理后图片的信息",this.spuImageList);
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
        console.log("全部的销售属性信息",this.saleAttrList)
      }
    },
    //删除属性值按钮的回调
    handleClose(tag,row) {
      row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(tag),1);
    },
    //添加属性值按钮的回调
    addSaleAttrValue(row){
      //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row,'inputVisible',true);
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row,'inputValue','');
    },
    //el-input失却焦点的事件，还有键盘回车时间keyup
    handleInputConfirm(row) {
      //解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值的名称不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复,这里也可以用some
      let result=row.spuSaleAttrValueList.some(item=>{
        return item.saleAttrValueName==inputValue;
      })
      if(result){
        return;
      }
      //新增的销售属性值
      let newSaleAttrValue={baseSaleAttrId,saleAttrValueName: inputValue};
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改inputVisible为false,显示button
      row.inputVisible = false;
    },
    //保存按钮的回调
    async addOrUpdateSpu(){
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList=this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url
        }
      });
      let result=await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      console.log("添加或者修改成功:",result);
      if(result.code===200){
        this.$message({
          message: '保存成功',
          type: 'success'
        });
        //通知父组件回到场景0
        this.$emit('changeScene',{
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        })
      }
      //清除数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
    //点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id){
      //添加SPU的时候收集三级分类的id
      this.spu.category3Id = category3Id;
      let result1=await this.$API.spu.reqTradeMarkList();
      console.log("品牌的信息:",result1);
      if(result1.code===200){
        this.tradeMarkList=result1.data
      }
      let result2=await this.$API.spu.reqBaseSaleAttrList();
      console.log("平台全部销售属性",result2);
      if(result1.code===200){
        this.saleAttrList=result2.data
      }

    }
    
  },
  computed:{
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      const spuSaleAttrList=this.spu.spuSaleAttrList
      const s= this.saleAttrList.filter((item)=>{
        for(let v of spuSaleAttrList){
          if(item.name==v.saleAttrName) return false;
        }
        return true;
      })
      console.log("筛选出的销售属性：",s);
      return s;
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>