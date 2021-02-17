<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="东西向"
                    prop="eastOrWest ">
        <el-select v-model.trim="queryParams.eastOrWest "
                   clearable
                   size="small"
                   style="width:100px;"
                   placeholder="请选择">
          <el-option v-for="item in direcOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线路"
                    prop="lineType">
        <el-select v-model.trim="queryParams.lineType"
                   clearable
                   style="width:100px;"
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
                  style="width:140px;"
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="下货站"
                    prop="orderUnloadSite">
        <el-input v-model.trim="queryParams.orderUnloadSite"
                  placeholder=""
                  clearable
                  style="width:140px;"
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="箱型"
                    prop="containerType">
        <el-input v-model.trim="queryParams.containerType"
                  placeholder=""
                  clearable
                  style="width:140px;"
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="录入时间段"
                    prop="createTime">
        <el-date-picker clearable
                        size="small"
                        style="width: 300px"
                        type="datetimerange"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        v-model.trim="tempTimeS"
                        placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['cost:zgRailWayCost:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['cost:zgRailWayCost:remove']">删除</el-button>
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['basic:zgdivision:export']">下载模板</el-button>
        <el-button type="primary"
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport"
                   v-hasPermi="['basic:zgdivision:import']">导入</el-button>
        <input type="file"
               @change="getFile($event)"
               style="display:none"
               ref="menuFile" />
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="zgdivisionList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="线路"
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
      <el-table-column label="箱型"
                       align="center"
                       prop="containerType" />
      <el-table-column label="箱型值"
                       align="center"
                       prop="containerTypeValue" />
      <el-table-column label="0是货主自备箱SOC，1是承运人自备箱COC"
                       align="center"
                       prop="isContainer">
        <template slot-scope="scope">
          <span v-if="scope.row.isContainer == 0">SOC</span>
          <span v-if="scope.row.isContainer == 1">COC</span>
        </template>
      </el-table-column>
      <el-table-column label="价格(USD/RMB/箱)"
                       align="center"
                       prop="railCost" />
      <el-table-column label="录入时间"
                       align="center"
                       prop="createTime"
                       width="160" />
      <el-table-column label="有效开始日期"
                       align="center"
                       prop="validStartDate">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validStartDate) }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="有效结束日期"
                       align="center"
                       prop="validEndDate">
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
                     v-hasPermi="['cost:zgRailWayCost:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['cost:zgRailWayCost:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改整柜铁路运费对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="120px">
        <el-form-item label="线路">
          <el-radio-group v-model.trim="form.lineType">
            <el-radio v-for="dict in ltRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上货站"
                      prop="orderUploadSite">
          <el-input v-model.trim="form.orderUploadSite"
                    placeholder="请输入上货站点" />
        </el-form-item>
        <el-form-item label="下货站"
                      prop="orderUnloadSite">
          <el-input v-model.trim="form.orderUnloadSite"
                    placeholder="请输入下货站点" />
        </el-form-item>
        <el-form-item label="箱子类型"
                      prop="containerType">
          <el-select v-model.trim="form.containerType"
          @change="changeFn1()"
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
          <el-select v-if="form.containerType === '普箱'" v-model.trim="form.containerTypeValue"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in contatpOptions"
                       v-show="item.type === '普箱'"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>

          <el-select v-else-if="form.containerType === '特种箱'" v-model.trim="form.containerTypeValue"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in contatpOptions"
                       v-show="item.type === '特种箱'"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="soc/coc"
                      prop="isContainer">
          <el-radio-group v-model.trim="form.isContainer">
            <el-radio v-for="dict in icRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格(USD/箱)"
                      prop="railCost">
          <el-input v-model.trim="form.railCost"
                    placeholder="请输入铁路运费" />
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
import { listZgdivision, getZgdivision, delZgdivision, addZgdivision, updateZgdivision, downLoadExcel, importZgdivision } from "@/api/basic/zgdivision";

export default {
  name: 'Zgdivision',
  data() {
    return {
      //录入时间段
      tempTimeS: '',
      apiStr: null,
      direcOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],

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
      contatpOptions: [
        {
          label: "20尺普箱",
          value: "20GP",
          type:'普箱'
        }, 
        {
          label: "20尺高箱",
          value: "20HC",
          type:'普箱'
        },
        {
          label: "40尺普箱",
          value: "40GP",
          type:'普箱'
        },
         {
          label: "40尺高箱",
          value: "40HC",
          type:'普箱'
        },
        {
          label: "40尺冷藏箱",
          value: "40RF",
          type:'特种箱'
        },
        {
          label: "45尺高箱",
          value: "45HC",
          type:'普箱'
        },
        {
          label: "45尺冷藏箱",
          value: "45RF",
          type:'特种箱'
        },
        {
          label: "20尺超高开顶箱",
          value: "20HOT",
          type:'特种箱'
        },
        {
          label: "20尺普高开顶箱",
          value: "20OT",
          type:'特种箱'
        },
        {
          label: "40尺超高开顶箱",
          value: "40HOT",
          type:'特种箱'
        },
        {
          label: "40尺普高开顶箱",
          value: "40OT",
          type:'特种箱'
        },{
          label: "20尺挂衣箱",
          value: "20HT",
          type:'特种箱'
        },
        {
          label: "40尺挂衣箱",
          value: "40HT",
          type:'特种箱'
        },
        {
          label: "40尺分层箱",
          value: "40MT",
          type:'特种箱'
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
      icRadio: [
        {
          value: '0',
          label: 'SOC'
        },
        {
          value: '1',
          label: 'COC'
        }
      ],
      contaOptions: [
        {
          value: '普箱',
          label: '普箱'
        },
        {
          value: '特种箱',
          label: '特种箱'
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
      // 整柜铁路运费表格数据
      zgdivisionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eastOrWest: undefined,
        lineType: undefined,
        createStartTime: undefined,
        createEndTime: undefined,
        orderUploadSite: undefined,
        orderUnloadSite: undefined,
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
    this.apiStr = process.env.VUE_APP_BASE_API;
  },
  methods: {

    /** 查询整柜铁路运费列表 */
    getList() {
      this.loading = true;
      if (this.tempTimeS.length) {
        this.queryParams.createStartTime = this.tempTimeS[0]
        this.queryParams.createEndTime = this.tempTimeS[1]
      }
      listZgdivision(this.queryParams).then(response => {
        this.zgdivisionList = response.rows;
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
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        lineType: undefined,
        orderUploadSite: undefined,
        orderUnloadSite: undefined,
        containerType: undefined,
        containerTypeValue: undefined,
        isContainer: undefined,
        railCost: undefined,
        isConsolidation: undefined,
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
      this.title = "添加整柜铁路运费";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getZgdivision(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改整柜铁路运费";
      });
    },
    //判断修改及新增弹框时间判断
    changeEnd() {
      if (this.form.validStartDate >= this.form.validEndDate) {
        this.msgError("有效结束时间不得小于等于有效开始时间");
        this.form.validEndDate = ''
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      //新增编辑页面判断有效结束时间不早于有效开始时间
      if (this.form.validStartDate >= this.form.validEndDate) {
        this.msgError("有效结束时间不得小于等于有效开始时间");
      } else {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateZgdivision(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addZgdivision(this.form).then(response => {
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
        return delZgdivision(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 下载模板按钮操作 */
    handleExport() {
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
      this.$refs.menuFile.value = "";
      this.$refs.menuFile.click();
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0];
      var zipFormData = new FormData();
      zipFormData.append("excelFile", this.upath); //file对应传输的文件
      
      importZgdivision(zipFormData).then(res => {
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
    changeFn1(){
      if(this.form.containerType === '普箱'){
          this.form.containerTypeValue = '20GP'
      }else if(this.form.containerType === '特种箱'){
          this.form.containerTypeValue = '40RF'
      }
    }
  }
};
</script>