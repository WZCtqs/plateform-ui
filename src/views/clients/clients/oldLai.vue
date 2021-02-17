<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
      <el-form-item label="单位名称" prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="组织机构代码" prop="clientCode">
        <el-input
          v-model.trim="queryParams.clientCode"
          placeholder="请输入组织机构代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="联系人" prop="clientContacts">
        <el-input
          v-model.trim="queryParams.clientContacts"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="注册号" prop="clientLoginUser">
        <el-input
          v-model.trim="queryParams.clientLoginUser"
          placeholder="请输入注册号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
  
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['clients:clients:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['clients:clients:edit']"
        >修改</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['clients:clients:remove']"
        >删除</el-button>
      </el-col>
 
      <el-col :span="1.5">
        <el-button type="primary" size="mini" :disabled="single" @click="handleDetail">查看</el-button>
      </el-col>

      
    </el-row>

    <el-table class="el-tableCss0" border v-loading="loading" :data="clientsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单位名称" align="center" prop="clientUnit" />
      <el-table-column label="组织机构代码" align="center" prop="clientCode" />
      <el-table-column label="法人代表" align="center" prop="clientLegalperson" />
      <el-table-column label="订舱人" align="center" prop="clientContacts" />
      <el-table-column label="备注" align="center" prop="examinfo" />
      <el-table-column label="订舱人邮箱" align="center" prop="clientEmail" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['clients:clients:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['clients:clients:remove']"
          >删除</el-button>
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

    <!-- 添加或修改客户管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="65%">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px" :disabled="formDisabled">
        <el-row>
          <el-col :span="10">
            <el-form-item label="法人代表" prop="clientLegalperson">
              <el-input v-model.trim="form.clientLegalperson" placeholder="请输入法人代表" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织机构代码" prop="clientCode">
              <el-input v-model.trim="form.clientCode" placeholder="请输入组织机构代码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="单位名称" prop="clientUnit">
              <el-input v-model.trim="form.clientUnit" placeholder="请输入单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位地址" prop="clientAddress">
              <el-input v-model.trim="form.clientAddress" placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="10">
            <el-form-item label="统一社会信用代码" prop="clientUnit">
              <el-input v-model.trim="form.clientUnit" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="订舱人" prop="clientContacts">
              <el-input v-model.trim="form.clientContacts" placeholder="请输入订舱人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订舱人邮件" prop="clientEmail">
              <el-input v-model.trim="form.clientEmail" placeholder="请输入订舱人邮件" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号" prop="clientTel">
              <el-input v-model.trim="form.clientTel" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机号" prop="clientPhone">
              <el-input v-model.trim="form.clientPhone" placeholder="请输入座机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="部门" prop="clientDept">
              <el-input v-model.trim="form.clientDept" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="clientZw">
              <el-input v-model.trim="form.clientZw" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="备注">
               <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入备注"
                v-model.trim="form.examinfo"
              ></el-input>
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
import {
  listClients,
  getClients,
  delClients,
  addClients,
  updateClients,
  exportClients
} from "@/api/clients/clients";
import { validatePhone,validateTelphone,validateEMail } from "@/api/validator";
import "@/assets/styles/selfCss0.css";

export default {
  data() {
    return {
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
      // 总条数
      total: 0,
      // 客户管理表格数据
      clientsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 0 帐户注销字典
      cancelaccountOptions: [],
      // 国内外客户，0是国内，1国外字典
      engChineseOptions: [],
      // 是否失信字典
      isNormalOptions: [],
      // 单位属性字典
      isDirectOptions: [],
      // 是否签订合同字典
      isSignOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientUnit: null,
        clientContacts: null,
        clientLoginUser: null,
        clientCode:null,
        // isNormal:'1',
        deadBeatType:'1'
      },
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
      // 表单参数
      form: {},
      formDisabled: false,
      // 表单校验
      rules: {
        clientLegalperson: [
          {
            required: true,
            message: "请输入法人代表",
            trigger: "blur"
          }
        ],
        clientCode: [
          {
            required: true,
            message: "请输入组织机构代码",
            trigger: "blur"
          }
        ],
        clientUnit: [
          {
            required: true,
            message: "请输入单位名称",
            trigger: "blur"
          }
        ],
        clientAddress: [
          {
            required: true,
            message: "请输入单位地址",
            trigger: "blur"
          }
        ],
        clientContacts: [
          {
            required: true,
            message: "请输入订舱人",
            trigger: "blur"
          }
        ],
        clientEmail: [
          {
            required: true,
            message: "请输入订舱人邮件",
            trigger: "blur"
          },{
            validator: validateEMail,
            trigger: "blur"
          }
        ],
        clientTel: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },{
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        clientPhone: [
          {
            required: true,
            message: "请输入座机号",
            trigger: "blur"
          },{
            validator:validateTelphone,
            trigger:'blur'
          }
        ],
        clientDept: [
          {
            required: true,
            message: "请输入部门",
            trigger: "blur"
          }
        ],
        clientZw: [
          {
            required: true,
            message: "请输入职务",
            trigger: "blur"
          }
        ],
         
      },
      
    };
  },
  created() {
    this.getList();
  
  },
  methods: {
    /** 查询客户管理列表 */
    getList() {
      this.loading = true;
      listClients(this.queryParams).then(response => {
        this.clientsList = response.rows;
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
        clientId: undefined,
        clientLegalperson: undefined, 
        clientCode: undefined,
        clientUnit: undefined,
        clientAddress: undefined,
        clientUnit: undefined,   
        clientContacts: undefined,   
        clientEmail: undefined,  
        clientTel: undefined, 
        clientPhone: undefined,  
        clientDept: undefined,  
        clientZw: undefined,  
        examinfo: undefined,
        deadBeatType:'1'
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
      this.arrs = selection.map(item => item);
      this.ids = selection.map(item => item.clientId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.formDisabled = false;
      this.open = true;
      this.title = "失信客户信息-添加";
    },
    /** 查看按钮操作 */
    handleDetail() {
      this.reset();
      const clientId = this.ids;
      getClients(clientId).then(response => {
        this.form = response.data;
        this.formDisabled = true;
        this.open = true;
        this.title = "失信客户信息-查看";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.formDisabled = false;
      this.reset();
      const clientId = row.clientId || this.ids;
      getClients(clientId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "失信客户信息-修改";
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
          } else {
            
            this.form["clientID"] = null;
            addClients(this.form).then(response => {
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
      const clientIds = row.clientId || this.ids;
      this.$confirm(
        '是否确认删除客户管理编号为"' + clientIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delClients(clientIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有客户管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportClients(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>

