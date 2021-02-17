<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="80px">
      <el-form-item label="去回程"
                    prop="goCome">
        <el-select v-model.trim="queryParams.goCome"
                   clearable
                   style="width:100px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in goComeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="箱型"
                    prop="consolidationType">
        <el-select v-model.trim="queryParams.consolidationType"
                   clearable
                   style="width:100px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in consolidationTypeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中文名字"
                    prop="nameZh">
        <el-input v-model.trim="queryParams.nameZh"
                  placeholder=""
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="英文名字"
                    prop="nameEn">
        <el-input v-model.trim="queryParams.nameEn"
                  placeholder=""
                  clearable
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   v-hasPermi="['yunFu:icon:query']"
                   @click="handleQuery">搜索</el-button>
        <!-- <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['yunFu:icon:add']">新增</el-button> -->
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['yunFu:icon:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="iconList"
              border
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       widt="55"
                       align="center" />
      <el-table-column label="去回程"
                       align="center"
                       prop="goCome">
        <template slot-scope="scope">
          <span v-if="scope.row.goCome==0">去程</span>
          <span v-else>回程</span>
        </template>
      </el-table-column>
      <el-table-column label="整拼箱"
                       align="center"
                       prop="consolidationType">
        <template slot-scope="scope">
          <span v-if="scope.row.consolidationType==0">整柜</span>
          <span v-else>拼箱</span>
        </template>
      </el-table-column>
      <el-table-column label="图标"
                       align="center"
                       prop="icon">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="中文名字"
                       align="center"
                       prop="nameZh" />
      <el-table-column label="英文名字"
                       align="center"
                       prop="nameEn" />
      <!-- <el-table-column label="排序"
                       align="center"
                       prop="sort" />
      <el-table-column label="备注"
                       align="center"
                       prop="remark" /> -->
      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['yunFu:icon:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['yunFu:icon:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改运 踪图标对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <!-- <el-form-item label="类型0去程1回程">
          <el-select v-model.trim="form.goCome"
                     placeholder="请选择类型0去程1回程">
            <el-option label="请选择字典生成"
                       value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="整拼箱 0整柜 1拼箱">
          <el-select v-model.trim="form.consolidationType"
                     placeholder="请选择整拼箱 0整柜 1拼箱">
            <el-option label="请选择字典生成"
                       value="" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="图标"
                      prop="icon">
          <!-- <el-input v-model.trim="form.icon"
                    placeholder=""> -->
          <i :class="form.icon"
             v-model.trim="form.icon"></i>
          <el-button type="text"
                     style="margin-left:10px;"
                     @click="chooseIcon">选择</el-button>
          <!-- </el-input> -->
        </el-form-item>
        <!-- <el-form-item label="中文名字"
                      prop="nameZh">
          <el-input v-model.trim="form.nameZh"
                    placeholder="请输入中文名字" />
        </el-form-item> -->
        <el-form-item label="英文名字"
                      prop="nameEn">
          <el-input v-model.trim="form.nameEn"
                    placeholder="" />
        </el-form-item>
        <!-- <el-form-item label="排序"
                      prop="sort">
          <el-input v-model.trim="form.sort"
                    placeholder="请输入排序" />
        </el-form-item> -->
        <!-- <el-form-item label="删除标志0正常1删除"
                      prop="delFlag">
          <el-input v-model.trim="form.delFlag"
                    placeholder="请输入删除标志0正常1删除" />
        </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 图标选择 -->
    <el-dialog :title="titlei"
               :visible.sync="openi"
               width="500px">
      <el-radio-group v-model.trim="form.icon">
        <el-radio v-for="dict in iconList1"
                  style="width:80px;margin-bottom:20px;"
                  :key="dict.value"
                  :label="dict.value"><i :class="dict.name"></i></el-radio>
      </el-radio-group>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="submitFormi">确 定</el-button>
        <el-button @click="canceli">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listIcon, getIcon, delIcon, addIcon, updateIcon, exportIcon } from "@/api/yunFu/icon";

export default {
  name: 'Icon',
  data () {
    return {
      iconList1: [
        {
          name: 'iconfont icon-icon-xiaoxi',
          value: 'iconfont icon-icon-xiaoxi'
        }, {
          name: 'iconfont icon-shenhetongguo',
          value: 'iconfont icon-shenhetongguo'
        }, {
          name: 'iconfont icon-songda',
          value: 'iconfont icon-songda'
        }, {
          name: 'iconfont icon-chaixiang',
          value: 'iconfont icon-chaixiang'
        }, {
          name: 'iconfont icon-fanghangshenhe',
          value: 'iconfont icon-fanghangshenhe'
        }, {
          name: 'iconfont icon-yijinzhan',
          value: 'iconfont icon-yijinzhan'
        }, {
          name: 'iconfont icon-icon_jinzhanshenqing',
          value: 'iconfont icon-icon_jinzhanshenqing'
        }, {
          name: 'iconfont icon-tihuo',
          value: 'iconfont icon-tihuo'
        }, {
          name: 'iconfont icon-sanhuo-tianxiedingcang',
          value: 'iconfont icon-sanhuo-tianxiedingcang'
        }, {
          name: 'iconfont icon-songhuo-copy',
          value: 'iconfont icon-songhuo-copy'
        }, {
          name: 'iconfont icon-qingguan-copy',
          value: 'iconfont icon-qingguan-copy'
        }
        // , {
        //   name: 'iconfont icon-qingguan',
        //   value: 'iconfont icon-qingguan'
        // }
        , {
          name: 'iconfont icon-songhuo',
          value: 'iconfont icon-songhuo'
        }, {
          name: 'iconfont icon-box-parcel-package-delivery-pack-office-facd-copy',
          value: 'iconfont icon-box-parcel-package-delivery-pack-office-facd-copy'
        }
        // , {
        //   name: 'iconfont icon-box-parcel-package-delivery-pack-office-facd',
        //   value: 'iconfont icon-box-parcel-package-delivery-pack-office-facd'
        // }
        , {
          name: 'iconfont icon-iconset0416',
          value: 'iconfont icon-iconset0416'
        }, {
          name: 'iconfont icon-baoxian',
          value: 'iconfont icon-baoxian'
        }, {
          name: 'iconfont icon-fasongziliao',
          value: 'iconfont icon-fasongziliao'
        }, {
          name: 'iconfont icon-inYard-copy',
          value: 'iconfont icon-inYard-copy'
        }, {
          name: 'iconfont icon-jizhuangxiang',
          value: 'iconfont icon-jizhuangxiang'
        }, {
          name: 'iconfont icon-train2',
          value: 'iconfont icon-train2'
        }, {
          name: 'iconfont icon-huanxiang',
          value: 'iconfont icon-huanxiang'
        }, {
          name: 'iconfont icon-cangku-',
          value: 'iconfont icon-cangku-'
        }, {
          name: 'iconfont icon-jizhuangxiang1',
          value: 'iconfont icon-jizhuangxiang1'
        }
        // , {
        //   name: 'iconfont icon-baoguan',
        //   value: 'iconfont icon-baoguan'
        // }
        , {
          name: 'iconfont icon-fangxiang',
          value: 'iconfont icon-fangxiang'
        }, {
          name: 'iconfont icon-appointment',
          value: 'iconfont icon-appointment'
        }, {
          name: 'iconfont icon-baoguan-copy',
          value: 'iconfont icon-baoguan-copy'
        }
      ],
      goComeOptions: [
        {
          value: '0',
          label: '去程'
        },
        {
          value: '1',
          label: '回程'
        }
      ],
      consolidationTypeOptions: [
        {
          value: '0',
          label: '整柜'
        },
        {
          value: '1',
          label: '拼箱'
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
      // 运踪图标表格数据
      iconList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 图标选择弹出层标题
      titlei: "",
      // 图标选择是否显示弹出层
      openi: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goCome: undefined,
        consolidationType: undefined,
        icon: undefined,
        nameZh: undefined,
        nameEn: undefined,
        sort: undefined,
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
    chooseIcon () {
      this.titlei = '图标选择';
      this.openi = true;
    },
    /** 查询运踪图标列表 */
    getList () {
      this.loading = true;
      listIcon(this.queryParams).then(response => {
        this.iconList = response.rows;
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
    // 图标选择取消按钮
    canceli () {
      this.openi = false;
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        goCome: undefined,
        consolidationType: undefined,
        icon: undefined,
        nameZh: undefined,
        nameEn: undefined,
        sort: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
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
      this.title = "添加运踪图标";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getIcon(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改运踪图标";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateIcon(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addIcon(this.form).then(response => {
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
    /** 图标选择提交按钮 */
    submitFormi: function () {
      this.openi = false;
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delIcon(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有运踪图标数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportIcon(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>
