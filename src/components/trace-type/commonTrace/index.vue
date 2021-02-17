<template>
  <el-card class="trace-container">
    <div slot="header"
         class="clearfix">
      <el-page-header content="运踪详情"
                      title="返回列表"
                      @back="handleGoBack" />
    </div>
    <el-card class="trace-card">
      <div slot="header"
           class="clearfix">
        <h2 class="title">
          委托书编号:{{ detailData.orderNum }}
          <span class="upd-time">更新时间:{{ detailData.updateTime }}</span>
        </h2>
      </div>
      <!-- 上下货站 -->
      <div class="basic-data">
        <div>
          <h3 class="trace-city"
              v-if="detailData.startAddress">{{ detailData.startAddress }}</h3>
          <h3 class="trace-city"
              v-else>-</h3>
          <p class="trace-country">发货地</p>
        </div>
        <div class="middle-arrow">
          <div class="trace-timer">
            <!-- 班列预计到站日期:{{ detailData.exceptTime }} -->
          </div>
          <div>
            <img :src="rowpng"
                 alt
                 srcset
                 class="trace-arrow">
          </div>
        </div>
        <div>
          <h3 class="trace-city"
              v-if="detailData.endAddress">{{ detailData.endAddress }}</h3>
          <h3 class="trace-city"
              v-else>-</h3>
          <p class="trace-country">收货地 </p>
        </div>
      </div>
      <!-- 运踪节点 -->
      <div class="trace-step"
           v-if="!!primaryNode">
        <div style="display:flex;justify-content: center;">
          <div v-for="(primaryItem,index) in primaryNode.oneNode"
               :key="index"
               @click="showDetail(primaryItem.id)"
               :icon="primaryItem.icon"
               :class="primaryItem.state === 1?'stepCss0':'stepCss1'"
               style="cursor:pointer">
            <div style=" float:left;"
                 :class="primaryItem.state === 2?' error-step':''">
              <div slot="title"
                   style="text-align:center;">
                <p>
                  <i :class="primaryItem.icon"
                     style="font-size:20px !important;"></i>
                </p>
                <p class="trace-step-title">
                  {{ primaryItem.nameZh }}</p>
              </div>
              <div slot="description">
                <p v-if="'班列运踪'!=primaryItem.nameZh && '异常箱运踪'!=primaryItem.nameZh">{{ primaryItem.time }}</p>
              </div>
            </div>
            <div style=" float:left;margin-left:0;">
              <hr style="width:48px;margin-top:30px;"
                  v-if="index !== (primaryNode.oneNode.length -1)" />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card>
      <div class="timeline-step">
        <h3 style="padding-bottom:12px">运踪详情
          <el-button type="success"
                     size="mini"
                     @click="handleGetTwoNode">查看运踪详情</el-button>
          <el-button type="primary"
                     size="mini"
                     v-print="'#dayin'">打印</el-button>
          <!-- 去程 集疏部每日运踪           -->
          <a class="lin"
             v-if="this.classEastAndWest==='0'"
             href="http://171.15.132.176:81/StatisticData/Merchandiser/JiShu_import_Info_OrderPx.aspx"
             target="_blank">集疏部每日运踪</a>
          <!-- 回程 集疏部每日运踪           -->
          <a class="lin"
             v-if="this.classEastAndWest==='1'"
             href="http://171.15.132.176:81/StatisticData/Merchandiser/JiShu_back_OrderPx.aspx"
             target="_blank">集疏部每日运踪</a>
        </h3>
        <el-timeline :reverse="true"
                     id="dayin">
          <el-timeline-item v-for="(secNodeItem, index) in secNode"
                            :key="index"
                            :type="secNodeItem.state===1? 'primary':'error'"
                            :color="secNodeItem.state===1? '#0bbd87':'error'"
                            size="large">
            <el-card>
              <h4>{{secNodeItem.time}} {{ secNodeItem.nameZh }}</h4>
              <p>{{ secNodeItem.remark }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="trace-bottom-content"
           v-if="!!primaryNode&&primaryNode.abnormal==1">
        <div class="trace-table-content">
          <h3 style="padding-bottom:12px">
            <span>异常箱运踪查询</span>
          </h3>
          <el-table ref="traceTable"
                    :data="primaryNode.abnormalBox"
                    border
                    stripe
                    style="width: 100%">
            <el-table-column prop="boxNum"
                             label="箱号"
                             align="center" />
            <el-table-column prop="unloadReason"
                             label="下货原因"
                             align="center" />
            <el-table-column prop="isSeparate"
                             label="是否脱离主班列"
                             align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isSeparate==1">否</span>
                <span v-else-if="scope.row.isSeparate==0">是</span>
              </template>
            </el-table-column>
            <el-table-column label="下货地点"
                             prop="unloadSite"
                             align="center" />
            <el-table-column prop="abnormalInformation"
                             label="异常箱跟踪"
                             align="center" />
            <el-table-column prop="updateTime"
                             label="更新时间"
                             align="center" />
          </el-table>
        </div>
      </div>
      <div class="trace-bottom-content"
           v-if="this.abroad=='1'">
        <div class="trace-table-content">
          <h3 style="padding-bottom:12px">
            <span>境外运踪查询</span>
          </h3>
          <el-table ref="traceTable"
                    :data="jwclassTrackData"
                    border
                    stripe
                    style="width: 100%">
            <el-table-column prop="leaveTime"
                             label="出境日期"
                             align="center" />
            <el-table-column prop="changeTime"
                             label="换装日期"
                             align="center" />
            <el-table-column prop="changeNum"
                             label="换装车号"
                             align="center" />
            <el-table-column prop="abroadContents"
                             label="运踪"
                             align="center" />
            <el-table-column prop="updateTime"
                             label="更新日期"
                             align="center" />
          </el-table>
        </div>
      </div>
      <div class="trace-bottom-content">
        <div class="trace-table-content">
          <h3 style="padding-bottom:12px">
            <span>班列运踪查询</span>
            <el-button type="primary"
                       @click="handleOpenRecord">发送记录</el-button>
          </h3>
          <!-- <div style="padding-bottom:10px;">
            <el-row>
              <el-col :offset="18"
                      :span="3">
                <el-button type="primary"
                           @click="handleOpenSendMail">发送邮件</el-button>
              </el-col>
              <el-col :span="3">
               
              </el-col>
            </el-row>
          </div> -->
          <el-table ref="traceTable"
                    :data="classTrackData"
                    border
                    stripe
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <!-- @row-click="handleRowClick" -->
            <el-table-column align="center"
                             type="selection"
                             width="55" />
            <!-- <el-table-column type="expand"
                             label="备注"
                             width="140"
                             tooltip-effect="dark"
                             align="center">
              <template slot-scope="props">
                <el-form inline
                         class="demo-table-expand">
                  <el-form-item label="备注">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column> -->
            <el-table-column prop="trackTime"
                             label="运踪时间"
                             align="center" />

            <!-- <template slot-scope="scope">
                <span>{{ scope.row.updateTime | moment('YYYY-MM-DD') }}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="state"
                             label="状态"
                             align="center">
              <template slot-scope="props">
                <span v-if="props.row.state==='0'">到达</span>
                <span v-else-if="props.row.state==='1'">驶离</span>
                <span v-else>在</span>
              </template>
            </el-table-column>
           
            <el-table-column prop="currentLocation"
                             label="地理位置"
                             align="center" />
            <template v-for="(item,index) in columnData">
              <el-table-column v-if="item.show"
                               :key="index"
                               :prop="item.props"
                               :label="item.name"
                               align="center" />
            </template>
            <!-- <el-table-column label="出/入境日期"
                             v-if="hiddenTableHeader"
                             prop="portDate"
                             align="center" />
            <el-table-column prop="changeDate"
                             label="换装日期"
                             v-if="hiddenTableHeader"
                             align="center" />
            <el-table-column prop="changeNum"
                             v-if="hiddenTableHeader"
                             label="换装车号"
                             align="center" />
            <el-table-column prop="abroadContents"
                             v-if="hiddenTableHeader"
                             label="运踪信息"
                             align="center" /> -->
            <!-- 预计到站时间 中亚的显示 -->
            <el-table-column prop="exceptTime"
                             label="预计到站时间"
                             v-if="this.abroad=='0'"
                             align="center" />
            <el-table-column prop="remark"
                             label="运踪备注"
                             align="center" />
            <el-table-column prop="updateTime"
                             label="更新日期"
                             align="center" />
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog title="发送记录"
               width="1000px"
               :visible.sync="dialogTableVisible">
      <el-form :model="queryParams"
               ref="queryForm"
               :inline="true"
               label-width="100px">
        <el-form-item label="委托书编号"
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
      <el-table :data="gridData"
                border>
        <el-table-column label="发送时间"
                         prop="sendTime"
                         align="center"></el-table-column>
        <el-table-column label="委托书编号"
                         prop="orderNum"
                         align="center"></el-table-column>
        <el-table-column label="发送人"
                         prop="sendName"
                         align="center"></el-table-column>
        <el-table-column label="发送邮箱"
                         prop="sendEmail"
                         align="center"></el-table-column>
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList" />
    </el-dialog>
    <!-- <el-dialog :title="$t('trace.SendEmail')"
               :visible.sync="dialogVisible"
               width="30%">
      <el-form ref="emailForm"
               :model="emailForm"
               label-width="100px">
        <el-form-item :label="$t('trace.email')"
                      prop="email"
                      :rules="[
            { required: true, message: $t('trace.emailPlaceholder'), trigger: 'blur' },
            { type: 'email', message: $t('trace.emailPlaceholderCo'), trigger: ['blur', 'change'] }
          ]">
          <el-input v-model.trim="emailForm.email"
                    class="email_input"
                    type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="submitEmailForm('emailForm')">{{ $t('commons.submit') }}</el-button>
      </span>
    </el-dialog> -->
  </el-card>
</template>

<script>
import rowpng from '@/assets/img/row.png'
import {
  getTrainDetail,
  classTrackList,
  sendMail,
  getOneNode,
  getTwoNode,
  detailByOneId,
  oneLtraceList,
  emailsRecord
} from '@/api/trace'
import { mapGetters } from 'vuex'
export default {
  props: {
    orderId: {
      type: String,
      default: ''
    },
    classEastAndWest: {
      type: String,
      default: ''
    },
    classId: {
      type: String,
      default: ''
    },
    boxNum: {
      type: String,
      default: ''
    },
    orderNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      abroad: '',
      hiddenTableHeader: false,
      showDayin: true,
      total: 0,
      dialogTableVisible: false,
      gridData: [],
      queryParams: {
        orderNum: '',
        pageNum: 1,
        pageSize: 10
      },
      // 一级节点
      primaryNode: [],
      primaryActive: null,
      // 二级节点
      secNode: [],
      // 顶部数据
      detailData: {},
      // 运踪列表显示数据
      classTrackData: [],
      // 境外运踪列表显示数据
      jwclassTrackData: [],
      // 动态行显示
      columnData: [],
      // email form表单控制显示
      dialogVisible: false,
      // 多选数据
      multipleSelection: [],
      // form表单数据
      emailForm: {
        email: null
      },
      // 邮箱发送接口 数据参数
      emailData: {
        id: [],
        to: null,
        orderNumber: ''
      },
      // 箭头图标
      rowpng: rowpng
    }
  },
  computed: {
    // 获取语言信息
    // ...mapGetters(['language'])
  },
  watch: {
    // 监听语言改变
    // language (val) {
    //   this.handleGetNodeOne(val)
    //   this.handleGetTrainDetail()
    // }
  },
  mounted() {
    this.handleGetTrainDetail()
    this.handleGetNodeOne()
    this.handleGetTwoNode()
    this.handleGetBoxNum()
  },
  methods: {
    // 鼠标 移入事件
    jiru(val) {
      this.showDetail(val)
    },
    // 鼠标移出事件
    // likai () {
    //   this.showDayin = true;
    //   this.handleGetTwoNode();
    // },
    handleGetNodeOne() {
      getOneNode(this.orderId, this.boxNum).then(res => {
        console.log('---', res)
        this.primaryNode = res.data
        const activePrimary = this.primaryNode.filter(item => {
          return item.state === 1 || item.state === 2
        })
        this.primaryActive = activePrimary.length
        // getTwoNode(this.orderId).then(res => {
        //   this.secNode = res.data
        // })
      })
    },

    //班列运踪查询
    handleGetBoxNum() {
      oneLtraceList({
        orderId: this.orderId,
        classId: this.classId,
        boxNum: this.boxNum
      }).then(res => {
        this.classTrackData = res.data.trainList
        this.jwclassTrackData = res.data.abroadList
        this.abroad = res.data.abroad
        
        if (res.data.trainList.length) {
          this.lineType = res.data.trainList[0].lineType
          if (this.lineType === '2') {
            this.hiddenTableHeader = true
          }
        }
        // 判断动态列数据
        if (res.data.trainList.length) {
          const {
            stationOneName,
            stationTwoName,
            stationThrName,
            stationFouName
          } = res.data.trainList[0]
          
          this.columnData = [
            {
              // name: stationOneName,
              name: stationOneName,
              props: 'stationOneDistance',
              show: stationOneName ? !!stationOneName.trim() : false
            },
            {
              // name: stationTwoName,
              name: stationTwoName,
              props: 'stationTwoDistance',
              show: stationTwoName ? !!stationTwoName.trim() : false
            },
            {
              // name: stationThrName,
              name: stationThrName,
              props: 'stationThrDistance',
              show: stationThrName ? !!stationThrName.trim() : false
            },
            {
              // name: stationFouName,
              name: stationFouName,
              props: 'stationFouDistance',
              show: stationFouName ? !!stationFouName.trim() : false
            }
          ]
        }
      })
    },
    handleGetTwoNode() {
      // 新增箱号参数boxNum 2021.01.22 
      getTwoNode(this.orderId,this.boxNum).then(res => {
        if (res.data.length == 0) {
          this.secNode = [
            { state: 1, nameZh: '提示', time: '', remark: '暂无运踪详情!!!' }
          ]
        } else {
          this.secNode = res.data
        }
      })
    },
    showDetail(val) {
      // this.showDayin = false;
      if (val) {
        // 新增箱号参数 2021.01.22 this.boxNum
        detailByOneId(val,this.boxNum).then(res => {
          this.secNode = res.data
        })
      } else {
        this.secNode = [
          { state: 1, nameZh: '提示', time: '', remark: '暂无运踪详情!!!' }
        ]
      }
    },

    // 初始化接口
    handleGetTrainDetail() {
      // 根据orderId language获取顶部数据
      getTrainDetail(this.orderId).then(res => {
        this.detailData = res.data
      })
      // 获取班列运踪数据
      // classTrackList({ orderId: this.orderId, language: this.language }).then(res => {
      //   this.classTrackData = res.data
      //   // 判断动态列数据
      //   if (res.data.length) {
      //     const { stationOneName,
      //       stationTwoName,
      //       stationThrName, stationFouName } = res.data[0]
      //     this.columnData = [{
      //       name: stationOneName,
      //       props: 'stationOneDistance',
      //       show: !!stationOneName.trim()
      //     }, {
      //       name: stationTwoName,
      //       props: 'stationTwoDistance',
      //       show: !!stationTwoName.trim()
      //     }, {
      //       name: stationThrName,
      //       props: 'stationThrDistance',
      //       show: !!stationThrName.trim()
      //     }, {
      //       name: stationFouName,
      //       props: 'stationFouDistance',
      //       show: !!stationFouName.trim()
      //     }]
      //   }
      // })
    },
    // 点击行显示隐藏内容事件
    handleRowClick(row) {
      this.$refs.traceTable.toggleRowExpansion(row)
    },
    // 选择行事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 返回运踪列表
    handleGoBack() {
      this.$emit('handleTraceDetailBack')
    },
    // 打开发送邮箱弹窗
    handleOpenSendMail() {
      // 判断是否选择班列运踪
      if (this.multipleSelection.length) {
        // 把选中的运踪信息放入 emailData 中
        this.emailData.orderNumber = this.detailData.orderNumber
        this.multipleSelection.map(item => {
          this.emailData.id.push(item.id)
        })
        this.submitEmailForm.email = this.detailData.receiveEmail
        // 开启邮箱
        this.dialogVisible = true
      } else {
        this.$message.error({
          type: 'error',
          message: '发送失败'
        })
      }
    },
    // 发送邮件
    submitEmailForm(formName) {
      // 验证email form表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          // // emailData 放入要发送的邮箱
          // this.emailForm.email.map(item => {
          //   this.emailData.email.push(item.value)
          // })
          this.emailData.to = this.emailForm.email
          // 邮箱发送接口
          sendMail(this.emailData).then(res => {
            // console.log(123)
          })
        } else {
          return false
        }
      })
    },
    // 删除邮箱接口
    removeEmail(item) {
      // 获取index值 如果值为0 则删除功能失败
      var index = this.emailForm.email.indexOf(item)
      if (index >= 0) {
        if (this.emailForm.email.length > 1) {
          this.emailForm.email.splice(index, 1)
        } else {
          this.$message.error({
            type: 'error',
            message: '删除失败'
          })
        }
      }
    },
    // 动态添加邮箱
    addEmail() {
      this.emailForm.email.push({
        value: '',
        key: Date.now()
      })
    },

    //发送记录
    handleOpenRecord() {
      this.dialogTableVisible = true
      this.getList()
    },
    // 发送记录初始化列表
    getList() {
      this.queryParams.orderNum = this.orderNumber
      emailsRecord(this.queryParams).then(res => {
        this.gridData = res.data
        this.total = res.data.length
      })
    },
    //发送记录搜索
    handleQuery() {
      emailsRecord(this.queryParams).then(res => {
        this.gridData = res.data
      })
    },
    //获取运踪横向节点
    handleGetSecStep(row) {
      if (row.nameZh !== '班列运踪') {
        getTwoNode(this.orderId).then(res => {
          this.secNode = res.data
        })
      } else {
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.email_input {
  margin-right: 10px;
  width: 200px;
  vertical-align: top;
}
.stepCss0 {
  float: left;
  color: #1890ff;
  /* margin-right:30px; */
}
.stepCss1 {
  float: left;
  color: #c0c4cc;
  /* margin-right:30px; */
}
.error-step {
  color: red;
}
.trace-card {
  margin-bottom: 22px;
  border-top: 2px solid #34a8f3;
  font-size: 14px;
}
.trace-container {
  height: 100%;
  background-color: #fff;
  .trace-search {
    padding: 12px 0;
  }
  .title {
    width: 100%;
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
    .upd-time {
      font-size: 12px;
      font-weight: 400;
      color: #00b493;
      display: inline-block;
      margin-left: 20px;
      vertical-align: middle;
    }
  }
  .basic-data {
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: space-around;
    .trace-city {
      width: 100%;
      font-size: 20px;
      font-weight: 600;
      color: #333333;
      line-height: 28px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .middle-arrow {
      .trace-timer {
        text-align: center;
      }
      .trace-arrow {
        max-width: 300px;
      }
    }

    .trace-country {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
  }
  .trace-step {
    padding: 24px 0;
    border-top: 1px solid #eee;
    .el-step {
      cursor: pointer;
    }
    .error-step {
      .el-step__head.is-process {
        color: rgb(223, 22, 22);
        border-color: rgb(223, 22, 22);
      }
      .el-step__title.is-process {
        color: rgb(223, 22, 22);
      }
      .el-step__description.is-process {
        color: rgb(223, 22, 22);
      }
    }
  }
  .timeline-step {
    padding: 0 0;
  }

  .el-timeline-item {
    position: relative;
    padding-bottom: 0px !important;
  }
  .trace-bottom-content {
    // padding:10px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    .trace-table-content {
      flex: 1;
      // padding:0 24px 24px;
      h3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .trace-step-detail {
      flex: 0 0 350px;
      height: 100%;
      .trace-step-content {
        color: #333333;
        display: flex;
        justify-content: space-between;
      }
      .el-step:last-of-type {
        padding-right: 10%;
      }
      .trace-step-title {
        margin: 0;
      }
    }
  }
}
.lin {
  color: blue;
  padding-bottom: 12px;
}
</style>
