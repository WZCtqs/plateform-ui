<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="status">
        <el-select
          v-model.trim="queryParams.status"
          clearable
          style="width:120px;"
          placeholder="售后状态"
        >
          <el-option
            v-for="item in afsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="clientTjr">
        <el-input
          v-model.trim="queryParams.clientTjr"
          placeholder="请输入客户推荐人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="ywb">
        <el-input
          v-model.trim="queryParams.ywb"
          placeholder="请输入业务部"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入订舱方名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="complaintsTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model.trim="queryParams.complaintsTime"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          placeholder="选择投诉日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="运费支付" prop="freightPay">
        <el-select
          v-model.trim="queryParams.freightPay"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in payOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否投诉过期" prop="isOverdue">
        <el-select
          v-model.trim="queryParams.isOverdue"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in dueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投诉类型" prop="complaintsType">
        <el-select
          v-model.trim="queryParams.complaintsType"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in tsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="包装方式" prop="goodsPacking">
        <el-select
          v-model.trim="queryParams.goodsPacking"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in packOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="往返" prop="classEastandwest">
        <el-select
          v-model.trim="queryParams.classEastandwest"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in ewOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收发方式" prop="bookingService">
        <el-select
          v-model.trim="queryParams.bookingService"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in bsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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

    <el-row :gutter="10" class="mb8">
     
     
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['afterSaleManage:afterSaleList:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" type="primary" @click="handleExport0" icon="edit"
          v-hasPermi="['afterSaleManage:afterSaleList:download']"
          >下载模板</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" type="primary" icon="edit" @click="handleUpload"
           v-hasPermi="['afterSaleManage:afterSaleList:import']"
          >导入</el-button
        >
        <input
          type="file"
          @change="getFile($event)"
          style="display:none"
          ref="menuFile"
        />
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="messageList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="舱位号" align="center" prop="orderNumber" />
       <el-table-column label="箱号" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleSee(scope.row)"
            >箱号查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="业务部" align="center" prop="ywb" />
      <el-table-column label="推荐人" align="center" prop="clientTjr" />
      <el-table-column label="订舱方" align="center" prop="clientUnit" />
      <el-table-column label="货品中文名称" align="center" prop="goodsName" />
      <el-table-column
        label="最外层包装形式"
        align="center"
        prop="goodsPacking"
      />
      <el-table-column label="去/回程" align="center" prop="classEastandwest" />
      <el-table-column label="收发方式" align="center" prop="bookingService" />
       <el-table-column
        label="投诉日期"
        align="center"
        
        format="yyyy-MM-dd"
        prop="complaintsTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.complaintsTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费支付" align="center" prop="freightPay" min-width="130px">
        <template slot-scope="scope">
          <el-select
            v-model.trim="scope.row.freightPay"
            @change="editFn(scope.row)"
            filterable
            allow-create
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="-请选择-" value />
            <el-option label="否" value="否" />
            <el-option label="是" value="是" />
          </el-select>
        </template>
      </el-table-column>
      
      <el-table-column label="运费金额" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit9[scope.$index]"
            v-model.trim="rows[scope.$index].freightNum"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave9(scope.row, rows[scope.$index].freightNum, scope.$index)
            "
          />
          <p
            v-if="!showEdit9[scope.$index]"
            @click="handleShowEdit9(scope.$index, scope.row)"
          >
            {{ scope.row.freightNum }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="投诉类型" align="center" prop="complaintsType" min-width="130px">
        <template slot-scope="scope">
          <el-select
            v-model.trim="scope.row.complaintsType"
            @change="editFn(scope.row)"
            filterable
            allow-create
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="请选择" value />
            <el-option label="货损" value="货损" />
            <el-option label="包装破损" value="包装破损" />
            <el-option label="货少" value="货少" />
            <el-option label="延期" value="延期" />
            <el-option label="费用争议" value="费用争议" />
            <el-option label="操作失误" value="操作失误" />
            <el-option label="其他" value="其他" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否投诉过期" align="center" prop="isOverdue" min-width="130px">
        <template slot-scope="scope">
          <el-select
            v-model.trim="scope.row.isOverdue"
            @change="editFn(scope.row)"
            filterable
            allow-create
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="-请选择-" value />
            <el-option label="否" value="否" />
            <el-option label="是" value="是" />
          </el-select>
        </template>
      </el-table-column>
      
      <el-table-column label="投诉基本情况" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit8[scope.$index]"
            v-model.trim="rows[scope.$index].situation"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave8(scope.row, rows[scope.$index].situation, scope.$index)
            "
          />
          <p
            v-if="!showEdit8[scope.$index]"
            @click="handleShowEdit8(scope.$index, scope.row)"
          >
            {{ scope.row.situation }}
          </p>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="投诉日期"
        align="center"
        prop="complaintsTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.complaintsTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="客户" align="center" min-width="120">
        <template slot-scope="scope">
         
          <el-input
            v-if="showEdit[scope.$index]"
            v-model.trim="rows[scope.$index].client"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave(scope.row, rows[scope.$index].client, scope.$index)
            "
          />
          <p
            v-if="!showEdit[scope.$index]"
            @click="handleShowEdit(scope.$index, scope.row)"
          >
            {{ scope.row.client }} 
          </p>
        </template>
      </el-table-column>
     
       <el-table-column label="公路部" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit1[scope.$index]"
            v-model.trim="rows[scope.$index].road"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave1(scope.row, rows[scope.$index].road, scope.$index)
            "
          />
          <p
            v-if="!showEdit1[scope.$index]"
            
            @click="handleShowEdit1(scope.$index, scope.row)"
          >
            {{ scope.row.road }} 
          </p>
        </template>
      </el-table-column>
      <el-table-column label="拼箱部" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit2[scope.$index]"
            v-model.trim="rows[scope.$index].lcl"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave2(scope.row, rows[scope.$index].lcl, scope.$index)
            "
          />
          <p
            v-if="!showEdit2[scope.$index]"
            @click="handleShowEdit2(scope.$index, scope.row)"
          >
            {{ scope.row.lcl }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作一部" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit3[scope.$index]"
            v-model.trim="rows[scope.$index].operation"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave3(scope.row, rows[scope.$index].operation, scope.$index)
            "
          />
          <p
            v-if="!showEdit3[scope.$index]"
            @click="handleShowEdit3(scope.$index, scope.row)"
          >
            {{ scope.row.operation }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="集疏部等其他部门" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit4[scope.$index]"
            v-model.trim="rows[scope.$index].jishu"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave4(scope.row, rows[scope.$index].jishu, scope.$index)
            "
          />
          <p
            v-if="!showEdit4[scope.$index]"
            @click="handleShowEdit4(scope.$index, scope.row)"
          >
            {{ scope.row.jishu }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="下一步计划" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit5[scope.$index]"
            v-model.trim="rows[scope.$index].plan"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave5(scope.row, rows[scope.$index].plan, scope.$index)
            "
          />
          <p
            v-if="!showEdit5[scope.$index]"
            @click="handleShowEdit5(scope.$index, scope.row)"
          >
            {{ scope.row.plan }}
          </p>
        </template>
      </el-table-column>
     
      <el-table-column label="处理方案" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit6[scope.$index]"
            v-model.trim="rows[scope.$index].programme"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave6(scope.row, rows[scope.$index].programme, scope.$index)
            "
          />
          <p
            v-if="!showEdit6[scope.$index]"
            @click="handleShowEdit6(scope.$index, scope.row)"
          >
            {{ scope.row.programme }}
          </p>
        </template>
      </el-table-column>
    
      <el-table-column label="改善流程和措施" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-if="showEdit7[scope.$index]"
            v-model.trim="rows[scope.$index].measure"
            size="mini"
            placeholder="请输入内容"
            @blur="
              handleShowSave7(scope.row, rows[scope.$index].measure, scope.$index)
            "
          />
          <p
            v-if="!showEdit7[scope.$index]"
            @click="handleShowEdit7(scope.$index, scope.row)"
          >
            {{ scope.row.measure }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
      <template slot-scope="scope">
      <span v-if="scope.row.status==='0'">处理中</span>  
      <span v-if="scope.row.status==='1'">预结案</span>  
      <span v-if="scope.row.status==='2'">已结案</span>
      <span v-if="scope.row.status==='3'">赔款跟踪</span>  
      </template>
      </el-table-column>
      <el-table-column label="操作" align="center" prop="status" width="130px">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.status === '0'"
            v-model.trim="scope.row.status"
            @change="editFn(scope.row)"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="请选择" value='0' :disabled="true" />
            <el-option label="预结案" value="1" />
            <el-option label="已结案" value="2" />
          </el-select>
          <el-select
            v-if="scope.row.status === '1'"
            v-model.trim="scope.row.status"
            @change="editFn(scope.row)"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="-请选择-" value="1" :disabled="true" />
            <el-option label="正在处理中" value="0" />
            <el-option label="已结案" value="2" />
          </el-select>
          <!-- <el-link v-if="queryParams.status === '2'">赔款跟踪</el-link> -->
          <el-button
            v-if="scope.row.status === '2'"
            size="mini"
            type="text"
            @click.prevent="handleAdd(scope.row)"
            >赔款跟踪
          </el-button>
          <el-select
            v-if="!scope.row.status"
            v-model.trim="scope.row.status"
            @change="editFn(scope.row)"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="-请选择-" value=""  :disabled="true" />
            <el-option label="正在处理中" value="0" />
            <el-option label="预结案" value="1" />
            <el-option label="已结案" value="2" />
          </el-select>
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
          <p>箱号信息:</p>
          <el-col :span="12" v-for="(item, index) in containerList">
            <p :key="index" class="filecss0">{{ item }}</p>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import {
  listMessage,
  getMessage,
  delMessage,
  addMessage,
  updateMessage,
  exportMessage,
  downloadMessage,
  importObj,
  listContainer,
} from "@/api/afterSaleManage/afterSaleList";

export default {
  name: "AfterSaleList",
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
      // 售后表格数据
      messageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      //售后状态
      afsOptions: [
       {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "处理中"
        },
        {
          value: "1",
          label: "预结案"
        },
        {
          value: "2",
          label: "已结案"
        }
      ],
      payOptions: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
      dueOptions: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
      tsOptions: [
        {
          value: "货损",
          label: "货损"
        },
        {
          value: "包装破损",
          label: "包装破损"
        },
        {
          value: "货少",
          label: "货少"
        },
        {
          value: "延期",
          label: "延期"
        },
        {
          value: "费用争议",
          label: "费用争议"
        },
        {
          value: "操作失误",
          label: "操作失误"
        },
        {
          value: "其他",
          label: "其他"
        }
      ],
      packOptions: [
        {
          value: "托盘",
          label: "托盘"
        },
        {
          value: "木箱",
          label: "木箱"
        },
        {
          value: "纸箱",
          label: "纸箱"
        },
        {
          value: "桶装",
          label: "桶装"
        }
      ],
      ewOptions: [
        {
          value: "去程",
          label: "去程"
        },
        {
          value: "回程",
          label: "回程"
        }
      ],
      bsOptions: [
        {
          value: "门到门",
          label: "门到门"
        },
        {
          value: "站到站",
          label: "站到站"
        },
        {
          value: "站到门",
          label: "站到门"
        },
        {
          value: "门到站",
          label: "门到站"
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        orderId: undefined,
        clientTjr: undefined,
        clientTjrId: undefined,
        general: undefined,
        clientUnit: undefined,
        goodsName: undefined,
        goodsEnName: undefined,
        goodsPacking: undefined,
        bookingService: undefined,
        classEastandwest: undefined,
        freightPay: undefined,
        freightNum: undefined,
        complaintsType: undefined,
        isOverdue: undefined,
        situation: undefined,
        status: "",
        endDate: undefined,
        complaintsTime: undefined,
        ywb: undefined,
        client: undefined,
        road: undefined,
        lcl: undefined,
        operation: undefined,
        jishu: undefined,
        plan: undefined,
        programme: undefined,
        measure: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      rows: [],
      showEdit: [],
      showEdit1: [],
      showEdit2: [],
      showEdit3: [],
      showEdit4: [],
      showEdit5: [],
      showEdit6: [],
      showEdit7: [],
      showEdit8: [],
      showEdit9: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //   修改
    editFn(row) {
      updateMessage(row).then(res => {
        if (res.code === 200) {
          this.getList();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    /** 查询售后列表 */
    getList() {
      this.loading = true;
      listMessage(this.queryParams).then(response => {
        this.messageList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.rows = [];
        this.messageList.map(item => {
          this.rows.push({
            client: "",
            road: "",
            lcl: "",
            operation: "",
            jishu: "",
            plan: "",
            programme: "",
            measure: "",
            situation: "",
            freightNum: ""
          });
        });
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
        orderNumber: undefined,
        orderId: undefined,
        clientTjr: undefined,
        clientTjrId: undefined,
        general: undefined,
        clientUnit: undefined,
        goodsName: undefined,
        goodsEnName: undefined,
        goodsPacking: undefined,
        bookingService: undefined,
        classEastandwest: undefined,
        freightPay: undefined,
        freightNum: undefined,
        complaintsType: undefined,
        isOverdue: undefined,
        situation: undefined,
        status: "",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        endDate: undefined,
        complaintsTime: undefined,
        ywb: undefined,
        client: undefined,
        road: undefined,
        lcl: undefined,
        operation: undefined,
        jishu: undefined,
        plan: undefined,
        programme: undefined,
        measure: undefined
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
   
  
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有售后数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportMessage(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    },
    //下载模板
    handleExport0() {
      const type = 0;
      downloadMessage(type).then(response => {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        var nowDate = year + "-" + month + "-" + day;
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = nowDate + "-导入模板.xlsx"; // xxx.xls/xxx.xlsx
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        this.$notify({
          title: "成功",
          message: "模板下载成功",
          type: "success",
          duration: 2000
        });
      });
    },
    //导入
    handleUpload() {
      this.$refs.menuFile.value = "";
      this.$refs.menuFile.click();
    },
    //导入
    getFile(event) {
      this.upath = event.target.files[0];
      var zipFormData = new FormData();
      zipFormData.append("file", this.upath); //file对应传输的文件
      importObj(zipFormData).then(res => {
        if (res.code === 200) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "导入成功",
            type: "success",
            duration: 2000
          });
        } else {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "warning",
            duration: 2000
          });
        }
      });
    },
    handleShowEdit(index, row) {
     
        this.showEdit[index] = true;
        this.rows[index].client = row.client;
        this.$set(this.showEdit, index, true);
      
    },
    handleShowSave(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, client: val }).then(res => {
        if (res.code === 200) {
          this.$set(this.showEdit, index, false);
          this.getList();
        }
      });
     
    },
     handleShowEdit1(index, row) {
      
        this.showEdit1[index] = true;
        this.rows[index].road = row.road;
        this.$set(this.showEdit1, index, true);
      
    },
    handleShowSave1(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, road: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit1, index, false);
          this.getList();
        }
      });
     
    },
    handleShowEdit2(index, row) {
     
        this.showEdit2[index] = true;
        this.rows[index].lcl = row.lcl;
        this.$set(this.showEdit2, index, true);
      
    },
    handleShowSave2(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, lcl: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit2, index, false);
          this.getList();
        }
      });
     
    },
     handleShowEdit3(index, row) {
      
        this.showEdit3[index] = true;
        this.rows[index].operation = row.operation;
        this.$set(this.showEdit3, index, true);
      
    },
    handleShowSave3(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, operation: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit3, index, false);
          this.getList();
        }
      });
     
    },
     handleShowEdit4(index, row) {
     
        this.showEdit4[index] = true;
        this.rows[index].jishu = row.jishu;
        this.$set(this.showEdit4, index, true);
      
    },
    handleShowSave4(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, jishu: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit4, index, false);
          this.getList();
        }
      });
     
    },
    handleShowEdit5(index, row) {
     
        this.showEdit5[index] = true;
        this.rows[index].plan = row.plan;
        this.$set(this.showEdit5, index, true);
      
    },
    handleShowSave5(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, plan: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit5, index, false);
          this.getList();
        }
      });
     
    },
     handleShowEdit6(index, row) {
     
        this.showEdit6[index] = true;
        this.rows[index].programme = row.programme;
        this.$set(this.showEdit6, index, true);
          },
    handleShowSave6(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, programme: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit6, index, false);
          this.getList();
        }
      });
     
    }, handleShowEdit7(index, row) {
      if (this.queryParams.status === "2") {
        this.showEdit7[index] = true;
        this.rows[index].measure = row.measure;
        this.$set(this.showEdit7, index, true);
      }
    },
    handleShowSave7(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, measure: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit7, index, false);
          this.getList();
        }
      });
     
    },
     handleShowEdit8(index, row) {
      
        this.showEdit8[index] = true;
        this.rows[index].situation = row.situation;
        this.$set(this.showEdit8, index, true);
          },
    handleShowSave8(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, situation: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit8, index, false);
          this.getList();
        }
      });
     
    },
     handleShowEdit9(index, row) {
      
        this.showEdit9[index] = true;
        this.rows[index].freightNum = row.freightNum;
        this.$set(this.showEdit9, index, true);
      
    },
    handleShowSave9(row, val, index) {
      console.log(16 + row.id);
      console.log(111111 + val);

      updateMessage({ id: row.id, freightNum: val }).then(res => {
        
        if (res.code === 200) {
          this.$set(this.showEdit9, index, false);
          this.getList();
        }
      });
     
    },
     //箱号查看
    handleSee(row) {
      
      listContainer({ orderId: row.orderId }).then(response => {
        console.log(666666 + row.orderId);
        this.containerList = [];
        this.containerList = response.data;
        
        if (this.containerList.length) {
        this.open1 = true;
        } else{
           this.$message.error('暂无箱号信息')
        }
      });
    },
    //打开弹框,修改赔款跟踪信息,this被重定向,需要使用that定义进行解决
    handleAdd(row) {
      let that =this
      const id = row.id;
      const status = 3;
      
      that.$confirm("确定获取售后信息列表?", "获取售后信息列表", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        updateMessage({ id: id, status: status }).then(response => {
          
          
          if (response.code === 200) {
         that.$message.success('修改成功')
           
            // this.$message.error(response.msg)
           
             that.getList();
          }
          //this.msgSuccess=response.msg;
        });
      });
    }
  }
};
</script>

<style>
.el-table .cell p{
  padding:10px 20px;
}
</style>
