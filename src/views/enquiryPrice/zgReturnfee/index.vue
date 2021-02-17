<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="省份"
                    prop="province">
        <el-input v-model.trim="queryParams.province"
                  placeholder="请输入省份"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="还箱地"
                    prop="cityTrainStation">
        <el-input v-model.trim="queryParams.cityTrainStation"
                  placeholder="请输入还箱地"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="货源地"
                    prop="receiptPlace">
        <el-input v-model.trim="queryParams.receiptPlace"
                  placeholder="请输入货源地"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="国内公路运输车辆类型"
                    prop="truckType">
        <el-select v-model.trim="queryParams.truckType"
                   clearable
                   style="width:140px;"
                   placeholder="请选择">
          <el-option v-for="item in transportOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
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
                   v-hasPermi="['enquiry:zgReturnfee:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['enquiry:zgReturnfee:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['enquiry:zgReturnfee:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleDownload"
                   v-hasPermi="['enquiry:zgReturnfee:download']">下载模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-upload2"
                   size="mini"
                   @click="handleImport"
                   v-hasPermi="['enquiry:zgReturnfee:import']">导入</el-button>
        <input type="file"
               @change="getFile($event)"
               style="display:none"
               ref="menuFile" />
      </el-col>
    </el-row>

    <el-table v-loading="loading"
              :data="zgReturnfeeList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="省份"
                       align="center"
                       prop="province" />
      <el-table-column label="还箱地"
                       align="center"
                       prop="cityTrainStation" />
      <!-- <el-table-column label="还箱费($)"
                       align="center"
                       prop="returnBoxAddress" /> -->
      <el-table-column label="距离(km)"
                       align="center"
                       prop="distance" />
      <el-table-column label="送货费($)"
                       align="center"
                       prop="deliveryFee" />
      <el-table-column label="白卡送货费($)"
                       align="center"
                       prop="whiteCardDeliveryFee" />
      <el-table-column label="货源地"
                       align="center"
                       prop="receiptPlace" />
      <!-- <el-table-column label="国内公路运输车辆类型"
                       align="center"
                       prop="truckType">
        <template slot-scope="scope">
          <span v-if="scope.row.truckType==0">普通车</span>
          <span v-else-if="scope.row.truckType==1">普通卡车</span>
          <span v-else-if="scope.row.truckType==2">白卡专车</span>
        </template>
      </el-table-column> -->

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
                     v-hasPermi="['enquiry:zgReturnfee:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['enquiry:zgReturnfee:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改郑欧整柜回程送货费用对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="600px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="160px">
        <el-form-item label="省份"
                      prop="province">
          <el-input v-model.trim="form.province"
                    placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="还箱地"
                      prop="cityTrainStation">
          <el-input v-model.trim="form.cityTrainStation"
                    placeholder="请输入还箱地" />
        </el-form-item>
        <!-- <el-form-item label="还箱费($)"
                      prop="returnBoxAddress">
          <el-input v-model.trim="form.returnBoxAddress"
                    placeholder="请输入还箱费" />
        </el-form-item> -->
        <el-form-item label="距离(km)"
                      prop="distance">
          <el-input v-model.trim="form.distance"
                    placeholder="请输入距离" />
        </el-form-item>
        <el-form-item label="送货费($)"
                      prop="deliveryFee">
          <el-input v-model.trim="form.deliveryFee"
                    placeholder="请输入送货费" />
        </el-form-item>
        <el-form-item label="白卡送货费($)"
                      prop="whiteCardDeliveryFee">
          <el-input v-model.trim="form.whiteCardDeliveryFee"
                    placeholder="请输入白卡送货费" />
        </el-form-item>
        <el-form-item label="货源地"
                      prop="receiptPlace">
          <el-input v-model.trim="form.receiptPlace"
                    placeholder="请输入货源地" />
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
        <!-- <el-form-item label="国内公路运输车辆类型">
          <el-select v-model.trim="form.truckType"
                     clearable
                     style="width:240px;"
                     placeholder="请选择">
            <el-option v-for="item in cleOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>

        </el-form-item> -->
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
import { listZgReturnfee, getZgReturnfee, delZgReturnfee, addZgReturnfee, updateZgReturnfee, exportZgReturnfee, downLoadExcel, importZgdivision } from "@/api/enquiryPrice/zgReturnfee";

export default {
  name: 'ZgReturnfee',
  data() {
    return {
      //国内公路运输车辆类型
      transportOptions: [
        {
          value: '0',
          label: '普通车'
        },
        {
          value: '1',
          label: '普通卡车'
        },
        {
          value: '2',
          label: '白卡专车'
        }
      ],
      cleOptions: [
        {
          value: '0',
          label: '普通车'
        },
        {
          value: '1',
          label: '普通卡车'
        },
        {
          value: '2',
          label: '白卡专车'
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
      // 郑欧整柜回程送货费用表格数据
      zgReturnfeeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        province: undefined,
        cityTrainStation: undefined,
        // returnBoxAddress: undefined,
        distance: undefined,
        deliveryFee: undefined,
        whiteCardDeliveryFee: undefined,
        receiptPlace: undefined,
        // truckType: undefined
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
    /** 查询郑欧整柜回程送货费用列表 */
    getList() {
      this.loading = true;
      listZgReturnfee(this.queryParams).then(response => {
        this.zgReturnfeeList = response.rows;
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
        province: undefined,
        cityTrainStation: undefined,
        // returnBoxAddress: undefined,
        distance: undefined,
        deliveryFee: undefined,
        whiteCardDeliveryFee: undefined,
        receiptPlace: undefined,
        validStartDate: undefined,
        validEndDate: undefined
        // truckType: undefined
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
      this.title = "添加郑欧整柜回程送货费用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getZgReturnfee(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改郑欧整柜回程送货费用";
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
            updateZgReturnfee(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addZgReturnfee(this.form).then(response => {
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
        return delZgReturnfee(ids);
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
      this.$confirm('是否确认导出所有郑欧整柜回程送货费用数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportZgReturnfee(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>