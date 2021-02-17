<template>
  <el-card class="trace-container">
    <div slot="header" class="clearfix">
      <el-page-header :content="$t('trace.trackDetail')" @back="handleGoBack" />
    </div>
    <el-card class="trace-card">
      <div slot="header" class="clearfix">
        <h2 class="title">
           {{ $t('trace.entrustNumbers') }}:{{ detailData.orderNumber }}
          <span class="upd-time">{{ $t('trace.updateTime') }}:{{ detailData.updateTime }}</span>
        </h2>
      </div>
      <div class="basic-data">
        <div>
          <h3 class="trace-city">{{ detailData.orderUploadsite }}</h3>
          <p class="trace-country">{{ $t('trace.LoadingStation') }}</p>
        </div>
        <div class="middle-arrow">
          <div class="trace-timer">{{ $t('trace.ETOA') }}:{{ detailData.expectTime }}</div>
          <div>
            <img :src="rowpng" alt srcset class="trace-arrow">
          </div>
        </div>
        <div>
          <h3 class="trace-city">{{ detailData.orderUnloadsite }}</h3>
          <p class="trace-country">{{ $t('trace.UnloadingStation') }} </p>
        </div>
      </div>
      <div class="trace-step">
      <div>
          <!-- {{primaryNode}} -->
      </div>
          <div
            v-for="(primaryItem,index) in primaryNode"
            :key="index"
            :icon="primaryItem.icon"
            :class="primaryItem.state === 1?'stepCss0':''"
            style="cursor:pointer"
            @click="handleGetSecStep(primaryItem)"
          >
            <div style=" float:left;" :class="primaryItem.state === 2?' error-step':''">
                 <div slot="title" style="text-align:center;">
                  <p> 
                    <i :class="primaryItem.icon" style="font-size:20px !important;"></i> 
                  </p>
                  <p class="trace-step-title">
                  {{ primaryItem.nodeName }}</p>
                </div>
                <div slot="description">
                  <p>{{ primaryItem.time }}</p>
                </div>
              </div>
               <div style=" float:left;margin-left:0;">
                 <hr style="width:48px;margin-top:30px;" v-if="index !== (primaryNode.length -1)" />
               </div>
          </div>
          

          
        <!-- <el-steps :active="primaryActive" align-center>
          <el-step
            v-for="(primaryItem,index) in primaryNode"
            :key="index"
            :icon="primaryItem.icon"
            :class="primaryItem.state === 2?'error-step':''"
            @click.native="handleGetSecStep(primaryItem)"
          >
            <div slot="title">
              <p class="trace-step-title">
                {{ primaryItem.nodeName }}</p>
            </div>
            <div slot="description">
              <p>{{ primaryItem.time }}</p>
            </div>
          </el-step>
        </el-steps> -->
      </div>
    </el-card>
    <el-card>
      <div v-if="!trainListShow" class="timeline-step">
        <h3 style="padding-bottom:12px">{{ $t('trace.trackDetail') }}
        </h3>

        <el-timeline :reverse="true">
          <el-timeline-item
            v-if="!secNode.length"
            placement="top"
            size="large"
          >
            <el-card>
              暂无详细运综数据
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            v-for="(secNodeItem, index) in secNode"
            v-else
            :key="index"
            placement="top"
            :type="secNodeItem.state===1? 'primary':'error'"
            :color="secNodeItem.state===1? '#0bbd87':'error'"
            size="large"
            :timestamp="secNodeItem.time"
          >
            <el-card>
              <h4 v-if="language === 'zh'">{{ secNodeItem.nameZh }}</h4>
              <h4 v-if="language === 'en'">{{ secNodeItem.nameEn }}</h4>
              <p>{{ secNodeItem.remark }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-if="trainListShow" class="trace-bottom-content">
        <div class="trace-table-content">
          <h3 style="padding-bottom:12px">
            <span>{{ $t('trace.classTrack') }}</span>
            <el-button type="primary" @click="handleOpenSendMail">{{ $t('trace.SendMail') }}</el-button>
          </h3>
          <el-table
            ref="traceTable"
            :data="classTrackData"
            border
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
          >
            <el-table-column
              align="center"
              type="selection"
              width="55"
            />
            <el-table-column type="expand" :label="$t('trace.trackDetail')" width="140" tooltip-effect="dark" align="center">
              <template slot-scope="props">
                <el-form inline class="demo-table-expand">
                  <el-form-item :label="$t('trace.remark')">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="trackTime" :label="$t('trace.TrackingTime')" align="center" />
            <el-table-column prop="stateValue" :label="$t('trace.status')" align="center" />
            <el-table-column prop="currentLocation" :label="$t('trace.position')" align="center" />
            <template
              v-for="(item,index) in columnData"
            >
              <el-table-column
                v-if="item.show"
                :key="index"
                :prop="item.props"
                :label="item.name+'(km)'"
                align="center"
              />
            </template>
            <el-table-column prop="exceptEarlyTime" :label="$t('trace.EstimatedArrivalTime')" align="center" />
            <el-table-column prop="updateTime" :label="$t('commons.utime')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime | moment('YYYY-MM-DD') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog
      :title="$t('trace.SendEmail')"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="emailForm" :rules="emailRule" :model="emailForm" label-width="100px">
        <el-form-item
          :label="$t('trace.email')"
          prop="email"
        >
          <el-input v-model.trim="emailForm.email" class="email_input" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitEmailForm('emailForm')">{{ $t('commons.submit') }}</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import rowpng from '@/assets/img/row.png'
import { getTrainDetail, classTrackList, sendMail, getOneNode, getTwoNode } from '../../../../api/trace'
import { mapGetters } from 'vuex'
export default {
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data() {
    var maxFiveEmail = (rule, value, callback) => {
      const emailV = /^\w+([-+.&]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (value.includes(';')) {
          const emailArr = value.split(';')
          const elen = emailArr.filter(item => {
            return item
          }).length
          if (elen > 5) {
            return callback(new Error('最多5个邮箱'))
          } else {
            emailArr.filter(item => {
              return item
            }).map(item => {
              if (!emailV.test(item)) {
                return callback(new Error('邮箱验证失败'))
              }
            })
            return callback()
          }
        } else {
          if (!emailV.test(value)) {
            return callback(new Error('邮箱验证失败'))
          } else {
            return callback()
          }
        }
      }, 1000)
    }
    return {
      // 一级节点
      primaryNode: [],
      primaryActive: null,
      // 二级节点
      secNode: [],
      // 顶部数据
      detailData: {},
      // 运踪列表显示数据
      classTrackData: [],
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
      emailRule: {
        email: [
          { required: true, message: this.$t('trace.emailPlaceholder'), trigger: 'blur' },
          { validator: maxFiveEmail, trigger: 'blur' }
        ]
      },
      // 箭头图标
      rowpng: rowpng,
      trainListShow: false
    }
  },
  computed: {
    // 获取语言信息
    ...mapGetters(['language', 'userInfo'])
  },
  watch: {
    // 监听语言改变
    language(val) {
      this.handleGetNodeOne(val)
      this.handleGetTrainDetail()
    }
  },
  mounted() {
    this.handleGetTrainDetail()
    this.handleGetNodeOne(this.language)
  },
  methods: {
    handleGetNodeOne(val) {
      getOneNode({ orderId: this.orderId, language: this.language }).then(res => {
        this.primaryNode = res.data
        const activePrimary = this.primaryNode.filter(item => {
          return item.state === 1 || item.state === 2
        })
        this.primaryActive = activePrimary.length
        getTwoNode({ id: activePrimary[this.primaryActive - 1].id, isCustom: 0, language: val }).then(res => {
          this.secNode = res.data
        })
      })
    },
    // 初始化接口
    handleGetTrainDetail() {
      // 根据orderId language获取顶部数据
      getTrainDetail({ orderId: this.orderId, language: this.language }).then(res => {
        this.detailData = res.data
      })
      // 获取班列运踪数据
      classTrackList({ orderId: this.orderId, language: this.language }).then(res => {
        this.classTrackData = res.data
        // 判断动态列数据
        if (res.data.length) {
          const { stationOneName,
            stationTwoName,
            stationThrName, stationFouName } = res.data[0]
          this.columnData = [{
            name: stationOneName,
            props: 'stationOneDistance',
            show: stationOneName ? !!stationOneName.trim() : false
          }, {
            name: stationTwoName,
            props: 'stationTwoDistance',
            show: stationTwoName ? !!stationTwoName.trim() : false
          }, {
            name: stationThrName,
            props: 'stationThrDistance',
            show: stationThrName ? !!stationThrName.trim() : false
          }, {
            name: stationFouName,
            props: 'stationFouDistance',
            show: stationFouName ? !!stationFouName.trim() : false
          }]
        }
      })
    },
    handleGetSecStep(row) {
      debugger
      if (row.nodeName !== '班列运踪') {
        this.trainListShow = false
        getTwoNode({ id: row.id, isCustom: 0, language: this.language }).then(res => {
          this.secNode = res.data
        })
      } else {
        this.trainListShow = true
      }
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
        this.emailData.id = []
        this.multipleSelection.map(item => {
          this.emailData.id.push(item.id)
        })
        this.emailForm.email = this.detailData.receiveEmail
        // 开启邮箱
        this.dialogVisible = true
      } else {
        this.$message.error({
          type: 'error',
          message: this.$t('trace.SendEmailTips')
        })
      }
    },
    // 发送邮件
    submitEmailForm(formName) {
      // 验证email form表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.emailData.to = this.emailForm.email
          // 邮箱发送接口
          sendMail(this.emailData).then(res => {
            this.$notify({
              title: this.$t('commons.success'),
              message: this.$t('commons.sendSucess'),
              type: 'success',
              duration: 2000
            })
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
            message: this.$t('trace.emailEmpty')
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
    }
  }
}
</script>
<style scoped>
.email_input{
  margin-right: 10px;
  width: 200px;
  vertical-align: top;
}
.stepCss0{
  float: left;
  color:blue;
  /* margin-right:30px; */
}
.error-step{
  color:red;
}
/* div.stepCss0:after
  {
    display:inline-block;
    width: 50px;
    height: 35;
    background:#f00;
  } */
</style>
