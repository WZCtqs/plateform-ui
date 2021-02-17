<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="90px">
      <el-form-item label="委托书编号"
                    prop="orderNumber">
        <el-input v-model.trim="queryParams.orderNumber"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="箱号"
                    prop="boxNum">
        <el-input v-model.trim="queryParams.boxNum"
                  placeholder=""
                  style="width:120px;"
                  size="mini"
                  clearable
                  @blur="handleQuery"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="往返"
                    prop="classEastAndWest">
        <el-select v-model.trim="queryParams.classEastAndWest"
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
      <el-form-item label="线路"
                    prop="lineTypeId ">
        <el-select v-model.trim="queryParams.lineTypeId"
                   clearable
                   size="small"
                   style="width:130px;"
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
      <el-form-item label="新增日期"
                    prop="startTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        :picker-options="startTimePicker"
                        v-model.trim="queryParams.startTime  "
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>到
      </el-form-item>
      <el-form-item label=""
                    prop="endTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        v-model.trim="queryParams.endTime  "
                        type="date"
                        :picker-options="endTimePicker"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新日期"
                    prop="inputTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        v-model.trim="queryParams.inputTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                    v-hasPermi="['yunFu:abnormal:query']"
                   @click="handleQuery">搜索</el-button>
        <el-button size="mini"
                   type="success"
                   @click="handleUpdateO"
                   v-hasPermi="['yunFu:abnormal:list']">拼箱运踪录入</el-button>
        <el-button type="warning"
                   icon="el-icon-document"
                   size="mini"
                    v-hasPermi="['yunFu:abnormalBox:export']"
                   @click="handleExport1">日报</el-button>
        <el-button type="warning"
                   icon="el-icon-document"
                   size="mini"
                    v-hasPermi="['yunFu:abnormalBox:export']"
                   @click="handleExport2">周/月报</el-button>
        <el-button type="warning"
                   icon="el-icon-document"
                   size="mini"
                    v-hasPermi="['yunFu:abnormalBox:export']"
                   @click="handleExport3">年报</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              border
              @row-click="handleRowClick"
              :row-class-name="tableRowClassName"
              :data="classesList"
              @selection-change="handleSelectionChange">
      <template v-if='queryParams.boxNum'>
        <el-table-column type="selection"
                         align="center" />
      </template>
      <el-table-column label="委托书编号"
                       align="center"
                       prop="orderNumber" />
      <el-table-column label="箱号"
                       align="center"
                       prop="boxNum" />
      <el-table-column label="班列日期"
                       align="center"
                       prop="classDate" />
      <el-table-column label="货物品名"
                       align="center"
                       prop="goodsName" />
      <el-table-column label="上货站"
                       align="center"
                       prop="upSite" />
      <el-table-column label="往返"
                       align="center"
                       prop="classEastAndWest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastAndWest==0">西向</span>
          <span v-else>东向</span>
        </template>
      </el-table-column>
      <el-table-column label="装箱"
                       align="center"
                       prop="consolidationType">
        <template slot-scope="scope">
          <span v-if="scope.row.consolidationType==0">整柜</span>
          <span v-else>拼箱</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-data-analysis"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['yunFu:abnormal:list']">跟踪信息</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     @click="handleUpdateD(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改班列对话框 -->

    <el-dialog :title="title"
               :visible.sync="open"
               v-dialogDrag
               :close-on-click-modal="false"
               class="abow_dialog"
               width="1000px">
      <el-row :gutter="10"
              class="mb8">
        <el-col :span="1.5"
                :offset="22">
          <el-button type="primary"
                     icon="el-icon-plus"
                     size="mini"
                     @click="handleAdd"
                     v-hasPermi="['yunFu:abnormal:add']">新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading"
                border
                :data="trainList">
        <el-table-column label="箱号"
                         align="center"
                         prop="boxNum" />
        <el-table-column label="下货原因"
                         width="280"
                         align="center"
                         prop="unloadReason" />
        <el-table-column label="是否脱离主班列"
                         align="center"
                         prop="isSeparate">
          <template slot-scope="scope">
            <span v-if="scope.row.isSeparate==0">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="是否已到站"
                         align="center"
                         prop="isArrive">
          <template slot-scope="scope">
            <span v-if="scope.row.isArrive==0">已到站</span>
            <span v-else>未到站</span>
          </template>
        </el-table-column>
        <el-table-column label="异常类型"
                         align="center"
                         prop="abnormalType" />
        <el-table-column label="下货地点"
                         align="center"
                         prop="unloadSite" />
        <el-table-column label="异常箱跟踪日期"
                         align="center"
                         prop="inputTime" />
        <el-table-column label="异常箱跟踪信息"
                         align="center"
                         prop="abnormalInformation" />
        <el-table-column label="操作"
                         align="center"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="handleUpdat(scope.row)"
                       v-hasPermi="['yunFu:abnormal:edit']">修改</el-button>
            <el-button size="mini"
                       type="text"
                       icon="el-icon-delete"
                       @click="handleDelet(scope.row)"
                       v-hasPermi="['yunFu:abnormal:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="tota>0"
                  :total="tota"
                  :page.sync="derailParm.pageNum"
                  :limit.sync="derailParm.pageSize"
                  @pagination="getListO" />
      <!-- 添加或修改运踪_班列站到站对话框 -->
    </el-dialog>
    <el-dialog :title="titl"
               :visible.sync="ope"
               v-dialogDrag
               class="abow_dialog"
               :close-on-click-modal="false"
               width="1000px">
      <el-form ref="fo"
               :model="fo"
               :rules="rules"
               :inline="true"
               label-width="150px">
        <el-form-item label="集装箱号"
                      prop="boxNum">
          <el-input v-model.trim="fo.boxNum"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="下货原因"
                      prop="unloadReason">
          <el-input v-model="fo.unloadReason"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="下货日期"
                      prop="unloadTime">
          <el-date-picker v-model.trim="fo.unloadTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          style="width:200px;"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="解决日期"
                      prop="solveTime">
          <el-date-picker v-model.trim="fo.solveTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          style="width:200px;"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="加挂班列号"
                      prop="classNum">
          <el-input v-model.trim="fo.classNum"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="是否脱离主班列"
                      prop="isSeparate">
          <el-radio-group v-model.trim="fo.isSeparate"
                          style="width:200px;">
            <el-radio v-for="dict in ltRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否已到站"
                      prop="isArrive">
          <el-radio-group v-model.trim="fo.isArrive"
                          style="width:200px;">
            <el-radio v-for="dict in dtRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="异常类型"
                      prop="abnormalType">
          <el-input v-model.trim="fo.abnormalType"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="下货地点"
                      prop="unloadSite">
          <el-input v-model.trim="fo.unloadSite"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="跟踪日期"
                      prop="inputTime">
          <el-date-picker v-model.trim="fo.inputTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          style="width:200px;"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="对接负责人"
                      prop="chargePerson ">
          <el-input v-model.trim="fo.chargePerson "
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="真实原因"
                      prop="realReason ">
          <el-input v-model.trim="fo.realReason "
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="到站时间"
                      prop="arriveTime">
          <el-date-picker v-model.trim="fo.arriveTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          style="width:200px;"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="查验"
                      prop="inspectionType">
          <el-radio-group v-model.trim="fo.inspectionType"
                          style="width:200px;">
            <el-radio v-for="dict in itRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跟踪内容"
                      prop="abnormalInformation">
          <el-input v-model="fo.abnormalInformation"
                    type="textarea"
                    autosize
                    style="width:700px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="收件邮箱"
                      prop="receiveEmails">
          <el-input v-model.trim="fo.receiveEmails"
                    type="textarea"
                    autosize
                    style="width:700px;"
                    placeholder="" />
        </el-form-item>
        <template v-if="titl == '异常箱邮件发送'">
          <el-form-item label="密送邮箱"
                        prop="secretEmails">
            <el-input v-model.trim="fo.secretEmails"
                      type="textarea"
                      autosize
                      style="width:700px;"
                      placeholder="" />
          </el-form-item>
        </template>
        <el-form-item label="上传附件"
                      prop="filePath">
          <el-upload class="upload-demo"
                     ref="upload"
                     :action="uploadImgUrl"
                     :headers="headers"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :on-success="handleSuccess"
                     :file-list="fileList">
            <el-button slot="trigger"
                       size="small"
                       type="primary">选取文件</el-button>
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="success"
                   icon="el-icon-s-platform"
                   v-if="!!this.copylist"
                   @click="autoPaste">一键粘贴</el-button>
        <el-button type="primary"
                   icon="el-icon-s-platform"
                   @click="autoCopy">一键复制</el-button>
        <el-button type="success"
                   icon="el-icon-s-platform"
                   @click="genzong">智能运踪</el-button>
        <el-button type="primary"
                   @click="submitForm">保 存</el-button>
        <el-button type="warning"
                    v-hasPermi="['yunFu:abnormalBox:query']"
                   @click="submitUpload">保存发送</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <!-- <el-dialog :title="titleD"
               :visible.sync="openD"
               width="1000px">
      <el-form ref="fo"
               :model="foD"
               :rules="rules"
               :inline="true"
               label-width="130px">
        <div style="padding:10px 0;margin-left:50px;border-top:1px solid red;border-bottom:1px solid red;">班列信息</div>
        <div style="height:10px;"></div>
        <el-form-item label="委托书编号"
                      prop="orderNumber">
          <el-input v-model.trim="foD.orderNumber"
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="跟单员"
                      prop="orderMerchandiser">
          <el-input v-model.trim="foD.orderMerchandiser"
                    placeholder=""
                    disabled
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="贸易方式"
                      prop="dictId">
          <el-select v-model.trim="foD.dictId"
                     clearable
                     style="width:200px;"
                     size="mini"
                     placeholder="请选择">
            <el-option v-for="item in dictOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ZIH推荐人"
                      prop="clientTjr">
          <el-input v-model.trim="foD.clientTjr"
                    placeholder=""
                    disabled=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="班列号"
                      prop="classNumber">
          <el-input v-model.trim="foD.classNumber"
                    placeholder=""
                    disabled
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="往返"
                      prop="classEastandwest">
          <el-select v-model.trim="foD.classEastandwest"
                     clearable
                     disabled
                     style="width:200px;"
                     size="mini"
                     placeholder="请选择">
            <el-option v-for="item in classEastandwestOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班列日期"
                      prop="classDate">
          <el-date-picker v-model.trim="foD.classDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          disabled
                          placeholder=""
                          style="width:200px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上货站"
                      prop="orderUploadsite">
          <el-input v-model.trim="foD.orderUploadsite"
                    placeholder=""
                    disabled
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="下货站"
                      prop="orderUnloadsite">
          <el-input v-model.trim="foD.orderUnloadsite"
                    placeholder=""
                    disabled
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="堆场地址"
                      prop="station">
          <el-select v-model.trim="foD.station"
                     clearable
                     style="width:700px;"
                     size="mini"
                     placeholder="请选择">
            <el-option v-for="item in stationOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要发票"
                      prop="orderIsticket">
          <el-radio-group v-model.trim="foD.orderIsticket"
                          style="width:200px;">
            <el-radio v-for="dict in orderIsticketRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="站到站运费"
                      prop="sitecost">
          <el-input v-model.trim="foD.sitecost"
                    placeholder=""
                    style="width:100px;" />
          <el-radio-group v-model.trim="foD.sitecostCurrency">
            <el-radio v-for="dict in sitecostCurrencyRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可提前班列"
                      prop="putoffClass">
          <el-radio-group v-model.trim="foD.putoffClass"
                          style="width:200px;">
            <el-radio v-for="dict in putoffClassRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有改单费"
                      prop="dcGaidanState">
          <el-radio-group v-model.trim="foD.dcGaidanState"
                          style="width:200px;">
            <el-radio v-for="dict in dcGaidanStateRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="padding:10px 0;margin-left:50px;border-top:1px solid red;border-bottom:1px solid red;">订舱方</div>
        <div style="height:10px;"></div>
        <el-form-item label="订舱方"
                      prop="clientUnit">
          <el-input v-model.trim="foD.clientUnit"
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="订舱方地址"
                      prop="clientAddress ">
          <el-input v-model.trim="foD.clientAddress "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="联系人"
                      prop="clientContacts ">
          <el-input v-model.trim="foD.clientContacts "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="联系方式"
                      prop="clientTel ">
          <el-input v-model.trim="foD.clientTel "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="可堆叠(货物属性)"
                      prop="goodsCannotpileup">
          <el-radio-group v-model.trim="foD.goodsCannotpileup"
                          style="width:200px;">
            <el-radio v-for="dict in goodsCannotpileupRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="易碎品(货物属性)"
                      prop="goodsFragile">
          <el-radio-group v-model.trim="foD.goodsFragile"
                          style="width:200px;">
            <el-radio v-for="dict in goodsFragileRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单件超长超重"
                      prop="goodsGeneral">
          <el-radio-group v-model.trim="foD.goodsGeneral"
                          style="width:200px;">
            <el-radio v-for="dict in goodsGeneralRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报关地点"
                      prop="clientOrderBindingaddress">
          <el-radio-group v-model.trim="foD.clientOrderBindingaddress">
            <el-radio v-for="dict in clientOrderBindingaddressRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="委托ZIH报关"
                      prop="clientOrderBindingway">
          <el-radio-group v-model.trim="foD.clientOrderBindingwayRadio"
                          style="width:200px;">
            <el-radio v-for="dict in clientOrderBindingwayRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="this.foD.clientOrderBindingwayRadio=='0'">
          <el-form-item label="报关费用"
                        prop="clientBgCost ">
            <el-input v-model.trim="foD.clientBgCost "
                      placeholder=""
                      style="width:200px;" />
            欧元
          </el-form-item>
        </template>
        <el-form-item label="业务编号"
                      prop="ywNumber ">
          <el-input v-model.trim="foD.ywNumber "
                    placeholder=""
                    style="width:200px;" />
          (提示:如有需要,可再次填写业务编号)
        </el-form-item>
        <div style="padding:10px 0;margin-left:50px;border-top:1px solid red;border-bottom:1px solid red;">发货方</div>
        <div style="height:10px;"></div>
        <el-form-item label="发货方"
                      prop="shipOrederName">
          <el-input v-model.trim="foD.shipOrederName"
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="联系人"
                      prop="shipOrederContacts ">
          <el-input v-model.trim="foD.shipOrederContacts "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="shipOrederEmail ">
          <el-input v-model.trim="foD.shipOrederEmail "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="联系电话"
                      prop="shipOrederPhone ">
          <el-input v-model.trim="foD.shipOrederPhone "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="通讯地址"
                      prop="shipOrederAddress ">
          <el-input v-model.trim="foD.shipOrederAddress "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="装箱方式"
                      prop="shipOrderBinningway">
          <el-radio-group v-model.trim="foD.shipOrderBinningway"
                          style="width:400px;">
            <el-radio v-for="dict in shipOrderBinningwayRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="foD.shipOrderBinningway=='0'">
          <el-form-item label="提货时间"
                        prop="shipOrderUnloadtime">
            <el-date-picker v-model.trim="foD.shipOrderUnloadtime"
                            type="datetime  "
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder=""
                            style="width:200px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系人"
                        prop="shipOrderUnloadcontacts ">
            <el-input v-model.trim="foD.shipOrderUnloadcontacts "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="联系电话"
                        prop="shipOrderUnloadway ">
            <el-input v-model.trim="foD.shipOrderUnloadway "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="shipOrderUnloadwayEmail ">
            <el-input v-model.trim="foD.shipOrderUnloadwayEmail "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="提货费用"
                        prop="shipThCost ">
            <el-input v-model.trim="foD.shipThCost "
                      placeholder=""
                      style="width:100px;" />
            <el-radio-group v-model.trim="foD.zxThcostCurrency">
              <el-radio v-for="dict in zxThcostCurrencyRadio"
                        :key="dict.value"
                        :label="dict.value">{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="提货地址"
                        prop="shipOrderUnloadaddress ">
            <el-input v-model.trim="foD.shipOrderUnloadaddress "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="提货费报价编号"
                        prop="shipThCostNo ">
            <el-input v-model.trim="foD.shipThCostNo "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="foD.shipOrderBinningway=='1'">
          <el-form-item label="自送货时间"
                        prop="shipOrderSendtime ">
            <el-date-picker v-model.trim="foD.shipOrderSendtime"
                            type="datetime  "
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder=""
                            style="width:200px;">
            </el-date-picker>
          </el-form-item>
        </template>
        <div style="padding:10px 0;margin-left:50px;border-top:1px solid red;border-bottom:1px solid red;">收货方</div>
        <div style="height:10px;"></div>
        <el-form-item label="收货方"
                      prop="receiveOrderName">
          <el-input v-model.trim="foD.receiveOrderName"
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="通讯地址"
                      prop="receiveOrderAddress ">
          <el-input v-model.trim="foD.receiveOrderAddress "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="联系人"
                      prop="receiveOrderContacts ">
          <el-input v-model.trim="foD.receiveOrderContacts "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="receiveOrderMail ">
          <el-input v-model.trim="foD.receiveOrderMail "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="联系电话"
                      prop="receiveOrderPhone ">
          <el-input v-model.trim="foD.receiveOrderPhone "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="由ZIH代理清关"
                      prop="receiveOrderIsclearance">
          <el-radio-group v-model.trim="foD.receiveOrderIsclearance"
                          style="width:200px;">
            <el-radio v-for="dict in receiveOrderIsclearanceRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="this.foD.receiveOrderIsclearance=='1'">
          <el-form-item label="清关费用"
                        prop="remark ">
            <el-input v-model.trim="foD.receiveQgCost "
                      placeholder=""
                      style="width:100px;" />
            <el-radio-group v-model.trim="foD.qgCostcurrency">
              <el-radio v-for="dict in qgCostcurrencyRadio"
                        :key="dict.value"
                        :label="dict.value">{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item label="由ZIH代理送货"
                      prop="receiveOrderIspart">
          <el-radio-group v-model.trim="foD.receiveOrderIspart"
                          style="width:200px;">
            <el-radio v-for="dict in receiveOrderIspartRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="this.foD.receiveOrderIspart=='1'">
          <el-form-item label="联系人"
                        prop="receiveOrderZihcontacts ">
            <el-input v-model.trim="foD.receiveOrderZihcontacts "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="联系电话"
                        prop="receiveOrderZihtel ">
            <el-input v-model.trim="foD.receiveOrderZihtel "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="送货地址"
                        prop="receiveOrderPartaddress ">
            <el-input v-model.trim="foD.receiveOrderPartaddress "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="详细地址(中英文)"
                        prop="detailedAddress ">
            <el-input v-model.trim="foD.detailedAddress "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="送货费用"
                        prop="receiveShCost ">
            <el-input v-model.trim="foD.receiveShCost "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item label="送货费报价编号"
                        prop="receiveShCostId ">
            <el-input v-model.trim="foD.receiveShCostId "
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <el-form-item label="在途信息接收邮箱"
                      prop="receiveOrderReceiveemail ">
          <el-input v-model.trim="foD.remreceiveOrderReceiveemailark "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="到站通知提货邮箱"
                      prop="receiveOrderMail ">
          <el-input v-model.trim="foD.receiveOrderMail "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <div style="padding:10px 0;margin-left:50px;border-top:1px solid red;border-bottom:1px solid red;">货物</div>
        <div style="height:10px;"></div>
        <el-form-item label="唛头"
                      prop="goodsMark ">
          <el-input v-model.trim="foD.goodsMark "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="货物品名"
                      prop="goodsName ">
          <el-input v-model.trim="foD.goodsName "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="货品英文名称"
                      prop="goodsEnName ">
          <el-input v-model.trim="foD.goodsEnName "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="国外报关HS"
                      prop="goodsReport ">
          <el-input v-model.trim="foD.goodsReport "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="国内清关HS"
                      prop="goodsClearance ">
          <el-input v-model.trim="foD.goodsClearance "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="最外层包装形式"
                      prop="goodsPacking ">
          <el-select v-model.trim="foD.goodsPacking"
                     clearable
                     style="width:100px;"
                     placeholder="请选择">
            <el-option v-for="item in goodsPackingOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model.trim="foD.goodsPacking "
                    placeholder=""
                    style="width:100px;" />
          (选一项或者自己填写)
        </el-form-item>
        <el-form-item label="最外层包装数量"
                      prop="goodsNumber ">
          <el-input v-model.trim="foD.goodsNumber "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="总体积(CBM)"
                      prop="goodsCbm ">
          <el-input v-model.trim="foD.goodsCbm "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="总毛重(KGS)"
                      prop="goodsKgs ">
          <el-input v-model.trim="foD.goodsKgs "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
        <el-form-item label="规格(CM)"
                      prop="goodsStandard ">
          <el-input v-model.trim="foD.goodsStandard "
                    placeholder=""
                    style="width:200px;" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFormD">导 出</el-button>
        <el-button @click="cancelD">取 消</el-button>
      </div>
    </el-dialog> -->

    <!-- 查看托书对话框 -->
    <el-dialog :title="titleD"
    :visible.sync="openD" width="90%">
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
                    v-for="item in sitelistupList"
                    :key="item.code"
                    :label="item.nameCn"
                    :value="item.code"
                  ></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option
                    v-for="item in sitelistupList"
                    :key="item.code"
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
                    v-for="item in sitelistdownList"
                    :key="item.code"
                    :label="item.nameCn"
                    :value="item.code"
                    v-if="form.yuyan === '0'"
                  ></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option
                    v-for="item in sitelistdownList"
                    :key="item.code"
                    :label="item.nameEn"
                    :value="item.code"
                    v-if="form.yuyan === '1'"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="12" v-if="(pzqh === '2') || (pzqh === '3') && (currentFormStatus === 'shenhe')">
              <el-form-item label="堆场地址">
                <el-select v-model.trim="form.stationid" filterable clearable>
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in changzhanList"
                    :key="index"
                    :label="item.station"
                    :value="item.stationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            

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
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="0">郑州</el-radio>
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="1">属地</el-radio>
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
                  <el-form-item label="提箱地" prop="shipHyd">
                    <el-select
                      v-model.trim="form.shipHyd"
                      filterable
                      clearable
                      v-if="pzqh === '0' || pzqh === '2'"
                    >
                      <!-- 去程提箱地 -->
                      <el-option value>-请选择-</el-option>
                      <el-option
                        v-for="item in txAddressList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>

                    <el-select
                      v-model.trim="form.shipFhSite"
                      filterable
                      clearable
                      v-if="pzqh === '1' || pzqh === '3'"
                    >
                      <!-- 回程发货提箱地 -->
                      <el-option value>-请选择-</el-option>
                      <el-option
                        v-for="item in txAddressList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </template>
            </el-col>
          </el-row>
          <el-row v-if="form.shipOrderBinningway === '0'">
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="10">
              <el-form-item label="联系人(中英文)" prop="shipOrederContacts">
                <el-input v-model.trim="form.shipOrederContacts" placeholder="请输入联系人(中英文)" />
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
            <el-col :span="10">
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
            <el-col :span="10">
              <el-form-item label="电话" prop="receiveOrderZihtel">
                <el-input v-model.trim="form.receiveOrderZihtel" placeholder />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="送货费用">
                <el-input v-model.trim="form.receiveShCost" placeholder :disabled="true" />
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="美金">美金</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="欧元">欧元</el-radio>
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
              <el-form-item label="箱管费">
                <el-input v-model.trim="form.receiveXgCost" placeholder :disabled="true" />
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="美金">美金</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="欧元">欧元</el-radio>提示：（包含还箱平衡费用、重货箱损押金）
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="还箱地点" prop="receiveHxAddress">
                <el-select v-model.trim="form.receiveHxAddress" filterable clearable :disabled="true">
                  <!-- 去程提箱地 -->
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="item in hxAddressList"
                    :key="item.id"
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
                <el-input
                  v-model.trim="form.goodsStandard"
                  placeholder="请输入规格(CM)"
                  :disabled="true"
                  style="width:200px !important;"
                />
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
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input v-model.trim="form.goodsbz" type="textarea" :autosize="{ minRows: 2}" />
                <!-- <el-button @click="open_fjDownloadDialog(form.id)">附件</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row v-if="currentFormStatus === 'zhuandai'">
          <el-col :span="20">
            <el-form-item label="转待原因" prop="examInfo">
              <el-input v-model.trim="form.examInfo" type="textarea" :autosize="{ minRows: 2}" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 委托书 关闭 弹框中的操作按钮 -->
      <div  slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-hasPermi="['order:shippingorder:export']"
          @click="handleExport"
        >导出</el-button>
        <el-button @click="cancelD">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { editAndSend, addAndSend, orderList, abnormalBox, abnormalB, listAbroad, updateAbroad, delAbroad, abd , order, orderExport, exportYear, exportMonth, exportDay, intellectTracking, getEmails, getEmails1 } from "@/api/yunFu/abnormal";
import { getToken } from '@/utils/auth'
import {downLoadExcel,detailapi,getSiteByOrderId } from "@/api/classOrder/orders";
//import "@/assets/styles/xinyiCss0.css";
export default {
  name: 'Abnormal',
  data () {
    return {
      txAddressList:[],
      goodsPacking1:null,
      pzqh: '0',
      selectID: [],
      sitelistdownList:[],//下货站
      sitelistupList:[], //上货站
      myList:[], //贸易方式 列表数据
      formDisabled: false,
      currentFormStatus: '',

      orderId: '',
      goCome: '',
      classDate: '',
      fileList: [],
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/track/abnormalBox/upload",
      chushi: '',
      ord: '',
      // 贸易方式下拉框
      dictOptions: [
        {
          value: '0',
          label: '郑欧班列'
        },
        {
          value: '2',
          label: '郑中亚班列'
        }
      ],
      // 往返
      classEastandwestOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      // 堆场地址
      stationOptions: [],
      // 是否需要发票
      orderIsticketRadio: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      // 货币种类
      zxThcostCurrencyRadio: [
        {
          value: '0',
          label: '美金'
        },
        {
          value: '1',
          label: '人民币'
        }
      ],
      // 是否可提前班列
      putoffClassRadio: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      // 是否有改单费
      dcGaidanStateRadio: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      // 可堆 叠
      goodsCannotpileupRadio: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      // 易碎品
      goodsFragileRadio: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      // 单件是否超长超重
      goodsGeneralRadio: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      // 报关地点
      clientOrderBindingaddressRadio: [
        {
          value: '汉堡',
          label: '汉堡'
        },
        {
          value: '属地',
          label: '属地'
        }
      ],
      // 委托ZIH报关
      clientOrderBindingwayRadio: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      // 由ZIH代理清关
      receiveOrderIsclearanceRadio: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      // 由ZIH代理送货
      receiveOrderIspartRadio: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      // 站到站运费的币种
      sitecostCurrencyRadio: [
        {
          value: '美金',
          label: '美金'
        },
        {
          value: '人民币',
          label: '人民币'
        }
      ],
      // 提货费用币种
      zxThcostCurrencyRadio: [
        {
          value: '欧元',
          label: '欧元'
        },
        {
          value: '美元',
          label: '美元'
        }
      ],
      // 清关费用币种
      qgCostcurrencyRadio: [
        {
          value: '美金',
          label: '美金'
        },
        {
          value: '人民币',
          label: '人民币'
        }
      ],
      // 最外层包装形式
      goodsPackingOptions: [
        {
          value: '托盘',
          label: '托盘'
        },
        {
          value: '纸箱',
          label: '纸箱'
        },
        {
          value: '木箱',
          label: '木箱'
        },
        {
          value: '裸装',
          label: '裸装'
        }
      ],
      // 装箱方式
      shipOrderBinningwayRadio: [
        {
          value: '0',
          label: '委托ZIH提货'
        },
        {
          value: '1',
          label: '自送货送货时间'
        }
      ],
      orderIds: [],
      derailParm: {
        orderId: '',
        boxNum: '',
        pageNum: 1,
        pageSize: 10
      },
      copylist: {
        boxNum: '',
        unloadReason: '',
        unloadTime: '',
        solveTime: '',
        isSeparate: '',
        isArrive: '',
        abnormalType: '',
        unloadSite: '',
        chargePerson: '',
        realReason: '',
        arriveTime: '',
        inspectionType: '',
        abnormalInformation: ''
      },
      lineOptions: [
        {
          value: '0',
          label: '郑欧班列'
        },
        {
          value: '2',
          label: '郑中亚班列'
        }, {
          value: '3',
          label: '郑中越班列'
        }, {
          value: '4',
          label: '郑俄班列'
        }
      ],
      ltRadio: [
        {
          value: 0,
          label: '是'
        },
        {
          value: 1,
          label: '否'
        }
      ],
      dtRadio: [
        {
          value: 0,
          label: '到站'
        },
        {
          value: 1,
          label: '未到站'
        }
      ],
      itRadio: [
        {
          value: 0,
          label: '正常查验'
        },
        {
          value: 1,
          label: '异常查验'
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
      //弹窗的列表数据
      trainList: [],
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
      // 弹窗列表总条数
      tota: 0,
      // 班列表格数据
      classesList: [],
      // 弹出层标题
      title: "",
      // 详情
      titleD: "",
      // 二层弹出层标题
      titl: "",
      // 是否显示弹出层
      open: false,
      // 详情
      openD: false,
      // 是否显示二层弹出层
      ope: false,
      // 是否显示中亚境外弹出层
      openO: false,
      // 中亚境外弹出层标题
      titleO: "",
      // 中亚境外修改弹出层
      openO1: false,
      // 中亚境外修改弹出层标题
      titleO1: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        orderNumber: undefined,
        boxNum: undefined,
        classEastAndWest: undefined,
        lineTypeId: undefined,
        classDate: undefined,
        startTime: undefined,
        endTime: undefined,
        inputTime: undefined
      },
      // 跟踪信息查询参数
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      // 中亚境外查询参数
      queryParamsO: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        boxNum: undefined,
      },
      // 表单参数
      form: {},
      // 弹窗表单参数
      fo: {},
      // 中亚境外弹窗表单参数
      formO: {},
      foD: {},
      // 表单校验
      rules: {
        receiveEmails: [{
          required: true,
          message: "请输邮箱",
          trigger: 'blur',
        }, {
          pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
          message: '请输入正确的邮箱'
        }
        ],
        secretEmails: [{
          required: true,
          message: "请输密送邮箱",
          trigger: 'blur',
        }, {
          pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
          message: '请输入正确的邮箱'
        }
        ]
      }
    };
  },
  computed: {
    startTimePicker () {
      return {
        disabledDate: time => (this.queryParams.endTime ? time.getTime() > new Date(this.queryParams.endTime).getTime() : false),
      };
    },
    endTimePicker () {
      return {
        disabledDate: time => (this.queryParams.startTime ? time.getTime() < new Date(this.queryParams.startTime).getTime() : false),
      };
    },
  },
  created () {
    this.getList();
    this.headers = { 'Authorization': 'Bearer ' + getToken() }
  },
  methods: {
    // 粘过来 详情开始
    dictIdNameFn(){
     this.myList.filter(item=>{
       if(item.id === this.form.dictId){
         this.form.dictName=item.mcheng
       }
     })
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
    /* 审核弹框中 “导出” 操作 */
    handleExport() {
      let obj = this.form.orderId;
      let orderNum = this.form.orderNumber ? this.form.orderNumber : '暂无托书编号';
      let classEastandwest = this.form.classEastandwest === "0" ? "西向" : "东向";
      let isconsolidation = this.form.isconsolidation === "0" ? "整箱" : "拼箱";
 
      downLoadExcel(obj).then(response => {
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download =
          orderNum +
          "-" +
          classEastandwest +
          "-" +
          isconsolidation +
          "-" +
          "-托书.docx"; // xxx.xls/xxx.xlsx
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        this.$notify({
          title: "成功",
          message: "导出成功",
          type: "success",
          duration: 2000
        });
      });
    },
    // 粘过来详情结束
    // 多选框选 中数据
    handleSelectionChange (selection) {
      this.orderIds = selection.map(item => item.orderId)
    },
    handleQueryO () {

    },
    /** 查询班列列表 */
    getList () {
      this.loading = true;
      orderList(this.queryParams).then(response => {
        this.classesList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },
    //点击行触发、选中或不选中复选框
    handleRowClick(row, column, event) {
      if (this.selectID.indexOf(row.id) == -1) {
        this.selectID.push(row.id)
      } else{
        this.selectID.splice(this.selectID.findIndex(item => item == row.id), 1);
      }
      
    },
    // 选中背景色
    tableRowClassName({ row, rowIndex }) {
      let color = "";
      for (let item of this.selectID.values()) {
        if (item === row.id) color = "table-SelectedRow-bgcolor";
      }
      
      return color;
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 跟踪信息 */
    handleUpdate (row) {
      this.derailParm.boxNum = row.boxNum;
      this.derailParm.orderId = row.orderId;
      this.classDate = row.classDate;
      this.orderId = row.orderId;
      this.goCome = row.classEastAndWest;
      this.getListO();
    },

    /** 跟踪信息列表 */
    getListO () {
      this.loading = true;
      this.open = true;
      this.title = "跟踪信息列表";
      abnormalBox(this.derailParm).then(response => {
        this.trainList = response.rows;
        this.tota = response.total;
        this.loading = false;
      });
    },

    /** 拼箱运踪录入 */
    handleUpdateO () {
      this.fileList= []
      if (this.queryParams.boxNum == undefined || this.queryParams.boxNum == "") {
        this.$message({
          message: '请输入查询的箱号',
          type: 'warning'
        });
      } else if (this.orderIds.length == 0) {
        this.$message({
          message: '请选择要编辑的数据',
          type: 'warning'
        });
      } else {
        this.ope = true;
        this.titl = "异常箱邮件发送";
        abd(this.queryParams).then(response => {
          if (response.data) {
            this.chushi = '0'
            this.fo = response.data;
            this.fo.solveTime = '';
            this.fo.classNum = '';
            this.fo.arriveTime = '';
            this.fo.receiveEmails = '';
            this.fo.secretEmails = '';
            if(!this.fo.inputTime){
              var date = new Date();
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDate();
              var hour = date.getHours();
              var minute = date.getMinutes();
              var second = date.getSeconds();
               if (month < 10) {
              month = "0" + month;
              }
              if (day < 10) {
              day = "0" + day;
              }
              if (hour < 10) {
              hour = "0" + hour;
              }
                  if (minute < 10) {
              minute = "0" + minute;
              }
              if (second < 10) {
              second = "0" + second;
              }
              var newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
              this.fo.inputTime =  newDate;
            }
            this.fo.isSeparate = this.fo.isSeparate;
            this.fo.isArrive = this.fo.isArrive;
            this.fo.inspectionType = this.fo.inspectionType;
          } else {
            this.reset()
            this.chushi = '0';
              var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
         if (month < 10) {
        month = "0" + month;
        }
        if (day < 10) {
        day = "0" + day;
        }
        if (hour < 10) {
        hour = "0" + hour;
        }
            if (minute < 10) {
        minute = "0" + minute;
        }
        if (second < 10) {
        second = "0" + second;
        }
        var newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
             this.fo.inputTime =  newDate;
            this.fo.boxNum = this.queryParams.boxNum;
          }
        var orida = ''
        if (this.orderIds.length == 1) {
          orida = this.orderIds[0];
        } else {
          orida = this.orderIds.join(',');
        }
        getEmails1(orida).then(res => {
          this.fo.receiveEmails = res.data.sendMails;
          this.fo.secretEmails = res.data.bccMails;
        });
        });
      }
    },
    //详情
    handleUpdateD (row) {
      this.ord = row.orderId;
      this.openD = true;
      this.titleD = "";

      //粘过来的
      this.currentFormStatus = "detailInfo";
      this.formDisabled = true;
      this.reset();
      const orderId = row.orderId || this.ids;
      
       detailapi(orderId).then(res => {
        this.form = res.data
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

      // order(this.ord).then(response => {
      //   this.foD = response.data;
      //   this.foD.dictId = this.foD.dictId.toString();
      // });
    },

    // 表单重置
    reset () {
      this.fo = {
        // 订单
        id: '',
        /** 箱号 */
        boxNum: '',

        /** 下货原因 */
        unloadReason: '',

        /** 下货时间 */
        unloadTime: '',

        /** 解决时间 */
        solveTime: '',

        /** 加挂班列编号 */
        classNum: '',

        /** 是否脱离主班列0是1否 */
        isSeparate:0,

        /** 是否到站0到站1未到站 */
        isArrive: 1,

        /** 异常类型 */
        abnormalType: '',

        /** 下货地点 */
        unloadSite: '',

        /** 跟踪时间 */
        inputTime: '',

        /** 对接负责人 */
        chargePerson: '',

        /** 真实原因 */
        realReason: '',

        /** 到站时间 */
        arriveTime: '',

        /** 查验类型0正常查验1异常查验 */
        inspectionType: 0,
        /** 跟踪内容 */
        abnormalInformation: '',

        /** 收件邮箱 */
        receiveEmails: '',

        /** 密送邮箱 */
        secretEmails: '',

        // 文件
        // annex: ''

      };
      this.resetForm("fo");
    },

    /** 新增按钮操作 */
    handleAdd () {
      this.fileList= []
      this.reset();
      const len = this.trainList.length;
      this.fo.classDate = this.classDate;
      if (len == 0) {
        this.fo.orderId = this.orderId;
        this.fo.boxNum = this.derailParm.boxNum;
        var orid = this.derailParm.orderId;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
         if (month < 10) {
        month = "0" + month;
        }
        if (day < 10) {
        day = "0" + day;
        }
        if (hour < 10) {
        hour = "0" + hour;
        }
            if (minute < 10) {
        minute = "0" + minute;
        }
        if (second < 10) {
        second = "0" + second;
        }
        var newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        this.fo.inputTime = newDate;
        this.ope = true;
        this.titl = "跟踪信息-添加";
        getEmails(orid).then(response => {
          this.fo.receiveEmails = response.data.sendMails;
        });
      } else {
        this.fo = this.trainList[0];
        this.fo.orderId = this.orderId;
        this.fo.boxNum = this.derailParm.boxNum;
        //this.fo.solveTime = '';
        this.fo.classNum = '';
        this.fo.arriveTime = '';
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
         if (month < 10) {
        month = "0" + month;
        }
        if (day < 10) {
        day = "0" + day;
        }
        if (hour < 10) {
        hour = "0" + hour;
        }
            if (minute < 10) {
        minute = "0" + minute;
        }
        if (second < 10) {
        second = "0" + second;
        }
        var newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        this.fo.inputTime = newDate;
        this.fo.isSeparate = this.fo.isSeparate;
        this.fo.isArrive = this.fo.isArrive;
        this.fo.inspectionType = this.fo.inspectionType;
        this.ope = true;
        this.titl = "跟踪信息-添加";
      }

    },

    /** 弹窗修改按钮操作 */
    handleUpdat (row) {
      this.fileList= []
      this.reset();
      const id = row.id
      listAbroad(id).then(response => {
        this.fo = response.data;
        this.fo.isSeparate = this.fo.isSeparate;
        this.fo.isArrive = this.fo.isArrive;
        this.fo.inspectionType = this.fo.inspectionType;
         if(!this.fo.inputTime){
         var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
         if (month < 10) {
        month = "0" + month;
        }
        if (day < 10) {
        day = "0" + day;
        }
        if (hour < 10) {
        hour = "0" + hour;
        }
            if (minute < 10) {
        minute = "0" + minute;
        }
        if (second < 10) {
        second = "0" + second;
        }
        var newDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        this.fo.inputTime = newDate;}
        this.ope = true;
        this.titl = "跟踪信息-修改";
      });
    },
    /** 弹窗删除按 钮操作 */
    handleDelet (row) {
      const ids = row.id;
      this.$confirm('是否确认删除数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAbroad(ids);
      }).then(() => {
        this.getListO();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 弹窗表单新增提交按钮 */
    submitForm: function () {
      this.$refs["fo"].validate(valid => {
        if (valid) {
          if (this.titl == "跟踪信息-修改") {
            updateAbroad(this.fo).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.ope = false;
                this.getListO();
              } else {
                this.msgError(response.msg);
              }
            });
          } else if (this.titl == "异常箱邮件发送") {
            this.fo.orderId = this.orderIds.toString();
            abnormalB(this.fo).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.ope = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            abnormalB(this.fo).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.ope = false;
                this.getListO();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    // 一键复制
    autoCopy: function () {
    this.copylist.unloadReason = this.fo.unloadReason; 
    this.copylist.unloadTime = this.fo.unloadTime;
    this.copylist.solveTime = this.fo.solveTime;
    this.copylist.isSeparate = this.fo.isSeparate; 
    this.copylist.isArrive = this.fo.isArrive;
    this.copylist.abnormalType = this.fo.abnormalType;
    this.copylist.unloadSite = this.fo.unloadSite; 
    this.copylist.chargePerson = this.fo.chargePerson;
    this.copylist.realReason = this.fo.realReason;
    this.copylist.arriveTime = this.fo.arriveTime; 
    this.copylist.inspectionType = this.fo.inspectionType;
    this.copylist.abnormalInformation = this.fo.abnormalInformation;       
    if(!!this.copylist){
    this.$message({
　　 message:'复制成功！',
　　 type:'success'
　　 })
    }else{
     this.$message({
　　 message:'复制失败！',
　　 type:'error'
　　 })  
    }       
          
    },
    //一键粘贴
     autoPaste: function () {
    this.fo.unloadReason = this.copylist.unloadReason; 
    this.fo.unloadTime = this.copylist.unloadTime;
    this.fo.solveTime = this.copylist.solveTime;
    this.fo.isSeparate = this.copylist.isSeparate; 
    this.fo.isArrive = this.copylist.isArrive;
    this.fo.abnormalType = this.copylist.abnormalType;
    this.fo.unloadSite = this.copylist.unloadSite; 
    this.fo.chargePerson = this.copylist.chargePerson;
    this.fo.realReason = this.copylist.realReason;
    this.fo.arriveTime = this.copylist.arriveTime; 
    this.fo.inspectionType = this.copylist.inspectionType;
    this.fo.abnormalInformation = this.copylist.abnormalInformation;       
    if(this.fo.abnormalInformation==this.copylist.abnormalInformation){
    this.$message({
　　 message:'粘贴成功！',
　　 type:'success'
　　 })
    }else{
     this.$message({
　　 message:'粘贴失败！',
　　 type:'error'
　　 })  
    }       
          
    },

    /** 弹窗表单新增提交按钮 */
    submitFormD: function () {
      orderExport(this.ord).then(response => {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        var nowDate = year + "-" + month + "-" + day;
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = nowDate + "-托书.docx"; // xxx.xls/xxx.xlsx
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

    // 详情
    cancelD () {
      this.openD = false;
    },

    // 弹窗表单的新增编辑取消按钮
    cancel () {
      this.ope = false;
      this.reset();
      this.getListO();
    },

    /** 日报导出按钮操作 */
    handleExport1 () {
      var queryP1 = {};
      queryP1.orderNumber = this.queryParams.orderNumber;
      queryP1.classEastAndWest = this.queryParams.classEastAndWest;
      queryP1.boxNum = this.queryParams.boxNum;
      queryP1.lineTypeId = this.queryParams.lineTypeId;
      queryP1.classDate = this.queryParams.classDate;
      queryP1.startTime = this.queryParams.startTime;
      queryP1.endTime = this.queryParams.endTime;
      queryP1.inputTime = this.queryParams.inputTime;
      this.$confirm('是否确认导出日报?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportDay(queryP1);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    },

    /** 月报导出按钮操作 */
    handleExport2 () {
      var queryP2 = {};
      queryP2.orderNumber = this.queryParams.orderNumber;
      queryP2.classEastAndWest = this.queryParams.classEastAndWest;
      queryP2.boxNum = this.queryParams.boxNum;
      queryP2.lineTypeId = this.queryParams.lineTypeId;
      queryP2.classDate = this.queryParams.classDate;
      queryP2.startTime = this.queryParams.startTime;
      queryP2.endTime = this.queryParams.endTime;
      queryP2.inputTime = this.queryParams.inputTime;
      this.$confirm('是否确认导出周/月报?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportMonth(queryP2);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    },

    /** 年报导出按钮操作 */
    handleExport3 () {
      var queryP3 = {};
      queryP3.orderNumber = this.queryParams.orderNumber;
      queryP3.classEastAndWest = this.queryParams.classEastAndWest;
      queryP3.boxNum = this.queryParams.boxNum;
      queryP3.lineTypeId = this.queryParams.lineTypeId;
      queryP3.classDate = this.queryParams.classDate;
      queryP3.startTime = this.queryParams.startTime;
      queryP3.endTime = this.queryParams.endTime;
      queryP3.inputTime = this.queryParams.inputTime;
      this.$confirm('是否确认导出年报?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportYear(queryP3);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    },

    //智能跟踪
    genzong () {
      var canshu = this.fo.classNum;
      intellectTracking(canshu).then(response => {
        this.fo.abnormalInformation = response.msg
      });
    },

    // 保存 发送
    submitUpload () {
      this.fo.goCome = this.goCome;
      this.fo.classDate = this.classDate;
      if (this.titl == '跟踪信息-添加' || (this.titl == '异常箱邮件发送' && this.chushi == '0')) {
          if(this.titl == '异常箱邮件发送'){
          this.fo.orderId = this.orderIds.toString();
        }
        addAndSend(this.fo).then(response => {
          if (response.code == 200) {
            this.$message({
            duration:0,
            showClose: true,
            message: '发送成功',
            type: 'success'
            })
            this.ope = false;
            this.getListO();
          } else {
            this.$message.error('发送失败');
          }
        })
      }
      if (this.titl == '跟踪信息-修改' || (this.titl == '异常箱邮件发送' && this.chushi == '1')) {
        editAndSend(this.fo).then(response => {
          if (response.code == 200) {
            this.$message({
            duration:0,
            showClose: true,
            message: '发送成功',
            type: 'success'
            })
            this.ope = false;
            this.getListO();
          } else {
            this.$message.error('发送失败');
          }
        })
      }
    },

    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleSuccess (response) {
      this.fo.filePath = response.msg
    }
  }
};

</script>
<style>
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
}
.abow_dialog .el-dialog {
  margin: 0 auto !important;
  height: 90%;
  overflow: hidden;
}
.abow_dialog .el-dialog__body {
  position: absolute;
  left: 0;
  top: 54px;
  bottom: 0;
  right: 0;
  padding: 0;
  z-index: 1;
  overflow: hidden;
  overflow-y: auto;
}
.abow_dialog .el-dialog__footer {
  position: absolute;
  z-index: 10 !important;
  left: 0;
  right: 0;
  bottom: 0;
}
.table-SelectedRow-bgcolor td {
  background-color: #ffec8b !important;
}
</style>