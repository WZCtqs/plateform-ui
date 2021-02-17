<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="100px">
      <el-form-item label="班列编号"
                    prop="classBh">
        <el-input v-model.trim="queryParams.classBh"
                  placeholder=""
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>

        <el-form-item label="往返"
                    prop="classEastAndWest">
        <el-select v-model.trim="queryParams.classEastAndWest"
                   clearable
                   style="width:90px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in cteOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

          <el-form-item label="线路"
                    prop="lineTypeId">
        <el-select v-model.trim="queryParams.lineTypeId"
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

        <el-form-item label="班列日期"
                    prop="classDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        v-model.trim="queryParams.classDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
      </el-form-item>

        <el-form-item label="更新日期"
                    prop="updateTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        v-model.trim="queryParams.updateTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">查询</el-button>
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['track:train:export']">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="trainList"
              border>
      <el-table-column label="更新日期"
                       align="center"
                       prop="updateTime" />
      <el-table-column label="班列编号"
                       align="center"
                       prop="classBh" />

      <el-table-column label="班列号"
                       align="center"
                       prop="classNum" />
      <el-table-column label="往返"
                       align="center"
                       prop="classEastAndWest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastAndWest == 0">西向</span>
          <span v-else-if="scope.row.classEastAndWest == 1">东向</span>
        </template>
      </el-table-column>
      <el-table-column label="班列日期"
                       align="center"
                       prop="classDate" />
      <el-table-column label="运踪时间"
                       align="center"
                       prop="trackTime" />
      <el-table-column label="运踪班列日期"
                       align="center"
                       prop="actualClassDate" />
      <el-table-column label="状态"
                       align="center"
                       width="50px"
                       prop="stateValue">
        <template slot-scope="scope">
          <span v-if="scope.row.stateValue == 0">到达</span>
          <span v-else-if="scope.row.stateValue == 1">驶离</span>
          <span v-else>在</span>
        </template>
      </el-table-column>
      <el-table-column label="位置"
                       align="center"
                       prop="currentLocation" />
      <el-table-column label="站点1"
                       align="center"
                       prop="stationOneName" />
      <el-table-column label="站点距离"
                       align="center"
                       prop="stationOneDistance" />
      <el-table-column label="站点2"
                       align="center"
                       prop="stationTwoName" />
      <el-table-column label="站点距离"
                       align="center"
                       prop="stationTwoDistance" />
      <el-table-column label="站点3"
                       align="center"
                       prop="stationThrName" />
      <el-table-column label="站点距离"
                       align="center"
                       prop="stationThrDistance" />
      <el-table-column label="站点4"
                       align="center"
                       prop="stationFouName" />
      <el-table-column label="站点距离"
                       align="center"
                       prop="stationFouDistance" />
      <el-table-column label="预计到达时间"
                       align="center"
                       prop="exceptTime" />
      <el-table-column label="备注"
                       align="center"
                       prop="remark" />
      <!-- <el-table-column label="运踪信息"
                       align="center"
                       prop="trackContents" /> -->
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
  </div>
</template>

<script>
import { getTrainList,exportTrainList} from '@/api/yunFu/train'

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
      // 班列运踪表格数据
      trainList: [],
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
      cteOptions: [{value: '0',label: '西向'},{ value: '1',label: '东向'}],
      lineOptions: [{value: '0', label: '郑欧班列' },{value: '4',label: '郑俄班列'},{value: '2',label: '郑中亚班列'}, { value: '3', label: '郑中越班列'} ]
    };
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询运踪列表 */
    getList() {
      this.loading = true
      getTrainList(this.queryParams)
        .then(response => {
          this.trainList = response.rows
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出班列运踪数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportTrainList(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
}
</script>