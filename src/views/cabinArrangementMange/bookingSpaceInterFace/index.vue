<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="舱位号" prop="orderNumber">
        <el-autocomplete
          v-model.trim="queryParams.orderNumber"
          :fetch-suggestions="querySearchCwh"
          placeholder="请输入舱位号"
          style="width: 220px"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="箱号" prop="boxNum">
        <el-autocomplete
          v-model.trim="queryParams.boxNum"
          :fetch-suggestions="querySearchXh"
          placeholder="请输入箱号"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="班列日期" prop="classDate">
        <!-- <el-date-picker
                v-model.trim="queryParams.classDate"
                type="date"
                placeholder="-请选择-">
        </el-date-picker>-->
        <el-date-picker
          v-model.trim="value1"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="班列编号" prop="classBh">
        <el-autocomplete
          v-model.trim="queryParams.classBh"
          :fetch-suggestions="querySearchBlbh"
          placeholder="请输入班列编号"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="订舱组备注" prop="classzyNo">
        <el-autocomplete
          v-model.trim="queryParams.classzyNo"
          :fetch-suggestions="querySearchDczbz"
          placeholder="请输入订舱组备注"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="线路" prop="lineTypeid">
        <el-select v-model.trim="queryParams.lineTypeid" placeholder="请选择" clearable>
          <el-option label="中欧" value="0"></el-option>
          <el-option label="中亚" value="2"></el-option>
          <el-option label="中越" value="3"></el-option>
          <el-option label="中俄" value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="拼整箱" prop="isconsolidation">
        <el-select v-model.trim="queryParams.isconsolidation" placeholder="请选择" clearable>
          <el-option label="整箱" value="0"></el-option>
          <el-option label="拼箱" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="托书关务状态" label-width="100px">
        <el-select v-model.trim="queryParams.classEastandwest" placeholder="请选择" style="width:90px">
          <el-option label="西向" value="0"></el-option>
          <el-option label="东向" value="1"></el-option>
        </el-select>
        <el-select
          v-if="queryParams.classEastandwest==='0'"
          v-model.trim="queryParams.bgProgress"
          placeholder="请选择"
          clearable
        >
          <el-option label="单证未提供" value="0"></el-option>
          <el-option label="草单未出" value="1"></el-option>
          <el-option label="草单未确认" value="2"></el-option>
          <el-option label="正本未提供" value="3"></el-option>
          <el-option label="重箱未进站" value="4"></el-option>
          <el-option label="正在报关" value="5"></el-option>
          <el-option label="报关单放行" value="6"></el-option>
          <el-option label="报关单查验" value="7"></el-option>
          <el-option label="查验异常正处理" value="8"></el-option>
          <el-option label="查验已放行" value="9"></el-option>
          <el-option label="出区异常待放行" value="10"></el-option>
          <el-option label="出区异常已放行" value="11"></el-option>
          <el-option label="正本已提供" value="12"></el-option>
        </el-select>
        <el-select
          v-if="queryParams.classEastandwest==='1'"
          v-model.trim="queryParams.bgProgress"
          placeholder="请选择"
          clearable
        >
          <el-option label="单证未提供" value="0"></el-option>
          <el-option label="单证已提供" value="1"></el-option>
          <el-option label="正在审单" value="2"></el-option>
          <el-option label="问题未回复" value="3"></el-option>
          <el-option label="草单未确认" value="4"></el-option>
          <el-option label="正本未提供" value="5"></el-option>
          <el-option label="具备清关条件" value="6"></el-option>
          <el-option label="转关提前申报未出号" value="7"></el-option>
          <el-option label="申报未出号" value="8"></el-option>
          <el-option label="转关提前申报出号未缴税" value="9"></el-option>
          <el-option label="出号未缴税" value="10"></el-option>
          <el-option label="保证金未审批" value="11"></el-option>
          <el-option label="暂进未审批" value="12"></el-option>
          <el-option label="转关提前申报报关单查验" value="13"></el-option>
          <el-option label="报关单查验" value="14"></el-option>
          <el-option label="转关提前申报海关系统已放行" value="15"></el-option>
          <el-option label="海关系统已放行" value="16"></el-option>
          <el-option label="海关系统已放行（目的地查验）" value="17"></el-option>
          <el-option label="ATA未核注" value="18"></el-option>
          <el-option label="ATA已核注" value="19"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="关务状态">
        <el-select v-model.trim="queryParams.classEastandwest" placeholder="请选择" style="width:90px">
          <el-option label="西向" value="0"></el-option>
          <el-option label="东向" value="1"></el-option>
        </el-select>
        <el-select
          v-if="queryParams.classEastandwest==='0'"
          v-model.trim="queryParams.guanwustate"
          placeholder="请选择"
          clearable
        >
          <el-option label="单证未提供" value="0"></el-option>
          <el-option label="草单未出" value="1"></el-option>
          <el-option label="草单未确认" value="2"></el-option>
          <el-option label="正本未提供" value="3"></el-option>
          <el-option label="重箱未进站" value="4"></el-option>
          <el-option label="正在报关" value="5"></el-option>
          <el-option label="报关单放行" value="6"></el-option>
          <el-option label="报关单查验" value="7"></el-option>
          <el-option label="查验异常正处理" value="8"></el-option>
          <el-option label="查验已放行" value="9"></el-option>
          <el-option label="出区异常待放行" value="10"></el-option>
          <el-option label="出区异常已放行" value="11"></el-option>
          <el-option label="正本已提供" value="12"></el-option>
        </el-select>
        <el-select
          v-if="queryParams.classEastandwest==='1'"
          v-model.trim="queryParams.guanwustate"
          placeholder="请选择"
          clearable
        >
          <el-option label="单证未提供" value="0"></el-option>
          <el-option label="单证已提供" value="1"></el-option>
          <el-option label="正在审单" value="2"></el-option>
          <el-option label="问题未回复" value="3"></el-option>
          <el-option label="草单未确认" value="4"></el-option>
          <el-option label="正本未提供" value="5"></el-option>
          <el-option label="具备清关条件" value="6"></el-option>
          <el-option label="转关提前申报未出号" value="7"></el-option>
          <el-option label="申报未出号" value="8"></el-option>
          <el-option label="转关提前申报出号未缴税" value="9"></el-option>
          <el-option label="出号未缴税" value="10"></el-option>
          <el-option label="保证金未审批" value="11"></el-option>
          <el-option label="暂进未审批" value="12"></el-option>
          <el-option label="转关提前申报报关单查验" value="13"></el-option>
          <el-option label="报关单查验" value="14"></el-option>
          <el-option label="转关提前申报海关系统已放行" value="15"></el-option>
          <el-option label="海关系统已放行" value="16"></el-option>
          <el-option label="海关系统已放行（目的地查验）" value="17"></el-option>
          <el-option label="ATA未核注" value="18"></el-option>
          <el-option label="ATA已核注" value="19"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="托书状态" prop="isexamline">
        <el-select v-model.trim="queryParams.isexamline" placeholder="请选择" clearable>
          <el-option label="-请选择-" value />
          <el-option label="未审核" value="0" />
          <el-option label="已审核通过" value="1" />
          <el-option label="已审核失败" value="2" />
          <el-option label="取消托书" value="3" />
          <el-option label="未审核(转待审核中)" value="4" />
          <el-option label="草稿" value="5" />
          <el-option label="箱管部未审核" value="7" />
          <el-option label="箱管部审核失败" value="8" />
          <el-option label="报价中" value="9" />
          <el-option label="客户确认中" value="10" />
          <el-option label="公路审核中" value="11" />
          <el-option label="集疏审核中" value="12" />
          <el-option label="撤舱待审核" value="13" />
        </el-select>
      </el-form-item>

      <el-form-item>
        20尺整柜({{boxt20}}) 40尺整柜({{boxt40}}) 45尺整柜({{boxt45}}) 20尺拼箱({{box20}}) 40尺拼箱({{box40}}) 45尺拼箱({{box45}}) 箱量({{boxXL}})
        <el-button
          type="primary"
          icon="el-icon-search"
          v-hasPermi="['order:orderDcz:list']"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:dczorders:export1']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="handleExport"
        >导出</el-button>

        <el-button
          v-hasPermi="['classOrder:dczorders:editbh']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handlbanlieNum"
        >编辑</el-button>

        <el-button
          v-hasPermi="['classOrder:dczorders:editbl']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleditbl"
        >舱位号修改</el-button>

        <el-button
          v-hasPermi="['classOrder:dczorders:del']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table
      class="el-tableCss0"
      v-loading="loading"
      ref="multipleTable"
      @row-click="handleRowClick"
      :data="list"
      border
      @selection-change="handleSelectionChange"
      :height="heightScreen"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <!-- <el-table-column type="index" width="50">  </el-table-column> -->

      <el-table-column label="序号" type="index" align="center" fixed="left" />
      <el-table-column label="班列日期" align="center" prop="classDate" fixed="left">
        <template slot-scope="scope">
          <span v-if="scope.row.classDate">{{scope.row.classDate.substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订舱组备注" align="center" prop="classzyNo" fixed="left" />
      <el-table-column label="备注修改记录" align="center" prop="classzynoTime" fixed="left">
        <template slot-scope="scope">
          <span
            @click="historyListFn(scope.row)"
            v-if="scope.row.classzynoRemark"
            style="cursor:pointer;"
          >点击查看</span>
        </template>
      </el-table-column>

      <el-table-column label="班列编号" align="center" prop="classBh" width="95" fixed="left" />

      <el-table-column label="口岸" align="center" prop="lineName" fixed="left" />
      <el-table-column label="舱位号" align="center" prop="orderNumber" width="160" fixed="left" />

      <el-table-column label="集装箱号" align="center" prop="boxNum" width="120" fixed="left" />
      <el-table-column label="箱量" align="center" prop="containerBoxamount" width="30" fixed="left" />
      <el-table-column label="箱型" prop="containerType" width="33" align="center" />
      <el-table-column label="箱属" align="center" prop="orderAuditBelongto">
        <template slot-scope="scope">
          <span v-if="scope.row.orderAuditBelongto === '0'">委托ZIH</span>
          <span v-else-if="scope.row.orderAuditBelongto === '1'">自备</span>
          <span v-else-if="scope.row.orderAuditBelongto === '2'">自备铁路箱</span>
          <span v-else-if="scope.row.orderAuditBelongto === '3'">自备非铁路箱</span>
        </template>
      </el-table-column>

      <el-table-column label="入场日期" align="center" prop="inSpaceDate">
        <template slot-scope="scope">
          <span>{{scope.row.inSpaceDate}} {{scope.row.inSpaceTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="进站日期" align="center" prop="inStationDate">
        <template slot-scope="scope">
          <span>{{scope.row.inStationDate}} {{scope.row.inStationTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报关员" align="center" prop="bgPrincipal" />
      <el-table-column label="托书票数" align="center" prop="bgVotesNumber" />
      <el-table-column label="托书报关状态" align="center" prop="bgProgressList">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.bgProgressList" :key="index">
            <font :class="'bgColor'+item.bgColor">{{item.bgStatus}}</font>
            <em
              :class="'bgColor'+item.bgColor"
              v-if="index !== (scope.row.bgProgressList.length -1)"
            >/</em>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="托书报关备注" align="center" prop="bgRemark" />
      <el-table-column label="票数" align="center" prop="gwPiaoshu" />

      <el-table-column label="关务状态" align="center" prop="guanwustateList">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.guanwustateList" :key="index">
            <font :class="'bgColor'+item.gwColor">{{item.gwStatus}}</font>
            <em
              :class="'bgColor'+item.gwColor"
              v-if="index !== (scope.row.guanwustateList.length -1)"
            >/</em>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="关务备注" align="center" prop="gwRemark" />
      <el-table-column label="随车审核人" align="center" prop="scOperator" />
      <el-table-column label="随车托书备注" align="center" prop="scremark">
        <template slot-scope="scope">
          <span v-if="scope.row.scremark" style="color: red">{{scope.row.scremark}}</span>
          <span v-else>{{scope.row.scremark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="随车状态" align="center" prop="suichestate" />
      <el-table-column label="随车备注" align="center" prop="scRemarkZy">
        <template slot-scope="scope">
          <span v-if="scope.row.scRemarkZy" style="color: red">{{scope.row.scRemarkZy}}</span>
          <span v-else>{{scope.row.scRemarkZy}}</span>
        </template>
      </el-table-column>

      <el-table-column label="拼箱备注" align="center" prop="bgremarkPx" />
      <el-table-column label="推荐人" align="center" prop="clientTjr" width="90" />
      <el-table-column label="跟单员" align="center" prop="orderMerchandiser" />
      <el-table-column label="订舱方" align="center" prop="clientUnit" />
      <el-table-column label="货物品名" align="center" prop="goodsName" />
      <el-table-column label="公路部是否办票" align="center" prop="roadIsbill" />
      <el-table-column label="预计到场时间" align="center" prop="planunloadtime" />
      <el-table-column label="封号" align="center" prop="fenghao" />

      <el-table-column label="封号更新时间" align="center" prop="fhtime" />
      <el-table-column label="监管区更改后封号" align="center" prop="gwfenghao" />
      <el-table-column label="箱号校验" align="center" prop="boxNumCheck" />

      <el-table-column label="下货站" align="center" prop="orderUnloadsite" />
      <el-table-column label="到货方式" align="center" prop="shipOrderBinningway" />
      <el-table-column label="箱重" align="center" prop="boxWeight" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改舱位号对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="原班列日期:">
              <!-- {{classDate | moment('YYYY-MM-DD')}} -->
              {{classDate}}
            </el-form-item>
          </el-col>

          <el-col :span="20">
            <el-form-item label="班列日期修改为:">
              <el-date-picker v-model.trim="form.classDate" type="date"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="20">
            <el-form-item label="班列编号更改为:" prop="classBh">
              <el-input
                class="inline-input"
                v-model.trim="form.classBh"
                auto-complete="on"
                name="classBh"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="订舱组-编辑" :visible.sync="open1" width="45%">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="180px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="订舱组备注" prop="classzyNo">
              <el-input
                class="inline-input"
                v-model.trim="classzyNo"
                auto-complete="on"
                name="classzyNo"
                placeholder="请输入订舱组备注"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1()">保存</el-button>
        <el-button @click="cancel1">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 修改记录 对话框 -->
    <el-dialog title="信息更新-列表" :visible.sync="open2" width="45%">
      <ul v-for="(item,index) in historyListdata" :key="index" class="isupdateListULCss0">
        <li class="isupdateListLICss0">{{index}}:{{item.title}}</li>
        <li>{{item.list}}</li>
      </ul>

      <div slot="footer" class="dialog-footer">
        <el-button @click="open2=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  delApi,
  detailApi,
  editApi,
  classBhAdd,
  boxAmountTotalApi,
  applyCodeApi,
  downLoadExcel,
  exportTrack,
  exportTrackDl,
  importTrackTime,
  classBhEecord,
  orderBlEdit,
  deleteApi
} from "@/api/cabinArrangementMange/bookingSpaceInterFace";
import { parseTime } from "@/utils/zhonghao";

import {
  validatePhone,
  validateTelphone,
  validateEMail
} from "@/api/validator";
import "@/assets/styles/selfCss0.css";

export default {
  name: "BookingSpaceInterFace",
  data() {
    return {
      cwhnoRoNameHistory: [], //定义一个存放舱位号历史搜索记录的数组
      xhnoRoNameHistory: [],
      blbhnoRoNameHistory: [],
      dczbznoRoNameHistory: [],
      classzyNo: null,
      classBh: null,
      historyListdata: [],
      open2: false, //修改记录弹框
      // ***************************************  修改  *********************************************************
      form: {}, // form表单
      formDisabled: false,
      heightScreen: null,

      // 表单校验
      rules: {
        actualClassDateValue: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ]
      },
      rules1: {
        classzyNo: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ]
      },
      title: "", // 弹出层标题
      open: false, // 编辑 弹框是否显示
      open1: false, // 班列号 弹框是否显示
      form1: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      boxt20: 0,
      boxt40: 0,
      boxt45: 0,
      box20: 0,
      box40: 0,
      box45: 0,
      boxXL: 0,
      total: 0, // 总条数
      list: [], // 订舱托书列表数据
      // ******************************************* 其他字段 *****************************************************
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      ids1: [],
      // 选中list数组
      arrs: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      value1: [], // 查询条件 班列日期
      value2: [], // 查询条件 发运日期
      fileList: [],
      classDate: null,
      selectID: []
    };
  },
  created() {
    // this.queryParams['userid'] = this.$store.getters.id;
    this.getList();
  },
  mounted() {
    if (window.screen.height > 800) {
      this.heightScreen = 600;
    } else {
      this.heightScreen = 500;
    }
    //组件加载后给noRoNameHistory 赋值
    this.cwhnoRoNameHistory = this.setIntoStorage();
    this.xhnoRoNameHistory = this.xhsetIntoStorage();
    this.blbhnoRoNameHistory = this.blbhsetIntoStorage("0");
    this.dczbznoRoNameHistory = this.dczbzsetIntoStorage("0");
  },
  watch: {
    value1: {
      handler: function(val) {
        if (val && val.length > 0) {
          if (val[0]) {
            this.queryParams.classDateStart = parseTime(val[0]);
          }

          if (val[1]) {
            this.queryParams.classDateEnd = parseTime(val[1]);
          }
        } else {
          this.queryParams.classDateStart = null;
          this.queryParams.classDateEnd = null;
        }
      }
    },
    value2: {
      handler: function(val) {
        if (val && val.length > 0) {
          this.queryParams.actualClassDateValueStart = parseTime(val[0]);
          this.queryParams.actualClassDateValueEnd = parseTime(val[1]);
        } else {
          this.queryParams.actualClassDateValueStart = null;
          this.queryParams.actualClassDateValueEnd = null;
        }
      }
    }
  },
  methods: {
    // 选中背景色
    tableRowClassName({ row, rowIndex }) {
      let color = "";
      for (let item of this.selectID.values()) {
        if (item === row.id) color = "table-SelectedRow-bgcolor";
      }
      return color;
    },
    querySearchCwh(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      let cwhnoRoNameHistory = JSON.parse(localStorage.getItem("orderNumber"));
      let results = queryString
        ? cwhnoRoNameHistory.filter(this.createFilterCwh(queryString))
        : cwhnoRoNameHistory;
      cb(results);
    },
    createFilterCwh(queryString) {
      return item => {
        return (
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    querySearchXh(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      let xhnoRoNameHistory = JSON.parse(localStorage.getItem("boxNum"));
      let results = queryString
        ? xhnoRoNameHistory.filter(this.createFilterCwh(queryString))
        : xhnoRoNameHistory;
      cb(results);
    },
    createFilterXh(queryString) {
      return item => {
        return (
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    querySearchBlbh(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      let blbhnoRoNameHistory = JSON.parse(localStorage.getItem("classBh"));
      let results = queryString
        ? blbhnoRoNameHistory.filter(this.createFilterBlbh(queryString))
        : blbhnoRoNameHistory;
      cb(results);
    },
    createFilterBlbh(queryString) {
      return item => {
        return (
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    querySearchDczbz(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      let dczbznoRoNameHistory = JSON.parse(localStorage.getItem("classzyNo"));
      let results = queryString
        ? dczbznoRoNameHistory.filter(this.createFilterDczbz(queryString))
        : dczbznoRoNameHistory;
      cb(results);
    },
    createFilterDczbz(queryString) {
      return item => {
        return (
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    setIntoStorage() {
      let noArr;
      if (JSON.parse(localStorage.getItem("orderNumber"))) {
        noArr = JSON.parse(localStorage.getItem("orderNumber")); // 历史记录数组
      } else {
        localStorage.setItem("orderNumber", "[]");
        return;
      }
      let value;
      value = this.queryParams.orderNumber;
      const orderNumber = "orderNumber";
      let abc = {};
      if (value) {
        abc = { value: value, type: orderNumber };
      }
      if (JSON.parse(localStorage.getItem(orderNumber))) {
        if (!value) {
          return;
        }
        // 判断是否已有xxx查询记录的localStorage
        var currentValue = noArr.filter(item => {
          return item.value == value;
        });
        if (currentValue.length > 0) {
          // 判断是否已有此条查询记录，若已存在，则不需再存储
          return;
        }
        // 数量多于几个剔除其中一个
        // let arrLength = 0;
        // for(var a in noArr){
        //   arrLength++;
        // }
        // if (arrLength >= 5) {
        //   noArr.pop()
        // }
        noArr.push(abc);
        localStorage.setItem(orderNumber, JSON.stringify(noArr));
      }
      console.log(localStorage.getItem("orderNumber"));
    },
    xhsetIntoStorage() {
      let noArr;
      if (JSON.parse(localStorage.getItem("boxNum"))) {
        noArr = JSON.parse(localStorage.getItem("boxNum")); // 历史记录数组
      } else {
        localStorage.setItem("boxNum", "[]");
        return;
      }
      let value;
      value = this.queryParams.boxNum;
      const boxNum = "boxNum";
      let abc = {};
      if (value) {
        abc = { value: value, type: boxNum };
      }
      if (JSON.parse(localStorage.getItem(boxNum))) {
        if (!value) {
          return;
        }
        // 判断是否已有xxx查询记录的localStorage
        var currentValue = noArr.filter(item => {
          return item.value == value;
        });
        if (currentValue.length > 0) {
          // 判断是否已有此条查询记录，若已存在，则不需再存储
          return;
        }
        // 数量多于几个剔除其中一个
        // let arrLength = 0;
        // for(var a in noArr){
        //   arrLength++;
        // }
        // if (arrLength >= 5) {
        //   noArr.pop()
        // }
        noArr.push(abc);
        localStorage.setItem(boxNum, JSON.stringify(noArr));
      }
      console.log(localStorage.getItem("boxNum"));
    },
    blbhsetIntoStorage(obj) {
      let noArr;
      if (JSON.parse(localStorage.getItem("classBh"))) {
        noArr = JSON.parse(localStorage.getItem("classBh")); // 历史记录数组
      } else {
        localStorage.setItem("classBh", "[]");
        return;
      }
      let value;
      if (obj === "0") {
        value = this.queryParams.classBh;
      } else if (obj === "1") {
        value = this.form.classBh;
      }

      const classBh = "classBh";
      let abc = {};
      if (value) {
        abc = { value: value, type: classBh };
      }
      if (JSON.parse(localStorage.getItem(classBh))) {
        if (!value) {
          return;
        }
        // 判断是否已有xxx查询记录的localStorage
        var currentValue = noArr.filter(item => {
          return item.value == value;
        });
        if (currentValue.length > 0) {
          // 判断是否已有此条查询记录，若已存在，则不需再存储
          return;
        }
        // 数量多于几个剔除其中一个
        // let arrLength = 0;
        // for(var a in noArr){
        //   arrLength++;
        // }
        // if (arrLength >= 5) {
        //   noArr.pop()
        // }
        noArr.push(abc);
        localStorage.setItem(classBh, JSON.stringify(noArr));
      }
      console.log(localStorage.getItem("classBh"));
    },
    dczbzsetIntoStorage(obj) {
      let noArr;
      if (JSON.parse(localStorage.getItem("classzyNo"))) {
        noArr = JSON.parse(localStorage.getItem("classzyNo")); // 历史记录数组
      } else {
        localStorage.setItem("classzyNo", "[]");
        return;
      }
      let value;
      if (obj === "0") {
        value = this.queryParams.classzyNo;
      } else if (obj === "1") {
        value = this.classzyNo;
      }
      const classzyNo = "classzyNo";
      let abc = {};
      if (value) {
        abc = { value: value, type: classzyNo };
      }
      if (JSON.parse(localStorage.getItem(classzyNo))) {
        if (!value) {
          return;
        }
        // 判断是否已有xxx查询记录的localStorage
        var currentValue = noArr.filter(item => {
          return item.value == value;
        });
        if (currentValue.length > 0) {
          // 判断是否已有此条查询记录，若已存在，则不需再存储
          return;
        }
        // 数量多于几个剔除其中一个
        // let arrLength = 0;
        // for(var a in noArr){
        //   arrLength++;
        // }
        // if (arrLength >= 5) {
        //   noArr.pop()
        // }
        noArr.push(abc);
        localStorage.setItem(classzyNo, JSON.stringify(noArr));
      }
      console.log(localStorage.getItem("classzyNo"));
    },
    // 修改记录
    historyListFn(obj) {
      let id = obj.id;
      classBhEecord(id).then(res => {
        if (res.code === 200) {
          this.open2 = true;
          this.historyListdata = res.rows;
        } else {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "warning",
            duration: 2000
          });
        }
      });
    },

    /** 查询列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(() => {
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
      this.form = {};
      this.resetForm("form");
    },
    boxAmountTotalFn() {
      boxAmountTotalApi(this.queryParams).then(res => {
        if (res.code === 200) {
          this.boxt20 = res.data["20t"];
          this.boxt40 = res.data["40t"];
          this.boxt45 = res.data["45t"];
          this.box20 = res.data["20p"];
          this.box40 = res.data["40p"];
          this.box45 = res.data["45p"];
          this.boxT = res.data.t;
          this.boxP = res.data.p;
          this.boxXL = res.data.xl;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.boxAmountTotalFn();
      this.setIntoStorage();
      this.xhsetIntoStorage();
      this.blbhsetIntoStorage("0");
      this.dczbzsetIntoStorage("0");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.value1 = null;
      this.value2 = null;

      this.queryParams = {
        pageNum: 1,
        pageSize: 20
      };

      this.handleQuery();
    },
    //点击行触发、选中或不选中复选框
    handleRowClick(row, column, event) {
      if (this.selectID.indexOf(row.id) == -1) {
        this.selectID.push(row.id);
      } else {
        this.selectID.splice(
          this.selectID.findIndex(item => item == row.id),
          1
        );
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.arrs = selection.map(item => item);
      this.ids = selection.map(item => item.id);
      this.ids1 = selection.map(item => item.orderId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /* 编辑 按钮 */
    handlbanlieNum() {
      this.open1 = true;
      this.classzyNo = null;
      if (this.arrs.length === 1 && !!this.arrs[0].classzyNo) {
        this.classzyNo = this.arrs[0].classzyNo;
      }
    },
    cancel1() {
      this.open1 = false;
      this.form1 = {};
    },
    submitForm1: function() {
      let params = {
        updateBy: this.$store.getters.name,
        classzyNo: this.classzyNo,
        idsArr: this.ids
      };
      classBhAdd(params).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.open1 = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /* 修改舱位号 按钮 操作 */
    handleditbl() {
      let row = this.arrs[0];
      this.classDate = this.arrs[0].classDate;
      this.open = true;
      this.title = "订单舱位-修改";
    },
    /** 修改舱位号 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //  actualClassDateValue= parseTime(this.form.actualClassDateValue)
          let params = {
            orderIdsArr: this.ids1,
            classDate: parseTime(this.form.classDate),
            classBh: this.form.classBh,
            updateBy: this.$store.getters.name
          };
          orderBlEdit(params).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },

    /*  “导出” 操作 */
    handleExport() {
      let queryParams = this.queryParams;
      exportTrack(queryParams).then(res => {
        this.download(res.msg);
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = { idsArr: this.ids };
      this.$confirm("是否确认删除所选数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteApi(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>
<style>
.detailCss0 {
  color: #1890ff;
  cursor: pointer;
}
.isupdateListULCss0 li {
  border-bottom: 1px solid#000;
  height: 35px;
  line-height: 35px;
  list-style: none;
}
.orderTable th > .cell {
  white-space: nowrap;
}
.isupdateListULCss0 li.isupdateListLICss0 {
  background: #eee;
  border-bottom: none;
}
.table-SelectedRow-bgcolor td {
  background-color: #ffec8b !important;
}
</style>
<style lang="scss">
.bgColor0 {
  color: #606266;
}
.bgColor1 {
  font-weight: bold;
  color: red;
}
.bgColor2 {
  font-weight: bold;
  color: blue;
}
.bgColor3 {
  font-weight: bold;
  color: green;
}
.el-table {
  .el-table__fixed {
    height: auto !important; // 此处的important表示优先于element.style
    bottom: 17px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
  }
}
</style>
