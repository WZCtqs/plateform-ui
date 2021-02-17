<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
            <el-form-item label="舱位号" prop="orderNumber">
              <el-input
                v-model.trim="queryParams.orderNumber"
                placeholder="请输入舱位号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
         
            <el-form-item label="箱号" prop="xianghao">
              <el-input
                v-model.trim="queryParams.xianghao"
                placeholder="请输入箱号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

            <el-form-item label="班列日期" prop="classDate">
            <el-date-picker v-model.trim="queryParams.classDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd HH:mm:ss"  />
            </el-form-item>
        
            <el-form-item label="计划班列号" prop="classzyNo">
              <el-input
                v-model.trim="queryParams.classzyNo"
                placeholder="请输入计划班列号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

            <el-form-item label="下货站" prop="orderUnloadsite">
              <el-input
                v-model.trim="queryParams.orderUnloadsite"
                placeholder="请输入下货站"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
        
            <el-form-item label="发运日期" prop="actualClassDateValue">
            <el-date-picker v-model.trim="queryParams.actualClassDateValue" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd HH:mm:ss"  />
            </el-form-item>

            <el-form-item label="运单负责人" prop="ydOperator">
              <el-input
                v-model.trim="queryParams.ydOperator"
                placeholder="请输入运单负责人"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>

             <el-form-item label="订舱方名称" prop="clientUnit">
              <el-input
                v-model.trim="queryParams.clientUnit"
                placeholder="请输入订舱方名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
         
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" v-hasPermi="['classOrder:dczStation:query']" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
    </el-form>

    <el-table
      class="el-tableCss0"
      :class="this.heightScreen===590?'zyx1 el-tableCss0':'zyx2 el-tableCss0'"
      v-loading="loading"
      :data="list"
      border
      :height="heightScreen"
    >
      <el-table-column  width="55" align="center"  />
      <el-table-column label="班列日期" align="center" prop="classDate" fixed="left" >
          <template slot-scope="scope">
            <span v-if="scope.row.classDate">
              {{scope.row.classDate.substring(0,10)}}
            </span> 
        </template>
      </el-table-column>
      <el-table-column label="集装箱号" align="center" prop="xianghao" fixed="left" />
      <el-table-column label="舱位号" align="center" prop="orderNumber" fixed="left" />
      <el-table-column label="品名" align="center" prop="goodsName"  fixed="left" />
      <el-table-column label="下货站" align="center" prop="orderUnloadsite" fixed="left" />
      <el-table-column label="运单负责人" align="center" prop="ydOperator"  fixed="left" />
      <el-table-column label="发运日期" align="center" prop="actualClassDateValue"  fixed="left" />
      <el-table-column label="订舱方" align="center" prop="clientUnit"  fixed="left" />
      <el-table-column label="业务推荐人" prop="clientTjr" align="center" width="350px"/>
      <el-table-column label="跟单员" align="center" prop="orderMerchandiser" />
      <el-table-column label="箱量" align="center" prop="containerBoxamount" />
      <el-table-column label="箱型" align="center" prop="containerType" />
      <el-table-column label="运单状态" align="center" prop="isApplynum" />
      <el-table-column label="运单审核时间" align="center" prop="dlChecktime" />
      <el-table-column label="运单导出" align="center" prop="containerType" >
      <template slot-scope="scope">
      <el-button size="mini" type="text" @click="handleExport(scope.row)">运单导出</el-button>  
      </template>
      </el-table-column>  
      <el-table-column label="收货人(中文)" align="center" prop="consignee" />
      <el-table-column label="收货人(英文/俄文)" align="center" prop="consigneeE" width="350px"/>
      <el-table-column label="还箱信息(箱属)" align="center" prop="boxBelong" width="530px"/>
      <el-table-column label="封号" align="center" prop="fenghao" />
      <el-table-column label="发货人(中文)" align="center" prop="consignorC" />
      <el-table-column label="发货人(英/俄文)" align="center" prop="consignor" width="350px"/>

      <el-table-column label="货物中文品名及税号及外文释义" align="center" prop="goodsnames" />
      <el-table-column label="件数" align="center" prop="yundanNumber" />
      <el-table-column label="毛重" align="center" prop="yundanWeight" />
      <el-table-column label="箱重" align="center" prop="yundanXweight" />
      <el-table-column label="总重" align="center" prop="yundanTotalweight" />
      <el-table-column label="到站监管库信息(CBX仓库信息)" align="center" prop="cbxwarehouse" />
      <el-table-column label="最终到站名称(中/俄文)及站编" align="center" prop="arrivalstation" />
      <el-table-column label="专用线信息" align="center" prop="privateline" />
      <el-table-column label="国境口岸站" align="center" prop="gjkouan" />
      <el-table-column label="承运人区段车站码" align="center" prop="carrierstationcode" />
      <el-table-column label="付费代码" align="center" prop="paymentcode"  />
      <el-table-column label="发货人声明" align="center" prop="consignorstate"  />
      <el-table-column label="供货合同号" align="center" prop="supplycontractno" />
      <el-table-column label="办理海关及其他行政手续记载" align="center" prop="formalities"  />
      </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  zyList,
  exportZyInfo
} from "@/api/cabinArrangementMange/chinaAsianGamesList";
import { parseTime} from "@/utils/zhonghao";

import {
  validatePhone,
  validateTelphone,
  validateEMail
} from "@/api/validator";
import "@/assets/styles/selfCss0.css";

export default {
  name: 'DczStation',
  data() {
    return {
      classzyNo:null,
      historyListdata:[],
      open2:false, //修改记录弹框
      // ***************************************  修改  *********************************************************
      form: {}, // form表单
      formDisabled: false,
      // 表单校验
      rules: { 
       
      },
      rules1: { 
       
      },
      title: "",  // 弹出层标题
      open: false,   // 编辑 弹框是否显示
      open1: false,   // 班列号 弹框是否显示
      heightScreen:null,
      form1:{},
       // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      box20:0,
      box40:0,
      box45:0,
      boxV:0,
      boxKG:0,
      total: 0,  // 总条数
      list: [], // 订舱托书列表数据
      // ******************************************* 其他字段 *****************************************************
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中list数组
      arrs: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      value1:[], // 查询条件 班列日期
      value2:[], // 查询条件 发运日期
     fileList:[],
     classDate:null,
    };
  },
  created() {
    // this.queryParams['userid'] = this.$store.getters.id;
    this.getList()
  },
  mounted() {
     if(window.screen.height >800){
        this.heightScreen = 590
      }else{
        this.heightScreen = 470
      }
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      zyList(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },

    /** 运单导出操作 */
   handleExport(row) {
      //   exportZyInfo(row.costId).then(response => {
      //   this.download(response.msg);
      // }).catch(function() {});
    // 培松的导出接口使用下面的写法,其他人的接口使用上面注释的写法
      //  let params={
      //   costId:row.costId
      // }
       let costId= row.costId
       exportZyInfo(costId).then(response => {
          let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = row.xianghao+".docx"; // xxx.xls/xxx.xlsx
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        this.$notify({
          title: "成功",
          message: "导出成功",
          type: "success",
          duration: 2000
        });
      })
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.value1=null
      this.value2=null
      
      this.queryParams={
        pageNum:1,
        pageSize:20
      }
      
      this.handleQuery();
    },
   
   
    cancel1(){
      this.open1=false
      this.form1={}
    },
    
   
     
   
    
  }
};
</script>
<style>
.detailCss0 {
  color: #1890ff;
  cursor: pointer;
}
.isupdateListULCss0 li {
  border-bottom: 1px solid#000;
  height: 35px;
  line-height: 35px;
  list-style: none;
}
.orderTable th > .cell {
  white-space:nowrap;
}
.isupdateListULCss0 li.isupdateListLICss0 {
  background: #eee;
  border-bottom: none;
}
.el-form-item__label {
padding: 0 0 0 0;
}
.el-input--medium .el-input__inner {
    height: 26px;
    line-height: 26px;
}
.el-input--small .el-input__inner {
    height: 26px;
    line-height: 26px;
}


.zyx2 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 14px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.el-table {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    max-width: 100%;
    background-color: #FFFFFF;
    font-size: 10px;
    color: #606266;
}
.el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #dfe4ed;
    color: #606266;
    cursor: not-allowed;
}
.el-table--medium td, .el-table--medium th {
    padding: 0 0;
}
.el-table .el-table__header-wrapper th {
    word-break: break-word;
    background-color: #f8f8f9;
    color: #515a6e;
    height: 25px;
    font-size: 10px;
}
.zyx1 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 27px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
</style>
<style lang="scss">
  .el-table {
    .el-table__fixed {
      height:auto !important; // 此处的important表示优先于element.style
      bottom:17px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
    }
  }
</style>
