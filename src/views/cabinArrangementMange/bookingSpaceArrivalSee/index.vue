<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="舱位号" prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入舱位号"
          clearable
          size="small"
          oninput="this.value=this.value.replace(/[, ]/g,'')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="箱号" prop="boxNum">
        <el-input
          v-model.trim="queryParams.boxNum"
          placeholder="请输入箱号"
          clearable
          style="width:140px"
          oninput="this.value=this.value.replace(/[, ]/g,'')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="计划班列号" prop="classzyNo">
        <el-input
          v-model.trim="queryParams.classzyNo"
          placeholder="请输入计划班列号"
          clearable
          style="width:160px"
          oninput="this.value=this.value.replace(/[, ]/g,'')"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="线路" prop="classEastandwest">
        <el-select
          v-model.trim="queryParams.lineTypeid"
          style="width:90px"
          placeholder="请选择"
          clearable
        >
          <el-option label="中欧" value="0"></el-option>
          <el-option label="中亚" value="2"></el-option>
          <el-option label="中越" value="3"></el-option>
          <el-option label="中俄" value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="往返" prop="classEastandwest">
        <el-select
          v-model.trim="queryParams.classEastandwest"
          style="width:90px"
          placeholder="请选择"
          clearable
        >
          <el-option label="西向" value="0"></el-option>
          <el-option label="东向" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="拼整箱" prop="isconsolidation">
        <el-select
          v-model.trim="queryParams.isconsolidation"
          style="width:90px"
          placeholder="请选择"
          clearable
        >
          <el-option label="整箱" value="0"></el-option>
          <el-option label="拼箱" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="列数" prop="lieshu">
        <el-input
          v-model.trim="queryParams.lieshu"
          placeholder="请输入列数"
          clearable
          style="width:140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="箱管审核状态" prop="xgCheck">
        <el-select
          v-model.trim="queryParams.xgCheck"
          style="width:90px"
          placeholder="请选择"
          clearable
        >
          <el-option label="是" value="是"></el-option>
          <el-option label="否" value="否"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跟单审核状态" prop="gdCheck">
        <el-select
          v-model.trim="queryParams.gdCheck"
          style="width:90px"
          placeholder="请选择"
          clearable
        >
          <el-option label="是" value="0"></el-option>
          <el-option label="否" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="公路审核状态" prop="roadCheck">
        <el-select
          v-model.trim="queryParams.roadCheck"
          style="width:90px"
          placeholder="请选择"
          clearable
        >
          <el-option label="是" value="是"></el-option>
          <el-option label="否" value="否"></el-option>
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
      <el-form-item label="发运状态" prop="isRun">
        <el-select v-model.trim="queryParams.isRun" style="width:90px" placeholder="请选择" clearable>
          <el-option label="已发运" value="1"></el-option>
          <el-option label="未发运" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="托书状态" prop="isexamline">
        <el-select
          v-model.trim="queryParams.isexamline"
          style="width:160px"
          placeholder="请选择"
          clearable
        >
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
          <el-option label="订舱报价中" value="14" />
          <el-option label="订舱确认中" value="15" />
        </el-select>
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
          size="mini"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="发运日期" prop="actualClassDateValue">
        <el-date-picker
          v-model.trim="value2"
          type="daterange"
          size="mini"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <!-- 20尺({{box20}}) 40尺({{box40}}) 45尺({{box45}}) 体积({{boxV}}) 毛重({{boxKG}}) 箱量({{boxXL}})   -->
        20尺({{box20}}) 40尺({{box40}}) 45尺({{box45}}) 箱量({{boxXL}})
        <el-button
          type="primary"
          icon="el-icon-search"
          v-hasPermi="['classOrder:dczStation:query']"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:dczorders:upload']"
          size="mini"
          type="primary"
          icon="edit"
          @click="handleUpload"
        >导入</el-button>
        <input type="file" @change="getFile($event)" style="display:none" ref="menuFile" />
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:dczorders:export0']"
          type="success"
          size="mini"
          icon="el-icon-download"
          @click="handleExport0"
        >下载模板</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:dczorders:export1']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:dczorders:export2']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="handleDLExport"
        >多联导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:dczorders:edit']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleUpdate"
        >编辑</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          size="mini"
          :disabled="single"
          @click="handleDelete"
          v-hasPermi="['classOrder:dczorders:del']"
        >删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          size="mini"
          :disabled="multiple"
          @click="handlbanlieNum"
          v-hasPermi="['classOrder:dczorders:editbh']"
        >班列号</el-button>
      </el-col>
    </el-row>

    <el-table
      class="el-tableCss0"
      v-loading="loading"
      :data="list"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="班列日期" align="center" prop="classDate" fixed="left">
        <template slot-scope="scope">
          <span v-if="scope.row.classDate">{{scope.row.classDate.substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发运日期" align="center" fixed="left">
        <template slot-scope="scope">
          <span
            v-if="scope.row.actualClassDateValue"
          >{{scope.row.actualClassDateValue.substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划班列号" align="center" prop="classzyNo" fixed="left" />
      <el-table-column label="班列号维护时间" align="center" prop="classzynoTime" fixed="left" />

      <el-table-column label="修改记录" align="center" fixed="left">
        <template slot-scope="scope">
          <span
            v-if="scope.row.classzynoRemark"
            @click="historyListFn(scope.row)"
            style="cursor:pointer;"
          >点击查看</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>

      <el-table-column label="申请代码列数" align="center" prop="lieshu" fixed="left" />
      <el-table-column label="托书报关状态" align="center" prop="bgProgressList" fixed="left">
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
      <el-table-column label="关务状态" align="center" prop="guanwustateList" fixed="left">
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
      <el-table-column label="舱位号" align="center" prop="orderNumber" fixed="left" />
      <el-table-column label="集装箱号" align="center" prop="boxNum" fixed="left" />
      <el-table-column label="入场日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.inSpaceDate}} {{scope.row.inSpaceTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼箱部正面吊测重结果 " align="center">
        <template slot-scope="scope">
          <span>{{scope.row.cepianResult}}</span>
        </template>
      </el-table-column>
      <el-table-column label="进站日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.inStationDate}} {{scope.row.inStationTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="箱号校验" align="center">
        <template slot-scope="scope">{{scope.row.boxNumCheck}}</template>
      </el-table-column>
      <el-table-column label="上货站" align="center" prop="orderUploadsite" />
      <el-table-column label="下货站" align="center" prop="orderUnloadsite" />
      <el-table-column label="订舱方" align="center" prop="clientUnit" />
      <el-table-column label="跟单备注" align="center" prop="gdRemark" />
      <el-table-column label="推荐人" align="center" prop="clientTjr" />
      <el-table-column label="跟单" align="center" prop="orderMerchandiser" />
      <el-table-column label="托书箱型" align="center" prop="containerType" />
      <el-table-column label="托书箱量" align="center" prop="containerBoxamount" />
      <el-table-column label="托书品名" align="center" prop="goodsName" />
      <el-table-column label="托书体积" align="center" prop="goodsCbm" />
      <el-table-column label="托书毛重" align="center" prop="goodsKgs" />
      <el-table-column label="计费体积" align="center" prop="goodsVolume" />
      <el-table-column label="运踪状态" align="center">
        <template slot-scope="scope">{{scope.row.trackState}}</template>
      </el-table-column>
      <el-table-column label="是否代码申请" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isApplyCode === '0'">否</span>
          <span v-else-if="scope.row.isApplyCode === '1'">是</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="随车审核人" align="center" prop="scPrincipal" />
      <el-table-column label="公路部审核时间" align="center" prop="roadtime" />
      <el-table-column label="跟单部审核时间" align="center" prop="gdtime" />
      <el-table-column label="箱管部审核时间" align="center" prop="xgtime" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="发运日期">
              <el-date-picker
                v-model.trim="form.actualClassDateValue"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="是否为P" prop="isClassAdd">
              <el-select v-model.trim="form.isClassAdd">
                <el-option value label="非P">非P</el-option>
                <el-option value="P" label="P">P</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="列数" prop="lieshu">
              <el-input v-model.trim="form.lieshu" placeholder="请输入列数" clearable />
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
    <el-dialog title="班列号-编辑" :visible.sync="open1" width="45%">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="180px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="班列号" prop="classzyNo">
              <el-input v-model.trim="form1.classzyNo" placeholder="请输入班列号" clearable />
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
  classBhEecord
} from "@/api/cabinArrangementMange/dczorders";
import { parseTime } from "@/utils/zhonghao";

import {
  validatePhone,
  validateTelphone,
  validateEMail
} from "@/api/validator";
import "@/assets/styles/selfCss0.css";

export default {
  name: "DczStation",
  data() {
    return {
      historyListdata: [],
      open2: false, //修改记录弹框
      // ***************************************  修改  *********************************************************
      form: {}, // form表单
      formDisabled: false,
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
        deptCode: null,
        pageNum: 1,
        pageSize: 10
      },
      box20: 0,
      box40: 0,
      box45: 0,
      boxV: 0,
      boxKG: 0,
      boxXL: 0,
      total: 0, // 总条数
      list: [], // 订舱托书列表数据
      // ******************************************* 其他字段 *****************************************************
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中list数组
      arrs: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      value1: [], // 查询条件 班列日期
      value2: [], // 查询条件 发运日期
      fileList: []
    };
  },
  created() {
    this.queryParams["userid"] = this.$store.getters.id;
    this.queryParams.deptCode = this.$store.getters.deptCode;
    this.getList();
    // this.boxAmountTotalFn()
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
    //导入
    handleUpload() {
      this.$refs.menuFile.value = "";
      this.$refs.menuFile.click();
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0];
      var zipFormData = new FormData();
      zipFormData.append("file", this.upath); //file对应传输的文件
      importTrackTime(zipFormData).then(res => {
        if (res.code === 200) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "导入成功",
            type: "success",
            duration: 2000
          });
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
    handleapplyCode() {
      let row = this.arrs[0];
      if (row.classEastandwest === "0" && row.lineTypeid === "2") {
        let row = this.arrs[0];
        let params = {
          id: row.id,
          isApplyCode: "1",
          updateBy: this.$store.getters.name
        };
        this.$confirm("是否确认申请代码吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function() {
            return applyCodeApi(params);
          })
          .then(res => {
            if (res.code === 200) {
              this.getList();
              this.msgSuccess("操作成功");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(function() {});
      } else {
        this.$message.error("去程中亚才可执行此操作");
      }
    },
    boxAmountTotalFn() {
      boxAmountTotalApi(this.queryParams).then(res => {
        if (res.code === 200) {
          this.box20 = res.data["20t"];
          this.box40 = res.data["40t"];
          this.box45 = res.data["45t"];
          this.boxV = res.data.v;
          this.boxKG = res.data.w;
          this.boxXL = res.data.xl;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleExceed() {},
    beforeRemove() {},
    handleRemove() {},
    handlePreview() {},
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.boxAmountTotalFn();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.value1 = null;
      this.value2 = null;
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
      };
      this.queryParams["userid"] = this.$store.getters.id;
      this.queryParams["deptCode"] = this.$store.getters.deptCode;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.arrs = selection.map(item => item);
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /* 班列号按钮 操作 */
    handlbanlieNum() {
      this.open1 = true;
    },
    cancel1() {
      this.open1 = false;
      this.form1 = {};
    },
    submitForm1: function() {
      this.$refs["form1"].validate(valid => {
        if (valid) {
          let params = {
            updateBy: this.$store.getters.name,
            classzyNo: this.form1.classzyNo,
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
        }
      });
    },
    /* 修改按钮 操作 */
    handleUpdate() {
      let row = this.arrs[0];

      if (row.classEastandwest === "0" && row.lineTypeid === "2") {
        this.formDisabled = false;
        this.reset();
        const id = row.id || this.ids[0];
        let params = {
          id: id
        };
        detailApi(params).then(response => {
          this.form = response.data;
          if (!this.form.isClassAdd) {
            this.form.isClassAdd = "";
          }
          this.open = true;
          this.title = "修改";
        });
      } else {
        this.$message.error("去程中亚才可执行此操作");
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let actualClassDateValue = null;
          if (this.form.actualClassDateValue) {
            actualClassDateValue = parseTime(this.form.actualClassDateValue);
          }
          let params = {
            updateBy: this.$store.getters.name,
            actualClassDateValue,
            isClassAdd: this.form.isClassAdd,
            classDate: this.form.classDate,
            lieshu: this.form.lieshu,
            idsArr: this.ids
          };

          editApi(params).then(response => {
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
    /*  “模板下载” 操作 */
    handleExport0() {
      downLoadExcel().then(response => {
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = "订舱组发运表.xlsx"; // xxx.xls/xxx.xlsx
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        this.$notify({
          title: "成功",
          message: "模板下载成功",
          type: "success",
          duration: 2000
        });
      });
    },
    /*  “导出” 操作 */
    handleExport() {
      this.queryParams["userid"] = this.$store.getters.id;
      this.queryParams["deptCode"] = this.$store.getters.deptCode;
      let queryParams = this.queryParams;
      exportTrack(queryParams).then(res => {
        this.download(res.msg);
      });
    },
    /*  “多联导出” 操作 */
    handleDLExport() {
      this.queryParams["userid"] = this.$store.getters.id;
      this.queryParams["deptCode"] = this.$store.getters.deptCode;
      let queryParams = this.queryParams;
      exportTrackDl(queryParams).then(res => {
        this.download(res.msg);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids[0];
      this.$confirm("是否确认删除所选数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delApi(id);
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
</style>

