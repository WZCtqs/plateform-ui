<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="messageType">
        <el-select
          v-model.trim="queryParams.messageType"
          clearable
          style="width:120px;"
          placeholder="类型分类"
        >
          <el-option
            v-for="item in lxOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="typeName">
        <el-input
          v-model.trim="queryParams.typeName"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basicInfo:msgInstall:add']"
          >新建类型</el-button
        >
      </el-col>
      <el-col><p>注:√号代表已选择;×代表未选择;-代表待设置</p></el-col>
    </el-row>

    <el-table v-loading="loading" :data="messageSetList">
      <el-table-column width="55" align="center" />
      <el-table-column label="类型分类" align="center" prop="messageType">
        <template slot-scope="scope">
          <span v-if="scope.row.messageType == 0">单证</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称" align="center" prop="typeName" />
      <!-- <el-table-column label="邮件" align="center" prop="messageType" /> -->
      <el-table-column label="邮件" align="center" prop="emailSend">
        <template slot-scope="scope">
          <span v-if="scope.row.emailSend == 0" class="el-icon-circle-check" style="color: green"
            ></span>
          <span v-else-if="scope.row.emailSend == 1" class="el-icon-circle-close" style="color: red"></span>
          <span v-else class="el-icon-remove-outline" style="color: black"></span>
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleUpdate(scope.row)"
             v-hasPermi="['basicInfo:msgInstall:edit']"
            >编辑
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="站内消息" align="center" prop="typeName" /> -->
      <el-table-column label="站内消息" align="center" prop="siteSend">
        <template slot-scope="scope">
          <span v-if="scope.row.siteSend == 0" class="el-icon-circle-check" style="color: green"
            ></span
          >
          <span v-if="scope.row.siteSend == 1" class="el-icon-circle-close" style="color: red"></span>
          <span v-else class="el-icon-remove-outline" style="color: black"></span>
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleUpdate1(scope.row)"
            >编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate2(scope.row)"
            v-hasPermi="['system:messageSet:edit']"
            >设置</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basicInfo:msgInstall:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改消息设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型分类" prop="messageType">
          <el-select v-model.trim="form.messageType">
            <el-option
              v-for="item in lxflOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型名称" prop="typeName" v-if="form.messageType === 1">
          <el-input v-model.trim="form.typeName" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="单证名称:" prop="documentId" v-if="form.messageType === 0">
          <el-select v-model.trim="form.documentId" clearable placeholder="请选择">
            <el-option
              v-for="item in docTypeOptions"
              :key="item.id"
              :label="item.fileTypeText"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑邮箱配置 -->
    <el-dialog :title="title" :visible.sync="open1" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邮件标题" prop="emailSubject">
          <el-input v-model.trim="form.emailSubject" placeholder="请输入邮件标题" />
        </el-form-item>
        <el-form-item label="收件人" prop="emailRecipient">
          <el-input v-model.trim="form.emailRecipient" placeholder="请输入收件人" />
        </el-form-item>
        <el-form-item label="邮件模板内容" prop="emailContent">
          <el-input
            v-model.trim="form.emailContent"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑站内消息配置 -->
    <el-dialog :title="title" :visible.sync="open2" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="站内模板标题" prop="siteSubject">
          <el-input
            v-model.trim="form.siteSubject"
            placeholder="请输入站内模板标题"
          />
        </el-form-item>
        <el-form-item label="站内模板收件人" prop="siteRecipient">
          <el-input
            v-model.trim="form.siteRecipient"
            placeholder="请输入站内模板收件人"
          />
        </el-form-item>
        <el-form-item label="站内模板内容" prop="siteContent">
          <el-input
            v-model.trim="form.siteContent"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 消息设置配置 -->
    <el-dialog :title="title" :visible.sync="open3" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="是否选用邮件" prop="emailSend">
          <el-radio-group v-model.trim="form.emailSend">
            <el-radio
              v-for="dict in yjOptions"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否选用站内信" prop="siteSend">
          <el-radio-group v-model.trim="form.siteSend">
            <el-radio
              v-for="dict in znxOptions"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel3">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMessageSet,
  getMessageSet,
  delMessageSet,
  addMessageSet,
  updateMessageSet,
  exportMessageSet,
  getDocType
} from "@/api/basicInfo/msgInstall";

export default {
  name: "MsgInstall",
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
      // 消息设置表格数据
      messageSetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      open2: false,
      open3: false,
      //新建单证名称选项
      docTypeOptions: [],
      //邮件维护
      yjOptions: [
        {
          label: "是",
          value: 0
        },
        {
          label: "否",
          value: 1
        }
      ],
      //站内信维护
      znxOptions: [
        {
          label: "是",
          value: 0
        },
        {
          label: "否",
          value: 1
        }
      ],
      //类型分类
      lxOptions: [
        {
          label: "单证",
          value: 0
        },
        {
          label: "其他",
          value: 1
        },
        {
          label: "全部",
          value: ""
        }
      ],
      lxflOptions: [
        {
          label: "单证",
          value: 0
        },
        {
          label: "其他",
          value: 1
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        messageType: undefined,
        typeName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        delFlag: [
          {
            required: true,
            message: "删除标志0正常1删除不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询消息设置列表 */
    getList() {
      this.loading = true;
      listMessageSet(this.queryParams).then(response => {
        this.messageSetList = response.rows;
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
    cancel3() {
      this.open3 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        messageType: undefined,
        emailId: undefined,
        //documentId: undefined,
        typeName: undefined,
        emailSubject: undefined,
        emailRecipient: undefined,
        emailContent: undefined,
        siteSubject: undefined,
        siteRecipient: undefined,
        siteContent: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        documentId: undefined,
        updateTime: undefined,
        emailSend: 2,
        siteSend: 2
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

    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      // this.open = true;
      // this.title = "添加消息设置";
      getDocType().then(response => {
        this.docTypeOptions = response;
        
        this.open = true;
        this.title = "新建消息类型";
      });
    },
    /** 邮件修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMessageSet(id).then(response => {
        this.form = response.data;
        this.open1 = true;
        this.title = "邮箱模板编辑";
      });
    },
    /** 站内消息修改按钮操作 */
    handleUpdate1(row) {
      this.reset();
      const id = row.id || this.ids;
      getMessageSet(id).then(response => {
        this.form = response.data;
        this.open2 = true;
        this.title = "站内消息模板编辑";
      });
    },
    /** 设置操作 */
    handleUpdate2(row) {
      this.reset();
      const id = row.id || this.ids;
      getMessageSet(id).then(response => {
        this.form = response.data;
        
        this.open3 = true;
        this.title = "消息设置编辑";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMessageSet(this.form).then(response => {
              
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open1 = false;
                this.open2 = false;
                this.open3 = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMessageSet(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除消息设置编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delMessageSet(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    //编辑
    handleSee(row) {},
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有消息设置数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportMessageSet(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
