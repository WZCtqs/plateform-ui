<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="货物品名"
                    prop="goodsname">
        <el-input v-model.trim="queryParams.goodsname"
                  placeholder="请输入货物品名"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="货物类型"
                    prop="goodsClass">
        <el-select v-model.trim="queryParams.goodsClass"
                   clearable
                   style="width:230px;"
                   placeholder="请选择">
          <el-option v-for="item in lineOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="国内HS"
                    prop="inhs">
        <el-input v-model.trim="queryParams.inhs"
                  placeholder="请输入货物品名"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
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
                   v-hasPermi="['risk:goodsnote:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['risk:goodsnote:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="goodsnoteList"
              ref="multipleTable"
              highlight-current-row
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="东/西向"
                       align="center"
                       prop="eastandwest">
        <template slot-scope="scope">
          <span v-if="scope.row.eastandwest==0">西向</span>
          <span v-else-if="scope.row.eastandwest==1">东向</span>
          <span v-else>东西向</span>
        </template>
      </el-table-column>
      <el-table-column label="货物品名"
                       align="center"
                       prop="goodsname" />
      <el-table-column label="国内HS"
                       align="center"
                       prop="inhs" />
      <el-table-column label="班列站点"
                       align="center"
                       prop="unloadsite" >
      <template slot-scope="scope">
      <span v-if="scope.row.unloadsite=='1'">全</span> 
      <span v-else>{{scope.row.unloadsite}}</span> 
      </template>
      </el-table-column>                 
      <el-table-column label="口岸"
                       align="center"
                       prop="station" >
      <template slot-scope="scope">
      <span v-if="scope.row.station=='1'">全</span>  
      <span v-else>{{scope.row.station}}</span>
      </template>
      </el-table-column>                 
      <el-table-column label="特殊备注"
                       align="center"
                       prop="specialnotes" />
      <el-table-column label="放射性"
                       align="center"
                       prop="radioaction" />
      <el-table-column label="商品类型"
                       align="center"
                       prop="goodsClass">
        <template slot-scope="scope">
          <span v-if="scope.row.goodsClass==0">特殊单证</span>
          <span v-else>有色金属</span>
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
                     v-hasPermi="['risk:goodsnote:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['risk:goodsnote:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改特殊单证物品对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="100px">
        <el-form-item label="去回程"
                      prop="eastandwest">
          <el-radio-group v-model.trim="form.eastandwest">
            <el-radio v-for="dict in ltRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="货物品名"
                      prop="goodsname">
          <el-input v-model.trim="form.goodsname"
                    placeholder="请输入货物品名" />
        </el-form-item>
        <el-form-item label="国内HS"
                      prop="inhs">
          <el-input v-model.trim="form.inhs"
                    placeholder="请输入国内HS" />
        </el-form-item>
        <el-form-item label="上/下货站"
                      prop="unloadsite">
          <el-input v-model.trim="form.unloadsite"
                    placeholder="请输入上/下货站" />
        </el-form-item>
        <el-form-item label="口岸"
                      prop="station">
          <el-input v-model.trim="form.station"
                    placeholder="请输入口岸" />
        </el-form-item>
        <el-form-item label="特殊备注"
                      prop="specialnotes">
          <el-input v-model.trim="form.specialnotes"
                    placeholder="请输入特殊备注" />
        </el-form-item>
        <el-form-item label="放射性"
                      prop="radioaction">
          <el-radio-group v-model.trim="form.radioaction">
            <el-radio v-for="dict in rdctRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="货物类型"
                      prop="goodsClass">
          <el-radio-group v-model.trim="form.goodsClass">
            <el-radio v-for="dict in gcRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listGoodsnote, getGoodsnote, delGoodsnote, addGoodsnote, updateGoodsnote, exportGoodsnote } from "@/api/risk/goodsnote";

export default {
  name: 'Goodsnote',
  data() {
    return {
      lineOptions: [
        {
          value: '0',
          label: '特殊单证'
        },
        {
          value: '1',
          label: '有色金属'
        }
      ],
      ltRadio: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }, {
          value: '0|1',
          label: '东西向'
        }
      ],
      rdctRadio: [
        {
          value: '否',
          label: '否'
        },
        {
          value: '是',
          label: '是'
        }
      ],
      gcRadio: [
        {
          value: '0',
          label: '特殊单证'
        },
        {
          value: '1',
          label: '有色金属'
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
      // 特殊单证物品表格数据
      goodsnoteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eastandwest: undefined,
        goodsname: undefined,
        inhs: undefined,
        unloadsite: undefined,
        station: undefined,
        specialnotes: undefined,
        radioaction: undefined,
        goodsClass: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsClass: [
          { required: true, message: "商品类别0是特殊单证1是有色金属不能为空", trigger: "blur" }
        ]      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询特殊单证物品列表 */
    getList() {
      this.loading = true;
      listGoodsnote(this.queryParams).then(response => {
        this.goodsnoteList = response.rows;
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
        id: undefined,
        eastandwest: undefined,
        goodsname: undefined,
        inhs: undefined,
        unloadsite: undefined,
        station: undefined,
        specialnotes: undefined,
        radioaction: undefined,
        goodsClass: undefined
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加特殊单证物品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGoodsnote(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改特殊单证物品";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateGoodsnote(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addGoodsnote(this.form).then(response => {
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
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delGoodsnote(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有特殊单证物品数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportGoodsnote(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>