<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item  prop="type">
        <el-select 
        v-model.trim="queryParams.type" 
        placeholder="请选择文件类型" 
        clearable 
        size="small">
        <el-option 
        v-for="item in fileTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        >
        </el-option>  
        </el-select>
      </el-form-item>
      <el-form-item  prop="ordernumber">
        <el-input
          v-model.trim="queryParams.ordernumber"
          placeholder="请输入舱位号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
       
        >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

   

    <el-table v-loading="loading" :data="serviceFileList" >
      <el-table-column  width="55" align="center" />
      <el-table-column label="委托书编号" align="center" prop="ordernumber" />
      <el-table-column label="文件类型" align="center" prop="type" >
      <template slot-scope="scope">
      <span v-if="scope.row.type==0">情况说明</span>
      <span v-else-if="scope.row.type==1">回复函</span>
      <span v-else-if="scope.row.type==2">赔付报告</span>
      <span v-else>通报</span>
      </template>
      </el-table-column>  
      <el-table-column label="文件名称" align="center" prop="name" />
      <el-table-column label="上传时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
       <template slot-scope="scope">
         <el-button size="mini" type="text" @click="handleExport0(scope.row)" 
           v-hasPermi="['afterSaleManage:serviceFileDownload:download']"
          >下载</el-button>
       </template> 
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

   
  </div>
</template>

<script>
import { listServiceFile, getServiceFile, delServiceFile, addServiceFile, updateServiceFile, exportServiceFile,downloadFile } from "@/api/afterSaleManage/serviceFileDownload";

export default {
  name: "ServiceFileDownload",
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
      // 售后文件表格数据
      serviceFileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      //文件类型
      fileTypeOptions:[
        {
          label:'情况说明',
          value:'0'
        },
        {
          label:'回复函',
          value:'1'
        },
         {
          label:'赔付报告',
          value:'2'
        },
        {
          label:'通报',
          value:'3'
        },{
          label:'全部',
          value:''
        }
      ],
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        ordernumber: undefined,
        name: undefined,
        url: undefined,
        clientTjr: undefined,
        clientTjrId: undefined,
        department: undefined
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
    /** 查询售后文件列表 */
    getList() {
      this.loading = true;
      listServiceFile(this.queryParams).then(response => {
        this.serviceFileList = response.rows;
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
        type: undefined,
        ordernumber: undefined,
        name: undefined,
        url: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        clientTjr: undefined,
        clientTjrId: undefined,
        department: undefined
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
    //下载
    handleExport0(row) {
     
      downloadFile(row.id).then(response => {
       
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
        downloadElement.download = row.name; // 获取文件的名称及对应后缀
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        this.$notify({
          title: "成功",
          message: "下载成功",
          type: "success",
          duration: 2000
        });
      });
    }
  }
};
</script>