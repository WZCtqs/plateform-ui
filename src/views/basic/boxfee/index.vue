<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="箱子类型" prop="boxType">
        <el-select
          v-model.trim="queryParams.boxType"
          clearable
          style="width:100px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in boxOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提/还箱地点中文" prop="address">
        <el-input
          v-model.trim="queryParams.address"
          placeholder=""
          clearable
          style="width: 100px"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提/还箱地点英文" prop="addressEn">
        <el-input
          v-model.trim="queryParams.addressEn"
          placeholder=""
          clearable
          style="width: 100px"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱型" prop="containerType">
        <el-input
          v-model.trim="queryParams.containerType"
          placeholder=""
          clearable
          style="width: 100px"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="有效日期" prop="startTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 140px"
          v-model.trim="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          placeholder="选择开始时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 140px"
          v-model.trim="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          placeholder="选择截止时间"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:boxfee:add']"
          >新增</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:boxfee:remove']"
          >删除</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handledownloadpt"
          v-hasPermi="['basic:boxfee:downloadpt']"
          >下载普通箱模板</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handledownloadth"
          v-hasPermi="['basic:boxfee:downloadth']"
          >下载特种箱模板</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportP"
          v-hasPermi="['basic:boxfee:importp']"
          >普通箱导入</el-button
        >
        <input
          type="file"
          @change="getFileP($event)"
          style="display:none"
          ref="menuFile"
        />
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportT"
          v-hasPermi="['basic:boxfee:importt']"
          >特种箱导入</el-button
        >
        <input
          type="file"
          @change="getFileT($event)"
          style="display:none"
          ref="excelFile"
        />
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="boxfeeList"
      ref="multipleTable"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="集装箱类型" align="center" prop="boxType">
        <template slot-scope="scope">
          <span v-if="scope.row.boxType == 0">普通箱</span>
          <span v-else-if="scope.row.boxType == 1">特种箱</span>
        </template>
      </el-table-column>
      <el-table-column label="地点类型" align="center" prop="addressType">
        <template slot-scope="scope">
          <span v-if="scope.row.addressType == 0">提箱</span>
          <span v-else>还箱</span>
        </template>
      </el-table-column>
      <el-table-column label="地点中文" align="center" prop="address" />
      <el-table-column label="地点英文" align="center" prop="addressEn" />
      <el-table-column label="箱型" align="center" prop="containerType" />
      <el-table-column label="平衡费用" align="center" prop="cost" />
      <el-table-column
        label="有效时间"
        align="center"
        prop="startTime"
        width="180"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.startTime">{{
            parseTime(scope.row.startTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        width="180"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.endTime">{{
            parseTime(scope.row.endTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 0">禁用</span>
          <span v-else>启用</span>
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:boxfee:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:boxfee:remove']"
            >删除</el-button
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

    <!-- 添加或修改提还箱地和费用规则对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="集装箱类型">
          <el-radio-group v-model.trim="form.boxType">
            <el-radio
              v-for="dict in btRadio"
              @change="agreeChange"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择类型">
          <el-radio-group v-model.trim="form.addressType">
            <el-radio
              v-for="dict in adRadio"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="箱型" prop="code">
          <template v-if="form.boxType">
            <el-select
              v-model.trim="form.containerType"
              clearable
              style="width:200px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ctrOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <el-select
              v-model.trim="form.containerType"
              clearable
              disabled
              style="width:200px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ctrOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="线路" prop="lineTypeid">
          <el-checkbox-group v-model.trim="form.lineTypeid">
            <el-checkbox
              v-for="dict in ltRadio"
              :label="dict.value"
              :key="dict.value"
              >{{ dict.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="地点类型" prop="intra">
          <el-radio-group v-model.trim="form.intra">
            <el-radio
              v-for="dict in intraRadio"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提/还箱地点中文" prop="address">
          <el-input
            v-model.trim="form.address"
            style="width: 200px"
            placeholder="请输入提/还箱地点中文"
          />
        </el-form-item>
        <el-form-item label="提/还箱地点英文" prop="addressEn">
          <el-input
            v-model.trim="form.addressEn"
            style="width: 200px"
            placeholder="请输入提/还箱地点英文"
          />
        </el-form-item>
        <el-form-item label="平衡费用" prop="cost">
          <el-input
            v-model.trim="form.cost"
            style="width: 200px"
            placeholder="请输入平衡费用"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model.trim="form.startTime"
            type="date"
            value-format="yyyy-MM-dd 00:00:00"
            placeholder="选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="endTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model.trim="form.endTime"
            type="date"
            value-format="yyyy-MM-dd 00:00:00"
            placeholder="选择截止时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model.trim="form.state">
            <el-radio
              v-for="dict in stRadio"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBoxfee,
  getBoxfee,
  delBoxfee,
  listBoxtype,
  addBoxfee,
  updateBoxfee,
  exportBoxfee,
  downloadptExcel,
  downloadthExcel,
  boxfeeExportP,
  boxfeeExportT
} from "@/api/basic/boxfee";

export default {
  name: "Boxfee",
  data() {
    return {
      boxCn: "",
      boxEn: "",
      boxCode: "",
      boxOptions: [
        {
          value: "0",
          label: "普通箱"
        },
        {
          value: "1",
          label: "特种箱"
        }
      ],
      btRadio: [
        {
          value: "0",
          label: "普通箱"
        },
        {
          value: "1",
          label: "特种箱"
        }
      ],
      adRadio: [
        {
          value: "0",
          label: "提箱"
        },
        {
          value: "1",
          label: "还箱"
        }
      ],
      stRadio: [
        {
          value: "0",
          label: "禁用"
        },
        {
          value: "1",
          label: "启用"
        }
      ],
      intraRadio: [
        {
          value: "0",
          label: "国外"
        },
        {
          value: "1",
          label: "国内"
        }
      ],
      ltRadio: [
        {
          value: "0",
          label: "中欧"
        },
        {
          value: "2",
          label: "中亚"
        },
        {
          value: "3",
          label: "中越"
        },
        {
          value: "4",
          label: "中俄"
        }
      ],
      ctrOptions: [],
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
      // 提还箱地和费用规则表格数据
      boxfeeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        boxType: undefined,
        addressType: undefined,
        address: undefined,
        addressEn: undefined,
        containerType: undefined,
        state: undefined,
        cost: undefined,
        startTime: undefined,
        endTime: undefined,
        createuserid: undefined,
        createusername: undefined,
        createdate: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取箱型信息
    agreeChange() {
      this.form.containerType = "";
      listBoxtype().then(response => {
        this.ctrOptions = response.data[parseInt(this.form.boxType)];
      });
    },
    /** 查询提还箱地和费用规则列表 */
    getList() {
      this.loading = true;
      listBoxfee(this.queryParams)
        .then(response => {
          this.boxfeeList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(() => {
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
        boxId: undefined,
        boxType: undefined,
        addressType: undefined,
        address: undefined,
        addressEn: undefined,
        containerType: undefined,
        state: "1",
        cost: undefined,
        startTime: undefined,
        endTime: undefined,
        createuserid: undefined,
        createusername: undefined,
        createdate: undefined,
        lineTypeid: ""
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
      this.ids = selection.map(item => item.boxId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.lineTypeid = [];
      this.open = true;
      this.title = "添加提还箱地和费用规则";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.ctrOptions = [];
      const boxId = row.boxId || this.ids;
      getBoxfee(boxId).then(response => {
        this.form = response.data;
        //线路
        if (response.data.lineTypeid === null) {
          this.form.lineTypeid = [];
        } else {
          if (response.data.lineTypeid.search(",") != -1) {
            this.form.lineTypeid = response.data.lineTypeid.split(",");
          } else {
            this.form.lineTypeid = response.data.lineTypeid.split("");
          }
        }
        this.open = true;
        this.title = "修改提还箱地和费用规则";
      });
    },
    /** 普通箱提还箱平衡费模板下载 */
    handledownloadpt() {
      downloadptExcel().then(response => {
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
      });
    },
    /** 特种箱提还箱平衡费模板下载 */
    handledownloadth() {
      downloadthExcel().then(response => {
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
          type: "success",
          duration: 2000,
          message: "模板下载成功"
        });
      });
    },
    /** 普通箱提还箱平衡费导入按钮操作 */
    handleImportP() {
      if (this.queryParams.startTime || this.queryParams.endTime) {
        this.$refs.menuFile.value = "";
        this.$refs.menuFile.click();
      } else {
        this.$message({
          message: "请先选择有效时间和结束时间！",
          type: "warning"
        });
      }
    },
    //导入
    getFileP(event) {
      this.upath = event.target.files[0];
      // var zipFormData = new FormData();
      // zipFormData.append("file", this.upath); //file对应传输的文件
      let formData = new FormData();
      formData.append("startTime", this.queryParams.startTime);
      formData.append("endTime", this.queryParams.endTime);
      formData.append("file", this.upath);
      
      boxfeeExportP(formData).then(res => {
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
    /** 特种箱提还箱平衡费导入按钮操作 */
    handleImportT() {
      if (this.queryParams.startTime || this.queryParams.endTime) {
        this.$refs.excelFile.value = "";
        this.$refs.excelFile.click();
      } else {
        this.$message({
          message: "请先选择有效时间和结束时间！",
          type: "warning"
        });
      }
    },
    //导入
    getFileT(event) {
      this.upath = event.target.files[0];
      let formData = new FormData();
      formData.append("startTime", this.queryParams.startTime);
      formData.append("endTime", this.queryParams.endTime);
      formData.append("file", this.upath);
      
      boxfeeExportT(formData).then(res => {
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
    /** 提交按钮 */
    submitForm: function() {
      //线路
      if (this.form.lineTypeid.length == 1) {
        this.form.lineTypeid = this.form.lineTypeid.join("");
      } else {
        this.form.lineTypeid = this.form.lineTypeid.join(",");
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.boxId != undefined) {
            updateBoxfee(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBoxfee(this.form).then(response => {
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
      const boxIds = row.boxId || this.ids;
      this.$confirm("是否确认删除选中的数据的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delBoxfee(boxIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有提还箱地和费用规则数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportBoxfee(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
