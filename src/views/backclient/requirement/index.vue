<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
     
      <el-form-item>
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['backclient:requirement:add']">新增</el-button>
                   <el-button size="mini"
                     type="success"
                     icon="el-icon-edit"
                     :disabled="single"
                     @click="handleUpdate"
                     v-hasPermi="['backclient:requirement:edit']">修改</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['backclient:requirement:remove']">删除</el-button>
        <!-- <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="requirementList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="类型"
                       align="center"
                       prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type==0">货物包装要求(Goods Packaging Requirements)</span>
          <span v-else-if="scope.row.type==1">集装箱使用要求(Container to use)</span>
          <span v-else-if="scope.row.type==2">通用货物装箱加固规则(General Cargo Packing Reinforcement Requirements)</span>
          <span v-else>出口班列客户自备箱进展要求</span>
        </template>
      </el-table-column>
     
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改铁路要求对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="700px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="类型"
                      prop="type">
          <el-select v-model.trim="form.type"
                     clearable
                     style="width:100%;"
                     placeholder="请选择">
            <el-option v-for="item in typOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容中文"
                      prop="content">
          <editText v-model.trim="form.content" />
        </el-form-item>
         <el-form-item label="内容英文"
                      prop="enContent">
          <editText v-model.trim="form.enContent" />
        </el-form-item>
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
import { listRequirement, getRequirement, delRequirement, addRequirement, updateRequirement, exportRequirement } from "@/api/backclient/requirement";
import editText from "@/components/Editor/index.vue"
export default {
  components: { editText },
  data () {
    return {
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
      typOptions: [
        {
          value: '0',
          label: '货物包装要求(Goods Packaging Requirements)'
        },
        {
          value: '1',
          label: '集装箱使用要求(Container to use)'
        }, {
          value: '2',
          label: '通用货物装箱加固规则(General Cargo Packing Reinforcement Requirements)'
        }, {
          value: '3',
          label: '出口班列客户自备箱进展要求'
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
      // 铁路要求表格数据
      requirementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        content: undefined,
        type: undefined,
        language: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        language: [
          { required: true, message: "请选择语言", trigger: "change " }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询铁路要求列表 */
    getList () {
      this.loading = true;
      listRequirement(this.queryParams).then(response => {
        this.requirementList = response.rows;
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
        id: undefined,
        content: undefined,
        enContent: undefined,
        type: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        language: undefined
      };
      this.resetForm("form");
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
      this.title = "添加铁路要求";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getRequirement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改铁路要求";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRequirement(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRequirement(this.form).then(response => {
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
        return delRequirement(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有铁路要求数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportRequirement(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>