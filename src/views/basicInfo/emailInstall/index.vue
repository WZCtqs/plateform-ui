<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basicInfo:emailInstall:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basicInfo:emailInstall:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdatefs"   
           v-hasPermi="['basicInfo:emailInstall:send']"
          >发送测试邮件</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basicInfo:emailInstall:remove']"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="emailSetList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="账号" align="center" prop="account" />
      <el-table-column label="密码" align="center" prop="password" />
      <el-table-column label="SMTP服务器" align="center" prop="smtpSever" />
      <el-table-column label="SMTP端口号" align="center" prop="smtpPort" />
      <el-table-column
        label="邮件发送认证"
        align="center"
        prop="emailAuthentication"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.emailAuthentication == 0">需要</span>
          <span v-else>不需要</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加邮件配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model.trim="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" placeholder="请输入密码" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改邮件配置对话框 -->
    <el-dialog :title="title" :visible.sync="open1" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model.trim="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item label="SMTP服务器" prop="smtpSever">
          <el-input v-model.trim="form.smtpSever" placeholder="请输入SMTP服务器" />
        </el-form-item>
        <el-form-item label="SMTP端口号" prop="smtpPort">
          <el-input v-model.trim="form.smtpPort" placeholder="请输入SMTP端口号" />
        </el-form-item>
        <el-form-item label="邮件发送认证" prop="emailAuthentication">
          <el-select v-model.trim="form.emailAuthentication">
            <el-option
              v-for="item in yjOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 发送测试邮件对话框 -->
    <el-dialog :title="title" :visible.sync="open2" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接收者邮箱" prop="receiveEmail">
          <el-input
            v-model.trim="form.receiveEmail"
            placeholder="请输入接收者邮箱"
          />
        </el-form-item>
        <el-form-item label="邮件主题" prop="subject">
          <el-input v-model.trim="form.subject" placeholder="请输入邮件主题" />
        </el-form-item>
        <el-form-item label="邮件内容" prop="content">
          <el-input v-model.trim="form.content" placeholder="请输入邮件内容" />
        </el-form-item>
        <!-- <el-form-item label="发件人邮件" prop="sendEmail">
          <el-input v-model.trim="form.sendEmail" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="发件人邮件密码" prop="password">
          <el-input v-model.trim="form.password" placeholder="请输入密码" />
        </el-form-item>
          <el-form-item label="SMTP服务器" prop="smtpSever">
          <el-input v-model.trim="form.smtpSever" placeholder="请输入SMTP服务器" />
        </el-form-item>
       
        <el-form-item label="邮件发送认证"
                      prop="emailAuthentication">
          <el-select v-model.trim="form.emailAuthentication">
            <el-option v-for="item in yjOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listEmailSet,
  getEmailSet,
  delEmailSet,
  addEmailSet,
  updateEmailSet,
  exportEmailSet,
  sendEmailSet
} from "@/api/basicInfo/emailInstall";
import { validatePhone, validateTelphone, validateEMail} from '@/api/validator'
export default {
  name: "EmailInstall",
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
      // 邮件配置表格数据
      emailSetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      open2: false,
      yjOptions: [
        {
          label: "需要",
          value: 0
        },
        {
          label: "不需要",
          value: 1
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        smtpSever: undefined,
        smtpPort: undefined,
        name: undefined,
        account: undefined,
        password: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         account: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          },{
            validator: validateEMail,
            trigger: "blur"
          }
        ],
         receiveEmail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          },{
            validator: validateEMail,
            trigger: "blur"
          }
        ],
        delFlag: [
          {
            required: true,
            message: "删除标志0正常1删除不能为空",
            trigger: "blur"
          }
        ]
      },
      multipleSelection: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询邮件配置列表 */
    getList() {
      this.loading = true;
      listEmailSet(this.queryParams).then(response => {
        this.emailSetList = response.rows;
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
    cancel1() {
      this.open1 = false;
      this.reset();
    },
    cancel2() {
      this.open2 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        smtpSever: undefined,
        smtpPort: undefined,
        emailAuthentication: undefined,
        name: undefined,
        account: undefined,
        password: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        sendEmail: undefined,
        receiveEmail: undefined,
        subject: undefined,
        content: undefined
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.multipleSelection = selection
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加邮件配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getEmailSet(id).then(response => {
        this.form = response.data;
        this.open1 = true;
        this.title = "修改邮件配置";
      });
    },
    /** 发送操作 */
    handleUpdatefs() {
      this.reset();
      const id = this.multipleSelection[0].id;
      getEmailSet(id).then(response => {
        this.form = response.data;
        
        this.open2 = true;
        this.title = "发送测试邮件";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateEmailSet(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open1 = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addEmailSet(this.form).then(response => {
              
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
    /** 发送按钮 */
    submitForm1: function() {
      this.$refs["form"].validate(valid => {
        
        if (valid) {
          if (this.form.id != undefined) {
            const smtpSever = this.form.smtpSever;
            const emailAuthentication = this.form.emailAuthentication;
            const sendEmail = this.form.account;
            const password = this.form.password;
            const receiveEmail = this.form.receiveEmail;
            const subject = this.form.subject;
            const content = this.form.content;
            sendEmailSet({
              smtpSever,
              emailAuthentication,
              sendEmail,
              password,
              receiveEmail,
              subject,
              content
            }).then(response => {
              if (response.code === 200) {
                this.msgSuccess("发送成功");
                this.open2 = false;
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除所选数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delEmailSet(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>
