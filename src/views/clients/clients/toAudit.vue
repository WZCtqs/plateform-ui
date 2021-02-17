<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="60px">
      <el-form-item label="单位名称" prop="clientUnit" label-width="70px">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="法人代表" prop="clientLegalperson" label-width="70px">
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

        <el-form-item label="推荐人" prop="nickName">
        <el-input
          v-model.trim="queryParams.nickName"
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['clients:clients:remove']"
        >删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" size="mini" :disabled="single" @click="handleExam" 
        v-hasPermi="['clients:toAudit:check']"
        >客户审核信息</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" size="mini" :disabled="single" @click="handleDetail"
        v-hasPermi="['clients:toAudit:query']"
        >查看</el-button>
      </el-col>
    </el-row>

    <el-table :class="this.heightScreen===590?'khsh2 el-tableCss0':'khsh1 el-tableCss0'"  
    ref="multipleTable" border v-loading="loading" :data="clientsList" 
    @selection-change="handleSelectionChange" 
    @row-click="handleRow" :height="heightScreen">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单位名称" align="center" prop="clientUnit" />
      <el-table-column label="法人代表" align="center" >
        <template slot-scope="scope">{{scope.row.clientLegalperson}}</template>
      </el-table-column>
      <el-table-column label="订舱人" align="center" prop="clientContacts" />
      <el-table-column label="推荐人" align="center" prop="clientTjr"  />
      <el-table-column label="职位" align="center" prop="clientZw" />
      <el-table-column label="手机号" align="center" prop="clientPhone" />
      <el-table-column label="固话" align="center" prop="clientTel" />
      <el-table-column label="订舱人邮箱" align="center" prop="clientEmail" />
      <el-table-column label="统一社会信用代码" align="center" prop="clientCode" />

      <el-table-column label="审核状态" align="center">未审核</el-table-column>
      <!-- <el-table-column label="审核状态" align="center" prop="isexamline" /> -->
      <el-table-column label="账号状态" align="center">
        <template slot-scope="scope">
          <span v-if="Number(scope.row.cancelaccount) === 0">启用</span>
          <span v-else-if="Number(scope.row.cancelaccount) === 1">锁定</span>
          <span v-else-if="Number(scope.row.cancelaccount) === 2">删除</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="是否失信" align="center" >
        <template slot-scope="scope">
          <span v-if="Number(scope.row.isNormal) === 0">否</span>
          <span v-else-if="Number(scope.row.isNormal) === 1">是</span>
          <span v-else></span>
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
              <span v-if="form.wMerchandiser">
                  {{form.wMerchandiser}}
              </span>
              <span v-else>
                  暂无
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="东向跟单员" prop="eMerchandiser">
              <span v-if="form.eMerchandiser">
                  {{form.eMerchandiser}}
              </span>
              <span v-else>
                  暂无
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="单位属性" prop="isDirect" >
              <el-radio v-model.trim="form.isDirect" label="0" :disabled="true">货代</el-radio>
              <el-radio v-model.trim="form.isDirect" label="1" :disabled="true">直客</el-radio>
              <el-radio v-model.trim="form.isDirect" label="2" :disabled="true">其他</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否失信客户" prop="isNormal">
              <el-radio v-model.trim="form.isNormal" label="0" :disabled="true">否</el-radio>
              <el-radio v-model.trim="form.isNormal" label="1" :disabled="true">是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="是否签署《国际运输物流服务合同》:" prop="isSign">
              <el-radio v-model.trim="form.isSign" label="0" :disabled="true">是</el-radio>
              <el-radio v-model.trim="form.isSign" label="1" :disabled="true">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
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
                placeholder=""
                :disabled="true"
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
                placeholder=""
                :disabled="true"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="备注">
              <el-input v-model.trim="form.remark" placeholder="" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 客户审核信息 弹框 -->
     <!-- 客户审核信息 弹框 -->
    <el-dialog title="客户信息-审核" :visible.sync="open1" width="60%" :destroy-on-close="true">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核状态">
              <template>
                <el-radio v-model.trim="form1.isexamline" label="1">审核通过</el-radio>
                <el-radio v-model.trim="form1.isexamline" label="2">审核不通过</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form1.isexamline === '1'">
          <el-col :span="12" >
            <el-form-item label="用户登录名">
              <el-input v-model.trim="form1.clientLoginuser" placeholder="请输入用户登录名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码">
              <el-input v-model.trim="form1.clientLoginpwd" placeholder="请输入用户密码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="form1.isexamline === '1'">
          <el-col :span="12">
            <el-form-item label="有效期限开始日期" prop="clientValiditydate" label-width="150px">
                <el-date-picker
                  v-model.trim="form1.clientValiditydate"
                  type="date"
                  :disabled="true"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>

            <el-col :span="12">
            <el-form-item label="有效期限结束日期" prop="clientDisableddate" label-width="150px">
                <el-date-picker
                 v-model.trim="form1.clientDisableddate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="form1.isexamline === '1'">
          <el-col :span="12">
            <el-form-item label="账号状态">
              <template>
                <el-radio v-model.trim="form1.cancelaccount" label="0">启用</el-radio>
                <el-radio v-model.trim="form1.cancelaccount" label="1">锁定</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form1.isexamline === '1'">
          <el-col :span="20">
            <el-form-item label="单位属性" prop="isDirect">
               <el-radio v-model.trim="form1.isDirect" label="0" >货代</el-radio>
              <el-radio v-model.trim="form1.isDirect" label="1" >直客</el-radio>
              <el-radio v-model.trim="form1.isDirect" label="2" >其他</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form1.isexamline === '2'">
          <el-col :span="20">
            <el-form-item label="审核失败原因">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入内容"
                v-model.trim="form1.examinfo"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel1">取 消</el-button>
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
  exportClients,
  auditClients
} from "@/api/clients/clients";
import { timestampToTime } from "@/utils/zhonghao";
import "@/assets/styles/selfCss0.css";

export default {
  name:'ToAudit',
  data() {
    return {
      form1: {}, // 客户审核信息form1表单
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
      // 是否签订合同字典
      isSignOptions: [],
      heightScreen:null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientUnit: null,
        clientLegalperson: null,
        clientContacts: null,
        isexamline: "0", // 待审核的客户
        isNormal: "0",
        deptCode:null,
      },
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
      // 表单参数
      form: {},
      formDisabled: false,
      rules: {}, // 客户信息form表单校验规则
      // 表单校验
      rules1: {
        clientLoginUser: [
          {
            required: true,
            message: "请输入登录名",
            trigger: "blur"
          }
        ],
        clientLoginPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        clientDisableddate: [
          {
            required: true,
            message: "请输入账号有效期限",
            trigger: "blur"
          }
        ],
        cancelAccount: [
          {
            required: true,
            message: "请选择账号状态",
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
        isexamline: [
          {
            required: true,
            message: "请选择客户审核状态",
            trigger: "blur"
          }
        ],
        examinfo: [
          {
            required: true,
            message: "请填写审核原因",
            trigger: "blur"
          }
        ],
        
      },
      starLevel: 0
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
        this.heightScreen = 400
      }
  },
  watch: {
    form1: {
      handler: function(val) {
        if (val) {
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
        }else{
          if(this.form1.clientValiditydate){
            this.benginToend[0]=this.form1.clientValiditydate
          }else{
             this.benginToend[0]='00-00-00'
          }
          if(this.form1.clientDisableddate){
            this.benginToend[1]=this.form1.clientDisableddate
          }else{
            this.benginToend[1]='00-00-00'
          }
        }
      }
    },
  },
  methods: {
    getTime() {
      if(this.benginToend[0]){
      this.form1.clientValidityDate = timestampToTime(this.benginToend[0]);
      }
      if(this.benginToend[1]){
      this.form1.clientDisableddate = timestampToTime(this.benginToend[1]);
      }
    },

    // 客户审核弹框中 “客户等级”的设置
    overStarFn(index) {
      // alert(index)
      this.starLevel = index;
      this.form1.clientGrade = index;
    },

    // 客户审核表单重置
    resetForm1() {
      this.form1 = {};
    },
    // 打开 客户审核 弹框
    handleExam() {
      this.resetForm1();
      const clientId = this.ids;
      
      getClients(clientId).then(response => {
        this.form1 = response.data;
        this.form1.isexamline='1'
        this.form1.isDirect='0'
        let str = this.form1.clientLoginuser
        this.form1.clientLoginpwd = str.substring(str.length-6,str.length)
       
        this.open1 = true;
      });
    },
    // 客户审核信息 提交按钮
    submitForm1() {
      this.$refs["form1"].validate(valid => {
        if (valid) {
          
          auditClients(this.form1).then(res => {
            if(res.code === 200){
              
              this.open1 = false;
              this.getList()
            }else{
              this.$message.error(res.msg)
            }
           
          });
        }
      });
    },
    // 客户审核信息 取消按钮
    cancel1() {
      this.resetForm1();
      this.open1 = false;
    },

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
        isDirect: undefined,
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
    handleRow(obj){
      this.$refs.multipleTable.toggleRowSelection(obj);
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
.khsh1 .cell {
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
.khsh2 .cell {
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
