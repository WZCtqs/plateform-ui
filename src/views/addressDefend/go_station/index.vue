<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="班列编号"
                    prop="classNum">
        <el-input v-model.trim="queryParams.classNum"
                  placeholder="请输入班列编号"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="班列日期" prop="classDate">
        <el-input
          v-model.trim="queryParams.classDate"
          placeholder="请输入班列日期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item prop="classDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 200px"
                        v-model.trim="queryParams.classDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择选择班列日期">
        </el-date-picker>
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

      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 size="small"
                 type="primary"
                 icon="edit"
                 @click="handleUpload"
                 v-hasPermi="['go:station:import']">导入</el-button>
      <input type="file"
             @change="getFile($event)"
             style="display:none"
             ref="menuFile" />
      <el-button type="success"
                 icon="el-icon-edit"
                 size="mini"
                 :disabled="single"
                 @click="handleUpdate"
                 v-hasPermi="['go:station:edit']">修改</el-button>
    </el-form>
    <el-table v-loading="loading"
              :data="goStationList"
              border
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       align="center" />
      <el-table-column label="班列编号"
                       align="center"
                       min-width="15.00%"
                       prop="classNum" />
      <el-table-column label="班列日期"
                       align="center"
                       min-width="10.00%"
                       prop="classDate">
        <template slot-scope="scope">
          <span v-if="scope.row.classDate&&scope.row.classDate.length>9">{{scope.row.classDate.substring(0,10)}}</span>
          <span v-else>{{scope.row.classDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="口岸"
                       align="center"
                       min-width="10.00%"
                       prop="port" />
      <el-table-column label="下货站"
                       align="center"
                       min-width="10.00%"
                       prop="downStation" />
      <el-table-column label="车站地址"
                       align="center"
                       prop="stationAddress"
                       min-width="50.00%"
                       show-overflow-tooltip />
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="车站地址"
                      prop="stationAddress">
          <el-input v-model.trim="form.stationAddress"
                    :rows="6"
                    type="textarea"
                    placeholder="请输入内容" />
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
  listGoStation,
  getGoStation,
  delGoStation,
  addGoStation,
  updateGoStation,
  importObj
} from '@/api/addressDefend/go_station'

export default {
  name: 'Go_station',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址表格数据
      goStationList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      upath: null,
      //文件参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classId: undefined,
        port: undefined,
        downStation: undefined,
        code: undefined,
        stationAddress: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        delFlag: [
          {
            required: true,
            message: '删除标志0正常1删除不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址列表 */
    getList() {
      this.loading = true
      listGoStation(this.queryParams)
        .then(response => {
          this.goStationList = response.rows
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
        classId: undefined,
        port: undefined,
        downStation: undefined,
        code: undefined,
        stationAddress: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getGoStation(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '场站地址-编辑'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateGoStation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addGoStation(this.form).then(response => {
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

    // 导入操作
    handleUpload() {
      this.$refs.menuFile.value = ''
      this.$refs.menuFile.click()
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0]
      var zipFormData = new FormData()
      zipFormData.append('file', this.upath) //file对应传输的文件
      importObj(zipFormData).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '提示',
            message: res.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>