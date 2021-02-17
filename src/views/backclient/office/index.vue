<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="办事处(中文)" prop="office">
        <el-input
          v-model.trim="queryParams.office"
          placeholder="请输入办事处中文"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="办事处(英文)" prop="enOffice">
        <el-input
          v-model.trim="queryParams.enOffice"
          placeholder="请输入办事处英文"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['backclient:office:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['backclient:office:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['backclient:office:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="officeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="办事处(中文)" align="center" prop="office" />
      <el-table-column label="办事处(英文)" align="center" prop="enOffice" />
      <el-table-column label="联系人(中文)" align="center" prop="contacts" />
      <el-table-column label="联系人(英文)" align="center" prop="enContacts" />
      <el-table-column label="负责区域(中文)" align="center" prop="area" />
      <el-table-column label="负责区域(英文)" align="center" prop="enArea" />
      <el-table-column label="联系电话" align="center" prop="tel" />
      <el-table-column label="邮箱" align="center" prop="email" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改办事处信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="办事处中文" prop="office">
          <el-input v-model.trim="form.office" placeholder="请输入办事处中文" />
        </el-form-item>
        <el-form-item label="办事处英文" prop="enOffice">
          <el-input v-model.trim="form.enOffice" placeholder="请输入办事处英文" />
        </el-form-item>
        <el-form-item label="联系人中文" prop="contacts">
          <el-input v-model.trim="form.contacts" placeholder="请输入联系人中文" />
        </el-form-item>
        <el-form-item label="联系人英文" prop="enContacts">
          <el-input v-model.trim="form.enContacts" placeholder="请输入联系人英文" />
        </el-form-item>
        <el-form-item label="负责区域中文" prop="area">
          <el-input v-model.trim="form.area" placeholder="请输入负责区域中文" />
        </el-form-item>
        <el-form-item label="负责区域英文 " prop="enArea">
          <el-input v-model.trim="form.enArea" placeholder="请输入负责区域英文" />
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model.trim="form.tel" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOffice, getOffice, delOffice, addOffice, updateOffice, exportOffice } from "@/api/backclient/office";
import { validatePhone, validateTelphone, validateEMail} from '@/api/validator'

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
      // 办事处信息表格数据
      officeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        office: undefined,
        enOffice: undefined,
        contacts: undefined,
        enContacts: undefined,
        area: undefined,
        enArea: undefined,
        tel: undefined,
        email: undefined,
        language: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        email: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          },{
            validator: validateEMail,
            trigger: "blur"
          }
        ],
        tel: [
         {
            required: true,
            message: "*必填项",
            trigger: "blur"
          },{
            validator: validatePhone,
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
    /** 查询办事处信息列表 */
    getList() {
      this.loading = true;
      listOffice(this.queryParams).then(response => {
        this.officeList = response.rows;
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
        officeId: undefined,
        office: undefined,
        enOffice: undefined,
        contacts: undefined,
        enContacts: undefined,
        area: undefined,
        enArea: undefined,
        tel: undefined,
        email: undefined,
        language: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined
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
      this.ids = selection.map(item => item.officeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加办事处信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const officeId = row.officeId || this.ids
      getOffice(officeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改办事处信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.officeId != undefined) {
            updateOffice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addOffice(this.form).then(response => {
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
      const officeIds = row.officeId || this.ids;
      this.$confirm('是否确认删除办事处信息编号为"' + officeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOffice(officeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>