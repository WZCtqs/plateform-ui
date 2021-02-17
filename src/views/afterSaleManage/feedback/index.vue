<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="委托书编号" prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订舱方" prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入订舱方"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
  
        <el-form-item label="状态" prop="status">
        <el-select v-model.trim="queryParams.status" 
        placeholder="请选择状态" 
        clearable 
        size="small">
          <el-option v-for="item in afsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
          </el-option >
        </el-select>
      </el-form-item>
     
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
        
        >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['afterSaleManage:feedback:huifu']"
        >回复</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['afterSaleManage:feedback:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['afterSaleManage:feedback:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="feedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="舱位号" align="center" prop="orderNumber" />
      <el-table-column label="集装箱号" align="center" prop="containerNumber" />
      <el-table-column label="业务" align="center" prop="clientTjr" />
      <el-table-column label="订舱方" align="center" prop="clientUnit" />
      <el-table-column label="货物品名" align="center" prop="goodsName" />
      <el-table-column label="包装方式" align="center" prop="goodsPacking" />
        <el-table-column
        label="签收时间"
        align="center"
        prop="signTime"
        width="180"
      >
        <!-- <template slot-scope="scope" >
          <span>{{ parseTime(scope.row.signTime) }}</span>
        </template> -->
      </el-table-column>
       
      <el-table-column label="投诉日期" align="center" prop="postTime" width="180">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.postTime) }}</span>
        </template> -->
      </el-table-column> -->
      <el-table-column label="是否运费支付" align="center" prop="isPay" >
      <template slot-scope="scope">
      <span v-if="scope.row.isPay=='0'">是</span> 
      <span v-if="scope.row.isPay=='1'">否</span> 
      </template>
      </el-table-column>  
      <el-table-column label="联系邮箱" align="center" prop="email" />
      <el-table-column label="投诉内容" align="center" prop="problemContent" show-overflow-tooltip/>
      <!-- <el-table-column label="投诉内容" align="center" >
       <template slot-scope="scope">
          <span v-if="scope.row.problemContent.length > 9">{{ scope.row.problemContent.substring(0,9) }}...</span>
          <span v-else></span>
        </template>
      </el-table-column> -->
       <el-table-column label="投诉资料" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleSee(scope.row)"
            >下载查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="补传资料" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleSee1(scope.row)"
            >下载查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" prop="doTime" />
      <el-table-column label="处理状态" align="center" prop="status">
      <template slot-scope="scope">
      <span v-if="scope.row.status==0">处理中</span>
      <span v-else-if="scope.row.status==1">已回复</span>
      <span v-else>已结案</span>   
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

    <!-- 添加或修改问题反馈对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="舱位号" prop="orderNumber">
          <el-input v-model.trim="form.orderNumber" placeholder="请输入委托书编号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="集装箱号" prop="containerNumber">
          <el-input v-model.trim="form.containerNumber" placeholder="请输入集装箱号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="签收时间" prop="signTime">
         <el-input v-model.trim="form.signTime"  :disabled="true"/>
        </el-form-item>
         <el-form-item label="联系邮箱" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入联系邮箱" :disabled="true"/>
        </el-form-item>
         <el-form-item label="投诉状态" prop="status">
          <el-select 
          v-model.trim="form.status"
           clearable
           style="width:100%;"
           placeholder="请选择">
            <el-option v-for="item in afsOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉内容" prop="problemContent">
          <el-input v-model.trim="form.problemContent" placeholder="请输入投诉内容" :disabled="true"/>
        </el-form-item>
       
         <el-form-item label="客户要求" prop="requirement">
          <el-input v-model.trim="form.requirement" placeholder="请输入客户要求" :disabled="true"/>
        </el-form-item>
       <el-form-item label="回复内容" prop="feedback">
          <el-input type="textarea" v-model.trim="form.feedback" placeholder="请输入投诉反馈" />
        </el-form-item>
         <el-form-item prop="list">
          <el-upload :action="uploadUrl"
                         :headers="headers"
                      class="upload-demo"
                     :on-change="handleChange"
                     :on-remove="handleRemove"
                     :on-success="imgSuccess"
                     :file-list="form.list"
                     >
          <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 投诉资料查看对话框 -->
    <el-dialog title="附件下载" :visible.sync="open1" width="600px">
    <!-- <el-table >
    <el-table-column  label="投诉文件" width="300"></el-table-column>
    <el-table-column  label="回复文件" width="300"></el-table-column>
   </el-table>
        <el-row>
          <el-col :span="10" v-for="(item, index) in imgList">
            <a :key="index" :href="item.fileUrl" :download="item.fileName" target="_blank" class="filecss0">投诉文件{{item.fileName}} </a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" v-for="(item, index) in hfimgList">
            <a :key="index" :href="item.fileUrl" :download="item.fileName" target="_blank" class="filecss0">回复文件{{item.fileName}} </a>
          </el-col>
        </el-row> -->

        <el-card class="box-card1">
        <div slot="header" class="clearfix">
        <span>回复文件</span>
        </div>
       <el-row>
           <el-col :span="10" v-for="(item, index) in hfimgList">
            <a :key="index" :href="item.fileUrl" :download="item.fileName" target="_blank" class="filecss0">回复文件{{item.fileName}} </a>
          </el-col>
        </el-row>
        </el-card>
        <el-card class="box-card1">
        <div slot="header" class="clearfix">
        <span>投诉文件</span>
        </div>
       <el-row>
           <el-col :span="10" v-for="(item, index) in imgList">
            <a :key="index" :href="item.fileUrl" :download="item.fileName" target="_blank" class="filecss0">投诉文件{{item.fileName}} </a>
          </el-col>
        </el-row>
        </el-card>
    </el-dialog>
    <!-- 补传资料查看对话框 -->
    <el-dialog title="附件下载" :visible.sync="open2" width="500px">
      <!-- <el-table >
    <el-table-column  label="补传文件" width="300"></el-table-column>
   </el-table>
        <el-row>
          <el-col :span="12" v-for="(item, index) in bcimgList">
            <a :key="index" :href="item.fileUrl" :download="item.fileName" target="_blank" class="filecss0">补传资料{{item.fileName}} </a>
          </el-col>
        </el-row> -->

        <el-card class="box-card1">
        <div slot="header" class="clearfix">
        <span>补传文件</span>
        </div>
       <el-row>
          <el-col :span="12" v-for="(item, index) in bcimgList">
            <a :key="index" :href="item.fileUrl" :download="item.fileName" target="_blank" class="filecss0">补传资料{{item.fileName}} </a>
          </el-col>
        </el-row>
        </el-card>
        </el-dialog>
        </div>
</template>

<script>
import { listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback, exportFeedback,importObj,listComplaintInfo } from "@/api/afterSaleManage/feedback";
import { getToken } from '@/utils/auth'

export default {
  name: "Feedback",
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
      open1: false,
      open2: false,
      // 总条数
      total: 0,
      headers: {},
      // 问题反馈表格数据
      feedbackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
       fileList: [{
        name: '',
        url: ''
      }],
      //编辑上传接口
      uploadUrl: process.env.VUE_APP_BASE_API + "/customerservice/file/insertfile",
      //状态筛选
      afsOptions:[
        {
        value:'0',
        label:'处理中'
        },{
        value:'1',
        label:'已回复'
        },{
        value:'2',
        label:'已结案'
        }
      ],
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientId: undefined,
        orderNumber: undefined,
        containerNumber: undefined,
        isPay: undefined,
        status: undefined,
        signTime: undefined,
        email: undefined,
        problemContent: undefined,
        requirement: undefined,
        feedback: undefined,
      },
      // 表单参数
      form: {
        list:[]
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.headers = { 'Authorization': 'Bearer ' + getToken() }
    this.getList();
  },
  methods: {
    /** 查询问题反馈列表 */
    getList() {
      this.loading = true;
      listFeedback(this.queryParams).then(response => {
        this.feedbackList = response.rows;
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
      this.fileList = [{ name: '', url: '' }];
      this.form = {
        problemId: undefined,
        clientId: undefined,
        orderNumber: undefined,
        containerNumber: undefined,
        isPay: undefined,
        status: "0",
        signTime: undefined,
        email: undefined,
        problemContent: undefined,
        requirement: undefined,
        feedback: undefined,
        delFlag: undefined,
        createTime: undefined,
        updateTime: undefined,
        list:[]
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
      this.ids = selection.map(item => item.problemId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
  
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const problemId = row.problemId || this.ids
      getFeedback(problemId).then(response => {
        
        this.form = response.data;
        this.open = true;
        this.title = "问题反馈-编辑";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.problemId != undefined) {
            updateFeedback(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeedback(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const problemIds = row.problemId || this.ids;
      this.$confirm('是否确认删除所选数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFeedback(problemIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出当前问题反馈数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFeedback(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
     // 文件上传成功
    imgSuccess (file) {
      
      if (file.code === 200) {
        
        if (!this.form.list) {
          this.form.list = []
        }
        this.form.list.push({
          name:file.fileName,
          url:file.fileUrl
        });
      }
    },
    handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      //投诉资料查看
    handleSee(row) {
      const type = 0;
      
      listComplaintInfo({ problemId: row.problemId,type:0 }).then(response => {
        this.imgList = [];
        ;
        this.imgList = response.rows;
        listComplaintInfo({ problemId: row.problemId,type:1 }).then(response => {
         this.hfimgList = [];
        this.hfimgList = response.rows;
        this.open1 = true;
        });
      });
    },
     //补传资料查看
    handleSee1(row) {
      const type = 2;
      
      listComplaintInfo({ problemId: row.problemId,type:type }).then(response => {
        this.bcimgList = [];
        ;
        this.bcimgList = response.rows;
        this.open2 = true;
      });
    },
    handleRemove(file, fileList){
      console.log(file, fileList);
      this.form.list =[]
      fileList.map(item=>{
         this.form.list.push({
          name:item.name,
          url:item.url
        });
      })
    }
  }
};
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card1 {
    width: 480px;
  }
</style>