<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="订单id" prop="orderId">
        <el-input
          v-model.trim="queryParams.orderId"
          placeholder="请输入订单id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="托书编号" prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单证类型" prop="fileTypeKey">
        <el-input
          v-model.trim="queryParams.fileTypeKey"
          placeholder="请输入单证类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单证地址url" prop="fileUrl">
        <el-input
          v-model.trim="queryParams.fileUrl"
          placeholder="请输入单证地址url"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱号" prop="containerNo">
        <el-input
          v-model.trim="queryParams.containerNo"
          placeholder="请输入箱号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="箱型" prop="containerType">
        <el-select v-model.trim="queryParams.containerType" placeholder="请选择箱型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传时间" prop="uploadTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model.trim="queryParams.uploadTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择上传时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上传着" prop="uploadBy">
        <el-input
          v-model.trim="queryParams.uploadBy"
          placeholder="请输入上传着"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传者部门" prop="uploadDept">
        <el-input
          v-model.trim="queryParams.uploadDept"
          placeholder="请输入上传者部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源系统" prop="formSystem">
        <el-input
          v-model.trim="queryParams.formSystem"
          placeholder="请输入来源系统"
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
          v-hasPermi="['document:order:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['document:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['document:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['document:order:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="documentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="订单id" align="center" prop="orderId" />
      <el-table-column label="托书编号" align="center" prop="orderNumber" />
      <el-table-column label="单证类型" align="center" prop="fileTypeKey" />
      <el-table-column label="单证地址url" align="center" prop="fileUrl" />
      <el-table-column label="箱号" align="center" prop="containerNo" />
      <el-table-column label="箱型" align="center" prop="containerType" />
      <el-table-column label="上传时间" align="center" prop="uploadTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.uploadTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传着" align="center" prop="uploadBy" />
      <el-table-column label="上传者部门" align="center" prop="uploadDept" />
      <el-table-column label="来源系统" align="center" prop="formSystem" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['document:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['document:order:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model.trim="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="托书编号" prop="orderNumber">
          <el-input v-model.trim="form.orderNumber" placeholder="请输入托书编号" />
        </el-form-item>
        <el-form-item label="单证类型" prop="fileTypeKey">
          <el-input v-model.trim="form.fileTypeKey" placeholder="请输入单证类型" />
        </el-form-item>
        <el-form-item label="单证地址url" prop="fileUrl">
          <el-input v-model.trim="form.fileUrl" placeholder="请输入单证地址url" />
        </el-form-item>
        <el-form-item label="箱号" prop="containerNo">
          <el-input v-model.trim="form.containerNo" placeholder="请输入箱号" />
        </el-form-item>
        <el-form-item label="箱型">
          <el-select v-model.trim="form.containerType" placeholder="请选择箱型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传时间" prop="uploadTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model.trim="form.uploadTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上传时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上传着" prop="uploadBy">
          <el-input v-model.trim="form.uploadBy" placeholder="请输入上传着" />
        </el-form-item>
        <el-form-item label="上传者部门" prop="uploadDept">
          <el-input v-model.trim="form.uploadDept" placeholder="请输入上传者部门" />
        </el-form-item>
        <el-form-item label="来源系统" prop="formSystem">
          <el-input v-model.trim="form.formSystem" placeholder="请输入来源系统" />
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
import { listDocument, getDocument, delDocument, addDocument, updateDocument, exportDocument } from "@/api/document/document_order";

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
      // 【请填写功能名称】表格数据
      documentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: undefined,
        orderNumber: undefined,
        fileTypeKey: undefined,
        fileUrl: undefined,
        containerNo: undefined,
        containerType: undefined,
        uploadTime: undefined,
        uploadBy: undefined,
        uploadDept: undefined,
        formSystem: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderId: [
          { required: true, message: "订单id不能为空", trigger: "blur" }
        ],        orderNumber: [
          { required: true, message: "托书编号（舱位号）不能为空", trigger: "blur" }
        ],        fileTypeKey: [
          { required: true, message: "单证类型不能为空", trigger: "blur" }
        ],        fileUrl: [
          { required: true, message: "单证地址url不能为空", trigger: "blur" }
        ],        uploadTime: [
          { required: true, message: "上传时间不能为空", trigger: "blur" }
        ],        formSystem: [
          { required: true, message: "来源系统不能为空", trigger: "blur" }
        ]      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listDocument(this.queryParams).then(response => {
        this.documentList = response.rows;
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
        orderNumber: undefined,
        fileTypeKey: undefined,
        fileUrl: undefined,
        containerNo: undefined,
        containerType: undefined,
        uploadTime: undefined,
        uploadBy: undefined,
        uploadDept: undefined,
        formSystem: undefined
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDocument(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDocument(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDocument(this.form).then(response => {
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
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDocument(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDocument(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
