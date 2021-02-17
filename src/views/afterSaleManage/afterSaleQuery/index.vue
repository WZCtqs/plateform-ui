<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
           
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="afterSaleList">
      <el-table-column width="55" align="center" />
      <el-table-column label="委托书编号" align="center" prop="orderNumber" />
      <el-table-column label="箱号" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.orderNumber"
            size="mini"
            type="text"
            @click.prevent="handleSee(scope.row)"
            >箱号查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="业务部" align="center" prop="clientTjr" />
      <el-table-column label="订舱方" align="center" prop="clientUnit" />
      <el-table-column label="去/回程" align="center" prop="classEastandwest" >
      <template slot-scope="scope">
      <span v-if="scope.row.classEastandwest =='0'">去程</span>
      <span v-if="scope.row.classEastandwest =='1'">回程</span>
      </template>
      </el-table-column>
      <el-table-column label="收发方式" align="center" prop="bookingService" >
      <template slot-scope="scope">
      <span v-if="scope.row.bookingService=='0'">门到门</span>
      <span v-if="scope.row.bookingService=='1'">门到站</span>
      <span v-if="scope.row.bookingService=='2'">站到站</span>
      <span v-if="scope.row.bookingService=='3'">站到门</span>  
      </template>
      </el-table-column>  
      <el-table-column
        label="是否可堆叠"
        align="center"
        prop="goodsCannotpileup"
      >
      <template slot-scope="scope">
      <span v-if="scope.row.goodsCannotpileup=='1'">是</span> 
      <span v-if="scope.row.goodsCannotpileup=='0'">否</span>
      <span v-if="scope.row.goodsCannotpileup=='2'">仅可自叠</span> 
      </template>
      </el-table-column>
      <el-table-column label="品名" align="center" prop="goodsName" />
      <el-table-column label="包装方式" align="center" prop="goodsPacking" />
      <el-table-column label="接货照" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.orderNumber"
            type="text"
            @click.prevent="handleSeeImg(scope.row, 'pick_goods_photo_file')"
            >查看接货照
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="装箱照" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.orderNumber"
            type="text"
            @click.prevent="handleSeeImg(scope.row, 'boxing_photo_file')"
            >查看装箱照
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="拆箱照" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.orderNumber"
            size="mini"
            type="text"
            @click.prevent="handleSeeImg(scope.row, 'unpacking_photo_file')"
            >查看拆箱照
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="站到站运行时间" align="center" prop="time" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.orderNumber"
            size="mini"
            type="text"
            @click.prevent="handleAdd(scope.row)"
            >获取信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 箱号查看对话框 -->
    <el-dialog :visible.sync="open1" width="500px">
      <div>
        <el-row>
          <el-col :span="12" v-for="(item, index) in containerList">
            <p :key="index" class="filecss0">{{ item }}</p>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 图片查看对话框 -->
    <el-dialog :visible.sync="open2" width="800px">
      <el-row>
        <el-col :span="24" v-for="(item, index) in imgList">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item" :key="index" class="image" />
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAfterSaleQuery,
  listContainer,
  listImg,
  addCustomerService
} from "@/api/afterSaleManage/afterSaleQuery";

export default {
  name: "AfterSaleQuery",
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
      // 售后查询
      afterSaleList: [],
      //箱号集合
      containerList: [],
      //图片集合
      imgList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      open1: false,
      // 是否显示弹出层
      open2: false,
      // 是否显示弹出层
      open3: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        clientTjr: undefined,
        clientUnit: undefined,
        classEastandwest: undefined,
        bookingService: undefined,
        goodsCannotpileup: undefined,
        goodsName: undefined,
        goodsPacking: undefined,
        time: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询售后查询列表 */
    getList() {
      this.loading = true;
      
      listAfterSaleQuery(this.queryParams).then(response => {
        //table数据为数组类型,回执为对象
        this.afterSaleList = [response.data || ""];
        this.total = 1;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },
    //箱号查看
    handleSee(row) {
      listContainer({ orderId: row.orderId }).then(response => {
        console.log(666666 + row.orderId);
        this.containerList = [];
        ;
        this.containerList = response.data;
        this.open1 = true;
      });
    },
    //接货照查看
    handleSeeImg(row, fileTypeKey) {
      listImg({ orderId: row.orderId, fileTypeKey: fileTypeKey }).then(
        response => {
          console.log(666666 + row.orderId);
          console.log(111666666 + fileTypeKey);
          this.imgList = [];
          ;
          this.imgList = response.data;
          this.open2 = true;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        orderId: undefined,
        orderNumber: undefined,
        clientTjr: undefined,
        clientUnit: undefined,
        classEastandwest: undefined,
        bookingService: undefined,
        goodsCannotpileup: undefined,
        goodsName: undefined,
        goodsPacking: undefined,
        time: undefined
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
    //打开弹框,确认新增售后信息
    handleAdd(row) {
      const orderNumber = row.orderNumber;
      ;
      this.$confirm("确定获取售后信息列表?", "获取售后信息列表", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        addCustomerService(orderNumber).then(response => {
          this.getList();
          this.msgSuccess=response.msg;
        });
      });
    }
  }
};
</script>
<style>
image {
  width: 100%;
  display: block;
}</style
>>
