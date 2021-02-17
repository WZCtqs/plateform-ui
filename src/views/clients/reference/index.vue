<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="名称" prop="mcheng">
        <el-input
          v-model.trim="queryParams.mcheng"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
          v-model.trim="queryParams.state"
          placeholder="请输入状态"
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
          v-hasPermi="['clients:reference:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['clients:reference:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['clients:reference:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['clients:reference:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="referenceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="id" />
      <el-table-column label="父id" align="center" prop="fid" />
      <el-table-column label="祖级列表" align="center" prop="ancestors" />
      <el-table-column label="名称" align="center" prop="mcheng" />
      <el-table-column label="状态" align="center" prop="state" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="0  中文  1 英文" align="center" prop="yuyan" />
      <el-table-column label="0  中文  1 英文" align="center" prop="westMerchandiser" />
      <el-table-column label="0  中文  1 英文" align="center" prop="westMerchandiserId" />
      <el-table-column label="0  中文  1 英文" align="center" prop="eastMerchandiser" />
      <el-table-column label="0  中文  1 英文" align="center" prop="eastMerchandiserId" />
      <el-table-column label="邮箱以分号隔开" align="center" prop="mails" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['clients:reference:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['clients:reference:remove']"
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

    <!-- 添加或修改推荐人管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父id" prop="fid">
          <el-input v-model.trim="form.fid" placeholder="请输入父id" />
        </el-form-item>
        <el-form-item label="名称" prop="mcheng">
          <el-input v-model.trim="form.mcheng" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model.trim="form.state" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.trim="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="0  中文  1 英文" prop="yuyan">
          <el-input v-model.trim="form.yuyan" placeholder="请输入0  中文  1 英文" />
        </el-form-item>
        <el-form-item label="0  中文  1 英文" prop="westMerchandiser">
          <el-input v-model.trim="form.westMerchandiser" placeholder="请输入0  中文  1 英文" />
        </el-form-item>
        <el-form-item label="0  中文  1 英文" prop="westMerchandiserId">
          <el-input v-model.trim="form.westMerchandiserId" placeholder="请输入0  中文  1 英文" />
        </el-form-item>
        <el-form-item label="0  中文  1 英文" prop="eastMerchandiser">
          <el-input v-model.trim="form.eastMerchandiser" placeholder="请输入0  中文  1 英文" />
        </el-form-item>
        <el-form-item label="0  中文  1 英文" prop="eastMerchandiserId">
          <el-input v-model.trim="form.eastMerchandiserId" placeholder="请输入0  中文  1 英文" />
        </el-form-item>
        <el-form-item label="邮箱以分号隔开" prop="mails">
          <el-input v-model.trim="form.mails" type="textarea" placeholder="请输入内容" />
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
import { listReference, getReference, delReference, addReference, updateReference, exportReference } from "@/api/clients/reference";

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
      referenceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mcheng: undefined,
        state: undefined,
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
    /** 查询推荐人管理列表 */
    getList() {
      this.loading = true;
      listReference(this.queryParams).then(response => {
        this.referenceList = response.rows;
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
        fid: undefined,
        ancestors: undefined,
        mcheng: undefined,
        state: undefined,
        sort: undefined,
        yuyan: undefined,
        westMerchandiser: undefined,
        westMerchandiserId: undefined,
        eastMerchandiser: undefined,
        eastMerchandiserId: undefined,
        mails: undefined
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
      this.title = "添加推荐人管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReference(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改推荐人管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateReference(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addReference(this.form).then(response => {
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
      this.$confirm('是否确认删除推荐人管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delReference(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有推荐人管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportReference(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>