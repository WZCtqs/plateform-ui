<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="100px">
      <el-form-item label="标记企业类型"
                    prop="signType">
        <el-select v-model.trim="queryParams.signType"
                   clearable
                   style="width:150px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in lineOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业名称"
                    prop="signName">
        <el-input v-model.trim="queryParams.signName"
                  placeholder=""
                  clearable
                  style="width:150px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="标记原因"
                    prop="signReason">
        <el-input v-model.trim="queryParams.signReason"
                  placeholder=""
                  clearable
                  style="width:150px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['risk:customersign:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['risk:customersign:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="customersignList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="标记企业名称"
                       align="center"
                       prop="signName" />
      <el-table-column label="标记企业类型"
                       align="center"
                       prop="signType">
        <template slot-scope="scope">
          <span v-if="scope.row.signType==0">收货方</span>
          <span v-else-if="scope.row.signType==1">发货方</span>
          <span v-else>订舱方</span>
        </template>
      </el-table-column>
      <el-table-column label="标记原因"
                       align="center"
                       prop="signReason" />
      <el-table-column label="标记时间"
                       align="center"
                       prop="createdate"
                       width="180" />
      <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdate) }}</span>
        </template> -->
      <!-- </el-table-column> -->
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['risk:customersign:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['risk:customersign:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改客户标记对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="130px">
        <el-form-item label="标记企业名称"
                      prop="signName">
          <el-input v-model.trim="form.signName"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="标记企业类型">
          <el-radio-group v-model.trim="form.signType">
            <el-radio v-for="dict in ltRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标记理由"
                      prop="signReason">
          <el-input v-model.trim="form.signReason"
                    type="textarea"
                    :rows="2"
                    placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCustomersign, getCustomersign, delCustomersign, addCustomersign, updateCustomersign, exportCustomersign } from "@/api/risk/customersign";

export default {
  name: 'Customersign',
  data() {
    return {
      lineOptions: [
        {
          value: '0',
          label: '收货方'
        },
        {
          value: '1',
          label: '发货方'
        },
        {
          value: '2',
          label: '订舱方'
        }
      ],
      ltRadio: [
        {
          value: '0',
          label: '收货方'
        },
        {
          value: '1',
          label: '发货方'
        },
        {
          value: '2',
          label: '订舱方'
        }
      ],
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
      // 客户标记表格数据
      customersignList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        signName: undefined,
        signType: undefined,
        signReason: undefined,
        isSign: undefined,
        createdate: undefined
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
    /** 查询客户标记列表 */
    getList() {
      this.loading = true;
      listCustomersign(this.queryParams).then(response => {
        this.customersignList = response.rows;
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
        signId: undefined,
        signName: undefined,
        signType: undefined,
        signReason: undefined,
        isSign: undefined,
        createdate: undefined
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
      this.ids = selection.map(item => item.signId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客户标记";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const signId = row.signId || this.ids
      getCustomersign(signId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户标记";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.signId != undefined) {
            updateCustomersign(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCustomersign(this.form).then(response => {
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
      const signIds = row.signId || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delCustomersign(signIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有客户标记数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportCustomersign(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>