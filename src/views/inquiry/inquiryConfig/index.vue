<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="inquiryConfigList" @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <!--<el-table-column label="类型" align="center" prop="typeKey" />-->
      <el-table-column label="类型" align="center" prop="typeText" />
      <el-table-column label="禁用/启用" align="center" >
        <template slot-scope="scope">

          <el-switch
            v-model.trim="scope.row.active"
            active-text="启用"
            inactive-text="禁用"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(scope.row)"
            v-hasPermi="['inquiry:inquiryConfig:edit']">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime"/>
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['inquiry:inquiryConfig:edit']"
          >修改</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <!--<pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 添加或修改询价系统设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="typeKey">
          <el-input v-model.trim="form.typeKey" placeholder="请输入类型" />
        </el-form-item>
        <el-form-item label="值">
          <el-radio-group v-model.trim="form.value">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
import { listInquiryConfig, getInquiryConfig, delInquiryConfig, addInquiryConfig, updateInquiryConfig, exportInquiryConfig } from "@/api/inquiry/inquiryConfig";

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
      // 询价系统设置表格数据
      inquiryConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeKey: undefined,
        value: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },

    };
},
  created() {
    this.getList();
  },
  methods: {
    /** 查询询价系统设置列表 */
    getList() {
      this.loading = true;
      getInquiryConfig().then(response => {
        debugger
        this.inquiryConfigList = response.data;
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
        typeKey: undefined,
        value: "0",
        createTime: undefined,
        updateTime: undefined,
        createBy: undefined,
        updateBy: undefined
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

    handleStatusChange(row) {
      let text = row.active? "启用" : "停用";
      this.$confirm('确认要"' + text + '"次月询价功能吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        row.typeValue = row.active ? 0 : 1;
        return updateInquiryConfig(row);
      }).then(() => {
        this.msgSuccess(text + "成功");
        this.getList();
      }).catch(()=> {
        this.getList()
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加询价系统设置";
    },
    /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   const id = row.id || this.ids
    //   getInquiryConfig(id).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改询价系统设置";
    //   });
    // },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateInquiryConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInquiryConfig(this.form).then(response => {
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
      this.$confirm('是否确认删除询价系统设置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInquiryConfig(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有询价系统设置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInquiryConfig(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
