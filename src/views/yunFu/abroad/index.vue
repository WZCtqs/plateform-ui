<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <!-- <el-form-item label="开行班列"
                    prop="classBlockTrain">
        <el-input v-model.trim="queryParams.classBlockTrain"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="班列日期"
                    prop="classSTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        v-model.trim="queryParams.classSTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
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
      <el-form-item label="始发站"
                    prop="classStationOfDeparture">
        <el-input v-model.trim="queryParams.classStationOfDeparture"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="目的站"
                    prop="classStationOfDestination">
        <el-input v-model.trim="queryParams.classStationOfDestination"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   v-hasPermi="['yunFu:train:query']"
                   @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              border
               @row-click="handleRowClick"
               :row-class-name="tableRowClassName"
              :data="classesList" :cell-style="cellStyle">
      <el-table-column label="班列编号"
                       align="center"
                       prop="classBh" />
      <el-table-column label="班列号"
                       align="center"
                       prop="classNumber" />
      <el-table-column label="运踪时间"
                       align="center"
                       prop="distributionTime" >
      <template slot-scope="scope">
      <span v-if="scope.row.isEdit=='0'" style="color:red">{{scope.row.distributionTime}}</span>  
      <span v-if="scope.row.isEdit=='1'" style="color:#606266">{{scope.row.distributionTime}}</span>
      </template>                 
      </el-table-column>                 
      <el-table-column label="开行班列"
                       align="center"
                       prop="classBlockTrain" />
      <el-table-column label="往返"
                       align="center"
                       prop="classEastAndWest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastAndWest=='0'">西向</span>
          <span v-else>东向</span>
        </template>
      </el-table-column>
      <el-table-column label="始发站"
                       align="center"
                       prop="classStationOfDeparture" />
      <el-table-column label="目的站"
                       align="center"
                       prop="classStationOfDestination" />
       <el-table-column label="计划开车时间" align="center" prop="classSTime" >
         <template slot-scope="scope">
            <span>{{ scope.row.classSTime.substring(0,10) }}</span>
          </template>
      </el-table-column>
      <el-table-column label="预计到站时间" align="center" prop="classETime" >
         <template slot-scope="scope">
            <span>{{ scope.row.classETime }}</span>
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
                     v-hasPermi="['yunFu:train:list']">跟踪信息</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-data-analysis"
                     @click="handleUpdateO(scope.row)"
                     v-hasPermi="['yunFu:abroad:list']">中亚境外</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修 改班列对话框 -->

    <el-dialog :title="title"
               :visible.sync="open"
               v-dialogDrag
               :close-on-click-modal="false"
               class="abow_dialog"
               @close="closeDialog"
               width="1000px">
      <el-row :gutter="10"
              class="mb8">
        <el-col :span="1.5"
                :offset="22">
          <el-button type="primary"
                     icon="el-icon-plus"
                     size="mini"
                     @click="handleAdd"
                     v-hasPermi="['yunFu:train:add']">新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading"
                border
                :data="trainList">
        <el-table-column label="实际班列日期" align="center" prop="actualClassDate" />
        <el-table-column label="运踪时间"
                         align="center"
                         prop="trackTime" />
        <el-table-column label="状态"
                         align="center"
                         prop="stateValue">
          <template slot-scope="scope">
            <span v-if="scope.row.stateValue==0">到达</span>
            <span v-else-if="scope.row.stateValue==1">驶离</span>
            <span v-else>在</span>
          </template>
        </el-table-column>
        <el-table-column label="地理位置"
                         align="center"
                         prop="currentLocation" />
        <!-- <el-table-column label="站点一名字"
                         align="center"
                         prop="stationOneName" />
        <el-table-column label="站点二名字"
                         align="center"
                         prop="stationTwoName" />
        <el-table-column label="站点三名字"
                         align="center"
                         prop="stationThrName">
          <template slot-scope="scope">
            <span v-if="scope.row.stationThrName==0">塔什干</span>
            <span v-else-if="scope.row.stationThrName==1">丘库尔赛</span>
            <span v-else>谢尔盖利</span>
          </template>
        </el-table-column> -->
        <template v-for="(item,index) in columnData">
          <el-table-column v-if="item.show"
                           :key="index"
                           :prop="item.props"
                           :label="item.name"
                           align="center" />
        </template>
        <el-table-column label="备注"
                         align="center"
                         prop="remark" />
        <el-table-column label="更新时间"
                         align="center"
                         prop="updateTime" />
        <el-table-column label="操作"
                         align="center"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="handleUpdat(scope.row)"
                       v-hasPermi="['yunFu:train:edit']">修改</el-button>
            <el-button size="mini"
                       type="text"
                       icon="el-icon-delete"
                       @click="handleDelet(scope.row)"
                       v-hasPermi="['yunFu:train:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="tota>0"
                  :total="tota"
                  :page.sync="queryParam.pageNum"
                  :limit.sync="queryParam.pageSize"
                  @pagination="getListO" />
      <!-- 添加或修改运踪_班列站到站对话框 -->
    </el-dialog>
    <el-dialog :title="titl"
               :visible.sync="ope"
               v-dialogDrag
               :close-on-click-modal="false"
               width="80%">
      <!-- <el-form ref="fo"
               :model="fo"
               :rules="rules"
               :inline="true"
               label-width="150px">
        <el-form-item label="跟踪日期"
                      prop="updateTime">
          <el-date-picker v-model.trim="fo.updateTime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="datetime"
                          style="width:200px;"
                          placeholder=""
                          default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班列日期"
                      prop="actualClassDate">
          <el-date-picker v-model.trim="fo.actualClassDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          style="width:200px;"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="运踪时间"
                      prop="trackTime">
          <el-date-picker v-model.trim="fo.trackTime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="datetime"
                          style="width:200px;"
                          placeholder=""
                          default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态"
                      prop="stateValue">
          <el-radio-group v-model.trim="fo.stateValue">
            <el-radio v-for="dict in ltRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地理位置"
                      prop="currentLocation">
          <el-input v-model.trim="fo.currentLocation"
                    style="width:560px;"
                    placeholder="" />
        </el-form-item>
        <template v-if="this.gob==0">
          <el-form-item label="口岸名字"
                        prop="stationOneName">
            <el-input v-model.trim="fo.stationOneName"
                      disabled
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
          <el-form-item label="口岸距离"
                        prop="stationOneDistance">
            <el-input v-model.trim="fo.stationOneDistance"
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
          <el-form-item label="站点一名字"
                        prop="stationTwoName">
            <el-input v-model.trim="fo.stationTwoName"
                      disabled
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
          <el-form-item label="站点一距离"
                        prop="stationTwoDistance">
            <el-input v-model.trim="fo.stationTwoDistance"
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
          <el-form-item label="站点二名字"
                        prop="stationThrName">
            <el-select v-model.trim="fo.stationThrName"
                       clearable
                       size="small"
                       style="width:200px;"
                       placeholder="请选择">
              <el-option v-for="item in lineOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点二距离"
                        prop="stationThrDistance">
            <el-input v-model.trim="fo.stationThrDistance"
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
        </template>
        <template v-if="this.gob==1">
          <el-form-item label="口岸名字"
                        prop="stationOneName">
            <el-input v-model.trim="fo.stationOneName"
                      disabled
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
          <el-form-item label="口岸距离"
                        prop="stationOneDistance">
            <el-input v-model.trim="fo.stationOneDistance"
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
          <el-form-item label="站点名字"
                        prop="stationTwoName">
            <el-input v-model.trim="fo.stationTwoName"
                      disabled
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
          <el-form-item label="站点距离"
                        prop="stationTwoDistance">
            <el-input v-model.trim="fo.stationTwoDistance"
                      style="width:200px;"
                      placeholder="" />
          </el-form-item>
        </template>
        <el-form-item label="备注"
                      prop="remark ">
          <el-input v-model.trim="fo.remark "
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="跟踪内容"
                      prop="trackContents">
          <el-input v-model.trim="fo.trackContents"
                    style="width:200px;"
                    type="textarea"
                    @focus="focustext"
                    placeholder="" />
        </el-form-item>
      </el-form> -->
      <table border="1">
        <tr>
          <td align="center">跟踪日期</td>
          <td>
            <el-date-picker v-model.trim="fo.updateTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:100%;"
                            placeholder=""
                            default-time="12:00:00">
            </el-date-picker>
          </td>
          <td align="center">选择班列日期</td>
          <td>
            <el-select v-model.trim="fo.actualClassDate"
                       clearable
                       size="small"
                       style="width:100%;"
                       placeholder="请选择">
              <el-option v-for="item in actualOptions"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
            <!-- <el-date-picker v-model.trim="fo.actualClassDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            style="width:150px;"
                            placeholder="">
            </el-date-picker> -->
          </td>
          <td colspan='2'
              style="color:red;width:25%"> 站点和口岸的距离只识别数字、0、/;预计时间不确定不用填写</td>

        </tr>
        <tr>
          <td align="center">运踪时间</td>
          <td align="center">状态</td>
          <td align="center">地理位置</td>
          <template v-if="this.gob==0">
            <td>
              <el-input v-model.trim="fo.stationOneName"
                        disabled
                        style="width:100%;"
                        placeholder="" />
            </td>
            <td>
              <el-input v-model.trim="fo.stationTwoName"
                        disabled
                        style="width:100%;"
                        placeholder="" />
            </td>
            <td>
              <el-select v-model.trim="fo.stationThrName"
                         clearable
                         @change="stationThrName"
                         size="small"
                         style="width:100%;"
                         placeholder="请选择">
                <el-option v-for="item in lineOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </td>
          </template>
          <template v-if="this.gob==1">
            <td>
              <el-input v-model.trim="fo.stationOneName"
                        disabled
                        style="width:100%;"
                        placeholder="" />
            </td>
            <td colspan="2">
              <el-input v-model.trim="fo.stationTwoName"
                        disabled
                        style="width:100%;"
                        placeholder="" />
            </td>
          </template>
        </tr>
        <tr>
          <td>
            <el-date-picker v-model.trim="fo.trackTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            style="width:100%;"
                            placeholder=""
                            default-time="12:00:00">
            </el-date-picker>
          </td>
          <td>
            <el-radio-group v-model.trim="fo.stateValue">
              <el-radio v-for="dict in ltRadio"
                        :key="dict.value"
                        :label="dict.value">{{dict.label}}</el-radio>
            </el-radio-group>
          </td>
          <td>
            <el-input v-model.trim="fo.currentLocation"
                      @input="currentLocation"
                      placeholder="" />
          </td>
          <template v-if="this.gob==0">
            <td>
              <el-input v-model.trim="fo.stationOneDistance"
                        style="width:100%;"
                        @input="stationOneDistance"
                        placeholder="" />
            </td>
            <td>
              <el-input v-model.trim="fo.stationTwoDistance"
                        @input="stationTwoDistance"
                        style="width:100%;"
                        placeholder="" />
            </td>
            <td>
              <el-input v-model.trim="fo.stationThrDistance"
                        style="width:100%;"
                        placeholder="" />
            </td>
          </template>
          <template v-if="this.gob==1">
            <td>
              <el-input v-model.trim="fo.stationOneDistance"
                        style="width:100%;"
                        @input="stationOneDistance"
                        placeholder="" />
            </td>
            <td colspan="2">
              <el-input v-model.trim="fo.stationTwoDistance"
                        style="width:100%;"
                        placeholder="" />
            </td>
          </template>
        </tr>
        <tr>
          <td align="center"
              colspan='6'>备注</td>
        </tr>
        <tr>
          <td colspan="6">
            <el-input v-model="fo.remark"
                      type="textarea"
                      autosize
                      placeholder="" />
          </td>
        </tr>
      </table>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button type="warning"
                   v-hasPermi="['yunFu:train:add']"
                   @click="sendSave">保存发送全部</el-button>
        <!-- <el-button type="success"
                   v-hasPermi="['yunFu:train:add']"
                   @click="sendSaveVIP">保存发送VIP</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleO"
               :visible.sync="openO"
               v-dialogDrag
               :close-on-click-modal="false"
               class="abow_dialog"
               width="1200px">
      <el-form :model="queryParamsO"
               ref="queryForm"
               :inline="true"
               label-width="100px">
        <el-form-item label="委托书编号"
                      prop="orderNumber">
          <el-input v-model.trim="queryParamsO.orderNumber"
                    placeholder=""
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="箱号"
                      prop="boxNum">
          <el-input v-model.trim="queryParamsO.boxNum"
                    placeholder=""
                    clearable
                    size="mini"
                    @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     v-hasPermi="['yunFu:abroad:list']"
                     @click="handleQueryO">搜索</el-button>
          <el-button type="success"
                     icon="el-icon-download"
                     size="mini"
                     v-hasPermi="['yunFu:abroad:download']"
                     @click="xiazai">下载</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload :action="uploadFile"
                     :headers="headers"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :before-remove="beforeRemove"
                     :on-success="handleFileSuccess"
                     multiple
                     :show-file-list="true"
                     :on-exceed="handleExceed"
                     :file-list="fileList">
            <el-button size="mini"
                       icon="el-icon-upload2"
                       v-hasPermi="['yunFu:abroad:import']"
                       type="warning">导入</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading"
                border
                :data="abroadList">
        <el-table-column label="委托书编号"
                         align="center"
                         prop="orderNumber" />
        <el-table-column label="箱号"
                         align="center"
                         prop="boxNum" />
        <el-table-column label="箱型"
                         align="center"
                         prop="boxType" />
        <el-table-column label="实际下货站"
                         align="center"
                         prop="downSite" />
        <el-table-column label="发车日期"
                         align="center"
                         prop="departureDate" />
        <el-table-column label="客户接收邮箱"
                         align="center"
                         prop="customerEmails" />
        <el-table-column label="驶离山口(霍尔果斯)时间"
                         align="center"
                         prop="leaveTime" />
        <el-table-column label="换装/日期"
                         align="center"
                         prop="changeTime" />
        <el-table-column label="换装车号"
                         align="center"
                         prop="changeNum" />
        <el-table-column label="运踪"
                         align="center"
                         prop="abroadContents" />
        <el-table-column label="上传记录时间"
                         align="center"
                         prop="updateTime" />
        <el-table-column label="操作"
                         align="center"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="handleUpdateO1(scope.row)"
                       v-hasPermi="['yunFu:abroad:edit']">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0"
                  :total="totalO"
                  :page.sync="queryParamsO.pageNum"
                  :limit.sync="queryParamsO.pageSize"
                  @pagination="getListO1" />
    </el-dialog>

    <!-- 添加或修改运踪中亚境外对话框 -->
    <el-dialog :title="tit"
               :visible.sync="openO1"
               v-dialogDrag
               :close-on-click-modal="false"
               width="1200px">
      <el-form ref="formO"
               :model="formO"
               :rules="rules"
               inline
               label-width="200px">
        <el-form-item label="委托书编号"
                      prop="orderNumber">
          <el-input v-model.trim="formO.orderNumber"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="箱号"
                      prop="boxNum">
          <el-input v-model.trim="formO.boxNum"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="驶离山口(霍尔果斯)时间"
                      prop="leaveTime">
          <el-date-picker v-model.trim="formO.leaveTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          style="width:200px;"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="换装/日期"
                      prop="changeTime">
          <el-date-picker v-model.trim="formO.changeTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          style="width:200px;"
                          placeholder="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="换装车号"
                      prop="changeNum">
          <el-input v-model.trim="formO.changeNum"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="运踪"
                      prop="abroadContents">
          <el-input v-model.trim="formO.abroadContents"
                    style="width:200px;"
                    placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFormO">确 定</el-button>
        <el-button @click="cancelO">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" 
    v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="open1" width="500px">
      <el-form ref="fo" :model="fo"  label-width="80px">
        <el-form-item label="中文名字" prop="nameCh">
          <el-input v-model.trim="fo.nameCh" placeholder="请输入中文名字" />
        </el-form-item>
        <el-form-item label="英文名字" prop="nameEn">
          <el-input v-model.trim="fo.nameEn" placeholder="请输入英文名字" />
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cance">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listClasses, getClasses, addTrain, getTrain, updateTrain, delTrain, getAbroad, abquery, updateAbroad, download, addAndSend, editAndSend, findClassDate,
  getAdressEn,addTrainEn } from "@/api/yunFu/abroad";
import { getToken } from '@/utils/auth'
export default {
  name: 'Abroad',
  data () {
    return {
      actualOptions: [],
      classId: '',
      gob: '',
      selectID: [],
      emData: {},
      columnData: [],
      uploadFile: process.env.VUE_APP_BASE_API + "/track/abroad/import",
      downloadFile: process.env.VUE_APP_BASE_API + "/track/abroad/download",
      headers: {},
      fileList: [],
      lineOptions: [
        {
          value: '塔什干',
          label: '塔什干'
        },
        {
          value: '丘库尔赛',
          label: '丘库尔赛'
        }, {
          value: '谢尔盖利',
          label: '谢尔盖利'
        }
      ],
      abroadList: [],
      ltRadio: [
        {
          value: '0',
          label: '到达'
        },
        {
          value: '1',
          label: '驶离'
        }, {
          value: '2',
          label: '在'
        }
      ],
      dtRadio: [
        {
          value: '0',
          label: '亚太段'
        },
        {
          value: '1',
          label: '欧亚段'
        }, {
          value: '2',
          label: '欧洲段'
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
      // 中亚境外表总条数
      totalO: 0,
      // 班列表格数据
      classesList: [],
      // 弹出层标题
      title: "",
      // 二层弹出层标题
      titl: "",
      // 中亚境外二层弹出层标题
      tit: "",
      // 是否显示弹出层
      open: false,
      // 是否显示二层弹出层
      ope: false,
      //是否显示英文输入弹出层
      open1: false,
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
        pageSize: 10,
        classBlockTrain: undefined,
        classSTime: undefined,
        classStationOfDeparture: undefined,
        classStationOfDestination: undefined,
        classEastAndWest: undefined,
        lineTypeid: '2'
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
        classId: undefined
      },
      // 表单参数
      form: {},
      // 弹窗表单参数
      fo: {},
      // 中亚境外弹窗表单参数
      formO: {},
      // 表单校验
      rules: {
      }
    };
  },
  // watch: {
  //   'fo.currentLocation': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         // 西向
  //         if (this.gob == 0) {
  //           if (this.fo.currentLocation == '郑州圃田') {
  //             this.fo.stationOneDistance = 2159
  //           } else {
  //             this.fo.stationOneDistance = ""
  //           }
  //           if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined) {
  //             this.fo.stationTwoDistance = ''
  //             this.fo.stationThrDistance = ""
  //           } else {
  //             this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 160
  //             if (this.fo.stationThrName == "塔什干") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
  //             }
  //             if (this.fo.stationThrName == "丘库尔赛") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
  //             }
  //             if (this.fo.stationThrName == "谢尔盖利") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
  //             }
  //           }
  //         }
  //         // 东向
  //         if (this.gob == 1) {
  //           if (this.fo.currentLocation == '河内') {
  //             this.fo.stationOneDistance = 170
  //           } else {
  //             this.fo.stationOneDistance = ""
  //           }
  //           if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined) {
  //             this.fo.stationTwoDistance = ''
  //           } else {
  //             this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 3883
  //             if (this.fo.stationOneName == "扎门乌德") {
  //               if (this.fo.stationTwoName == '二连') {
  //                 this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 37
  //                 this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 1403
  //               } else {
  //                 this.fo.stationTwoDistance = ''
  //                 this.fo.stationThrDistance = ''
  //               }
  //             }
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationOneDistance': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         // 西向
  //         if (this.gob == 0) {
  //           if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined || this.fo.stationOneDistance == '/') {
  //             this.fo.stationTwoDistance = ''
  //             this.fo.stationThrDistance = ""
  //           } else {
  //             this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 160
  //             if (this.fo.stationThrName == "塔什干") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
  //             }
  //             if (this.fo.stationThrName == "丘库尔赛") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
  //             }
  //             if (this.fo.stationThrName == "谢尔盖利") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
  //             }
  //           }
  //         }
  //         // 东向
  //         if (this.gob == 1) {
  //           if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined || this.fo.stationOneDistance == '/') {
  //             this.fo.stationTwoDistance = ''
  //           } else {
  //             this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 3883
  //             if (this.fo.stationOneName == "扎门乌德") {
  //               if (this.fo.stationTwoName == '二连') {
  //                 this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 37
  //                 this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 1403
  //               } else {
  //                 this.fo.stationTwoDistance = ''
  //                 this.fo.stationThrDistance = ''
  //               }
  //             }
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationThrName': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         if (this.gob == 0) {
  //           if (this.fo.stationOneDistance == "" ||
  //             this.fo.stationOneDistance == undefined ||
  //             this.fo.stationOneDistance == '/' ||
  //             this.fo.stationTwoDistance == '' ||
  //             this.fo.stationTwoDistance == undefined ||
  //             this.fo.stationTwoDistance == '/') {
  //             this.fo.stationThrDistance = ""
  //           } else {
  //             if (this.fo.stationThrName == "塔什干") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
  //             }
  //             if (this.fo.stationThrName == "丘库尔赛") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
  //             }
  //             if (this.fo.stationThrName == "谢尔盖利") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
  //             }
  //           }
  //         }
  //         if (this.gob == 1) {
  //           if (this.fo.stationOneName == "扎门乌德") {
  //             if (this.fo.stationTwoName == '二连') {
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 37
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 1403
  //             } else {
  //               this.fo.stationTwoDistance = ''
  //               this.fo.stationThrDistance = ''
  //             }
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationTwoDistance': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         // 西向
  //         if (this.gob == 0) {
  //           if (this.fo.stationTwoDistance == '' || this.fo.stationTwoDistance == undefined || this.fo.stationTwoDistance == '/') {
  //             this.fo.stationThrDistance = ""
  //           } else {
  //             if (this.fo.stationThrName == "塔什干") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
  //             }
  //             if (this.fo.stationThrName == "丘库尔赛") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
  //             }
  //             if (this.fo.stationThrName == "谢尔盖利") {
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
  //             }
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  // },
  created () {
    this.getList();
    this.headers = { 'Authorization': 'Bearer ' + getToken() };
  },
  methods: {
    // 当前地理位置
    currentLocation () {
      // 西 向
      if (this.gob == 0) {
        if (this.fo.currentLocation == '郑州圃田') {
          this.fo.stationOneDistance = 2159
        } else {
          this.fo.stationOneDistance = this.fo.stationOneDistance
        }
        if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined || this.fo.stationOneDistance == '/') {
          this.fo.stationTwoDistance = ''
          this.fo.stationThrDistance = ""
        } else {
          this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 160
          if (this.fo.stationThrName == "塔什干") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
          }
          if (this.fo.stationThrName == "丘库尔赛") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
          }
          if (this.fo.stationThrName == "谢尔盖利") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
          }
        }
      }
      // 东向
      if (this.gob == 1) {
        if (this.fo.currentLocation == '塔什干') {
          this.fo.stationOneDistance = 1140
        } else if (this.fo.currentLocation == '丘库尔赛') {
          this.fo.stationOneDistance = 1126
        } else if (this.fo.currentLocation == '谢尔盖利') {
          this.fo.stationOneDistance = 1159
        } else {
          this.fo.stationOneDistance = this.fo.stationOneDistance
        }
        if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined || this.fo.stationOneDistance == '/') {
          this.fo.stationTwoDistance = ''
        } else {
          this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 3883
          if (this.fo.stationOneName == "扎门乌德") {
            if (this.fo.stationTwoName == '二连') {
              this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 37
              this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 1403
            } else {
              this.fo.stationTwoDistance = ''
              this.fo.stationThrDistance = ''
            }
          }
        }
      }
    },
    // 第一个距离
    stationOneDistance () {
      // 西向
      if (this.gob == 0) {
        if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined || this.fo.stationOneDistance == '/') {
          this.fo.stationTwoDistance = ''
          this.fo.stationThrDistance = ""
        } else {
          this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 160
          if (this.fo.stationThrName == "塔什干") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
          }
          if (this.fo.stationThrName == "丘库尔赛") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
          }
          if (this.fo.stationThrName == "谢尔盖利") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
          }
        }
      }
      // 东向
      if (this.gob == 1) {
        if (this.fo.stationOneDistance == '' || this.fo.stationOneDistance == undefined || this.fo.stationOneDistance == '/') {
          this.fo.stationTwoDistance = ''
        } else {
          this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 3883
          if (this.fo.stationOneName == "扎门乌德") {
            if (this.fo.stationTwoName == '二连') {
              this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 37
              this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 1403
            } else {
              this.fo.stationTwoDistance = ''
              this.fo.stationThrDistance = ''
            }
          }
        }
      }
    },
    //第二个距离
    stationTwoDistance () {
      // 西向
      if (this.gob == 0) {
        if (this.fo.stationTwoDistance == '' || this.fo.stationTwoDistance == undefined || this.fo.stationTwoDistance == '/') {
          this.fo.stationThrDistance = ""
        } else {
          if (this.fo.stationThrName == "塔什干") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
          }
          if (this.fo.stationThrName == "丘库尔赛") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
          }
          if (this.fo.stationThrName == "谢尔盖利") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
          }
        }
      }
    },
    //第三个地名
    stationThrName () {
      if (this.gob == 0) {
        if (this.fo.stationOneDistance == "" ||
          this.fo.stationOneDistance == undefined ||
          this.fo.stationOneDistance == '/' ||
          this.fo.stationTwoDistance == '' ||
          this.fo.stationTwoDistance == undefined ||
          this.fo.stationTwoDistance == '/') {
          this.fo.stationThrDistance = ""
        } else {
          if (this.fo.stationThrName == "塔什干") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 980
          }
          if (this.fo.stationThrName == "丘库尔赛") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 966
          }
          if (this.fo.stationThrName == "谢尔盖利") {
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 999
          }
        }
      }
      if (this.gob == 1) {
        if (this.fo.stationOneName == "扎门乌德") {
          if (this.fo.stationTwoName == '二连') {
            this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 37
            this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 1403
          } else {
            this.fo.stationTwoDistance = ''
            this.fo.stationThrDistance = ''
          }
        }
      }
    },
    focustext () {
      if (this.trainList.length == 0) {
        this.fo.trackContents = "班列于当地时间到达,我司会根据班列的实时运行情况对ETA进行调整，请知悉。"
      } else {
        this.fo.trackContents = this.trainList[0].trackContents;
      }
    },
    //上传 文件
    handleRemove (file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview (file) {
      //  console.log(file);
    },
    handleExceed (files, fileList) {

    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleFileSuccess (res, file) {
      if (res.code == 200) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.getListO1();
        this.fileList = [];
      } else {
        this.$message({
          type: 'info',
          message: '上传失败'
        })
        this.fileList = [];
      }
    },
    /** 查询 班列列表 */
    getList () {
      this.loading = true;
      listClasses(this.queryParams).then(response => {
        this.classesList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },
    cellStyle(row,column,rowIndex,columnIndex){//根据返回值显示背景色颜色
        if(row.column.label=='运踪时间'&& row.row.isEdit=='0'){
          return 'background:yellow'
        }
      },
      //点击行触发、选中或不选中复选框
    handleRowClick(row, column, event) {
      if (this.selectID.indexOf(row.classId) == -1) {
        this.selectID.push(row.classId)
      } else{
        this.selectID.splice(this.selectID.findIndex(item => item == row.classId), 1);
      }
      
    },
    // 选中背景色
    tableRowClassName({ row, rowIndex }) {
      let color = "";
      for (let item of this.selectID.values()) {
        if (item === row.classId) color = "table-SelectedRow-bgcolor";
      }
      
      return color;
    },

    /** 查询跟踪信息列表 */
    getListO () {
      this.loading = true;
      getClasses(this.queryParam).then(response => {
        this.trainList = response.rows;
        this.tota = response.total;
        if (response.rows.length) {
          const { stationOneName,
            stationTwoName,
            stationThrName, stationFouName } = response.rows[0]
          this.columnData = [{
            // name: stationOneName,
            name: stationOneName,
            props: 'stationOneDistance',
            show: stationOneName ? !!stationOneName.trim() : false
          }, {
            // name: stationTwoName,
            name: stationTwoName,
            props: 'stationTwoDistance',
            show: stationTwoName ? !!stationTwoName.trim() : false
          }, {
            // name: stationThrName,
            name: stationThrName,
            props: 'stationThrDistance',
            show: stationThrName ? !!stationThrName.trim() : false
          }, {
            // name: stationFouName,
            name: stationFouName,
            props: 'stationFouDistance',
            show: stationFouName ? !!stationFouName.trim() : false
          }]
        }
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 跟踪信息 */
    handleUpdate (row) {
      this.columnData = [];
      const classId = row.classId || this.ids
      this.open = true;
      this.title = "跟踪信息";
      this.queryParam.classId = classId;
      this.emData.classBlockTrain = row.classBlockTrain;
      this.emData.classBh = row.classBh;
      this.emData.classEastAndWest = row.classEastAndWest;
      this.gob = row.classEastAndWest;
      this.classId = row.classId;
      this.emData.classDate = row.classSTime;
      this.emData.lineTypeid = row.lineTypeid;
      this.getListO();
    },

    // 表单重置
    reset () {
      this.fo = {
        id: undefined,
        classId: undefined,
        DistributionTime: undefined,
        trackContents: undefined,
        actualClassDate: undefined,
        currentLocation: undefined,
        trackTime: undefined,
        exceptEarlyTime: undefined,
        exceptLastTime: undefined,
        stateValue: undefined,
        district: undefined,
        stationOneName: '',
        stationOneDistance: undefined,
        stationTwoName: '',
        stationTwoDistance: '',
        stationThrName: undefined,
        stationThrDistance: undefined,
        stationFouName: undefined,
        stationFouDistance: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        nameCh: undefined,
        nameEn: undefined
      };
      this.resetForm("form");
    },

    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      if (this.gob == 0) {
        this.fo.stationOneName = '霍尔果斯';
        this.fo.stationTwoName = '阿拉木图'
      } else {
        this.fo.stationOneName = '霍尔果斯';
        this.fo.stationTwoName = '郑州圃田'
      }
      this.fo.classId = this.queryParam.classId;
      this.ope = true;
      this.titl = "添加";
      if (this.trainList.length > 0) {
        this.fo = this.trainList[0];
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
        var tim = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        this.fo.updateTime = tim;
        if (!!this.fo.trackTime) {
          var ttmm = this.fo.trackTime.substring(11, 16)
          var timT = year + '-' + month + '-' + day + ' ' + ttmm
          this.fo.trackTime = timT
        }
      } else {
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
        var tim = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
        this.fo.updateTime = tim
      }
      findClassDate(this.classId).then(response => {
        this.actualOptions = response;
      });
    },

    /** 弹窗修改按钮操作 */
    handleUpdat (row) {
      this.reset();
      const id = row.id || this.ids
      getTrain(id).then(response => {
        this.fo = response.data;
        this.ope = true;
        this.titl = "修改";
      });
      findClassDate(this.classId).then(response => {
        this.actualOptions = response;
      });
    },
    /** 弹窗删除按钮操作 */
    handleDelet (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delTrain(ids);
      }).then(() => {
        this.getListO();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 弹窗表单新增提交按钮 */
    submitForm1:function(){
    if (this.titl == "添加") {
      
      const nameCh = this.fo.nameCh;
      const nameEn = this.fo.nameEn;
      //传参加{},对象传值
        addTrainEn({nameCh,nameEn}).then(response => {
          if (response.code === 200) {
            this.msgSuccess("添加成功");
            this.open1=false;
          } else {
            this.msgError(response.msg);
          }
        });
      }else{
       const nameCh = this.fo.nameCh;
       const nameEn = this.fo.nameEn;
      //传参加{},对象传值
        addTrainEn({nameCh,nameEn}).then(response => {
          if (response.code === 200) {
            this.msgSuccess("添加成功");
            this.open1=false;
          } else {
            this.msgError(response.msg);
          }
        }); 
      }
    },
    submitForm: function() {
       if(!this.fo.actualClassDate){
      this.$message.error('抱歉,选择班列日期不能为空')
      return false
      }
      // this.$refs["fo"].validate(valid => {
      // if (valid) {
      if (this.titl == "修改") {
        const name = this.fo.currentLocation;
        getAdressEn(name).then(response => {
          if (response.code === 500) {
            
         this.open1 = true;
         this.titl = "修改";
         this.title = "添加英文位置地名信息";
          } else {
           updateTrain(this.fo).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.ope = false;
            this.getListO();
          } else {
            this.msgError(response.msg);
          }
        });
          }
        });
      } else {
        ;
        const name = this.fo.currentLocation;
        getAdressEn(name).then(response => {
          if (response.code === 500) {
            
         this.open1 = true;
         this.titl = "添加";
         this.title = "添加英文位置地名信息";
          } else {
            addTrain(this.fo).then(response => {
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.ope = false;
            this.getListO();
          } else {
            this.msgError(response.msg);
          }
        });
          }
        });
      }
      // }
      // });
    },
   

    closeDialog () {
      this.getList();
    },
    // 弹窗表单的新增编辑取消按钮
    cancel () {
      this.ope = false;
      this.reset();
    },
    cance() {
      this.open1 = false;
    },

    /** 查询运踪_中亚境外列表 */
    getListO1 () {
      this.loading = true;
      getAbroad(this.queryParamsO).then(response => {
        this.abroadList = response.rows;
        this.openO = true;
        this.titleO = "中亚境外";
        this.totalO = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },

    /** 中亚境外搜索按钮操作 */
    handleQueryO () {
      this.queryParamsO.pageNum = 1;
      this.getListO1();
    },

    /** 中亚境外 */
    handleUpdateO (row) {
      this.queryParamsO.classId = row.classId;
      this.getListO1();
    },

    /** 中亚境外修改操作 */
    handleUpdateO1 (row) {
      const id = row.id;
      this.openO1 = true;
      this.tit = "中亚境外修改";
      abquery(id).then(response => {
        this.formO = response.data
      });
    },

    // 中亚境外取消按钮
    cancelO () {
      this.openO1 = false;
    },

    /** 中亚境外提交按钮 */
    submitFormO: function () {
      this.$refs["formO"].validate(valid => {
        if (valid) {
          if (this.formO.id != undefined) {
            updateAbroad(this.formO).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.openO1 = false;
                this.getListO1();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addAbroad(this.formO).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.openO1 = false;
                this.getListO1();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },

    //中亚境外下载
    xiazai () {
      download().then(response => {
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
        downloadElement.download = nowDate + "-中亚境外模板.xlsx"; // xxx.xls/xxx.xlsx
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
      })
    },

    //中亚境外导入
    daoru () {

    },

    // 保存发 送全部
    sendSave: function () {
      if(!this.fo.actualClassDate){
      this.$message.error('抱歉,选择班列日期不能为空')
      return false
      }
      this.fo.isVip = '0';
      this.fo.classBlockTrain = this.emData.classBlockTrain;
      this.fo.classBh = this.emData.classBh;
      this.fo.classEastAndWest = this.emData.classEastAndWest;
      this.fo.classDate = this.emData.classDate;
      this.fo.lineTypeId = this.emData.lineTypeid;
      if (this.titl == "修改") {
         const name = this.fo.currentLocation;
        getAdressEn(name).then(response => {
          if (response.code === 500) {
          this.open1 = true;
          this.titl = "添加";
          this.title = "添加英文位置地名信息";
            } else {
               editAndSend(this.fo).then(response => {
                if (response.code === 200) {
                  this.$message({
                    duration: 0,
                    showClose: true,
                    message: '发送成功',
                    type: 'success'
                  })
                  this.ope = false
                  this.getListO()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
        });
      } else {
          const name = this.fo.currentLocation;
        getAdressEn(name).then(response => {
          if (response.code === 500) {
          this.open1 = true;
          this.titl = "添加";
          this.title = "添加英文位置地名信息";
            } else {
                addAndSend(this.fo).then(response => {
                  if (response.code === 200) {
                    this.$message({
                      duration: 0,
                      showClose: true,
                      message: '发送成功',
                      type: 'success'
                    })
                    this.ope = false
                    this.getListO()
                  } else {
                    this.msgError(response.msg)
                  }
                })
            }
        });
      }
    },

    // 保存发送VIP
    sendSaveVIP: function () {
      this.fo.isVip = '1';
      this.fo.classBlockTrain = this.emData.classBlockTrain;
      this.fo.classBh = this.emData.classBh;
      this.fo.classEastAndWest = this.emData.classEastAndWest;
      this.fo.classDate = this.emData.classDate;
      this.fo.lineTypeId = this.emData.lineTypeid;
      if (this.titl == "修改") {
        editAndSend(this.fo).then(response => {
          if (response.code === 200) {
            this.msgSuccess("发送成功");
          } else {
            this.msgError(response.msg);
          }
        });
      } else {
        addAndSend(this.fo).then(response => {
          if (response.code === 200) {
            this.msgSuccess("发送成功");
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
  }
};
</script>
<style>
.table td {
  width: 100px;
}
.table {
  margin: 0 auto;
}
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