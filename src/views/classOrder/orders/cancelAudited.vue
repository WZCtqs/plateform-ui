<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="委托书编号" prop="orderNumber" label-width="90px">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

        <el-form-item label="业务部门" prop="organizationCode">
         <el-input
          v-model.trim="queryParams.organizationCode"
          placeholder="请输入业务部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="跟单员" prop="orderMerchandiser">
        <el-input
          v-model.trim="queryParams.orderMerchandiser"
          placeholder="请输入跟单员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="订舱方" prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入订舱方"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

       <el-form-item label="班列日期" prop="classDate">
        <el-date-picker v-model.trim="queryParams.classDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>

     

       <el-form-item label="往返" prop="classEastandwest">
        <el-select v-model.trim="queryParams.classEastandwest" placeholder="请选择" clearable size="small">
          <el-option label="-请选择-" value />
          <el-option label="西向" value="0" />
          <el-option label="东向" value="1" />
        </el-select>
      </el-form-item>

     <el-form-item label="路线" prop="lineTypeid">
        <el-select v-model.trim="queryParams.lineTypeid" placeholder="请选择" clearable size="small">
          <el-option label="-请选择-" value />
          <el-option label="中欧" value="0" />
          <el-option label="中亚" value="2" />
          <el-option label="中越" value="3" />
          <el-option label="中俄" value="4" />
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['classOrder:goAudited:query']" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleShenhe"
          v-hasPermi="['classOrder:goCancel:check']"
        >撤舱审核</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleCancelOrder"
          v-hasPermi="['classOrder:goAudited:check']"
        >取消托书</el-button> -->
      </el-col>
    </el-row>

    <el-table
      :class="this.heightScreen===590?'xx1 orderTable':'xx2 orderTable'"
      v-loading="loading"
      :data="list"
      border
      ref="multipleTable"
      @select-all="onSelectAll"
      @selection-change="handleSelectionChange"
      @row-click="handleRow"
      :height="heightScreen"
    >
      <el-table-column type="selection"  align="center"  />
      <el-table-column label="委托书编号" align="center"  width="120">
        <template slot-scope="scope">
          <a @click="handleDetail(scope.row)" class="cursorColumn"> {{scope.row.orderNumber}} </a>
        </template>
      </el-table-column>
     <el-table-column label="品名" align="center" prop="goodsName"  />
     <el-table-column label="班列日期" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.classDate && scope.row.classDate.length >9">{{scope.row.classDate.substring(0,10)}}</span>
          <span v-else> {{scope.row.classDate}}</span>
        </template>
      </el-table-column>
       <el-table-column label="往返" align="center" prop="classEastandwest">
       <template slot-scope="scope">
         <span v-if="scope.row.classEastandwest === '0'">西向</span>
         <span v-if="scope.row.classEastandwest === '1'">东向</span>
        </template>
      </el-table-column>
      <el-table-column label="跟单员" align="center" prop="orderMerchandiser" />
      <el-table-column label="订舱方" align="center" prop="clientUnit" />
      <el-table-column label="发货方" align="center" prop="shipOrederName" />
      <el-table-column label="接收方" align="center" prop="receiveOrderName" />
      <el-table-column label="装箱" align="center" prop="isconsolidation">
       <template slot-scope="scope">
          <span v-if="scope.row.isconsolidation === '0'">整柜</span>
          <span v-if="scope.row.isconsolidation === '1'">拼箱</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleReason(scope.row)"
          >查看原因</el-button>
        </template>
      </el-table-column> -->
       <el-table-column label="申请原因" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          {{scope.row.exmaInfo}}
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

 <!-- 查看托书 对话框 -->
    <el-dialog :title="title" :visible.sync="open1" width="100%">
       <el-form ref="form" :model="form" :rules="rules" label-width="180px" :disabled="formDisabled">

        <!-- <el-form-item>
          <el-radio v-model.trim="pzqh" label="0">拼箱西向</el-radio>
          <el-radio v-model.trim="pzqh" label="1">拼箱东向</el-radio>
          <el-radio v-model.trim="pzqh" label="2">整柜西向</el-radio>
          <el-radio v-model.trim="pzqh" label="3">整柜东向</el-radio>
          {{ pzqh === '0' }} ***
          {{ pzqh === '1' }} ***
          {{ (pzqh === '0') || (pzqh === '1') }}
        </el-form-item> -->

         <h5 class="h5Css1">班列信息</h5>
        <div class="graycss0">
          <!-- <el-row>
            <el-col v-if="(pzqh === '2') || (pzqh === '3') " :span="10">
              <el-form-item label="重箱托书编号" >
                  <el-input v-model.trim="form.zxNumber" :disabled="currentFormStatus === 'detailInfo' && currentFormStatus === 'zhuandai'" />
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="10">
              <el-form-item label="委托书编号">
                <el-input v-model.trim="form.orderNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="跟单员">
                <el-input v-model.trim="form.orderMerchandiser" placeholder="请输入跟单员" :disabled="true" v-if="form.classEastandwest === '1'" />
                <el-input v-model.trim="form.merchandiserW" placeholder="请输入跟单员" :disabled="true" v-if="form.classEastandwest === '0'"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="贸易方式" prop="dictId">
                <el-select v-model.trim="form.dictId" @change="dictIdNameFn()">
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in myList"
                    :key="index"
                    :label="item.mcheng"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="ZIH推荐人">
                <el-input v-model.trim="form.clientTjr" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="班列号">
                <el-input v-model.trim="form.classNumber" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="往返">
                <!-- <el-input v-model.trim="form.classEastAndWest" :disabled="true" /> -->

                <span v-if="form.classEastandwest === '0'">西向</span>
                <span v-else-if="form.classEastandwest === '1'">东向</span>
                <span v-else></span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="班列日期">
                <el-date-picker
                  v-model.trim="form.classDate"
                  type="date"
                  :disabled="true"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
                <!-- <span style="cursor:pointer;" v-if="this.form.isexamline === '6' || this.form.isexamline === '3' || this.form.isexamline === '5'" @click="classesFn">修改班列</span> -->

                <span
                  style="cursor:pointer;"
                  v-if="this.form.isexamline === '0' || this.form.isexamline === '2' || this.form.isexamline === '6' || this.form.isexamline === '3' || this.form.isexamline === '5'"
                  @click="classesFn"
                >修改班列</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" />
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="上货站">
                <el-select v-model.trim="form.orderUploadsite" filterable clearable :disabled="true">
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistupList"
                    :key="index"
                    :label="item.nameCn"
                    :value="item.code"
                  ></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistupList"
                    :key="index"
                    :label="item.nameEn"
                    :value="item.code"
                    v-if="form.yuyan === '1'"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下货站">
                <el-select v-model.trim="form.orderUnloadsite" filterable clearable :disabled="true">
                  <el-option value v-if="form.yuyan === '0'">-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistdownList"
                    :key="index"
                    :label="item.nameCn"
                    :value="item.code"
                    v-if="form.yuyan === '0'"
                  ></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistdownList"
                    :key="index"
                    :label="item.nameEn"
                    :value="item.code"
                    v-if="form.yuyan === '1'"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
 
            <el-col :span="12" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="堆场地址">
                <el-select v-model.trim="form.stationid" filterable clearable :disbled="true">
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in changzhanList"
                    :key="index"
                    :label="item.station"
                    :value="item.stationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col v-if="(pzqh === '1') || (pzqh === '3')" :span="10">
              <el-form-item label="开行班列">
                <el-input v-model.trim="form.lineName" placeholder="请输入开行班列" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="是否需要发票" prop="orderIsticket">
                <el-radio v-model.trim="form.orderIsticket" label="0">否</el-radio>
                <el-radio v-model.trim="form.orderIsticket" label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否可提前班列" prop="putoffClass">
                <el-radio v-model.trim="form.putoffClass" :label="0">是</el-radio>
                <el-radio v-model.trim="form.putoffClass" :label="1">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否有改单费" prop="dcGaidanState">
                <el-radio v-model.trim="form.dcGaidanState" label="否">否</el-radio>
                <el-radio v-model.trim="form.dcGaidanState" label="是">是</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="站到站运费">
                <el-input
                  v-model.trim="form.sitecost"
                  :disabled="true"
                  placeholder="请输入站到站运费"
                  style="width:260px !important;"
                />
                {{form.sitecostCurrency}}
                <!-- <el-radio v-model.trim="form.sitecostCurrency" :disabled="true" label="0">[美金]</el-radio>
                <el-radio v-model.trim="form.sitecostCurrency" :disabled="true" label="1">[人民币]</el-radio> -->
                <span class="msgSpancss0 redTxt">提示：默认起运港收费，目的港收费(请特别备注)，发车后，不再更改。</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <h5 class="h5Css1">详情</h5>
        <div class="graycss1">
          <h5 class="h5Css2">订舱方</h5>
          <el-row>
            <el-col :span="10">
              <el-form-item label="订舱方" prop="clientUnit">
                <el-input v-model.trim="form.clientUnit" placeholder="请输入订舱方" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订舱方地址" prop="clientAddress">
                <el-input v-model.trim="form.clientAddress" placeholder="请输入订舱方地址" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="联系人" prop="clientContacts">
                <el-input v-model.trim="form.clientContacts" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="clientTel">
                <el-input v-model.trim="form.clientTel" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="Email" prop="clientEmail">
                <el-input v-model.trim="form.clientEmail" placeholder="请输入Email" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1') " :span="23" :offset="1">
              <el-form-item label="可堆叠(货物属性)" prop="goodsCannotpileup">
                <el-radio v-model.trim="form.goodsCannotpileup" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsCannotpileup" :disabled="true" label="0">否</el-radio>
                <!-- <el-radio v-model.trim="form.goods_cannotPileUp" label="2">仅可自堆叠</el-radio> -->
                <span class="msgSpancss0 redTxt">提示：货物高度不足1.8米按1.8米算，超过1.8米以实际高度为准.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="23" :offset="1">
              <el-form-item label="易碎品(货物属性)" prop="goodsFragile">
                <el-radio v-model.trim="form.goodsFragile" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsFragile" :disabled="true" label="0">否</el-radio>
                <span class="msgSpancss0 redTxt">提示：结算体积按照测量体积的1.3倍计算.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="23" :offset="1">
              <el-form-item label="单件超长超重" prop="goodsGeneral">
                <el-radio v-model.trim="form.goodsGeneral" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsGeneral" :disabled="true" label="0">否</el-radio>
                <span class="msgSpancss0 redTxt">提示：单件长度超过3.5米或重量超过3吨，会产生额外费用.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="20">
              <el-form-item label="箱属" prop="orderAuditBelongto">
                <!-- 中亚线路：0、2、3 -->
                <!-- 非中亚线路：0、1 -->
                <el-radio v-model.trim="form.orderAuditBelongto" :disabled="true" label="0">委托ZIH</el-radio>
                <el-radio
                  v-if="xlString === 'fzy'"
                  v-model.trim="form.orderAuditBelongto"
                  :disabled="true"
                  label="1"
                >自备</el-radio>
                <el-radio
                  v-if="xlString === 'zy'"
                  v-model.trim="form.orderAuditBelongto"
                  :disabled="true"
                  label="2"
                >自备铁路箱</el-radio>
                <el-radio
                  v-if="xlString === 'zy'"
                  v-model.trim="form.orderAuditBelongto"
                  :disabled="true"
                  label="3"
                >自备非铁路箱</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col v-if="form.clientOrderBindingway === '0'" :span="12">
              <el-form-item label="箱量" prop="containerBoxamount">
                <el-input v-model.trim="form.containerBoxamount" :disabled="true">
                  <template slot="append">*</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="箱型" prop="containerType">
                <el-input v-model.trim="form.containerType" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="报关地点" prop="clientOrderBindingaddress">
                 <el-radio v-if="form.classEastandwest === '0'" v-model.trim="form.clientOrderBindingaddress" label="郑州">郑州</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '汉堡')" v-model.trim="form.clientOrderBindingaddress" label="汉堡">汉堡</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '慕尼黑')" v-model.trim="form.clientOrderBindingaddress" label="慕尼黑">慕尼黑</el-radio>
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="属地">属地</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="业务编号">
                <el-input v-model.trim="form.ywNumber" placeholder="请输入业务编号" />
                <span class="msgSpancss0 redTxt">（提示：如有需要，可在此填写业务编号）</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="委托ZIH报关" prop="clientOrderBindingway">
                <el-radio v-model.trim="form.clientOrderBindingway" label="0">是</el-radio>
                <el-radio
                  v-if="(pzqh === '1') || (pzqh === '3')"
                  v-model.trim="form.clientOrderBindingway"
                  label="1"
                >否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="form.clientOrderBindingway === '0'" :span="12">
              <el-form-item label="报关费用">
                <el-input v-model.trim="form.clientBgCost" placeholder="请输入报关费用">
                  <template slot="append">*[人民币]</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="graycss1">
          <h5 class="h5Css2">发货方</h5>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发货方(中英文)" prop="shipOrederName">
                <el-input v-model.trim="form.shipOrederName" placeholder="请输入发货方(中英文)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="联系人(中英文)" prop="shipOrederContacts">
                <el-input v-model.trim="form.shipOrederContacts">
                  <!-- <template slot="append">*[人民币]</template> -->
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="shipOrederPhone">
                <el-input v-model.trim="form.shipOrederPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="通讯地址(中英文)" prop="shipOrederAddress">
                <el-input v-model.trim="form.shipOrederAddress" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="shipOrederEmail">
                <el-input v-model.trim="form.shipOrederEmail" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="由ZIH提货">
                <el-radio v-model.trim="form.shipOrderBinningway" :disabled="true" label="0">是</el-radio>
                <el-radio v-model.trim="form.shipOrderBinningway" :disabled="true" label="1">否</el-radio>
                <el-radio
                  v-if="pzqh === '2'"
                  v-model.trim="form.shipOrderBinningway"
                  :disabled="true"
                  label="2"
                >铁路到货</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10">
              <!-- 提箱地显示情况 -->
              <!-- 1、由ZIH提货：是，提货方式是：整箱到车站 -->
              <!-- 2、箱属：委托zih，由ZIH提货：否，提货方式是：整箱到车站 -->
              <template
                v-if="(form.shipOrderBinningway === '0' && form.shipThTypeId === '0') || (form.shipOrderBinningway === '1' && form.shipThTypeId === '0' && form.orderAuditBelongto === '0')"
              >
                <template>
                  <el-col :span="16">
                    <el-form-item label="提箱地" prop="shipHyd">
                      <span v-if="pzqh === '0' || pzqh === '2'"> {{form.shipHyd}}</span>
                      <span v-if="pzqh === '0' || pzqh === '2'"> {{form.shipFhSite}}</span>
                    </el-form-item>
                  </el-col>
                   <el-col :span="8">
                    <el-form-item label="提箱费" prop="pickUpBoxFee" label-width="80px">
                      <el-input v-model.trim="form.pickUpBoxFee" placeholder="" />
                    </el-form-item>
                  </el-col>
                </template>
              </template>
            </el-col>
          </el-row>
          <el-row v-if="form.shipOrderBinningway === '0'">
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="10">
              <el-form-item label="联系人(中英文)" prop="shipOrderUnloadcontacts">
                <el-input v-model.trim="form.shipOrderUnloadcontacts" placeholder="请输入联系人(中英文)" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="联系方式" prop="shipOrderUnloadway">
                <el-input v-model.trim="form.shipOrderUnloadway" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="联系邮箱" prop="shipOrderUnloadwayEmail">
                <el-input v-model.trim="form.shipOrderUnloadwayEmail" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货方式" prop="shipThTypeId">
                <el-radio v-model.trim="form.shipThTypeId" label="0" v-if="(pzqh === '2') || (pzqh === '3')">整箱到车站</el-radio>
                <el-radio v-model.trim="form.shipThTypeId" label="1" >散货到堆场</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货时间" prop="shipOrderUnloadtime">
                 <el-date-picker v-model.trim="form.shipOrderUnloadtime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH" value-format="yyyy-MM-dd HH:00:00"  />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货地址" prop="shipOrderUnloadaddress">
                <el-input v-model.trim="form.shipOrderUnloadaddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="(pzqh === '0') || (pzqh === '2')">
              <el-form-item label="详细地址" >
                <el-input v-model.trim="form.detailedAddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货费用">
                <el-input v-model.trim="form.shipThCost" placeholder :disabled="true" />
               
                  <template slot="append" v-if="form.zxThcostCurrency === '0'">*[美金]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '1'">*[人民币]</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货费报价编号">
                <el-input v-model.trim="form.shipThCostNo" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.shipOrderBinningway === '1'">
            <el-col :span="10">
              <el-form-item label="自送货时间" prop="shipOrderSendtime">
                <el-date-picker v-model.trim="form.shipOrderSendtime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH" value-format="yyyy-MM-dd HH:00:00" />
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10">
              <el-form-item label="自送货方式" prop="shipZsTypeId">
                <el-radio v-model.trim="form.shipZsTypeId" label="0">散货到堆场</el-radio>
                <el-radio v-model.trim="form.shipZsTypeId" label="1">整箱到车站</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="graycss1">
          <h5 class="h5Css2">收货方</h5>
          <el-row>
            <el-col :span="10">
              <el-form-item label="收货方(英文)" prop="receiveOrderName">
                <el-input v-model.trim="form.receiveOrderName" placeholder="请输入收货方(英文)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人(英文)" prop="receiveOrderContacts">
                <el-input v-model.trim="form.receiveOrderContacts" placeholder="请输入联系人(英文)" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="联系电话" prop="receiveOrderPhone">
                <el-input v-model.trim="form.receiveOrderPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="receiveOrderMail">
                <el-input v-model.trim="form.receiveOrderMail" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="通讯地址(英文)" prop="receiveOrderAddress">
                <el-input v-model.trim="form.receiveOrderAddress" placeholder="请输入通讯地址(英文)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="由ZIH代理清关">
                <el-radio v-model.trim="form.receiveOrderIsclearance" :disabled="true" label="0">否</el-radio>
                <el-radio v-model.trim="form.receiveOrderIsclearance" :disabled="true" label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="form.receiveOrderIsclearance === '1'">
              <el-form-item label="清关费用">
                <el-input v-model.trim="form.receiveQgCost" placeholder="请输入清关费用" />
                <el-radio v-model.trim="form.qgCostcurrency"  label="美金">*美金</el-radio>
                <el-radio v-model.trim="form.qgCostcurrency"  label="人民币">*人民币</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="由ZIH代理分拨" prop="receiveOrderIspart">
                <el-radio v-model.trim="form.receiveOrderIspart" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.receiveOrderIspart" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- form.receiveOrderIspart -->
          <el-row v-if="form.receiveOrderIspart === '1'">
            <el-col :span="10">
              <el-form-item label="联系人(中英文)" prop="receiveOrderZihcontacts">
                <el-input v-model.trim="form.receiveOrderZihcontacts" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Email" prop="receiveOrderZihemail">
                <el-input v-model.trim="form.receiveOrderZihemail" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="送货地址(中英文)" prop="receiveOrderPartaddress">
                <el-input v-model.trim="form.receiveOrderPartaddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="送货详细地址(中英文)" prop="detailedAddress">
                <el-input v-model.trim="form.detailedAddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="电话" prop="receiveOrderZihtel">
                <el-input v-model.trim="form.receiveOrderZihtel" placeholder />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="送货费用">
                <el-input v-model.trim="form.receiveShCost" placeholder :disabled="true" />
                 <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="￥">人民币</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="$">美金</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="€">欧元</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="送货费报价编号">
                <el-input v-model.trim="form.receiveShCostId" :disabled="true" placeholder />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 箱管费、还箱地点显示条件：
             1、箱属：委托ZIH（0）
             2、由ZIH代理分拨：是
             3、整柜-->
          <el-row
            v-if="(form.receiveOrderIspart === '1') && (pzqh === '2' || pzqh === '3') && (form.orderAuditBelongto === '0') "
          >
              
            <el-col :span="10">
              <el-form-item label="还箱费">
                <el-input v-model.trim="form.returnBoxFee" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
            
            <el-col :span="10">
              <el-form-item label="还箱地点" prop="receiveHxAddress">
                {{form.receiveHxAddress}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="在途信息接收邮箱" prop="receiveOrderReceiveemail">
                <el-input v-model.trim="form.receiveOrderReceiveemail" placeholder="请输入在途信息接收邮箱" />
                <span class="msgSpancss0 redTxt">* 提示：（可以添加多个邮箱,中间用‘;’隔开）</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item label="到站通知提货邮箱" prop="receiveOrderMail">
                <el-input v-model.trim="form.receiveOrderMail" placeholder="请输入到站通知提货邮箱" />
                <span class="msgSpancss0 redTxt">* 提示：（可以添加多个邮箱,中间用‘;’隔开）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="(pzqh === '2' && form.lineTypeid === '4')">
            <el-col :span="4">
              <el-form-item label="到站提箱公司" >
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="中文发货人" prop="consignorc" >
                <el-input v-model.trim="form.consignorc" placeholder="请输入中文发货人" />
              </el-form-item>
              <el-form-item label="发货人声明" >
                <el-input v-model.trim="form.econsignorstate" placeholder="" />
              </el-form-item>
               <el-form-item label="实际收货人名称" prop="etxCompany" >
                <el-input v-model.trim="form.etxCompany" placeholder="" />
              </el-form-item>
               <el-form-item label="承担监管区费用的公司（或个人）名称" prop="etxName">
                <el-input v-model.trim="form.etxName" placeholder="" />
              </el-form-item>
               <el-form-item label="ИНН税号" prop="eduty" >
                <el-input v-model.trim="form.eduty" placeholder="" />
              </el-form-item>
            
            </el-col>
          </el-row>
        </div>
        <div class="graycss1">
          <h5 class="h5Css2">货物</h5>
          <el-row>
            <el-col :span="10">
              <el-form-item label="唛头" prop="goodsMark">
                <el-input v-model.trim="form.goodsMark" placeholder="请输入唛头" />
                <span class="msgSpancss0 redTxt">提示：没有请填写无</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货品中文名称" prop="goodsName">
                <el-input v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="货品英文名称	" prop="goodsEnName">
                <el-input v-model.trim="form.goodsEnName" placeholder="请输入货品英文名称	" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="pzqh === '0' || pzqh === '2'">
              <el-form-item label="国内报关HS" prop="goodsInReport">
                <el-input v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="pzqh === '1' || pzqh === '3'">
              <el-form-item label="国外报关HS" prop="goodsReport">
                <el-input v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10" v-if="pzqh === '0' || pzqh === '2'">
              <el-form-item label="国外清关HS	" prop="goodsOutClearance">
                <el-input v-model.trim="form.goodsOutClearance" placeholder="请输入国外清关HS	" />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="pzqh === '1' || pzqh === '3'">
              <el-form-item label="国内清关HS	" prop="goodsClearance">
                <el-input v-model.trim="form.goodsClearance" placeholder="请输入国内清关HS	" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="最外层包装形式" prop="goodsPacking">
                <el-select
                  v-model.trim="form.goodsPacking"
                  :disabled="!(goodsPacking1 == '' || goodsPacking1 == null)"
                  clearable
                >
                  <el-option value v-if="form.yuyan === '0'">-请选择-</el-option>
                  <el-option value="托盘" label="托盘" v-if="form.yuyan === '0'">托盘</el-option>
                  <el-option value="纸箱" label="纸箱" v-if="form.yuyan === '0'">纸箱</el-option>
                  <el-option value="木箱" label="木箱" v-if="form.yuyan === '0'">木箱</el-option>
                  <el-option value="裸装" label="裸装" v-if="form.yuyan === '0'">裸装</el-option>

                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option value="Pallets" label="Pallets" v-if="form.yuyan === '1'">Pallets</el-option>
                  <el-option value="Cartons" label="Cartons" v-if="form.yuyan === '1'">Cartons</el-option>
                  <el-option
                    value="Wooden box"
                    label="Wooden box"
                    v-if="form.yuyan === '1'"
                  >Wooden box</el-option>
                  <el-option
                    value="Nuded cargo"
                    label="Nuded cargo"
                    v-if="form.yuyan === '1'"
                  >Nuded cargo</el-option>
                </el-select>
                <el-input
                  :disabled="!(form.goodsPacking == '' || form.goodsPacking == null)"
                  v-model.trim="goodsPacking1"
                  placeholder="请输入最外层包装形式"
                  style="width:200px !important;"
                />
                <span class="msgSpancss0 redTxt">* 选择一项或者自己填写</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="最外层包装数量	" prop="goodsNumber">
                <el-input v-model.trim="form.goodsNumber" placeholder="请输入最外层包装数量	" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="pzqh !== '2'">
              <el-form-item label="总体积(CBM)" >
                {{form.goodsCbm}}
                <!-- <el-input v-model.trim="form.goodsCbm" placeholder="请输入总体积(CBM)" /> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="总毛重(KGS)">
                {{form.goodsKgs}}
                <!-- <el-input v-model.trim="form.goodsKgs" placeholder="请输入总毛重(KGS)" /> -->
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="规格(CM)">
                <span v-for="(item,index) in goodsList" :key="index">{{item.goodsName}} : {{item.goodsLength}} * {{item.goodsWidth}} * {{item.goodsHeight}} <br/></span>
                <span class="msgSpancss0 redTxt">* 填写规则:L*W*H</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col :span="10">
              <el-form-item label="是否需要装箱方案">
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="0">需要</el-radio>
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="1">不需要</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="是否派监装员">
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="form.shipOrderIsdispatch === '1'" :span="10">
              <el-form-item label="监装费用" prop="shipJzCost">
                <el-input v-model.trim="form.shipJzCost" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
             <el-col :span="10">
              <el-form-item label="危险品备注" prop="nameRemark">
                <el-input v-model.trim="form.nameRemark" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
             <el-col  :span="10">
              <el-form-item label="特殊单证备注" prop="noteRemark">
                <el-input v-model.trim="form.noteRemark" placeholder :disabled="true" />
              </el-form-item>
            </el-col> 
          
             <el-col :span="20" v-if="form.noteColor === '1'">
              <el-form-item label="">
                <el-input v-model.trim="form.hsbz" type="textarea" :autosize="{ minRows: 2}" />
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input v-model.trim="form.goodsbz" type="textarea" :autosize="{ minRows: 2}" />
                <!-- <el-button @click="open_fjDownloadDialog(form.id)">附件</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </div>
 
      </el-form>
      
      <!-- 委托书 关闭 弹框中的操作按钮 -->
      <div  slot="footer" class="dialog-footer">
        <el-button @click="cancel1">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 撤舱审核 弹框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="180px">
          <h5 class="h5Css0">撤舱审核</h5>
              <el-row>
                 <el-col :span="20">
                   <!-- 整箱显示 -->
                  <el-form-item label="撤舱审核" prop="isexamline">
                    <el-radio v-model.trim="form1.isexamline" label="3">审核通过</el-radio>
                    <el-radio v-model.trim="form1.isexamline" label="5">审核失败</el-radio>
                    <!-- <span class="msgSpancss0 redTxt">提示：默认起运港收费，目的港收费(请特别备注)，发车后，不再更改。</span> -->
                  </el-form-item>
                </el-col>
                <el-col :span="20" v-if="form1.isexamline === '5'">
                  <el-form-item label="审核失败原因" prop="examInfo">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2}"
                      placeholder="请输入转待失败原因"
                      v-model.trim="form1.examInfo"
                    ></el-input>
                  </el-form-item>
                </el-col>

              </el-row>
               
      </el-form>
     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shenheFn()">确定</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    
    </el-dialog>

<!-- 查看弹框中的“下载附件”列表弹框 -->
    <el-dialog
      width="65%"
      title="跟单员-选择"
      :visible.sync="fjDownloadDialog"
      append-to-body
      :destroy-on-close="true"
    > 
      <el-table
        v-loading="loading"
        ref="multipleTable0"
        :data="datalist0"
       
      >
        <el-table-column label="文件名" align="center" prop="num" />
        <el-table-column label="操作" align="center" prop="name">
          <template slot-scope="scope">
               <a>下载</a>
          </template>
        </el-table-column>
      </el-table>
       <pagination
      v-show="total0>0"
      :total="total0"
      :page.sync="queryParams0.pageNum"
      :limit.sync="queryParams0.pageSize"
      @pagination="getList0"
    />
      <el-row>
        <el-col :span="24">
          <el-button type="info" @click="close_fjDownloadDialog()">关 闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>

     <!-- 转待审核修改记录列表 弹框 -->
    <el-dialog title="委托书信息更新列表" :visible.sync="isupdateListDialog" width="45%" :destroy-on-close="true">
      <div>
        <ul  class="isupdateListULCss0">
         <li class="isupdateListLICss0" style="bakcground:#333;font-weight:bold;">
            <span v-if="!isupdateList.list || isupdateList.list.length === 0">暂无数据</span>
            {{isupdateList.title}}
          </li>
         <li v-for="(item,index) in isupdateList.list" :key="index">{{item}}</li>
       </ul>
      </div>
       
    </el-dialog>
  </div>
</template>

<script>
import { cancelCheckList,detailapi,getSiteByOrderId, cancelCheckReply, checkEditRecord,orderCancelapi,stationList,goodsInfo,addIsRead } from "@/api/classOrder/orders";

import {
  validatePhone,
  validateTelphone,
  validateEMail
} from "@/api/validator";
import "@/assets/styles/selfCss0.css";

export default {
  name: 'GoAudited',
  data() {
    return {
      // *************************************** 下载附件 *********************************************************
      fjDownloadDialog:false, // 下载附件 弹框状态
       // 附件下载列表 查询参数
      queryParams0: {
        pageNum: 1,
        pageSize: 10,

      },
      // 附件下载列表 总条数
      total0: 0,
      datalist0:[], //附件下载 列表list数据
      // *************************************** 托书修改、审核 *********************************************************
       currentFormStatus: '',
      shenheAction:'0' , // 托书审核操作选项
      form: {}, // 客户审核信息form表单
      formDisabled: false,
      // 表单校验
      rules: { },
      rules1: {  examInfo: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ]},
      title: "",  // 弹出层标题
      open1: false,  // 客户审核弹框是否显示  
      open: false,   // 客户查看详情弹框是否显示
      zdState: 1, //查询条件中 “站点” 模块显示状态
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
       // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userid:null,
        deptCode:null
      },
      total: 0,  // 总条数
      list: [], // 订舱托书列表数据
       // 托书当前 拼/整箱、去/回程字段
      //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；
      pzqh: '0',
      xlString: 'zy', // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
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
       myList:[], //贸易方式 列表数据
      apiStr:null,
      goodsPacking1:null, // 最外层包装形式 输入框值
      sitelistupList:[], //上货站
      sitelistdownList:[],//下货站
      isupdateList:[], // 修改记录
      isupdateListDialog:false, // 修改记录弹框
      form1:{}, // 转待审核操作弹框
      heightScreen:null,
      goodsList:[],
      changzhanList:[],
    };
  },
  created() {
    this.queryParams.queryParams = this.$store.getters.id;
    this.queryParams.deptCode = this.$store.getters.deptCode;

    this.getList();
  },
  mounted() {    
     if(window.screen.height >800){
        this.heightScreen = 590
      }else{
        this.heightScreen = 470
      }
  },
  watch: {
   
  },
  methods: {
    stationListFn(){
    
      let isReportStr=null
      if(this.form.clientOrderBindingway){
        if(this.form.clientOrderBindingway === '0'){
            isReportStr = '1'
        }else if(this.form.clientOrderBindingway === '1'){
            isReportStr = '0'
        }
      }
      let params={
        isconsolidation:this.form.isconsolidation,
        isenabled:'0',
        isReport:isReportStr
      }
      stationList(params).then(res=>{
        if(res.code === 200){
          this.changzhanList=res.rows
        }else{
          this.msgError(res.msg)
        }
      })
    },

    dictIdNameFn(){
     this.myList.filter(item=>{
       if(item.id === this.form.dictId){
         this.form.dictName=item.mcheng
       }
     })
    },
    /** 查询客户管理列表 */
    getList() {
      this.loading = true;
      
      cancelCheckList(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 取消按钮
    cancel1() {
      this.open1 = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //全选时间执行清空操作
    onSelectAll() {
        this.$refs.multipleTable.clearSelection();
      },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.arrs = selection.map(item => item);
    //   this.ids = selection.map(item => item.orderId);
    //   this.single = selection.length != 1;
    //   this.multiple = !selection.length;
    // },
    //只能单选
    handleSelectionChange(rows) {
      debugger
        if (rows.length > 1) {
          var newRows = rows.filter((it, index) => {
            if (index == rows.length - 1) {
              this.$refs.multipleTable.toggleRowSelection(it, true);
              return true;
            } else {
              this.$refs.multipleTable.toggleRowSelection(it, false);
              return false;
            }
          });
          
        } else {
           this.arrs = rows.map(item => item);
           this.ids = rows.map(item => item.orderId);
          this.multipleSelection = rows;
          this.single = rows.length !== 1;
          this.multiple = !rows.length;
        }
      },
    handleRow(obj){
      this.$refs.multipleTable.toggleRowSelection(obj);
    },
     // 获取上下货站
    getSiteByOrderIdFn(obj){
       
      let params={
        classId:this.form.classId,
        orderId:this.form.orderId
      }
      getSiteByOrderId(params).then(res=>{
        if(res.code === 200){
          this.open1 = true
          this.title1 = obj

          this.sitelistupList=res.data.sitelistup
          this.sitelistdownList=res.data.sitelistdown
        }else{
          this.$message.error(res.msg)
        }
       
      })
    },
    /* 查看托书 */
    handleDetail(row){
      this.currentFormStatus = "detailInfo";
      this.formDisabled = true;
      this.reset();
      const orderId = row.orderId || this.ids;
      
       detailapi(orderId).then(res => {
        this.form = res.data

        let inquiryRecordId=res.data.inquiryRecordId;
        // 获取货物 规格数据 
        goodsInfo(inquiryRecordId).then(res=>{
          this.goodsList=res.rows
        })
         //获取场站下拉列表数据
         this.stationListFn()

        // 获取上下货站
         this.getSiteByOrderIdFn('查看')
        // classEastandwest: 0为去程 1为回程
        // isconsolidation: 整拼箱 0整柜 1拼箱
         //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；
    
        if(res.data.classEastandwest === '0' && res.data.isconsolidation === '1'){
          this.pzqh='0'
        }else if(res.data.classEastandwest === '1' && res.data.isconsolidation === '1'){
          this.pzqh='1'
        }else if(res.data.classEastandwest === '0' && res.data.isconsolidation === '0'){
          this.pzqh='2'
        }else if(res.data.classEastandwest === '1' && res.data.isconsolidation === '0'){
          this.pzqh='3'
        }
        // 线路类型：0中欧 2中亚 3中越 4中俄
        // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
        if(res.data.lineTypeid === '2' ){
          this.xlString='zy'
        }else{
          this.xlString='fzy'
        }
       
      })
    },
    
    /** 审核弹框打开 */
     handleShenhe() {
       this.open=true
       this.form1 = {
        createuserid: this.$store.getters.id,
        createusername: this.$store.getters.name,
        examInfo:'',
        isexamline:'3',
        orderId:this.arrs[0].orderId,
      }
      
    },
    // 审核通过 方法
    shenheFn() {
      this.$refs["form1"].validate(valid => {
        if (valid) {
          let params={}
          params['createuserid']= this.$store.getters.id
          params['createusername']= this.$store.getters.name
          params.dcGaidanState=this.form1.dcGaidanState , 
          params.examInfo=this.form1.examInfo  // 申请转待原因
          params.isexamline=this.form1.isexamline  // 操作状态
          params.orderId=this.ids[0] // 订单id
         
          this.$confirm(
            '是否确认要执行此操作吗?',
            "警告",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(function() {
            return cancelCheckReply(params);
          })
          .then((res) => {
            if(res.code === 200){
              this.getList();
              this.msgSuccess("操作成功");
              this.open=false
            }else{
              this.msgError(res.msg)
            }
          
          })
          .catch(function() {});
        }
      })
      
    },
   
    /** 提交按钮 */
   
     /** 取消托书 按钮操作 */
    // handleCancelOrder() {
    //   
    //   const orderId =this.ids[0]
    //   let params={
    //     orderId,
    //     isexamline:'3',
    //     createuserid: this.$store.getters.id,
    //     createusername: this.$store.getters.name
    //   }

    //   this.$confirm(
    //     '是否确认取消托书编号为"' + orderId + '"的数据项?',
    //     '警告',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   )
    //     .then(function() {
    //       return orderCancelapi(params);
    //     })
    //     .then((res) => {
    //       if(res.code === 200){
    //         this.getList()
    //         this.msgSuccess('操作成功')
    //       }else{
    //         this.msgError(res.msg)
    //       }
    //     })
    //     .catch(function() {})
    // },
    /* 查看原因 */
    handleReason(row){
      let zdyy='暂无数据'
      
      if(row.exmaInfo){
        zdyy=row.exmaInfo
      }
       this.$alert(zdyy, '转待原因', {
          confirmButtonText: '关闭',
        });
    },

    /*  查看驳回原因 */
    bohuiReason(obj){
      let rowData=obj
      if(obj.isread === '0'){
        let params={
          orderId:obj.orderId
        }
        addIsRead(params).then(res=>{
          if(res.code === 200){
            const h = this.$createElement;
            this.$notify({
              title: '驳回原因',
              message: h('i', { style: 'color: teal'}, !!rowData.refuseInfo?rowData.refuseInfo:'暂无数据')
            });
            this.getList()
          }else{
            this.$message.error(res.msg)
          }
        })
      }else{
        const h = this.$createElement;
            this.$notify({
              title: '驳回原因',
              message: h('i', { style: 'color: teal'}, !!rowData.refuseInfo?rowData.refuseInfo:'暂无数据')
            });
      
      }
    },

     /* 查看 转待修改记录 */
    handleEditList(obj){
      
      let params={orderId:obj.orderId}
      checkEditRecord(params).then(res=>{
        if(res.code === 200){
          this.isupdateList=res.data
          this.isupdateListDialog=true
        }else{
           this.$message.error(res.msg)
        }
      })
    },

    

     /* 打开 下载附件弹框 */
    open_fjDownloadDialog(id){
      this.fjDownloadDialog=true
    },
     /* 下载附件弹框 列表数据的获取 */
    getList0(){
      this.dataList0=[]
    },

    /* 关闭 下载附件弹框 */
    close_fjDownloadDialog(){
      this.fjDownloadDialog=false
    },
   
    
  }
};
</script>
<style>
.orderTable th > .cell {
  white-space:nowrap;
}
.isupdateListULCss0 li{
  border-bottom:1px solid#000;
  height:auto;
  line-height:35px;
  list-style:none;
}
.isupdateListULCss0 li.isupdateListLICss0{
 background:#eee;
  border-bottom:none;
}
.el-form-item__label {
padding: 0 0 0 0;
}
.el-input--medium .el-input__inner {
    height: 26px;
    line-height: 26px;
}
.el-input--small .el-input__inner {
    height: 26px;
    line-height: 26px;
}


.xx2 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 14px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.el-table {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    max-width: 100%;
    background-color: #FFFFFF;
    font-size: 10px;
    color: #606266;
}
.el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #dfe4ed;
    color: #606266;
    cursor: not-allowed;
}
.el-table--medium td, .el-table--medium th {
    padding: 0 0;
}
.el-table .el-table__header-wrapper th {
    word-break: break-word;
    background-color: #f8f8f9;
    color: #515a6e;
    height: 25px;
    font-size: 10px;
}
.xx1 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 27px !important;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
</style>

