<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="handleJump"
                   v-hasPermi="['document:remind:add']">节点维护</el-button>
      </el-form-item>
      <el-form-item prop="uploaded">
        <el-select v-model.trim="queryParams.uploaded"
                   clearable
                   style="width:160px;"
                   placeholder="单证状态">
          <el-option v-for="item in typOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="emailStatus">
        <el-select v-model.trim="queryParams.emailStatus"
                   clearable
                   style="width:160px;"
                   placeholder="发送状态">
          <el-option v-for="item in dispOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="classDate">
        <el-date-picker v-model.trim="queryParams.classDate"
                        type="date"
                        clearable
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="请选择班列日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="orderNumber">
        <el-input v-model.trim="queryParams.orderNumber"
                  placeholder="请输入委托书编号"
                  clearable
                  style="width:200px;"
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="messageList">
      <el-table-column label="班列编号"
                       align="center"
                       prop="orderClassBh" />
      <el-table-column label="委托书编号"
                       align="center"
                       prop="orderNumber" />
      <el-table-column label="托书审核通过时间"
                       align="center"
                       prop="auditTime">
        <template slot-scope="scope">
          <span v-if="scope.row.auditTime">{{ parseTime(scope.row.auditTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单证名称"
                       align="center"
                       prop="fileTypeText" />
      <el-table-column label="单证理论提供时间"
                       align="center"
                       prop="normalSupplyNode">
        <template slot-scope="scope">
          <span v-if="scope.row.normalSupplyNode">{{ parseTime(scope.row.normalSupplyNode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节点内单证提供状态"
                       align="center"
                       prop="uploaded">
        <template slot-scope="scope">
          <span v-if="scope.row.uploaded==0"
                style="color: red">未上传</span>
          <span v-else-if="scope.row.uploaded==1"
                style="color: green">上传</span>
        </template>
      </el-table-column>
      <el-table-column label="消息发送状态"
                       align="center"
                       prop="emailStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.emailStatus==1"
                style="color: red">{{scope.row.emailfail}}</span>
          <span v-else-if="scope.row.emailStatus==0"
                style="color: green">发送成功</span>
          <span v-else-if="scope.row.emailStatus==null"
                style="color: blue">-</span>
        </template>
      </el-table-column>
      <el-table-column label="单证实际提供时间"
                       align="center"
                       prop="uploadTime">
        <template slot-scope="scope">
          <span v-if="scope.row.uploadTime">{{ parseTime(scope.row.uploadTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template>
          <el-button size="mini"
                     type="text"
                     @click="handleSendRecord"
                     v-hasPermi="['document:remind:send']">发送记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />
    <!--节点维护对话框 -->
    <el-dialog title="节点维护"
               :visible.sync="open"
               width="500px">
      <el-form :model="form"
               :inline="true"
               :rules="rules"
               ref="form"
               label-width="120px">
        <el-form-item label="班列日期"
                      prop="classDate">
          <el-date-picker v-model.trim="form.classDate"
                          type="date"
                          clearable
                          style="width:240px"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          @blur="removeActive()"
                          @change="remindTime"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="委托书编号">
          <el-input v-model.trim="form.orderNumber"
                    placeholder="请输入"
                    clearable
                    @blur="removeActive()"
                    style="width:240px">
          </el-input>

          <!-- <el-button type="primary"
                     @click="removeActive()">确定</el-button> -->
        </el-form-item>
        <el-form-item label="单证分类(选填)">
          <el-select v-model.trim="form.title"
                     placeholder="请选择"
                     @change="agreeChange"
                     clearable
                     style="width:240px">
            <el-option v-for="item in cleOptions"
                       :key="item.id"
                       :label="item.fileTypeText"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单证名称(选填)"
                      prop="fileTypeKey">
          <el-select v-model.trim="form.fileTypeKey"
                     placeholder="请选择"
                     clearable
                     style="width:240px"
                     @change="remindTime">
            <el-option v-for="item in dzmOptions"
                       :key="item.fileTypeKey"
                       :label="item.fileTypeText"
                       :value="item.fileTypeKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认提供时间"
                      prop="time">
          <el-input v-model.trim="form.time"
                    style="width:240px"
                    :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="更改默认时间"
                      prop="newRemind">
          <template>
            <el-input-number v-model.trim="form.newRemind"
                             clearable
                             @change="handleChange"></el-input-number>

          </template>

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
import { listRemind, getMessage, getRemindTime, getOrderByNumber, getParentTypeList, getSonTypeList, addRemind } from "@/api/document/document_reminder";
import editText from "@/components/Editor/index.vue"
import { getToken } from '@/utils/auth'
export default {
  name: "Document_reminder",
  components: { editText },
  name: 'Document_reminder',
  data() {
    return {
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload",
      headers: {},
      dialogVisible: false,
      typOptions: [
        {
          value: '0',
          label: '未上传'
        },
        {
          value: '1',
          label: '上传'
        }
      ],
      dispOptions: [
        {
          value: '0',
          label: '发送成功'
        },
        {
          value: '1',
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
      cleOptions: [],
      dzmOptions: [],
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
        auditTime: undefined,
        classDate: undefined,
        orderClassBh: undefined,
        emailStatus: undefined,
        emailfail: undefined,
        fileTypeKey: undefined,
        fileTypeText: undefined,
        normalSupplyNode: undefined,
        orderId: undefined,
        orderNumber: undefined,
        uploadTime: undefined,
        uploaded: undefined,
      },
      // 表单参数
      form: {
        time: '',
        newRemind: '0',
        orderId: ''
      },
      // 表单校验
      rules: {
        classDate: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        orderNumber: [
          { required: true, message: '请输入委托书编号', trigger: 'blur' }
        ],
        newRemind: [
          { type: 'date', required: true, message: '请选择更改默认时间天数', trigger: 'change' }
        ],
      }
    };
  },
  created() {
    this.headers = { 'Authorization': 'Bearer ' + getToken() }
    this.getList();
    this.parentSelect();
  },
  methods: {
    /** 获取一级单证分类 */
    parentSelect() {
      getParentTypeList().then(response => {
        this.cleOptions = response.data;
      })
    },
    //获取二级单证分类
    agreeChange() {
      const stage = this.form.title;
      getSonTypeList(stage).then(response => {
        this.dzmOptions = response.data;
      });
    },
    //根据舱位号验证是否存在订单
    removeActive() {
      const orderNumber = this.form.orderNumber;
      const Date = this.form.classDate;
      if (this.form.orderNumber) {
        
        getOrderByNumber(orderNumber).then(response => {
          if (response.data) {
            this.msgSuccess("舱位号输入成功");
            this.form.orderId = response.data.orderId
            this.classDate = response.data.classDate;
            if (this.form.classDate) {
              if ((this.classDate.substring(0, 10)) != Date) {
                this.msgSuccess("舱位号和班列日期不符合");
                this.form.classDate = '';
              }
            }
          } else {
            this.msgError("舱位号不存在");
          }
        });
      }
    },
    //根据单证类型和班列时间获取单证提醒时间
    remindTime() {
      if (this.form.classDate && this.form.fileTypeKey) {
        const idarr = {
          classDate: this.form.classDate,
          fileTypeKey: this.form.fileTypeKey
        }
        getRemindTime(idarr).then(response => {
          this.form.time = response.msg;
        });
      }
    },
    /** 查询提醒设置列表 */
    getList() {
      this.loading = true;
      listRemind(this.queryParams).then(response => {
        this.messageList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
      this.loading = false
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        classDate: undefined,
        fileTypeKey: undefined,
        newRemind: '0',
        orderId: undefined,
        time: ''
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
    // 节点维护,页面跳转
    handleJump() {
      this.reset();
      this.open = true;
    },
    // 发送记录,页面跳转
    handleSendRecord() {
      this.$alert('请前往系统管理-系统日志-消息发送记录查看发送记录', '标题名称', {
        confirmButtonText: '确定',
      });

    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.form.orderId) {
        if (isNaN(this.form.time) && !isNaN(Date.parse(this.form.time))) {
          this.$refs["form"].validate(valid => {
            if (valid) {
              addRemind(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          });
        } else {
          this.msgError("没有默认提供时间，请更改选择！");
        }
      } else {
        this.msgError("请点击确定委托书编号是否存在！");
      }
    }, handleChange(value) {
      console.log(value);
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // }
  },

};
</script>
