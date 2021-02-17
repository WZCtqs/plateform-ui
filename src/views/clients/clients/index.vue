<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">


<!-- <a :href="process.env.VUE_APP_BASE_API+'/cost/zgRailWayCost/downLoadExcel'">aaa</a> -->
      <!-- <el-form-item label="审核状态" prop="isexamline">
        <el-select v-model="queryParams.isexamline" @change="handleQuery" placeholder="请选择" size="small">
          <el-option label="审核通过" value="1" />
          <el-option label="待审核" value="0" />
          <el-option label="审核不通过" value="2" />
        </el-select>
      </el-form-item> -->

      <el-form-item label="单位名称" prop="clientUnit" label-width="80px">
        <el-input
          v-model="queryParams.clientUnit"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位属性" prop="isDirect" label-width="80px">
        <el-select v-model="queryParams.isDirect" placeholder="请选择单位属性" clearable size="small">
          <el-option label="-请选择-" value="" />
          <el-option label="货代" value="0" />
          <el-option label="直客" value="1" />
          <el-option label="其他" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="订舱人" prop="clientContacts">
        <el-input
          v-model="queryParams.clientContacts"
          placeholder="请输入订舱人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="推荐人" prop="clientTjr" v-if="queryParams.isexamline === '1'">
        <el-input
          v-model="queryParams.clientTjr"
          placeholder="请输入推荐人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

       <el-form-item label="登录名" prop="clientLoginuser" v-if="queryParams.isexamline === '1'">
        <el-input
          v-model="queryParams.clientLoginuser"
          placeholder="请输入登录名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


  <i class="el-icon-circle-plus" v-if="!moreQueryParams" @click="moreQueryParams=true"></i>  <!-- 展开更多查询条件 -->
<el-collapse-transition>
  <div v-if="moreQueryParams">

      <!-- 国内外客户，0是国内，1国外 -->
      <el-form-item label="客户类型" prop="engChinese" v-if="queryParams.isexamline === '1'">
        <el-select v-model="queryParams.engChinese" placeholder="请选择客户类型" clearable size="small">
          <el-option label="国内客户" value="0" />
          <el-option label="国外客户" value="1" />
        </el-select>
      </el-form-item>



      <el-form-item label="是否失信" prop="isNormal" v-if="queryParams.isexamline === '1'">
        <el-select v-model="queryParams.isNormal" placeholder="请选择是否失信" clearable size="small">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否签订合同" prop="isSign" v-if="queryParams.isexamline === '1'" label-width="120px">
        <el-select v-model="queryParams.isSign" placeholder="请选择是否签订合同" clearable size="small">
          <el-option label="是" value="0" />
          <el-option label="否" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="账户状态" prop="cancelaccount" v-if="queryParams.isexamline === '1'">
        <el-select v-model="queryParams.cancelaccount" placeholder="请选择账户状态" clearable size="small">
          <el-option label="启用" value="0" />
          <el-option label="锁定" value="1" />
          <el-option label="注销" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="" v-if="queryParams.isexamline === '1'">
         <el-input placeholder="请输入内容" v-model="gdVal" class="input-with-select">
          <!-- <el-select v-model="gdLabel" slot="prepend" placeholder="请选择" style="width:150px;">
            <el-option label="西向跟单员姓名" value="0" />
            <el-option label="西向跟单员工号" value="1" />
            <el-option label="东向跟单员姓名" value="2" />
            <el-option label="东向跟单员工号" value="3" />
            </el-select> -->

            <el-select v-model="gdLabel" slot="prepend" placeholder="请选择" style="width:150px;">
            <el-option label="跟单员姓名" value="0" />
            <el-option label="跟单员工号" value="1" />
            </el-select>
        </el-input>

      </el-form-item>

       <el-form-item label="法人代表" prop="clientLegalperson" v-if="queryParams.isexamline === '0' || queryParams.isexamline === '2'">
        <el-input
          v-model="queryParams.clientLegalperson"
          placeholder="请输入法人代表"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册日期" prop="createdate" v-if="queryParams.isexamline === '1'">
        <el-date-picker
          v-model="createdate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>


        <i class="el-icon-remove" v-if="moreQueryParams" @click="moreQueryParams=false"></i> <!-- 收起更多查询条件 -->
    </div>
 </el-collapse-transition>


      <el-form-item>
        (
          国内客户数量:{{cnNumber}}
       ;
          国外客户数量:{{enNumber}}
        )

        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>


    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['clients:clients:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="(single||(single&&queryParams.cancelaccount!=='3'))||queryParams.cancelaccount==='3'"
          @click="handleUpdate"
          v-hasPermi="['clients:clients:edit']"
          v-if="queryParams.isexamline === '1'"
        >修改</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['clients:clients:delete']"
        >删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" size="mini" :disabled="(single||(single&&queryParams.cancelaccount!=='3'))||queryParams.cancelaccount==='3'" v-hasPermi="['clients:clients:exam']" v-if="queryParams.isexamline === '1' || queryParams.isexamline === '0'"  @click="handleExam">客户审核信息</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" size="mini" :disabled="single" v-hasPermi="['clients:clients:query']" @click="handleDetail">查看</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" size="mini" icon="el-icon-download" v-hasPermi="['clients:clients:export']" v-if="queryParams.isexamline === '1'"  @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="(multiple||(multiple&&queryParams.cancelaccount!=='3'))||queryParams.cancelaccount==='3'"
          v-hasPermi="['clients:clients:editGd']"
          v-if="queryParams.isexamline === '1'"
          @click="handleGroupAdd"
        >批量修改跟单</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="(multiple||(multiple&&queryParams.cancelaccount!=='3'))||queryParams.cancelaccount==='3'"
          v-hasPermi="['clients:clients:exportMore']"
          v-if="queryParams.isexamline === '1'"
          @click="handleGroupEdit"
        >批量替换跟单</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          :disabled="(single||(single&&queryParams.cancelaccount!=='3'))||queryParams.cancelaccount==='3'"
          @click="handleVipEdit"
          v-hasPermi="['clients:clients:edit']"
          v-if="queryParams.isexamline === '1'"
        >编辑VIP</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="success "
          size="mini"
          :disabled="(multiple||(multiple&&queryParams.cancelaccount!=='3'))||queryParams.cancelaccount==='3'"
          @click="handleGroupDel"
          v-hasPermi="['clients:clients:deleteMore']"
          v-if="queryParams.isexamline === '1'"
        >批量删除跟单员</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" size="mini" v-hasPermi="['clients:clients:sendEmail']" v-if="queryParams.isexamline === '1'"  @click="handleEmail">发送邮件</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" :disabled="(single||(single&&queryParams.cancelaccount!=='3'))||queryParams.cancelaccount==='3'" v-hasPermi="['clients:clients:edit']" @click="handleYwEdit" v-if="queryParams.isexamline === '1'"  size="mini">业务部编辑</el-button>
      </el-col>
    </el-row>

    <el-table :class="this.heightScreen===590?'khsh22 el-tableCss0':'khsh11 el-tableCss0'" 
    ref="multipleTable" v-loading="loading" :data="clientsList"  border 
    @selection-change="handleSelectionChange" @row-click="handleRow" 
    :height="heightScreen">
      <el-table-column type="selection"  align="center" />
      <el-table-column label="单位名称" align="center" prop="clientUnit" />
      <el-table-column label="订舱人" align="center" prop="clientContacts" />

       <el-table-column label="国内/外客户" align="center">
        <template slot-scope="scope" >
          <span v-if="Number(scope.row.engChinese) === 0">国内客户</span>
          <span v-else-if="Number(scope.row.engChinese) === 1">国外客户</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="推荐人" align="center" prop="clientTjr"  />
      <el-table-column label="审核人" align="center" prop="clientExamperson" width="50" />
      <el-table-column label="职位" align="center" prop="clientZw" />
      <el-table-column label="手机号" align="center" prop="clientPhone" />
      <el-table-column label="固话" align="center" prop="clientTel" />
      <el-table-column label="订舱人邮箱" align="center" prop="clientEmail" />
      <el-table-column label="西向跟单员" align="center" prop="wMerchandiser" />
      <el-table-column label="东向跟单员" align="center" prop="eMerchandiser" />
      <el-table-column label="审核状态" align="center" width="29">
        <template slot-scope="scope">
          <span v-if="Number(scope.row.isexamline) === 0">待审核</span>
          <span v-else-if="Number(scope.row.isexamline) === 1">审核通过</span>
          <span v-else-if="Number(scope.row.isexamline) === 2">审核不通过</span>
          <span v-else></span>
        </template>
      </el-table-column>
       <el-table-column label="状态" align="center" width="29">
        <template slot-scope="scope">
          <span v-if="Number(scope.row.cancelaccount) === 0">启用</span>
          <span v-else-if="Number(scope.row.cancelaccount) === 1">锁定</span>
          <span v-else-if="Number(scope.row.cancelaccount) === 3">注销</span>
          <span v-else></span>
        </template>
      </el-table-column>

       <el-table-column label="是否失信" align="center" width="29">
        <template slot-scope="scope">
          <span v-if="Number(scope.row.isNormal) === 0">否</span>
          <span v-else-if="Number(scope.row.isNormal) === 1">是</span>
          <span v-else></span>
        </template>
      </el-table-column>

       <el-table-column label="单位属性" align="center" width="29">
        <template slot-scope="scope">
          <span v-if="scope.row.isDirect === '0'">货代</span>
          <span v-else-if="scope.row.isDirect === '1'">直客</span>
          <span v-else-if="scope.row.isDirect === '2'">其他</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdate" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.createdate">{{ parseTime(scope.row.createdate) }}</span>
          <span v-else>{{scope.row.createdate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            :disabled="scope.row.cancelaccount==='3'"
            v-hasPermi="['clients:clients:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['clients:clients:remove']"
          >删除</el-button>
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

    <!-- 添加或修改客户管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="90%">
      <el-form ref="form" :model="form" :rules="rules" label-width="280px" :disabled="formDisabled">

        <el-row>
          <el-col :span="10">
            <el-form-item label="法人代表" prop="clientLegalperson">
              <el-input v-model="form.clientLegalperson" placeholder="请输入法人代表" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="clientCode">
              <el-input v-model="form.clientCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="单位名称" prop="clientUnit">
              <el-input v-model="form.clientUnit" placeholder="请输入单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位地址" prop="clientAddress">
              <el-input v-model="form.clientAddress" placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="订舱人" prop="clientContacts">
              <el-input v-model="form.clientContacts" placeholder="请输入订舱人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮件" prop="clientEmail">
              <el-input v-model="form.clientEmail" placeholder="请输入邮件" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号" prop="clientPhone">
              <el-input v-model="form.clientPhone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机号" prop="clientTel">
              <el-input v-model="form.clientTel" placeholder="请输入座机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="部门" prop="clientDept">
              <el-input v-model="form.clientDept" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="clientZw">
              <el-input v-model="form.clientZw" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="郑州陆港推荐人" >
              <!-- <el-input v-model="form.clientTjr" placeholder="请输入推荐人" /> -->
              <!-- <el-input v-model="form.clientTjrId" v-show="false" /> -->
              <el-select v-model="clientTjrInfo" filterable >
                <el-option v-for="(item,index) in this.referenceLists" :key="index" :label="item.nickName" :value="item.nickName+ ',' +item.tjrId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="西向跟单员">
              <span v-if="form.wMerchandiser" style="border:1px solid #ccc;padding:10px;border-radius:5px;margin-right:5px;"> {{form.wMerchandiser}} </span>
              <el-button type="primary" size="small" @click="beforeSelected0('w')">选择</el-button>
              <el-button type="primary" size="small" @click="removeData('w')">清空</el-button>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="东向跟单员">
               <span v-if="form.eMerchandiser" style="border:1px solid #ccc;padding:10px;border-radius:5px;margin-right:5px;">{{form.eMerchandiser}}</span>
               <el-button type="primary" size="small" @click="beforeSelected0('e')">选择</el-button>
               <el-button type="primary" size="small" @click="removeData('e')">清空</el-button>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- <el-row>
          <el-col :span="10">
            <el-form-item label="国内外客户" prop="engChinese">
              <el-radio v-model="form.engChinese" label="0" :disabled="title==='修改客户管理'">国内客户</el-radio>
              <el-radio v-model="form.engChinese" label="1" :disabled="title==='修改客户管理'">国外客户</el-radio>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="11">
            <el-form-item label="单位属性" prop="isDirect">
               <el-radio v-model="form.isDirect" label="0" >货代</el-radio>
              <el-radio v-model="form.isDirect" label="1" >直客</el-radio>
              <el-radio v-model="form.isDirect" label="2" >其他</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否失信客户" prop="isNormal">
              <el-radio v-model="form.isNormal" label="0">否</el-radio>
              <el-radio v-model="form.isNormal" label="1">是</el-radio>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>

          <el-col :span="10">
            <el-form-item label="是否签署《国际运输物流服务合同》:" prop="isSign">
              <el-radio v-model="form.isSign" label="0">是</el-radio>
              <el-radio v-model="form.isSign" label="1">否</el-radio>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="老赖客户" prop="isNormal">
              <el-radio v-model="form.isNormal" label="0">否</el-radio>
              <el-radio v-model="form.isNormal" label="1">是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="12">
            <el-form-item label="客户等级" prop="clientGrade">
               <a
                class="starCss0"
                @mouseover="overStarFn0(item)"
                v-for="item in 5"
                :key="item"
                :class="(starLevel0>=item)?'starCss1':''"
              >
                <i class="el-icon-star-on" v-if="starLevel0>=item"></i>
                <i class="el-icon-star-off" v-if="starLevel0<item"></i>
              </a>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
            <el-col :span="16">
            <el-form-item label="有效期限" prop="clientDisableddate">
              <el-date-picker
                @change="getTime0"
                v-model="benginToend0"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="备注">
               <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入备注"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
          </el-col>
         </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="!formDisabled">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 东、西向跟单员列表弹框 -->
    <el-dialog
      width="65%"
      title="跟单员-选择"
      :visible.sync="wMerchandiserDialog"
      append-to-body
      :destroy-on-close="true"
      style="height:500px; over-flow:scroll;"
    >
    <el-form ref="form" :model="form" :rules="rules" label-width="90px" :disabled="formDisabled">
        <el-row>
           <el-col :span="24">
            <el-form-item label="东西向" prop="eastAndWest" v-if="this.gendanList=='add'">
              <el-radio v-model="form.eastAndWest" label="0">西向</el-radio>
              <el-radio v-model="form.eastAndWest" label="1">东向</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="listQuery0" ref="listQuery0" :inline="true" label-width="60px">
        <el-form-item label="姓名">
          <el-input
            v-model="listQuery0.nickName"
            placeholder="请输入姓名"
            clearable
            size="mini"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="工号">
          <el-input
            v-model="listQuery0.jobNumber"
            placeholder="请输入工号"
            clearable
            size="mini"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="账户">
          <el-input
            v-model="listQuery0.userName"
            placeholder="请输入账户"
            clearable
            size="mini"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="merchandiserListFn">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :row-key="getRowKey"
        ref="multipleTable0"
        :data="datalist0"
        @selection-change="handleSelectionChange0"

      >
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center" />
        <el-table-column label="职工工号" align="center" prop="jobNumber" />
        <el-table-column label="用户姓名" align="center" prop="nickName" />
        <el-table-column label="登录账号" align="center" prop="userName" />
        <el-table-column label="联系方式" align="center" prop="phonenumber" />
      </el-table>

      <el-row>
        <el-col :span="24">
          <el-button type="primary" v-if="this.gendanList=='choice'" @click="doSelected0()">确 定</el-button>
          <el-button type="primary" v-if="this.gendanList=='add'" @click="submitGroupAdd()">提 交</el-button>
          <el-button type="info" @click="cancelSelect0()">取 消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 客户审核信息 弹框 -->
    <el-dialog title="客户信息-审核" :visible.sync="open1" width="60%" :destroy-on-close="true">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="100px">
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="审核状态">
              <template>
                <el-radio v-model="form1.isexamline" label="2">审核不通过</el-radio>
                <el-radio v-model="form1.isexamline" label="1">审核通过</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row v-if="form1.isexamline === '1'">
          <el-col :span="12" >
            <el-form-item label="用户登录名">
              <el-input v-model="form1.clientLoginuser" placeholder="请输入用户登录名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码">
              <el-input v-model="form1.clientLoginpwd" placeholder="请输入用户密码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="form1.isexamline === '1'">
          <!-- <el-col :span="16">
            <el-form-item label="有效期限" prop="clientDisableddate">
              <el-date-picker
                @change="getTime"
                v-model="benginToend"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col> -->


            <el-col :span="12">
            <el-form-item label="有效期限开始日期" prop="clientValiditydate" label-width="150px">
                <el-date-picker
                  v-model="form1.clientValiditydate"
                  type="date"
                  :disabled="true"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>

            <el-col :span="12">
            <el-form-item label="有效期限结束日期" prop="clientDisableddate" label-width="150px">
                <el-date-picker
                 v-model="form1.clientDisableddate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row v-if="form1.isexamline === '1'">
          <el-col :span="12">
            <el-form-item label="账号状态">
              <template>
                <el-radio v-model="form1.cancelaccount" label="0">启用</el-radio>
                <el-radio v-model="form1.cancelaccount" label="1">锁定</el-radio>
              </template>
            </el-form-item>
          </el-col>


        </el-row>
        <el-row v-if="form1.isexamline === '2'">
          <el-col :span="20">
            <el-form-item label="审核原因">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入内容"
                v-model="form1.examinfo"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量跟单修改 弹框 -->
    <el-dialog title="跟单批量-修改" :visible.sync="open2" width="60%" :destroy-on-close="true">
      <el-form ref="form2" :model="form2" :rules="rules2" label-width="100px">
        <el-row>
          <el-col :span="10">
            跟单员:{{form2.jobNumber}}-{{ form2.nickName}}
            <!-- <el-form-item label="跟单员">
              <el-input ：v-model="form2.jobNumber + '-' + form2.nickName" :disabled="true" />
            </el-form-item> -->
          </el-col>
          <el-col :span="10">
            <el-form-item label="更换为">
              <el-select v-model="value8" filterable placeholder="请选择">
                <el-option
                  key="00"
                  label="-请选择-"
                  value="">
                </el-option>
                <el-option
                  v-for="item in datalist0"
                  :key="item.userId"
                  :label="item.jobNumber + '-' + item.nickName"
                  :value="item.jobNumber + ',' + item.nickName + ',' + item.dcUserId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm2">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑VIP 弹框 -->
    <el-dialog title="客户VIP信息-编辑" :visible.sync="open3" width="30%" :destroy-on-close="true">
      <el-form ref="form2" :model="form3" :rules="rules3" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="单位名称">
              <el-input v-model="form3.clientUnit" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="VIP">
              <el-radio v-model="form3.isVip" label="1">是</el-radio>
              <el-radio v-model="form3.isVip" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm3">确 定</el-button>
        <el-button @click="cancel3">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 发送邮件 弹框 -->
    <el-dialog title="发送邮件" :visible.sync="open5" width="40%" :destroy-on-close="true">
      <el-form ref="form5" :model="form5" :rules="rules5" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="注册时间" prop="registerStartTime">
              <el-date-picker
                v-model="value5"
                @change="getTime2"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发件人邮箱" prop="sendUserEmaill">
              <el-input v-model="form5.sendUserEmaill" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发件人邮箱密码" prop="emailPass">
              <el-input v-model="form5.emailPass" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="邮件标题" prop="title">
              <el-input v-model="form5.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮件内容" prop="content">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入内容"
                v-model="form5.content"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm5">发送邮件</el-button>
        <el-button @click="cancel5">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 业务部编辑 弹框 -->
    <el-dialog title="客户信息-编辑" :visible.sync="open6" width="60%" :destroy-on-close="true">
      <el-form ref="form6" :model="form6" label-width="280px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="单位名称">
              <el-input v-model="form6.clientUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="是否签署《国际运输物流服务合同》">
              <el-radio v-model="form6.isSign" label="1">否</el-radio>
              <el-radio v-model="form6.isSign" label="0">是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="20">
            <el-form-item label="客户等级">
              <el-input v-model="form6.clientGrade" />
            </el-form-item>
          </el-col> -->
          <el-col :span="20">
            <el-form-item label="合同有效期限">
              <el-date-picker
                v-model="value6"
                @change="getTime1"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm6">确 定</el-button>
        <el-button @click="cancel6">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listClients,
  referenceLists,
  merchandiserList,
  getClients,
  delClients,
  addClients,
  updateClients,
  auditClients,
  exportClients,
  getMerchandisersInfo,
  updateMerchandiser,
  deleteMore,
  sendEmail,
  calculateEnOrChNumApi,
  groupAddClients
} from "@/api/clients/clients";
import { validatePhone,validateTelphone,validateEMail } from "@/api/validator";
import "@/assets/styles/selfCss0.css";
import { timestampToTime } from "@/utils/zhonghao";

export default {
  name:'Clients',
  data() {
    return {
      cnNumber:0,
      enNumber:0,
      gendanList:'',//区分跟单选择,批量新增/修改
      clientTjrInfo:null, //推荐人用户信息
      referenceLists:[], // 推荐人列表信息
      value6:[],
      benginToend:[], //客户审核弹框中 合同的有效期限时间段数组
      open6: false, // 业务部编辑 弹框状态
      form6: {}, // 业务部编辑 form6表单弹框数据
      rules6: {}, // 业务部编辑 form6表单校验规则
      value5:[],
      open5: false, // 发送邮件 弹框状态
      form5: {


      }, // 发送邮件 form5表单弹框数据
      rules5: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        sendUserEmaill: [
          {
            required: true,
            message: "请输入发件人邮箱",
            trigger: "blur"
          }
        ],
        emailPass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入邮件内容",
            trigger: "blur"
          }
        ],
        registerStartTime: [
          {
            required: true,
            message: "请选择注册时间",
            trigger: "blur"
          }
        ],
      }, // 发送邮件 form5表单校验规则

      open3: false, // 编辑Vip 弹框状态
      form3: {}, // 编辑Vip form3表单弹框数据
      rules3: {}, // 编辑Vip form3表单校验规则



      open2: false, // 批量跟单员弹框状态
      form2: {}, // 批量修改跟单员弹框数据
      rules2: {}, // 批量跟单信息form2表单校验规则

      form1: {}, // 客户审核信息form1表单
      rules1: {
        clientDisableddate: [
          {
            required: true,
            message: "请输入账号有效期限",
            trigger: "blur"
          }
        ],
      }, // 客户审核信息form1表单校验规则
      open1: false, // 客户审核弹框是否显示
      listQuery0: {

      },
      //跟单员列表信息
      datalist0: [

      ],
      ids0: [],
      currentDirection: null,
      wMerchandiserDialog: false,

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中list数组
      arrs: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 客户管理表格数据
      clientsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 0 帐户注销字典
      cancelaccountOptions: [],
      // 国内外客户，0是国内，1国外字典
      engChineseOptions: [],
      // 是否失信字典
      isNormalOptions: [],
      // 单位属性字典
      isDirectOptions: [],
      // 是否签订合同字典
      isSignOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientIds:[],
        clientUnit: null,
        clientTjr: null,
        clientContacts: null,
        clientLoginuser: null,
        engChinese: null,
        // isDirect: '0',
        isNormal: "0",
        isSign: null,
        wMerchandiser: null,
        wMerchandiserNumber: null,
        // eMerchandiser: null,
        // eMerchandiserNumber: null,
        clientLegalperson: null,
        createdate: null, // 注册时间，是个确定的时间
        cancelaccount:null, // 客户的账号状态
        isexamline: "1", // 审核通过的客户
        deptCode:null
      },
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
      // 表单参数
      form: {},
      benginToend0:[], //客户新增、修改 弹框中 合同的有效期限时间段数组
      formDisabled: false,
      heightScreen:null,
      // 表单校验
      rules: {
        //   username: [
        //   {
        //     required: true,
        //     message: "请输入账户",
        //     trigger: "blur"
        //   },
        //   {
        //     min: 3,
        //     max: 20,
        //     message: "长度在 3 到 20 个字符",
        //     trigger: "blur"
        //   },
        //   { validator: unicodeVal, trigger: "blur" }
        // ],
        clientLegalperson: [
          {
            required: true,
            message: "请输入法人代表",
            trigger: "blur"
          }
        ],
        clientCode: [
          {
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur"
          }
        ],
        clientUnit: [
          {
            required: true,
            message: "请输入单位名称",
            trigger: "blur"
          }
        ],
        clientAddress: [
          {
            required: true,
            message: "请输入单位地址",
            trigger: "blur"
          }
        ],
        clientContacts: [
          {
            required: true,
            message: "请输入订舱人",
            trigger: "blur"
          }
        ],
        clientEmail: [
          {
            required: true,
            message: "请输入订舱人邮件",
            trigger: "blur"
          }
        ],
        clientPhone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          }
        ],
        clientTel: [
          {
            required: true,
            message: "请输入座机号",
            trigger: "blur"
          }
        ],
        clientDept: [
          {
            required: true,
            message: "请输入部门",
            trigger: "blur"
          }
        ],
        clientZw: [
          {
            required: true,
            message: "请输入职务",
            trigger: "blur"
          }
        ],
        clientTjr: [
          {
            required: true,
            message: "请输入郑州陆港推荐人",
            trigger: "blur"
          }
        ],

        wMerchandiser: [
          {
            required: true,
            message: "请输入西向跟单员",
            trigger: "blur"
          }
        ],

        // eMerchandiser: [
        //   {
        //     required: true,
        //     message: "请输入东向跟单员",
        //     trigger: "blur"
        //   }
        // ],

        isDirect: [
          {
            required: true,
            message: "请选择单位属性",
            trigger: "blur"
          }
        ],
        isNormal: [
          {
            required: true,
            message: "请选择是否失信",
            trigger: "blur"
          }
        ],
        eastAndWest: [
          {
            required: true,
            message: "请选择东西向",
            trigger: "blur"
          }
        ],
        isSign: [
          {
            required: true,
            message: "请选择是否签订协议",
            trigger: "blur"
          }
        ],

        clientGrade: [
          {
            required: true,
            message: "请输入客户等级",
            trigger: "blur"
          }
        ],
        clientDisableddate: [
          {
            required: true,
            message: "请输入账号有效期限",
            trigger: "blur"
          }
        ],
        // signDate: [
        //   {
        //     required: true,
        //     message: "请选择合同有效日期",
        //     trigger: "blur"
        //   }
        // ],
        // signDisabledDate: [
        //   {
        //     required: true,
        //     message: "请选择合同失效日期",
        //     trigger: "blur"
        //   }
        // ]
      },
      starLevel0:0,
      starLevel: 0,

      // 跟单员信息
      gdInfo:{},
      // 新的跟单员
      value8:{},
      moreQueryParams:false,
      hrefStr:null,
      gdLabel:'0',
      gdVal:null,
    };
  },
  created() {
    // alert(this.$store.getters.deptCode)
        this.queryParams['userid'] = this.$store.getters.id;

    this.queryParams.deptCode = this.$store.getters.deptCode
    this.getList();

    this.referenceListsFn();

    // this.hrefStr=process.env.VUE_APP_BASE_API
  },
  mounted() {    
     if(window.screen.height >800){
        this.heightScreen = 590
      }else{
        this.heightScreen = 470
      }
  },
  watch: {
     gdVal:{
      handler:function(val){
        if(val){
          if(this.gdLabel === '0'){
            this.queryParams['wMerchandiser']=this.gdVal
            this.queryParams['wMerchandiserNumber']=null
          }else if(this.gdLabel === '1'){
            this.queryParams['wMerchandiser']=null
            this.queryParams['wMerchandiserNumber']=this.gdVal
          }
        }else{
           this.queryParams['wMerchandiserNumber']=null
           this.queryParams['wMerchandiser']=null
        }
      }
    },
    gdLabel:{
      handler:function(val){
        if(val){
          if(val === '0'){
            this.queryParams['wMerchandiser']=this.gdVal
            this.queryParams['wMerchandiserNumber']=null
          }else if(val === '1'){
            this.queryParams['wMerchandiser']=null
            this.queryParams['wMerchandiserNumber']=this.gdVal
          }
        }
      }
    },
    createdate:{
      handler:function(val){
        if(val){
          this.queryParams.registerStartTime=val[0]
          this.queryParams.registerEndTime=val[1]
        }else{
          this.queryParams.registerStartTime=null
          this.queryParams.registerEndTime=null
        }
      }
    },
    clientTjrInfo:{
      handler:function(val){
        if(val){
          this.form.clientTjr=val.split(",")[0]
          this.form.clientTjrId=val.split(",")[1]
        }else{
          this.form.clientTjr=null
          this.form.clientTjrId=null
        }
      }
    },

    form: {
      handler: function(val) {
        if (val) {
          if (val.clientGrade) {
            this.starLevel0 = Number(val.clientGrade);
          } else {
            this.starLevel0 = 0;
          }
          if(this.form.clientTjr && this.form.clientTjrId){
            this.clientTjrInfo=this.form.clientTjr+","+this.form.clientTjrId
          }
        }

      },
      deep: true
    },
    form1: {
      handler: function(val) {
        if (val) {
          if (val.clientGrade) {
            this.starLevel = Number(val.clientGrade);
          } else {
            this.starLevel = 0;
          }
        }
      },
      deep: true
    },
    // 客户审核 有效期限
    open1: {
      handler: function(val) {

        if (val === false) {
          this.benginToend = [];
        }else{

        }
      }
    },
   // 客户新增、修改 有效期限
    open: {
      handler: function(val) {

      }
    },



    // 发送邮件 注册时间
    open5: {
      handler: function(val) {
        if (val === false) {
          this.value5 = [];
        }else{
          this.value5=[this.form5.registerStartTime,this.form5.registerEndTime]
        }
      }
    }
  },
  methods: {
    // 获取国内外客户统计值
    calculateEnOrChNumFn(obj){

      calculateEnOrChNumApi(obj).then(res=>{
        if(res.code === 200){
           this.cnNumber=res.data.chNum
           this.enNumber=res.data.enNum
        }else{
          this.$message.error(res.msg)
        }
      })
    },

    // 获取跟单员列表信息
    merchandiserListFn(){
      //
      merchandiserList(this.listQuery0).then(res=>{
        if(res.code === 200){
            this.datalist0=res.data
        }else{
          this.$message.error(res.msg)
        }
      })
    },

    // 获取推荐人列表信息
    referenceListsFn(){
      referenceLists().then(res=>{
        this.referenceLists=res.data
      })
    },

     // 客户新增、修改弹框中 “客户等级”的设置
    overStarFn0(index) {
      // alert(index)
      this.starLevel0 = index;
      this.form.clientGrade = index;
    },

     // 客户审核弹框中 “客户等级”的设置
    overStarFn(index) {
      // alert(index)
      this.starLevel = index;
      this.form1.clientGrade = index;
    },

    //客户审核弹框中合同有效时间段的时间格式转换和赋值
     getTime() {
        if(this.benginToend[0]){
        this.form1.clientValiditydate = timestampToTime(this.benginToend[0]);
        }
        if(this.benginToend[1]){
        this.form1.clientDisableddate = timestampToTime(this.benginToend[1]);
        }

    },

     //客户新增修改弹框中合同有效时间段的时间格式转换和赋值
     getTime0() {
       if(this.benginToend0){
         if(this.benginToend0[0]){
            this.form.clientValiditydate = timestampToTime(this.benginToend0[0]);
         }

         if(this.benginToend0[1]){
            this.form.clientDisableddate = timestampToTime(this.benginToend0[1]);
         }

       }

    },

      //客户新增修改弹框中合同有效时间段的时间格式转换和赋值
     getTime1() {
      if(this.value6[0]){
          this.form6.signDate = timestampToTime(this.value6[0]);
      }
      if(this.value6[1]){
        this.form6.signDisableddate = timestampToTime(this.value6[1]);
      }


    },

       //发送邮件 的注册时间时间格式转换和赋值
     getTime2() {
       if(this.value5[0]){
           this.form5.registerStartTime = timestampToTime(this.value5[0]);
       }else{
         this.form5.registerEndTime = timestampToTime(this.value5[1]);
       }
    },

    /**  业务部编辑 打开弹框 */
    handleYwEdit() {
      this.form6={}
      const clientId = this.ids;
      getClients(clientId).then(response => {
        this.form6 = response.data

         if(this.form6.signDate){
            this.value6[0]=this.form6.signDate
          }else{
             this.value6[0]='0000-00-00'
          }
          if(this.form6.signDisableddate){
            this.value6[1]=this.form6.signDisableddate
          }else{
            this.value6[1]='0000-00-00'
          }


        this.open6 = true
      });
    },
    /**  业务部编辑 表单提交*/
    submitForm6() {
       this.form6.powerType=this.form6.isSign
       updateClients(this.form6).then(res => {
        this.open6 = false;
        this.getList()
      });
    },
    /**  业务部编辑 表单取消操作 */
    cancel6() {
      this.form6 = {};
      this.open6 = false;
    },

    /**  发送邮件 打开弹框 */
    handleEmail() {
      this.open5 = true;
    },
    /**  发送邮件 表单提交*/
    submitForm5() {
      this.$refs["form5"].validate(valid => {
        if (valid) {
          sendEmail(this.form5).then(res=>{
            this.open5 = false
            if(res.code === 200){
                this.$message.success('发送成功')
            }else{
                this.$message.error(res.msg)
            }
          })
        }
      });

    },
    /**  发送邮件 表单取消操作 */
    cancel5() {
      this.form5 = {};
      this.open5 = false;
    },

    /**  编辑Vip 打开弹框 */
    handleVipEdit() {
      this.form3={}
      const clientId = this.ids;
      getClients(clientId).then(response => {
        this.form3 = response.data;
        this.open3 = true;
      });
    },
    /**  编辑Vip 表单提交*/
    submitForm3() {
      updateClients(this.form3).then(res => {
        this.open3 = false;
        this.getList()
      });
    },
    /**  编辑Vip 表单取消操作 */
    cancel3() {
      this.form3 = {};
      this.open3 = false;
    },

    /**  批量跟单删除 打开弹框 */
    handleGroupDel() {
      let typeStr0=null
      let nameStr0=null
      let typeStr=null
      if (this.queryParams.wMerchandiser) {
          nameStr0 = this.queryParams.wMerchandiser
          typeStr='0'
      }else if (this.queryParams.wMerchandiserNumber) {
           nameStr0 = this.queryParams.wMerchandiserNumber
           typeStr='1'
      }else{
          nameStr0 = null
          this.$message.info('请输入跟单员或工号');
          return;
      }

      const params0={
        numberOrName:nameStr0,
        type:typeStr  //跟单详情接口 type: 姓名是0 工号是1
      }
      getMerchandisersInfo(params0).then(res=>{
        if(res.code === 200){
          this.gdInfo=res.data
          this.form2=res.data

            let params={}
            if(this.queryParams.wMerchandiser || this.queryParams.wMerchandiserNumber ){
              params={
                clientIds:this.ids.join(','),
                oldWMerchandiserId:this.gdInfo.userId,
                oldWMerchandiser:this.gdInfo.nickName,
                oldWMerchandiserNumber:this.gdInfo.jobNumber,

                oldEMerchandiserId: this.gdInfo.userId,
                oldEMerchandiser:this.gdInfo.nickName,
                oldEMerchandiserNumber:this.gdInfo.jobNumber,

                // type:typeStr0      // 跟单删除和修改接口 type:西向是0，东向是1
              }
                this.$confirm('确定删除此跟单员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMore(params).then((res) => {
                      if(res.code === 200){
                        this.getList()
                      }else{
                        this.$message.error(res.msg)
                      }

                    })
                })
            }
        }else{
          this.$message.info(res.msg);
        }

      })

    },

    /**  批量跟单修改 打开弹框 */
    handleGroupEdit() {
      this.merchandiserListFn()
      let typeStr=null
      let nameStr=null
      if (this.queryParams.wMerchandiser) {
          nameStr = this.queryParams.wMerchandiser
      }else if (this.queryParams.wMerchandiserNumber) {
           nameStr = this.queryParams.wMerchandiserNumber
      }else{
          nameStr = null
          this.$message.info('请输入跟单员或工号');
          return;
      }
      if(this.queryParams.wMerchandiser){
        typeStr='0'
      }else  if(this.queryParams.wMerchandiserNumber){
        typeStr='1'
      }
      const rowsArr = this.arrs; //选中行[object]数组
      const ids = this.ids; //选中行[id]数组
      this.open2 = true;
      const params={
        numberOrName:nameStr,
        type:typeStr
      }
      getMerchandisersInfo(params).then(res=>{
        if(res.code === 200){
          this.gdInfo=res.data
          this.form2=res.data
          this.value8=""
        }else{
           this.open2 = false
          this.$message.info(res.msg);
        }

      })
    },
    /**  批修改跟单 表单提交*/
    submitForm2() {
       let newGd={jobNumber:this.value8.split(',')[0],nickName:this.value8.split(',')[1],userId:this.value8.split(',')[2]}

       let params={}
       if(!this.gdInfo){
          return false
       }
       params={
          clientIds:this.ids.join(','),
          oldWMerchandiserId:this.gdInfo.userId.trim(),
          oldWMerchandiser:(this.gdInfo.nickName).trim(),
          oldWMerchandiserNumber:this.gdInfo.jobNumber.trim(),
          newWMerchandiserId:newGd.userId.trim(),
          newWMerchandiserNumber:newGd.jobNumber.trim(),
          newWMerchandiser:newGd.nickName.trim(),

          oldEMerchandiserId: this.gdInfo.userId.trim(),
          oldEMerchandiser:this.gdInfo.nickName.trim(),
          oldEMerchandiserNumber:this.gdInfo.jobNumber.trim(),
          newEMerchandiserId:newGd.userId.trim(),
          newEMerchandiserNumber:newGd.jobNumber.trim(),
          newEMerchandiser:newGd.nickName.trim(),

          // type:typeStr      // 跟单删除和修改接口 type:西向是0，东向是1
        }

      if(this.gdInfo.userId.toString() === newGd.userId){
       this.$message.info('请选择新的跟单员');
      }else{
          updateMerchandiser(params).then(res=>{
            if(res.code === 200){
              this.open2 = false;
              this.getList()
            }else{
              this.$message.error(res.msg)
            }

          })

      }


    },
    /**  批量修改跟单 表单取消操作 */
    cancel2() {
      this.form2 = {};
      this.open2 = false;
    },

    // 客户审核表单重置
    resetForm1() {
      this.form1 = {};
    },
    // 打开 客户审核 弹框
    handleExam() {
      this.resetForm1();
      const clientId = this.ids;

      getClients(clientId).then(response => {
        this.form1 = response.data;
        this.form1.isDirect=response.data.isDirect.toString()
        // this.form1.isDirect='0'
         this.benginToend0=[];
         if(this.form1.clientValiditydate){
            this.benginToend[0]=this.form1.clientValiditydate
          }else{
             this.benginToend[0]='0000-00-00'
          }
          if(this.form1.clientDisableddate){
            this.benginToend[1]=this.form1.clientDisableddate
          }else{
            this.benginToend[1]='0000-00-00'
          }
        this.open1 = true;
      });
    },
    // 客户审核信息 提交按钮
    submitForm1() {

      this.$refs["form1"].validate(valid => {
        if (valid) {

          auditClients(this.form1).then(res => {
           if(res.code === 200){
              this.open1 = false;
              this.getList()
           }else{
              this.$message.error(res.msg)
           }
          });
        }
      });
    },
    // 客户审核信息 取消按钮
    cancel1() {
      this.resetForm1();
      this.open1 = false;
    },
    getRowKey(row){
    return row.userId
    },
    // 东、西向 跟单员弹框 多选框选中数据
    handleSelectionChange0(selection) {
      this.ids0 = selection.map(item => item);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 东、西向 跟单员弹框 数据清空
    removeData(obj){
        if (obj === "w") {
          this.form.wMerclear = 0;
          this.form.wMerchandiserId = null ;
          this.form.wMerchandiser = null ;
          this.form.wMerchandiserNumber = null ;
      } else{
          this.form.eMerclear = 0;
          this.form.eMerchandiserId = null;
          this.form.eMerchandiser = null;
          this.form.eMerchandiserNumber = null;
        }
    },

    // 东、西向 跟单员弹框 数据选中状态初始化
    beforeSelected0(obj) {
      let arr0 = [];
      this.ids0 = [];
      this.gendanList="choice";
      this.wMerchandiserDialog = true;
      let objNow = null;
      if (obj === "w") {
        this.currentDirection = "w";
        objNow = this.form.wMerchandiserId;
      } else {

        this.currentDirection = "e";
        objNow = this.form.eMerchandiserId;
      }
      if (objNow) {
        if (objNow.indexOf("|") !== -1) {
          arr0 = objNow.split("|");
        } else {
          arr0 = [objNow];
        }
        arr0.forEach(item0 => {
          this.datalist0.forEach((item, index) => {
            if (item0 === item.dcUserId.toString()) {
              this.ids0.push(this.datalist0[index]);
            }
          });
        });

        console.log("打印的内容是什么"+this.ids0);
        this.$nextTick(function() {
          this.ids0.forEach(item => {
            this.$refs.multipleTable0.toggleRowSelection(item, true);
          });
        });
      }
    },

    // 东、西向跟单员弹框确定按钮
    doSelected0() {
      debugger
      let strIds = ""
      let strName = ""
      let strNumber = ""
      let currentNow = null;
      let currentNameNow = null;
      let currentNumberNow = null;
      if (this.currentDirection === "w") {
        currentNow = this.form.wMerchandiserId;
        currentNameNow = this.form.wMerchandiser;
        currentNumberNow = this.form.wMerchandiserNumber
      } else if (this.currentDirection === "e") {
        currentNow = this.form.eMerchandiserId;
        currentNameNow = this.form.eMerchandiser;
        currentNumberNow = this.form.eMerchandiserNumber
      }
      if (this.ids0.length !== 0) {
        if (currentNow) {
          currentNow += "|";
        }
        this.ids0.forEach((item, index) => {
          if (index !== 0) {
            strIds += "|"
            strName += "|"
            strNumber += "|"
          }
          strIds += item.dcUserId
          strName += item.nickName
          strNumber += item.jobNumber
        });
      }

      if (this.currentDirection === "w") {
        this.form.wMerchandiserId = strIds;
        this.form.wMerchandiser = strName;
        this.form.wMerchandiserNumber = strNumber;
      } else if (this.currentDirection === "e") {
        this.form.eMerchandiserId = strIds;
        this.form.eMerchandiser = strName;
        this.form.eMerchandiserNumber = strNumber;
      }

      this.wMerchandiserDialog = false;
      this.listQuery0.nickName = null;
      this.listQuery0.jobNumber = null;
      this.listQuery0.userName = null;
      this.merchandiserListFn();
    },

    //  跟单员弹框取消按钮
    cancelSelect0() {
      this.ids0 = [];
      this.wMerchandiserDialog = false;
    },
    /** 查询客户管理列表 */
    getList() {


      this.loading = true;
      if(this.createdate){
          this.queryParams.registerStartTime=this.createdate[0]
          this.queryParams.registerEndTime=this.createdate[1]
      }else{
          this.queryParams.registerStartTime=null
          this.queryParams.registerEndTime=null
      }
      this.calculateEnOrChNumFn(this.queryParams);
      listClients(this.queryParams).then(response => {
        this.clientsList = response.rows;
        this.total = response.total;
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
        clientId: undefined,
        clientUnit: undefined,
        clientAddress: undefined,
        clientLegalperson: undefined,
        clientContacts: undefined,
        clientPhone: undefined,
        clientTel: undefined,
        clientEmail: undefined,
        clientDept: undefined,
        clientZw: undefined,
        clientTjr: undefined,
        clientTjrId: undefined,
        remark: undefined,
        clientLicense: undefined,
        clientCode: undefined,
        clientTax: undefined,
        clientLoginuser: undefined,
        clientLoginpwd: undefined,
        clientValiditydate: undefined,
        clientDisableddate: undefined,
        clientExampersonid: undefined,
        clientExamperson: undefined,
        userinfoId: undefined,
        userinfoName: undefined,
        examinfo: undefined,
        isexamline: undefined,
        cancelaccount: undefined,
        createdate: undefined,
        createuserid: undefined,
        createusername: undefined,
        clientJb: undefined,
        engChinese: undefined,
        enPrename: undefined,
        enGender: undefined,
        enNo: undefined,
        enPlace: undefined,
        registerPhone: undefined,
        alias: undefined,
        state: undefined,
        isNormal: undefined,
        isDirect: undefined,
        isSign: undefined,
        wMerchandiserId: "",
        wMerchandiser: "",
        wMerchandiserNumber:"",
        eMerchandiserId: "",
        eMerchandiser: "",
        eMerchandiserNumber:"",
        newMerchandiserId:"", //新跟单员id：（多个用|分隔）
        newMerchandiser:"",  //新跟单员姓名：（多个用|分隔）
        eastAndWest:"0",
        isVip: undefined,
        signDate: undefined,
        signDisableddate: undefined,
        clientGrade: undefined,
        totalturncountavg: undefined,
        engChinese:undefined,
        wMerclear:null,
        eMerclear:null
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
      // this.queryParams.isNormal=null
      this.createdate=[]
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {

      this.arrs = selection.map(item => item);
      this.ids = selection.map(item => item.clientId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleRow(obj){
      this.$refs.multipleTable.toggleRowSelection(obj);
    },

    /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.formDisabled = false;
    //   this.open = true;
    //   this.title = "添加客户管理";
    // },
    /** 查看按钮操作 */
    handleDetail() {
      this.reset();
      const clientId = this.ids;
       this.merchandiserListFn();
      getClients(clientId).then(response => {
        this.form = response.data;
        this.benginToend0=[];
        //    this.benginToend0[0]=this.form.clientValiditydate
        // this.benginToend0[1]=this.form.clientDisableddate
         if(this.form.clientValiditydate){
            this.benginToend0[0]=this.form.clientValiditydate
          }else{
             this.benginToend0[0]='0000-00-00'
          }
          if(this.form.clientDisableddate){
            this.benginToend0[1]=this.form.clientDisableddate
          }else{
            this.benginToend0[1]='0000-00-00'
          }

        this.formDisabled = true;
        this.open = true;
        this.title = "查看客户管理";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.formDisabled = false;
      this.reset();
      const clientId = row.clientId || this.ids;
        this.merchandiserListFn()
      getClients(clientId).then(response => {
        this.form = response.data;
        this.benginToend0=[];
          if(this.form.clientValiditydate){
            var s=this.form.clientValiditydate
            this.benginToend0[0]=this.form.clientValiditydate
          }else{
             this.benginToend0[0]='0000-00-00'
          }
          if(this.form.clientDisableddate){
            var s=this.form.clientDisableddate
            this.benginToend0[1]=this.form.clientDisableddate
          }else{
            this.benginToend0[1]='0000-00-00'
          }
        this.open = true;
        this.title = "修改客户管理";
      });
    },
    //批量新增跟单员
    handleGroupAdd() {
      this.formDisabled = false;
      this.reset();
      this.merchandiserListFn();
      this.gendanList="add";
      this.wMerchandiserDialog = true;

    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.clientValiditydate === '0000-00-00'){
             this.$message.error('抱歉，有效期不能为空')
             return false
          }
          if(this.form.clientDisableddate === '0000-00-00'){
             this.$message.error('抱歉，有效期不能为空')
            return false
          }

          if (this.form.clientId != undefined) {
            // console.log(this.form)
            this.form.powerType=this.form.isSign
            updateClients(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            ;
            this.form["clientID"] = null;
            addClients(this.form).then(response => {
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

    //批量新增跟单员提交
    submitGroupAdd: function() {
      let strIds = ""
      let strName = ""
      let strNumber = ""
       this.ids0.forEach((item, index) => {
          if (index !== 0) {
            strIds += "|"
            strName += "|"
            strNumber += "|"
          }
          strIds += item.dcUserId
          strName += item.nickName
          strNumber += item.jobNumber
        });
        this.form.clientIds = this.ids.join(',');
        this.form.newMerchandiserId = strIds;
        this.form.newMerchandiser = strName;
        this.form.eastAndWest = this.form.eastAndWest;

            groupAddClients(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("操作成功");
                this.wMerchandiserDialog = false;
                this.listQuery0.nickName = null;
                this.listQuery0.jobNumber = null;
                this.listQuery0.userName = null;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });

    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const clientIds = row.clientId || this.ids;
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
          return delClients(clientIds);
        })
        .then((res) => {
          if(res.code === 200){
            this.getList();
            this.msgSuccess("删除成功");
          }else{
            this.msgError(res.msg);
          }
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {

      const queryParams = this.queryParams;
      queryParams.clientIds=this.ids.join(",")

      this.$confirm("是否确认导出?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportClients(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style>
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
.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 14px;
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
.khsh11 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 14px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.khsh22 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 27px !important;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
.el-tableCss0 th > .cell {
  white-space:pre-line;
}
</style>
