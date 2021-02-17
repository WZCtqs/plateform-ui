<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="客户名称" prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNumber">
        <el-input
          v-model.trim="queryParams.contractNumber"
          placeholder="请输入合同编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    <el-form-item label="合同状态" prop="contractStatus">
        <el-select v-model.trim="queryParams.contractStatus" placeholder="请选择合同状态" clearable size="small">
          <el-option label="正常" value="0" />
          <el-option label="即将到期" value="1" />
          <el-option label="已过期" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务部" prop="deptName">
        <el-input
          v-model.trim="queryParams.deptName"
          placeholder="请输入业务部"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推荐人" prop="nickName">
        <el-input
         v-model.trim="queryParams.nickName"
         placeholder="请输入推荐人"
         clearable
         size="small"
         @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['clients:contract:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="客户名称" align="center" prop="clientUnit" />
      <el-table-column label="合同编号" align="center" prop="contractNum" />
      <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="合同主题" align="center" prop="contractSubject" />
      <el-table-column label="联系人" align="center" prop="clientContacts" />
      <el-table-column label="业务部" align="center" prop="deptName" />
      <el-table-column label="推荐人" align="center" prop="nickName" />
      <el-table-column label="合同签订时间" align="center" prop="signDate" >
        <template slot-scope="scope">
          <span v-if="scope.row.signDate">{{ parseTime(scope.row.signDate,'{y}-{m}-{d}') }}</span>
          <span v-else>{{scope.row.signDate}}</span>
        </template>
        </el-table-column>
      <el-table-column label="合同有效时长" align="center" prop="contractTime" />
      <el-table-column label="合同到期时间" align="center" prop="signDisableddate" >
           <template slot-scope="scope">
          <span v-if="scope.row.signDisableddate">{{ parseTime(scope.row.signDisableddate,'{y}-{m}-{d}') }}</span>
          <span v-else>{{scope.row.signDisableddate}}</span>
        </template>
        </el-table-column>
      <el-table-column label="到期提醒时间" align="center" prop="remindTime" >
            <template slot-scope="scope">
          <span v-if="scope.row.remindTime">{{ parseTime(scope.row.remindTime,'{y}-{m}-{d}') }}</span>
          <span v-else>{{scope.row.remindTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同状态" align="center" prop="contractStatus" >
          <template slot-scope="scope">
          <span v-if="scope.row.contractStatus == 0">正常</span>
          <span v-else-if="scope.row.contractStatus == 1">即将到期</span>
          <span v-else-if="scope.row.contractStatus == 2">已过期</span>
        </template>
       </el-table-column>
      <el-table-column label="合同附件" align="center" prop="" />
      <el-table-column label="备注" align="center" prop="contractRemark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['clients:clients:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['clients:reference:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改推荐人管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%">
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
         <el-row>
           <el-col :span="10">
        <el-form-item label="合同编号" prop="contractNum">
          <el-input v-model.trim="form.contractNum"  />
        </el-form-item>
         </el-col>
          <el-col :span="12">
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model.trim="form.contractName"  />
        </el-form-item>
         </el-col>
        </el-row>
       <el-row>
           <el-col :span="10">
        <el-form-item label="合同主题" prop="contractSubject">
          <el-input v-model.trim="form.contractSubject" />
        </el-form-item>
        </el-col>
          <el-col :span="12">
        <el-form-item label="合同签订时间" prop="signDate">
                 <el-date-picker
                 v-model.trim="form.signDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
        </el-form-item>
        </el-col>
        </el-row>
       <el-row>
           <el-col :span="10">
        <el-form-item label="合同有效时长" prop="contractTime">
          <el-input v-model.trim="form.contractTime" />
        </el-form-item>
         </el-col>
          <el-col :span="12">
        <el-form-item label="合同到期时间" prop="signDisableddate">
          <el-date-picker
                 v-model.trim="form.signDisableddate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="updateRemindTime(form.signDisableddate)"
                  >
                </el-date-picker>
        </el-form-item>
        </el-col>
        </el-row>
     <el-row>
           <el-col :span="10">
        <el-form-item label="到期提醒时间" prop="remindTime">
                 <el-date-picker
                 v-model.trim="form.remindTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  >
                </el-date-picker>
        </el-form-item>
           </el-col>
          <el-col :span="12">
        <el-form-item label="备注" prop="contractRemark">
          <el-input v-model.trim="form.contractRemark"  />
        </el-form-item>
     </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listClients,getClients, updateClients,exportContract} from "@/api/clients/clients";

export default {
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
      // 推荐人管理表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientUnit: undefined,
        contractNum: undefined,
        contractStatus: undefined,
        deptName: undefined,
        nickName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询合同列表 */
    getList() {
      this.loading = true;
      listClients(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        pageNum: 1,
        pageSize: 10,
        clientUnit: undefined,
        contractNum: undefined,
        contractStatus: undefined,
        deptName: undefined,
        nickName: undefined,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.open = true;
    //   this.title = "添加推荐人管理";
    // },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const clientId = row.clientId || this.ids;
      getClients(clientId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户合同";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.clientId != undefined) {
            updateClients(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } 
          // else {
          //   addReference(this.form).then(response => {
          //     if (response.code === 200) {
          //       this.msgSuccess("新增成功");
          //       this.open = false;
          //       this.getList();
          //     } else {
          //       this.msgError(response.msg);
          //     }
          //   });
          // }
        }
      });
    },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const ids = row.id || this.ids;
    //   this.$confirm('是否确认删除推荐人管理编号为"' + ids + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delReference(ids);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     }).catch(function() {});
    // },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有推荐人管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportContract(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    updateRemindTime(newTime){
      var remindTime = new Date(newTime)
      remindTime.setMonth(remindTime.getMonth()-3);
      var year=remindTime.getFullYear();
      var month=remindTime.getMonth()+1;
      month =(month<10 ? '0'+month:month);
      remindTime = (year.toString()+'-'+month.toString()+'-'+remindTime.getDate());
      this.form.remindTime=remindTime
   }
  }
};
</script>
