<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="路线"
                    prop="typeid">
        <el-select v-model.trim="queryParams.typeid"
                   clearable
                   style="width:100px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in lineOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="口岸"
                    prop="classTPort">
        <el-input v-model.trim="queryParams.classPort"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="起运站"
                    prop="classTStationofdeparture">
        <el-input v-model.trim="queryParams.classTStationofdeparture"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="终点站"
                    prop="classTStationofdestination">
        <el-input v-model.trim="queryParams.classTStationofdestination"
                  placeholder=""
                  clearable
                  style="width:100px;"
                  size="mini"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="东西向"
                    prop="classTEastandwest">
        <el-select v-model.trim="queryParams.classTEastandwest"
                   clearable
                   style="width:100px;"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in cteOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   v-hasPermi="['trains:linesite:query']"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['trains:linesite:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['trains:linesite:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="linesiteList"
              border
              ref="multipleTable"
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="线路"
                       align="center"
                       prop="typeid">
        <template slot-scope="scope">
          <span v-if="scope.row.typeid==0">中欧</span>
          <span v-else-if="scope.row.typeid==2">中亚</span>
          <span v-else-if="scope.row.typeid==3">中越</span>
          <span v-else>中俄</span>
        </template>
      </el-table-column>
      <el-table-column label="线路中文名"
                       align="center"
                       prop="nameCn" />
      <el-table-column label="往返"
                       align="center"
                       width="100"
                       prop="classTEastandwest">
        <template slot-scope="scope">
          <span v-if="scope.row.classTEastandwest==0">西向</span>
          <span v-else>东向</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.state==0">禁用</span>
          <span v-else>启用</span> -->
          <el-switch v-model.trim="scope.row.state"
                     active-value="1"
                     @change="switchChange(scope.row)"
                     inactive-value="0"
                     active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="修改人"
                       align="center"
                       prop="updatename" />
      <el-table-column label="修改时间"
                       align="center"
                       prop="updatetime" />
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['trains:linesite:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['trains:linesite:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或 修改线路对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="700px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="路线"
                      prop="typeid">
          <el-radio-group v-model.trim="form.typeid">
            <el-radio v-for="dict in ltRadio"
                      @change="agreeChange"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="口岸"
                      prop="classTPort">
          <template v-if="form.typeid||form.typeid==0">
            <el-select v-model.trim="form.classTPort"
                       clearable
                       filterable
                       @change="kaSelect"
                       style="width:260px;"
                       placeholder="请选择">
              <el-option v-for="item in clpOptions"
                         :key="item.code"
                         :label="item.nameCn"
                         :value="item.code">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <el-select v-model.trim="form.classTPort"
                       clearable
                       disabled
                       style="width:260px;"
                       placeholder="请选择">
              <el-option v-for="item in clpOptions"
                         :key="item.code"
                         :label="item.nameCn"
                         :value="item.code">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="起运站"
                      prop="classTStationofdepartureCode">
          <template v-if="(form.typeid||form.typeid==0)&&form.classTPort">
            <el-select v-model.trim="form.classTStationofdepartureCode"
                       clearable
                       filterable
                       style="width:260px;"
                       @change="ctsSelect"
                       placeholder="请选择">
              <el-option v-for="item in ctsfOptions"
                         :key="item.code"
                         :label="item.nameCn"
                         :value="item.code">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <el-select v-model.trim="form.classTStationofdepartureCode"
                       clearable
                       filterable
                       disabled
                       style="width:260px;"
                       placeholder="请选择">
              <el-option v-for="item in ctsfOptions"
                         :key="item.code"
                         :label="item.nameCn"
                         :value="item.code">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="目的站"
                      prop="classTStationofdestinationCode">
          <template v-if="(form.typeid||form.typeid==0)&&form.classTPort">
            <el-select v-model.trim="form.classTStationofdestinationCode"
                       clearable
                       filterable
                       style="width:260px;"
                       @change="mdSelect"
                       placeholder="请选择">
              <el-option v-for="item in ctsOptions"
                         :key="item.code"
                         :label="item.nameCn"
                         :value="item.code">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <el-select v-model.trim="form.classTStationofdestinationCode"
                       clearable
                       style="width:260px;"
                       disabled
                       placeholder="请选择">
              <el-option v-for="item in ctsOptions"
                         :key="item.code"
                         :label="item.nameCn"
                         :value="item.code">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="状态"
                      prop="state">
          <el-radio-group v-model.trim="form.state">
            <el-radio v-for="dict in stateRadio"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="往返"
                      prop="classTEastandwest">
          <el-select v-model.trim="form.classTEastandwest"
                     clearable
                     style="width:260px;"
                     placeholder="请选择">
            <el-option v-for="item in ctOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行时间"
                      prop="classTTransporttime">
          <el-input v-model.trim="form.classTTransporttime"
                    style="width:260px;"
                    placeholder="请输入天数" /><span style="margin-left:10px;">天</span>
        </el-form-item>
        <el-form-item label="站点选择"
                      prop="siteCodesArr">
          <el-checkbox :indeterminate="isIndeterminate"
                       v-model.trim="checkAll"
                       @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model.trim="form.siteCodesArr"
                             @change="handleCheckedCitiesChange">
            <el-checkbox v-for="dict in siCheckbox"
                         v-key="dict.code"
                         :label="dict.code">{{dict.nameCn}}</el-checkbox>
          </el-checkbox-group>
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
import { changeStatus, lineTypeid, listLinesite, getLinesite, delLinesite, addLinesite, updateLinesite, exportLinesite } from "@/api/trains/linesite";

export default {
  name: 'Linesite',
  data () {
    return {
      qiyunCn: '',
      qiyunEn: '',
      qiyunCode: '',
      kouanCn: '',
      kouanEn: '',
      kouanCode: '',
      mudiCn: '',
      mudiEn: '',
      mudiCode: '',
      checkAll: false,
      isIndeterminate: true,
      ctsfOptions: [],
      ctsOptions: [],
      clpOptions: [{
        code: '86_833418',
        nameCn: '阿拉山口',
        nameEn: 'Alashankou'
      }, {
        code: '86_012600',
        nameCn: '二连浩特',
        nameEn: 'Erenhot'
      }, {
        code: '86_021400',
        nameCn: '满洲里',
        nameEn: 'Manzhouli'
      }, {
        code: '86_835221',
        nameCn: '霍尔果斯',
        nameEn: 'Khorgos'
      }, {
        code: '249',
        nameCn: '绥芬河',
        nameEn: 'Suifenhe'
      }, {
        code: '007_256',
        nameCn: '凭祥',
        nameEn: 'Pinxiang'
      }],
      lineOptions: [
        {
          value: '0',
          label: '中欧'
        },
        {
          value: '2',
          label: '中亚'
        }, {
          value: '3',
          label: '中越'
        }, {
          value: '4',
          label: '中俄'
        }
      ],
      ltRadio: [
        {
          value: '0',
          label: '中欧'
        },
        {
          value: '2',
          label: '中亚'
        }, {
          value: '3',
          label: '中越'
        }, {
          value: '4',
          label: '中俄'
        }
      ],
      cteOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      stateRadio: [
        {
          value: '0',
          label: '禁用'
        },
        {
          value: '1',
          label: '启用'
        }
      ],
      ctOptions: [
        {
          value: '0',
          label: '西向'
        },
        {
          value: '1',
          label: '东向'
        }
      ],
      siCheckbox: [],
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
      // 线路表格数据
      linesiteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeid: undefined,
        classPort: undefined,
        classTStationofdeparture: undefined,
        classTStationofdestination: undefined,
        classTEastandwest: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created () {
    this.getList();
  },
  watch: {
    // 'form.classTPort': {
    //   handler (newName, oldName) {
    //     if (newName != oldName && newName) {
    //       // this.siCheckbox = JSON.parse(JSON.stringify(this.zhandian))
    //       var codeid = this.form.classTPort;
    //       for (var i = 0; i < this.clpOptions.length; i++) {
    //         if (codeid == this.clpOptions[i].code) {
    //           this.kouanCode = this.clpOptions[i].code;
    //           this.kouanCn = this.clpOptions[i].nameCn;
    //           this.kouanEn = this.clpOptions[i].nameEn;
    //           this.form.nameEn = this.qiyunEn + '-' + this.kouanEn + '-' + this.mudiEn;
    //           this.form.nameCn = this.qiyunCn + '-' + this.kouanCn + '-' + this.mudiCn;
    //         }
    //       }
    //       this.zhandian();
    //     }
    //   },
    //   immediate: true
    // }
  },
  methods: {
    // 起运站下拉框事件
    ctsSelect () {
      var codeid = this.form.classTStationofdepartureCode
      if (codeid) {
        // let ctsFindArr = this.ctsfOptions.find(item => {
        //   return codeid = item.code
        // })
        // if (ctsFindArr.code) {
        //   this.qiyunCode = ctsFindArr.code;
        //   this.qiyunCn = ctsFindArr.nameCn;
        //   this.qiyunEn = ctsFindArr.nameEn;
        //   this.form.nameEn = this.qiyunEn + '-' + this.kouanEn + '-' + this.mudiEn;
        //   this.form.nameCn = this.qiyunCn + '-' + this.kouanCn + '-' + this.mudiCn;
        // }
        for (var i = 0; i < this.ctsfOptions.length; i++) {
          if (codeid == this.ctsfOptions[i].code) {
            this.qiyunCode = this.ctsfOptions[i].code;
            this.qiyunCn = this.ctsfOptions[i].nameCn;
            this.qiyunEn = this.ctsfOptions[i].nameEn;
            this.form.nameEn = this.qiyunEn + '-' + this.kouanEn + '-' + this.mudiEn;
            this.form.nameCn = this.qiyunCn + '-' + this.kouanCn + '-' + this.mudiCn;
          }
        }
      }
    },
    // 口岸下拉框
    kaSelect (val) {
      // var codeid = this.form.classTPort;
      // this.siCheckbox = this.zhandian;
      // this.siCheckbox = JSON.parse(JSON.stringify(this.zhandian))
      // var kaarr = [];
      // for (var i = 0; i < this.clpOptions.length; i++) {
      //   if (this.clpOptions[i].code != codeid) {
      //     kaarr.push(this.clpOptions[i]);
      //   }
      // }
      // for (var i = 0; i < this.siCheckbox.length; i++) {
      //   for (var j = 0; j < kaarr.length; j++) {
      //     if (kaarr[j].nameCn == this.siCheckbox[i].nameCn) {
      //       this.siCheckbox.splice(i, 1);
      //       j = j - 1;
      //     }
      //   }
      // }
      // if (codeid) {
      //   for (var i = 0; i < this.clpOptions.length; i++) {
      //     if (codeid == this.clpOptions[i].code) {
      //       this.kouanCode = this.clpOptions[i].code;
      //       this.kouanCn = this.clpOptions[i].nameCn;
      //       this.kouanEn = this.clpOptions[i].nameEn;
      //       this.form.nameEn = this.qiyunEn + '-' + this.kouanEn + '-' + this.mudiEn;
      //       this.form.nameCn = this.qiyunCn + '-' + this.kouanCn + '-' + this.mudiCn;
      //     }
      //   }
      // }
      var codeid = this.form.classTPort;
      for (var i = 0; i < this.clpOptions.length; i++) {
        if (codeid == this.clpOptions[i].code) {
          this.kouanCode = this.clpOptions[i].code;
          this.kouanCn = this.clpOptions[i].nameCn;
          this.kouanEn = this.clpOptions[i].nameEn;
          this.form.nameEn = this.qiyunEn + '-' + this.kouanEn + '-' + this.mudiEn;
          this.form.nameCn = this.qiyunCn + '-' + this.kouanCn + '-' + this.mudiCn;
        }
      }
      this.zhandian();
    },
    // 目的站下拉框
    mdSelect (val) {
      var codeid = this.form.classTStationofdestinationCode
      if (codeid) {
        // let cFindArr = this.ctsOptions.find(item => {
        //   return codeid = item.code
        // })
        // if (cFindArr.code) {
        //   this.mudiCode = cFindArr.code;
        //   this.mudiCn = cFindArr.nameCn;
        //   this.mudiEn = cFindArr.nameEn;
        //   this.form.nameEn = this.qiyunEn + '-' + this.kouanEn + '-' + this.mudiEn;
        //   this.form.nameCn = this.qiyunCn + '-' + this.kouanCn + '-' + this.mudiCn;
        // }
        for (var i = 0; i < this.ctsOptions.length; i++) {
          if (codeid == this.ctsOptions[i].code) {
            this.mudiCode = this.ctsOptions[i].code;
            this.mudiCn = this.ctsOptions[i].nameCn;
            this.mudiEn = this.ctsOptions[i].nameEn;
            this.form.nameEn = this.qiyunEn + '-' + this.kouanEn + '-' + this.mudiEn;
            this.form.nameCn = this.qiyunCn + '-' + this.kouanCn + '-' + this.mudiCn;
          }
        }
      }
    },
    // 站点全选
    handleCheckAllChange (val) {
      var arrsid = [];
      for (var i = 0; i < this.siCheckbox.length; i++) {
        arrsid.push(this.siCheckbox[i].code)
      }
      this.form.siteCodesArr = val ? arrsid : [];
      this.isIndeterminate = false;
    },
    //站点的选择事件
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.siCheckbox.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.siCheckbox.length;
    },
    //获取站点信息
    agreeChange () {
      this.zhandian();
      this.form.nameCn = undefined;
      this.form.nameEn = undefined;
      this.form.classTStationofdepartureCode = undefined;
      this.form.classTPort = '';
      this.form.classTStationofdestinationCode = undefined;
      this.form.sort = undefined;
      this.form.siteCodesArr = [];
      this.form.state = '1';
      this.form.classTEastandwest = undefined;
      this.form.classTTransporttime = undefined;
      this.form.delFlag = undefined
    },

    zhandian () {
      const idarr = {
        lineTypeid: this.form.typeid,
        portCode: this.form.classTPort
      }
      this.ctsfOptions = []
      this.ctsOptions = []
      this.siCheckbox = []
      lineTypeid(idarr).then(response => {
        if (response.code === 200) {
          response.rows.map(item => {
            this.ctsfOptions.push(item)
            this.ctsOptions.push(item)
            this.siCheckbox.push(item)
          })
        }
        // this.clpOptions = Object.assign({},response.rows);
        // this.zhandian = Object.assign({}, response.rows);

      });
    },
    /** 查询线 路列表 */
    getList () {
      this.loading = true;
      listLinesite(this.queryParams).then(response => {
        this.linesiteList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        typeid: undefined,
        nameCn: undefined,
        nameEn: undefined,
        classTStationofdepartureCode: undefined,
        classTPort: '',
        classTStationofdestinationCode: undefined,
        sort: undefined,
        siteCodesArr: [],
        state: '1',
        classTEastandwest: undefined,
        classTTransporttime: undefined,
        delFlag: undefined,
        updatename: undefined,
      };
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
    //点击行触发、选中或不选中复选框
    handleRowClick (row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.ctsfOptions = [];
      this.ctsOptions = [];
      // this.clpOptions = [];
      this.siCheckbox = [];
      this.form.siteCodesArr = [];
      this.open = true;
      this.title = "添加线路";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      this.ctsfOptions = [];
      this.ctsOptions = [];
      // this.clpOptions = [];
      this.siCheckbox = [];
      this.form.siteCodesArr = [];
      const id = row.id || this.ids
      getLinesite(id).then(response => {        ;
        this.form = Object.assign({}, response.data);
        // if (this.form.siteCodesArr.length == 1) {
        //   this.form.siteCodesArr = this.form.siteCodesArr.split('');
        // } else {
        //   this.form.siteCodesArr = this.form.siteCodesArr.split(',');
        // }
        this.form.typeid = this.form.typeid.toString();
        this.form.typeid = this.form.typeid.toString();
        this.form.typeid = this.form.typeid.toString();
        this.title = "修改线路";
        this.open = true;
        this.zhandian();
        this.handleCheckedCitiesChange(this.form.siteCodesArr);
      });
    },
    // 表格修改状态
    switchChange (row) {
      const swid = row.id
      var newArr = {}
      newArr.id = swid;
      newArr.state = row.state;
      changeStatus(newArr).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");

          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 提交 按钮 */
    submitForm: function () {
      // if (this.form.siteCodesArr.length == 1) {
      //   this.form.siteCodesArr = this.form.siteCodesArr.join('');
      // } else {
      //   this.form.siteCodesArr = this.form.siteCodesArr.join(',');
      // }
      this.form.updatename = this.$store.getters.name
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateLinesite(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                // this.queryParams.typeid = '';
                // this.queryParams.classPort = '';
                // this.queryParams.classTStationofdeparture = '';
                // this.queryParams.classTStationofdestination = '';
                // this.queryParams.classTEastandwest = '';
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addLinesite(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.queryParams.typeid = '';
                this.queryParams.classPort = '';
                this.queryParams.classTStationofdeparture = '';
                this.queryParams.classTStationofdestination = '';
                this.queryParams.classTEastandwest = '';
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
      this.$confirm('是否确认删除数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delLinesite(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有线路数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportLinesite(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }

  }
};
</script>