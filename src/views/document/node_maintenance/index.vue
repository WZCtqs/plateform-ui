<template>
  <!-- 此页面总div -->
  <div>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="班列日期" prop="nameDate">
    <el-date-picker
      v-model.trim="value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="委托书编号(选填)" prop="name">
    <el-input v-model.trim="ruleForm.name" style="width:300px;"></el-input>
  </el-form-item>
  <el-form-item label="单证分类(选填)" prop="region">
    <el-select v-model.trim="ruleForm.region" placeholder="请选择">
      <el-option label="班列计划" value="shanghai"></el-option>
      <el-option label="公路运输" value="beijing"></el-option>
      <el-option label="报关操作" value="shanghai"></el-option>
      <el-option label="售后文件" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="单证名称(选填)" prop="region">
    <el-select v-model.trim="ruleForm.region" placeholder="请选择">
      <el-option label="单证1" value="shanghai"></el-option>
      <el-option label="单证2" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item  prop="region">
    <p>默认提供时间：2020/03/20 10:16:00</p>
  </el-form-item>
  <el-form-item label="更改默认时间"  prop="date1">
    <el-input-number v-model.trim="num" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
  </el-form-item>
  <el-form-item   prop="region">
     <el-date-picker
      v-model.trim="value11"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
  
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    <el-button @click="resetForm('ruleForm')">取消</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value1: '',
        value11: '',
        num: 1,
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          nameDate: [
            { required: true, message: '请选择班列日期', trigger: 'blur' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择更改默认时间', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },handleChange(value) {
        console.log(value);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>




  