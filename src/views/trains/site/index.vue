<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="线路" prop="lineTypeid">
        <el-select
          v-model.trim="queryParams.lineTypeid"
          clearable
          size="small"
          style="width:100px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in lineOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中文城市名" prop="nameCn">
        <el-input
          v-model.trim="queryParams.nameCn"
          placeholder=""
          clearable
          style=""
          style="width:100px;"
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文城市名" prop="nameEn">
        <el-input
          v-model.trim="queryParams.nameEn"
          placeholder=""
          clearable
          style=""
          style="width:100px;"
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市用途" prop="type">
        <el-input
          v-model.trim="queryParams.type"
          placeholder=""
          clearable
          style=""
          style="width:100px;"
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          v-hasPermi="['trains:site:query']"
          @click="handleQuery"
          >搜索</el-button
        >
        <!-- <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['trains:site:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['trains:site:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['trains:site:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['trains:site:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="siteList"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection"
                       width="55"
                       align="center" /> -->
      <el-table-column label="中文城市名" align="center" prop="nameCn" />
      <el-table-column label="英文城市名" align="center" prop="nameEn" />
      <el-table-column label="中文国家" align="center" prop="countryCn" />
      <el-table-column label="英文国家" align="center" prop="countryEn" />
      <el-table-column label="时区" align="center" prop="timeZone" />
      <el-table-column label="城市用途" align="center" prop="type" />
      <el-table-column label="线路" align="center" prop="lineTypeid">
        <template v-if="scope.row.lineTypeid" slot-scope="scope">
          <span v-if="scope.row.lineTypeid.search('0') != -1">中欧</span>
          <span v-if="scope.row.lineTypeid.search('2') != -1">中亚</span>
          <span v-if="scope.row.lineTypeid.search('3') != -1">中越</span>
          <span v-if="scope.row.lineTypeid.search('4') != -1">中俄</span>
        </template>
        <template v-else slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['trains:site:edit']"
            >修改</el-button
          >
          <!-- 是 -->
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

    <!-- 添加或修改城市站点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="中文城市名称" prop="nameCn">
          <el-input
            v-model.trim="form.nameCn"
            style="width:230px;"
            placeholder="请输入中文城市名"
          />
        </el-form-item>
        <el-form-item label="城市英文名称" prop="nameEn">
          <el-input
            v-model.trim="form.nameEn"
            style="width:230px;"
            placeholder="请输入英文城市名"
          />
        </el-form-item>
        <el-form-item label="中文国家名称" prop="countryCn">
          <el-input
            v-model.trim="form.countryCn"
            style="width:230px;"
            placeholder="请输入中文国家名称"
          />
        </el-form-item>
        <el-form-item label="英文国家名称" prop="countryEn">
          <el-input
            v-model.trim="form.countryEn"
            style="width:230px;"
            placeholder="请输入英文国家名称"
          />
        </el-form-item>
        <el-form-item label="时区" prop="timeZone">
          <el-select
            v-model.trim="form.timeZone"
            clearable
            style="width:230px;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tZOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途">
          <el-select
            v-model.trim="form.type"
            clearable
            style="width:230px;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线路" prop="lineTypeid">
          <el-checkbox-group v-model.trim="form.lineTypeid">
            <el-checkbox v-for="dict in ltRadio" :label="dict.value">{{
              dict.label
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="服务" prop="bookingService">
          <el-checkbox-group v-model.trim="form.bookingService" style="width:500px;">
            <el-checkbox v-for="dict in bkRadio" :label="dict.value">{{
              dict.label
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="整/拼箱" prop="goodsType">
          <el-checkbox-group v-model.trim="form.goodsType" style="width:230px;"
            >>
            <el-checkbox v-for="dict in gtRadio" :label="dict.value">{{
              dict.label
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="去/回程" prop="eastWest">
          <el-checkbox-group v-model.trim="form.eastWest" style="width:230px;">
            <el-checkbox v-for="dict in ewRadio" :label="dict.value">{{
              dict.label
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSite,
  getSite,
  delSite,
  addSite,
  updateSite,
  exportSite
} from "@/api/trains/site";

export default {
  name: "Site",
  data() {
    return {
      // 线路下拉框
      lineOptions: [
        {
          value: "0",
          label: "中欧"
        },
        {
          value: "2",
          label: "中亚"
        },
        {
          value: "3",
          label: "中越"
        },
        {
          value: "4",
          label: "中俄"
        }
      ],
      tZOptions: [
        {
          value: "6",
          label: "6"
        },
        {
          value: "8",
          label: "8"
        }
      ],
      tyOptions: [
        {
          value: "城市",
          label: "城市"
        },
        {
          value: "站点",
          label: "站点"
        }
      ],
      ltRadio: [
        {
          value: "0",
          label: "中欧"
        },
        {
          value: "2",
          label: "中亚"
        },
        {
          value: "3",
          label: "中越"
        },
        {
          value: "4",
          label: "中俄"
        }
      ],
      // bkRadio: [
      //   {
      //     value: "0",
      //     label: "门到门"
      //   },
      //   {
      //     value: "1",
      //     label: "门到站"
      //   },
      //   {
      //     value: "2",
      //     label: "站到站"
      //   },
      //   {
      //     value: "3",
      //     label: "站到门"
      //   }
      // ],
      // gtRadio: [
      //   {
      //     value: "0",
      //     label: "整柜"
      //   },
      //   {
      //     value: "1",
      //     label: "拼箱"
      //   }
      // ],
      // ewRadio: [
      //   {
      //     value: "0",
      //     label: "去程"
      //   },
      //   {
      //     value: "1",
      //     label: "回程"
      //   }
      // ],
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
      // 城市站点表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        countryCode: undefined,
        countryCn: undefined,
        countryEn: undefined,
        code: undefined,
        nameCn: undefined,
        nameEn: undefined,
        timeZone: undefined,
        lineTypeid: undefined,
        state: undefined,
        type: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "城市代码不能为空", trigger: "blur" }
        ],
        nameCn: [
          { required: true, message: "城市中文名不能为空", trigger: "blur" }
        ],
        nameEn: [
          { required: true, message: "城市英文名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询城市 站点列表 */
    getList() {
      this.loading = true;
      listSite(this.queryParams)
        .then(response => {
          this.siteList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(() => {
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
        countryCode: undefined,
        countryCn: undefined,
        countryEn: undefined,
        code: undefined,
        nameCn: undefined,
        nameEn: undefined,
        timeZone: undefined,
        lineTypeid: "",
        state: undefined,
        type: undefined
        // bookingService: "",
        // goodsType: "",
        // eastWest: ""
      };
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
      this.reset();
      this.open = true;
      this.title = "添加城市站点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSite(id).then(response => {
        this.form = response.data;
        if (response.data.lineTypeid) {
          if (response.data.lineTypeid.search(",") != -1) {
            this.form.lineTypeid = response.data.lineTypeid.split(",");
          } else {
            this.form.lineTypeid = response.data.lineTypeid.split("");
          }
        } else {
          this.form.lineTypeid = [];
        }
        // if (response.data.bookingService) {
        //   if (response.data.bookingService.search(",") != -1) {
        //     this.form.bookingService = response.data.bookingService.split(",");
        //   } else {
        //     this.form.bookingService = response.data.bookingService.split("");
        //   }
        // } else {
        //   this.form.bookingService = [];
        // }
        // if (response.data.goodsType) {
        //   if (response.data.goodsType.search(",") != -1) {
        //     this.form.goodsType = response.data.goodsType.split(",");
        //   } else {
        //     this.form.goodsType = response.data.goodsType.split("");
        //   }
        // } else {
        //   this.form.goodsType = [];
        // }
        // if (response.data.eastWest) {
        //   if (response.data.eastWest.search(",") != -1) {
        //     this.form.eastWest = response.data.eastWest.split(",");
        //   } else {
        //     this.form.eastWest = response.data.eastWest.split("");
        //   }
        // } else this.form.eastWest = [];
        this.open = true;
        this.title = "修改城市站点";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.lineTypeid) {
        if (this.form.lineTypeid.length == 1) {
          this.form.lineTypeid = this.form.lineTypeid.join("");
        } else {
          this.form.lineTypeid = this.form.lineTypeid.join(",");
        }
      } else {
        this.form.lineTypeid = "";
      }
      // if (this.form.bookingService) {
      //   if (this.form.bookingService.length == 1) {
      //     this.form.bookingService = this.form.bookingService.join("");
      //   } else {
      //     this.form.bookingService = this.form.bookingService.join(",");
      //   }
      // } else {
      //   this.form.bookingService = "";
      // }
      // if (this.form.goodsType) {
      //   if (this.form.goodsType.length == 1) {
      //     this.form.goodsType = this.form.goodsType.join("");
      //   } else {
      //     this.form.goodsType = this.form.goodsType.join(",");
      //   }
      // } else {
      //   this.form.goodsType = "";
      // }
      // if (this.form.eastWest) {
      //   if (this.form.eastWest.length == 1) {
      //     this.form.eastWest = this.form.eastWest.join("");
      //   } else {
      //     this.form.eastWest = this.form.eastWest.join(",");
      //   }
      // } else {
      //   this.form.eastWest = "";
      // }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSite(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSite(this.form).then(response => {
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
      this.$confirm(
        '是否确认删除城市站点编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delSite(ids);
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
      this.$confirm("是否确认导出所有城市站点数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportSite(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
