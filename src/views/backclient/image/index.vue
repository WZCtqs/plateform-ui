<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <!-- <el-form-item label="图片地址"
                    prop="picture">
        <el-input v-model.trim="queryParams.picture"
                  placeholder="请输入图片地址"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="跳转链接"
                    prop="url">
        <el-input v-model.trim="queryParams.url"
                  placeholder="请输入跳转链接"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否显示"
                    prop="isDisplay">
        <el-select v-model.trim="queryParams.isDisplay"
                   clearable
                   style="width:100px;"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="顺序"
                    prop="order">
        <el-input v-model.trim="queryParams.order"
                  placeholder="请输入顺序"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="语言"
                    prop="language">
        <el-select v-model.trim="queryParams.language"
                   clearable
                   style="width:100px;"
                   placeholder="请选择">
          <el-option v-for="item in lgoptions"
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
                   @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button> -->
        <el-button type="success"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['backclient:image:add']">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['backclient:image:remove']">删除</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['backclient:image:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['backclient:image:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['backclient:image:remove']">删除</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading"
              border
              :data="imageList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="图片"
                       align="center"
                       prop="picture">
        <template slot-scope="scope">
          <el-image :src="scope.row.picture">
            <div slot="placeholder"
                 class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接"
                       align="center"
                       prop="url" />
      <el-table-column label="是否显示"
                       align="center"
                       prop="isDisplay">
        <template slot-scope="scope">
          <span v-if="scope.row.isDisplay==0">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="顺序"
                       align="center"
                       prop="order" />
      <el-table-column label="语言"
                       align="center"
                       prop="language">
        <template slot-scope="scope">
          <span v-if="scope.row.language==0">中文</span>
          <span v-else>英文</span>
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
                     v-hasPermi="['backclient:image:edit']">修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['backclient:image:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改轮播图对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="500px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-form-item label="图片"
                      prop="picture">
          <el-upload :action="uploadImgUrl"
                     :headers="headers"
                     list-type="picture-card"
                     :limit="1"
                     :on-exceed="beforeAvatarUpload"
                     :on-preview="handlePictureCardPreview"
                     :on-success="imgSuccess"
                     :file-list="fileList"
                     :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%"
                 :src="form.picture"
                 alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="跳转链接"
                      prop="url">
          <el-input v-model.trim="form.url"
                    placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="是否显示"
                      prop="isDisplay">
          <el-radio-group v-model.trim="form.isDisplay">
            <el-radio v-for="dict in disOptions"
                      :key="dict.value"
                      :label="dict.value">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顺序"
                      prop="order">
          <el-input-number v-model.trim="form.order"
                           :min="0" />
        </el-form-item>
        <el-form-item label="语言"
                      prop="language">
          <el-radio-group v-model.trim="form.language">
            <el-radio v-for="dict in lgeOptions"
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
import {
  listImage,
  getImage,
  delImage,
  addImage,
  updateImage,
  exportImage
} from '@/api/backclient/image'
import { getToken } from '@/utils/auth'
export default {
  name: 'Image',
  data() {
    return {
      fileList: [
        {
          name: '',
          url: ''
        }
      ],
      uploadImgUrl:
        process.env.VUE_APP_BASE_API + '/backclient/image/insertfile',
      headers: {},
      dialogVisible: false,
      options: [
        {
          label: '是',
          value: 0
        },
        {
          label: '否',
          value: 1
        }
      ],
      lgoptions: [
        {
          label: '中文',
          value: 0
        },
        {
          label: '英文',
          value: 1
        }
      ],
      lgeOptions: [
        {
          label: '中文',
          value: '0'
        },
        {
          label: '英文',
          value: '1'
        }
      ],
      disOptions: [
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
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
      // 轮播图表格数据
      imageList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        url: undefined,
        isDisplay: undefined,
        language: undefined
        // picture: undefined,
        // order: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        picture: [
          { required: true, message: '请选择上传的图片', trigger: 'change ' }
        ],
        url: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
        isDisplay: [
          { required: true, message: '请选择是否显示', trigger: 'change ' }
        ],
        order: [{ required: true, message: '请选择顺序', trigger: 'change' }],
        language: [
          { required: true, message: '请选择语言', trigger: 'change ' }
        ]
      }
    }
  },
  created() {
    this.headers = { Authorization: 'Bearer ' + getToken() }
    this.getList()
  },
  methods: {
    // 上传之前判定是否只能上传一张图片
    beforeAvatarUpload(files, fileList) {
      if (files.length == 1) {
        this.$notify({
          title: '警告',
          message: '只允许上传一张图片！！！',
          type: 'warning'
        })
      }
    },
    // 删除图片
    handleRemove(file, fileList) {},
    // 上传图片
    handlePictureCardPreview(file) {
      // this.form.picture = file.url;
      this.dialogVisible = true
    },
    // 图片上传成功
    imgSuccess(file) {
      this.form.picture = file.fileUrl
      // this.dialogVisible = true;
    },
    /** 查询轮播图列表 */
    getList() {
      this.loading = true
      listImage(this.queryParams)
        .then(response => {
          this.imageList = response.rows
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.fileList = []
      this.form = {
        id: undefined,
        picture: '',
        url: undefined,
        // createBy: undefined,
        // createTime: undefined,
        // updateBy: undefined,
        // updateTime: undefined,
        // delFlag: undefined,
        isDisplay: '0',
        order: undefined,
        language: '0'
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加轮播图'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getImage(id).then(response => {
        this.fileList = [{ name: '', url: '' }]
        this.form = response.data
        this.fileList[0].name = ''
        this.fileList[0].url = response.data.picture
        this.open = true
        this.title = '修改轮播图'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateImage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addImage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delImage(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有轮播图数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportImage(queryParams)
        })
        .then(response => {
          this.download(response.msg)
        })
        .catch(function() {})
    }
  }
}
</script>