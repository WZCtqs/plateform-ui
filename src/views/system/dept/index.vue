<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- <el-form-item label="部门名称">
        <el-input v-model.trim="queryParams.deptName"
                  placeholder="请输入部门名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model.trim="queryParams.status"
                   placeholder="部门状态"
                   clearable
                   size="small">
          <el-option v-for="dict in statusOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button class="filter-item"
                   type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button> -->
        <el-button class="filter-item"
                   type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:dept:add']">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="deptList"
              row-key="deptId"
              :header-cell-style="headClass"
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="deptName"
                       align="center"
                       width="200"
                       label="组织机构"></el-table-column>
      <el-table-column prop="deptCode"
                       align="center"
                       width="180"
                       label="部门编号"></el-table-column>
      <el-table-column prop="leader"
                       align="center"
                       width="160"
                       label="主负责人"></el-table-column>
      <el-table-column prop="phone"
                       align="center"
                       label="外线电话"></el-table-column>
      <!-- <el-table-column prop="organizationOuterPhone"
                       align="center"
                       width="110"
                       label="内线电话"></el-table-column>
      <el-table-column prop="organizationZipcode"
                       align="center"
                       label="邮政区号"></el-table-column> -->
      <el-table-column prop="orderNum"
                       align="center"
                       label="显示顺序"></el-table-column>
      <el-table-column prop="status"
                       align="center"
                       label="部门状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">正常</span>
          <span v-else>停用</span>
        </template></el-table-column>
      <el-table-column prop="address"
                       align="center"
                       label="所在地址"></el-table-column>
      <!-- <el-table-column prop="status"
                       label="状态"
                       :formatter="statusFormat"></el-table-column> -->
      <!-- <el-table-column label="创建时间"
                       align="center"
                       prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作"
                       align="center"
                       width="180"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-plus"
                     @click="handleAdd(scope.row)"
                     v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button v-if="scope.row.parentId != 0"
                     size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:dept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改 部门对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="600px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门编号"
                          prop="deptCode">
              <el-input v-model.trim="form.deptCode"
                        placeholder="请输入部门编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称"
                          prop="deptName">
              <el-input v-model.trim="form.deptName"
                        placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主负责人"
                          prop="leader">
              <el-input v-model.trim="form.leader"
                        placeholder="请输入主负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人"
                          prop="organizationAssistantManager">
              <el-input v-model.trim="form.organizationAssistantManager"
                        placeholder="请输入负责人"
                        maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外线电话"
                          prop="phone">
              <el-input v-model.trim="form.phone"
                        placeholder="请输入外线电话"
                        maxlength="13" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内线电话"
                          prop="organizationOuterPhone">
              <el-input v-model.trim="form.organizationOuterPhone"
                        placeholder="请输入内线电话"
                        maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮政区号"
                          prop="organizationZipcode">
              <el-input v-model.trim="form.organizationZipcode"
                        placeholder="请输入邮政区号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点位置"
                          prop="parentId">
              <treeselect v-model.trim="form.parentId"
                          :options="deptOptions"
                          placeholder="选择节点位置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model.trim="form.status">
                <el-radio v-for="dict in statusOptions"
                          :key="dict.dictValue"
                          :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序"
                          prop="orderNum">
              <el-input-number v-model.trim="form.orderNum"
                               controls-position="right"
                               :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱"
                          prop="email">
              <el-input v-model.trim="form.email"
                        placeholder="邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所在地址"
                          prop="address">
              <el-input v-model.trim="form.address"
                        placeholder="请输入所在地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="说明"
                          prop="remark">
              <el-input v-model.trim="form.remark"
                        type="textarea"
                        placeholder="请填写详细说明" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { listDept, getDept, treeselect, delDept, addDept, updateDept } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  components: { Treeselect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 部门部门树选项
      deptOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        deptCode: undefined,
        deptName: undefined,
        leader: undefined,
        organizationAssistantManager: undefined,
        phone: undefined,
        organizationOuterPhone: undefined,
        organizationZipcode: undefined,
        parentId: undefined,
        status: "0",
        orderNum: undefined,
        email: undefined,
        address: undefined,
        remark: undefined,
      },
      // 表单 校验
      rules: {
        deptCode: [
          { required: true, message: "部门编号不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        leader: [
          { required: true, message: "主负责人不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "排序不能为空", trigger: "change" }
        ],
        parentId: [
          { required: true, message: "请选择节点", trigger: "change " }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created () {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 设置表 头居中
    headClass () {
      return 'text-align: center;background:#eef1f6;'
    },
    /** 查询部门列表 */
    getList () {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = response.data;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect () {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 字典状态字典翻译
    statusFormat (row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        deptCode: undefined,
        deptName: undefined,
        leader: undefined,
        organizationAssistantManager: undefined,
        phone: undefined,
        organizationOuterPhone: undefined,
        organizationZipcode: undefined,
        parentId: undefined,
        status: "0",
        orderNum: undefined,
        email: undefined,
        address: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd (row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加部门";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      this.getTreeselect();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        if (this.form.parentId === 0 && this.form.ancestors === '0') {
          this.form['parentId0'] = this.form.parentId
          this.form.parentId = this.form.deptId
        }
        this.open = true;
        this.title = "修改部门";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            if (this.form['parentId0'] === 0 && this.form.ancestors === '0') {
              this.form.parentId = 0
              delete this.form.parentId0
            }
            updateDept(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDept(this.form).then(response => {
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
      this.$confirm('是否确认删除该条数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delDept(row.deptId);
      }).then((res) => {
        if (res.code === 200) {
          this.getList();
          this.msgSuccess("删除成功");
        } else {
          this, msgError(res.msg)
        }
      })
    }
  }
}
</script>