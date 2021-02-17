<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" label-width="90px">
      <el-form-item prop="fileFrom">
        <el-select
          v-model.trim="queryParams.fileFrom"
          clearable
          placeholder="请选择单证来源"
        >
          <el-option
            v-for="item in fileFroms"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['document:type:add']"
          >新建一级分类
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="typeList"
      row-key="id"
      :tree-props="{ children: 'docTypesList', hasChildren: 'hasChildren' }"
    >
      <el-table-column width="55" align="center" />
      <el-table-column
        label="单证类型说明"
        align="center"
        prop="fileTypeText"
      />
      <el-table-column label="单证来源" align="center" prop="fileFormText" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.prevent="handleUpdate(scope.row)"
            v-hasPermi="['document:type:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.isSystem === 0"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['document:type:remove']"
            >删除
          </el-button>
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

    <!-- 新建一级分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称中文:" prop="fileTypeText">
          <el-input
            v-model.trim="form.fileTypeText"
            placeholder="请输入分类中文名称"
          />
        </el-form-item>
        <el-form-item label="分类名称英文:" prop="fileTypeTextEn">
          <el-input
            v-model.trim="form.fileTypeTextEn"
            placeholder="请输入分类英文名称"
          />
        </el-form-item>
        <el-form-item label="单证名称:" prop="docTypeIds">
          <el-select v-model.trim="form.docTypeIds" multiple placeholder="请选择">
            <el-option
              v-for="item in docTypeOptions"
              :key="item.id"
              :label="item.fileTypeText"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="formStatus === 'create'"
          @click="submitForm('form')"
          >确 定</el-button
        >
        <el-button
          type="primary"
          v-if="formStatus === 'update'"
          @click="updateForm('form')"
          >编 辑</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改二级分类对话框 -->
    <el-dialog :title="title" :visible.sync="open1" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称中文:" prop="fileTypeText">
          <el-input
            v-model.trim="form.fileTypeText"
            placeholder="请输入分类名称中文"
          />
        </el-form-item>
        <el-form-item label="分类名称英文:" prop="fileTypeTextEn">
          <el-input v-model.trim="form.fileTypeTextEn" placeholder="请输入分类名称英文" />
        </el-form-item>
        <el-form-item label="上级分类:">
          <el-select v-model.trim="form.fileOrderStage" placeholder="请选择">
            <el-option
              v-for="item in docTypeSecOptions"
              :key="item.id"
              :label="item.fileTypeText"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单证来源:">
          <el-row>
            <el-col :span="8">
              <el-select v-model.trim="form.fileFrom" placeholder="请选择">
                <el-option label="平台" :value="0"></el-option>
                <el-option label="子系统" :value="2"></el-option>
                <el-option label="客户端" :value="1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <!-- <el-input
                placeholder="请输入系统名称"
                :disabled="fileFormTextDis"
                v-model.trim="form.fileFormText"
                class="input-with-select"
              >
              </el-input> -->
              <el-form-item>
          <el-select v-model.trim="form.fileFormText" placeholder="请选择子系统">
          <el-option
          v-for="item in zixtOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
          </el-option>
          </el-select>
        </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row>
          <el-col :span="10">
        <el-form-item label="默认提醒时间:" prop="fileNotice">
          <el-input-number
            v-model.trim="form.fileNotice"
            controls-position="right"
            :step="1"
          ></el-input-number>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item>
          <el-select v-model.trim="form.fileNoticeTime" clearable placeholder="请选择时数">
          <el-option
          v-for="item in timeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
          </el-option>
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="是否在客户端显示:">
           <el-select v-model.trim="form.showCustomer" placeholder="请选择">
          <el-option
          v-for="item in sfOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
          </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="去回程">
          <el-select v-model.trim="form.activeArea" placeholder="请选择">
          <el-option
          v-for="item in qhcOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="整拼箱">
          <el-select v-model.trim="form.fclLcl" placeholder="请选择">
          <el-option
          v-for="item in zpxOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>已发车日期为基准</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateSeForm('form')"
          >确 定</el-button
        >
        <el-button @click="editCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listType,
  getType,
  getNoParentDocType,
  delType,
  addType,
  updateType,
  updateTypeStage,
  getENoParentDocType,
  getParentList,
  updateSecTypeStage,
  exportType
} from "@/api/document/document_type";

export default {
  name: "Document_type",
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
      // 单证类型表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 新建是否显示弹出层
      open: false,
      // 编辑二类是否显示弹出层
      open1: false,
      //新建单证名称选项
      docTypeOptions: [],
      docTypeSecOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileFrom: undefined
      },
      formStatus: "",
      // 表单参数
      form: {
        fileFrom: "",
        fileOrderStage: undefined,
        fileFormText: undefined,
        fileTypeText: undefined,
        fileTypeTextEn: undefined,
        fileTypeKey: undefined,
        showCustomer: undefined,
        activeArea: undefined,
        fclLcl: undefined
      },
      //去回程
      qhcOptions:[
        {
          label:'去程',
          value:0
        },{
          label:'回程',
          value:1
        },{
          label:'去回程',
          value:2
        }
      ],
      //整拼箱
      zpxOptions:[
        {
          label:'整箱',
          value:0
        },{
          label:'拼箱',
          value:1
        },{
          label:'整拼箱',
          value:2
        }
      ],
      //客户端显示
      sfOptions:[
        {
          label:'显示',
          value:0
        },{
          label:'不显示',
          value:1
        }
      ],
      //子系统
      zixtOptions:[
        {
          label:'箱管系统',
          value:'xg'
        },{
          label:'箱行亚欧系统',
          value:'xxyo'
        },{
          label:'国外场站系统',
          value:'gwcz'
        },{
          label:'关务系统',
          value:'gw'
        },{
          label:'智能拼箱系统',
          value:'px'
        },{
          label:'集疏系统',
          value:'js'
        },
        {
          label:'大口岸系统',
          value:'dka'
        }
      ],
      //编辑时数
      timeOptions:[
        {
          value:'00:00',
          label:'00:00'
        },{
          value:'01:00',
          label:'01:00'
        },{
          value:'02:00',
          label:'02:00'
        },{
          value:'03:00',
          label:'03:00'
        },{
          value:'04:00',
          label:'04:00'
        },{
          value:'05:00',
          label:'05:00'
        },{
          value:'06:00',
          label:'06:00'
        },{
          value:'07:00',
          label:'07:00'
        },{
          value:'08:00',
          label:'08:00'
        },{
          value:'09:00',
          label:'09:00'
        },{
          value:'10:00',
          label:'10:00'
        },{
          value:'11:00',
          label:'11:00'
        },{
          value:'12:00',
          label:'12:00'
        },{
          value:'13:00',
          label:'13:00'
        },{
          value:'14:00',
          label:'14:00'
        },{
          value:'15:00',
          label:'15:00'
        },{
          value:'16:00',
          label:'16:00'
        },{
          value:'17:00',
          label:'17:00'
        },{
          value:'18:00',
          label:'18:00'
        },{
          value:'19:00',
          label:'19:00'
        },{
          value:'20:00',
          label:'20:00'
        },{
          value:'21:00',
          label:'21:00'
        },{
          value:'22:00',
          label:'22:00'
        },{
          value:'23:00',
          label:'23:00'
        }
      ],
      // 表单校验
      rules: {
        fileTypeText: [
          {
            required: true,
            message: "单证类型说明中文不能为空",
            trigger: "blur"
          }
        ],
        fileTypeTextEn: [
          {
            required: true,
            message: "单证类型说明英文不能为空",
            trigger: "blur"
          }
        ],
        docTypeIds: [
          {
            required: true,
            message: "单证名称不能为空",
            trigger: "blur"
          }
        ]
      },
      //单证作用域
      fileFroms: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "平台端"
        },
        {
          value: 1,
          label: "客户端"
        },
        {
          value: 2,
          label: "内部系统"
        }
      ],
      fileFormTextDis: false
    };
  },
  watch: {
    "form.fileFrom": function(val) {
      console.log(val);
      if (val === 0) {
        this.fileFormTextDis = true;
        this.form.fileFormText = "平台";
      } else if (val === 1) {
        this.fileFormTextDis = true;
        this.form.fileFormText = "客户端";
      } else if (val === 2) {
        this.fileFormTextDis = false;
        this.form.fileFormText = "";
      }
    }
  },
  created() {
    this.getList();
    //this.handleInit();
  },
  methods: {
    //handleInit() {},
    /** 查询单证类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then(response => {
        this.typeList = response.rows;
        
         this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },
    // 新建取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 编辑取消按钮
    editCancel() {
      this.open1 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        fileTypeText: undefined,
        fileTypeTextEn: undefined,
        showCustomer: undefined,
        fileFrom: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fileFormText: null,
        fileNotice: null,
        fileNoticeTime: undefined,
        fileTypeKey: undefined,
        fileOrderStage: null,
        docTypeIds: [],
        activeArea: undefined,
        fclLcl: undefined
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
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset()
      // this.title = '新建一级分类'
      getNoParentDocType().then(response => {
        this.docTypeOptions = response.data;
        this.reset();
        this.open = true;
        this.title = "新建一级分类";
        this.formStatus = "create";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if (row.isSystem === 0) {
        getENoParentDocType(row.id).then(response => {
          this.docTypeOptions = response.data;
          this.title = "编辑一级分类";
          this.formStatus = "update";
          this.form.id = row.id;
          
          this.form.fileTypeText = row.fileTypeText;
          this.form.fileTypeTextEn = row.fileTypeTextEn;
          this.form.docTypeIds = [];
          row.docTypesList.map(item => {
            this.form.docTypeIds.push(item.id);
          });
          console.log(this.docTypeOptions);
          this.open = true;
        });
      } else if (row.isSystem === 1) {
        getParentList().then(response => {
          this.docTypeSecOptions = [];
          
          this.docTypeSecOptions = response.data;
          console.log(response.data);
          this.form.fileFrom = row.fileFrom;
          this.title = "编辑二级分类";
          this.form.id = row.id;
          this.form.fileTypeText = row.fileTypeText;
          this.form.fileTypeTextEn = row.fileTypeTextEn;
          this.form.fileOrderStage = undefined;
          // this.form.fileTypeKey = undefined;
          if (row.fileOrderStage) {
            this.form.fileOrderStage = row.fileOrderStage;
          }
         this.form.fileTypeKey = row.fileTypeKey;
         
          
          if (row.fileFormText) {
            this.form.fileFormText = row.fileFormText;
          }
          if (row.fileNotice) {
          this.form.fileNotice = row.fileNotice;
          }
           if (row.fileNoticeTime) {
          this.form.fileNoticeTime = row.fileNoticeTime;
          }
          if (row.showCustomer) {
          this.form.showCustomer = row.showCustomer;
          }
          if (row.activeArea) {
          this.form.activeArea = row.activeArea;
          }
          if (row.fclLcl) {
          this.form.fclLcl = row.fclLcl;
          }
          this.open1 = true;
        });
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addType(this.form).then(response => {
            
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
    },
    //修改一级弹框
    updateForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateTypeStage(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    //修改二级弹框
    updateSeForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          
          updateSecTypeStage(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open1 = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除所选数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delType(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有单证类型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportType(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
