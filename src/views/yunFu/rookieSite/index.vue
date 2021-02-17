<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="地名"
                    prop="siteName">
        <el-input v-model.trim="queryParams.siteName"
                  placeholder=""
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   v-hasPermi="['yunFu:rookieSite:query']"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['yunFu:rookieSite:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['yunFu:rookieSite:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="rookieSiteList"
              border
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="地名"
                       align="center"
                       prop="siteName" />
      <el-table-column label="时区"
                       align="center"
                       prop="timeZone">
        <template slot-scope="scope">
          <span v-if="scope.row.timeZone==1">1</span>
          <span v-else-if="scope.row.timeZone==2">2</span>
          <span v-else-if="scope.row.timeZone==3">3</span>
          <span v-else-if="scope.row.timeZone==4">4</span>
          <span v-else-if="scope.row.timeZone==5">5</span>
          <span v-else-if="scope.row.timeZone==6">6</span>
          <span v-else-if="scope.row.timeZone==7">7</span>
          <span v-else>8</span>
        </template>
      </el-table-column>
      <el-table-column label="东西"
                       align="center"
                       prop="area">
        <template slot-scope="scope">
          <span v-if="scope.row.area==0">东区</span>
          <span v-else>西区</span>
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
                     v-hasPermi="['yunFu:rookieSite:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['yunFu:rookieSite:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改运踪_菜鸟号站点维护--增删改查维护地名/时区对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="地名"
                      prop="siteName">
          <el-input v-model.trim="form.siteName"
                    style="width:200px;"
                    placeholder="请输入站点/地名" />
        </el-form-item>
        <el-form-item label="时区"
                      prop="timeZone">
          <el-select v-model.trim="form.timeZone"
                     clearable
                     style="width:200px;"
                     placeholder="请选择">
            <el-option v-for="item in lineOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
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
import { listRookieSite, getRookieSite, delRookieSite, addRookieSite, updateRookieSite, exportRookieSite } from "@/api/yunFu/rookieSite";

export default {
  name: 'RookieSite',
  data () {
    return {
      lineOptions: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '5',
          label: '5'
        }, {
          value: '6',
          label: '6'
        }, {
          value: '7',
          label: '7'
        }, {
          value: '8',
          label: '8'
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
      // 运踪_菜鸟号站点维护--增删改查维护地名/时区表格数据
      rookieSiteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        delFlag: [
          { required: true, message: "删除标志0正常1删除不能为空", trigger: "blur" }
        ],      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询运踪_菜鸟号站点维护--增删改查维护地名/时区列表 */
    getList () {
      this.loading = true;
      listRookieSite(this.queryParams).then(response => {
        this.rookieSiteList = response.rows;
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
        timeZone: undefined,
        siteName: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮 操作 */
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
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getRookieSite(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRookieSite(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRookieSite(this.form).then(response => {
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
      this.$confirm('是否确认删除?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delRookieSite(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    }
  }
};
</script>