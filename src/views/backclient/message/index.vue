<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="标题"
                    prop="title">
        <el-input v-model.trim="queryParams.title"
                  placeholder="请输入标题"
                  clearable
                  style="width:130px;"
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="新闻类型"
                    prop="type">
        <el-select v-model.trim="queryParams.type"
                   clearable
                   style="width:120px;"
                   placeholder="请选择">
          <el-option v-for="item in typOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示"
                    prop="isDisplay">
        <el-select v-model.trim="queryParams.isDisplay"
                   clearable
                   style="width:90px;"
                   placeholder="请选择">
          <el-option v-for="item in dispOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶"
                    prop="isTop">
        <el-select v-model.trim="queryParams.isTop"
                   clearable
                   style="width:90px;"
                   placeholder="请选择">
          <el-option v-for="item in topOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语言"
                    prop="language">
        <el-select v-model.trim="queryParams.language"
                   clearable
                   style="width:90px;"
                   placeholder="请选择">
          <el-option v-for="item in laugOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
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
                   v-hasPermi="['backclient:message:add']">新增</el-button>
        <!-- <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button> -->
      </el-form-item>
      <!-- <el-form-item label="摘要"
                    prop="abstract">
        <el-input v-model.trim="queryParams.abstract"
                  placeholder="请输入摘要"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="内容"
                    prop="concent">
        <el-input v-model.trim="queryParams.concent"
                  placeholder="请输入内容"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="形象图"
                    prop="picture">
        <el-input v-model.trim="queryParams.picture"
                  placeholder="请输入形象图"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="顺序"
                    prop="order">
        <el-input v-model.trim="queryParams.order"
                  placeholder="请输入顺序"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
    </el-form>

    <el-table v-loading="loading"
              border
              :data="messageList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="标题"
                       align="center"
                       prop="title" />
      <!-- <el-table-column label="摘要"
                       align="center"
                       prop="abstract" />
      <el-table-column label="内容"
                       align="center"
                       prop="concent" /> -->
      <!-- <el-table-column label="形象图"
                       align="center"
                       prop="picture" /> -->
      <el-table-column label="新闻类型"
                       align="center"
                       prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type==0">班列公告</span>
          <span v-else-if="scope.row.type==1">班列新闻</span>
          <span v-else>开行时刻</span>
        </template>
      </el-table-column>
      <el-table-column label="是否显示"
                       align="center"
                       prop="isDisplay">
        <template slot-scope="scope">
          <span v-if="scope.row.isDisplay==0">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否置顶"
                       align="center"
                       prop="isTop">
        <template slot-scope="scope">
          <span v-if="scope.row.isTop==0">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="顺序"
                       align="center"
                       prop="order" />
      <el-table-column label="语言"
                       align="center"
                       prop="language">
        <template slot-scope="scope">
          <span v-if="scope.row.language==0">中文</span>
          <span v-else-if="scope.row.language==1">英文</span>
          <span v-else-if="scope.row.language==2">俄语</span>
          <span v-else>德语</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['backclient:message:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['backclient:message:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改新闻信息对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="800px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="14">
            <el-form-item label="标题"
                          prop="title">
              <el-input v-model.trim="form.title"
                        placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="摘要"
                          prop="abstracts">
              <el-input v-model.trim="form.abstracts"
                        placeholder="请输入摘要" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="形象图"
                          prop="picture">
              <el-upload :action="uploadImgUrl"
                         :headers="headers"
                         list-type="picture-card"
                         :limit="1"
                         :on-exceed="beforeAvatarUpload"
                         :on-preview="handlePictureCardPreview"
                         :on-success="imgSuccess"
                         :file-list="fileList"
                         :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%"
                     :src="form.picture"
                     alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="新闻类型"
                          prop="type">
              <el-radio-group v-model.trim="form.type">
                <el-radio v-for="dict in typRadio"
                          :key="dict.value"
                          :label="dict.value">{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="删除标志"
                      prop="delFlag">
          <el-input v-model.trim="form.delFlag"
                    placeholder="请输入删除标志" />
        </el-form-item> -->
          <el-col :span="10">
            <el-form-item label="是否显示"
                          prop="isDisplay">
              <el-radio-group v-model.trim="form.isDisplay">
                <el-radio v-for="dict in disRadio"
                          :key="dict.value"
                          :label="dict.value">{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="是否置顶"
                          prop="isTop">
              <el-radio-group v-model.trim="form.isTop">
                <el-radio v-for="dict in topRadio"
                          :key="dict.value"
                          :label="dict.value">{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="顺序"
                          prop="order">
              <el-input-number v-model.trim="form.order"
                               :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="语言"
                          prop="language">
              <el-radio-group v-model.trim="form.language">
                <el-radio v-for="dict in laugRadio"
                          :key="dict.value"
                          :label="dict.value">{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容"
                          prop="concent">
              <editText v-model.trim="form.concent" />
              <!-- <el-input v-model.trim="form.concent"
                        placeholder="请输入内容" /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           style="margin-top:10px;"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMessage, getMessage, delMessage, addMessage, updateMessage, exportMessage } from "@/api/backclient/message";
import editText from "@/components/Editor/index.vue"
import { getToken } from '@/utils/auth'
export default {
  name: 'Message',
  components: { editText },
  data () {
    return {
      fileList: [{
        name: '',
        url: ''
      }],
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/backclient/image/insertfile",
      headers: {},
      dialogVisible: false,
      typOptions: [
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
      dispOptions: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      topOptions: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      laugOptions: [
        {
          value: '0',
          label: '中文'
        },
        {
          value: '1',
          label: '英文'
        }, {
          value: '2',
          label: '俄语'
        },
        {
          value: '3',
          label: '德语'
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
      disRadio: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      topRadio: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      laugRadio: [
        {
          value: '0',
          label: '中文'
        },
        {
          value: '1',
          label: '英文'
        }, {
          value: '2',
          label: '俄语'
        },
        {
          value: '3',
          label: '德语'
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
      // 新闻信息表格数据
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
        // abstract: undefined,
        // concent: undefined,
        // picture: undefined,
        // order: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        abstracts: [
          { required: true, message: "请输入摘要", trigger: "blur" }
        ],
        picture: [
          { required: true, message: "请选择上传的图片", trigger: "change " }
        ],
        type: [
          { required: true, message: "请选择新闻类型", trigger: "change " }
        ],
        isDisplay: [
          { required: true, message: "请选择是否显示", trigger: "change " }
        ],
        isTop: [
          { required: true, message: "请选择是否置顶", trigger: "change " }
        ],
        order: [
          { required: true, message: "请选择顺序", trigger: "change" }
        ],
        language: [
          { required: true, message: "请选择语言", trigger: "change " }
        ],
        concent: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.headers = { 'Authorization': 'Bearer ' + getToken() }
    this.getList();
  },
  methods: {
    // 上传之前判定是否只能上传一张图片
    beforeAvatarUpload (files, fileList) {
      if (files.length == 1) {
        this.$notify({
          title: '警告',
          message: '只允许上传一张图片！！！',
          type: 'warning'
        });
      }
    },
    // 删除图片
    handleRemove (file, fileList) {
    },
    // 上传图片
    handlePictureCardPreview (file) {
      // this.form.picture = file.url;
      this.dialogVisible = true;
    },
    // 图片上传成功
    imgSuccess (file) {
      this.form.picture = file.fileUrl;
      // this.dialogVisible = true;
    },
    /** 查询新闻信息列表 */
    getList () {
      this.loading = true;
      listMessage(this.queryParams).then(response => {
        this.messageList = response.rows;
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
      this.fileList = [];
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
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加新闻信息";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      const query = { id: id }
      getMessage(query).then(response => {
        this.fileList = [{ name: '', url: '' }];
        this.form = response.data;
        this.fileList[0].name = '';
        this.fileList[0].url = response.data.picture;
        this.open = true;
        this.title = "修改新闻信息";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMessage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMessage(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delMessage(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有新闻信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportMessage(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>
<style scoped>
.el-upload {
  display: block !important;
}
</style>