<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="类型"
                    prop="type">
        <el-select v-model.trim="queryParams.type"
                   placeholder="请选择类型"
                   clearable
                   size="small">
          <el-option v-for="item in typeOptions"
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
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['enquiryPrice:standard:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['enquiryPrice:standard:remove']">删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading"
              :data="standardList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="类型"
                       align="center"
                       prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type==0">场站收费标准</span>
          <span v-else-if="scope.row.type==1">关检务收费标准</span>
          <span v-else-if="scope.row.type==2">集装箱超期使用费收取标准</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间"
                       align="center"
                       prop="type">
        <template slot-scope="scope">
          <span>{{scope.row.validStartDate}}</span>
          -
          <span>{{scope.row.validEndDate }}</span>
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
                     v-hasPermi="['enquiryPrice:standard:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['enquiryPrice:standard:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改收费标准对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="70%">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="类型">
              <el-select v-model.trim="form.type"
                         placeholder="请选择类型">
                <el-option v-for="item in cleOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-radio v-model.trim="language"
                        label="zh">中文</el-radio>
              <el-radio v-model.trim="language"
                        label="en">英文</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="有效期"
                      prop="validStartDate">
          <el-date-picker clearable
                          size="small"
                          style="width: 150px"
                          :picker-options="startTimePicker"
                          v-model.trim="form.validStartDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="">
          </el-date-picker>到
        </el-form-item>
        <el-form-item label=""
                      prop="validEndDate">
          <el-date-picker clearable
                          size="small"
                          style="width: 150px"
                          v-model.trim="form.validEndDate  "
                          type="date"
                          :picker-options="endTimePicker"
                          value-format="yyyy-MM-dd"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容"
                      prop="content">
          <template>
            <tinymce id="d1"
                     v-model.trim="form.content"
                     :other_options="{min_height:360,'height':300}">
            </tinymce>
          </template>
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
import {
  listStandard,
  getStandard,
  delStandard,
  addStandard,
  updateStandard,
  exportStandard
} from '@/api/enquiryPrice/standard'
import Vue from 'vue'
import tinymce from 'vue-tinymce-editor'
Vue.component('tinymce', tinymce)
export default {
  name: 'Standard',
  data() {
    return {
      //筛选类型下拉框
      typeOptions: [
        {
          value: '0',
          label: '场站收费标准'
        },
        {
          value: '1',
          label: '关检务收费标准'
        },
        {
          value: '2',
          label: '集装箱超期使用费收取标准'
        }
      ],
      language: 'zh',
      //新增编辑类型下拉框
      cleOptions: [
        {
          value: '0',
          label: '场站收费标准'
        },
        {
          value: '1',
          label: '关检务收费标准'
        },
        {
          value: '2',
          label: '集装箱超期使用费收取标准'
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
      // 收费标准表格数据
      standardList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        validStartDate: [
          { required: true, message: '请选择有效期开始日期', trigger: 'blur' }
        ],
        validEndDate: [
          { required: true, message: '请选择有效期结束日期', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    startTimePicker() {
      return {
        disabledDate: time =>
          this.form.validEndDate
            ? time.getTime() > new Date(this.form.validEndDate).getTime()
            : false
      }
    },
    endTimePicker() {
      return {
        disabledDate: time =>
          this.form.validStartDate
            ? time.getTime() < new Date(this.form.validStartDate).getTime()
            : false
      }
    }
  },
  methods: {
    /** 查询收费标准列表 */
    getList() {
      this.loading = true
      listStandard(this.queryParams)
        .then(response => {
          this.standardList = response.rows
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        type: undefined,
        content: '<div>测试</div>'
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加收费标准'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id

      getStandard(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改收费标准'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          delete this.form.createTime
          if (this.form.id != undefined) {
            updateStandard(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addStandard(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delStandard(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有收费标准数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportStandard(queryParams)
        })
        .then(response => {
          this.download(response.msg)
        })
        .catch(function() {})
    }
  }
}
</script>