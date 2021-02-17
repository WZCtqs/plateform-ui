<template>
  <!-- 此页面总div -->
  <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
         <p class="vertailForm_title">文件类型</p>
      <el-form-item prop="type" >
        <el-radio-group v-model.trim="form.type" @change="handleChangeType" >
          <el-radio-button
            v-for="dict in lgeOptions"
            :key="dict.value"
            :label="dict.value"
           
            >{{ dict.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <p class="vertailForm_title">文件上传</p>
      <el-form-item label="舱位号" prop="ordernumber">
        <el-input v-model.trim="form.ordernumber" placeholder="请输入委托书编号" />
      </el-form-item>
      <el-form-item prop="list">
        <el-upload
          :action="uploadUrl"
          :headers="headers"
          class="upload-demo"
          drag
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-success="imgSuccess"
          :file-list="form.list"
        >
         <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!-- <el-button size="small" type="primary">点击上传</el-button> -->
        </el-upload>
      </el-form-item>
    </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-card>
</template>

<script>
import {
  addServiceFile,
  updateServiceFile
} from "@/api/afterSaleManage/serviceFile";
import { getToken } from "@/utils/auth";
export default {
  name: "ServiceFile",
  data() {
    return {
      // 遮罩层
      loading: true,
      headers: {},
      // 是否显示弹出层
      fileList: [
        {
          name: "",
          url: ""
        }
      ],
      //编辑上传接口
      uploadUrl:
        process.env.VUE_APP_BASE_API +
        "/customerservice/serviceFile/insertfile",
      lgeOptions: [
        {
          label: "情况说明",
          value: "0"
        },
        {
          label: "回复函",
          value: "1"
        },
        {
          label: "赔付报告",
          value: "2"
        },
        {
          label: "通报",
          value: "3"
        }
      ],
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
      form: {
        list: [],
        ordernumber:''
      },
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.headers = { Authorization: "Bearer " + getToken() };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.reset();
    },
    // 表单重置
    reset() {
      this.fileList = [{ name: "", url: "" }];
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
        department: undefined,
        list: []
      };
      this.resetForm("form");
    },
    // 文件上传成功
    imgSuccess(file) {
      
      if (file.code === 200) {
        if (!this.form.list) {
          this.form.list = [];
        }
        this.form.list.push({
          name: file.name,
          url: file.url
        });
      }
    },
    handleRemove(file, fileList){
      console.log(file, fileList);
      this.form.list =[]
      
      fileList.map(item=>{
         this.form.list.push({
          name:item.name,
          url:item.url
        });
      })
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    handleChangeType(orderNumber, fileList) {
      
      this.form.ordernumber = '';
      this.form.list = [];
    },
    /** 提交按钮 */
    submitForm: function() {
      
      this.$refs["form"].validate(valid => {
        if (valid) {
          addServiceFile(this.form).then(response => {
            
            if (response.code === 200) {
              this.msgSuccess("新增成功");
               this.reset();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    }
  }
};
</script>
<style>
.vertailForm {
  margin: 0 auto;
  display: table;
}
.vertailForm_title {
  border-left: 2px solid #1682e6;
  padding-left: 12px;
  font-weight: 600;
}
</style>
