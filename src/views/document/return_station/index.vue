<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="上货站" prop="classSite">
        <el-input
          v-model.trim="queryParams.classSite"
          placeholder="请输入上货站名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="整/拼箱" prop="isconsolidation" label-width="60px">
        <el-select
          v-model.trim="queryParams.isconsolidation"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in zp_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车站名称" prop="statioin">
        <el-input
          v-model.trim="queryParams.statioin"
          placeholder="请输入车站名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="isenabled" label-width="60px">
        <el-select
          v-model.trim="queryParams.isenabled"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['document:station:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['document:station:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['document:station:remove']"
          >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="stationList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="上货站" align="center" prop="classSite" />
      <el-table-column label="上货站唯一码" align="center" prop="classCode" />
      <el-table-column label="车站名称/代理" align="center" prop="statioin" />
      <el-table-column label="截港时间" align="center" prop="cuntofftime" />
      <el-table-column label="车站地址" align="center" prop="pxYstype" />
      <el-table-column
        label="联系方式"
        align="center"
        prop="contacts"
        show-overflow-tooltip
      />
      <el-table-column label="启用/禁用" align="center" prop="isenabled">
        <template slot-scope="scope">
          <el-switch
            v-model.trim="scope.row.isenabled"
            active-value="0"
            inactive-value="1"
            @change="handleChangeEnable(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" prop="createuser" />
      <el-table-column
        label="修改时间"
        align="center"
        prop="createdate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdate) }}</span>
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

    <!-- 添加或修改场站地址对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="760px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="上货站名称" prop="classSite">
          <el-input v-model.trim="form.classSite"  placeholder="请输入上货站名称"/>
        </el-form-item> -->
        <el-form-item label="上货站名称">
          <el-select v-model.trim="form.classCode" placeholder="请选择">
            <el-option
              v-for="item in classSiteOptions"
              :key="item.code"
              :value="item.code"
              :label="item.nameCn"
            >
              <span style="float: left">{{ item.nameCn }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.nameEn
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="装箱方式" prop="IsConsolidation">
          <el-radio v-model.trim="form.IsConsolidation" label="0">整箱</el-radio>
          <el-radio v-model.trim="form.IsConsolidation" label="1">拼箱</el-radio>
        </el-form-item>
        <el-form-item label="车站名称" prop="statioin">
          <el-input v-model.trim="form.statioin" placeholder="请输入车站名称" />
        </el-form-item>
        <el-form-item label="车站地址">
          <el-input v-model.trim="form.pxYstype" placeholder="请输入车站地址" />
        </el-form-item>
        <el-form-item label="截港时间" prop="cuntofftime">
          <el-input v-model.trim="form.cuntofftime" placeholder="请输入截港时间" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isenabled">
          <el-radio v-model.trim="form.isenabled" label="0">启用</el-radio>
          <el-radio v-model.trim="form.isenabled" label="1">禁用</el-radio>
        </el-form-item>

        <el-form-item label="联系方式" prop="contacts">
          <Editor v-model.trim="form.contacts" />
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
  listStation,
  getStation,
  delStation,
  addStation,
  updateStation,
  exportStation,
  siteList,
  changeStationEnable
} from "@/api/document/station";
import Editor from "@/components/Editor";

export default {
  components: {
    Editor
  },
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
      // 场站地址表格数据
      stationList: [],
      //新增修改上货站下拉框数据
      classSiteOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classSite: undefined,
        statioin: undefined,
        isconsolidation: undefined,
        isenabled: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      options: [
        {
          value: "0",
          label: "启用"
        },
        {
          value: "1",
          label: "禁用"
        }
      ],
      zp_options: [
        {
          value: "0",
          label: "整箱"
        },
        {
          value: "1",
          label: "拼箱"
        }
      ]
    };
  },
  watch: {
    "form.classCode": function(val) {
      let tempArr = this.classSiteOptions.find(item=>{
        return item.code  = val
      })
      this.form.classSite = tempArr.nameCn
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询场站地址列表 */
    getList() {
      this.loading = true;
      listStation(this.queryParams).then(response => {
        this.stationList = response.rows;
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
        stationId: undefined,
        classCode: undefined,
        classSite: undefined,
        statioin: undefined,
        cuntofftime: undefined,
        zxAddress: undefined,
        pxYstype: undefined,
        pxAddress: undefined,
        contacts: undefined,
        isconsolidation: undefined,
        createdate: undefined,
        createuser: undefined,
        isenabled: undefined
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
      this.ids = selection.map(item => item.stationId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      siteList().then(response => {
        
        this.classSiteOptions = response.data;
        console.log("1111" + this.classSiteOptions);
        this.reset();
        this.open = true;
        this.title = "添加场站地址";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const stationId = row.stationId || this.ids;
      getStation(stationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改场站地址";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stationId != undefined) {
            updateStation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addStation(this.form).then(response => {
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
      const stationIds = row.stationId || this.ids;
      this.$confirm(
        '是否确认删除场站地址编号为"' + stationIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delStation(stationIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },

    handleChangeEnable(row) {
      let text = row.isenabled === "0" ? "启用" : "禁用";
      this.$confirm('确认要"' + text + '"该场站地址信息吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return changeStationEnable(row.stationId, row.isenabled);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.isenabled = row.isenabled === "1" ? "0" : "1";
        });
    }
  }
};
</script>
