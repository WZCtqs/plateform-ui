<template>
  <div>
    <!-- 运踪列表模块 -->
    <el-card v-if="detail_trace === ''"
             class="common-container  enquiry-card trace-list">
      <!-- 查询条件 -->
      <!-- 班列日期 -->
      <el-form :inline="true"
               label-width="90px">
        <!-- 往返 -->
        <el-form-item label="往返">
          <el-select v-model.trim="listQuery.classEastAndWest"
                     style="width:100px;"
                     size="mini"
                     clearable>
            <el-option v-for="item in classEastAndWestOption"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="班列日期">
          <el-date-picker v-model.trim="listQuery.classDate"
                          style="width:150px;"
                          value-format="yyyy-MM-dd"
                          clearable
                          size="mini"
                          type="date" />
        </el-form-item>
        <!-- 委托书编号 -->
        <el-form-item label="委托书编号">
          <el-input style="width:150px;"
                    size="mini"
                    clearable
                    v-model.trim="listQuery.orderNumber" />
        </el-form-item>
        <!-- 箱号 -->
        <el-form-item label="箱号">
          <el-input style="width:150px;"
                    size="mini"
                    clearable
                    v-model.trim="listQuery.boxNum" />
        </el-form-item>
        <el-form-item label="班列编号">
          <el-input size="mini"
                    clearable
                    v-model.trim="listQuery.classBh" />
        </el-form-item>
        <!-- 搜索 框 -->
        <el-form-item>
          <el-button icon="el-icon-search"
                     type="primary"
                     size="mini"
                     @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <!-- table 列表 -->
      <el-table v-loading="loading"
                border
                :data="traceData">
        <!-- 班列日期列 -->
        <el-table-column align="center"
                         label="班列日期">
          <template slot-scope="scope">
            <span>{{ scope.row.classDate.substring(0,10) }}</span>
          </template>
        </el-table-column>
        <!-- 委托书编号列 -->
        <el-table-column align="center"
                         label="委托书编号">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <!-- 箱号列 -->
        <el-table-column align="center"
                         label="箱号">
          <template slot-scope="scope">
            <span>{{ scope.row.boxNum }}</span>
          </template>
        </el-table-column>
        <!-- 去回程列 -->
        <el-table-column align="center"
                         label="往返">
          <template slot-scope="scope">
            <span v-if="scope.row.classEastAndWest ==='0'">西向</span>
            <span v-if="scope.row.classEastAndWest ==='1'">东向</span>
          </template>
        </el-table-column>
        <!-- 整/拼箱列 -->
        <!-- <el-table-column align="center"
                         label="整拼箱列">
          <template slot-scope="scope">/
            <span v-if="scope.row.isConsolidation ==='0'">整箱</span>
            <span v-if="scope.row.isConsolidation ==='1'">拼箱</span>
          </template>
        </el-table-column> -->
        <!-- 品名列 -->
        <el-table-column align="center"
                         label="品名">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>
        <!-- 发货人列 -->
        <el-table-column align="center"
                         label="发货人">
          <template slot-scope="scope">
            <span>{{ scope.row.shipOrederName }}</span>
          </template>
        </el-table-column>
        <!-- 状态列 -->
        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.trackState">{{ scope.row.trackState }}</el-tag>
            <span v-else> - </span>
          </template>
        </el-table-column>
        <!-- 订舱时间列 -->
        <!-- <el-table-column align="center"
                         label="订舱时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column> -->
        <!-- 操作列 -->
        <el-table-column label="操作"
                         prop="desc"
                         align="center">
          <template slot-scope="props">
            <!-- 查看运踪列 -->
            <el-button type="primary"
                       @click.native="handleShowTrack(props.row)">运踪详情</el-button>
          </template>
        </el-table-column>>
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="listQuery.pageNum"
                  :limit.sync="listQuery.pageSize"
                  @pagination="handleGetList" />
    </el-card>
    <div v-else-if="detail_trace==='commonTrace'">
      <commonTrace :order-id="orderId"
                   :class-id="classId"
                   :class-east-and-west="classEastAndWest"
                   :box-num="boxNum"
                   :order-number="orderNumber"
                   @handleTraceDetailBack="handleDetailTrace" />
    </div>

  </div>
</template>

<script>
import commonTrace from '@/components/trace-type/commonTrace'
import { traceList } from '@/api/trace/index'
import {
  traceFilterZH,
  traceFilterEN,
  class·EastAndWestOptionZH,
  classEastAndWestOptionEN,
  isConsolidationOptionsZH,
  isConsolidationOptionsEN
} from '../../../assets/const'

export default {
  name: 'Common-trace',
  components: {
    commonTrace
  },
  data() {
    return {
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: '',
        classEastAndWest: '',
        classDate: '',
        boxNum: '',
        classBh: ''
      },
      // 遮罩层
      loading: true,
      listLoading: false,
      detail_trace: '',
      traceData: [],
      filterKey: 'orderNumber',
      filterContent: null,
      filterOption: [],
      isConsolidationOptions: [],
      classEastAndWestOption: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      // 订单id
      orderId: '',
      // 班列id
      classId: '',
      // 箱号
      boxNum: '',
      //委托书编号
      orderNumber: ''
    }
  },
  computed: {
    // ...mapGetters(['language'])
  },
  watch: {},
  created() {
    this.handleGetList()
  },
  // mounted () {
  //   // 获取初始化分页
  //   this.handleGetList()
  // },
  methods: {
    // 初始化获取列表分页接口
    handleGetList() {
      this.loading = true
      // this.handleFilterFlag()
      traceList(this.listQuery)
        .then(response => {
          this.loading = false
          if (response.code === 200) {
            this.traceData = response.rows
            this.total = response.total
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleFilterOptionChange() {
      this.filterContent = null
    },
    // // 筛选框前置事件
    // handleFilterFlag() {
    //   if (this.filterKey && this.filterContent) {
    //     this.listQuery[this.filterKey] = this.filterContent
    //   }
    // },
    // 分页改变事件
    // handleSizeChange(val) {
    //   this.listQuery.pageSize = val
    //   this.handleGetList()
    // },
    // 页码改变事件
    // handleCurrentChange(val) {
    //   this.listQuery.pageNum = val
    //   this.handleGetList()
    // },
    // 筛选功能事件
    handleFilter() {
      this.listQuery.pageNum = 1
      this.handleGetList()
    },
    handleFilterCon() {
      this.filterKey = null
    },
    // 根据不同的运踪类型显示不同的运踪详情
    handleShowTrack(e) {
      this.orderId = e.orderId
      this.classId = e.classId
      this.boxNum = e.boxNum
      this.orderNumber = e.orderNumber
      this.classEastAndWest = e.classEastAndWest
      this.detail_trace = 'commonTrace'
      // 去回程 0为去程 1为回程
      // 整拼箱 0整柜 1拼箱
      // if (e.classEastAndWest === '0' && e.isConsolidation === '0') {
      //   this.orderId = e.orderId
      //   this.detail_trace = 'goFCL'
      // } else if (e.classEastAndWest === '0' && e.isConsolidation === '1') {
      //   this.orderId = e.orderId
      //   this.detail_trace = 'goLCL'
      // } else if (e.classEastAndWest === '1' && e.isConsolidation === '0') {
      //   this.detail_trace = 'backFCL'
      //   this.orderId = e.orderId
      // } else if (e.classEastAndWest === '1' && e.isConsolidation === '1') {
      //   this.detail_trace = 'backLCL'
      //   this.orderId = e.orderId
      // }
    },
    // 关闭详情显示主运踪列表界面
    handleDetailTrace() {
      this.detail_trace = ''
    }
  }
}
</script>
