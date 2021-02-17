<template>
  <div class="app-container">
     <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
             <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="dialogFormVisible = true">修改配置信息</el-button>
      </el-form-item>
       <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="dialogFormVisible1 = true">发送测试邮件</el-button>
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
    <el-form ref="form" :model="form" label-width="100px">
  <el-form-item label="SMTP服务器">
    <span>smtp.qiye.163.com</span>
  </el-form-item>
  
  <el-form-item label="SMTP端口号">
    <span>26</span>
  </el-form-item>

  <el-form-item label="邮件发送认证">
    <span>需要</span>
  </el-form-item>

</el-form>
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
             <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="dialogVisible = true">新增</el-button>
      </el-form-item>
       <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="handleJump">编辑</el-button>
      </el-form-item>
       <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="handleJump">删除</el-button>
      </el-form-item>
     <el-dialog title="新增" :visible.sync="dialogVisible">
  <el-form :model="form">
    <el-form-item label="名称:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入消息类型"></el-input>
    </el-form-item>
    <el-form-item label="账号:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入消息类型"></el-input>
    </el-form-item>
    <el-form-item label="密码:" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入消息类型"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </div>
</el-dialog>
     
    </el-form>

    <el-table v-loading="loading"
              :data="messageList"
              >
      <el-table-column label="名称"
                       align="center"
                       prop="blrq" />
      <el-table-column label="账号"
                       align="center"
                       prop="wtsbh"/>
      <el-table-column label="密码"
                       align="center"
                       prop="tsshtgsj"/>
      
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
  </div>
</template>

<script>
import { listMessage, getMessage, delMessage, addMessage, updateMessage, exportMessage } from "@/api/backclient/message";
import editText from "@/components/Editor/index.vue"
import { getToken } from '@/utils/auth'
// 引入假数据
import { documentReminder }  from "@/api/document/document_reminder"
export default {
  components: { editText },
  data () {
    return {
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload",
      headers: {},
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogVisible: false,
      formLabelWidth:"140px",
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
      typOptions: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '已提供'
        },
        {
          value: '2',
          label: '未提供'
        },
        {
          value: '3',
          label: '已确认'
        },
        {
          value: '4',
          label: '未确认'
        }
      ],
      dispOptions: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '发送成功'
        },
        {
          value: '2',
          label: '发送失败'
        }
      ],
      typRadio: [
        {
          value: '0',
          label: '班列公告'
        },
        {
          value: '1',
          label: '班列新闻'
        },
        {
          value: '2',
          label: '开行时刻'
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
      // 提醒设置信息表格数据
      messageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        type: undefined,
        isDisplay: undefined,
        isTop: undefined,
        language: undefined
      },
     
     
    };
  },
  created () {
    this.headers = { 'Authorization': 'Bearer ' + getToken() }
    this.getList();
  },
  methods: {
   
    /** 查询提醒设置列表 */
    getList () {
      // this.loading = true;
      // listMessage(this.queryParams).then(response => {
      //   this.messageList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
      this.loading = false
      this.messageList = documentReminder
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        title: undefined,
        abstracts: undefined,
        concent: undefined,
        picture: '',
        type: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        isDisplay: undefined,
        isTop: undefined,
        order: undefined,
        language: undefined
        // delFlag: undefined,
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
    // 节点维护,页面跳转
    handleJump(){
this.$router.push({ path: '/documnet/document_type' })
    },
    // 发送记录,页面跳转
    handleSendRecord(){
this.$router.push({ path: '/documnet/station' })
    },
   
  }
};
</script>
