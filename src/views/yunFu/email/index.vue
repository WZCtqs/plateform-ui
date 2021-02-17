<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="100px">
      <el-form-item label="舱位号"
                    prop="orderNum">
        <el-input v-model.trim="queryParams.orderNum"
                  placeholder=""
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="siteList"
              border>
      <el-table-column label="舱位号"
                       align="center"
                       prop="orderNum" />
      <el-table-column label="在途邮箱信息"
                       align="center"
                       prop="intransitMail" />
      <el-table-column label="操作"
                       align="center"
                       width="100"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['yunFu:station:edit']">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 修改在途邮箱对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="900px">
      <el-form ref="form"
               :model="form"
               :inline="true"
               :rules="rules"
               label-width="150px">
        <el-form-item label="舱位号"
                      prop="orderNum">
          <el-input v-model.trim="form.orderNum"
                    :disabled="true"
                    style="width:600px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="在途邮箱信息"
                      prop="intransitMail">
          <el-input v-model.trim="form.intransitMail"
                    type="textarea"
                    style="width:600px;"
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
import {
  listSite,
  getSite,
  delSite,
  addSite,
  updateSite,
  exportSite
} from '@/api/yunFu/email'

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
      // 城市站点表格数据
      siteList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNum: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: '城市代码不能为空', trigger: 'blur' }
        ],
        nameCn: [
          { required: true, message: '城市中文名不能为空', trigger: 'blur' }
        ],
        nameEn: [
          { required: true, message: '城市英文名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询城市站点列表 */
    getList() {
      this.loading = true
      listSite(this.queryParams)
        .then(response => {
          this.siteList = response.rows
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
        orderId: undefined,
        orderNum: undefined,
        intransitMail: undefined
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form.orderNum = row.orderNum
      this.form.intransitMail = row.intransitMail
      this.form.orderId = row.orderId
      this.open = true
      this.title = '修改在途邮箱'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (this.form.orderId != undefined) {
          updateSite(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    }
  }
}
</script>