<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model.trim="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择评价开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model.trim="queryParams.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择评价结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
        v-hasPermi="['system:evaluation:userlist']"
        >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:evaluation:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="evaluationList" border :height="heightScreen">
      <el-table-column  width="1" align="center" />
      <el-table-column label="评价人工号" align="center" prop="evaluationNo" />
      <el-table-column label="评价人姓名" align="center" prop="evaluationName" />
      <el-table-column label="评价时间" align="center" prop="evaluationTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.evaluationTime) }}</span>
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

    <!-- 添加或修改部门考核管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px">
      <el-form ref="form" :model="form"   label-width="100px">
       <table border="1" id="table1" class="radiotable">
                <tbody><tr>
                    <td>登录账户</td>
                    <td>
                        <el-input v-model.trim="userid" type="text" id="username" style="width: 80px" disabled datacol="yes" value="1983"/></td>
                    <td>工号</td>
                    <td>
                        <el-input v-model.trim="form.evaluationNo" type="text" id="evaluation_no" style="width: 80px" datacol="yes" checkexpession="NotNull"/></td>
                    <td>姓名</td>
                    <td>
                        <el-input v-model.trim="form.evaluationName" type="text" id="evaluation_name" style="width: 80px" datacol="yes" checkexpession="NotNull"/></td>
                    <td colspan="3"></td>
                    </tr>
                    <tr>
                    <td colspan="9" style="text-align: left">尊敬的客户：<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 为及时发现各综合部门的不足，以提高班列操作水平及服务质量，请各业务部、拓展部、跟单部填写以下评价表。此评价为匿名，请大家提出真实、客观、全面的宝贵意见。
                    班列公司内部考评等级划分标准说明：“优中差”选择项，9个部门中的每一项要求选择&lt;优&gt;不能超过3个，选择&lt;差&gt;不能超过3个；选择优对应的给3分，选择差对应的给1分，选择中对应的给2分
                    </td>
                    </tr>
                    <tr>
                    <td>部门</td>
                    <td>工作效率</td>
                    <td>工作质量</td>
                    <td>责任心</td>
                    <td>工作态度</td>
                    <td>部门协作度</td>
                    <td>总分</td>
                    <td>平均分</td>
                    <td>评分依据</td>
                    </tr>
                    <tr>
                    <td>管理部</td>
                    <td>
                    <table >
	                  <tbody><tr>
		                <template >
                    <el-radio-group v-model.trim="form.managedeEfficiency" size="mini" @change="calculation('cz1Efficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.managedeQuality" size="mini" @change="calculation('managedeQuality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.managedeDuty" size="mini" @change="calculation('managedeDuty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.managedeAttitude" size="mini" @change="calculation('managedeAttitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.managedeTeam" size="mini" @change="calculation('managedeTeam')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.managedeTotal" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.managedeAve" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.managedegrading"  type="textarea" :rows="2" /></td>
                </tr>
                <tr>
                    <td>跟单部</td>
                    <td>
                    <table >
	                  <tbody><tr>
		                <template >
                    <el-radio-group v-model.trim="form.gdEfficiency" size="mini" @change="calculation('gdEfficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.gdQuality" size="mini" @change="calculation('gdQuality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.gdDuty" size="mini" @change="calculation('gdDuty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.gdAttitude" size="mini" @change="calculation('gdAttitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.gdTeam" size="mini" @change="calculation('gdTeam')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.gdTotal" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.gdAve" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.gdgrading"  type="textarea" :rows="2" /></td>
                </tr>
                    <tr>
                    <td>操作一部</td>
                    <td>
                    <table >
	                  <tbody><tr>
		                <template >
                    <el-radio-group v-model.trim="form.cz1Efficiency" size="mini" @change="calculation('cz1Efficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.cz1Quality" size="mini" @change="calculation('cz1Quality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.cz1Duty" size="mini" @change="calculation('cz1Duty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.cz1Attitude" size="mini" @change="calculation('cz1Attitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.cz1Team" size="mini" @change="calculation('cz1Team')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.cz1Total" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.cz1Ave" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.cz1grading"  type="textarea" :rows="2" /></td>
                </tr>
                <tr>
                    <td>集疏部</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.jsEfficiency" size="mini" @change="calculation('jsEfficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.jsQuality" size="mini" @change="calculation('jsQuality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.jsDuty" size="mini" @change="calculation('jsDuty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.jsAttitude" size="mini" @change="calculation('jsAttitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.jsTeam" size="mini" @change="calculation('jsTeam')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.jsTotal" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.jsAve" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.jsgrading" type="textarea" :rows="2" /></td>
                </tr>

                 <tr>
                    <td>箱管一部(负责国外)</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg1Efficiency" size="mini" @change="calculation('xg1Efficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg1Quality" size="mini" @change="calculation('xg1Quality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg1Duty" size="mini" @change="calculation('xg1Duty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg1Attitude" size="mini" @change="calculation('xg1Attitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg1Team" size="mini" @change="calculation('xg1Team')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.xg1Total" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.xg1Ave" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.xg1grading" type="textarea" :rows="2" /></td>
                </tr>
                <tr>
                    <td>拼箱部</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.pxEfficiency" size="mini" @change="calculation('pxEfficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.pxQuality" size="mini" @change="calculation('pxQuality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.pxDuty" size="mini" @change="calculation('pxDuty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.pxAttitude" size="mini" @change="calculation('pxAttitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.pxTeam" size="mini" @change="calculation('pxTeam')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.pxTotal" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.pxAve" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.pxgrading" type="textarea" :rows="2" /></td>
                </tr>
                 <tr>
                    <td>多式联运部</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.dslyEfficiency" size="mini" @change="calculation('dslyEfficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.dslyQuality" size="mini" @change="calculation('dslyQuality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.dslyDuty" size="mini" @change="calculation('dslyDuty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.dslyAttitude" size="mini" @change="calculation('dslyAttitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.dslyTeam" size="mini" @change="calculation('dslyTeam')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.dslyTotal" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.dslyAve" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.dslygrading" type="textarea" :rows="2" /></td>
                </tr>
                <tr>
                    <td>公路部</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.roadEfficiency" size="mini" @change="calculation('roadEfficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.roadQuality" size="mini" @change="calculation('roadQuality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.roadDuty" size="mini" @change="calculation('roadDuty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.roadAttitude" size="mini" @change="calculation('roadAttitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.roadTeam" size="mini" @change="calculation('roadTeam')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.roadTotal" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.roadAve" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.roadgrading" type="textarea" :rows="2" /></td>
                </tr>
                <tr>
                    <td>箱管二部(负责国内)</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg2Efficiency" size="mini" @change="calculation('xg2Efficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg2Quality" size="mini" @change="calculation('xg2Quality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg2Duty" size="mini" @change="calculation('xg2Duty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg2Attitude" size="mini" @change="calculation('xg2Attitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.xg2Team" size="mini" @change="calculation('xg2Team')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.xg2Total" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.xg2Ave" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.xg2grading" type="textarea" :rows="2" /></td>
                </tr>
                <tr>
                    <td>报关一部</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg1Efficiency" size="mini" @change="calculation('bg1Efficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg1Quality" size="mini" @change="calculation('bg1Quality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg1Duty" size="mini" @change="calculation('bg1Duty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg1Attitude" size="mini" @change="calculation('bg1Attitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg1Team" size="mini" @change="calculation('bg1Team')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.bg1Total" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.bg1Ave" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.bg1grading" type="textarea" :rows="2" /></td>
                </tr>
                <tr>
                    <td>报关二部</td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg2Efficiency" size="mini" @change="calculation('bg2Efficiency')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg2Quality" size="mini" @change="calculation('bg2Quality')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg2Duty" size="mini" @change="calculation('bg2Duty')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg2Attitude" size="mini" @change="calculation('bg2Attitude')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                    <td>
                    <table >
	                  <tbody><tr>
                    <template >
                    <el-radio-group v-model.trim="form.bg2Team" size="mini" @change="calculation('bg2Team')">
                    <el-radio :label="3">优</el-radio>
                    <el-radio :label="2">中</el-radio>
                    <el-radio :label="1">差</el-radio>
                    </el-radio-group>
                    </template>
	                  </tr>
                    </tbody></table>
                    </td>
                     <td>
                        <el-input v-model.trim="form.bg2Total" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.bg2Ave" type="number" style="width: 80px"  datacol="yes"/></td>
                    <td>
                        <el-input v-model.trim="form.bg2grading" type="textarea" :rows="2" /></td>
                </tr>

            </tbody></table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userlist,addEvaluation} from "@/api/system/evaluation";

export default {
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
      // 部门考核管理表格数据
      evaluationList: [],
      heightScreen:null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: undefined,
        endName: undefined,
      },
      // 表单参数
      form:{
        evaluationNo: null,
        evaluationName: null,
        evaluationTime: null,

        managedeEfficiency:null,
        managedeQuality:null,
        managedeDuty:null,
        managedeAttitude:null,
        managedeTeam:null,
        managedeTotal:null,
        managedeAve:null,
        managedegrading:null,

        gdEfficiency:null,
        gdQuality:null,
        gdDuty:null,
        gdAttitude:null,
        gdTeam:null,
        gdTotal:null,
        gdAve:null,
        gdgrading:null,

        cz1Efficiency:null,
        cz1Quality:null,
        cz1Duty:null,
        cz1Attitude:null,
        cz1Team:null,
        cz1Total:null,
        cz1Ave:null,
        cz1grading:null,

        jsEfficiency:null,
        jsQuality:null,
        jsDuty:null,
        jsAttitude:null,
        jsTeam:null,
        jsTotal:null,
        jsAve:null,
        jsgrading:null,

        xg1Efficiency:null,
        xg1Quality:null,
        xg1Duty:null,
        xg1Attitude:null,
        xg1Team:null,
        xg1Total:null,
        xg1Ave:null,
        xg1grading:null,

        pxEfficiency:null,
        pxQuality:null,
        pxDuty:null,
        pxAttitude:null,
        pxTeam:null,
        pxTotal:null,
        pxAve:null,
        pxgrading:null,

        dslyEfficiency:null,
        dslyQuality:null,
        dslyDuty:null,
        dslyAttitude:null,
        dslyTeam:null,
        dslyTotal:null,
        dslyAve:null,
        dslygrading:null,

        roadEfficiency:null,
        roadQuality:null,
        roadDuty:null,
        roadAttitude:null,
        roadTeam:null,
        roadTotal:null,
        roadAve:null,
        roadgrading:null,

        xg2Efficiency:null,
        xg2Quality:null,
        xg2Duty:null,
        xg2Attitude:null,
        xg2Team:null,
        xg2Total:null,
        xg2Ave:null,
        xg2grading:null,

        bg1Efficiency:null,
        bg1Quality:null,
        bg1Duty:null,
        bg1Attitude:null,
        bg1Team:null,
        bg1Total:null,
        bg1Ave:null,
        bg1grading:null,

        bg2Efficiency:null,
        bg2Quality:null,
        bg2Duty:null,
        bg2Attitude:null,
        bg2Team:null,
        bg2Total:null,
        bg2Ave:null,
        bg2grading:null
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.userid = this.$store.getters.name;
    this.getList();
  },
  mounted() {
     if(window.screen.height >800){
        this.heightScreen = 570
      }else{
        this.heightScreen = 470
      }
  },
  methods: {
    calculation(obj){
      //效率
      let arr = new Array();
      arr.push(this.form.managedeEfficiency);
      arr.push(this.form.gdEfficiency);
      arr.push(this.form.cz1Efficiency);
      arr.push(this.form.jsEfficiency);
      arr.push(this.form.xg1Efficiency);
      arr.push(this.form.pxEfficiency);
      arr.push(this.form.dslyEfficiency);
      arr.push(this.form.roadEfficiency);
      arr.push(this.form.xg2Efficiency);
      arr.push(this.form.bg1Efficiency);
      arr.push(this.form.bg2Efficiency);
      let abc = arr.reduce(function (prev, next) {
          prev[next] = (prev[next] + 1) || 1;
          return prev;
      }, {});
       console.log(11,abc)
      if (abc['3'] && abc['3'] > 3) {
        this.$message({
          showClose: true,
          message: '优，不能超过3个',
          type: 'error'
        });
        this.form[obj] = null;
        return;
      }
      if (abc['1'] && abc['1'] > 3) {
        this.$message({
          showClose: true,
          message: '差，不能超过3个',
          type: 'error'
        });
         this.form[obj] = null;
        return;
      }
      //质量
      let arr1 = new Array();
      arr1.push(this.form.managedeQuality);
      arr1.push(this.form.gdQuality);
      arr1.push(this.form.cz1Quality);
      arr1.push(this.form.jsQuality);
      arr1.push(this.form.xg1Quality);
      arr1.push(this.form.pxQuality);
      arr1.push(this.form.dslyQuality);
      arr1.push(this.form.roadQuality);
      arr1.push(this.form.xg2Quality);
      arr1.push(this.form.bg1Quality);
      arr1.push(this.form.bg2Quality);
      let abc1 = arr1.reduce(function (prev, next) {
          prev[next] = (prev[next] + 1) || 1;
          return prev;
      }, {});

      if (abc1['3'] && abc1['3'] > 3) {
        this.$message({
          showClose: true,
          message: '优，不能超过3个',
          type: 'error'
        });
        this.form[obj] = null;
        return;
      }
      if (abc1['1'] && abc1['1'] > 3) {
        this.$message({
          showClose: true,
          message: '差，不能超过3个',
          type: 'error'
        });
         this.form[obj] = null;
        return;
      }
      //责任
      let arr2 = new Array();
      arr2.push(this.form.managedeDuty);
      arr2.push(this.form.gdDuty);
      arr2.push(this.form.cz1Duty);
      arr2.push(this.form.jsDuty);
      arr2.push(this.form.xg1Duty);
      arr2.push(this.form.pxDuty);
      arr2.push(this.form.dslyDuty);
      arr2.push(this.form.roadDuty);
      arr2.push(this.form.xg2Duty);
      arr2.push(this.form.bg1Duty);
      arr2.push(this.form.bg2Duty);
      let abc2 = arr2.reduce(function (prev, next) {
          prev[next] = (prev[next] + 1) || 1;
          return prev;
      }, {});

      if (abc2['3'] && abc2['3'] > 3) {
        this.$message({
          showClose: true,
          message: '优，不能超过3个',
          type: 'error'
        });
        this.form[obj] = null;
        return;
      }
      if (abc2['1'] && abc2['1'] > 3) {
        this.$message({
          showClose: true,
          message: '差，不能超过3个',
          type: 'error'
        });
         this.form[obj] = null;
        return;
      }
      //态度
      let arr3 = new Array();
      arr3.push(this.form.managedeAttitude);
      arr3.push(this.form.gdAttitude);
      arr3.push(this.form.cz1Attitude);
      arr3.push(this.form.jsAttitude);
      arr3.push(this.form.xg1Attitude);
      arr3.push(this.form.pxAttitude);
      arr3.push(this.form.dslyAttitude);
      arr3.push(this.form.roadAttitude);
      arr3.push(this.form.xg2Attitude);
      arr3.push(this.form.bg1Attitude);
      arr3.push(this.form.bg2Attitude);
      let abc3 = arr3.reduce(function (prev, next) {
          prev[next] = (prev[next] + 1) || 1;
          return prev;
      }, {});

      if (abc3['3'] && abc3['3'] > 3) {
        this.$message({
          showClose: true,
          message: '优，不能超过3个',
          type: 'error'
        });
        this.form[obj] = null;
        return;
      }
      if (abc3['1'] && abc3['1'] > 3) {
        this.$message({
          showClose: true,
          message: '差，不能超过3个',
          type: 'error'
        });
         this.form[obj] = null;
        return;
      }
      //团队
      let arr4 = new Array();
      arr4.push(this.form.managedeTeam);
      arr4.push(this.form.gdTeam);
      arr4.push(this.form.cz1Team);
      arr4.push(this.form.jsTeam);
      arr4.push(this.form.xg1Team);
      arr4.push(this.form.pxTeam);
      arr4.push(this.form.dslyTeam);
      arr4.push(this.form.roadTeam);
      arr4.push(this.form.xg2Team);
      arr4.push(this.form.bg1Team);
      arr4.push(this.form.bg2Team);
      let abc4 = arr4.reduce(function (prev, next) {
          prev[next] = (prev[next] + 1) || 1;
          return prev;
      }, {});

      if (abc4['3'] && abc4['3'] > 3) {
        this.$message({
          showClose: true,
          message: '优，不能超过3个',
          type: 'error'
        });
        this.form[obj] = null;
        return;
      }
      if (abc4['1'] && abc4['1'] > 3) {
        this.$message({
          showClose: true,
          message: '差，不能超过3个',
          type: 'error'
        });
         this.form[obj] = null;
        return;
      }
      //管理部
      let managedeTotal=
      Number(this.form.managedeEfficiency==undefined?null:this.form.managedeEfficiency)+
      Number(this.form.managedeQuality==undefined?null:this.form.managedeQuality)+
      Number(this.form.managedeDuty==undefined?null:this.form.managedeDuty)+
      Number(this.form.managedeAttitude==undefined?null:this.form.managedeAttitude)+
      Number(this.form.managedeTeam==undefined?null:this.form.managedeTeam);
      let managedeAve=managedeTotal/5;
      this.$nextTick(function(){
        this.form.managedeTotal= managedeTotal;
        console.log(managedeTotal);
        this.form.managedeAve=managedeAve;
      });
      //跟单部
      let gdTotal=
      Number(this.form.gdEfficiency==undefined?null:this.form.gdEfficiency)+
      Number(this.form.gdQuality==undefined?null:this.form.gdQuality)+
      Number(this.form.gdDuty==undefined?null:this.form.gdDuty)+
      Number(this.form.gdAttitude==undefined?null:this.form.gdAttitude)+
      Number(this.form.gdTeam==undefined?null:this.form.gdTeam);
      let gdAve=gdTotal/5;
      this.$nextTick(function(){
        this.form.gdTotal= gdTotal;
        console.log(gdTotal);
        this.form.gdAve=gdAve;
      });
      //操作1
      let cz1Total=
      Number(this.form.cz1Efficiency==undefined?null:this.form.cz1Efficiency)+
      Number(this.form.cz1Quality==undefined?null:this.form.cz1Quality)+
      Number(this.form.cz1Duty==undefined?null:this.form.cz1Duty)+
      Number(this.form.cz1Attitude==undefined?null:this.form.cz1Attitude)+
      Number(this.form.cz1Team==undefined?null:this.form.cz1Team);
      let cz1Ave=cz1Total/5;
      this.$nextTick(function(){
        this.form.cz1Total= cz1Total;
        console.log(cz1Total);
        this.form.cz1Ave=cz1Ave;
      });

      //集疏部
      let jsTotal=
      Number(this.form.jsEfficiency==undefined?null:this.form.jsEfficiency)+
      Number(this.form.jsQuality==undefined?null:this.form.jsQuality)+
      Number(this.form.jsDuty==undefined?null:this.form.jsDuty)+
      Number(this.form.jsAttitude==undefined?null:this.form.jsAttitude)+
      Number(this.form.jsTeam==undefined?null:this.form.jsTeam);
      let jsAve=jsTotal/5;
      this.$nextTick(function(){
        this.form.jsTotal= jsTotal;
        console.log(jsTotal);
        this.form.jsAve=jsAve;
      });
      //箱管1部
      let xg1Total=
      Number(this.form.xg1Efficiency==undefined?null:this.form.xg1Efficiency)+
      Number(this.form.xg1Quality==undefined?null:this.form.xg1Quality)+
      Number(this.form.xg1Duty==undefined?null:this.form.xg1Duty)+
      Number(this.form.xg1Attitude==undefined?null:this.form.xg1Attitude)+
      Number(this.form.xg1Team==undefined?null:this.form.xg1Team);
      let xg1Ave=xg1Total/5;
      this.$nextTick(function(){
        this.form.xg1Total= xg1Total;
        console.log(xg1Total);
        this.form.xg1Ave=xg1Ave;
      });
      //拼箱部
      let pxTotal=
      Number(this.form.pxEfficiency==undefined?null:this.form.pxEfficiency)+
      Number(this.form.pxQuality==undefined?null:this.form.pxQuality)+
      Number(this.form.pxDuty==undefined?null:this.form.pxDuty)+
      Number(this.form.pxAttitude==undefined?null:this.form.pxAttitude)+
      Number(this.form.pxTeam==undefined?null:this.form.pxTeam);
      let pxAve=pxTotal/5;
      this.$nextTick(function(){
        this.form.pxTotal= pxTotal;
        console.log(pxTotal);
        this.form.pxAve=pxAve;
      });
      //多式联运部
      let dslyTotal=
      Number(this.form.dslyEfficiency==undefined?null:this.form.dslyEfficiency)+
      Number(this.form.dslyQuality==undefined?null:this.form.dslyQuality)+
      Number(this.form.dslyDuty==undefined?null:this.form.dslyDuty)+
      Number(this.form.dslyAttitude==undefined?null:this.form.dslyAttitude)+
      Number(this.form.dslyTeam==undefined?null:this.form.dslyTeam);
      let dslyAve=dslyTotal/5;
      this.$nextTick(function(){
        this.form.dslyTotal= dslyTotal;
        console.log(dslyTotal);
        this.form.dslyAve=dslyAve;
      });
      //公路部
      let roadTotal=
      Number(this.form.roadEfficiency==undefined?null:this.form.roadEfficiency)+
      Number(this.form.roadQuality==undefined?null:this.form.roadQuality)+
      Number(this.form.roadDuty==undefined?null:this.form.roadDuty)+
      Number(this.form.roadAttitude==undefined?null:this.form.roadAttitude)+
      Number(this.form.roadTeam==undefined?null:this.form.roadTeam);
      let roadAve=roadTotal/5;
      this.$nextTick(function(){
        this.form.roadTotal= roadTotal;
        console.log(roadTotal);
        this.form.roadAve=roadAve;
      });
      //箱管二部
      let xg2Total=
      Number(this.form.xg2Efficiency==undefined?null:this.form.xg2Efficiency)+
      Number(this.form.xg2Quality==undefined?null:this.form.xg2Quality)+
      Number(this.form.xg2Duty==undefined?null:this.form.xg2Duty)+
      Number(this.form.xg2Attitude==undefined?null:this.form.xg2Attitude)+
      Number(this.form.xg2Team==undefined?null:this.form.xg2Team);
      let xg2Ave=xg2Total/5;
      this.$nextTick(function(){
        this.form.xg2Total= xg2Total;
        console.log(xg2Total);
        this.form.xg2Ave=xg2Ave;
      });
       //报关一部
      let bg1Total=
      Number(this.form.bg1Efficiency==undefined?null:this.form.bg1Efficiency)+
      Number(this.form.bg1Quality==undefined?null:this.form.bg1Quality)+
      Number(this.form.bg1Duty==undefined?null:this.form.bg1Duty)+
      Number(this.form.bg1Attitude==undefined?null:this.form.bg1Attitude)+
      Number(this.form.bg1Team==undefined?null:this.form.bg1Team);
      let bg1Ave=bg1Total/5;
      this.$nextTick(function(){
        this.form.bg1Total= bg1Total;
        console.log(bg1Total);
        this.form.bg1Ave=bg1Ave;
      });
      //报关二部
      let bg2Total=
      Number(this.form.bg2Efficiency==undefined?null:this.form.bg2Efficiency)+
      Number(this.form.bg2Quality==undefined?null:this.form.bg2Quality)+
      Number(this.form.bg2Duty==undefined?null:this.form.bg2Duty)+
      Number(this.form.bg2Attitude==undefined?null:this.form.bg2Attitude)+
      Number(this.form.bg2Team==undefined?null:this.form.bg2Team);
      let bg2Ave=bg2Total/5;
      this.$nextTick(function(){
        this.form.bg2Total= bg2Total;
        console.log(bg2Total);
        this.form.bg2Ave=bg2Ave;
      });


    },
    /** 查询部门考核管理列表 */
    getList() {
      this.loading = true;
      userlist(this.queryParams).then(response => {
        this.evaluationList = response.rows;
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

    /** 新增按钮操作 */
     handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加部门考核管理";
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            addEvaluation(this.form).then(response => {
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
    }


  }
};
</script>
<style>

                td {
                    /*width: 80px;*/
                    text-align: center;
                }

                input {
                    display: block;
                    width: auto;
                    height: 20px;
                    text-align: center;
                }

                .radiotable .el-radio-group {
                    width: 20px;
                    font-size: 12px;
                    margin: 1px 20px 1px 20px;
                    vertical-align: middle;
                    align-content: center;
                }
.el-form-item__label {
padding: 0 0 0 0;
}
.el-input--medium .el-input__inner {
    height: 26px;
    line-height: 26px;
}
.el-input--small .el-input__inner {
    height: 26px;
    line-height: 26px;
}


.pjx22 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 20px !important;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.el-table {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    max-width: 100%;
    background-color: #FFFFFF;
    font-size: 10px;
    color: #606266;
}
.el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #dfe4ed;
    color: #606266;
    cursor: not-allowed;
}
.el-table--medium td, .el-table--medium th {
    padding: 0 0;
}
.el-table .el-table__header-wrapper th {
    word-break: break-word;
    background-color: #f8f8f9;
    color: #515a6e;
    height: 25px;
    font-size: 10px;
}
.pjx11 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 40px !important;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}

</style>
