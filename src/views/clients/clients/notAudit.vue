<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="单位名称" prop="clientUnit" >
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="法人代表" prop="clientLegalperson">
        <el-input
          v-model.trim="queryParams.clientLegalperson"
          placeholder="请输入法人代表"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="订舱人" prop="clientContacts">
        <el-input
          v-model.trim="queryParams.clientContacts"
          placeholder="请输入订舱人"
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['clients:clients:remove']"
        >删除</el-button>
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button type="warning" size="mini" :disabled="single" @click="handleExam">客户审核信息</el-button>
      </el-col> -->

      <el-col :span="1.5">
        <el-button type="primary" size="mini" :disabled="single" @click="handleDetail">查看</el-button>
      </el-col>
    </el-row>

    <el-table :class="this.heightScreen===590?'sh22 el-tableCss0':'sh11 el-tableCss0'" border 
    v-loading="loading" :data="clientsList" 
    @selection-change="handleSelectionChange"
    :height="heightScreen">
      <el-table-column type="selection"  align="center"  />
      <el-table-column label="单位名称" align="center" prop="clientUnit"  />
      <el-table-column label="法人代表" align="center" >
        <template slot-scope="scope">{{scope.row.clientLegalperson}}</template>
      </el-table-column>
      <el-table-column label="订舱人" align="center" prop="clientContacts"  />
      <el-table-column label="推荐人" align="center" prop="clientTjr"   />
      <el-table-column label="职位" align="center" prop="clientZw" />
      <el-table-column label="手机号" align="center" prop="clientPhone" />
      <el-table-column label="固话" align="center" prop="clientTel" />
      <el-table-column label="订舱人邮箱" align="center" prop="clientEmail" />
      <el-table-column label="统一社会信用代码" align="center" prop="clientCode" />

       <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <span>审核不通过</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="审核状态" align="center" prop="isexamline" /> -->
      <el-table-column label="状态" align="center"  >
      <template slot-scope="scope">
      <span v-if="scope.row.cancelaccount==='0'">启用</span>
      <span v-else-if="scope.row.cancelaccount==='1'">锁定</span>    
      </template>
      </el-table-column>  
      <el-table-column label="是否失信" align="center"  :formatter="isNormalFormat" >
      <template slot-scope="scope">
      <span v-if="scope.row.isNormal==='0'">否</span>
      <span v-else-if="scope.row.isNormal==='1'">是</span>  
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

    <!-- 添加或修改客户管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="90%">
      <el-form ref="form" :model="form" :rules="rules" label-width="280px" :disabled="formDisabled">
        <el-row>
          <el-col :span="10">
            <el-form-item label="法人代表" prop="clientLegalperson">
              <el-input v-model.trim="form.clientLegalperson" placeholder="请输入法人代表" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="clientCode">
              <el-input v-model.trim="form.clientCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="单位名称" prop="clientUnit">
              <el-input v-model.trim="form.clientUnit" placeholder="请输入单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位地址" prop="clientAddress">
              <el-input v-model.trim="form.clientAddress" placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="订舱人" prop="clientContacts">
              <el-input v-model.trim="form.clientContacts" placeholder="请输入订舱人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮件" prop="clientEmail">
              <el-input v-model.trim="form.clientEmail" placeholder="请输入邮件" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号" prop="clientPhone">
              <el-input v-model.trim="form.clientPhone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机号" prop="clientTel">
              <el-input v-model.trim="form.clientTel" placeholder="请输入座机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="部门" prop="clientDept">
              <el-input v-model.trim="form.clientDept" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="clientZw">
              <el-input v-model.trim="form.clientZw" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="郑州陆港推荐人" prop="clientTjr">
              <el-input v-model.trim="form.clientTjr" placeholder="请输入推荐人" />
              <el-input v-model.trim="form.clientTjrId" v-show="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="西向跟单员" prop="wMerchandiser">
              <el-input v-model.trim="form.wMerchandiser" :disabled="true" placeholder="请选择西向跟单员" />
              <el-input v-model.trim="form.wMerchandiserId" v-show="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="small" @click="beforeSelected0('w')">选择</el-button>
            <!-- <el-button type="info" size="small">删除</el-button> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="东向跟单员" prop="eMerchandiser">
              <el-input v-model.trim="form.eMerchandiser" :disabled="true" placeholder="请输入东向跟单员" />
              <el-input v-model.trim="form.eMerchandiserId" v-show="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="small" @click="beforeSelected0('e')">选择</el-button>
            <!-- <el-button type="info" size="small" @click="beforeSelected0">删除</el-button> -->
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="10">
            <el-form-item label="国内外客户" prop="engChinese">
              <el-radio v-model.trim="form.engChinese" label="0" :disabled="title==='修改客户管理'">国内客户</el-radio>
              <el-radio v-model.trim="form.engChinese" label="1" :disabled="title==='修改客户管理'">国外客户</el-radio>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="10">
            <el-form-item label="单位属性" prop="isDirect">
              <el-radio v-model.trim="form.isDirect" label="0" :disabled="true">货代</el-radio>
              <el-radio v-model.trim="form.isDirect" label="1" :disabled="true">直客</el-radio>
              <el-radio v-model.trim="form.isDirect" label="2" :disabled="true">其他</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否失信客户" prop="isNormal">
              <el-radio v-model.trim="form.isNormal" label="0">否</el-radio>
              <el-radio v-model.trim="form.isNormal" label="1">是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="是否签署《国际运输物流服务合同》:" prop="isSign">
              <el-radio v-model.trim="form.isSign" label="0">是</el-radio>
              <el-radio v-model.trim="form.isSign" label="1">否</el-radio>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="客户等级" prop="clientGrade">
              <el-input v-model.trim="form.clientGrade" placeholder="请输入客户等级" />
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="合同有效期" prop="signDate">
              <el-date-picker
                clearable
                size="small"
                style="width: 200px"
                v-model.trim="form.signDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择合同有效期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同失效期" prop="signDisabledDate">
              <el-date-picker
                clearable
                size="small"
                style="width: 200px"
                v-model.trim="form.signDisabledDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择合同失效期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="备注">
              <el-input v-model.trim="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

  
  </div>
</template>

<script>
import {
  listClients,
  getClients,
  delClients,
  addClients,
  updateClients,
  exportClients
} from "@/api/clients/clients";
import { timestampToTime } from "@/utils/zhonghao";
import "@/assets/styles/selfCss0.css";

export default {
  name:'NotAudit',
  data() {
    return {
      form1: {}, // 客户审核信息form1表单
      rules1: {}, // 客户审核信息form1表单校验规则
      open1: false, // 客户审核弹框是否显示
      listQuery0: {
        name: null,
        num: null,
        account: null
      },
      benginToend: [],
      ids0: [],
      currentDirection: null,
      wMerchandiserDialog: false,

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中list数组
      arrs: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 客户管理表格数据
      clientsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 国内外客户，0是国内，1国外字典
      engChineseOptions: [],
      // 是否失信字典
      isNormalOptions: [],
      // 单位属性字典
      isDirectOptions: [],
      heightScreen:null,
      // 是否签订合同字典
      isSignOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientUnit: null,
        clientLegalperson: null,
        clientContacts: null,
        isexamline: "2", // 待审核的客户
        isNormal: "0",
        deptCode:null,
      },
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
      // 表单参数
      form: {},
      formDisabled: false,
      // 表单校验
      rules: {
        clientLegalperson: [
          {
            required: true,
            message: "请输入法人代表",
            trigger: "blur"
          }
        ],
        clientCode: [
          {
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur"
          }
        ],
        clientUnit: [
          {
            required: true,
            message: "请输入单位名称",
            trigger: "blur"
          }
        ],
        clientAddress: [
          {
            required: true,
            message: "请输入单位地址",
            trigger: "blur"
          }
        ],
        clientContacts: [
          {
            required: true,
            message: "请输入订舱人",
            trigger: "blur"
          }
        ],
        clientEmail: [
          {
            required: true,
            message: "请输入订舱人邮件",
            trigger: "blur"
          }
        ],
        clientPhone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          }
        ],
        clientTel: [
          {
            required: true,
            message: "请输入座机号",
            trigger: "blur"
          }
        ],
        clientDept: [
          {
            required: true,
            message: "请输入部门",
            trigger: "blur"
          }
        ],
        clientZw: [
          {
            required: true,
            message: "请输入职务",
            trigger: "blur"
          }
        ],
        clientTjr: [
          {
            required: true,
            message: "请输入郑州陆港推荐人",
            trigger: "blur"
          }
        ],

        wMerchandiser: [
          {
            required: true,
            message: "请输入西向跟单员",
            trigger: "blur"
          }
        ],

        eMerchandiser: [
          {
            required: true,
            message: "请输入东向跟单员",
            trigger: "blur"
          }
        ],

        isDirect: [
          {
            required: true,
            message: "请选择单位属性",
            trigger: "blur"
          }
        ],
        isNormal: [
          {
            required: true,
            message: "请选择是否失信",
            trigger: "blur"
          }
        ],
        isSign: [
          {
            required: true,
            message: "请选择是否签订协议",
            trigger: "blur"
          }
        ],
        engChinese: [
          {
            required: true,
            message: "请选择国内外客户",
            trigger: "blur"
          }
        ],
        clientGrade: [
          {
            required: true,
            message: "请输入客户等级",
            trigger: "blur"
          }
        ],
        signDate: [
          {
            required: true,
            message: "请选择合同有效日期",
            trigger: "blur"
          }
        ],
        signDisabledDate: [
          {
            required: true,
            message: "请选择合同失效日期",
            trigger: "blur"
          }
        ]
      },
      starLevel: 3
    };
  },
  created() {
        this.queryParams['userid'] = this.$store.getters.id;

     this.queryParams.deptCode = this.$store.getters.deptCode
    this.getList();
  },
  mounted() {    
     if(window.screen.height >800){
        this.heightScreen = 590
      }else{
        this.heightScreen = 470
      }
  },
  watch: {
    form1: {
      handler: function(val) {
        if (val) {
          if (val.clientValidityDate) {
            this.form1.clientValidityDate = timestampToTime(
              val.clientValidityDate
            );
          }
          if (val.clientDisabledDate) {
            this.form1.clientDisabledDate = timestampToTime(
              val.clientDisabledDate
            );
          }
          if (val.clientGrade) {
            this.starLevel = Number(val.clientGrade);
          } else {
            this.starLevel = 0;
          }
        }
      },
      deep: true
    },
    open1: {
      handler: function(val) {
        if (val === false) {
          this.benginToend = [];
        }
      }
    }
  },
  methods: {
  
    /** 查询客户管理列表 */
    getList() {
      this.loading = true;
      listClients(this.queryParams).then(response => {
        this.clientsList = response.rows;
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
        clientId: undefined,
        clientUnit: undefined,
        clientAddress: undefined,
        clientLegalperson: undefined,
        clientContacts: undefined,
        clientPhone: undefined,
        clientTel: undefined,
        clientEmail: undefined,
        clientDept: undefined,
        clientZw: undefined,
        clientTjr: undefined,
        clientTjrId: undefined,
        remark: undefined,
        clientLicense: undefined,
        clientCode: undefined,
        clientTax: undefined,
        clientLoginuser: undefined,
        clientLoginpwd: undefined,
        clientValiditydate: undefined,
        clientDisableddate: undefined,
        clientExampersonid: undefined,
        clientExamperson: undefined,
        userinfoId: undefined,
        userinfoName: undefined,
        examinfo: undefined,
        isexamline: undefined,
        cancelaccount: undefined,
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        clientJb: undefined,
        engChinese: undefined,
        enPrename: undefined,
        enGender: undefined,
        enNo: undefined,
        enPlace: undefined,
        registerPhone: undefined,
        alias: undefined,
        state: undefined,
        isNormal: undefined,
        isDirect: undefined,
        isSign: undefined,
        wMerchandiserId: "",
        wMerchandiser: "",
        eMerchandiserId: "",
        eMerchandiser: "",
        isVip: undefined,
        signDate: undefined,
        signDisableddate: undefined,
        clientGrade: undefined,
        totalturncountavg: undefined,
        engChinese: undefined
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
      this.arrs = selection.map(item => item);
      this.ids = selection.map(item => item.clientId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    
    /** 查看按钮操作 */
    handleDetail() {
      this.reset();
      const clientId = this.ids;
      getClients(clientId).then(response => {
        this.form = response.data;
        this.formDisabled = true;
        this.open = true;
        this.title = "查看客户管理";
      });
    },
    
   
    /** 删除按钮操作 */
    handleDelete(row) {
      const clientIds = row.clientId || this.ids;
      this.$confirm(
        '是否确认删除所选数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delClients(clientIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
  
  }
};
</script>
<style>
a.starCss0 {
  font-size: 18px;
  font-weight: 500;
  color: #666666;
}
a.starCss1 {
  color: #ff0000;
}
a.starCss0:hover {
  color: #ff0000;
}
.el-form-item__label {
padding: 0 0 0 0;
}
.el-input--medium .el-input__inner {
    height: 26px;
    line-height: 26px;
}
.el-input--small .el-input__inner {
    height: 26px;
    line-height: 26px;
}
.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 14px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.el-table {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    max-width: 100%;
    background-color: #FFFFFF;
    font-size: 10px;
    color: #606266;
}
.el-table--medium td, .el-table--medium th {
    padding: 0 0;
}
.el-table .el-table__header-wrapper th {
    word-break: break-word;
    background-color: #f8f8f9;
    color: #515a6e;
    height: 25px;
    font-size: 10px;
}
.sh11 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 14px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.sh22 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 27px !important;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
</style>