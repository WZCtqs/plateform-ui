<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model.trim="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择评价开始时间">
        </el-date-picker>
      </el-form-item>
      _
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model.trim="queryParams.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择评价结束时间">
        </el-date-picker>
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
          v-hasPermi="['system:evaluation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:evaluation:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:evaluation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExportSimple"
          v-hasPermi="['system:evaluationSimple:export']"
        >部门考核导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:evaluation:export']"
        >考核详细导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="evaluationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="评价id" align="center" prop="id" v-if="false"/>
      <el-table-column label="评价时间" align="center" prop="evaluationTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.evaluationTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价人姓名" align="center" prop="evaluationName" />
      <el-table-column label="评价人编号" align="center" prop="evaluationNo" />
      <el-table-column label="评价人信息" align="center" prop="evaluationtor" />
      <el-table-column label="管理部总计" align="center" prop="managedeTotal" />
      <el-table-column label="结算部总计" align="center" prop="jsbTotal" />
      <el-table-column label="操作一总计" align="center" prop="cz1Total" />
      <el-table-column label="操作三总计" align="center" prop="cz3Total" />
      <el-table-column label="集疏部总计" align="center" prop="jsTotal" />
      <el-table-column label="箱管一总计" align="center" prop="xg1Total" />
      <el-table-column label="箱管二总计" align="center" prop="xg2Total" />
      <el-table-column label="拼箱部总计" align="center" prop="pxTotal" />
      <el-table-column label="多式联运总计" align="center" prop="dslyTotal" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:evaluation:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:evaluation:remove']"
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

    <!-- 添加或修改部门考核管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评价时间" prop="evaluationTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model.trim="form.evaluationTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择评价时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="评价人姓名" prop="evaluationName">
          <el-input v-model.trim="form.evaluationName" placeholder="请输入评价人姓名" />
        </el-form-item>
        <el-form-item label="评价人编号" prop="evaluationNo">
          <el-input v-model.trim="form.evaluationNo" placeholder="请输入评价人编号" />
        </el-form-item>
        <el-form-item label="评价人信息" prop="evaluationtor">
          <el-input v-model.trim="form.evaluationtor" placeholder="请输入评价人信息" />
        </el-form-item>
        <el-form-item label="效率" prop="managedeEfficiency">
          <el-input v-model.trim="form.managedeEfficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="managedeQuality">
          <el-input v-model.trim="form.managedeQuality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="managedeDuty">
          <el-input v-model.trim="form.managedeDuty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="managedeAttitude">
          <el-input v-model.trim="form.managedeAttitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="managedeTeam">
          <el-input v-model.trim="form.managedeTeam" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="managedeTotal">
          <el-input v-model.trim="form.managedeTotal" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="managedeAve">
          <el-input v-model.trim="form.managedeAve" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="managedegrading">
          <el-input v-model.trim="form.managedegrading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="jsbEfficiency">
          <el-input v-model.trim="form.jsbEfficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="jsbQuality">
          <el-input v-model.trim="form.jsbQuality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="jsbDuty">
          <el-input v-model.trim="form.jsbDuty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="jsbAttitude">
          <el-input v-model.trim="form.jsbAttitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="jsbTeam">
          <el-input v-model.trim="form.jsbTeam" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="jsbTotal">
          <el-input v-model.trim="form.jsbTotal" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="jsbAve">
          <el-input v-model.trim="form.jsbAve" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="jsbgrading">
          <el-input v-model.trim="form.jsbgrading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="cz1Efficiency">
          <el-input v-model.trim="form.cz1Efficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="cz1Quality">
          <el-input v-model.trim="form.cz1Quality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="cz1Duty">
          <el-input v-model.trim="form.cz1Duty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="cz1Attitude">
          <el-input v-model.trim="form.cz1Attitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="cz1Team">
          <el-input v-model.trim="form.cz1Team" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="cz1Total">
          <el-input v-model.trim="form.cz1Total" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="cz1Ave">
          <el-input v-model.trim="form.cz1Ave" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="cz1grading">
          <el-input v-model.trim="form.cz1grading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="cz3Efficiency">
          <el-input v-model.trim="form.cz3Efficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="cz3Quality">
          <el-input v-model.trim="form.cz3Quality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="cz3Duty">
          <el-input v-model.trim="form.cz3Duty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="cz3Attitude">
          <el-input v-model.trim="form.cz3Attitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="cz3Team">
          <el-input v-model.trim="form.cz3Team" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="cz3Total">
          <el-input v-model.trim="form.cz3Total" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="cz3Ave">
          <el-input v-model.trim="form.cz3Ave" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="cz3grading">
          <el-input v-model.trim="form.cz3grading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="jsEfficiency">
          <el-input v-model.trim="form.jsEfficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="jsQuality">
          <el-input v-model.trim="form.jsQuality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="jsDuty">
          <el-input v-model.trim="form.jsDuty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="jsAttitude">
          <el-input v-model.trim="form.jsAttitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="jsTeam">
          <el-input v-model.trim="form.jsTeam" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="jsTotal">
          <el-input v-model.trim="form.jsTotal" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="jsAve">
          <el-input v-model.trim="form.jsAve" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="jsgrading">
          <el-input v-model.trim="form.jsgrading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="xg1Efficiency">
          <el-input v-model.trim="form.xg1Efficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="xg1Quality">
          <el-input v-model.trim="form.xg1Quality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="xg1Duty">
          <el-input v-model.trim="form.xg1Duty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="xg1Attitude">
          <el-input v-model.trim="form.xg1Attitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="xg1Team">
          <el-input v-model.trim="form.xg1Team" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="xg1Total">
          <el-input v-model.trim="form.xg1Total" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="xg1Ave">
          <el-input v-model.trim="form.xg1Ave" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="xg1grading">
          <el-input v-model.trim="form.xg1grading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="xg2Efficiency">
          <el-input v-model.trim="form.xg2Efficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="xg2Quality">
          <el-input v-model.trim="form.xg2Quality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="xg2Duty">
          <el-input v-model.trim="form.xg2Duty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="xg2Attitude">
          <el-input v-model.trim="form.xg2Attitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="xg2Team">
          <el-input v-model.trim="form.xg2Team" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="xg2Total">
          <el-input v-model.trim="form.xg2Total" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="xg2Ave">
          <el-input v-model.trim="form.xg2Ave" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="xg2grading">
          <el-input v-model.trim="form.xg2grading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="pxEfficiency">
          <el-input v-model.trim="form.pxEfficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="pxQuality">
          <el-input v-model.trim="form.pxQuality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="pxDuty">
          <el-input v-model.trim="form.pxDuty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="pxAttitude">
          <el-input v-model.trim="form.pxAttitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="pxTeam">
          <el-input v-model.trim="form.pxTeam" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="pxTotal">
          <el-input v-model.trim="form.pxTotal" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="pxAve">
          <el-input v-model.trim="form.pxAve" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="pxgrading">
          <el-input v-model.trim="form.pxgrading" placeholder="请输入评分依据" />
        </el-form-item>
        <el-form-item label="效率" prop="dslyEfficiency">
          <el-input v-model.trim="form.dslyEfficiency" placeholder="请输入效率" />
        </el-form-item>
        <el-form-item label="质量" prop="dslyQuality">
          <el-input v-model.trim="form.dslyQuality" placeholder="请输入质量" />
        </el-form-item>
        <el-form-item label="责任" prop="dslyDuty">
          <el-input v-model.trim="form.dslyDuty" placeholder="请输入责任" />
        </el-form-item>
        <el-form-item label="态度" prop="dslyAttitude">
          <el-input v-model.trim="form.dslyAttitude" placeholder="请输入态度" />
        </el-form-item>
        <el-form-item label="团队" prop="dslyTeam">
          <el-input v-model.trim="form.dslyTeam" placeholder="请输入团队" />
        </el-form-item>
        <el-form-item label="总计" prop="dslyTotal">
          <el-input v-model.trim="form.dslyTotal" placeholder="请输入总计" />
        </el-form-item>
        <el-form-item label="平均" prop="dslyAve">
          <el-input v-model.trim="form.dslyAve" placeholder="请输入平均" />
        </el-form-item>
        <el-form-item label="评分依据" prop="dslygrading">
          <el-input v-model.trim="form.dslygrading" placeholder="请输入评分依据" />
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
import { listEvaluation, getEvaluation, delEvaluation, addEvaluation, updateEvaluation, exportEvaluation, exportEvaluationSimple } from "@/api/system/evaluation";

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
      // 部门考核管理表格数据
      evaluationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: undefined,
        endName: undefined,
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
    /** 查询部门考核管理列表 */
    getList() {
      this.loading = true;
      listEvaluation(this.queryParams).then(response => {
        this.evaluationList = response.rows;
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
        evaluationTime: undefined,
        evaluationName: undefined,
        evaluationNo: undefined,
        evaluationtor: undefined,
        managedeEfficiency: undefined,
        managedeQuality: undefined,
        managedeDuty: undefined,
        managedeAttitude: undefined,
        managedeTeam: undefined,
        managedeTotal: undefined,
        managedeAve: undefined,
        managedegrading: undefined,
        jsbEfficiency: undefined,
        jsbQuality: undefined,
        jsbDuty: undefined,
        jsbAttitude: undefined,
        jsbTeam: undefined,
        jsbTotal: undefined,
        jsbAve: undefined,
        jsbgrading: undefined,
        cz1Efficiency: undefined,
        cz1Quality: undefined,
        cz1Duty: undefined,
        cz1Attitude: undefined,
        cz1Team: undefined,
        cz1Total: undefined,
        cz1Ave: undefined,
        cz1grading: undefined,
        cz3Efficiency: undefined,
        cz3Quality: undefined,
        cz3Duty: undefined,
        cz3Attitude: undefined,
        cz3Team: undefined,
        cz3Total: undefined,
        cz3Ave: undefined,
        cz3grading: undefined,
        jsEfficiency: undefined,
        jsQuality: undefined,
        jsDuty: undefined,
        jsAttitude: undefined,
        jsTeam: undefined,
        jsTotal: undefined,
        jsAve: undefined,
        jsgrading: undefined,
        xg1Efficiency: undefined,
        xg1Quality: undefined,
        xg1Duty: undefined,
        xg1Attitude: undefined,
        xg1Team: undefined,
        xg1Total: undefined,
        xg1Ave: undefined,
        xg1grading: undefined,
        xg2Efficiency: undefined,
        xg2Quality: undefined,
        xg2Duty: undefined,
        xg2Attitude: undefined,
        xg2Team: undefined,
        xg2Total: undefined,
        xg2Ave: undefined,
        xg2grading: undefined,
        pxEfficiency: undefined,
        pxQuality: undefined,
        pxDuty: undefined,
        pxAttitude: undefined,
        pxTeam: undefined,
        pxTotal: undefined,
        pxAve: undefined,
        pxgrading: undefined,
        dslyEfficiency: undefined,
        dslyQuality: undefined,
        dslyDuty: undefined,
        dslyAttitude: undefined,
        dslyTeam: undefined,
        dslyTotal: undefined,
        dslyAve: undefined,
        dslygrading: undefined
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
      this.title = "添加部门考核管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEvaluation(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门考核管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateEvaluation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addEvaluation(this.form).then(response => {
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
      this.$confirm('是否确认删除部门考核管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEvaluation(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出部门考核统计?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportEvaluation(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 导出详细按钮操作 */
    handleExportSimple() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出部门考核详细信息?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportEvaluationSimple(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    }
  }
};
</script>
