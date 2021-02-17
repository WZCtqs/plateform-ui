<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="客户名称" prop="clientUnit">
        <el-input
          v-model="queryParams.clientUnit"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改记录" prop="changeRecord">
        <el-input
          v-model="queryParams.changeRecord"
          placeholder="请输入修改记录"
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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['inquiry:record:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['inquiry:record:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['inquiry:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['inquiry:record:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="recordList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column label="客户名称" align="center" prop="clientUnit" />
      <el-table-column
        label="询价时间"
        align="center"
        prop="inquiryTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inquiryTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改记录" align="center" prop="changeRecord" />
      <el-table-column label="操作用户" align="center" prop="userName" />
      <el-table-column
        label="修改时间"
        align="center"
        prop="changeTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.changeTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['inquiry:record:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['inquiry:record:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改询价结果费用修改记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="询价id" prop="inquiryId">
          <el-input v-model="form.inquiryId" placeholder="请输入询价id" />
        </el-form-item>
        <el-form-item label="询价结果id" prop="inquiryResultId">
          <el-input
            v-model="form.inquiryResultId"
            placeholder="请输入询价结果id"
          />
        </el-form-item>
        <el-form-item label="修改记录" prop="changeRecord">
          <el-input v-model="form.changeRecord" placeholder="请输入修改记录" />
        </el-form-item>
        <el-form-item label="操作用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入操作用户id" />
        </el-form-item>
        <el-form-item label="变更时间" prop="changeTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.changeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择变更时间"
          >
          </el-date-picker>
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
import {
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
  exportRecord,
} from "@/api/inquiry/record";

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
      // 询价结果费用修改记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientUnit: undefined,
        changeRecord: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inquiryResultId: [
          { required: true, message: "询价结果id不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.queryParams["deptCode"] = this.$store.getters.deptCode;
    this.getList();
  },
  methods: {
    /** 查询询价结果费用修改记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then((response) => {
        this.recordList = response.rows;
        this.total = response.total;
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
        inquiryId: undefined,
        inquiryResultId: undefined,
        changeRecord: undefined,
        userId: undefined,
        changeTime: undefined,
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
      this.queryParams["deptCode"] = this.$store.getters.deptCode;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加询价结果费用修改记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改询价结果费用修改记录";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRecord(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRecord(this.form).then((response) => {
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
        '是否确认删除询价结果费用修改记录编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delRecord(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有询价结果费用修改记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRecord(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>