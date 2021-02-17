<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="HS编码" prop="cargoReport">
        <el-input
          v-model.trim="queryParams.cargoReport"
          placeholder="去程筛选6位，回程筛选4位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货物品名" prop="cargoName">
        <el-input
          v-model.trim="queryParams.cargoName"
          placeholder="请输入货物品名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下货站" prop="unloadSite">
        <el-input
          v-model.trim="queryParams.unloadSite"
          placeholder="请输入下货站"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原产国" prop="countryOrigin">
        <el-input
          v-model.trim="queryParams.countryOrigin"
          placeholder="请输入原产国"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="去回程" prop="eastorwest">
        <el-select
          v-model.trim="queryParams.eastorwest"
          clearable
          size="small"
          style="width:150px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in optionsEastWest"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
        v-hasPermi="['order:cargobase:query']"
        >搜索</el-button>
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
          v-hasPermi="['order:cargobase:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['order:cargobase:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order:cargobase:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:cargobase:export']"
        >导出</el-button>
      </el-col>-->
      <el-button
        type="warning"
        icon="el-icon-download"
        size="mini"
        @click="handleDownloadWest"
        v-hasPermi="['order:cargobase:download']"
      >下载-去程导入模板</el-button>
      <el-button
        type="warning"
        icon="el-icon-download"
        size="mini"
        @click="handleDownloadEast"
        v-hasPermi="['order:cargobase:download']"
      >下载-回程导入模板</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleImport"
        v-hasPermi="['order:cargobase:import']"
      >导入<i class="el-icon-upload el-icon--right"></i></el-button>
      <input
        type="file"
        @change="getFileT($event)"
        style="display:none"
        ref="excelFile"
      />
    </el-row>

    <el-table v-loading="loading" :data="cargobaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="税号" align="center" prop="cargoReport" />
      <el-table-column label="货物品名" align="center" prop="cargoName" />
      <el-table-column label="下货站" align="center" prop="unloadSite" />
      <el-table-column label="搜索结果" align="center" prop="searchResult" />
      <el-table-column label="是否可铁路运输" align="center" prop="isRailway" />
      <el-table-column label="原产国" align="center" prop="countryOrigin" />
      <el-table-column label="去回程" align="center" prop="eastorwest" >
          <template slot-scope="scope">
            <span v-if="scope.row.eastorwest==0">去程</span>
            <span v-else>回程</span>
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['order:cargobase:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['order:cargobase:remove']"
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

    <!-- 添加或修改货物知识库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="税号" prop="cargoReport">
          <el-input v-model.trim="form.cargoReport" placeholder="请输入税号" />
        </el-form-item>
        <el-form-item label="货物品名" prop="cargoName">
          <el-input v-model.trim="form.cargoName" placeholder="请输入货物品名" />
        </el-form-item>
        <el-form-item label="下货站" prop="unloadSite">
          <el-input v-model.trim="form.unloadSite" placeholder="请输入下货站" />
        </el-form-item>
        <el-form-item label="搜索结果" prop="searchResult">
          <el-input v-model.trim="form.searchResult" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否可铁路运输" prop="isRailway">
          <el-input v-model.trim="form.isRailway" placeholder="请输入是否可铁路运输" />
        </el-form-item>
        <el-form-item label="原产国" prop="countryOrigin">
          <el-input v-model.trim="form.countryOrigin" placeholder="请输入原产国" />
        </el-form-item>
        <el-form-item label="去回程" prop="eastorwest">
          <el-select
            v-model.trim="form.eastorwest"
            clearable
            size="small"
            style="width:150px;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in optionsEastWest"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
import { listCargobase, getCargobase, delCargobase, addCargobase, updateCargobase, exportCargobase, downloadEast, downloadWest, importExcel} from "@/api/yunFu/cargobase";

export default {
  data() {
    return {
      optionsEastWest:[{
        value: '0',
          label: '去程'
        }, {
          value: '1',
          label: '回程'
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
      // 货物知识库表格数据
      cargobaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cargoReport: undefined,
        cargoName: undefined,
        unloadSite: undefined,
        searchResult: undefined,
        isRailway: undefined,
        countryOrigin: undefined,
        eastorwest: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cargoReport: [
          { required: true, message: '请输入税号', trigger: 'blur' }
        ],
        cargoName: [
          {required: true, message: '请输入货物品名', trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询货物知识库列表 */
    getList() {
      this.loading = true;
      listCargobase(this.queryParams).then(response => {
        this.cargobaseList = response.rows;
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
        cargoReport: undefined,
        cargoName: undefined,
        unloadSite: undefined,
        searchResult: undefined,
        isRailway: undefined,
        countryOrigin: undefined,
        eastorwest: undefined,
        createBy: undefined,
        createTime: undefined
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
      this.title = "添加货物知识库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCargobase(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改货物知识库";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCargobase(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCargobase(this.form).then(response => {
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
      this.$confirm('是否确认删除货物知识库编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCargobase(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有货物知识库数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCargobase(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    handleDownloadWest(){
      downloadWest().then(response => {
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = "货物知识库去程导入模板.xlsx"; // xxx.xls/xxx.xlsx
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
    handleDownloadEast(){
      downloadEast().then(response => {
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = "货物知识库回程导入模板.xlsx"; // xxx.xls/xxx.xlsx
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
    handleImport(){
        this.$refs.excelFile.value = "";
        this.$refs.excelFile.click();
    },
    //导入
    getFileT(event) {
      this.upath = event.target.files[0];
      let formData = new FormData();
      formData.append("excelFile", this.upath);
      importExcel(formData).then(res => {
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
        this.handleQuery();
      });
    }
  }
};
</script>
