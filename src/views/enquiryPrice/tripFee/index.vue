<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="提货城市"
                    prop="pickUpCity">
        <el-input v-model.trim="queryParams.pickUpCity"
                  placeholder="请输入提货城市"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="集货点"
                    prop="cargoCollectionPoint">
        <el-input v-model.trim="queryParams.cargoCollectionPoint"
                  placeholder="请输入集货点"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="到货城市"
                    prop="arrivalCity">
        <el-input v-model.trim="queryParams.arrivalCity"
                  placeholder="请输入到货城市"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="箱型"
                    prop="containerType">
        <el-select v-model.trim="queryParams.containerType"
                   placeholder="请选择箱型"
                   clearable
                   size="small">
          <el-option v-for="item in containerOptions"
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
      </el-form-item>
    </el-form>

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['enquiry:tripFee:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['enquiry:tripFee:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['enquiry:tripFee:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleDownload"
                   v-hasPermi="['enquiry:tripFee:download']">下载模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport"
                   v-hasPermi="['enquiry:tripFee:import']">导入</el-button>
        <input type="file"
               @change="getFile($event)"
               style="display:none"
               ref="menuFile" />
      </el-col>
    </el-row>

    <el-table v-loading="loading"
              :data="tripFeeList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="提货城市"
                       align="center"
                       prop="pickUpCity" />
      <el-table-column label="集货点"
                       align="center"
                       prop="cargoCollectionPoint" />
      <el-table-column label="集货点距离(km)"
                       align="center"
                       prop="distance" />
      <el-table-column label="标准化提货费"
                       align="center"
                       prop="bzhPickUpCharge" />
      <el-table-column label="单位"
                       align="center"
                       prop="pickUnit" />
      <!-- <el-table-column label="到货城市"
                       align="center"
                       prop="arrivalCity" /> -->
      <el-table-column label="箱型"
                       align="center"
                       prop="containerType" />
      
      <el-table-column label="录入时间"
                       align="center"
                       prop="createTime"
                       width="160" />
      <el-table-column label="有效开始日期"
                       align="center"
                       prop="validStartDate">
      </el-table-column>
      <el-table-column label="有效结束日期"
                       align="center"
                       prop="validEndDate">
      </el-table-column>
      
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['enquiry:tripFee:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['enquiry:tripFee:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改郑欧线整柜去程费用对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="600px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="120px">
        <el-form-item label="提货城市"
                      prop="pickUpCity">
          <el-input v-model.trim="form.pickUpCity"
                    placeholder="请输入提货城市" />
        </el-form-item>
        <el-form-item label="集货点"
                      prop="cargoCollectionPoint">
          <el-input v-model.trim="form.cargoCollectionPoint"
                    placeholder="请输入集货点" />
        </el-form-item>
        <el-form-item label="集货点距离(km)"
                      prop="distance">
          <el-input v-model.trim="form.distance"
                    placeholder="请输入集货点" />
        </el-form-item>
        <el-form-item label="标准化提货费"
                      prop="bzhPickUpCharge">
          <el-input v-model.trim="form.bzhPickUpCharge"
                    placeholder="请输入标准化提货费" />
        </el-form-item>
        <el-form-item label="单位"
                      prop="pickUnit">
          <el-select v-model.trim="form.pickUnit"
                     placeholder="请选择单位">
            <el-option v-for="item in unitOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="到货城市"
                      prop="arrivalCity">
          <el-input v-model.trim="form.arrivalCity"
                    placeholder="请输入到货城市" /> -->
        </el-form-item>
        <el-form-item label="箱型">
          <el-select v-model.trim="form.containerType"
                     placeholder="请选择箱型">
            <el-option v-for="item in cleOptions"
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
import { listTripFee, getTripFee, delTripFee, addTripFee, updateTripFee, exportTripFee, downLoadExcel, importZgdivision } from "@/api/enquiryPrice/tripFee";

export default {
  name: 'TripFee',
  data() {
    return {
      //箱型
      containerOptions: [
        {
          value: '20GP',
          label: '20GP'
        },
        {
          value: '20HC',
          label: '20HC'
        },
        {
          value: '20HOT',
          label: '20HOT'
        },
        {
          value: '20HT',
          label: '20HT'
        },
        {
          value: '20OT',
          label: '20OT'
        },
        {
          value: '40GP',
          label: '40GP'
        },
        {
          value: '40HC',
          label: '40HC'
        },
        {
          value: '40HOT',
          label: '40HOT'
        },
        {
          value: '40HT',
          label: '40HT'
        },
        {
          value: '40MT',
          label: '40MT'
        },
        {
          value: '40OT',
          label: '40OT'
        },
        {
          value: '40RF',
          label: '40RF'
        },
        {
          value: '45HC',
          label: '45HC'
        },
        {
          value: '45RF',
          label: '45RF'
        }
      ],
      cleOptions: [
        {
          value: '20GP',
          label: '20GP'
        },
        {
          value: '20HC',
          label: '20HC'
        },
        {
          value: '20HOT',
          label: '20HOT'
        },
        {
          value: '20HT',
          label: '20HT'
        },
        {
          value: '20OT',
          label: '20OT'
        },
        {
          value: '40GP',
          label: '40GP'
        },
        {
          value: '40HC',
          label: '40HC'
        },
        {
          value: '40HOT',
          label: '40HOT'
        },
        {
          value: '40HT',
          label: '40HT'
        },
        {
          value: '40MT',
          label: '40MT'
        },
        {
          value: '40OT',
          label: '40OT'
        },
        {
          value: '40RF',
          label: '40RF'
        },
        {
          value: '45HC',
          label: '45HC'
        },
        {
          value: '45RF',
          label: '45RF'
        }
      ],
      //费用单位
      unitOptions: [
        {
          value: '￥',
          label: '￥'
        },
        {
          value: '€',
          label: '€'
        },
        {
          value: '$',
          label: '$'
        },
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
      // 郑欧线整柜去程费用表格数据
      tripFeeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pickUpCity: undefined,
        cargoCollectionPoint: undefined,
        distance: undefined,
        bzhPickUpCharge: undefined,
        pickUnit: undefined,
        arrivalCity: undefined,
        containerType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         validStartDate: [
          {
            required: true,
            message: "请输入有效开始日期",
            trigger: "blur"
          }
        ],
         validEndDate: [
          {
            required: true,
            message: "请输入有效结束日期",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询郑欧线整柜去程费用列表 */
    getList() {
      this.loading = true;
      listTripFee(this.queryParams).then(response => {
        this.tripFeeList = response.rows;
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
        pickUpCity: undefined,
        cargoCollectionPoint: undefined,
        distance: undefined,
        bzhPickUpCharge: undefined,
        pickUnit: undefined,
        arrivalCity: undefined,
        containerType: undefined,
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
      this.title = "添加郑欧线整柜去程费用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTripFee(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改郑欧线整柜去程费用";
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
            updateTripFee(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTripFee(this.form).then(response => {
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
        return delTripFee(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
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
            duration: 2000
          });
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有郑欧线整柜去程费用数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportTripFee(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>