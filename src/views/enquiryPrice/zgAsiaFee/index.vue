<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="提货城市" prop="pickUpCity">
        <el-input
          v-model.trim="queryParams.pickUpCity"
          placeholder="请输入提货城市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="集货地" prop="cargoCollectionPoint">
        <el-input
          v-model.trim="queryParams.cargoCollectionPoint"
          placeholder="请输入集货地"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线路" prop="lineType">
        <el-select v-model.trim="queryParams.lineType" placeholder="请选择线路" clearable size="small">
          <el-option label="郑亚" value="郑亚" />
          <el-option label="郑越" value="郑越" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['enquiry:zgAsiaFee:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['enquiry:zgAsiaFee:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['enquiry:zgAsiaFee:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['enquiry:zgAsiaFee:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport0"
          v-hasPermi="['enquiry:zgAsiaFee:download']"
        >下载模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          @click="handleImport"
          v-hasPermi="['enquiry:zgAsiaFee:importExcel']"
        >导入</el-button>
        <input
          type="file"
          @change="getFile($event)"
          style="display:none"
          ref="menuFile"
        />
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="zgAsiaFeeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="提货城市" align="center" prop="pickUpCity" />
      <el-table-column label="集货地" align="center" prop="cargoCollectionPoint" />
      <el-table-column label="距离" align="center" prop="distance" />
      <el-table-column label="提货费" align="center" prop="pickGoodsFee" />
      <el-table-column label="客户端显示" align="center" prop="pickGoodsShowFee" />
      <el-table-column label="单位" align="center" prop="pickUnit" />
      <el-table-column label="箱型" align="center" prop="containerType" />
      <el-table-column label="有效开始时间" align="center" prop="validStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validStartDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效结束时间" align="center" prop="validEndDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validEndDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线路" align="center" prop="lineType" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['enquiry:zgAsiaFee:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['enquiry:zgAsiaFee:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改郑亚、郑越去程整柜提货费对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="线路" prop="lineType">
              <el-radio v-model.trim="form.lineType" label="郑亚">郑亚</el-radio>
              <el-radio v-model.trim="form.lineType" label="郑越">郑越</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提货城市" prop="pickUpCity">
              <el-input v-model.trim="form.pickUpCity" placeholder="请输入提货城市" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集货地" prop="cargoCollectionPoint">
              <el-input v-model.trim="form.cargoCollectionPoint" placeholder="请输入集货地" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="距离" prop="distance">
              <el-input v-model.trim="form.distance" placeholder="请输入距离" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提货费" prop="pickGoodsFee">
              <el-input v-model.trim="form.pickGoodsFee" placeholder="请输入提货费" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="单位" prop="pickUnit">
              <el-select v-model.trim="form.pickUnit" placeholder="请选择单位">
                <el-option label="$" value="$" />
                <el-option label="￥" value="￥" />
                <el-option label="€" value="€" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="箱型" label-width="60px" prop="containerType" >
              <el-select v-model.trim="form.containerType" placeholder="请选择箱型">
                <!-- <el-option label="请选择" value="" /> -->
                <el-option label="40HC" value="40HC" />
                <el-option label="40GP" value="40GP" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="显示提货费" prop="pickGoodsShowFee">
              <el-input v-model.trim="form.pickGoodsShowFee" placeholder="请输入显示提货费" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="有效开始时间" prop="validStartDate">
              <el-date-picker clearable size="small" style="width: 200px"
                              v-model.trim="form.validStartDate"
                              type="date"
                              :picker-options="startTimePicker"
                              value-format="yyyy-MM-dd"
                              placeholder="选择有效开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="有效结束时间" prop="validEndDate">
              <el-date-picker clearable size="small" style="width: 200px"
                              v-model.trim="form.validEndDate"
                              :picker-options="endTimePicker"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择有效结束时间"
                              @change="changeEnd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listZgAsiaFee, getZgAsiaFee, delZgAsiaFee, addZgAsiaFee, updateZgAsiaFee, exportZgAsiaFee, importObj,downloadMessage } from "@/api/enquiryPrice/zgAsiaFee";

export default {
  data() {
    return {
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
      // 郑亚、郑越去程整柜提货费表格数据
      zgAsiaFeeList: [],
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
        pickGoodsFee: undefined,
        pickGoodsShowFee: undefined,
        pickUnit: undefined,
        containerType: undefined,
        validStartDate: undefined,
        validEndDate: undefined,
        lineType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        lineType:[
          {
            required: true,
            message: "*必选项",
            trigger: "blur"
          }
        ],
        pickUpCity:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        cargoCollectionPoint:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        distance:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        pickGoodsFee:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        pickUnit:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        containerType:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        pickGoodsShowFee:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        pickGoodsShowFee:[
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
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
    /** 查询郑亚、郑越去程整柜提货费列表 */
    getList() {
      this.loading = true;
      listZgAsiaFee(this.queryParams).then(response => {
        this.zgAsiaFeeList = response.rows;
        this.total = response.total;
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
        pickGoodsFee: undefined,
        pickGoodsShowFee: undefined,
        pickUnit: undefined,
        containerType: undefined,
        validStartDate: undefined,
        validEndDate: undefined,
        createTime: undefined,
        lineType: undefined
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加郑亚、郑越去程整柜提货费";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getZgAsiaFee(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改郑亚、郑越去程整柜提货费";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateZgAsiaFee(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addZgAsiaFee(this.form).then(response => {
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
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除郑亚、郑越去程整柜提货费编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delZgAsiaFee(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有郑亚、郑越去程整柜提货费数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportZgAsiaFee(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //下载模板
    handleExport0() {
      const type = 0;

      downloadMessage(type).then(response => {
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
        downloadElement.download = nowDate + "-郑亚越导入模板.xlsx"; // xxx.xls/xxx.xlsx
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
    //导入
    handleImport() {
      this.$refs.menuFile.value = "";
      this.$refs.menuFile.click();
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0];
      var zipFormData = new FormData();
      zipFormData.append("file", this.upath); //file对应传输的文件

      importObj(zipFormData).then(res => {
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
    }
  }
};
</script>
