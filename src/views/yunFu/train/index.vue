<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item label="开行班列"
                    prop="classBlockTrain">
        <el-input v-model.trim="queryParams.classBlockTrain"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="班列日期" prop="classSTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model.trim="queryParams.classSTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder=""
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="始发站" prop="classStationOfDeparture">
        <el-input
          v-model.trim="queryParams.classStationOfDeparture"
          placeholder=""
          clearable
          style="width:100px;"
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目的站" prop="classStationOfDestination">
        <el-input
          v-model.trim="queryParams.classStationOfDestination"
          placeholder=""
          clearable
          style="width:100px;"
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          v-hasPermi="['yunFu:train:query']"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" border
    @row-click="handleRowClick"
    :row-class-name="tableRowClassName" 
    :data="classesList" :cell-style="cellStyle">
      <el-table-column label="班列编号" align="center" prop="classBh" />
      <el-table-column label="班列号" align="center" prop="classNumber" />
      <el-table-column
        label="运踪时间"
        align="center"
        prop="distributionTime"
      >
      <template slot-scope="scope">
      <span v-if="scope.row.isEdit=='0'" style="color:red">{{scope.row.distributionTime}}</span>  
      <span v-if="scope.row.isEdit=='1'" style="color:#606266">{{scope.row.distributionTime}}</span>
      </template>
      </el-table-column>
      <el-table-column label="开行班列" align="center" prop="classBlockTrain" />
      <el-table-column label="往返" align="center" prop="classEastAndWest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastAndWest == 0">西向</span>
          <span v-else>东向</span>
        </template>
      </el-table-column>
      <el-table-column
        label="始发站"
        align="center"
        prop="classStationOfDeparture"
      />
      <el-table-column
        label="目的站"
        align="center"
        prop="classStationOfDestination"
      />
      <el-table-column label="开车时间" align="center" prop="classSTime" >
         <template slot-scope="scope">
            <span>{{ scope.row.classSTime.substring(0,10) }}</span>
          </template>
      </el-table-column>
      <el-table-column label="预计到站时间" align="center" prop="classETime" >
         <template slot-scope="scope">
            <span>{{ scope.row.classETime}}</span>
          </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-data-analysis"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['yunFu:train:list']"
            >跟踪信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改班列对话框 -->

    <el-dialog
      :title="title"
      :visible.sync="open"
      v-dialogDrag
      :close-on-click-modal="false"
      class="abow_dialog"
      @close="closeDialog"
      width="1000px"
    >
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" :offset="22">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['yunFu:train:add']"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-table v-loading="loading" border :data="trainList">
        <el-table-column label="实际班列日期" align="center" prop="actualClassDate" />
        <el-table-column label="运踪时间" align="center" prop="trackTime" />
        <el-table-column
          label="状态"
          align="center"
          width="50px"
          prop="stateValue"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.stateValue == 0">到达</span>
            <span v-else-if="scope.row.stateValue == 1">驶离</span>
            <span v-else>在</span>
          </template>
        </el-table-column>
        <el-table-column
          label="地理位置"
          align="center"
          prop="currentLocation"
        />
        <!-- <el-table-column label="站点一名字"
                         align="center"
                         prop="stationOneName" /> -->
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.stationOneName==0">山口</span>
            <span v-else-if="scope.row.stationOneName==1">二连</span>
            <span v-else-if="scope.row.stationOneName==2">绥芬河</span>
            <span v-else-if="scope.row.stationOneName==3">霍尔果斯</span>
            <span v-else>满洲里</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="站点二名字"
                         align="center"
                         prop="stationTwoName" /> -->
        <!-- <el-table-column label="站点三名字"
                         align="center"
                         prop="stationThrName" /> -->
        <!-- <el-table-column label="站点四名字"
                         align="center"
                         prop="stationFouName" /> -->
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.stationFouName==0">汉堡</span>
            <span v-else-if="scope.row.stationFouName==1">慕尼黑</span>
            <span v-else>列日</span>
          </template>
        </el-table-column> -->
        <template v-for="(item, index) in columnData">
          <el-table-column
            v-if="item.show"
            :key="index"
            :prop="item.props"
            :label="item.name"
            align="center"
          />
        </template>
        <el-table-column
          label="预计最早到港时间"
          align="center"
          prop="exceptEarlyTime"
        />
        <el-table-column
          label="预计最晚到港时间"
          align="center"
          prop="exceptLastTime"
        />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdat(scope.row)"
              v-hasPermi="['yunFu:train:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelet(scope.row)"
              v-hasPermi="['yunFu:train:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="tota > 0"
        :total="tota"
        :page.sync="queryParam.pageNum"
        :limit.sync="queryParam.pageSize"
        @pagination="getListO"
      />
    </el-dialog>
    <el-dialog :title="titl"
    v-dialogDrag
    :close-on-click-modal="false" 
    :visible.sync="ope" width="80%">
      
      <table  border="1">
        <tr>
          <td align="center">跟踪日期</td>
          <td>
            <el-date-picker
              v-model.trim="fo.updateTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%;"
              placeholder=""
              default-time="12:00:00"
            >
            </el-date-picker>
          </td>
          <td align="center">选择班列日期</td>
          <td>
            <template v-if="this.leixing == '3'">
              <el-select
                v-model.trim="fo.actualClassDate"
                clearable
                size="small"
                style="width:100%;"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in actualOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <!-- <el-date-picker v-model.trim="fo.actualClassDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              style="width:250px;"
                              placeholder="">
              </el-date-picker> -->
            </template>
            <template v-if="this.leixing == '0'">
              <el-select
                v-model.trim="fo.actualClassDate"
                clearable
                size="small"
                style="width:100%;"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in actualOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <!-- <el-date-picker v-model.trim="fo.actualClassDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              style="width:150px;"
                              placeholder="">
              </el-date-picker> -->
            </template>
          </td>
          <td colspan="3" style="color:red;width:33%">
            站点和口岸的距离只识别数字、0、/;预计时间不确定不用填写
          </td>
        </tr>
        <tr>
          <td align="center">运踪时间</td>
          <td align="center">状态</td>
          <td align="center">地理位置</td>
          <template v-if="this.leixing == '3'">
            <td colspan="1">
              <el-input
                v-model.trim="fo.stationOneName"
                disabled
                style="width:100%;"
                placeholder=""
              />
            </td>
            <td colspan="2">
              <el-input
                v-model.trim="fo.stationTwoName"
                disabled
                style="width:100%;"
                placeholder=""
              />
            </td>
          </template>
          <template v-if="this.leixing == '0'">
            <td>
              <el-select
                v-model.trim="fo.stationOneName"
                clearable
                @change="stationOneName"
                size="small"
                style="width:100%;"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in lineOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </td>
            <td>
              <el-input
                v-model.trim="fo.stationTwoName"
                disabled
                style="width:100%;"
                placeholder=""
              />
            </td>
            <td>
              <el-input
                v-model.trim="fo.stationThrName"
                style="width:100%;"
                disabled
                placeholder=""
              />
            </td>
            <td>
              <el-select
                v-model.trim="fo.stationFouName"
                clearable
                @change="stationFouName"
                size="small"
                style="width:100%;"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in lineOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </td>
          </template>
        </tr>
        <tr>
          <td>
            <el-date-picker
              v-model.trim="fo.trackTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              style="width:100%;"
              placeholder=""
              default-time="12:00:00"
            >
            </el-date-picker>
          </td>
          <td>
            <el-radio-group v-model.trim="fo.stateValue">
              <el-radio
                v-for="dict in ltRadio"
                :key="dict.value"
                :label="dict.value"
                >{{ dict.label }}</el-radio
              >
            </el-radio-group>
          </td>
          <td>
            <el-input
              v-model.trim="fo.currentLocation"
              @input="currentLocation"
              placeholder=""
            />
          </td>
          <template v-if="this.leixing == '3'">
            <td>
              <el-input
                v-model.trim="fo.stationOneDistance"
                @input="stationOneDistance"
                style="width:100%;"
                placeholder=""
              />
            </td>
            <td>
              <el-input
                v-model.trim="fo.stationTwoDistance"
                style="width:100%;"
                placeholder=""
              />
            </td>
          </template>
          <template v-if="this.leixing == '0'">
            <td>
              <el-input
                v-model.trim="fo.stationOneDistance"
                @input="stationOneDistance"
                style="width:100%;"
                placeholder=""
              />
            </td>
            <td>
              <el-input
                v-model.trim="fo.stationTwoDistance"
                @input="stationTwoDistance"
                style="width:100%;"
                placeholder=""
              />
            </td>
            <td>
              <el-input
                v-model.trim="fo.stationThrDistance"
                @input="stationThrDistance"
                style="width:100%;"
                placeholder=""
              />
            </td>
            <td>
              <el-input
                v-model.trim="fo.stationFouDistance"
                style="width:100%;"
                placeholder=""
              />
            </td>
          </template>
        </tr>
        <template v-if="this.leixing == '3'">
          <tr>
            <td colspan="2" align="center">预计到港时间</td>
            <td align="center" colspan="5">备注</td>
          </tr>
          <tr>
            <td>
              <el-date-picker
                v-model.trim="fo.exceptEarlyTime"
                type="date"
                @change="timeChe"
                value-format="yyyy-MM-dd"
                style="width:100%;"
                placeholder=""
              >
              </el-date-picker>
            </td>
            <td>
              <el-date-picker
                v-model.trim="fo.exceptLastTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%;"
                placeholder=""
              >
              </el-date-picker>
            </td>
            <td colspan="5">
              <el-input v-model="fo.remark" type="textarea" autosize placeholder="" />
            </td>
          </tr>
        </template>
        <template v-if="this.leixing == '0'">
          <tr>
            <td colspan="2" align="center">预计到港时间</td>
            <td align="center" colspan="2">备注</td>
            <td colspan="2" rowspan="2">
              <el-radio-group v-model.trim="fo.district">
                <el-radio
                  v-for="dict in dtRadio"
                  :key="dict.value"
                  :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </td>
            <td align="center" style="height:30px">换装站</td>
          </tr>
          <tr  >
            <td >
              <el-date-picker
                v-model.trim="fo.exceptEarlyTime"
                type="date"
                @change="timeChe"
                value-format="yyyy-MM-dd"
                style="width:100%;"
                placeholder=""
              >
              </el-date-picker>
            </td>
            <td>
              <el-date-picker
                v-model.trim="fo.exceptLastTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%;"
                placeholder=""
              >
              </el-date-picker>
            </td>
            <td colspan="2" >
              <el-input v-model="fo.remark"  type="textarea" autosize placeholder="" />
            </td>
            <td>
              <el-select
                v-model.trim="fo.changePort"
                clearable
                @change="changePort"
                size="small"
                style="width:100%;"
                placeholder="请选择">
                <el-option
                  v-for="item in portOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </tr>
        </template>
      </table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button
          type="warning"
          v-hasPermi="['yunFu:train:add']"
          @click="sendSave"
          >保存发送全部</el-button
        >
        <!-- <el-button
          type="success"
          v-hasPermi="['yunFu:train:add']"
          @click="sendSaveVIP"
          >保存发送VIP</el-button
        > -->
        <el-button @click="cancel">取 消</el-button>
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
import {
  listClasses,
  getClasses,
  addTrain,
  getTrain,
  updateTrain,
  delTrain,
  addAndSend,
  editAndSend,
  findClassDate,
  getAdressEn,
  addTrainEn
} from "@/api/yunFu/train";

export default {
  name: "Train",
  data() {
    return {
      actualOptions: [],
      classId: "",
      leixing: "",
      emData: {},
      selectID: [],
      columnData: [],
      lineOptions: [
        {
          value: "山口",
          label: "山口"
        },
        {
          value: "二连",
          label: "二连"
        },
        {
          value: "绥芬河",
          label: "绥芬河"
        },
        {
          value: "霍尔果斯",
          label: "霍尔果斯"
        },
        {
          value: "满洲里",
          label: "满洲里"
        }
      ],
      lineOption: [
        {
          value: "汉堡",
          label: "汉堡"
        },
        {
          value: "慕尼黑",
          label: "慕尼黑"
        },
        {
          value: "列日",
          label: "列日"
        },
        {
          value: "亨克",
          label: "亨克"
        },
        {
          value: "赫尔辛基",
          label: "赫尔辛基"
        },{
          value: "卡托维兹",
          label: "卡托维兹"
        }
      ],
       portOption: [
        {
          value: "布列斯特",
          label: "布列斯特"
        },
        {
          value: "马拉",
          label: "马拉"
        }
      ],
      ltRadio: [
        {
          value: "0",
          label: "到达"
        },
        {
          value: "1",
          label: "驶离"
        },
        {
          value: "2",
          label: "在"
        }
      ],
      dtRadio: [
        {
          value: "0",
          label: "亚太段"
        },
        {
          value: "1",
          label: "欧亚段"
        },
        {
          value: "2",
          label: "欧洲段"
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
      // 二层弹出层标题
      titl: "",
      // 是否显示弹出层
      open: false,
      // 是否显示二层弹出层
      ope: false,
      //是否显示英文输入弹出层
      open1: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classBlocktrain: undefined,
        classStime: undefined,
        classStationOfDeparture: undefined,
        classStationOfDestination: undefined,
        classEastAndWest: "0",
        lineTypeid: "0,3"
      },
      // 查询参数
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        classId: ""
      },
      // 表单参数
      form: {},
      // 弹窗表单参数
      fo: {},
      // 表单校验
      rules: {}
    };
  },
  // watch: {
  //   // lineTypeid0 中欧，3 中越
  //   'fo.currentLocation': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         if (this.leixing == '0') {
  //           if (newName == "") {
  //             this.fo.stationOneDistance = '';
  //             this.fo.stationTwoDistance = '';
  //             this.fo.stationThrDistance = '';
  //             this.fo.stationFouDistance = '';
  //           } else if (newName == "郑州圃田") {
  //             if (this.fo.stationOneName == '山口') {
  //               this.fo.stationOneDistance = 3669;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 5484;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '二连') {
  //               this.fo.stationOneDistance = 1403;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 8020;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '绥芬河') {
  //               this.fo.stationOneDistance = 2593;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 10223;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '霍尔果斯') {
  //               this.fo.stationOneDistance = 3883;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 5406;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '满洲里') {
  //               this.fo.stationOneDistance = 2704;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 7809;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else {
  //               this.fo.stationTwoDistance = ""
  //               this.fo.stationThrDistance = ""
  //             }
  //             if (this.fo.stationFouName == '汉堡') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1031;              }
  //             else if (this.fo.stationFouName == '慕尼黑') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1403;              }
  //             else if (this.fo.stationFouName == '列日') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1252;              }
  //             else if (this.fo.stationFouName == '亨克') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1410;              }
  //             else {
  //               this.fo.stationFouDistance = ""
  //             }
  //           } else {
  //             this.fo.stationOneDistance = '';
  //             this.fo.stationTwoDistance = '';
  //             this.fo.stationThrDistance = '';
  //             this.fo.stationFouDistance = '';
  //           }
  //         }
  //         if (this.leixing == '3') {
  //           if (newName == "") {
  //             this.fo.stationOneDistance = '';
  //             this.fo.stationTwoDistance = '';
  //           } else if (newName == "郑州圃田") {
  //             this.fo.stationOneDistance = 2159
  //             this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 170;
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationOneName': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         if (this.leixing == '0') {
  //           if (newName == '' || this.fo.currentLocation == '' || this.fo.currentLocation == undefined) {
  //             this.fo.stationOneDistance = '';
  //             this.fo.stationTwoDistance = ""
  //             this.fo.stationThrDistance = ""
  //             this.fo.stationFouDistance = ""
  //           } else if (this.fo.currentLocation == '郑州圃田') {
  //             if (this.fo.stationOneName == '山口') {
  //               this.fo.stationOneDistance = 3669;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 5484;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '二连') {
  //               this.fo.stationOneDistance = 1403;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 8020;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '绥芬河') {
  //               this.fo.stationOneDistance = 2593;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 10223;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '霍尔果斯') {
  //               this.fo.stationOneDistance = 3883;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 5406;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '满洲里') {
  //               this.fo.stationOneDistance = 2704;
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 7809;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else {
  //               this.fo.stationTwoDistance = ""
  //               this.fo.stationThrDistance = ""
  //             }
  //             if (this.fo.stationFouName == '汉堡') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1031;              }
  //             else if (this.fo.stationFouName == '慕尼黑') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1403;              }
  //             else if (this.fo.stationFouName == '列日') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1252;              }
  //             else if (this.fo.stationFouName == '亨克') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1410;              }
  //             else {
  //               this.fo.stationFouDistance = ""
  //             }
  //           } else {
  //             this.fo.stationOneDistance = '';
  //             this.fo.stationTwoDistance = ""
  //             this.fo.stationThrDistance = ""
  //             this.fo.stationFouDistance = ""
  //           }
  //         }
  //         if (this.leixing == '3') {
  //           if (newName == '' || this.fo.currentLocation == '' || this.fo.currentLocation == undefined) {
  //             this.fo.stationOneDistance = ''
  //             this.fo.stationTwoDistance = ""
  //           } else if (this.fo.currentLocation == '郑州圃田') {
  //             this.fo.stationOneDistance = 2159
  //             this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 170;
  //           } else {
  //             this.fo.stationOneDistance = ''
  //             this.fo.stationTwoDistance = ""
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationOneDistance': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         if (this.leixing == '0') {
  //           if (newName == '' || newName == '/') {
  //             this.fo.stationTwoDistance = ""
  //             this.fo.stationThrDistance = ""
  //             this.fo.stationFouDistance = ""
  //           } else {
  //             if (this.fo.stationOneName == '山口') {
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 5484;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '二连') {
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 8020;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '绥芬河') {
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 10223;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '霍尔果斯') {
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 5406;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else if (this.fo.stationOneName == '满洲里') {
  //               this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 7809;
  //               this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;              }
  //             else {
  //               this.fo.stationTwoDistance = ""
  //               this.fo.stationThrDistance = ""
  //             }
  //             if (this.fo.stationFouName == '汉堡') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1031;              }
  //             else if (this.fo.stationFouName == '慕尼黑') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1403;              }
  //             else if (this.fo.stationFouName == '列日') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1252;              }
  //             else if (this.fo.stationFouName == '亨克') {
  //               this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1410;              }
  //             else {
  //               this.fo.stationFouDistance = ""
  //             }
  //           }
  //         }
  //         if (this.leixing == '3') {
  //           if (newName == '' || newName == '/') {
  //             this.fo.stationTwoDistance = ""
  //           } else {
  //             this.fo.stationTwoDistance = parseInt(this.fo.stationOneDistance) + 170;
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationTwoDistance': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         if (this.leixing == '0') {
  //           if (newName == '' || newName == '/') {
  //             this.fo.stationThrDistance = ""
  //             this.fo.stationFouDistance = ""
  //           } else {
  //             this.fo.stationThrDistance = parseInt(this.fo.stationTwoDistance) + 30;            }
  //           if (this.fo.stationFouName == '汉堡') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1031;            }
  //           else if (this.fo.stationFouName == '慕尼黑') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1403;            }
  //           else if (this.fo.stationFouName == '列日') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1252;            }
  //           else if (this.fo.stationFouName == '亨克') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1410;            }
  //           else {
  //             this.fo.stationFouDistance = ""
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationThrDistance': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         if (this.leixing == '0') {
  //           if (newName == '' || newName == '/') {
  //             this.fo.stationFouDistance = ""
  //           } else { }
  //           if (this.fo.stationFouName == '汉堡') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1031;            }
  //           else if (this.fo.stationFouName == '慕尼黑') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1403;            }
  //           else if (this.fo.stationFouName == '列日') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1252;            }
  //           else if (this.fo.stationFouName == '亨克') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1410;            }
  //           else {
  //             this.fo.stationFouDistance = ""
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  //   'fo.stationFouName': {
  //     handler (newName, oldName) {
  //       if (newName != oldName) {
  //         if (this.fo.stationOneDistance == '' ||
  //           this.fo.stationOneDistance == undefined) {
  //           this.fo.stationFouDistance = ""
  //         } else {
  //           if (this.fo.stationFouName == '汉堡') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1031;            }
  //           else if (this.fo.stationFouName == '慕尼黑') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1403;            }
  //           else if (this.fo.stationFouName == '列日') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1252;            }
  //           else if (this.fo.stationFouName == '亨克') {
  //             this.fo.stationFouDistance = parseInt(this.fo.stationThrDistance) + 1410;            }
  //           else {
  //             this.fo.stationFouDistance = ""
  //           }
  //         }
  //       }
  //       immediate: true
  //     }
  //   },
  // },
  created() {
    this.getList();
  },
  methods: {
    closeDialog() {
      this.getList();
    },
    //地理位置
    currentLocation() {
      if (this.leixing == "0") {
        if (this.fo.currentLocation == "") {
          this.fo.stationOneDistance = this.fo.stationOneDistance;
          this.fo.stationTwoDistance = this.fo.stationTwoDistance;
          this.fo.stationThrDistance = this.fo.stationThrDistance;
          this.fo.stationFouDistance = this.fo.stationFouDistance;
        } else if (this.fo.currentLocation == "郑州圃田") {
          if (this.fo.stationOneName == "山口") {
            this.fo.stationOneDistance = 3669;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 5484;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "二连") {
            this.fo.stationOneDistance = 1403;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 8020;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "绥芬河") {
            this.fo.stationOneDistance = 2593;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 10223;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "霍尔果斯") {
            this.fo.stationOneDistance = 3883;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 5406;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "满洲里") {
            this.fo.stationOneDistance = 2704;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 7809;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else {
            this.fo.stationTwoDistance = "";
            this.fo.stationThrDistance = "";
          }
          if (this.fo.stationFouName == "汉堡") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1031;
          } else if (this.fo.stationFouName == "慕尼黑") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1403;
          } else if (this.fo.stationFouName == "列日") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1252;
          } else if (this.fo.stationFouName == "亨克") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1410;
          }else if (this.fo.stationFouName == "赫尔辛基") {
            if(this.fo.stationOneName == "二连"){
             this.fo.stationFouDistance =
              parseInt(this.fo.stationOneDistance) + 7537;
              this.fo.stationTwoDistance = "/";
              this.fo.stationThrDistance = "/";
            }
          } else {
            this.fo.stationFouDistance = "";
          }
        } else {
          this.fo.stationOneDistance = this.fo.stationOneDistance;
          this.fo.stationTwoDistance = this.fo.stationTwoDistance;
          this.fo.stationThrDistance = this.fo.stationThrDistance;
          this.fo.stationFouDistance = this.fo.stationFouDistance;
        }
      }
      if (this.leixing == "3") {
        if (this.fo.currentLocation == "") {
          this.fo.stationOneDistance = this.fo.stationOneDistance;
          this.fo.stationTwoDistance = this.fo.stationTwoDistance;
        } else if (this.fo.currentLocation == "郑州圃田") {
          this.fo.stationOneDistance = 2159;
          this.fo.stationTwoDistance =
            parseInt(this.fo.stationOneDistance) + 170;
        }
      }
    },
    //第一个名称
    stationOneName() {
      if (this.leixing == "0") {
        if (
          this.fo.stationOneName == "" ||
          this.fo.currentLocation == "" ||
          this.fo.currentLocation == undefined
        ) {
          this.fo.stationOneDistance = "";
          this.fo.stationTwoDistance = "";
          this.fo.stationThrDistance = "";
          this.fo.stationFouDistance = "";
        } else if (this.fo.currentLocation == "郑州圃田") {
          if (this.fo.stationOneName == "山口") {
            this.fo.stationOneDistance = 3669;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 5484;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "二连") {
            this.fo.stationOneDistance = 1403;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 8020;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "绥芬河") {
            this.fo.stationOneDistance = 2593;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 10223;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "霍尔果斯") {
            this.fo.stationOneDistance = 3883;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 5406;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "满洲里") {
            this.fo.stationOneDistance = 2704;
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 7809;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else {
            this.fo.stationTwoDistance = "";
            this.fo.stationThrDistance = "";
          }
          if (this.fo.stationFouName == "汉堡") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1031;
          } else if (this.fo.stationFouName == "慕尼黑") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1403;
          } else if (this.fo.stationFouName == "列日") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1252;
          } else if (this.fo.stationFouName == "亨克") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1410;
          }else if (this.fo.stationFouName == "赫尔辛基") {
           if(this.fo.stationOneName == "二连"){
             this.fo.stationFouDistance =
              parseInt(this.fo.stationOneDistance) + 7537;
              this.fo.stationTwoDistance = "/";
              this.fo.stationThrDistance = "/";
            }
          } else {
            this.fo.stationFouDistance = "";
          }
        } else {
          this.fo.stationOneDistance = "";
          this.fo.stationTwoDistance = "";
          this.fo.stationThrDistance = "";
          this.fo.stationFouDistance = "";
        }
      }
      if (this.leixing == "3") {
        if (
          this.fo.stationOneName == "" ||
          this.fo.currentLocation == "" ||
          this.fo.currentLocation == undefined
        ) {
          this.fo.stationOneDistance = "";
          this.fo.stationTwoDistance = "";
        } else if (this.fo.currentLocation == "郑州圃田") {
          this.fo.stationOneDistance = 2159;
          this.fo.stationTwoDistance =
            parseInt(this.fo.stationOneDistance) + 170;
        } else {
          this.fo.stationOneDistance = "";
          this.fo.stationTwoDistance = "";
        }
      }
    },
    //第一个距离
    stationOneDistance() {
      if (this.leixing == "0") {
        if (
          this.fo.stationOneDistance == "" ||
          this.fo.stationOneDistance == "/"
        ) {
          this.fo.stationTwoDistance = "";
          this.fo.stationThrDistance = "";
          this.fo.stationFouDistance = "";
        } else {
          if (this.fo.stationOneName == "山口") {
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 5484;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "二连") {
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 8020;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "绥芬河") {
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 10223;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "霍尔果斯") {
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 5406;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else if (this.fo.stationOneName == "满洲里") {
            this.fo.stationTwoDistance =
              parseInt(this.fo.stationOneDistance) + 7809;
            this.fo.stationThrDistance =
              parseInt(this.fo.stationTwoDistance) + 30;
          } else {
            this.fo.stationTwoDistance = "";
            this.fo.stationThrDistance = "";
          }
          if (this.fo.stationFouName == "汉堡") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1031;
          } else if (this.fo.stationFouName == "慕尼黑") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1403;
          } else if (this.fo.stationFouName == "列日") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1252;
          } else if (this.fo.stationFouName == "亨克") {
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 1410;
          } else if (this.fo.stationFouName == "赫尔辛基") {
            if(this.fo.stationOneName == "二连"){
             this.fo.stationFouDistance =
              parseInt(this.fo.stationOneDistance) + 7537;
              this.fo.stationTwoDistance = "/";
              this.fo.stationThrDistance = "/";
            }
          } else {
            this.fo.stationFouDistance = "";
          }
        }
      }
      if (this.leixing == "3") {
        if (
          this.fo.stationOneDistance == "" ||
          this.fo.stationOneDistance == "/"
        ) {
          this.fo.stationTwoDistance = "";
        } else {
          this.fo.stationTwoDistance =
            parseInt(this.fo.stationOneDistance) + 170;
        }
      }
    },
    //第二个 距离
    stationTwoDistance() {
      if (this.leixing == "0") {
        if (
          this.fo.stationTwoDistance == "" ||
          this.fo.stationTwoDistance == "/"
        ) {
          this.fo.stationThrDistance = "";
          this.fo.stationFouDistance = "";
        } else {
          this.fo.stationThrDistance =
            parseInt(this.fo.stationTwoDistance) + 30;
        }
        if (this.fo.stationFouName == "汉堡") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1031;
        } else if (this.fo.stationFouName == "慕尼黑") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1403;
        } else if (this.fo.stationFouName == "列日") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1252;
        } else if (this.fo.stationFouName == "亨克") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1410;
        } else if (this.fo.stationFouName == "赫尔辛基") {
          if(this.fo.stationOneName == "二连"){
             this.fo.stationFouDistance =
              parseInt(this.fo.stationOneDistance) + 7537;
              this.fo.stationTwoDistance = "/";
              this.fo.stationThrDistance = "/";
            }
        } else {
          this.fo.stationFouDistance = "";
        }
      }
    },
    // 第三个距离
    stationThrDistance() {
      if (this.leixing == "0") {
        if (
          this.fo.stationThrDistance == "" ||
          this.fo.stationThrDistance == "/"
        ) {
          this.fo.stationFouDistance = "";
        } else {
        }
        if (this.fo.stationFouName == "汉堡") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1031;
        } else if (this.fo.stationFouName == "慕尼黑") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1403;
        } else if (this.fo.stationFouName == "列日") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1252;
        } else if (this.fo.stationFouName == "亨克") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1410;
        } else if (this.fo.stationFouName == "赫尔辛基") {
          if(this.fo.stationOneName == "二连"){
             this.fo.stationFouDistance =
              parseInt(this.fo.stationOneDistance) + 7537;
              this.fo.stationTwoDistance = "/";
              this.fo.stationThrDistance = "/";
            }
        } else {
          this.fo.stationFouDistance = "";
        }
      }
    },
    // 第四个名称
    stationFouName() {
      if (
        this.fo.stationOneDistance == "" ||
        this.fo.stationOneDistance == undefined
      ) {
        this.fo.stationFouDistance = "";
      } else {
        if (this.fo.stationFouName == "汉堡") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1031;
        } else if (this.fo.stationFouName == "慕尼黑") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1403;
        } else if (this.fo.stationFouName == "列日") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1252;
        } else if (this.fo.stationFouName == "亨克") {
          this.fo.stationFouDistance =
            parseInt(this.fo.stationThrDistance) + 1410;
        } else if (this.fo.stationFouName == "赫尔辛基") {
          if(this.fo.stationOneName == "二连"){
             this.fo.stationFouDistance =
              parseInt(this.fo.stationOneDistance) + 7537;
              this.fo.stationTwoDistance = "/";
              this.fo.stationThrDistance = "/";
            }
        }else if(this.fo.stationFouName == "卡托维兹"){
            this.fo.stationFouDistance =
              parseInt(this.fo.stationThrDistance) + 400;
        } else {
          this.fo.stationFouDistance = "";
        }
      }
    },
    // 最早到港时 间点击事件
    timeChe() {
      if (
        this.fo.exceptEarlyTime == "" ||
        this.fo.exceptEarlyTime == undefined
      ) {
        this.fo.exceptLastTime = "";
      } else {
        var dateTime = new Date(this.fo.exceptEarlyTime);
        dateTime.setDate(dateTime.getDate() + 1);
        var y = dateTime.getFullYear();
        var m =
          dateTime.getMonth() + 1 < 10
            ? "0" + (dateTime.getMonth() + 1)
            : dateTime.getMonth() + 1;
        var d =
          dateTime.getDate() < 10
            ? "0" + dateTime.getDate()
            : dateTime.getDate();
        this.fo.exceptLastTime = y + "-" + m + "-" + d;
      }
    },
    focustext() {
      if (this.trainList.length == 0) {
        this.fo.trackContents =
          "班列于当地时间到达,我司会根据班列的实时运行情况对ETA进行调整，请知悉。";
      } else {
        this.fo.trackContents = this.trainList[0].trackContents;
      }
    },
    /** 查询班列列表 */
    getList() {
      this.loading = true;
      listClasses(this.queryParams)
        .then(response => {
          this.classesList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(() => {
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
    getListO() {
      this.loading = true;
      getClasses(this.queryParam)
        .then(response => {
          this.trainList = response.rows;
          if (response.rows.length) {
            const {
              stationOneName,
              stationTwoName,
              stationThrName,
              stationFouName
            } = response.rows[0];
            this.columnData = [
              {
                // name: stationOneName,
                name: stationOneName,
                props: "stationOneDistance",
                show: stationOneName ? !!stationOneName.trim() : false
              },
              {
                // name: stationTwoName,
                name: stationTwoName,
                props: "stationTwoDistance",
                show: stationTwoName ? !!stationTwoName.trim() : false
              },
              {
                // name: stationThrName,
                name: stationThrName,
                props: "stationThrDistance",
                show: stationThrName ? !!stationThrName.trim() : false
              },
              {
                // name: stationFouName,
                name: stationFouName,
                props: "stationFouDistance",
                show: stationFouName ? !!stationFouName.trim() : false
              }
            ];
          }
          this.tota = response.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 跟踪信息 */
    handleUpdate(row) {
      this.columnData = [];
      const classId = row.classId || this.ids;
      this.open = true;
      this.title = "跟踪信息";
      this.emData.classBlockTrain = row.classBlockTrain;
      this.emData.classBh = row.classBh;
      this.emData.classEastAndWest = row.classEastAndWest;
      this.emData.classDate = row.classSTime;
      this.emData.lineTypeid = row.lineTypeid;
      this.leixing = row.lineTypeid;
      this.classId = row.classId;
      this.queryParam.classId = classId;
      this.getListO();
    },

    // 表单重置
    reset() {
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
        stationOneName: undefined,
        stationOneDistance: undefined,
        stationTwoName: "布列斯特",
        stationTwoDistance: undefined,
        stationThrName: "马拉",
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
        nameEn: undefined,
        changePort: undefined
      };
      this.resetForm("fo");
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      if (this.leixing == "3") {
        this.fo.stationOneName = "凭祥";
        this.fo.stationTwoName = "河内";
      }
      this.fo.classId = this.queryParam.classId;
      this.ope = true;
      this.titl = "添加";
      debugger
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
        var tim = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        this.fo.updateTime = tim;
        if(!!this.fo.trackTime){
        var ttmm = this.fo.trackTime.substring(11,16);
        var timT = year + "-" + month + "-" + day + " " + ttmm;
        this.fo.trackTime = timT;
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
        var tim = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        this.fo.updateTime = tim;
      }
      findClassDate(this.classId).then(response => {
        this.actualOptions = response;
      });
    },

    /** 弹窗修改按钮操作 */
    handleUpdat(row) {
      this.reset();
      const id = row.id || this.ids;
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
    handleDelet(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除选中数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delTrain(ids);
        })
        .then(() => {
          this.getListO();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
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

    // 保存发送 全部
    sendSave: function() {
      if(!this.fo.actualClassDate){
      this.$message.error('抱歉,选择班列日期不能为空')
      return false
      }
      this.fo.isVip = "0";
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
                  duration:0,
                  showClose: true,
                  message: '发送成功',
                  type: 'success'
                  });
                  this.ope = false;
                  this.getListO();
                } else {
                  this.msgError(response.msg);
                }
              });
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
                    duration:0,
                    showClose: true,
                    message: '发送成功',
                    type: 'success'
                    });
                    this.ope = false;
                    this.getListO();
                  } else {
                    this.msgError(response.msg);
                  }
                });
            }
        });
      }
    },

    // 保存发 送VIP
    sendSaveVIP: function() {
      this.fo.isVip = "1";
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

    // 弹窗表单的新增编辑取消按钮
    cancel() {
      this.ope = false;
      this.reset();
    },
    cance() {
      this.open1 = false;
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
.el-radio-group lable{
  margin-left: -2px !important;
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
