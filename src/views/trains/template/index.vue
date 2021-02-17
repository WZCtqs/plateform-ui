<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="0是中欧2是中亚3是中越4是中俄"
                    prop="classTNumber">
        <el-input v-model.trim="queryParams.classTNumber"
                  placeholder="请输入0是中欧2是中亚3是中越4是中俄"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开行班列"
                    prop="classTBlocktrain">
        <el-input v-model.trim="queryParams.classTBlocktrain"
                  placeholder="请输入开行班列"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开行班列"
                    prop="classTClasstype">
        <el-select v-model.trim="queryParams.classTClasstype"
                   placeholder="请选择开行班列"
                   clearable
                   size="small">
          <el-option label="请选择字典生成"
                     value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="0往 1返"
                    prop="classTEastandwest">
        <el-input v-model.trim="queryParams.classTEastandwest"
                  placeholder="请输入0往 1返"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="始发站代码"
                    prop="classTStationofdepartureCode">
        <el-input v-model.trim="queryParams.classTStationofdepartureCode"
                  placeholder="请输入始发站代码"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="始发站"
                    prop="classTStationofdeparture">
        <el-input v-model.trim="queryParams.classTStationofdeparture"
                  placeholder="请输入始发站"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="始发站英文"
                    prop="classTStationofdepartureEn">
        <el-input v-model.trim="queryParams.classTStationofdepartureEn"
                  placeholder="请输入始发站英文"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="目的站代码"
                    prop="classTStationofdestinationCode">
        <el-input v-model.trim="queryParams.classTStationofdestinationCode"
                  placeholder="请输入目的站代码"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="目的站"
                    prop="classTStationofdestination">
        <el-input v-model.trim="queryParams.classTStationofdestination"
                  placeholder="请输入目的站"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="目的站英文"
                    prop="classTStationofdestinationEn">
        <el-input v-model.trim="queryParams.classTStationofdestinationEn"
                  placeholder="请输入目的站英文"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开发频次"
                    prop="classTTransporttime">
        <el-input v-model.trim="queryParams.classTTransporttime"
                  placeholder="请输入开发频次"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间"
                    prop="createdate">
        <el-date-picker clearable
                        size="small"
                        style="width: 200px"
                        v-model.trim="queryParams.createdate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建用户id"
                    prop="createuserid">
        <el-input v-model.trim="queryParams.createuserid"
                  placeholder="请输入创建用户id"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建用户名"
                    prop="createusername">
        <el-input v-model.trim="queryParams.createusername"
                  placeholder="请输入创建用户名"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="起始站(code和名称)"
                    prop="classTSstie">
        <el-input v-model.trim="queryParams.classTSstie"
                  placeholder="请输入起始站(code和名称)"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="目的站(code和名称)"
                    prop="classTEstie">
        <el-input v-model.trim="queryParams.classTEstie"
                  placeholder="请输入目的站(code和名称)"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="路线id"
                    prop="lineId">
        <el-input v-model.trim="queryParams.lineId"
                  placeholder="请输入路线id"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="路线名称"
                    prop="lineName">
        <el-input v-model.trim="queryParams.lineName"
                  placeholder="请输入路线名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="0是中欧2是中亚3是中越4是中俄"
                    prop="lineTypeid">
        <el-input v-model.trim="queryParams.lineTypeid"
                  placeholder="请输入0是中欧2是中亚3是中越4是中俄"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="0是中欧2是中亚3是中越4是中俄"
                    prop="yuyan">
        <el-input v-model.trim="queryParams.yuyan"
                  placeholder="请输入0是中欧2是中亚3是中越4是中俄"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
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
                   v-hasPermi="['trains:template:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['trains:template:remove']">删除</el-button>
        <!-- <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['trains:template:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['trains:template:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['trains:template:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['trains:template:export']">导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading"
              :data="templateList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="0是中欧2是中亚3是中越4是中俄"
                       align="center"
                       prop="classTId" />
      <el-table-column label="0是中欧2是中亚3是中越4是中俄"
                       align="center"
                       prop="classTNumber" />
      <el-table-column label="开行班列"
                       align="center"
                       prop="classTBlocktrain" />
      <el-table-column label="开行班列"
                       align="center"
                       prop="classTClasstype" />
      <el-table-column label="0往 1返"
                       align="center"
                       prop="classTEastandwest" />
      <el-table-column label="始发站代码"
                       align="center"
                       prop="classTStationofdepartureCode" />
      <el-table-column label="始发站"
                       align="center"
                       prop="classTStationofdeparture" />
      <el-table-column label="始发站英文"
                       align="center"
                       prop="classTStationofdepartureEn" />
      <el-table-column label="目的站代码"
                       align="center"
                       prop="classTStationofdestinationCode" />
      <el-table-column label="目的站"
                       align="center"
                       prop="classTStationofdestination" />
      <el-table-column label="目的站英文"
                       align="center"
                       prop="classTStationofdestinationEn" />
      <el-table-column label="开发频次"
                       align="center"
                       prop="classTTransporttime" />
      <el-table-column label="经过站点"
                       align="center"
                       prop="classTPath" />
      <el-table-column label="创建时间"
                       align="center"
                       prop="createdate"
                       width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建用户id"
                       align="center"
                       prop="createuserid" />
      <el-table-column label="创建用户名"
                       align="center"
                       prop="createusername" />
      <el-table-column label="起始站(code和名称)"
                       align="center"
                       prop="classTSstie" />
      <el-table-column label="目的站(code和名称)"
                       align="center"
                       prop="classTEstie" />
      <el-table-column label="路线id"
                       align="center"
                       prop="lineId" />
      <el-table-column label="路线名称"
                       align="center"
                       prop="lineName" />
      <el-table-column label="0是中欧2是中亚3是中越4是中俄"
                       align="center"
                       prop="lineTypeid" />
      <el-table-column label="0是中欧2是中亚3是中越4是中俄"
                       align="center"
                       prop="yuyan" />
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['trains:template:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['trains:template:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改班列模板对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="0是中欧2是中亚3是中越4是中俄"
                      prop="classTNumber">
          <el-input v-model.trim="form.classTNumber"
                    placeholder="请输入0是中欧2是中亚3是中越4是中俄" />
        </el-form-item>
        <el-form-item label="开行班列"
                      prop="classTBlocktrain">
          <el-input v-model.trim="form.classTBlocktrain"
                    placeholder="请输入开行班列" />
        </el-form-item>
        <el-form-item label="开行班列">
          <el-select v-model.trim="form.classTClasstype"
                     placeholder="请选择开行班列">
            <el-option label="请选择字典生成"
                       value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="0往 1返"
                      prop="classTEastandwest">
          <el-input v-model.trim="form.classTEastandwest"
                    placeholder="请输入0往 1返" />
        </el-form-item>
        <el-form-item label="始发站代码"
                      prop="classTStationofdepartureCode">
          <el-input v-model.trim="form.classTStationofdepartureCode"
                    placeholder="请输入始发站代码" />
        </el-form-item>
        <el-form-item label="始发站"
                      prop="classTStationofdeparture">
          <el-input v-model.trim="form.classTStationofdeparture"
                    placeholder="请输入始发站" />
        </el-form-item>
        <el-form-item label="始发站英文"
                      prop="classTStationofdepartureEn">
          <el-input v-model.trim="form.classTStationofdepartureEn"
                    placeholder="请输入始发站英文" />
        </el-form-item>
        <el-form-item label="目的站代码"
                      prop="classTStationofdestinationCode">
          <el-input v-model.trim="form.classTStationofdestinationCode"
                    placeholder="请输入目的站代码" />
        </el-form-item>
        <el-form-item label="目的站"
                      prop="classTStationofdestination">
          <el-input v-model.trim="form.classTStationofdestination"
                    placeholder="请输入目的站" />
        </el-form-item>
        <el-form-item label="目的站英文"
                      prop="classTStationofdestinationEn">
          <el-input v-model.trim="form.classTStationofdestinationEn"
                    placeholder="请输入目的站英文" />
        </el-form-item>
        <el-form-item label="开发频次"
                      prop="classTTransporttime">
          <el-input v-model.trim="form.classTTransporttime"
                    placeholder="请输入开发频次" />
        </el-form-item>
        <el-form-item label="经过站点"
                      prop="classTPath">
          <el-input v-model.trim="form.classTPath"
                    type="textarea"
                    placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="创建时间"
                      prop="createdate">
          <el-date-picker clearable
                          size="small"
                          style="width: 200px"
                          v-model.trim="form.createdate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建用户id"
                      prop="createuserid">
          <el-input v-model.trim="form.createuserid"
                    placeholder="请输入创建用户id" />
        </el-form-item>
        <el-form-item label="创建用户名"
                      prop="createusername">
          <el-input v-model.trim="form.createusername"
                    placeholder="请输入创建用户名" />
        </el-form-item>
        <el-form-item label="起始站(code和名称)"
                      prop="classTSstie">
          <el-input v-model.trim="form.classTSstie"
                    placeholder="请输入起始站(code和名称)" />
        </el-form-item>
        <el-form-item label="目的站(code和名称)"
                      prop="classTEstie">
          <el-input v-model.trim="form.classTEstie"
                    placeholder="请输入目的站(code和名称)" />
        </el-form-item>
        <el-form-item label="路线id"
                      prop="lineId">
          <el-input v-model.trim="form.lineId"
                    placeholder="请输入路线id" />
        </el-form-item>
        <el-form-item label="路线名称"
                      prop="lineName">
          <el-input v-model.trim="form.lineName"
                    placeholder="请输入路线名称" />
        </el-form-item>
        <el-form-item label="0是中欧2是中亚3是中越4是中俄"
                      prop="lineTypeid">
          <el-input v-model.trim="form.lineTypeid"
                    placeholder="请输入0是中欧2是中亚3是中越4是中俄" />
        </el-form-item>
        <el-form-item label="0是中欧2是中亚3是中越4是中俄"
                      prop="yuyan">
          <el-input v-model.trim="form.yuyan"
                    placeholder="请输入0是中欧2是中亚3是中越4是中俄" />
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
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate, exportTemplate } from "@/api/trains/template";

export default {
  data () {
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
      // 班列模板表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classTNumber: undefined,
        classTBlocktrain: undefined,
        classTClasstype: undefined,
        classTEastandwest: undefined,
        classTStationofdepartureCode: undefined,
        classTStationofdeparture: undefined,
        classTStationofdepartureEn: undefined,
        classTStationofdestinationCode: undefined,
        classTStationofdestination: undefined,
        classTStationofdestinationEn: undefined,
        classTTransporttime: undefined,
        classTPath: undefined,
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        classTSstie: undefined,
        classTEstie: undefined,
        lineId: undefined,
        lineName: undefined,
        lineTypeid: undefined,
        yuyan: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        lineTypeid: [
          { required: true, message: "0是中欧2是中亚3是中越4是中俄不能为空", trigger: "blur" }
        ],      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询班列模板列表 */
    getList () {
      this.loading = true;
      listTemplate(this.queryParams).then(response => {
        this.templateList = response.rows;
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
        classTId: undefined,
        classTNumber: undefined,
        classTBlocktrain: undefined,
        classTClasstype: undefined,
        classTEastandwest: undefined,
        classTStationofdepartureCode: undefined,
        classTStationofdeparture: undefined,
        classTStationofdepartureEn: undefined,
        classTStationofdestinationCode: undefined,
        classTStationofdestination: undefined,
        classTStationofdestinationEn: undefined,
        classTTransporttime: undefined,
        classTPath: undefined,
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        classTSstie: undefined,
        classTEstie: undefined,
        lineId: undefined,
        lineName: undefined,
        lineTypeid: undefined,
        yuyan: undefined
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
      this.ids = selection.map(item => item.classTId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加班列模板";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const classTId = row.classTId || this.ids
      getTemplate(classTId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班列模板";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.classTId != undefined) {
            updateTemplate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTemplate(this.form).then(response => {
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
      const classTIds = row.classTId || this.ids;
      this.$confirm('是否确认删除班列模板编号为"' + classTIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delTemplate(classTIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有班列模板数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportTemplate(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>