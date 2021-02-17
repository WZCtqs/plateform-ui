<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="线路"
                    prop="lineTypeid">
        <el-select v-model.trim="queryParams.lineTypeid"
                   clearable
                   size="mini"
                   style="width:100px;"
                   placeholder="请选择">
          <el-option v-for="item in lineOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="往返"
                    prop="classEastandwest">
        <el-select v-model.trim="queryParams.classEastandwest"
                   clearable
                   style="width:100px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in cteOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班列编号"
                    prop="classBh">
        <el-input v-model.trim="queryParams.classBh"
                  placeholder="请输入班列编号"
                  clearable
                  size="small"
                  style="width:150px"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label>
        <el-input placeholder="请输入内容"
                  v-model.trim="gdVal"
                  class="input-with-select">
          <el-select v-model.trim="gdLabel"
                     slot="prepend"
                     style="width:150px"
                     placeholder="请选择">
            <el-option label="整柜上下货站点"
                       value="0" />
            <el-option label="拼箱上下货站点"
                       value="1" />
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item label="计划开车时间"
                    prop="sStartTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 400px"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                        v-model.trim="tempTimeS"
                        placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划到站时间"
                    prop="">
        <el-date-picker clearable
                        size="small"
                        style="width: 400px"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                        v-model.trim="tempTimeE"
                        placeholder="选择开始时间">
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
    </el-form>

    <!-- <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['cabinarrangement:classes:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['cabinarrangement:classes:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['cabinarrangement:classes:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['cabinarrangement:classes:export']">导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading"
              :data="classesList">
      <el-table-column label="班列编号"
                       align="center"
                       prop="classBh" />
      <el-table-column label="开行班列"
                       align="center"
                       v-if="flase"
                       prop="classBlocktrain" />
      <el-table-column label="始发站"
                       align="center"
                       prop="classStationofdeparture" />
      <el-table-column label="目的站"
                       align="center"
                       prop="classStationofdestination" />
      <el-table-column label="计划开车时间"
                       align="center"
                       prop="classStime"
                       width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.classStime">{{ parseTime(scope.row.classStime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划到站时间"
                       align="center"
                       prop="classEtime"
                       width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.classEtime">{{ parseTime(scope.row.classEtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下货站汇总"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     @click="handleSee(scope.row)"
                     v-hasPermi="['cabinarrangement:classes:see']">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       align="center">
        <template slot-scope="scope">
          <el-button type="success"
                     size="mini"
                     style="margin-left:10px"
                     v-if="scope.row.zxState==0"
                     disabled>整箱可订</el-button>
          <el-button type="danger"
                     size="mini"
                     style="margin-left:10px"
                     v-else
                     disabled>整箱已满</el-button>
          <el-button type="success"
                     size="mini"
                     style="margin-top:3px"
                     v-if="scope.row.pxstate==0"
                     disabled>拼箱可订</el-button>
          <el-button type="danger"
                     size="mini"
                     style="margin-top:3px"
                     v-else
                     disabled>拼箱已满</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改排舱管理对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <template v-for="(item,index) in detDatas">
          <p :key="index"
             style="font-weight:600">{{item.station}}</p>
          <ul :key="index">
            <li v-for="(dict,index) in item.list"
                :key="index">{{dict.type}}:{{dict.num}}</li>
            <li v-if="item.kg">体积(CBM)：{{item.val}} - 重量(KGS): {{item.kg}}</li>
          </ul>
        </template>
        <p style="font-weight:600">小柜详细信息</p>
        <template>
          <el-table :data="datasList"
                    border>
            <el-table-column label="委托书编号"
                             align="center"
                             prop="orderNum" />
            <el-table-column label="箱型"
                             align="center"
                             prop="boxType" />
            <el-table-column label="箱量"
                             align="center"
                             prop="boxNum" />
            <el-table-column label="重量(KGS)"
                             align="center"
                             prop="kg" />
            <el-table-column label="体积(CBM)"
                             align="center"
                             prop="val" />
          </el-table>
        </template>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listClasses,
  getClasses,
  getDatas,
  delClasses,
  addClasses,
  updateClasses,
  exportClasses
} from '@/api/cabinarrangement/classes'

export default {
  name: 'Classes',
  data() {
    return {
      tempTimeS: '',
      tempTimeE: '',
      gdLabel: '0',
      gdVal: null,
      // 线路表格数据
      checkAll: false,
      lineOptions: [
        {
          value: '0',
          label: '中欧'
        },
        {
          value: '2',
          label: '中亚'
        },
        {
          value: '3',
          label: '中越'
        },
        {
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
      detDatas: [],
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
      // 排舱管理表格数据
      classesList: [],
      //查看弹框列表
      datasList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classBh: undefined,
        lineTypeid: undefined,
        lineId: undefined,
        classTId: undefined,
        classNumber: undefined,
        classBlocktrain: undefined,
        classClasstype: undefined,
        classEastandwest: undefined,
        classStationofdeparture: undefined,
        classStationofdestination: undefined,
        classTransporttime: undefined,
        ispublicly: undefined,
        classSpacenumber: undefined,
        zxcnt: undefined,
        pxstate: undefined,
        pxcnt: undefined,
        pxkgs: undefined,
        sStartTime: undefined,
        sEndTime: undefined,
        eStartTime: undefined,
        eEndTime: undefined,
        classStime: undefined,
        classEtime: undefined,
        classState: undefined,
        receiveSiteFull: undefined,
        receiveSiteLcl: undefined,
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        costentryState: undefined,
        distributionTime: undefined,
        xhentryState: undefined,
        pxentryState: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  watch: {
    gdVal: {
      handler: function(val) {
        if (val) {
          if (this.gdLabel === '0') {
            this.queryParams['receiveSiteFull'] = this.gdVal
            this.queryParams['receiveSiteLcl'] = null
          } else if (this.gdLabel === '1') {
            this.queryParams['receiveSiteFull'] = null
            this.queryParams['receiveSiteLcl'] = this.gdVal
          }
        } else {
          this.queryParams['receiveSiteFull'] = null
          this.queryParams['receiveSiteLcl'] = null
        }
      }
    },
    gdLabel: {
      handler: function(val) {
        if (val) {
          if (val === '0') {
            this.queryParams['receiveSiteFull'] = this.gdVal
            this.queryParams['receiveSiteLcl'] = null
          } else if (val === '1') {
            this.queryParams['receiveSiteFull'] = null
            this.queryParams['receiveSiteLcl'] = this.gdVal
          }
        } else {
          this.queryParams['receiveSiteFull'] = null
          this.queryParams['receiveSiteLcl'] = null
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询排舱管理列表 */
    getList() {
      this.loading = true
      if (this.tempTimeS) {
        this.queryParams.sStartTime = this.tempTimeS[0]
        this.queryParams.sEndTime = this.tempTimeS[1]
      } else {
        this.queryParams.sStartTime = ''
        this.queryParams.sEndTime = ''
      }
      if (this.tempTimeE) {
        this.queryParams.eStartTime = this.tempTimeE[0]
        this.queryParams.eEndTime = this.tempTimeE[1]
      } else {
        this.queryParams.eStartTime = ''
        this.queryParams.eEndTime = ''
      }
      listClasses(this.queryParams)
        .then(response => {
          this.classesList = response.rows
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 查看弹框下边列表 */
    seeDatas(classId) {
      getDatas(classId).then(response => {
        console.log(response)
        this.datasList = response.data
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
        classId: undefined,
        classBh: undefined,
        lineTypeid: undefined,
        lineId: undefined,
        classTId: undefined,
        classNumber: undefined,
        classBlocktrain: undefined,
        classClasstype: undefined,
        classEastandwest: undefined,
        classStationofdeparture: undefined,
        classStationofdestination: undefined,
        classTransporttime: undefined,
        ispublicly: undefined,
        classSpacenumber: undefined,
        zxcnt: undefined,
        pxstate: undefined,
        pxcnt: undefined,
        pxkgs: undefined,
        classStime: undefined,
        classEtime: undefined,
        classState: undefined,
        receiveSiteFull: undefined,
        receiveSiteLcl: undefined,
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        remark: undefined,
        costentryState: undefined,
        distributionTime: undefined,
        xhentryState: undefined,
        pxentryState: undefined
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
      this.tempTimeS = ''
      this.tempTimeE = ''
      this.gdVal = null
      this.queryParams['receiveSiteFull'] = null
      this.queryParams['receiveSiteLcl'] = null
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加排舱管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const classId = row.classId || this.ids
      getClasses(classId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改排舱管理'
      })
    },
    /** 修改按钮操作 */
    handleSee(row) {
      this.reset()
      const classId = row.classId
      this.seeDatas(classId)
      getClasses(classId).then(response => {
        console.log(response)
        this.detDatas = response.data
        this.open = true
        this.title = '下货站城市明细-查看'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.classId != undefined) {
            updateClasses(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addClasses(this.form).then(response => {
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
      const classIds = row.classId || this.ids
      this.$confirm(
        '是否确认删除排舱管理编号为"' + classIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delClasses(classIds)
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
      this.$confirm('是否确认导出所有排舱管理数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportClasses(queryParams)
        })
        .then(response => {
          this.download(response.msg)
        })
        .catch(function() {})
    }
  }
}
</script>