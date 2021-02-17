<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="班列号"
                    prop="classTNumber">
        <el-input v-model.trim="queryParams.classTNumber"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="线路"
                    prop="lineTypeid">
        <el-select v-model.trim="queryParams.lineTypeid"
                   clearable
                   style="width:230px;"
                   placeholder="请选择">
          <el-option v-for="item in lineOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="往返"
                    prop="classTEastandwest">
        <el-select v-model.trim="queryParams.classTEastandwest"
                   clearable
                   style="width:230px;"
                   placeholder="请选择">
          <el-option v-for="item in cteOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
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
                   v-hasPermi="['trains:Number:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['trains:Number:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="NumberList"
              border
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="班列号"
                       align="center"
                       prop="classTNumber" />
      <el-table-column label="线路"
                       align="center"
                       prop="lineTypeid">
        <template slot-scope="scope">
          <span v-if="scope.row.lineTypeid.search('0') != -1">中欧</span>
          <span v-if="scope.row.lineTypeid.search('2') != -1">中亚</span>
          <span v-if="scope.row.lineTypeid.search('3') != -1">中越</span>
          <span v-if="scope.row.lineTypeid.search('4') != -1">中俄</span>
        </template>
      </el-table-column>
      <el-table-column label="往返"
                       align="center"
                       prop="classTEastandwest">
        <template slot-scope="scope">
          <span v-if="scope.row.classTEastandwest.search('0') != -1">西向</span>
          <span v-if="scope.row.classTEastandwest.search('1') != -1">东向</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人"
                       align="center"
                       prop="updatename" />
      <el-table-column label="修改时间"
                       align="center"
                       prop="updatetime "
                       width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.updatetime">{{ parseTime(scope.row.updatetime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['trains:Number:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['trains:Number:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改班列号对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="班列号"
                      prop="classTNumber">
          <el-input v-model.trim="form.classTNumber"
                    placeholder="请输入班列号" />
        </el-form-item>
        <el-form-item label="线路"
                      prop="lineTypeid">
          <el-checkbox-group v-model.trim="form.lineTypeid">
            <el-checkbox v-for="dict in ltRadio"
                         :label="dict.value"
                         :key="dict.value">{{dict.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="往返"
                      prop="classTEastandwest">
          <el-checkbox-group v-model.trim="form.classTEastandwest">
            <el-checkbox v-for="dict in ctOptions"
                         :label="dict.value"
                         :key="dict.value">{{dict.label}}</el-checkbox>
          </el-checkbox-group>
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
import { listNumber, getNumber, delNumber, addNumber, updateNumber, exportNumber } from "@/api/trains/Number";

export default {
  name: 'Number',
  data() {
    return {
      lineOptions: [
        {
          value: '0',
          label: '中欧'
        },
        {
          value: '2',
          label: '中亚'
        }, {
          value: '3',
          label: '中越'
        }, {
          value: '4',
          label: '中俄'
        }
      ],
      cteOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      ltRadio: [
        {
          value: '0',
          label: '中欧'
        },
        {
          value: '2',
          label: '中亚'
        }, {
          value: '3',
          label: '中越'
        }, {
          value: '4',
          label: '中俄'
        }
      ],
      ctOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
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
      // 班列号表格数据
      NumberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classTId: undefined,
        classTNumber: undefined,
        lineTypeid: [],
        classTEastandwest: [],
        state: undefined
      },
      // 表单参数
      form: {
        updatename: undefined
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询班列号列表 */
    getList() {
      this.loading = true;
      listNumber(this.queryParams).then(response => {
        this.NumberList = response.rows;
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
        classTId: undefined,
        classTNumber: undefined,
        lineTypeid: '',
        classTEastandwest: '',
        state: undefined,
        updatename: undefined,
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
      this.ids = selection.map(item => item.classTId)
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
      this.form.lineTypeid = [];
      this.form.classTEastandwest = [];
      this.open = true;
      this.title = "添加班列号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const classTId = row.classTId || this.classTIds
      getNumber(classTId).then(response => {
        this.form = response.data;
        //线路
        if (response.data.lineTypeid.search(',') != -1) {
          this.form.lineTypeid = response.data.lineTypeid.split(',');
        } else {
          this.form.lineTypeid = response.data.lineTypeid.split('');
        };
        //往返
        if (response.data.classTEastandwest.search(',') != -1) {
          this.form.classTEastandwest = response.data.classTEastandwest.split(',');
        } else {
          this.form.classTEastandwest = response.data.classTEastandwest.split('');
        }
        this.open = true;
        this.title = "修改班列号";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      //线路
      if (this.form.lineTypeid.length == 1) {
        this.form.lineTypeid = this.form.lineTypeid.join("")
      } else {
        this.form.lineTypeid = this.form.lineTypeid.join(",")
      }
      //往返
      if (this.form.classTEastandwest.length == 1) {
        this.form.classTEastandwest = this.form.classTEastandwest.join("")
      } else {
        this.form.classTEastandwest = this.form.classTEastandwest.join(",")
      }
      this.form.updatename = this.$store.getters.name;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.classTId != undefined) {
            updateNumber(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addNumber(this.form).then(response => {
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
      //const ids = row.id || this.ids;
      const classTIds = row.classTId || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delNumber(classTIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有班列号数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportNumber(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>