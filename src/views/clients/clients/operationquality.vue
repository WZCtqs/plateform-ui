<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="委托书编号" prop="orderNumber" label-width="88px">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户单位" prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入客户单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     
      <el-form-item label="评价日期" prop="satisfactionDate">
        <!-- <el-date-picker clearable size="small" style="width: 200px"
          v-model.trim="queryParams.satisfactionDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择评价日期">
        </el-date-picker>-->

        <el-date-picker
          v-model.trim="beginToend"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

       <el-form-item label="推荐人" prop="clientTjr">
        <el-input
          v-model.trim="queryParams.clientTjr"
          placeholder="请输入推荐人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">

       <el-col :span="1.5">
        <el-button
          type="success"
          size="mini"
          :disabled="single"
          @click="handleUpdate('0')"
          v-hasPermi="['clients:operationquality:edit']"
        >查看</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate('1')"
          v-hasPermi="['clients:operationquality:edit']"
        >修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['clients:operationquality:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['clients:operationquality:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="operationqualityList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="qualityId" />
      <el-table-column label="订舱id" align="center" prop="orderId" />-->
      <el-table-column label="委托书编号" align="center">
       <template slot-scope="scope" v-if="scope.row.orderNumber">
          <!-- {{scope.row.qualityId}}** -->
          <span> {{scope.row.orderNumber }}</span>
        </template>
        <template v-else></template>
      </el-table-column>
      <!-- <el-table-column label="客户id" align="center" prop="clientId" /> -->
      <el-table-column label="客户单位" align="center" prop="clientUnit" />
      <el-table-column label="推荐人" align="center" prop="clientTjr" />

      <!-- <el-table-column label="亚欧部" align="center" prop="organizationCode" />
      <el-table-column label="评价部门" align="center" prop="organizationName" />
      <el-table-column label="填报人" align="center" prop="clientTjr" />-->
      <el-table-column label="国内公路服务占比10%" align="center" prop="roadService" />
      <el-table-column label="国内场站服务占比10%" align="center" prop="instationService" />
      <el-table-column label="国内关务服务占比10%" align="center" prop="incustomsService" />
      <el-table-column label="铁路运输服务占比30%" align="center" prop="railageService" />
      <el-table-column label="国外关务服务占比5%" align="center" prop="outcustomsService" />
      <el-table-column label="国外场站服务占比10%" align="center" prop="outstationService" />
      <el-table-column label="国外集疏服务占比10%" align="center" prop="jsService" />
      <el-table-column label="国内外集装箱服务占比5%" align="center" prop="containerService" />
      <el-table-column label="信息反馈服务占比10%" align="center" prop="msgService" />
      <el-table-column label="满意度" align="center" prop="satisfactionDegree" />
      <el-table-column label="备注" align="center" prop="satisfactionRemake" />
      <el-table-column label="评价日期" align="center" prop="satisfactionDate" width="180">
        <template slot-scope="scope" v-if="scope.row.satisfactionDate">
          <span>{{ parseTime(scope.row.satisfactionDate) }}</span>
        </template>
        <template v-else></template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改操作质量投诉对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="65%" >
      <div>
        <ul class="operationqualityCss0">
          <li>1.本日报，1个月为一个调查周期</li>
          <li>2.在调查周期内，根据客户的抱怨，把数字输入到对应的项目中（同一项服务内容，在调查周期内，出现一次投诉和抱怨输入"1",出现第二次投诉和抱怨输入"2",出现第三次投诉和抱怨输入"3"......）</li>
          <li>
            3.门到门整个操作过程100%满意度分项业务占比如下：
            国内公路运输占比10%；国内场站占比10%；国内关务占比10%；国际铁路运输占比4%
          </li>
        </ul>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px" :disabled="formDisabled">
        <!-- <el-input v-model.trim="form.orderId" v-show="false" /> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="委托书编号" prop="orderNumber">
              <el-input v-model.trim="form.orderNumber" placeholder="请输入委托书编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="亚欧部" prop="organizationCode">
              <el-input v-model.trim="form.organizationCode" placeholder="请输入亚欧部" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="评价部门" prop="organizationName">
              <el-input v-model.trim="form.organizationName" placeholder="请输入评价部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户单位" prop="clientUnit">
              <el-input v-model.trim="form.clientUnit" placeholder="请输入客户单位" />
              <el-input v-model.trim="form.clientId" v-show="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="填报人" prop="clientTjr">
              <el-input v-model.trim="form.clientTjr" placeholder="请输入填报人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国内公路服务占比10%" prop="roadService">
              <el-input v-model.trim="form.roadService" placeholder="国内公路服务占比10%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国内场站服务占比10%" prop="instationService">
              <el-input v-model.trim="form.instationService" placeholder="请输入国内场站服务占比10%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="国内关务服务占比10%" prop="incustomsService">
              <el-input v-model.trim="form.incustomsService" placeholder="请输入国内关务服务占比10%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="铁路运输服务占比30%" prop="railageService">
              <el-input v-model.trim="form.railageService" placeholder="请输入铁路运输服务占比30%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="国外关务服务占比5%" prop="outcustomsService">
              <el-input v-model.trim="form.outcustomsService" placeholder="请输入国外关务服务占比5%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国外场站服务占比10%" prop="outstationService">
              <el-input v-model.trim="form.outstationService" placeholder="请输入国外场站服务占比10%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="国外集疏服务占比10%" prop="jsService">
              <el-input v-model.trim="form.jsService" placeholder="请输入国外集疏服务占比10%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国内外集装箱服务占比5%" prop="containerService">
              <el-input v-model.trim="form.containerService" placeholder="请输入国内外集装箱服务占比5%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="信息反馈服务占比10%" prop="msgService">
              <el-input v-model.trim="form.msgService" placeholder="请输入信息反馈服务占比10%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="满意度" prop="satisfactionDegree">
              <el-input v-model.trim="form.satisfactionDegree" placeholder="请输入满意度" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="备注" prop="satisfactionRemake">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入备注"
                v-model.trim="form.satisfactionRemake"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="title === '修改'" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOperationquality,
  getOperationquality,
  delOperationquality,
  addOperationquality,
  updateOperationquality,
  exportOperationquality
} from "@/api/clients/operationquality";
import { timestampToTime } from "@/utils/zhonghao";

export default {
  name:'Operationquality',
  data() {
    return {
      beginToend: [],
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
      // 操作质量投诉表格数据
      operationqualityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        startDate: null,
        endDate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      formDisabled:false,
      formDetail:{},
    };
  },
  created() {
        this.queryParams['userid'] = this.$store.getters.id;

     this.queryParams['deptCode'] = this.$store.getters.deptCode
    this.getList();
  },
  watch: {
    beginToend(val) {
      if(val){
        this.queryParams.startDate = this.beginToend[0];
        this.queryParams.endDate = this.beginToend[1];
      }else{
         this.queryParams.startDate = null;
        this.queryParams.endDate = null;
      }
    },
  },
  methods: {

    // getTime() {
    //   this.queryParams.startDate = this.beginToend[0];
    //   this.queryParams.endDate = this.beginToend[1];
    // },

    /** 查询操作质量投诉列表 */
    getList() {
      this.loading = true;
      listOperationquality(this.queryParams).then(response => {
        let arrs=[]
        response.rows.forEach(item=>{
          if(item){
            arrs.push(item)
          }
        })
        this.operationqualityList = arrs;
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
        qualityId: undefined,
        orderId: undefined,
        orderNumber: undefined,
        clientId: undefined,
        clientUnit: undefined,
        organizationCode: undefined,
        organizationName: undefined,
        clientTjr: undefined,
        roadService: undefined,
        instationService: undefined,
        incustomsService: undefined,
        railageService: undefined,
        outcustomsService: undefined,
        outstationService: undefined,
        jsService: undefined,
        containerService: undefined,
        msgService: undefined,
        satisfactionDegree: undefined,
        satisfactionRemake: undefined,
        satisfactionDate: undefined,
        operator: undefined
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
      this.beginToend=[]
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加操作质量投诉";
    },
    /** 修改按钮操作 */
    handleUpdate(obj) {
      if(obj === '0'){
        this.formDisabled=true
          this.title = "详情";
      }else if(obj === '1'){
        this.formDisabled=false
         this.title = "修改";
      }
      this.reset();
      if(this.ids[0].qualityId){
        let qualityId = this.ids[0].qualityId
        getOperationquality(qualityId).then(response => {
          this.form = response.data;
          this.open = true;
        });
      }else{
         this.form = this.ids[0];
          this.open = true;

      }

    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            updateOperationquality(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });

        }
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出当前数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportOperationquality(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style>
.operationqualityCss0 li{
  line-height:25px;
  word-spacing:15px;
}
</style>
