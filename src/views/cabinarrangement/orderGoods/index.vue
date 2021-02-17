<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true">
      <el-form-item label="货品名称"
                    prop="goodsName">
        <el-input v-model.trim="queryParams.goodsName"
                  placeholder="请输入货品名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="HS编码"
                    prop="hsCode">
        <el-input v-model.trim="queryParams.hsCode"
                  placeholder="请输入HS编码"
                  clearable
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

    <!-- <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['cabinarrangement:orderGoods:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['cabinarrangement:orderGoods:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['cabinarrangement:orderGoods:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['cabinarrangement:orderGoods:export']">导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading"
              :data="orderGoodsList"
              @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection"
                       width="55"
                       align="center" /> -->
      <el-table-column label="委托书编号"
                       align="center"
                       prop="orderNum" />
      <el-table-column label="班列日期"
                       align="center"
                       prop="classDate">
        <template slot-scope="scope">
          <span v-if="scope.row.classDate">{{ parseTime(scope.row.classDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货品中文名称"
                       align="center"
                       prop="goodsZhName" />
      <el-table-column label="货品英文名称"
                       align="center"
                       prop="goodsEnName" />
      <el-table-column label="国内报关HS"
                       align="center"
                       prop="goodsInReport" />
      <el-table-column label="国内清关HS"
                       align="center"
                       prop="goodsClearance" />
      <el-table-column label="国外报关HS"
                       align="center"
                       prop="goodsReport" />
      <el-table-column label="国外清关HS"
                       align="center"
                       prop="goodsOutClearance" />
      <!-- <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['cabinarrangement:orderGoods:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['cabinarrangement:orderGoods:remove']">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改订单商品对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
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
import { listOrderGoods, getOrderGoods, delOrderGoods, addOrderGoods, updateOrderGoods, exportOrderGoods } from "@/api/cabinarrangement/orderGoods";

export default {
  name: 'OrderGoods',
  data() {
    return {
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
      // 订单商品表格数据
      orderGoodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classDate: undefined,
        classEastAndWest: undefined,
        goodsClearance: undefined,
        goodsEnName: undefined,
        goodsInReport: undefined,
        goodsName: undefined,
        goodsOutClearance: undefined,
        goodsReport: undefined,
        goodsZhName: undefined,
        hsCode: undefined,
        inCode: undefined,
        orderNum: undefined,
        outCode: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单商品列表 */
    getList() {
      this.loading = true;
      listOrderGoods(this.queryParams).then(response => {
        this.orderGoodsList = response.rows;
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
        goodsId: undefined,
        orderId: undefined,
        goodsMark: undefined,
        goodsName: undefined,
        goodsEnName: undefined,
        goodsPacking: undefined,
        goodsNumber: undefined,
        goodsClearance: undefined,
        goodsOutClearance: undefined,
        goodsInReport: undefined,
        goodsReport: undefined,
        goodsStandard: undefined,
        goodsKgs: undefined,
        goodsCbm: undefined,
        goodsIsscheme: undefined,
        remark: undefined,
        createdate: undefined,
        goodsHistoryEditrecord: undefined,
        goodsbz: undefined,
        hsbz: undefined,
        radioaction: undefined,
        kpState: undefined
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
      this.ids = selection.map(item => item.goodsId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const goodsId = row.goodsId || this.ids
      getOrderGoods(goodsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单商品";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.goodsId != undefined) {
            updateOrderGoods(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addOrderGoods(this.form).then(response => {
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
      const goodsIds = row.goodsId || this.ids;
      this.$confirm('是否确认删除订单商品编号为"' + goodsIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delOrderGoods(goodsIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有订单商品数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportOrderGoods(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>