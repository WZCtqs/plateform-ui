<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary"  size="mini"  @click="dialogFormVisible = true">新建类型</el-button>
      </el-form-item>
    </el-form>
<el-dialog title="新建消息类型" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="类型名称:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入消息类型"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
<el-form :model="form">
    <el-table  v-loading="loading" :data="list">
      <el-table-column  width="30" align="center" />
      <el-table-column label="消息类型" align="center" prop="operName" />
      <el-table-column  label="邮件" align="center" prop="operTime">
        <!-- <template slot-scope="scope" type="selection">
         <el-checkbox ></el-checkbox>
        </template> -->
        <template slot-scope="scope" >
          <span type="selection"></span>
          <el-button size="mini"
                     type="text"
                     @click="handleSendRecord"
                    >编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="站内消息" align="center" prop="title" >
         <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                    @click="dialogFormVisible1 = true"
                    >编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="短信" align="center" prop="businessType" :formatter="typeFormat" >
         <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                      @click="dialogFormVisible2 = true"
                    >编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" prop="operIp"  :show-overflow-tooltip="true" >
         <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click="open"
                    >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-form>
   
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="float:right"  size="mini"  @click="open1">保存设置</el-button>
     </div>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 站内信弹框 -->
    <el-dialog title="站内信模板编辑" :visible.sync="dialogFormVisible1">
  <el-form :model="form">
    <el-form-item label="站内信标题:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入标题名称"></el-input>
    </el-form-item>
    <el-form-item label="收件人:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" ></el-input>
    </el-form-item>
    <el-form-item label="内容模板:" :label-width="formLabelWidth">
      <el-input type="textarea" v-model.trim="form.name" autocomplete="off" placeholder="铁路运费报价规则已更新，请及时查看"></el-input>
    </el-form-item>
    <el-form-item  :label-width="formLabelWidth">
      <p>内容不能为空，长度限制在1000字符以内</p>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible1 = false">确 定</el-button>
  </div>
</el-dialog>
<!-- 短信编辑弹框 -->
<el-dialog title="短信模板编辑" :visible.sync="dialogFormVisible2">
  <el-form :model="form">
    <el-form-item label="短信标题:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入标题名称"></el-input>
    </el-form-item>
    <el-form-item label="收件人:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" ></el-input>
    </el-form-item>
    <el-form-item label="内容模板:" :label-width="formLabelWidth">
      <el-input type="textarea" v-model.trim="form.name" autocomplete="off" placeholder="报关单证已超节点未提供，请及时上传"></el-input>
    </el-form-item>
    <el-form-item  :label-width="formLabelWidth">
      <p>内容不能为空，长度限制在1000字符以内</p>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
  </div>
</el-dialog>
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

