<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="ywb">
        <el-input
          v-model.trim="queryParams.ywb"
          placeholder="请输入业务部"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入订舱方"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item prop="endDate">
        <el-input
          v-model.trim="queryParams.endDate"
          placeholder="请输入结案时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item prop="endDate">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model.trim="queryParams.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择选择结案日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="complaintsType">
        <el-select
         v-model.trim="queryParams.complaintsType"
          clearable
          style="width:120px;"
          placeholder="赔款类型"
        >
          <el-option
          v-for="item in pkOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item prop="complaintDate">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model.trim="queryParams.complaintDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择选择班列日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['afterSaleManage:tracking:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button 
        size="mini" 
        type="primary" 
        @click="handleExport0" 
        icon="edit"
        v-hasPermi="['afterSaleManage:afterSaleList:download']"
          >下载模板</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button 
        size="mini" 
        type="primary" 
        icon="edit" 
        @click="handleUpload"
        v-hasPermi="['afterSaleManage:tracking:import']"
          >导入</el-button
        >
        <input
          type="file"
          @change="getFile($event)"
          style="display:none"
          ref="menuFile"
        />
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="trackingList">
      <el-table-column width="55" align="center" />
      <el-table-column label="业务部" align="center" prop="ywb" />
      <el-table-column label="负责人" align="center" prop="general" />
      <el-table-column
        label="投诉班列日期"
        align="center"
        prop="complaintDate"
        format="yyyy-MM-dd"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.complaintDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="舱位号" align="center" prop="orderNumber" />
      <el-table-column
        label="客户/合作方名称"
        align="center"
        prop="clientUnit"
      />
      <el-table-column
        label="结案时间"
        align="center"
        prop="endDate"
        format="yyyy-MM-dd"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赔偿我司金额" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit[scope.$index]"
            v-model.trim="rows[scope.$index].income"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave(scope.row, rows[scope.$index].income, scope.$index)
            "
          />
          <p
            v-if="!showEdit[scope.$index]"
            @click="handleShowEdit(scope.$index, scope.row)"
          >
            {{ scope.row.income }}
          </p>
        </template>
      </el-table-column>
      
      <el-table-column label="我司赔偿金额" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit1[scope.$index]"
            v-model.trim="rows[scope.$index].expenditure"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave1(scope.row, rows[scope.$index].expenditure, scope.$index)
            "
          />
          <p
            v-if="!showEdit1[scope.$index]"
            @click="handleShowEdit1(scope.$index, scope.row)"
          >
            {{ scope.row.expenditure }}
          </p>
        </template>
      </el-table-column>
     
      <el-table-column label="结算情况跟踪" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit2[scope.$index]"
            v-model.trim="rows[scope.$index].settlementSituation"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave2(scope.row, rows[scope.$index].settlementSituation, scope.$index)
            "
          />
          <p
            v-if="!showEdit2[scope.$index]"
            @click="handleShowEdit2(scope.$index, scope.row)"
          >
            {{ scope.row.settlementSituation }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="折算人民币" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit3[scope.$index]"
            v-model.trim="rows[scope.$index].rmb"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave3(scope.row, rows[scope.$index].rmb, scope.$index)
            "
          />
          <p
            v-if="!showEdit3[scope.$index]"
            @click="handleShowEdit3(scope.$index, scope.row)"
          >
            {{ scope.row.rmb }}
          </p>
        </template>
      </el-table-column>
      
      <el-table-column label="向客户索赔(人民币赔偿额换算)" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit4[scope.$index]"
            v-model.trim="rows[scope.$index].demage"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave4(scope.row, rows[scope.$index].demage, scope.$index)
            "
          />
          <p
            v-if="!showEdit4[scope.$index]"
            @click="handleShowEdit4(scope.$index, scope.row)"
          >
            {{ scope.row.demage }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="赔款类型" align="center" prop="complaintsType" />
      <el-table-column label="箱号" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleSee(scope.row)"
            >箱号查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="责任部门" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit5[scope.$index]"
            v-model.trim="rows[scope.$index].department"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave5(scope.row, rows[scope.$index].department, scope.$index)
            "
          />
          <p
            v-if="!showEdit5[scope.$index]"
            @click="handleShowEdit5(scope.$index, scope.row)"
          >
            {{ scope.row.department }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit6[scope.$index]"
            v-model.trim="rows[scope.$index].remark"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave6(scope.row, rows[scope.$index].remark, scope.$index)
            "
          />
          <p
            v-if="!showEdit6[scope.$index]"
            @click="handleShowEdit6(scope.$index, scope.row)"
          >
            {{ scope.row.remark }}
          </p>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 箱号查看对话框 -->
    <el-dialog :visible.sync="open1" width="500px">
      <div>
        <el-row>
          <el-col :span="12" v-for="(item, index) in containerList">
            <p :key="index" class="filecss0">{{ item }}</p>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTracking,
  getTracking,
  delTracking,
  addTracking,
  updateTracking,
  exportTracking,
  downloadMessage,
  importObj,
  listContainer,
} from "@/api/afterSaleManage/tracking";

export default {
  name: "Tracking",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 赔款跟踪表格数据
      trackingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      pkOptions:[
        {
          label:'货损',
          value:'货损'
        },
        {
          label:'包装破损',
          value:'包装破损'
        },
        {
          label:'货少',
          value:'货少'
        },{
          label:'延期',
          value:'延期'
        },{
          label:'费用争议',
          value:'费用争议'
        },{
          label:'操作失误',
          value:'操作失误'
        },{
          label:'其他',
          value:'其他'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientTjr: undefined,
        clientTjrId: undefined,
        general: undefined,
        complaintDate: undefined,
        orderNumber: undefined,
        orderId: undefined,
        clientUnit: undefined,
        endDate: undefined,
        complaintsType: undefined,
        income: undefined,
        expenditure: undefined,
        settlementSituation: undefined,
        rmb: undefined,
        department: undefined,
        demage: undefined,
        freightPay: undefined,
        isOverdue: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
       rows: [],
      showEdit: [],
      showEdit1: [],
      showEdit2: [],
      showEdit3: [],
      showEdit4: [],
      showEdit5: [],
      showEdit6: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询赔款跟踪列表 */
    getList() {
      this.loading = true;
      listTracking(this.queryParams).then(response => {
        
        this.trackingList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.rows = [];
        this.trackingList.map(item => {
          this.rows.push({
            income: "",
            expenditure: "",
            settlementSituation: "",
            rmb: "",
            demage: "",
            department: "",
            remark: ""
          });
        });
      }).catch(()=>{
          this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        clientTjr: undefined,
        clientTjrId: undefined,
        general: undefined,
        complaintDate: undefined,
        orderNumber: undefined,
        orderId: undefined,
        clientUnit: undefined,
        endDate: undefined,
        complaintsType: undefined,
        income: undefined,
        expenditure: undefined,
        settlementSituation: undefined,
        rmb: undefined,
        department: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        demage: undefined,
        freightPay: undefined,
        isOverdue: undefined
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //下载模板
    handleExport0() {
      const type = 1;
      
      downloadMessage(type).then(response => {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        var nowDate = year + "-" + month + "-" + day;
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = nowDate + "-导入模板.xlsx"; // xxx.xls/xxx.xlsx
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        this.$notify({
          title: "成功",
          message: "模板下载成功",
          type: "success",
          duration: 2000
        });
      });
    },
//导入
    handleUpload() {
      this.$refs.menuFile.value = "";
      this.$refs.menuFile.click();
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0];
      var zipFormData = new FormData();
      zipFormData.append("file", this.upath); //file对应传输的文件
      
      importObj(zipFormData).then(res => {
        if (res.code === 200) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "导入成功",
            type: "success",
            duration: 2000
          });
        } else {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "warning",
            duration: 2000
          });
        }
      });
    },
     handleShowEdit(index, row) {
    
        this.showEdit[index] = true;
        this.rows[index].income = row.income;
        this.$set(this.showEdit, index, true);
      
    },
    handleShowSave(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateTracking({ id: row.id, income: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit, index, false);
          this.getList();
        }
      });
     
    },handleShowEdit1(index, row) {
    
        this.showEdit1[index] = true;
        this.rows[index].expenditure = row.expenditure;
        this.$set(this.showEdit1, index, true);
      
    },
    handleShowSave1(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateTracking({ id: row.id, expenditure: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit1, index, false);
          this.getList();
        }
      });
     
    },handleShowEdit2(index, row) {
    
        this.showEdit2[index] = true;
        this.rows[index].settlementSituation = row.settlementSituation;
        this.$set(this.showEdit2, index, true);
      
    },
    handleShowSave2(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateTracking({ id: row.id, settlementSituation: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit2, index, false);
          this.getList();
        }
      });
     
    },handleShowEdit3(index, row) {
    
        this.showEdit3[index] = true;
        this.rows[index].rmb = row.rmb;
        this.$set(this.showEdit3, index, true);
      
    },
    handleShowSave3(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateTracking({ id: row.id, rmb: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit3, index, false);
          this.getList();
        }
      });
     
    },handleShowEdit4(index, row) {
    
        this.showEdit4[index] = true;
        this.rows[index].demage = row.demage;
        this.$set(this.showEdit4, index, true);
      
    },
    handleShowSave4(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateTracking({ id: row.id, demage: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit4, index, false);
          this.getList();
        }
      });
     
    },handleShowEdit5(index, row) {
    
        this.showEdit5[index] = true;
        this.rows[index].department = row.department;
        this.$set(this.showEdit5, index, true);
      
    },
    handleShowSave5(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateTracking({ id: row.id, department: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit5, index, false);
          this.getList();
        }
      });
     
    },
    handleShowEdit6(index, row) {
    
        this.showEdit6[index] = true;
        this.rows[index].remark = row.remark;
        this.$set(this.showEdit6, index, true);
      
    },
    handleShowSave6(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateTracking({ id: row.id, remark: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit6, index, false);
          this.getList();
        }
      });
     
    },
    //箱号查看
    handleSee(row) {
      listContainer({ orderId: row.orderId }).then(response => {
        console.log(666666 + row.orderId);
        this.containerList = [];
        
        this.containerList = response.data;
        this.open1 = true;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有赔款跟踪数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportTracking(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
