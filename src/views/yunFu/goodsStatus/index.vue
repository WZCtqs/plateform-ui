<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="100px">
      <el-form-item label="班列日期"
                    prop="classDate">
        <el-date-picker v-model.trim="queryParams.classDate"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        style="width:150px;"
                        placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="班列编号"
                    prop="classNum">
        <el-input v-model.trim="queryParams.classNum"
                  placeholder=""
                  clearable
                  style="width:150px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="舱位号"
                    prop="orderNum">
        <el-input v-model.trim="queryParams.orderNum"
                  placeholder=""
                  clearable
                  style="width:150px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="箱号"
                    prop="boxNum">
        <el-input v-model.trim="queryParams.boxNum"
                  placeholder=""
                  clearable
                  @blur="handleQuery"
                  style="width:150px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="线路"
                    prop="lineTypeId">
        <el-select v-model.trim="queryParams.lineTypeId"
                   clearable
                   size="small"
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
                    prop="eastAndWest">
        <el-select v-model.trim="queryParams.eastAndWest"
                   size="mini"
                   style="width:100px;"
                   clearable
                   placeholder="请选择">
          <el-option label="西向"
                     value="0" />
          <el-option label="东向"
                     value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="整拼箱"
                    prop="isConsolidation">
        <el-select v-model.trim="queryParams.isConsolidation"
                   size="mini"
                   style="width:100px;"
                   clearable
                   placeholder="请选择">
          <el-option label="整柜"
                     value="0" />
          <el-option label="拼箱"
                     value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型"
                    prop="orderType">
        <el-select v-model.trim="queryParams.orderType"
                   size="mini"
                   style="width:100px;"
                   clearable
                   placeholder="请选择">
          <el-option label="国内"
                     value="0" />
          <el-option label="国外"
                     value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="委托ZIH提货"
                    prop="shipOrderBinningway">
        <el-select v-model.trim="queryParams.shipOrderBinningway"
                   size="mini"
                   style="width:140px;"
                   clearable
                   placeholder="请选择">
          <el-option label="是"
                     value="0" />
          <el-option label="否"
                     value="1" />
          <el-option label="铁路到货"
                     value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否由ZIH代理送货"
                    prop="receiveOrderIspart"
                    label-width="140px">
        <el-select v-model.trim="queryParams.receiveOrderIspart"
                   size="mini"
                   style="width:140px;"
                   clearable
                   placeholder="请选择">
          <el-option label="否"
                     value="0" />
          <el-option label="是"
                     value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="货物品名"
                    prop="goodsName">
      <el-input v-model.trim="queryParams.goodsName"
                  placeholder=""
                  clearable
                  style="width:150px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />  
      </el-form-item>
           <el-form-item label="实际班列日期"
                    prop="actualClassDate">
      <el-input v-model.trim="queryParams.actualClassDate"
                  placeholder=""
                  clearable
                  style="width:150px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />  
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   v-hasPermi="['track:goodsStatus:query']"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-download"
                   size="mini"
                   v-hasPermi="['track:goodsStatus:export']"
                   @click="handleExport">导出</el-button>
        <el-button type="primary"
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport"
                   v-hasPermi="['track:goodsStatus:import']">导入</el-button>
        <input type="file"
               @change="getFile($event)"
               style="display:none"
               ref="excelFile" />
        <el-button size="mini"
                   type="danger"
                   icon="el-icon-edit"
                   @click="handleUpdateO"
                   v-hasPermi="['track:goodsStatus:edit']">拼箱修改</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              border
              :data="goodsStatusList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="班列日期"
                       align="center"
                       prop="classDate">
        <template slot-scope="scope">
          <span v-if="scope.row.classDate">{{scope.row.classDate.substring(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="班列编号"
                       align="center"
                       prop="classNum" />
      <el-table-column label="委托书编号"
                       align="center"
                       prop="orderNum">
        <template slot-scope="scope">
          <a @click="handleDetail(scope.row)"
             class="cursorColumn"> {{scope.row.orderNum}} </a>
        </template>
      </el-table-column>
      <el-table-column label="箱号"
                       align="center"
                       prop="boxNum" />
      <el-table-column label="箱型"
                       align="center"
                       prop="boxType" />
      <el-table-column label="推荐人"
                       align="center"
                       prop="referee" />
      <el-table-column label="跟单员"
                       align="center"
                       prop="merchandiser" />
      <el-table-column label="货物品名"
                       align="center"
                       prop="goodsName" />
      <el-table-column label="上货站"
                       align="center"
                       prop="uploadSite" />
      <el-table-column label="下货站"
                       align="center"
                       prop="unloadSite" />
      <el-table-column label="在途信息接收邮箱"
                       align="center"
                       prop="intransitMail" />
      <el-table-column label="实际班列日期"
                       align="center"
                       prop="actualClassDate" />
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['track:goodsStatus:edit']">修改</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 修 改 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="150px">
        <el-form-item label="舱位号"
                      prop="orderNum">
          <el-input v-model.trim="form.orderNum"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="箱号"
                      prop="boxNum">
          <el-input v-model.trim="form.boxNum"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="是否异常箱"
                      prop="isNormal">
          <el-select v-model.trim="form.isNormal"
                     clearable
                     style="width:200px;"
                     size="small"
                     placeholder="请选择">
            <el-option v-for="item in isNormalOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际班列日期"
                      prop="actualClassDate">
          <el-input v-model.trim="form.actualClassDate"
                    style="width:200px;"
                    placeholder="" />
          <!-- <el-date-picker v-model.trim="form.actualClassDate"
                          type="date"
                          style="width:200px;"
                          value-format="yyyy-MM-dd"
                          placeholder="">
          </el-date-picker> -->
          <!-- <el-input v-model.trim="form.actualClassDate"
                    style="width:200px;"
                    placeholder="" /> -->
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 拼箱修改 -->
    <el-dialog :title="titleO"
               :visible.sync="openO"
               width="500px">
      <el-form ref="form"
               :model="formO"
               :rules="rules"
               label-width="150px">
        <el-form-item label="箱号"
                      prop="boxNum">
          <el-input v-model.trim="formO.boxNum"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="是否异常箱"
                      prop="isNormal">
          <el-select v-model.trim="formO.isNormal"
                     clearable
                     style="width:200px;"
                     size="small"
                     placeholder="请选择">
            <el-option v-for="item in isNormalOptionsO"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否已上车"
                      prop="isGetin">
          <el-select v-model.trim="formO.isGetin"
                     clearable
                     style="width:200px;"
                     size="small"
                     placeholder="请选择">
            <el-option v-for="item in isGetinOptionsO"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="实际班列日期"
                      prop="actualClassDate">
          <el-input v-model.trim="formO.actualClassDate"
                    style="width:200px;"
                    placeholder="" />
          <!-- <el-date-picker v-model.trim="formO.actualClassDate"
                          type="date"
                          style="width:200px;"
                          value-format="yyyy-MM-dd"
                          placeholder="">
          </el-date-picker> -->
          <!-- <el-input v-model.trim="formO.actualClassDate"
                    style="width:200px;"
                    placeholder="" /> -->
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFormO">确 定</el-button>
        <el-button @click="cancelO">取 消</el-button>
      </div>
    </el-dialog>
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
                <el-select v-model.trim="form.station" filterable clearable :disbled="true">
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
            <el-col :span="12">
              <el-form-item label="业务编号" prop="clientYwNumber">
                <el-input v-model.trim="form.clientYwNumber" placeholder="请输入业务编号" />
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
                  label="3"
                >自备非铁路箱</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col :span="12">
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
              <el-form-item label="报关地点" prop="clientOrderBindingaddress" v-if="form.classEastandwest === '0' || (form.lineTypeid !== '3' && form.classEastandwest === '1')">  
                <el-radio v-if="form.classEastandwest === '0'" v-model.trim="form.clientOrderBindingaddress" label="郑州">郑州</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '汉堡')" v-model.trim="form.clientOrderBindingaddress" label="汉堡">汉堡</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '慕尼黑')" v-model.trim="form.clientOrderBindingaddress" label="慕尼黑">慕尼黑</el-radio>
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="属地">属地</el-radio>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="业务员编号">
                <el-input v-model.trim="form.ywNumber" placeholder="请输入业务员编号" />
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
              <!-- 1、由ZIH提货：是，提货方式是：整箱到车站 --> <!-- 咨询刘恒，1、情况下不需要显示提箱地 -->
              <!-- 2、箱属：委托zih，由ZIH提货：否，自送货方式是：整箱到车站 -->
             
              <template
                v-if="(form.shipOrderBinningway === '0' && form.shipThTypeId === '0') || (form.shipOrderBinningway === '1' && form.shipZsTypeId === '1' && form.orderAuditBelongto === '0')"
              >
                <template>
                  <el-col :span="16">
                    <el-form-item label="提箱地" >
                    <el-select
                      v-model.trim="form.shipFhSite"
                      filterable
                      clearable
                      v-if="pzqh === '0' || pzqh === '2'"
                    >
                      <!-- 去程提箱地 -->
                      <el-option value>-请选择-</el-option>
                      <el-option
                        v-for="(item,index) in txAddressList"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>

                    <el-select
                      v-model.trim="form.shipHyd"
                      filterable
                      clearable
                      v-if="pzqh === '1' || pzqh === '3'"
                    >
                      <!-- 回程发货提箱地 -->
                      <el-option value>-请选择-</el-option>
                      <el-option
                        v-for="(item,index) in txAddressList"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
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
                <el-input v-model.trim="form.shipThCost" placeholder :disabled="true" >
                  <template slot="append" v-if="form.zxThcostCurrency === '$'">*[美金]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '￥'">*[人民币]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '€'">*[欧元]</template>
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
              <el-form-item label="邮箱" prop="receiveOrderEmail">
                <el-input v-model.trim="form.receiveOrderEmail" placeholder="请输入邮箱" />
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
                <el-radio v-if="pzqh == '1' || pzqh == '3'" v-model.trim="form.qgCostcurrency"  label="人民币">*人民币</el-radio>
                <el-radio v-if="pzqh == '0' || pzqh == '2'" v-model.trim="form.qgCostcurrency"  label="欧元">*欧元</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="由ZIH代理送货" prop="receiveOrderIspart">
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
                <el-radio v-if="pzqh == '1' || pzqh == '3'" v-model.trim="form.shCostcurrency" :disabled="true" label="￥">人民币</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="$">美金</el-radio>
                <el-radio v-if="pzqh == '0' || pzqh == '2'" v-model.trim="form.shCostcurrency" :disabled="true" label="€">欧元</el-radio>
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
             3、整柜-->
          <el-row
            v-if="(pzqh === '2' || pzqh === '3') && (form.orderAuditBelongto === '0') "
          >
             
             <el-col :span="10">
              <el-form-item label="还箱费">
                <el-input v-model.trim="form.returnBoxFee" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="还箱地点" prop="receiveHxAddress">
                <el-select v-model.trim="form.receiveHxAddress" filterable clearable :disabled="true">
                  <!-- 去程提箱地 -->
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in hxAddressList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>

                <el-input
                  v-if="form.receiveHxAddress === ''"
                  v-model.trim="form.receiveHxAddress"
                  placeholder
                  :disabled="true"
                />(选择一项或者自己填写)
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
                <el-input v-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.nameColor === '0'"  v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.nameColor === '1'" class="noteColor1"  v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
                <el-input v-else v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
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
                <el-input v-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '0'" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '1'" class="noteColor1" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '2'" class="noteColor2" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="pzqh === '1' || pzqh === '3'">
              <el-form-item label="国外报关HS" prop="goodsReport">
                <el-input v-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '0'" v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '1'" class="noteColor1" v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '2'" class="noteColor2" v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
                <el-input v-else v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
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
                  <el-option value="Pallet" label="Pallet" v-if="form.yuyan === '1'">Pallet</el-option>
                  <el-option value="Carton" label="Carton" v-if="form.yuyan === '1'">Carton</el-option>
                  <el-option value="Crates" label="Crates" v-if="form.yuyan === '1'" >Crates</el-option>
                  <el-option value="Nude" label="Nude" v-if="form.yuyan === '1'" >Nuded cargo</el-option>
                </el-select>
                <el-input
                  :disabled="!(form.goodsPacking == '' || form.goodsPacking == null)"
                  v-model.trim="goodsPacking1"
                  placeholder="请输入最外层包装形式"
                  style="width:200px !important;"
                />
                <div class="msgSpancss0 redTxt">* 选择一项或者自己填写</div>
                <!-- 包装方式 备注 -->
                <div style="color:#f00;font-size:10px" v-if="form.goodsPacking === '裸装' || form.goodsPacking === 'Nude'">
                    货物裸装，请联系业务部确认是否可以操作;货物超长超重，请联系业务部确认是否可以操作
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="最外层包装数量	" prop="goodsNumber">
                <el-input v-model.trim="form.goodsNumber" placeholder="请输入最外层包装数量	" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总体积(CBM)" >
                {{form.goodsCbm}}
                <!-- <el-input v-model.trim="form.goodsCbm" placeholder="请输入总体积(CBM)" /> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="总毛重(KGS)">
                {{form.goodsKgs}}
                <!-- <el-input v-model.trim="form.goodsKgs" placeholder="请输入总毛重(KGS)" /> -->
              </el-form-item>
            </el-col>
            <template v-if="goodsList.length">
              <el-col :span="24">
                <el-divider content-position="left">货物规格信息</el-divider>
              </el-col>
              <el-col v-for="(goodsItem,index) in goodsList" :key="index" :span="24">
                <el-col :span="4">
                  <!-- 数量 -->
                  <el-form-item class="preLabel" label="数量">
                    <span>{{ goodsItem.goodsAmount }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <!-- 长度 -->
                  <el-form-item class="preLabel" label="长(cm)">
                    <span>{{ goodsItem.goodsLength }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <!-- 宽度 -->
                  <el-form-item class="preLabel" label="宽(cm)">
                    <span>{{ goodsItem.goodsWidth }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <!-- 高度 -->
                  <el-form-item class="preLabel" label="高(cm)">
                    <span>{{ goodsItem.goodsHeight }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- 重量 -->
                  <el-form-item class="preLabel" label="单件重量(kg)">
                    <span>{{ goodsItem.goodsWeight }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-divider />
                </el-col>
              </el-col>
            </template>
            <!-- <el-col :span="12">
              <el-form-item label="规格(CM)">
                 <span v-for="(item,index) in goodsList" :key="index">{{item.goodsName}} : {{item.goodsLength}} * {{item.goodsWidth}} * {{item.goodsHeight}} <br/></span>
                <span class="msgSpancss0 redTxt">* 填写规则:L*W*H</span>
              </el-form-item>
            </el-col> -->
          </el-row>

          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col :span="10">
              <el-form-item label="是否需要装箱方案">
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="10">
              <el-form-item label="是否派监装员">
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col> -->
            <el-col v-if="form.shipOrderIsdispatch === '1'" :span="10">
              <el-form-item label="监装费用" prop="shipJzCost">
                <el-input v-model.trim="form.shipJzCost" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo'">
             <el-col :span="10">
              <el-form-item label="危险品备注" prop="nameRemark" v-if="form.nameRemark!=null">
                <el-input v-model.trim="form.nameRemark" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
             <el-col  :span="20">
              <el-form-item label="特殊单证备注" v-if="!!form.hsbz" prop="noteRemark" >
                <el-input v-model.trim="form.hsbz" placeholder v-if="!!form.hsbz" :disabled="true" type="textarea" :autosize="{ minRows: 2}"  />
              </el-form-item>
               <el-form-item label="品名" v-if="!!form.goodsbz" prop="noteRemark" >
                <el-input v-model.trim="form.goodsbz" placeholder v-if="form.goodsbz!=null" :disabled="true" type="textarea" :autosize="{ minRows: 2}"  />
              </el-form-item>
            </el-col> 
             <!-- <el-col :span="20" v-if="form.noteColor === '1'">
              <el-form-item label="">
                <el-input v-model.trim="form.hsbz" type="textarea" :autosize="{ minRows: 2}" />
              </el-form-item>
            </el-col>  -->
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input v-model.trim="form.remark" type="textarea" :autosize="{ minRows: 2}" />
             
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
  </div>
</template>

<script>
import {
  listGoodsStatus,
  getGoodsStatus,
  delGoodsStatus,
  addGoodsStatus,
  updateGoodsStatus,
  updatePxGoodsStatus,
  exportGoodsStatus,
  importGoodsStatus
} from '@/api/yunFu/goodsStatus';
import {
  fetchList1,
  detailapi,
  getSiteByOrderId,
  orderCheckReplyapi,
  checkEditRecord,
  orderCancelapi,
  stationList,
  goodsInfo,
  addIsRead
} from '@/api/classOrder/orders';
import "@/assets/styles/selfCss0.css";

export default {
  name: 'GoodsStatus',
  data() {
    return {
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
      isNormalOptions: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      isNormalOptionsO: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      isGetinOptionsO: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      // multiple: true,
      // 总条数
      total: 0,
      // 运踪_货物状态--以舱位号为单位，标记是否发车表格数据
      goodsStatusList: [],
      currentFormStatus: '',
      goodsPacking1:null, // 最外层包装形式 输入框值
      sitelistupList:[], //上货站
      sitelistdownList:[],//下货站
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      open1: false,
      //拼箱弹出层标题
      formDisabled: false,
      titleO: '',
      // 拼箱是否显示弹出层
      openO: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        boxNum: undefined,
        lineTypeId: undefined,
        orderNum: undefined,
        eastAndWest: null,
        classNum: undefined,
        classDate: undefined,

        isConsolidation: null,
        orderType: null,
        shipOrderBinningway: null,
        receiveOrderIspart: null,
        goodsName: null
      },
      // 表单参数
      form: {},
       // 托书当前 拼/整箱、去/回程字段
      //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；
      pzqh: '0',
      xlString: 'zy', // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
      myList: [], //贸易方式 列表数据
      goodsList:[],
      // 拼箱表单参数
      formO: {},
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
  watch: {
    // "queryParams.boxNum": function (newval, oldval) {
    //   if (newval) {
    //     console.log(111)
    //     this.multiple = false
    //   } else {
    //     console.log(222)
    //     this.multiple = true
    //   }
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询运踪_货物状态--以舱位号为单位，标记是否发车列表 */
    getList() {
      this.loading = true
      listGoodsStatus(this.queryParams)
        .then(response => {
          this.goodsStatusList = response.rows
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
    // 取消按钮
    cancel1() {
      this.open1 = false;
      this.reset();
    },
    // 拼箱取消按钮
    cancelO() {
      this.openO = false
      this.resetO()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        boxNum: undefined,
        actualClassDate: undefined,
        isNormal: undefined,
        orderNum: undefined
      }
      this.resetForm('form')
    },
    // 拼箱表单重置
    resetO() {
      this.formO = {
        id: undefined,
        isGetin: undefined,
        actualClassDate: undefined,
        isNormal: undefined,
        orderNum: undefined
      }
      this.resetForm('formO')
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
      this.title = '添加运踪_货物状态--以舱位号为单位，标记是否发车'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getGoodsStatus(id).then(response => {
        this.form = response.data
        if (response.data.isNormal == null) {
          this.form.isNormal = ''
        } else {
          this.form.isNormal = this.form.isNormal.toString()
        }
        this.open = true
        this.title = '修改'
      })
    },
    /** 修改按钮操作 */
    handleUpdateO() {
      if (
        this.queryParams.boxNum == undefined ||
        this.queryParams.boxNum == ''
      ) {
        this.$message({
          message: '请输入查询的箱号',
          type: 'warning'
        })
      } else if (this.ids.length == 0) {
        this.$message({
          message: '请至少选择一条要操作的数据',
          type: 'warning'
        })
      } else {
        this.reset()
        const id = this.ids[0]
        getGoodsStatus(id).then(response => {
          this.formO = response.data
          if (this.formO.isNormal == null) {
            this.formO.isNormal = ''
          } else {
            this.formO.isNormal = this.formO.isNormal.toString()
          }
          if (this.formO.isGetin == null) {
            this.formO.isGetin = ''
          } else {
            this.formO.isGetin = this.formO.isGetin.toString()
          }
          this.openO = true
          this.titleO = '拼箱编辑'
        })
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateGoodsStatus(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addGoodsStatus(this.form).then(response => {
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
    /** 拼箱修改提交按钮 */
    submitFormO: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.formO.id != undefined) {
            this.formO.id = null
            this.formO.ids = this.ids.join(",")
            updatePxGoodsStatus(this.formO).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.openO = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addGoodsStatus(this.formO).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.openO = false
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
      const ids = row.id || this.ids
      this.$confirm(
        '是否确认删除运踪_货物状态--以舱位号为单位，标记是否发车编号为"' +
          ids +
          '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delGoodsStatus(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    },
    /* 查看托书 */
    handleDetail(row) {
      this.currentFormStatus = 'detailInfo'
      this.formDisabled = true
      this.reset()
      const orderId = row.orderId || this.ids

      detailapi(orderId).then(res => {
        this.form = res.data

        let inquiryRecordId = res.data.inquiryRecordId
        // 获取货物 规格数据
        goodsInfo(inquiryRecordId).then(res => {
          this.goodsList = res.rows
        })
        //获取场站下拉列表数据
        this.stationListFn()

        // 获取上下货站
        this.getSiteByOrderIdFn('查看')
        // classEastandwest: 0为去程 1为回程
        // isconsolidation: 整拼箱 0整柜 1拼箱
        //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；

        if (
          res.data.classEastandwest === '0' &&
          res.data.isconsolidation === '1'
        ) {
          this.pzqh = '0'
        } else if (
          res.data.classEastandwest === '1' &&
          res.data.isconsolidation === '1'
        ) {
          this.pzqh = '1'
        } else if (
          res.data.classEastandwest === '0' &&
          res.data.isconsolidation === '0'
        ) {
          this.pzqh = '2'
        } else if (
          res.data.classEastandwest === '1' &&
          res.data.isconsolidation === '0'
        ) {
          this.pzqh = '3'
        }
        // 线路类型：0中欧 2中亚 3中越 4中俄
        // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
        if (res.data.lineTypeid === '2') {
          this.xlString = 'zy'
        } else {
          this.xlString = 'fzy'
        }
      })
    },
    // 获取上下货站
    getSiteByOrderIdFn(obj) {
      let params = {
        classId: this.form.classId,
        orderId: this.form.orderId
      }
      getSiteByOrderId(params).then(res => {
        if (res.code === 200) {
          this.open1 = true
          this.title1 = obj

          this.sitelistupList = res.data.sitelistup
          this.sitelistdownList = res.data.sitelistdown
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    stationListFn() {
      let isReportStr = null
      if (this.form.clientOrderBindingway) {
        if (this.form.clientOrderBindingway === '0') {
          isReportStr = '1'
        } else if (this.form.clientOrderBindingway === '1') {
          isReportStr = '0'
        }
      }
      let params = {
        isconsolidation: this.form.isconsolidation,
        isenabled: '0',
        isReport: isReportStr
      }
      stationList(params).then(res => {
        if (res.code === 200) {
          this.changzhanList = res.rows
        } else {
          this.msgError(res.msg)
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const qar = {}
      qar.boxNum = this.queryParams.boxNum
      qar.lineTypeId = this.queryParams.lineTypeId
      qar.orderNum = this.queryParams.orderNum
      qar.classNum = this.queryParams.classNum
      qar.classDate = this.queryParams.classDate
      this.$confirm('是否确认导出?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportGoodsStatus(qar)
        })
        .then(response => {
          this.download(response.msg)
        })
        .catch(function() {})
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.excelFile.value = ''
      this.$refs.excelFile.click()
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0]
      var zipFormData = new FormData()
      zipFormData.append('file', this.upath) //file对应传输的文件
      this.$confirm("是否确认导入?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
       .then(function() {
          return importGoodsStatus(zipFormData);
        })
       .then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '导入成功',
            type: 'success',
            duration: 0
          })
        } else {
          this.$notify({
            title: '提示',
            message: res.msg,
            type: 'warning',
            duration: 10000
          })
        }
      })
    }
  }
}
</script>