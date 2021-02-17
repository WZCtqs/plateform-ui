<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="物品名称中文"
                    prop="goodsName">
        <el-input v-model.trim="queryParams.goodsName"
                  placeholder=""
                  clearable
                  style="width:200px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="物品名称英文"
                    prop="goodsName">
        <el-input v-model.trim="queryParams.goodsEnName"
                  placeholder=""
                  clearable
                  style="width:200px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="危险等级"
                    prop="noteLevel"
                    label-width="60px">
        <el-select v-model.trim="queryParams.noteLevel"
                   clearable
                   placeholder="请选择">
          <el-option v-for="item in options"
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
                   v-hasPermi="['risk:goods:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['risk:goods:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="goodsList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="特殊备注"
                       align="center"
                       prop="specialremark" />
      <el-table-column label="物品名称中文"
                       align="center"
                       prop="goodsName" />
      <el-table-column label="物品名称英文"
                       align="center"
                       prop="goodsEnName" />
      <el-table-column label="报关hs编码"
                       align="center"
                       prop="goodsReport" />
      <el-table-column label="清关hs编码"
                       align="center"
                       prop="goodsClearance" />
      <el-table-column label="危险等级"
                       align="center"
                       prop="noteLevel">
        <template slot-scope="scope">
          <span v-if="scope.row.noteLevel=='0'">危险品</span>
          <span v-if="scope.row.noteLevel=='1'">疑似危险品</span>
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
                     v-hasPermi="['risk:goods:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['risk:goods:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改危险品对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="100px">
        <el-form-item label="特殊备注"
                      prop="specialremark">
          <el-input v-model.trim="form.specialremark"
                    placeholder="请输入特殊备注" />
        </el-form-item>
        <el-form-item label="物品名称中文"
                      prop="goodsName">
          <el-input v-model.trim="form.goodsName"
                    placeholder="请输入物品名称中文" />
        </el-form-item>
        <el-form-item label="物品名称英文"
                      prop="goodsEnName">
          <el-input v-model.trim="form.goodsEnName"
                    placeholder="请输入物品名称英文" />
        </el-form-item>
        <el-form-item label="报关hs编码"
                      prop="goodsReport">
          <el-input v-model.trim="form.goodsReport"
                    placeholder="请输入报关hs编码" />
        </el-form-item>
        <el-form-item label="清关hs编码"
                      prop="goodsClearance">
          <el-input v-model.trim="form.goodsClearance"
                    placeholder="请输入清关hs编码" />
        </el-form-item>
        <el-form-item label="危险等级"
                      prop="noteLevel">
          <el-radio v-model.trim="form.noteLevel"
                    label="0">危险品</el-radio>
          <el-radio v-model.trim="form.noteLevel"
                    label="1">疑似危险品</el-radio>
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
  listGoods,
  getGoods,
  delGoods,
  addGoods,
  updateGoods,
  exportGoods
} from '@/api/risk/goods'

export default {
  name: 'Goods',
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
      // 危险品表格数据
      goodsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsName: undefined,
        goodsEnName: undefined,
        goodsReport: undefined,
        goodsClearance: undefined,
        noteLevel: undefined,
        createdate: undefined
      },
      // 表单参数
      form: {},
      options: [
        {
          value: '0',
          label: '危险品'
        },
        {
          value: '1',
          label: '疑似危险品'
        }
      ],
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询危险品列表 */
    getList() {
      this.loading = true
      listGoods(this.queryParams)
        .then(response => {
          this.goodsList = response.rows
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
        goodsId: undefined,
        specialremark: undefined,
        goodsName: undefined,
        goodsEnName: undefined,
        goodsReport: undefined,
        goodsClearance: undefined,
        noteLevel: undefined,
        createdate: undefined
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
      this.ids = selection.map(item => item.goodsId)
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
      this.title = '添加危险品'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const goodsId = row.goodsId || this.ids
      getGoods(goodsId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改危险品'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.goodsId != undefined) {
            updateGoods(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addGoods(this.form).then(response => {
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
      const goodsIds = row.goodsId || this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delGoods(goodsIds)
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
      this.$confirm('是否确认导出所有危险品数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportGoods(queryParams)
        })
        .then(response => {
          this.download(response.msg)
        })
        .catch(function() {})
    }
  }
}
</script>