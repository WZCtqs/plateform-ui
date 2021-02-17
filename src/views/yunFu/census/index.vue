<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="100px">
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
      <el-form-item label="开行班列"
                    prop="classBlockTrain">
        <el-select v-model.trim="queryParams.classBlockTrain"
                   clearable
                   size="small"
                   style="width:200px;"
                   placeholder="请选择">
          <el-option v-for="item in cbOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="往返"
                    prop="classEastAndWest">
        <el-select v-model.trim="queryParams.classEastAndWest"
                   clearable
                   size="small"
                   style="width:100px;"
                   placeholder="请选择">
          <el-option v-for="item in ceOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的站"
                    prop="classStationofdestinationName">
        <el-input v-model.trim="queryParams.classStationofdestinationName"
                  placeholder=""
                  clearable
                  style=""
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="班列日期"
                    prop="">
        <el-date-picker v-model.trim="queryParams.startTime"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        style="width:150px;"
                        :picker-options="pickerOptionsStart"
                        placeholder="开始日期">
        </el-date-picker>-
        <el-date-picker v-model.trim="queryParams.endTime"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        style="width:150px;"
                        :picker-options="pickerOptionsEnd"
                        placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   v-hasPermi="['yunFu:census:query']"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-upload2"
                   size="mini"
                   v-hasPermi="['yunFu:census:export']"
                   @click="handleExport">导出</el-button>
        <el-button type="warning"
                   icon="el-icon-data-line"
                   size="mini"
                   v-hasPermi="['yunFu:census:export']"
                   @click="handleExport1">运行分析</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="siteList"
              border
              @selection-change="handleSelectionChange">
      <el-table-column label="班列编号"
                       align="center"
                       prop="classBh" />
      <el-table-column label="班列号"
                       align="center"
                       prop="classNum" />
      <el-table-column label="开行班列"
                       align="center"
                       prop="classBlockTrain" />
      <el-table-column label="编辑状态"
                       align="center"
                       prop="isEdit ">
        <template slot-scope="scope">
          <span v-if="scope.row.isEdit== 1"
                style="color:red;">已编辑</span>
          <span v-else>未编辑</span>
        </template>
      </el-table-column>
      <el-table-column label="往返"
                       align="center"
                       prop="classEastAndWest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastAndWest== 1">东向</span>
          <span v-else>西向</span>
        </template>
      </el-table-column>
      <el-table-column label="始发站"
                       align="center"
                       prop="startStation" />
      <el-table-column label="目的站"
                       align="center"
                       prop="classStationofdestinationName" />
      <el-table-column label="开车时间"
                       align="center"
                       prop="classSTime" />
      <el-table-column label="到站时间"
                       align="center"
                       prop="classETime" />
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['yunFu:census:edit']">修改</el-button>
          <!-- 是 -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改城 市站点对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="1000px">
      <el-form ref="form"
               :model="form"
               :inline="true"
               :rules="rules"
               label-width="150px">
        <template>
          <el-form-item label="班列日期"
                        prop="classDate">
            <el-date-picker v-model.trim="form.classDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="this.form.classEastAndWest=='0'">
          <el-form-item label="出境口岸"
                        prop="port">
            <el-input v-model.trim="form.port"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="this.form.classEastAndWest=='1'">
          <el-form-item label="入境口岸"
                        prop="port">
            <el-input v-model.trim="form.port"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'">
          <el-form-item label="固定发车时间"
                        prop="planRunTime">
            <el-date-picker v-model.trim="form.planRunTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'||this.form.classBlockTrain=='中亚班列'||this.form.classBlockTrain=='越南'">
          <el-form-item label="实际发车时间"
                        prop="actualRunTime">
            <el-date-picker v-model.trim="form.actualRunTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder=""
                            default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'||this.form.classBlockTrain=='中亚班列'||this.form.classBlockTrain=='越南'">
          <el-form-item label="国内运行时间"
                        prop="domesticDay">
            <el-input v-model.trim="form.domesticDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="this.form.classEastAndWest=='1'">
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'"
                        label="始发站-马拉"
                        prop="lastDestinationDate">
            <el-input v-model.trim="form.lastDestinationDate"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="到达山口"
                        prop="arriveOneTime">
            <el-input v-model.trim="form.arriveOneTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河')&&this.form.classEastAndWest=='1'"
                        label="到达马拉"
                        prop="arriveOneTime">
            <el-input v-model.trim="form.arriveOneTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='0'"
                        label="到达二连"
                        prop="arriveOneTime">
            <el-input v-model.trim="form.arriveOneTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='0'"
                        label="到达绥芬河"
                        prop="arriveOneTime">
            <el-input v-model.trim="form.arriveOneTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='0'"
                        label="到达霍尔果斯"
                        prop="arriveOneTime">
            <el-input v-model.trim="form.arriveOneTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='1'"
                        label="到达阿腾科里"
                        prop="arriveOneTime">
            <el-input v-model.trim="form.arriveOneTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='越南'&&this.form.classEastAndWest=='0'"
                        label="到达凭祥"
                        prop="arriveOneTime">
            <el-input v-model.trim="form.arriveOneTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'||this.form.classBlockTrain=='中亚班列'||this.form.classBlockTrain=='越南'">
          <el-form-item label="停留时间1"
                        prop="oneStayDay">
            <el-select v-model.trim="form.oneStayDay"
                       clearable
                       style="width:200px;"
                       placeholder="请选择">
              <el-option v-for="item in tZOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="驶离山口"
                        prop="departOneTime">
            <el-date-picker v-model.trim="form.departOneTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河')&&this.form.classEastAndWest=='1'"
                        label="驶离马拉"
                        prop="departOneTime">
            <el-date-picker v-model.trim="form.departOneTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='0'"
                        label="驶离二连"
                        prop="departOneTime">
            <el-date-picker v-model.trim="form.departOneTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='0'"
                        label="驶离绥芬河"
                        prop="departOneTime">
            <el-date-picker v-model.trim="form.departOneTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='0'"
                        label="驶离霍尔果斯"
                        prop="departOneTime">
            <el-date-picker v-model.trim="form.departOneTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='1'"
                        label="驶离阿腾科里"
                        prop="departOneTime">
            <el-date-picker v-model.trim="form.departOneTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='越南'&&this.form.classEastAndWest=='0'"
                        label="驶离凭祥"
                        prop="departOneTime">
            <el-date-picker v-model.trim="form.departOneTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="山口-多斯特克"
                        prop="oneTwoDay">
            <el-input v-model.trim="form.oneTwoDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河')&&this.form.classEastAndWest=='1'"
                        label="马拉-布列斯特"
                        prop="oneTwoDay">
            <el-input v-model.trim="form.oneTwoDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='0'"
                        label="二连-扎门乌德"
                        prop="oneTwoDay">
            <el-input v-model.trim="form.oneTwoDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='0'"
                        label="绥芬河-格罗捷克沃"
                        prop="oneTwoDay">
            <el-input v-model.trim="form.oneTwoDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='0'"
                        label="霍尔果斯-阿腾科里"
                        prop="oneTwoDay">
            <el-input v-model.trim="form.oneTwoDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='1'"
                        label="阿腾科里-霍尔果斯"
                        prop="oneTwoDay">
            <el-input v-model.trim="form.oneTwoDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='越南'&&this.form.classEastAndWest=='0'"
                        label="凭祥-目的地"
                        prop="oneTwoDay">
            <el-input v-model.trim="form.oneTwoDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="到达多斯特克"
                        prop="arriveTwoTime">
            <el-input v-model.trim="form.arriveTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河')&&this.form.classEastAndWest=='1'"
                        label="到达布列斯特"
                        prop="arriveTwoTime">
            <el-input v-model.trim="form.arriveTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='0'"
                        label="到达扎门乌德"
                        prop="arriveTwoTime">
            <el-input v-model.trim="form.arriveTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='0'"
                        label="到达格罗捷克沃"
                        prop="arriveTwoTime">
            <el-input v-model.trim="form.arriveTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='0'"
                        label="到达阿腾科里"
                        prop="arriveTwoTime">
            <el-input v-model.trim="form.arriveTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='1'"
                        label="到达霍尔果斯"
                        prop="arriveTwoTime">
            <el-input v-model.trim="form.arriveTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='越南'&&this.form.classEastAndWest=='0'"
                        label="到达河内"
                        prop="arriveTwoTime">
            <el-input v-model.trim="form.arriveTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'||(this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='1')">
          <el-form-item label="停留时间2"
                        prop="twoStayDay">
            <el-input v-model.trim="form.twoStayDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="驶离多斯特克"
                        prop="departTwoTime">
            <el-input v-model.trim="form.departTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河')&&this.form.classEastAndWest=='1'"
                        label="驶离布列斯特"
                        prop="departTwoTime">
            <el-input v-model.trim="form.departTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='0'"
                        label="驶离扎门乌德"
                        prop="departTwoTime">
            <el-input v-model.trim="form.departTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='0'"
                        label="驶离格罗捷克沃"
                        prop="departTwoTime">
            <el-input v-model.trim="form.departTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='1'"
                        label="驶离霍尔果斯"
                        prop="departTwoTime">
            <el-input v-model.trim="form.departTwoTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="多斯特克-布列斯特"
                        prop="twoThrDay">
            <el-input v-model.trim="form.twoThrDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'&&this.form.classEastAndWest=='1'"
                        label="布列斯特-多斯特克"
                        prop="twoThrDay">
            <el-input v-model.trim="form.twoThrDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='0'"
                        label="扎门乌德-布列斯特"
                        prop="twoThrDay">
            <el-input v-model.trim="form.twoThrDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='1'"
                        label="布列斯特-扎门乌德"
                        prop="twoThrDay">
            <el-input v-model.trim="form.twoThrDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='0'"
                        label="格罗捷克沃-布列斯特"
                        prop="twoThrDay">
            <el-input v-model.trim="form.twoThrDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='1'"
                        label="布列斯特-格罗捷克沃"
                        prop="twoThrDay">
            <el-input v-model.trim="form.twoThrDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="到达布列斯特"
                        prop="arriveThrTime">
            <el-input v-model.trim="form.arriveThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'&&this.form.classEastAndWest=='1'"
                        label="到达多斯特克"
                        prop="arriveThrTime">
            <el-input v-model.trim="form.arriveThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='1'"
                        label="到达扎门乌德"
                        prop="arriveThrTime">
            <el-input v-model.trim="form.arriveThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='1'"
                        label="到达格罗捷克沃"
                        prop="arriveThrTime">
            <el-input v-model.trim="form.arriveThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'">
          <el-form-item label="停留时间3"
                        prop="thrStayDay">
            <el-input v-model.trim="form.thrStayDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="驶离布列斯特"
                        prop="departThrTime">
            <el-input v-model.trim="form.departThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'&&this.form.classEastAndWest=='1'"
                        label="驶离多斯特克"
                        prop="departThrTime">
            <el-input v-model.trim="form.departThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='1'"
                        label="驶离扎门乌德"
                        prop="departThrTime">
            <el-input v-model.trim="form.departThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='1'"
                        label="驶离格罗捷克沃"
                        prop="departThrTime">
            <el-input v-model.trim="form.departThrTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="布列斯特-马拉"
                        prop="thrFouDay">
            <el-input v-model.trim="form.thrFouDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'&&this.form.classEastAndWest=='1'"
                        label="多斯特克-山口"
                        prop="thrFouDay">
            <el-input v-model.trim="form.thrFouDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'&&this.form.classEastAndWest=='1'"
                        label="扎门乌德-二连"
                        prop="thrFouDay">
            <el-input v-model.trim="form.thrFouDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='1'"
                        label="格罗捷克沃-绥芬河"
                        prop="thrFouDay">
            <el-input v-model.trim="form.thrFouDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="到达马拉"
                        prop="arriveFouTime">
            <el-input v-model.trim="form.arriveFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'&&this.form.classEastAndWest=='1'"
                        label="到达山口"
                        prop="arriveFouTime">
            <el-input v-model.trim="form.arriveFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='1'"
                        label="到达二连"
                        prop="arriveFouTime">
            <el-input v-model.trim="form.arriveFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='1'"
                        label="到达绥芬河"
                        prop="arriveFouTime">
            <el-input v-model.trim="form.arriveFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'">
          <el-form-item label="停留时间4"
                        prop="fouStayDay">
            <el-input v-model.trim="form.fouStayDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="驶离马拉"
                        prop="departFouTime">
            <el-input v-model.trim="form.departFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-山口'&&this.form.classEastAndWest=='1'"
                        label="驶离山口"
                        prop="departFouTime">
            <el-input v-model.trim="form.departFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-二连'&&this.form.classEastAndWest=='1'"
                        label="驶离二连"
                        prop="departFouTime">
            <el-input v-model.trim="form.departFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑欧班列-绥芬河'&&this.form.classEastAndWest=='1'"
                        label="驶离绥芬河"
                        prop="departFouTime">
            <el-input v-model.trim="form.departFouTime"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉')&&this.form.classEastAndWest=='0'"
                        label="马拉-目的站"
                        prop="lastDestinationDate">
            <el-input v-model.trim="form.lastDestinationDate"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河')&&this.form.classEastAndWest=='0'"
                        label="汉堡"
                        prop="destinationTime">
            <el-date-picker v-model.trim="form.destinationTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="this.form.classBlockTrain=='郑州-山口-马拉'&&this.form.classEastAndWest=='0'"
                        label="马拉"
                        prop="destinationTime">
            <el-date-picker v-model.trim="form.destinationTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='中亚班列')&&this.form.classEastAndWest=='1'"
                        label="到达郑州圃田"
                        prop="destinationTime">
            <el-date-picker v-model.trim="form.destinationTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width:200px;"
                            placeholder="">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'">
          <el-form-item label="换装地"
                        prop="changePlace">
            <el-select v-model.trim="form.changePlace"
                       clearable
                       style="width:200px;"
                       placeholder="请选择">
              <el-option v-for="item in changePlaceOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='中亚班列'&&this.form.classEastAndWest=='0'">
          <el-form-item label="换装日期"
                        prop="changeDate">
            <el-input v-model.trim="form.changeDate"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item label="往返"
                        prop="classEastAndWest">
            <el-select v-model.trim="form.classEastAndWest"
                       clearable
                       style="width:200px;"
                       placeholder="请选择">
              <el-option v-for="item in wfOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'||this.form.classBlockTrain=='中亚班列'||this.form.classBlockTrain=='中越'">
          <el-form-item label="境内运行时间"
                        prop="territoryDay">
            <el-input v-model.trim="form.territoryDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template v-if="(this.form.classBlockTrain=='郑欧班列-山口'||this.form.classBlockTrain=='郑欧班列-二连'||this.form.classBlockTrain=='郑欧班列-绥芬河'||this.form.classBlockTrain=='郑州-山口-马拉'||(this.form.classBlockTrain=='中亚班列'||this.form.classBlockTrain=='中越')&&this.form.classEastAndWest=='1')">
          <el-form-item label="全程运行时间"
                        prop="totalDay">
            <el-input v-model.trim="form.totalDay"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
        <template>
          <el-form-item label="延迟原因"
                        prop="delayReason">
            <el-input v-model.trim="form.delayReason"
                      placeholder=""
                      style="width:200px;" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCensus, getSite, delSite, addSite, updateSite, exportCensus, exportCensusT } from "@/api/yunFu/census";

export default {
  name: 'Census',
  data () {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.queryParams.endTime;
          if (endDateVal) {
            return (time.getTime() > new Date(endDateVal).getTime() - 1 * 24 * 60 * 60 * 1000);
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.queryParams.startTime;
          if (beginDateVal) {
            return (time.getTime() < new Date(beginDateVal).getTime());
            // - 1 * 24 * 60 * 60 * 1000
          }
        }
      },
      lineOptions: [
        {
          value: '0',
          label: '中欧'
        },
        {
          value: '2',
          label: '中亚'
        }, {
          value: '3',
          label: '中越'
        }, {
          value: '4',
          label: '中俄'
        }
      ],
      ceOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      cbOptions: [
        {
          value: '郑欧班列-山口',
          label: '郑欧班列-山口'
        },
        {
          value: '郑欧班列-二连',
          label: '郑欧班列-二连'
        },
        {
          value: '郑欧班列-绥芬河',
          label: '郑欧班列-绥芬河'
        },
        {
          value: '郑欧班列-霍尔果斯',
          label: '郑欧班列-霍尔果斯'
        },
        {
          value: '郑州-山口-马拉',
          label: '郑州-山口-马拉'
        },
        {
          value: '中亚班列',
          label: '中亚班列'
        },
        {
          value: '越南',
          label: '越南'
        }
      ],
      ltRadio: [
        {
          value: '0',
          label: '中欧'
        },
        {
          value: '2',
          label: '中亚'
        }, {
          value: '3',
          label: '中越'
        }, {
          value: '4',
          label: '中俄'
        }
      ],
      changePlaceOptions: [
        {
          value: '布列斯特',
          label: '布列斯特'
        },
        {
          value: '马拉',
          label: '马拉'
        }
      ],
      wfOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      tyOptions: [],
      tZOptions: [],
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
      // 城市站点表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lineTypeId: undefined,
        classBlockTrain: undefined,
        classEastAndWest: undefined,
        startTime: undefined,
        endTime: undefined,
        classStationofdestinationName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "城市代码不能为空", trigger: "blur" }
        ], nameCn: [
          { required: true, message: "城市中文名不能为空", trigger: "blur" }
        ], nameEn: [
          { required: true, message: "城市英文名不能为空", trigger: "blur" }
        ],      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询城市站点列表 */
    getList () {
      this.loading = true;
      listCensus(this.queryParams).then(response => {
        this.siteList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: '',
        /** 班列id */
        classId: '',
        /** 图定发车时间 */
        planRunTime: '',
        /** 实际发车时间 */
        actualRunTime: '',
        /** 国内运行天数
        private String domesticDay;
        /** 到达第一个地点时间 */
        arriveOneTime: '',
        /** 第一个地点停留天数 */
        oneStayDay: '',
        /** 离开第一个地点时间 */
        departOneTime: '',
        /** 第一个地点到第二个地点天数 */
        oneTwoDay: '',
        /** 到达第二个地点时间 */
        arriveTwoTime: '',
        /** 第二个地点停留天数 */
        twoStayDay: '',
        /** 离开第二个地点时间 */
        departTwoTime: '',
        /** 第二个地点到第三个地点天数 */
        twoThrDay: '',
        /** 到达第三个地点时间 */
        arriveThrTime: '',
        /** 第三个地点停留天数 */
        thrStayDay: '',
        /** 离开第三个地点时间 */
        departThrTime: '',
        /** 第三个地点到第四个地点天数 */
        thrFouDay: '',
        /** 到达第四个地点时间 */
        arriveFouTime: '',
        /** 第四个地点停留天数 */
        fouStayDay: '',
        /** 离开第四个地点时间 */
        departFouTime: '',
        /** 最后一个地点到目的地天数（去） //（回）始发站到第一个站点天数 */
        lastDestinationDate: '',
        /** 到达目的地时间 */
        destinationTime: '',
        /** 换装地 */
        changePlace: '',
        /** 境内运行天数 */
        territoryDay: '',
        /** 全程运行天数 */
        totalDay: '',
        /** 是否已编辑null未编辑1已编辑 */
        isEdit: '',
        /** 延迟原因 */
        delayReason: '',
        /** 换装日期 */
        changeDate: '',
        /** 班列日期*/
        classDate: '',
        /** 出/入境口岸*/
        port: '',
        /** 往返，去0 回1*/
        classEastAndWest: ''
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按 钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加城市站点";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const arr = {}
      arr.classBh = row.classBh;
      arr.classBlockTrain = row.classBlockTrain;
      arr.classETime = row.classETime;
      arr.classEastAndWest = row.classEastAndWest;
      arr.classId = row.classId;
      arr.classNum = row.classNum;
      arr.classSTime = row.classSTime;
      arr.classStationofdestinationName = row.classStationofdestinationName;
      arr.endNameEn = row.endNameEn;
      arr.endTime = row.endTime;
      if (!row.isEdit) {
        arr.isEdit = '0';
      } else {
        arr.isEdit = row.isEdit;
      }
      arr.lineTypeId = row.lineTypeId;
      arr.startStation = row.startStation;
      arr.startTime = row.startTime;
      getSite(arr).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改运行时间统计";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.isEdit == '1') {
            updateSite(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSite(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除城市站点编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delSite(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      if (this.queryParams.classEastAndWest == "" || this.queryParams.classEastAndWest == undefined) {
        this.$message({
          message: '请先选择往返',
          type: 'warning'
        });
      } else if (this.queryParams.classBlockTrain == "" || this.queryParams.classBlockTrain == undefined) {
        this.$message({
          message: '请先选择开行班列',
          type: 'warning'
        });
      } else {
        var queryP = {};
        queryP = this.queryParams
        this.$confirm('是否确认导出?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportCensus(queryP);
        }).then(response => {
          this.download(response.msg);
        }).catch(function () { });
      }
    },
    /** 导出按 钮操作 */
    handleExport1 () {
      var queryPa = this.queryParams
      this.$confirm('是否确认导出?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportCensusT(queryPa);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>