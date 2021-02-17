<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="线路类型"
                    prop="lineType">
        <el-select v-model.trim="queryParams.lineType"
                   clearable
                   size="small"
                   placeholder="请选择">
          <el-option v-for="item in lineOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上货站"
                    prop="orderUploadSite">
        <el-input v-model.trim="queryParams.orderUploadSite"
                  placeholder=""
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="下货站"
                    prop="orderUnloadSite">
        <el-input v-model.trim="queryParams.orderUnloadSite"
                  placeholder=""
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="录入时间段"
                    prop="createTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 400px"
                        type="datetimerange"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        v-model.trim="tempTimeS"
                        placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="有效开始日期"
                    prop="validStartDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 200px"
                        v-model.trim="queryParams.validStartDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择有效开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效结束日期"
                    prop="validEndDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 200px"
                        v-model.trim="queryParams.validEndDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择有效结束日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['cost:shRailWayCost:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['cost:shRailWayCost:remove']">删除</el-button>
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['basic:shRailWayCost:export']">导出</el-button>
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleDownload"
                   v-hasPermi="['basic:shdivision:download']">下载模板</el-button>
        <el-button type="primary"
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport"
                   v-hasPermi="['basic:shdivision:import']">导入</el-button>
        <input type="file"
               @change="getFile($event)"
               style="display:none"
               ref="excelFile" />
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="shdivisionList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="线路类型"
                       align="center"
                       prop="lineType">
        <template slot-scope="scope">
          <span v-if="scope.row.lineType == 0">中欧</span>
          <span v-if="scope.row.lineType == 2">中亚</span>
          <span v-if="scope.row.lineType == 3">中越</span>
          <span v-if="scope.row.lineType == 4">中俄</span>
        </template>
      </el-table-column>
      <el-table-column label="上货站"
                       align="center"
                       prop="orderUploadSite" />
      <el-table-column label="下货站"
                       align="center"
                       prop="orderUnloadSite" />
      <el-table-column label="箱子类型"
                       align="center"
                       prop="containerType" />
      <el-table-column label="起运站收费(USD/CBM)或(USD/SET)"
                       align="center"
                       prop="orderUploadSiteCost" />
      <el-table-column label="运费单价(USD/CBM)"
                       align="center"
                       prop="lclFreight" />
      <el-table-column label="拆箱费、基本仓储费(USD/CBM)"
                       align="center"
                       prop="orderUnloadSiteBacost" />
      <el-table-column label="每票固定收费方数临界最小值(CBM)"
                       align="center"
                       prop="minVolume" />
      <el-table-column label="每票固定收费方数临界最大值(CBM)"
                       align="center"
                       prop="maxVolume" />
      <el-table-column label="每票固定收费方数小于等于临界值费用(USD/SET)"
                       align="center"
                       prop="minVolumeCost" />
      <el-table-column label="每票固定收费方数大于临界最大值费用(USD/SET)"
                       align="center"
                       prop="maxVolumeCost" />
      <el-table-column label="每票固定收费方数大于最小值不超过最大值费用(USD/SET)"
                       align="center"
                       prop="middleVolumeCost" />
      <el-table-column label="录入时间"
                       align="center"
                       prop="createTime"
                       width="160" />
      <el-table-column label="有效开始日期"
                       align="center"
                       prop="validStartDate"
                       width="180">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validStartDate) }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="有效结束日期"
                       align="center"
                       prop="validEndDate"
                       width="180">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validEndDate) }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['cost:shRailWayCost:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['cost:shRailWayCost:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改散货铁路运费对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="50%">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="240px">
        <el-form-item label="线路类型">
          <el-radio-group v-model.trim="form.lineType">
            <el-radio v-for="dict in ltRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上货站点"
                      prop="orderUploadSite">
          <el-input v-model.trim="form.orderUploadSite"
                    placeholder="请输入上货站点" />
        </el-form-item>
        <el-form-item label="下货站点"
                      prop="orderUnloadSite">
          <el-input v-model.trim="form.orderUnloadSite"
                    placeholder="请输入下货站点" />
        </el-form-item>
        <el-form-item label="东西向"
                      prop="eastOrWest">
          <el-select v-model.trim="form.eastOrWest"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in directionList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="箱型">
          <el-select v-model.trim="form.containerType"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in contaOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="箱型值"
                      prop="containerTypeValue">
          <el-select v-model.trim="form.containerTypeValue"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in contatpOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起运站收费(USD/CBM)或(USD/SET)"
                      prop="orderUploadSiteCost">
          <el-input v-model.trim="form.orderUploadSiteCost"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="运费(USD/CBM)"
                      prop="lclFreight">
          <el-input v-model.trim="form.lclFreight"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="拆箱费、基本仓储费(USD/CBM)"
                      prop="orderUnloadSiteBacost">
          <el-input v-model.trim="form.orderUnloadSiteBacost"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="每票固定收费方数临界最小值(CBM)"
                      prop="minVolume">
          <el-input v-model.trim="form.minVolume"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="每票固定收费方数临界最大值(CBM)"
                      prop="maxVolume">
          <el-input v-model.trim="form.maxVolume"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="每票固定收费方数小于等于临界值费用(USD/SET)"
                      prop="minVolumeCost">
          <el-input v-model.trim="form.minVolumeCost"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="每票固定收费方数大于最小值不超过最大值费用(USD/SET)"
                      prop="middleVolumeCost">
          <el-input v-model.trim="form.middleVolumeCost"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="每票固定收费方数大于临界最大值费用(USD/SET)"
                      prop="maxVolumeCost">
          <el-input v-model.trim="form.maxVolumeCost"
                    placeholder="" />
        </el-form-item>
        <el-form-item label="有效开始日期"
                      prop="validStartDate">
          <el-date-picker clearable
                          size="small"
                          style="width: 200px"
                          v-model.trim="form.validStartDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择有效开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效结束日期"
                      prop="validEndDate">
          <el-date-picker clearable
                          size="small"
                          style="width: 200px"
                          v-model.trim="form.validEndDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择有效结束日期"
                          @change="changeEnd">
          </el-date-picker>
        </el-form-item>
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
import { listShdivision, getShdivision, delShdivision, addShdivision, updateShdivision, exportShdivision, importShRailWayCost, downLoadExcel } from "@/api/basic/shdivision";

export default {
  name: 'Shdivision',
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
        }, {
          value: '3',
          label: '中越'
        }, {
          value: '4',
          label: '中俄'
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
      contaOptions: [
        {
          value: '普箱',
          label: '普箱'
        },

      ],
      contatpOptions: [
        {
          label: "20尺普箱",
          value: "20GP"
        },
        {
          label: "20尺高箱",
          value: "20HC"
        },
        {
          label: "40尺普箱",
          value: "40GP"
        },
        {
          label: "40尺高箱",
          value: "40HC"
        },
        {
          label: "45尺普箱",
          value: "45GP"
        },
      ],
      directionList: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      //录入时间段
      tempTimeS: '',
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
      // 散货铁路运费表格数据
      shdivisionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lineType: undefined,
        createStartTime: undefined,
        createEndTime: undefined,
        orderUploadSite: undefined,
        orderUnloadSite: undefined,
        containerType: undefined,
        containerTypeValue: undefined,
        orderUploadSiteCost: undefined,
        lclFreight: undefined,
        orderUnloadSiteBacost: undefined,
        minVolume: undefined,
        maxVolume: undefined,
        minVolumeCost: undefined,
        middleVolumeCost: undefined,
        maxVolumeCost: undefined,
        validStartDate: undefined,
        validEndDate: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询散货铁路运费列表 */
    getList() {
      this.loading = true;
      if (this.tempTimeS) {
        this.queryParams.createStartTime = this.tempTimeS[0]
        this.queryParams.createEndTime = this.tempTimeS[1]
      } else {
        this.queryParams.createStartTime = ''
        this.queryParams.createEndTime = ''
      }
      listShdivision(this.queryParams).then(response => {
        this.shdivisionList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(() => {
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
      this.form = {
        id: undefined,
        lineType: undefined,
        orderUploadSite: undefined,
        orderUnloadSite: undefined,
        containerType: undefined,
        containerTypeValue: undefined,
        orderUploadSiteCost: undefined,
        lclFreight: undefined,
        orderUnloadSiteBacost: undefined,
        minVolume: undefined,
        maxVolume: undefined,
        minVolumeCost: undefined,
        middleVolumeCost: undefined,
        maxVolumeCost: undefined,
        validStartDate: undefined,
        validEndDate: undefined
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加散货铁路运费";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getShdivision(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改散货铁路运费";
      });
    },
    /** 下载模板按钮操作 */
    handleDownload() {
      downLoadExcel().then(response => {
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
        downloadElement.download = nowDate + "-模板.xlsx"; // xxx.xls/xxx.xlsx
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
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.excelFile.value = "";
      this.$refs.excelFile.click();
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0];
      var zipFormData = new FormData();
      zipFormData.append("excelFile", this.upath); //file对应传输的文件
      
      importShRailWayCost(zipFormData).then(res => {
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
            duration: 10000
          });
        }
      });
    },
    //判断修改及新增弹框时间判断
    changeEnd() {
      if (this.form.validStartDate >= this.form.validEndDate) {
        this.msgError("有效结束时间不能小于等于有效开始时间，请重新选择");
        this.form.validEndDate = ''
      }
      // else if (this.form.validStartDate === this.form.validEndDate) {
      //   this.msgError("有效结束时间不能等于有效开始时间，请重新选择");
      //   this.form.validEndDate = ''
      // }
    },
    /** 提交按钮 */
    submitForm: function () {
      //新增编辑页面判断有效结束时间不早于有效开始时间
      if (this.form.validStartDate >= this.form.validEndDate) {
        this.msgError("有效结束时间不能小于等于有效开始时间");
      } else {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateShdivision(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addShdivision(this.form).then(response => {
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
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delShdivision(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有散货铁路运费数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportShdivision(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>