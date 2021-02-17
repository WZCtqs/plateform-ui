<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary"  size="mini"  @click="dialogFormVisible = true">修改配置信息</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  size="mini"  @click="dialogFormVisible1 = true">发送测试邮件</el-button>
      </el-form-item>
    </el-form>
    <!-- 修改配置信息 -->
<el-dialog title="修改配置信息" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="SMTP服务器：" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入消息类型"></el-input>
    </el-form-item>
    <el-form-item label="端口号:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入消息类型"></el-input>
    </el-form-item>
    <el-form-item label="往返:" :label-width="formLabelWidth">
     <el-select placeholder="请选择活动区域">
        <el-option label="需要" value="shanghai"></el-option>
        <el-option label="不需要" value="beijing"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
<!-- 发送测试邮件 -->
<el-dialog title="发送测试邮件" :visible.sync="dialogFormVisible1">
  <el-form :model="form">
    <el-form-item label="Email：" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入收件人邮箱"></el-input>
    </el-form-item>
    <el-form-item label="主题:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" ></el-input>
    </el-form-item>
    <el-form-item  :label-width="formLabelWidth">
      <el-input type="textarea" v-model.trim="form.name" autocomplete="off" ></el-input>
    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible1 = false">取消</el-button>
    <el-button type="primary" @click="dialogFormVisible1 = false">发送</el-button>
  </div>
</el-dialog>

    <el-table  v-loading="loading" :data="list">
      <el-table-column  width="30" align="center" />
      <el-table-column label="SMTP服务器" align="center" prop="operName" />
      <el-table-column  label="SMTP端口号" align="center" prop="operTime">
        <template slot-scope="scope" >
          <span type="selection"></span>
          <el-button size="mini"
                     type="text"
                     @click="handleSendRecord"
                    >编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="邮件发送认证" align="center" prop="title" >
         <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                    @click="dialogFormVisible1 = true"
                    >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
   
   <el-form >
     <el-row type="checkbox">
          <el-col :span="3" >
         名称
          </el-col>
           <el-col :span="4">
          账号
          </el-col>
           <el-col :span="4">
          密码
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="3">中欧国内运踪</el-col>
          <el-col :span="3">yunzong1@zih718</el-col>
          <el-col :span="3">******</el-col>
        </el-row>

   </el-form>
     
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
   
  </div>
</template>

<script>
//import { list, delOperlog, cleanOperlog, exportOperlog } from "@/api/basicInfo/msg_install";

export default {
  name: "Operlog",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      // open: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        secondModelName: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_oper_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then( response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 删除弹框
     open() {
        this.$confirm('确定删除该消息类型?', '删除消息类型', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 保存设置
       open1() {
        this.$prompt('是否需要保存设置', '保存设置', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
    // 操作日志状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.businessType);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
  //  邮件编辑跳转
    handleSendRecord(){
this.$router.push({ path: '/documnet/station' })
    },
  
   
  }
};
</script>

