<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="班列编号"
                    prop="classBh">
        <el-input v-model.trim="queryParams.classBh"
                  placeholder="班列编号"
                  clearable
                  style="width:140px;"
                  size="mini" />
      </el-form-item>
      <el-form-item label="班列号"
                    prop="classNumber">
        <el-input v-model.trim="queryParams.classNumber"
                  placeholder="班列号"
                  clearable
                  style="width:140px;"
                  size="mini" />
      </el-form-item>
      <el-form-item label="始发站"
                    prop="classStationofdeparture">
        <el-input v-model.trim="queryParams.classStationofdeparture"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="目的站"
                    prop="classStationofdestination">
        <el-input v-model.trim="queryParams.classStationofdestination"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="计划开车时间"
                    prop="classStime">
        <el-date-picker clearable
                        style="width:130px;"
                        size="mini"
                        v-model.trim="queryParams.classStime"
                        type="date"
                        value-format="yyyy-MM-dd 00:00:00"
                        placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="线路"
                    prop="lineTypeid">
        <el-select v-model.trim="queryParams.lineTypeid"
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
      <el-form-item label="东西向"
                    prop="classEastandwest">
        <el-select v-model.trim="queryParams.classEastandwest"
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
      <el-form-item label="车辆状态"
                    prop="classState">
        <el-select v-model.trim="queryParams.classState"
                   clearable
                   size="mini"
                   style="width:160px;"
                   placeholder="请选择">
          <el-option v-for="item in clsOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拼箱信息是否修改"
                    prop="pxentryState">
        <el-select v-model.trim="queryParams.pxentryState"
                   clearable
                   style="width:100px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in ptsOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button>
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['trains:classes:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['trains:classes:remove']">删除</el-button>
        <el-button type="warning"
                   icon="el-icon-finished"
                   size="mini"
                   :disabled="multiple"
                   @click="handleModif(1)"
                   v-hasPermi="['trains:classes:modifiable']">可修改</el-button>
        <el-button type="warning"
                   icon="el-icon-finished"
                   size="mini"
                   :disabled="multiple"
                   @click="handleModif(0)"
                   v-hasPermi="['trains:classes:modifiable']">不可修改</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="classesList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="班列编号"
                       align="center"
                       prop="classBh" />
      <el-table-column label="班列号"
                       align="center"
                       prop="classNumber" />
      <el-table-column label="开行班列"
                       align="center"
                       prop="nameCn">
      </el-table-column>
      <el-table-column label="往返"
                       align="center"
                       prop="classEastandwest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastandwest==0">西向</span>
          <span v-else>东向</span>
        </template>
      </el-table-column>
      <el-table-column label="始发站"
                       align="center"
                       prop="classStationofdepartureName" />
      <el-table-column label="目的站"
                       align="center"
                       prop="classStationofdestinationName" />
      <el-table-column label="运行时间(天)"
                       align="center"
                       prop="classTransporttime" />
      <el-table-column label="计划开车时间"
                       align="center"
                       prop="classStime"
                       width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.classStime">{{ parseTime(scope.row.classStime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划到站时间"
                       align="center"
                       prop="classEtime"
                       width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.classEtime">{{ parseTime(scope.row.classEtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼箱信息修改"
                       align="center"
                       prop="pxentryState">
        <template slot-scope="scope">
          <span v-if="scope.row.pxentryState==0">不可修改</span>
          <span v-else>可修改</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆状态"
                       align="center"
                       prop="classState">
        <template slot-scope="scope">
          <span v-if="scope.row.classState==0">未开车</span>
          <span v-else-if="scope.row.classState==1">已开车</span>
          <span v-else-if="scope.row.classState==2">已到终点站</span>
          <span v-else-if="scope.row.classState==3">取消班列</span>
          <span v-else>中亚实际发运班列</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['trains:classes:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['trains:classes:remove']">删除</el-button>
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
               width="800px">
      <el-form ref="form"
               :model="form"
               :inline="true"
               :rules="rules"
               label-width="120px"
               label-position="right">
        <el-form-item label="班列编号"
                      prop="classBh">
          <el-input v-model.trim="form.classBh"
                    style="width:500px"
                    clearable
                    @blur="removeActive()"
                    placeholder="请输入班列编号" />
        </el-form-item>

        <el-form-item label="计划开行时间"
                      prop="classStime">
          <el-date-picker clearable
                          size="small"
                          style="width: 240px"
                          v-model.trim="form.classStime"
                          @change="timeChange"
                          type="date"
                          value-format="yyyy-MM-dd 00:00:00"
                          placeholder="选择计划开车时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划到站时间"
                      prop="classEtime">
          <el-date-picker clearable
                          size="small"
                          style="width: 240px"
                          v-model.trim="form.classEtime"
                          type="date"
                          value-format="yyyy-MM-dd 00:00:00"
                          placeholder="选择计划到站时间">
          </el-date-picker>
          <!-- <el-date-picker v-else
                          clearable
                          size="small"
                          style="width: 240px"
                          v-model.trim="form.classEtime"
                          type="datetime"
                          value-format="yyyy-MM-dd 00:00:00"
                          placeholder="选择计划到站时间">
          </el-date-picker> -->
        </el-form-item>
        <el-form-item label="线路"
                      prop="lineTypeid">
          <el-input v-model.trim="form.nameCn"
                    style="width:180px"
                    placeholder="请选择" />
          <!-- <el-select v-model.trim="form.lineTypeid"
                     clearable
                     style="width: 180px"
                     placeholder="请选择"
                     disabled>
            <el-option v-for="item in lineOptions"
                       @change="agreeChange"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-button type="primary"
                   v-if="this.form.classStime"
                   plain
                   size="small"
                   @click="resetLineQuery">选择</el-button>
        <el-button type="primary"
                   v-else
                   plain
                   size="small"
                   @click="linefire">选择</el-button>
        <el-form-item label="班列号"
                      prop="classNumber">
          <el-select v-model.trim="form.classNumber"
                     filterable
                     clearable
                     style="width: 180px"
                     placeholder="请选择">
            <el-option v-for="(item,index) in numoptions"
                       :key="index"
                       :label="item.classTNumber"
                       :value="item.classTNumber">
            </el-option>
          </el-select>
          <!-- <el-input v-model.trim="form.classNumber"
                    style="width: 180px"
                    placeholder="班列号" /> -->
        </el-form-item>
        <el-button type="primary"
                   plain
                   size="small"
                   @click="resetNumQuery">选择</el-button>
        <el-form-item label="起运站"
                      prop="classStationofdepartureName">
          <el-input v-if="form.classStationofdepartureName"
                    v-model.trim="form.classStationofdepartureName"
                    style="width:240px;"
                    placeholder=""
                    disabled />
          <el-input v-else
                    v-model.trim="form.classStationofdepartureName"
                    style="width:240px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="目的站"
                      prop="classStationofdestinationName">
          <el-input v-if="form.classStationofdestinationName"
                    v-model.trim="form.classStationofdestinationName"
                    style="width:240px;"
                    placeholder=""
                    disabled />
          <el-input v-else
                    v-model.trim="form.classStationofdestinationName"
                    style="width:240px;"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="往返"
                      prop="classEastandwest">
          <el-select v-if="form.classEastandwest"
                     v-model.trim="form.classEastandwest"
                     clearable
                     style="width:240px;"
                     placeholder="请选择"
                     disabled>
            <el-option v-for="item in cleOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-select v-else
                     v-model.trim="form.classEastandwest"
                     clearable
                     style="width:240px;"
                     placeholder="请选择">
            <el-option v-for="item in cleOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行时间"
                      prop="classTransporttime">
          <el-input v-if="form.classTransporttime||form.classTransporttime==0"
                    v-model.trim="form.classTransporttime"
                    style="width:240px;"
                    placeholder="请输入运行时间"
                    disabled />
          <el-input v-else
                    v-model.trim="form.classTransporttime"
                    style="width:240px;"
                    placeholder="请输入运行时间" />
        </el-form-item>
        <el-form-item label="舱位总数"
                      prop="classSpacenumber">
          <el-input v-model.trim="form.classSpacenumber"
                    style="width:240px;"
                    placeholder="请输入舱位总数" />
        </el-form-item>
        <el-form-item label="拼箱体积数"
                      prop="pxcnt">
          <el-input v-model.trim="form.pxcnt"
                    style="width:240px;"
                    placeholder="请输入拼箱体积数" />
        </el-form-item>
        <el-form-item label="整箱舱位数"
                      prop="zxcnt">
          <el-input v-model.trim="form.zxcnt"
                    style="width:240px;"
                    placeholder="请输入整箱舱位数" />
        </el-form-item>
        <el-form-item label="拼箱重量数"
                      prop="pxkgs">
          <el-input v-model.trim="form.pxkgs"
                    style="width:240px;"
                    placeholder="请输入拼箱重量数" />
        </el-form-item>
        <el-form-item label="拼箱状态"
                      prop="pxstate">
          <el-radio-group v-model.trim="form.pxstate">
            <el-radio v-for="dict in pxsRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆状态"
                      prop="classState">
          <el-radio-group v-model.trim="form.classState">
            <el-radio v-for="dict in ltRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="整柜上/下货点"
                      prop="receiveSiteFullArr">
          <template style="height:200px;overflow:auto">
            <el-checkbox :indeterminate="isIndeterminateFull"
                         v-model.trim="checkAllFull"
                         @change="handleCheckAllChangeFull">全选</el-checkbox>
            <el-checkbox-group v-model.trim="form.receiveSiteFullArr"
                               @change="handleCheckedCitiesChangeFull">
              <el-checkbox v-for="dict in siCheckbox"
                           :key="dict.code"
                           :label="dict.code">{{dict.nameCn}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="拼箱上/下货点"
                      prop="receiveSiteLclArr">
          <template style="height:200px">
            <el-checkbox :indeterminate="isIndeterminateLcl"
                         v-model.trim="checkAllLcl"
                         @change="handleCheckAllChangeLcl">全选</el-checkbox>

            <el-checkbox-group v-model.trim="form.receiveSiteLclArr"
                               @change="handleCheckedCitiesChangeLcl">
              <el-checkbox v-for="dict in siCheckbox"
                           :key="dict.code"
                           :label="dict.code">{{dict.nameCn}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="备注"
                      prop="remark">
          <el-input v-model.trim="form.remark"
                    type="textarea"
                    style="width:600px;"
                    placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 线路名称弹窗 -->
    <el-dialog title="线路名称"
               :visible.sync="dialogTableVisible"
               width="60%">
      <el-form :model="queryParam"
               ref="queryLineForm"
               :inline="true">
        <el-form-item label="路线"
                      prop="typeid">
          <el-select v-model.trim="queryParam.typeid"
                     clearable
                     style="width:100px;"
                     size="mini"
                     placeholder="请选择">
            <el-option v-for="item in lineOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="往返"
                      prop="classTEastandwest">
          <el-select v-model.trim="queryParam.classTEastandwest"
                     clearable
                     style="width:100px;"
                     size="mini"
                     placeholder="请选择">
            <el-option v-for="item in returnOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="口岸"
                      prop="classTPort">
          <el-input v-model.trim="queryParam.classPort"
                    placeholder=""
                    clearable
                    style="width:100px;"
                    size="mini"
                    @keyup.enter.native="handleLineQuery" />
        </el-form-item>
        <el-form-item label="始发站"
                      prop="classTStationofdeparture">
          <el-input v-model.trim="queryParam.classTStationofdeparture"
                    placeholder=""
                    clearable
                    style="width:100px;"
                    size="mini"
                    @keyup.enter.native="handleLineQuery" />
        </el-form-item>
        <el-form-item label="目的地"
                      prop="classTStationofdestination">
          <el-input v-model.trim="queryParam.classTStationofdestination"
                    placeholder=""
                    clearable
                    style="width:100px;"
                    size="mini"
                    @keyup.enter.native="handleLineQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleLineQuery">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table border
                @current-change="handleCurrentChange"
                :data="linesiteList">
        <el-table-column label="线路"
                         align="center"
                         prop="typeid">
          <template slot-scope="scope">
            <span v-if="scope.row.typeid==0">中欧</span>
            <span v-else-if="scope.row.typeid==2">中亚</span>
            <span v-else-if="scope.row.typeid==3">中越</span>
            <span v-else>中俄</span>
          </template>
        </el-table-column>
        <el-table-column label="线路名称"
                         align="center"
                         prop="nameCn"
                         width="200" />
        <el-table-column label="往返"
                         align="center"
                         prop="classTEastandwest">
          <template slot-scope="scope">
            <span v-if="scope.row.classTEastandwest==0">西向</span>
            <span v-else>东向</span>
          </template>
        </el-table-column>
        <el-table-column property="classTTransporttime"
                         align="center"
                         label="运行时间(天)"></el-table-column>
        <el-table-column property="classTStationofdeparture"
                         align="center"
                         label="始发站"></el-table-column>
        <el-table-column property="classTStationofdestination"
                         align="center"
                         label="目的站"></el-table-column>

      </el-table>

      <pagination v-show="tota>0"
                  :total="tota"
                  :page.sync="queryParam.pageNum"
                  :limit.sync="queryParam.pageSize"
                  @pagination="getLi" />
    </el-dialog>
    <!-- 班列号弹窗 -->
    <el-dialog title="班列号选择"
               :visible.sync="numberVisible">
      <el-form :model="queryPara"
               ref="queryNumForm"
               :inline="true"
               label-width="68px">
        <el-form-item label="班列号"
                      prop="classTNumber">
          <el-input v-model.trim="queryPara.classTNumber"
                    placeholder=""
                    clearable
                    size="mini"
                    @keyup.enter.native="handleNumQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     size="mini"
                     @click="handleNumQuery">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table border
                @current-change="handleCurrentChangetwo"
                height="400"
                :data="numberList">
        <el-table-column label="班列号"
                         align="center"
                         prop="classTNumber" />
        <el-table-column label="线路"
                         align="center"
                         prop="lineTypeid">
          <template slot-scope="scope">
            <span v-if="scope.row.lineTypeid.search('0') != -1">中欧</span>
            <span v-if="scope.row.lineTypeid.search('2') != -1">中亚</span>
            <span v-if="scope.row.lineTypeid.search('3') != -1">中越</span>
            <span v-if="scope.row.lineTypeid.search('4') != -1">中俄</span>
          </template>
        </el-table-column>
        <el-table-column label="往返"
                         align="center"
                         prop="classTEastandwest">
          <template slot-scope="scope">
            <span v-if="scope.row.classTEastandwest.search('0') != -1">西向</span>
            <span v-if="scope.row.classTEastandwest.search('1') != -1">东向</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination v-show="tot>0"
                  :total="tot"
                  :page.sync="queryPara.pageNum"
                  :limit.sync="queryPara.pageSize"
                  @pagination="getNum" /> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  listClasses,
  getClasses,
  delClasses,
  addClasses,
  updateClasses,
  exportClasses,
  statesModif,
  lineTypeid,
  squadNumber
} from '@/api/trains/classes'
import { listLinesite } from '@/api/trains/linesite'
import { listNumber } from '@/api/trains/Number'
import { timestampToTime } from '@/utils/zhonghao'
export default {
  name: 'Classes',
  data() {
    return {
      // 线路表格数据
      selection: [],
      //班列号返回值
      numoptions: [],
      checkAllFull: false,
      checkAllLcl: false,
      siCheckbox: [],
      isIndeterminateFull: true,
      isIndeterminateLcl: true,
      linesiteList: [],
      numberVisible: false,
      dialogTableVisible: false,
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
      cleOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      returnOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      clsOptions: [
        {
          value: '0',
          label: '未开车'
        },
        {
          value: '1',
          label: '已开车'
        },
        {
          value: '2',
          label: '已到终点站'
        },
        {
          value: '3',
          label: '取消班列'
        },
        {
          value: '4',
          label: '中亚实际发运班列'
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
      ptsOptions: [
        {
          value: '0',
          label: '不可修改'
        },
        {
          value: '1',
          label: '可修改'
        }
      ],
      ltRadio: [
        {
          value: '0',
          label: '未开车'
        },
        {
          value: '1',
          label: '已开车'
        },
        {
          value: '2',
          label: '已到终点站'
        },
        {
          value: '3',
          label: '取消班列'
        },
        {
          // value: '4',
          // label: '中亚实际发运班列'
          value: '5',
          label: '合并班列'
        }
      ],
      pxsRadio: [
        {
          value: '0',
          label: '未满'
        },
        {
          value: '1',
          label: '已满'
        }
      ],
      // 遮罩层
      loading: true,
      // 遮罩层
      loadin: true,
      // 遮罩层
      loadi: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      tota: 0,
      //tot: 0,
      // 班列表格数据
      classesList: [],
      // 线路表格数据
      linesiteList: [],
      // 班列号表格数据
      numberList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classBh: undefined,
        classBlocktrain: undefined,
        classClasstype: undefined,
        classEastandwest: undefined,
        classEtime: undefined,
        classId: undefined,
        classNumber: undefined,
        classSpacenumber: undefined,
        classState: undefined,
        classStationofdeparture: undefined,
        classStationofdepartureCode: undefined,
        classStationofdestinationCode: undefined,
        classStationofdestination: undefined,
        classStime: undefined,
        classStimeEnd: undefined,
        classTransporttime: undefined,
        costentryState: undefined,
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        distributionTime: undefined,
        eurtormbe: undefined,
        euttousde: undefined,
        ispublicly: undefined,
        lineId: undefined,
        lineTypeid: undefined,
        pxcnt: undefined,
        pxentryState: undefined,
        pxkgs: undefined,
        pxstate: undefined,
        remark: undefined,
        rurtormbe: undefined,
        usdtormbe: undefined,
        xhentryState: undefined,
        zxcnt: undefined
      },
      // 线路查询参数
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        typeid: undefined,
        classTEastandwest: undefined,
        classPort: undefined,
        classTStationofdeparture: undefined,
        classTStationofdestination: undefined,
        state: '1'
      },
      // 班列号查询参数
      queryPara: {
        // pageNum: 1,
        // pageSize: 10,
        classTId: undefined,
        classTNumber: undefined,
        lineTypeid: undefined,
        classTEastandwest: undefined,
        state: undefined
      },
      // 表单参数
      form: {
        nameCn: ''
      },
      // 表单校验
      rules: {
        classBh: [
          { required: true, message: '请输入班列编号', trigger: 'blur' }
        ],
        classEtime: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        classSpacenumber: [
          { required: true, message: '请输入舱位总数', trigger: 'blur' }
        ],
        zxcnt: [
          { required: true, message: '请输入整柜舱位数', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getLi()
  },
  methods: {
    //线路列表回显表格
    handleCurrentChange(row) {
      this.form.lineTypeid = row.typeid.toString() //线路
      this.form.classEastandwest = row.classTEastandwest //往返
      this.form.classStationofdeparture = row.classTStationofdepartureCode //起始地编号
      this.form.classStationofdestination = row.classTStationofdestinationCode //目的地编号
      this.form.classStationofdepartureName = row.classTStationofdeparture //起始地
      this.form.classStationofdestinationName = row.classTStationofdestination //目的地
      this.form.classTransporttime = row.classTTransporttime //运行时间
      this.form.lineId = row.id //线路id
      this.form.classBlocktrain = row.nameCn
      this.form.nameCn = row.nameCn //线路名字
      this.getNum()
      this.form.classEtime =
        timestampToTime(
          new Date(this.form.classStime).getTime() +
            row.classTTransporttime * 24 * 60 * 60 * 1000
        ) + '00:00:00'
      this.agreeChange()
      this.dialogTableVisible = false
    },
    // 改变计划开车时间,计划结束时间随之变化
    timeChange() {
      if (this.form.classStime && this.form.classTransporttime) {
        this.form.classEtime =
          timestampToTime(
            new Date(this.form.classStime).getTime() +
              this.form.classTransporttime * 24 * 60 * 60 * 1000
          ) + '00:00:00'
      }
    },
    //计划开车时间为空弹出提示
    linefire() {
      this.$message('请先选择计划开车时间')
    },
    //班列号列表回显
    handleCurrentChangetwo(row) {
      this.form.classNumber = row.classTNumber //班列号
      this.numberVisible = false
    },
    // 整柜站点全选
    handleCheckAllChangeFull(val) {
      var arrsidf = []
      for (var i = 0; i < this.siCheckbox.length; i++) {
        arrsidf.push(this.siCheckbox[i].code)
      }
      this.form.receiveSiteFullArr = val ? arrsidf : []
      this.isIndeterminateFull = false
    },
    // 散货站点全选
    handleCheckAllChangeLcl(val) {
      var arrsidl = []
      for (var i = 0; i < this.siCheckbox.length; i++) {
        arrsidl.push(this.siCheckbox[i].code)
      }
      this.form.receiveSiteLclArr = val ? arrsidl : []
      this.isIndeterminateLcl = false
    },
    //整柜站点的选择事件
    handleCheckedCitiesChangeFull(value) {
      let checkedCount = value.length

      this.checkAllFull = checkedCount === this.siCheckbox.length
      this.isIndeterminateFull =
        checkedCount > 0 && checkedCount < this.siCheckbox.length
    },
    //散货站点的选择事件
    handleCheckedCitiesChangeLcl(value) {
      let checkedCount = value.length
      this.checkAllLcl = checkedCount === this.siCheckbox.length
      this.isIndeterminateLcl =
        checkedCount > 0 && checkedCount < this.siCheckbox.length
    },
    //获取站点信息
    async agreeChange() {
      const id = this.form.lineId
      await lineTypeid(id).then(response => {
        this.siCheckbox = response.rows
      })
    },
    //根据班列编号验证是否已存在此班列编号
    removeActive() {
      if (this.form.classBh) {
        const classBh = this.form.classBh
        squadNumber(classBh).then(response => {
          if (response.code === 500) {
            this.msgError('班列编号已存在,请重新输入！')
          } else if (response.code === 200) {
            this.msgSuccess(response.msg)
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    /** 查询班列列表 */
    getList() {
      this.loading = true
      listClasses(this.queryParams)
        .then(response => {
          this.classesList = response.rows
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 查询线路列表 */
    getLi() {
      this.loadin = true
      listLinesite(this.queryParam).then(response => {
        this.linesiteList = response.rows
        this.tota = response.total
        this.loadin = false
      })
    },

    /** 查询班列号列表 */
    getNum() {
      if (this.form.lineTypeid) {
        const idarr = {
          lineTypeid: this.form.lineTypeid,
          classTEastandwest: this.form.classEastandwest,
          classTNumber: this.queryPara.classTNumber
        }
        listNumber(idarr).then(response => {
          this.numberList = response.rows
          this.numoptions = response.rows
          this.tot = response.total
          this.loadi = false
        })
      } else {
        this.msgError('请先选择线路')
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        classId: undefined,
        classBh: undefined,
        lineTypeid: undefined,
        lineId: undefined,
        classTId: undefined,
        classNumber: undefined,
        classBlocktrain: undefined,
        classClasstype: undefined,
        classEastandwest: undefined,
        classStationofdeparture: undefined,
        classStationofdepartureName: undefined,
        classStationofdestinationName: undefined,
        classStationofdestination: undefined,
        classTransporttime: undefined,
        ispublicly: undefined,
        classSpacenumber: undefined,
        zxcnt: undefined,
        pxstate: '0',
        pxcnt: undefined,
        pxkgs: undefined,
        classStime: undefined,
        classEtime: undefined,
        classState: '0',
        receiveSiteFullArr: [],
        receiveSiteLclArr: [],
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        remark: '',
        nameCn: undefined,
        classBlocktrain: undefined,
        costentryState: undefined,
        distributionTime: undefined,
        xhentryState: undefined,
        pxentryState: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 线路搜索按钮操作 */
    handleLineQuery() {
      this.queryParam.pageNum = 1
      this.getLi()
    },
    /** 班列号搜索按钮操作 */
    handleNumQuery() {
      this.queryPara.pageNum = 1
      this.getNum()
    },
    /** 班列管理重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 线路弹框重置按钮操作 */
    resetLineQuery() {
      this.dialogTableVisible = true
      this.resetForm('queryLineForm')
      this.handleLineQuery()
    },
    /** 班列号弹框重置按钮操作 */
    resetNumQuery() {
      this.numberVisible = true
      this.queryPara.classTNumber = ''
      this.handleNumQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.classId)
      this.single = selection.length != 1
      this.multiple = !selection.length
      this.selection = selection
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.siCheckbox = []
      this.form.receiveSiteFullArr = []
      this.form.receiveSiteLclArr = []
      this.form.createusername = this.$store.getters.name
      this.form.createuserid = this.$store.getters.id
      this.open = true
      this.title = '添加班列'
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset()
      this.siCheckbox = []
      this.form.receiveSiteFull = []
      this.form.receiveSiteLcl = []
      const classId = row.classId || this.classIds
      await getClasses(classId).then(response => {
        this.form = response.data.classesinfo
        if (this.form.receiveSiteFull == null) {
          this.form.receiveSiteFullArr = []
        } else {
          if (this.form.receiveSiteFull.length == 1) {
            this.form.receiveSiteFullArr = this.form.receiveSiteFull.split('')
          } else {
            this.form.receiveSiteFullArr = this.form.receiveSiteFull.split(',')
          }
        }
        if (this.form.receiveSiteLcl == null) {
          this.form.receiveSiteLclArr = []
        } else {
          if (this.form.receiveSiteLcl.length == 1) {
            this.form.receiveSiteLclArr = this.form.receiveSiteLcl.split('')
          } else {
            this.form.receiveSiteLclArr = this.form.receiveSiteLcl.split(',')
          }
        }

        this.form.lineTypeid = this.form.lineTypeid.toString() //线路
        this.title = '修改班列'
        this.open = true
      })
      await this.agreeChange()
      //整柜上下货站点
      let _zgarr2Set = new Set()
      //散货上下货站点
      let _sharr2Set = new Set()
      this.siCheckbox.forEach(item => {
        _zgarr2Set.add(item.code)
        _sharr2Set.add(item.code)
      })
      // 整柜交集
      let _arr2 = this.form.receiveSiteFullArr.filter(item =>
        _zgarr2Set.has(item)
      )
      // 散货交集
      let _arr6 = this.form.receiveSiteLclArr.filter(item =>
        _sharr2Set.has(item)
      )
      console.log(_arr2)
      console.log("**",_arr6)
      this.form.receiveSiteFullArr = _arr2
      this.form.receiveSiteLclArr = _arr6
      this.handleCheckedCitiesChangeFull(this.form.receiveSiteFullArr)
      this.handleCheckedCitiesChangeLcl(this.form.receiveSiteLclArr)
    },
    /** 提交按钮 */
    submitForm: function() {
      // if (this.form.receiveSiteFull.length == 1) {
      //   this.form.receiveSiteFull = this.form.receiveSiteFull.join('');
      // } else {
      //   this.form.receiveSiteFull = this.form.receiveSiteFull.join(',');
      // }
      // if (this.form.receiveSiteLcl.length == 1) {
      //   this.form.receiveSiteLcl = this.form.receiveSiteLcl.join('');
      // } else {
      //   this.form.receiveSiteLcl = this.form.receiveSiteLcl.join(',');

      // }
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.classId != undefined) {
            updateClasses(this.form)
              .then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
              .catch(() => {
                this.msgError(response.msg)
              })
          } else {
            addClasses(this.form).then(response => {
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
    /** 拼箱状态是否可修改 */
    handleModif(data) {
      const classId = this.selection[0].classId
      console.log(classId)
      if (this.selection.length == 1) {
        statesModif(classId, data).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      } else {
        this.msgError('一次只能选择一条数据进行修改')
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const classIds = row.classId || this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delClasses(classIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有班列数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportClasses(queryParams)
        })
        .then(response => {
          this.download(response.msg)
        })
        .catch(function() {})
    }
  }
}
</script>