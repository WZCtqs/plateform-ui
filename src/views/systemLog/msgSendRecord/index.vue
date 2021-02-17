<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
     
        <el-form-item  prop="emailStatus">
        <el-select 
        v-model.trim="queryParams.emailStatus" 
        placeholder="请选择状态" 
        clearable 
        size="small">
        <el-option 
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        >
        </el-option>  
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-date-picker
          v-model.trim="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
        
        >搜索</el-button>
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
          v-hasPermi="['systemLog:msgSendRecord:download']"
        >下载发送报表</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="messageList" >
      <el-table-column  width="55" align="center" />
      <el-table-column label="班列日期" align="center" prop="classDate" />
      <el-table-column label="委托书编号" align="center" prop="orderNumber" />
      <el-table-column label="消息事件" align="center" prop="messageType" />
      <el-table-column label="状态" align="center" prop="emailStatus" >
      <template slot-scope="scope">
      <span style="color: green" v-if="scope.row.emailStatus==0">邮件发送成功</span>
      <span style="color: red" v-else-if="scope.row.emailStatus==1">邮件发送失败</span>
      <span style="color: green" v-else-if="scope.row.emailStatus==2">站内信发送成功</span>
      </template>
      </el-table-column>  
      <el-table-column label="发送时间" align="center" prop="createTime" />
      
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
import { listMessage, getMessage, delMessage, addMessage, updateMessage, exportMessage } from "@/api/systemLog/msgSendRecord";

export default {
  name: "MsgSendRecord",
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
      // 消息提醒表格数据
      messageList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 是否显示弹出层
      open: false,
      statusOptions:[
        {
        label:'邮件发送成功',
        value:0
        },{
        label:'邮件发送失败',
        value:1
        },{
        label:'站内信发送成功',
        value:2
        },{
        label:'全部',
        value:''
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: undefined,
        clientId: undefined,
        orderNumber: undefined,
        messageTitle: undefined,
        messageType: undefined,
        messageContent: undefined,
        msgStatus: undefined,
        createTime: undefined,
        fileTypeKey: undefined,
        smsStatus: undefined,
        emailStatus: undefined,
        smsfail: undefined,
        emailfail: undefined
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
    /** 查询消息提醒列表 */
    getList() {
      this.loading = true;
      listMessage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        
        this.messageList = response.rows;
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
        id: undefined,
        orderId: undefined,
        clientId: undefined,
        orderNumber: undefined,
        messageTitle: undefined,
        messageType: undefined,
        messageContent: undefined,
        msgStatus: undefined,
        createTime: undefined,
        classDate: undefined,
        delFlag: undefined,
        fileTypeKey: undefined,
        smsStatus: 0,
        emailStatus: 0,
        smsfail: undefined,
        emailfail: undefined
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
       this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      const dateRange   = this.dateRange;
      
      this.$confirm('是否确认导出发送报表?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMessage(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
   
   
  }
};
</script>