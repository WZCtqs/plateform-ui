<template>
  <!-- 此页面总div -->
  <el-card>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="业务部门" prop="kporganization">
        <el-input v-model.trim="form.kporganization" placeholder="请输入业务部门"/>
        <el-input v-model.trim="form.userId" v-show="false"/>
      </el-form-item>
      <el-form-item label="申请人" prop="kpapplicantr">
        <el-input v-model.trim="form.kpapplicant" placeholder="请输入申请人"/>
      </el-form-item>
      <el-form-item label="申请部门" prop="kpapplydepartment">
        <el-input v-model.trim="form.kpapplydepartment" placeholder="请输入申请部门"/>
      </el-form-item>
      <el-form-item label="部门经理" prop="kpdepartmanager">
        <el-input v-model.trim="form.kpdepartmanager" placeholder="请输入部门经理"/>
      </el-form-item>
      <el-form-item label="跟单员" prop="kpmerchandiser">
        <el-input v-model.trim="form.kpmerchandiser" placeholder="请输入跟单员"/>
      </el-form-item>

    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm"
                 v-hasPermi="['personalInfo:invoice:add']"
      >保存
      </el-button>
    </div>
  </el-card>
</template>

<script>
    import {updateInvoice, getInvoiceInfo} from "@/api/personalInfo/invoice";
    export default {
        name: 'Invoice',
        data() {
            return {
                // 遮罩层
                loading: true,
                headers: {},
                // 表单参数
                form: {},
            };
        },
        created() {
            this.getUser();
        },
        methods: {
            getUser() {
                getInvoiceInfo().then(response => {
                    this.form = response.data;
                });
            },
            // 表单重置
            reset() {
                this.form = {
                    kpapplicant: undefined,
                    kporganization: undefined,
                    kpmerchandiser: undefined,
                    kpapplydepartment: undefined,
                    kpdepartmanager: undefined,
                    userId: undefined
                };
                this.resetForm("form");
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        updateInvoice(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess("保存成功");
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
