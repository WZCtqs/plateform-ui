<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
      <el-form-item label="委托书编号" prop="orderNumber" label-width="90px">
        <el-autocomplete
          class="inline-input"
          v-model.trim="queryParams.orderNumber"
          :fetch-suggestions="querySearch"
          placeholder="请输入委托书编号"
          style="width: 220px"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>

      <!-- 国内外客户，0是国内，1国外 -->
      <el-form-item label="订单状态" prop="isexamline" >
        <el-select v-model.trim="queryParams.isexamline" placeholder="-请选择-" style="width: 160px"  clearable size="small">
          <el-option label="-请选择-" value />
          <el-option label="未审核" value="0" />
          <el-option label="已审核通过" value="1" />
          <el-option label="已审核失败" value="2" />
          <el-option label="取消托书" value="3" />
          <el-option label="未审核(转待审核中)" value="4" />
          <el-option label="草稿" value="5" />
          <!-- <el-option label="转待失败" value="6" /> -->
          <el-option label="箱管部未审核" value="7" />
          <el-option label="箱管部审核失败" value="8" />
          <el-option label="报价中" value="9" />
          <el-option label="客户确认中" value="10" />
          <el-option label="公路审核中" value="11" />
          <el-option label="集疏审核中" value="12" />
          <el-option label="撤舱待审核" value="13" />
          <el-option label="订舱报价中" value="14" />
          <el-option label="订舱确认中" value="15" />
        </el-select>
      </el-form-item>

        <el-form-item label="推荐人" prop="clientTjr">
        <el-autocomplete
          v-model.trim="queryParams.clientTjr"
          :fetch-suggestions="querySearchTjr"
          placeholder="请输入推荐人"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>

      <el-form-item label="班列日期" prop="classDate">
        <el-date-picker v-model.trim="queryParams.classDate" type="date" style="width: 140px" placeholder="选择日期"  value-format="yyyy-MM-dd HH:mm:ss"  />
      </el-form-item>

      <el-form-item label>
        <el-autocomplete placeholder="请输入内容"
         v-model.trim="gdVal" clearable
          :fetch-suggestions="gdLabel == '0'? querySearchCn:querySearchOcb "
            class="input-with-select"
            @keyup.enter.native="handleQuery"
          @select="handleQuery"
          >
          <el-select v-model.trim="gdLabel" slot="prepend" placeholder="请选择" style="width:110px;">
            <el-option label="班列号" value="0" />
            <el-option label="班列编号" value="1" />
          </el-select>
        </el-autocomplete>
      </el-form-item>

       <el-form-item label="拼/整箱" prop="isconsolidation">
            <el-select
              v-model.trim="queryParams.isconsolidation"
              placeholder="-请选择-"
              clearable
              style="width:100px;"
              size="mini"
            >
              <el-option label="-请选择-" value />
              <el-option label="拼箱" value="1" />
              <el-option label="整箱" value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label="往返" prop="classEastandwest">
            <el-select
              v-model.trim="queryParams.classEastandwest"
              placeholder="请选择"
              clearable
              style="width:100px;"
              size="mini"
            >
              <el-option label="-请选择-" value />
              <el-option label="西向" value="0" />
              <el-option label="东向" value="1" />
            </el-select>
          </el-form-item>
      <el-form-item label="业务编号" prop="clientYwNumber">
        <el-autocomplete
          v-model.trim="queryParams.clientYwNumber"
          :fetch-suggestions="querySearchYwbh"
          placeholder="请输入业务编号"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="业务员编号" prop="ywNumber">
        <el-autocomplete
          v-model.trim="queryParams.ywNumber"
          :fetch-suggestions="querySearchYwybh"
          placeholder="请输入业务员编号"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>

       <el-form-item label="路线" prop="lineTypeid">
            <el-select v-model.trim="queryParams.lineTypeid" placeholder="请选择" style="width:100px;" clearable size="small">
              <el-option label="-请选择-" value />
              <el-option label="中欧" value="0" />
              <el-option label="中亚" value="2" />
              <el-option label="中越" value="3" />
              <el-option label="中俄" value="4" />
            </el-select>
          </el-form-item>

      <i class="el-icon-circle-plus" v-if="!moreQueryParams" @click="moreQueryParams=true"></i>
      <!-- 展开更多查询条件 -->
      <el-collapse-transition>
        <div v-if="moreQueryParams">
          <el-form-item label="车站名称" prop="station">
        <el-autocomplete
          v-model.trim="queryParams.station"
          :fetch-suggestions="querySearchCzmc"
          placeholder="请输入车站名称"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>

          <el-form-item label="订单来源" prop="isphone">
            <el-select v-model.trim="queryParams.isphone" placeholder="请选择" style="width:100px;" clearable size="mini">
              <el-option label="-请选择-" value />
              <el-option label="移动端" value="0" />
              <el-option label="pc端" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="业务部门" prop="organizationCode" >
            <el-select
              v-model.trim="queryParams.organizationCode"
              placeholder="请选择"
              clearable
              style="width:110px;"
              size="mini"
            >
              <el-option label="-请选择-" value />
              <el-option label="亚欧一部" value="YWB1000100" />
              <el-option label="亚欧二部" value="YWB1000101" />
              <el-option label="亚欧三部" value="YWB1000200" />
              <el-option label="亚欧四部" value="YWB1000201" />

              <el-option label="拓展一部" value="YWB1000103" />
              <el-option label="拓展二部" value="YWB1000104" />
              <el-option label="拓展三部" value="YWB1000202" />
              <el-option label="拓展四部" value="YWB1000203" />
            </el-select>
          </el-form-item>



          <el-form-item label="跟单员" prop="orderMerchandiser">
        <el-autocomplete
          v-model.trim="queryParams.orderMerchandiser"
          :fetch-suggestions="querySearchGdy"
          placeholder="请输入跟单员"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>


          <el-form-item label="订舱方" prop="clientUnit">
        <el-autocomplete
          v-model.trim="queryParams.clientUnit"
          :fetch-suggestions="querySearchDcf"
          placeholder="请输入订舱方"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>

          <el-form-item label="是否有改单" prop="isupdate" label-width="100px">
            <el-select v-model.trim="queryParams.dcGaidanState" placeholder="请选择" clearable style="width:110px;" size="mini">
              <el-option label="-请选择-" value />
              <el-option label="否" value="否" />
              <el-option label="是" value="是" />
            </el-select>
          </el-form-item>

          <el-form-item label="订单类型" prop="yuyan">
            <el-select v-model.trim="queryParams.yuyan" placeholder="请选择" clearable style="width:100px;" size="mini">
              <el-option label="-请选择-" value />
              <el-option label="国内订单" value="0" />
              <el-option label="国外订单" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="货物品名" prop="goodsName">
        <el-autocomplete
          v-model.trim="queryParams.goodsName"
          :fetch-suggestions="querySearchHwpm"
          placeholder="请输入货物品名"
          @keyup.enter.native="handleQuery"
          @select="handleQuery"
        >
        </el-autocomplete>
      </el-form-item>

           <el-form-item label="是否委托ZIH提货" prop="shipOrderBinningway" label-width="120px">
            <el-select
              v-model.trim="queryParams.shipOrderBinningway"
              placeholder="请选择"
              clearable
              style="width:120px;"
              size="mini"
            >
              <el-option label="-请选择-" value />
              <el-option label="是" value="0" />
              <el-option label="否" value="1" />
              <el-option label="铁路到货" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否由ZIH代理送货" prop="receiveOrderIspart" label-width="130px">
            <el-select
              v-model.trim="queryParams.receiveOrderIspart"
              placeholder="请选择"
              clearable
              style="width:120px;"
              size="mini"
            >
              <el-option label="-请选择-" value />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <i class="el-icon-remove" v-if="moreQueryParams" @click="moreQueryParams=false"></i>
          <!-- 收起更多查询条件 -->
        </div>
      </el-collapse-transition>

      <el-form-item label>
        20尺({{box20}}) 40尺({{box40}}) 45尺({{box45}}) 体积({{boxV}}) 毛重({{boxKG}})
        <el-button v-if="zdState" type="primary" size="mini" @click="zdState = false">站点-收起</el-button>
        <el-button v-if="!zdState" type="primary" size="mini" @click="zdState = true">站点-展开</el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          v-hasPermi="['classOrder:orders:query']"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

      <el-dialog title="站点选择" :visible.sync="zdState">
        <div style>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model.trim="checkAll"
            @change="handleCheckAllChange"
          >
            <b>汉堡</b>
          </el-checkbox>
          <el-checkbox-group v-model.trim="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(city,index) in cities" :label="index" :key="index">{{city.name}}</el-checkbox>
          </el-checkbox-group>
          <hr />

          <el-checkbox
            :indeterminate="isIndeterminate1"
            v-model.trim="checkAll1"
            @change="handleCheckAllChange1"
          >
            <b>中亚</b>
          </el-checkbox>
          <el-checkbox-group v-model.trim="checkedCities1" @change="handleCheckedCitiesChange1">
            <el-checkbox v-for="(city,index) in cities1" :label="index" :key="index">{{city.name}}</el-checkbox>
          </el-checkbox-group>
          <hr />

          <el-checkbox
            :indeterminate="isIndeterminate2"
            v-model.trim="checkAll2"
            @change="handleCheckAllChange2"
          >
            <b>中越</b>
          </el-checkbox>
          <el-checkbox-group v-model.trim="checkedCities2" @change="handleCheckedCitiesChange2">
            <el-checkbox v-for="(city,index) in cities2" :label="index" :key="index">{{city.name}}</el-checkbox>
          </el-checkbox-group>
          <hr />

          <el-checkbox
            :indeterminate="isIndeterminate3"
            v-model.trim="checkAll3"
            @change="handleCheckAllChange3"
          >
            <b>波兰</b>
          </el-checkbox>
          <el-checkbox-group v-model.trim="checkedCities3" @change="handleCheckedCitiesChange3">
            <el-checkbox v-for="(city,index) in cities3" :label="index" :key="index">{{city.name}}</el-checkbox>
          </el-checkbox-group>
          <hr />

          <el-checkbox
            :indeterminate="isIndeterminate4"
            v-model.trim="checkAll4"
            @change="handleCheckAllChange4"
          >
            <b>白俄</b>
          </el-checkbox>
          <el-checkbox-group v-model.trim="checkedCities4" @change="handleCheckedCitiesChange4">
            <el-checkbox v-for="(city,index) in cities4" :label="index" :key="index">{{city.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-dialog>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:orders:editOrder']"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleShenhe()"
        >审核</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:orders:delete']"
          type="danger"
          size="mini"
          :disabled="single"
          @click="handleDelete"
        >删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:orders:zdReason']"
          type="success"
          size="mini"
          :disabled="single"
          @click="handleZhuanDai_Reason"
        >转待原因</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:orders:delOrder']"
          type="warning"
          size="mini"
          :disabled="single"
          @click="handleCancelOrder"
        >取消托书</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:orders:editOrder']"
          type="primary"
          size="mini"
          :disabled="single"
          @click="handleUpdate('edit')"
        >委托书修改</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:orders:zdApply']"
          type="danger"
          size="mini"
          :disabled="single"
          @click="orderCheckApplyapiFn1"
        >转待审核申请</el-button>
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['order:shippingorder:export']"
          type="success"
          size="mini"
          @click="exportFn"
        >托书汇总表导出</el-button>
      </el-col> -->

      <el-col :span="1.5">
        <el-button
          v-hasPermi="['classOrder:orders:checkCangWeiNum']"
          type="warning"
          size="mini"
          :disabled="single"
          @click="handleCangweiDialog"
        >舱位号修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['shipOrder:zgCountChange:edit']"
          type="success"
          size="mini"
          :disabled="single"
          @click="handlexlDialog"
        >箱量修改</el-button>
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button type="success" size="mini" icon="el-icon-download"  @click="handleExport">下载模板</el-button>
        <a :href="apiStr + '/cost/zgRailWayCost/downLoadExcel'" >下载模板   </a>
      </el-col>-->
    </el-row>
    <el-table
      v-loading="loading"
      :class="this.heightScreen===590?'yan1 xin':'yan2 xin'"
      :data="list"
      border
      ref="multipleTable"
      @select-all="onSelectAll"
      @selection-change="handleSelectionChange"
      @row-click="handleRow"
      :height="heightScreen"
    >
      <el-table-column type="selection" />
      <!-- <el-table-column label="委托书编号" width="140" prop="orderNumber" fixed="left" align="center" /> -->
      <el-table-column label="委托书编号" min-width="5.00%" prop="orderNumber" >
      <template slot-scope="scope">
        <span @click="handleDetail(scope.row)" style="cursor:pointer;text-decoration: underline;">
          {{scope.row.orderNumber}}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="5.00%"  align="center" prop="tjTime" >
        <template slot-scope="scope">
          <span @click="handleDetail(scope.row)" style="cursor:pointer;">{{scope.row.tjTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="箱型" align="center" min-width="3.00%" prop="containerType" />
      <el-table-column label="箱量" align="center" min-width="3.00%" prop="containerBoxamount" />
      <el-table-column label="体积(CBM)" align="center" prop="goodsCbm" min-width="3.00%" />
      <el-table-column label="毛重(KG)" min-width="3.00%" align="center" prop="goodsKgs" />
      <el-table-column label="货物品名" min-width="5.00%" align="center" prop="goodsName" />
      <el-table-column label="班列日期" align="center" min-width="3.00%">
        <template slot-scope="scope">
          <span v-if="scope.row.classDate && scope.row.classDate.length >9">{{scope.row.classDate.substring(0,10)}}</span>
          <span v-else> {{scope.row.classDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="往返" align="center" min-width="3.00%" prop="classEastandwest">
        <template slot-scope="scope">
          <!-- {{scope.row.classEastandwest}} -->
          <span v-if="scope.row.classEastandwest === '0'">西向</span>
          <span v-if="scope.row.classEastandwest === '1'">东向</span>
        </template>
      </el-table-column>
      <el-table-column label="上货站" align="center" min-width="3.00%" prop="orderUploadsite" />
      <el-table-column label="下货站" align="center" min-width="3.00%" prop="orderUnloadsite" />
      <el-table-column label="车站名称" min-width="5.00%" align="center" prop="station" />
      <el-table-column label="跟单员" align="center" min-width="3.00%" prop="orderMerchandiser" />
      <el-table-column label="订舱方" align="center" prop="clientUnit" min-width="11.00%" />
      <el-table-column label="发货方" align="center" prop="shipOrederName" min-width="11.00%" />
      <el-table-column label="装箱" align="center"  prop="isconsolidation" min-width="3.00%">
        <template slot-scope="scope">
          <span v-if="scope.row.isconsolidation === '0'">整柜</span>
          <span v-if="scope.row.isconsolidation === '1'">拼箱</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center"  prop="isexamline" min-width="6.00%">
        <template slot-scope="scope" >
          <!-- {{scope.row.isexamline}} -->
          <span v-if="scope.row.isexamline === '0'">未审核</span>
          <span v-if="scope.row.isexamline === '1'">已审核通过</span>
          <span v-if="scope.row.isexamline === '2'"  class="detailCss0"  @click="handleisupdateDetail(scope.row,'0')">已审核失败</span>
          <span v-if="scope.row.isexamline === '3'">已取消委托</span>
          <span v-if="scope.row.isexamline === '4'">未审核(转待审核中)</span>
          <span v-if="scope.row.isexamline === '5'">草稿</span>
          <!-- <span v-if="scope.row.isexamline === '6'">转待失败</span> -->
          <span v-if="scope.row.isexamline === '7'">箱管部未审核</span>
          <span v-if="scope.row.isexamline === '8'">箱管部审核失败</span>
          <span v-if="scope.row.isexamline === '9'">报价中</span>
          <span v-if="scope.row.isexamline === '10'">客户确认中</span>
          <span v-if="scope.row.isexamline === '11'">公路审核中</span>
          <span v-if="scope.row.isexamline === '12'">集疏审核中</span>
          <span v-if="scope.row.isexamline === '13'">撤舱待审核</span>
          <span v-if="scope.row.isexamline === '14'">订舱报价中</span>
          <span v-if="scope.row.isexamline === '15'">订舱确认中</span>
        </template>
      </el-table-column>
      <el-table-column label="修改记录" align="center" prop="isupdate" min-width="3.00%">
        <template slot-scope="scope">
          <!-- {{scope.row.isupdate}} -->
          <span v-if="scope.row.isupdate === '0'">无</span>
          <span
            v-if="scope.row.isupdate === '1'"
            class="detailCss0"
            @click="handleisupdateDetail(scope.row,'1')"
          >详情</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center"  prop="isphone" min-width="3.00%">
        <template slot-scope="scope">
          <!-- {{scope.row.isphone}} -->
          <span v-if="scope.row.isphone === '0'">移动端</span>
          <span v-if="scope.row.isphone === '1'">PC端</span>
        </template>
      </el-table-column>
      <el-table-column label="转待平均数" align="center" prop="totalturncountavg" min-width="3.00%" />
      <el-table-column label="业务编号" align="center" prop="clientYwNumber" min-width="3.00%" />
      <el-table-column label="业务员编号" align="center" prop="ywNumber" min-width="3.00%" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改托书或审核托书，共用此对话框 -->
    <el-dialog :title="title" :visible.sync="open" v-if="open" width="100%" >
      <div  :class="this.heightScreen===590?'dtsdialog':'tsdialog'">
      <el-form class="orderForm" ref="form" :model="form" :rules="rules" label-width="150px" :disabled="formDisabled">
        <!-- <el-form-item>
          <el-radio v-model.trim="pzqh" label="0">拼箱西向</el-radio>
          <el-radio v-model.trim="pzqh" label="1">拼箱东向</el-radio>
          <el-radio v-model.trim="pzqh" label="2">整柜西向</el-radio>
          <el-radio v-model.trim="pzqh" label="3">整柜东向</el-radio>
          {{ pzqh === '0' }} ***
          {{ pzqh === '1' }} ***
          {{ (pzqh === '0') || (pzqh === '1') }}
        </el-form-item>-->

        <h5 class="h5Css1">班列信息</h5>
        <div class="graycss0">
          <!-- <el-row>
            <el-col v-if="(pzqh === '2') || (pzqh === '3') " :span="10">
              <el-form-item label="重箱托书编号" >
                  <el-input v-model.trim="form.zxNumber" :disabled="currentFormStatus === 'detailInfo' && currentFormStatus === 'zhuandai'" />
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="10">
              <el-form-item label="委托书编号">
                <el-autocomplete
                  class="inline-input"
                  v-model.trim="form.orderNumber"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入委托书编号"
                  style="width: 260px"
                  @keyup.enter.native="setIntoStorage('1')"
                  @select="setIntoStorage('1')"
                  @blur="getInfoByBhFn()"
                >
                </el-autocomplete>
                <!-- <el-input v-model.trim="form.orderNumber" auto-complete="on" @change="getInfoByBhFn()" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="跟单员">
                <el-input v-model.trim="form.orderMerchandiser" placeholder="请输入跟单员" :disabled="true" v-if="form.classEastandwest === '1'" />
                <el-input v-model.trim="form.merchandiserW" placeholder="请输入跟单员" :disabled="true" v-if="form.classEastandwest === '0'"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="贸易方式" prop="dictId">
                <el-select v-model.trim="form.dictId" @change="dictIdNameFn()">
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in myList"
                    :key="index"
                    :label="item.mcheng"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="ZIH推荐人">
                <el-input v-model.trim="form.clientTjr" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="班列号">
                <el-input v-model.trim="form.classNumber" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="往返">
                <!-- <el-input v-model.trim="form.classEastAndWest" :disabled="true" /> -->

                <span v-if="form.classEastandwest === '0'">西向</span>
                <span v-else-if="form.classEastandwest === '1'">东向</span>
                <span v-else></span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="班列日期">
                <el-date-picker
                  v-model.trim="form.classDate"
                  type="date"
                  :disabled="true"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
                <!-- <span style="cursor:pointer;" v-if="this.form.isexamline === '6' || this.form.isexamline === '3' || this.form.isexamline === '5'" @click="classesFn">修改班列</span> -->

                <span
                  style="cursor:pointer;"
                  v-if="this.form.isexamline === '0' || this.form.isexamline === '2' || this.form.isexamline === '6' || this.form.isexamline === '3' || this.form.isexamline === '5'"
                  @click="classesFn"
                >修改班列</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" />
          </el-row>

          <el-row>
            <el-col :span="10">

              <el-form-item label="上货站">
                <!-- <el-select v-model.trim="form.orderUploadsite" filterable clearable :disabled="currentFormStatus !== 'zhuandai'"> -->
                <el-select v-model.trim="form.orderUploadsite" filterable clearable :disabled="true">
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistupList"
                    :key="index"
                    :label="item.nameCn"
                    :value="item.code"
                  ></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistupList"
                    :key="index"
                    :label="item.nameEn"
                    :value="item.code"
                    v-if="form.yuyan === '1'"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="下货站">
                <el-select v-model.trim="form.orderUnloadsite" filterable clearable :disabled="true">
                  <el-option value v-if="form.yuyan === '0'">-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistdownList"
                    :key="index"
                    :label="item.nameCn"
                    :value="item.code"
                    v-if="form.yuyan === '0'"
                  ></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option
                    v-for="(item,index) in sitelistdownList"
                    :key="index"
                    :label="item.nameEn"
                    :value="item.code"
                    v-if="form.yuyan === '1'"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="堆场地址" prop="stationid">
                <el-select v-model.trim="form.stationid" filterable clearable :disbled="currentFormStatus === 'shenhe'">
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in changzhanList"
                    :key="index"
                    :label="item.statioin"
                    :value="item.stationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-else>
               <el-form-item label="" >
               </el-form-item>
            </el-col>


            <el-col v-if="(pzqh === '1') || (pzqh === '3')" :span="10" offset="4">
              <el-form-item label="开行班列">
                <el-input v-model.trim="form.lineName" placeholder="请输入开行班列" :disabled="true" />
              </el-form-item>
            </el-col>
             <el-col :span="10" offset="4" v-else>
               <el-form-item label="" >
               </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="是否需要发票" prop="orderIsticket">
                <el-radio v-model.trim="form.orderIsticket" label="0">否</el-radio>
                <el-radio v-model.trim="form.orderIsticket" label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否可提前班列" prop="putoffClass">
                <el-radio v-model.trim="form.putoffClass" :label="0">是</el-radio>
                <el-radio v-model.trim="form.putoffClass" :label="1">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否有改单费" prop="dcGaidanState">
                <el-radio v-model.trim="form.dcGaidanState" label="否">否</el-radio>
                <el-radio v-model.trim="form.dcGaidanState" label="是">是</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="站到站运费">
                <el-input
                  v-model.trim="form.sitecost"
                  :disabled="true"
                  placeholder="请输入站到站运费"
                  style="width:260px !important;"
                />
                {{form.sitecostCurrency}}
                <!-- <el-radio v-model.trim="form.sitecostCurrency" :disabled="true" label="0">[美金]</el-radio>
                <el-radio v-model.trim="form.sitecostCurrency" :disabled="true" label="1">[人民币]</el-radio> -->
                <span class="msgSpancss0 redTxt">提示：默认起运港收费，目的港收费(请特别备注)，发车后，不再更改。</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <h5 class="h5Css1">详情</h5>
        <div class="graycss1">
          <h5 class="h5Css2">订舱方</h5>
          <el-row>
            <el-col :span="10">
              <el-form-item label="订舱方" prop="clientUnit">
                <el-input v-model.trim="form.clientUnit" placeholder="请输入订舱方" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="订舱方地址" prop="clientAddress">
                <el-input v-model.trim="form.clientAddress" placeholder="请输入订舱方地址" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="联系人" prop="clientContacts">
                <el-input v-model.trim="form.clientContacts" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="联系方式" prop="clientTel">
                <el-input v-model.trim="form.clientTel" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="Email" prop="clientEmail">
                <el-input v-model.trim="form.clientEmail" placeholder="请输入Email" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="业务编号" prop="clientYwNumber">
                <el-input v-model.trim="form.clientYwNumber" placeholder="请输入业务编号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1') " :span="23" :offset="1">
              <el-form-item label="可堆叠(货物属性)" prop="goodsCannotpileup">
                <el-radio v-model.trim="form.goodsCannotpileup" v-if="form.goodsCannotpileup === '1'" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsCannotpileup" v-else-if="form.goodsCannotpileup === '0'" label="0">否</el-radio>
                <!-- <el-radio v-model.trim="form.goods_cannotPileUp" label="2">仅可自堆叠</el-radio> -->
                <span class="msgSpancss0 redTxt">提示：货物高度不足1.8米按1.8米算，超过1.8米以实际高度为准.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="23" :offset="1">
              <el-form-item label="易碎品(货物属性)" prop="goodsFragile">
                <el-radio v-model.trim="form.goodsFragile" v-if="form.goodsFragile === '1'" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsFragile" v-else-if="form.goodsFragile === '0'" label="0">否</el-radio>
                <span class="msgSpancss0 redTxt">提示：结算体积按照测量体积的1.3倍计算.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="23" :offset="1">
              <el-form-item label="单件超长超重" prop="goodsGeneral">
                <el-radio v-model.trim="form.goodsGeneral" v-if="form.goodsGeneral === '1'" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsGeneral" v-else-if="form.goodsGeneral === '0'" label="0">否</el-radio>
                <span class="msgSpancss0 redTxt">提示：单件长度超过3.5米或重量超过3吨，会产生额外费用.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="20">
              <el-form-item label="箱属" prop="orderAuditBelongto">
                <!-- 中亚线路：0、2、3 -->
                <!-- 非中亚线路：0、1 -->
                <el-radio v-model.trim="form.orderAuditBelongto" :disabled="true" label="0">委托ZIH</el-radio>
                <el-radio
                  v-if="xlString === 'fzy'"
                  v-model.trim="form.orderAuditBelongto"
                  :disabled="true"
                  label="1"
                >自备</el-radio>
                <el-radio
                  v-if="xlString === 'zy'"
                  v-model.trim="form.orderAuditBelongto"
                  :disabled="true"
                  label="3"
                >自备非铁路箱</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col :span="10">
              <el-form-item label="箱量" prop="containerBoxamount">
                <el-input v-model.trim="form.containerBoxamount" :disabled="true">
                  <template slot="append">*</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="箱型" prop="containerType">
                <el-input v-model.trim="form.containerType" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="10">
              <el-form-item label="报关地点" prop="clientOrderBindingaddress" v-if="form.classEastandwest === '0' || (form.lineTypeid !== '3' && form.classEastandwest === '1')">
                <el-radio v-if="form.classEastandwest === '0'" v-model.trim="form.clientOrderBindingaddress" label="郑州">郑州</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '汉堡')" v-model.trim="form.clientOrderBindingaddress" label="汉堡">汉堡</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '慕尼黑')" v-model.trim="form.clientOrderBindingaddress" label="慕尼黑">慕尼黑</el-radio>
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="属地">属地</el-radio>
              </el-form-item>
            </el-col>

            <el-col :span="10" offset="4">
              <el-form-item label="业务员编号">
                <el-input v-model.trim="form.ywNumber" placeholder="请输入业务员编号" />
                <span class="msgSpancss0 redTxt">（提示：如有需要，可在此填写业务编号）</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="委托ZIH报关" prop="clientOrderBindingway">
                <el-radio v-model.trim="form.clientOrderBindingway" label="0">是</el-radio>
                <el-radio
                  v-if="(pzqh === '1') || (pzqh === '3')"
                  v-model.trim="form.clientOrderBindingway"
                  label="1"
                >否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="form.clientOrderBindingway === '0'" :span="10" offset="4">
              <el-form-item label="报关费用">
                <el-input v-model.trim="form.clientBgCost" placeholder="请输入报关费用">
                  <template slot="append">*[人民币]</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="graycss1">
          <h5 class="h5Css2">发货方</h5>
          <el-row>
            <el-col :span="10">
              <el-form-item label="发货方(中英文)" prop="shipOrederName">
                <el-input v-model.trim="form.shipOrederName" placeholder="请输入发货方(中英文)" />

              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="通讯地址(中英文)" prop="shipOrederAddress">
                <el-input v-model.trim="form.shipOrederAddress" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="联系人(中英文)" prop="shipOrederContacts">
                <el-input v-model.trim="form.shipOrederContacts">
                  <!-- <template slot="append">*[人民币]</template> -->
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="联系电话" prop="shipOrederPhone">
                <el-input v-model.trim="form.shipOrederPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
             
            <el-col :span="10" >
              <el-form-item label="邮箱" prop="shipOrederEmail">
                <el-input v-model.trim="form.shipOrederEmail" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="由ZIH提货">
                <el-radio v-model.trim="form.shipOrderBinningway" :disabled="true" label="0">是</el-radio>
                <el-radio v-model.trim="form.shipOrderBinningway" :disabled="true" label="1">否</el-radio>
                <el-radio
                  v-if="pzqh === '2'"
                  v-model.trim="form.shipOrderBinningway"
                  :disabled="true"
                  label="2"
                >铁路到货</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10" offset="4">
              <!-- 提箱地显示情况 -->
              <!-- 1、由ZIH提货：是，提货方式是：整箱到车站 --> <!-- 咨询刘恒，1、情况下不需要显示提箱地 -->
              <!-- 2、箱属：委托zih，由ZIH提货：否，自送货方式是：整箱到车站 -->

              <template
                v-if="(form.shipOrderBinningway === '0' && form.shipThTypeId === '0') || (form.shipOrderBinningway === '1' && form.shipZsTypeId === '1' && form.orderAuditBelongto === '0')"
              >
                <template>
                  <el-col :span="16">
                    <el-form-item label="提箱地" >
                    <el-select
                      v-model.trim="form.shipFhSite"
                      filterable
                      clearable
                      v-if="pzqh === '0' || pzqh === '2'"
                    >
                      <!-- 去程提箱地 -->
                      <el-option value>-请选择-</el-option>
                      <el-option
                        v-for="(item,index) in txAddressList"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>

                    <el-select
                      v-model.trim="form.shipHyd"
                      filterable
                      clearable
                      v-if="pzqh === '1' || pzqh === '3'"
                    >
                      <!-- 回程发货提箱地 -->
                      <el-option value>-请选择-</el-option>
                      <el-option
                        v-for="(item,index) in txAddressList"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="提箱费" prop="pickUpBoxFee" label-width="80px">
                      <el-input v-model.trim="form.pickUpBoxFee" placeholder="" />
                    </el-form-item>
                  </el-col>
                </template>
              </template>
            </el-col>

          </el-row>
          <el-row v-if="form.shipOrderBinningway === '0'">
            <el-col :span="10" v-if="(pzqh === '0') || (pzqh === '1')">
              <el-form-item  label="联系人(中英文)" prop="shipOrderUnloadcontacts">
                <el-input v-model.trim="form.shipOrderUnloadcontacts" placeholder="请输入联系人(中英文)" />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-else>
              <el-form-item  label="">
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="4">
              <el-form-item label="联系方式" prop="shipOrderUnloadway">
                <el-input v-model.trim="form.shipOrderUnloadway" placeholder />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.shipOrderBinningway === '0'">
            <el-col :span="10" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="联系邮箱" prop="shipOrderUnloadwayEmail">
                <el-input v-model.trim="form.shipOrderUnloadwayEmail" placeholder />
              </el-form-item>
            </el-col>
             <el-col :span="10" v-else>
              <el-form-item  label="">
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="提货地址" prop="shipOrderUnloadaddress">
                <el-input v-model.trim="form.shipOrderUnloadaddress" placeholder />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.shipOrderBinningway === '0'">
            <el-col :span="10">
              <el-form-item label="提货时间" prop="shipOrderUnloadtime">
                 <el-date-picker v-model.trim="form.shipOrderUnloadtime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH" value-format="yyyy-MM-dd HH:00:00"  />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="提货方式" prop="shipThTypeId">
                <el-radio v-model.trim="form.shipThTypeId" label="0" v-if="(pzqh === '2') || (pzqh === '3')">整箱到车站</el-radio>
                <el-radio v-model.trim="form.shipThTypeId" label="1" >散货到堆场</el-radio>
              </el-form-item>
            </el-col>
           </el-row>

          <el-row v-if="form.shipOrderBinningway === '0'">
            <el-col :span="10" v-if="(pzqh === '0') || (pzqh === '2')">
              <el-form-item label="详细地址" >
                <el-input v-model.trim="form.detailedAddress" placeholder />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.shipOrderBinningway === '0'">
             <el-col :span="10">
              <el-form-item label="提货费报价编号">
                <el-input v-model.trim="form.shipThCostNo" placeholder :disabled="true" />
              </el-form-item>
            </el-col>

            <el-col :span="10" offset="4">
              <el-form-item label="提货费用">
                <el-input v-model.trim="form.shipThCost" placeholder :disabled="true" >
                  <template slot="append" v-if="form.zxThcostCurrency === '$'">*[美金]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '￥'">*[人民币]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '€'">*[欧元]</template>
                </el-input>
              </el-form-item>
            </el-col>
           
          </el-row>
          <el-row v-if="form.shipOrderBinningway === '1'">
            <el-col :span="10">
              <el-form-item label="自送货时间" prop="shipOrderSendtime">
                <el-date-picker v-model.trim="form.shipOrderSendtime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH" value-format="yyyy-MM-dd HH:00:00" />
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10" :offset="4"> 
              <el-form-item label="自送货方式" prop="shipZsTypeId">
                <el-radio v-model.trim="form.shipZsTypeId" label="0">散货到堆场</el-radio>
                <el-radio v-model.trim="form.shipZsTypeId" label="1">整箱到车站</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="graycss1">
          <h5 class="h5Css2">收货方</h5>
          <el-row>
            <el-col :span="10">
              <el-form-item label="收货方(英文)" prop="receiveOrderName">
                <el-input v-model.trim="form.receiveOrderName" placeholder="请输入收货方(英文)" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="联系人(英文)" prop="receiveOrderContacts">
                <el-input v-model.trim="form.receiveOrderContacts" placeholder="请输入联系人(英文)" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="联系电话" prop="receiveOrderPhone">
                <el-input v-model.trim="form.receiveOrderPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="邮箱" prop="receiveOrderEmail">
                <el-input v-model.trim="form.receiveOrderEmail" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="通讯地址(英文)" prop="receiveOrderAddress">
                <el-input v-model.trim="form.receiveOrderAddress" placeholder="请输入通讯地址(英文)" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="由ZIH代理清关">
                <el-radio v-model.trim="form.receiveOrderIsclearance" :disabled="true" label="0">否</el-radio>
                <el-radio v-model.trim="form.receiveOrderIsclearance" :disabled="true" label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="form.receiveOrderIsclearance === '1'">
              <el-form-item label="清关费用">
                <el-input v-model.trim="form.receiveQgCost" placeholder="请输入清关费用" />
                <el-radio v-model.trim="form.qgCostcurrency"  label="美金">*美金</el-radio>
                <el-radio v-if="pzqh == '1' || pzqh == '3'" v-model.trim="form.qgCostcurrency"  label="人民币">*人民币</el-radio>
                <el-radio v-if="pzqh == '0' || pzqh == '2'" v-model.trim="form.qgCostcurrency"  label="欧元">*欧元</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="由ZIH代理送货" prop="receiveOrderIspart">
                <el-radio v-model.trim="form.receiveOrderIspart" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.receiveOrderIspart" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4" v-if="form.isconsolidation=='0'&&form.receiveOrderIspart === '1'">
              <el-form-item label="分拨方式" prop="distributionType">
                <el-radio v-model.trim="form.distributionType" :disabled="true" label="1">拆箱散货派送</el-radio>
                <el-radio v-model.trim="form.distributionType" :disabled="true" label="0">整柜派送</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- form.receiveOrderIspart -->
          <el-row v-if="form.receiveOrderIspart === '1'">
            <el-col :span="10">
              <el-form-item label="联系人(中英文)" prop="receiveOrderZihcontacts">
                <el-input v-model.trim="form.receiveOrderZihcontacts" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="Email" prop="receiveOrderZihemail">
                <el-input v-model.trim="form.receiveOrderZihemail" placeholder />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.receiveOrderIspart === '1'">
            <el-col :span="10">
              <el-form-item label="送货地址(中英文)" prop="receiveOrderPartaddress">
                <el-input v-model.trim="form.receiveOrderPartaddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="送货详细地址(中英文)" prop="detailedAddress">
                <el-input v-model.trim="form.detailedAddress" placeholder />
              </el-form-item>
            </el-col>
             <el-col :span="10" offset="4" v-else>
              <el-form-item label="" prop="">
              </el-form-item>
            </el-col>
           </el-row>
            <el-row v-if="form.receiveOrderIspart === '1'">
            <el-col :span="10" >
              <el-form-item label="电话" prop="receiveOrderZihtel">
                <el-input v-model.trim="form.receiveOrderZihtel" placeholder />
              </el-form-item>
            </el-col>

            <el-col :span="10" offset="4">
              <el-form-item label="送货费用">
                <el-input v-model.trim="form.receiveShCost" placeholder :disabled="true" />
                <el-radio v-if="pzqh == '1' || pzqh == '3'" v-model.trim="form.shCostcurrency" :disabled="true" label="￥">人民币</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="$">美金</el-radio>
                <el-radio v-if="pzqh == '0' || pzqh == '2'" v-model.trim="form.shCostcurrency" :disabled="true" label="€">欧元</el-radio>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row v-if="form.receiveOrderIspart === '1'">
            <el-col :span="10" >
              <el-form-item label="送货费报价编号">
                <el-input v-model.trim="form.receiveShCostId" :disabled="true" placeholder />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 箱管费、还箱地点显示条件：
             1、箱属：委托ZIH（0）
             3、整柜-->
          <el-row
            v-if="(pzqh === '2' || pzqh === '3') && (form.orderAuditBelongto === '0') "
          >

             <el-col :span="10">
              <el-form-item label="还箱费">
                <el-input v-model.trim="form.returnBoxFee" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="还箱地点" prop="receiveHxAddress">
                <el-select v-model.trim="form.receiveHxAddress" filterable clearable :disabled="true">
                  <!-- 去程提箱地 -->
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in hxAddressList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>

                <el-input
                  v-if="form.receiveHxAddress === ''"
                  v-model.trim="form.receiveHxAddress"
                  placeholder
                  :disabled="true"
                />(选择一项或者自己填写)
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="在途信息接收邮箱" prop="receiveOrderReceiveemail">
                <el-input v-model.trim="form.receiveOrderReceiveemail" placeholder="请输入在途信息接收邮箱" />
                <span class="msgSpancss0 redTxt">* 提示：（可以添加多个邮箱,中间用‘;’隔开）</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item label="到站通知提货邮箱" prop="receiveOrderMail">
                <el-input v-model.trim="form.receiveOrderMail" placeholder="请输入到站通知提货邮箱" />
                <span class="msgSpancss0 redTxt">* 提示：（可以添加多个邮箱,中间用‘;’隔开）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="(pzqh === '2' && form.lineTypeid === '4')">
            <el-col :span="24"><el-divider></el-divider></el-col>
            <el-col :span="4">
              <el-form-item label="运单信息" >
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="中文发货人" prop="consignorc" >
                <el-input v-model.trim="form.consignorc" placeholder="请输入中文发货人" />
              </el-form-item>
              <el-form-item label="发货人声明" >
                <el-input v-model.trim="form.econsignorstate" placeholder="" />
              </el-form-item>
            </el-col>
              <el-col :span="24">
                  <el-divider />
                </el-col>
            <el-col :span="4">
              <el-form-item label="到站提箱公司" >
              </el-form-item>
            </el-col>
              <el-col :span="16">
               <el-form-item label="实际收货人名称" prop="etxCompany" >
                <el-input v-model.trim="form.etxCompany" placeholder="" />
              </el-form-item>
               <el-form-item label="承担监管区费用的公司（或个人）名称" prop="etxName">
                <el-input v-model.trim="form.etxName" placeholder="" />
              </el-form-item>
               <el-form-item label="ИНН税号" prop="eduty" >
                <el-input v-model.trim="form.eduty" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="graycss1">
          <h5 class="h5Css2">货物</h5>
          <el-row>
            <el-col :span="10">
              <el-form-item label="唛头" prop="goodsMark">
                <el-input v-model.trim="form.goodsMark" placeholder="请输入唛头" />
                <span class="msgSpancss0 redTxt">提示：没有请填写无</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="货品中文名称" prop="goodsName">
                <el-input v-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.nameColor === '0'"  v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.nameColor === '1'" class="noteColor1"  v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
                <el-input v-else v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="货品英文名称	" prop="goodsEnName">
                <el-input v-model.trim="form.goodsEnName" placeholder="请输入货品英文名称	" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4" v-if="pzqh === '0' || pzqh === '2'">
              <el-form-item label="国内报关HS" prop="goodsInReport">
                <el-input v-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '0'" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '1'" class="noteColor1" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '2'" class="noteColor2" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4" v-if="pzqh === '1' || pzqh === '3'">
              <el-form-item label="国外报关HS" prop="goodsReport">
                <el-input v-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '0'" v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '1'" class="noteColor1" v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '2'" class="noteColor2" v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
                <el-input v-else v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10" v-if="pzqh === '0' || pzqh === '2'">
              <el-form-item label="国外清关HS	" prop="goodsOutClearance">
                <el-input v-model.trim="form.goodsOutClearance" placeholder="请输入国外清关HS	" />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="pzqh === '1' || pzqh === '3'">
              <el-form-item label="国内清关HS	" prop="goodsClearance">
                <el-input v-model.trim="form.goodsClearance" placeholder="请输入国内清关HS	" />
              </el-form-item>
            </el-col>

            <el-col :span="10" offset="4">
              <el-form-item label="最外层包装形式" prop="goodsPacking">
                <el-select
                  v-model.trim="form.goodsPacking"
                  :disabled="!(goodsPacking1 == '' || goodsPacking1 == null)"
                  clearable
                >
                  <el-option value v-if="form.yuyan === '0'">-请选择-</el-option>
                  <el-option value="托盘" label="托盘" v-if="form.yuyan === '0'">托盘</el-option>
                  <el-option value="纸箱" label="纸箱" v-if="form.yuyan === '0'">纸箱</el-option>
                  <el-option value="木箱" label="木箱" v-if="form.yuyan === '0'">木箱</el-option>
                  <el-option value="裸装" label="裸装" v-if="form.yuyan === '0'">裸装</el-option>

                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option value="Pallet" label="Pallet" v-if="form.yuyan === '1'">Pallet</el-option>
                  <el-option value="Carton" label="Carton" v-if="form.yuyan === '1'">Carton</el-option>
                  <el-option value="Crates" label="Crates" v-if="form.yuyan === '1'" >Crates</el-option>
                  <el-option value="Nude" label="Nude" v-if="form.yuyan === '1'" >Nuded cargo</el-option>
                </el-select>
                <el-input
                  :disabled="!(form.goodsPacking == '' || form.goodsPacking == null)"
                  v-model.trim="goodsPacking1"
                  placeholder="请输入最外层包装形式"
                  style="width:200px !important;"
                />
                <div class="msgSpancss0 redTxt">* 选择一项或者自己填写</div>
                <!-- 包装方式 备注 -->
                <div style="color:#f00;font-size:10px" v-if="form.goodsPacking === '裸装' || form.goodsPacking === 'Nude'">
                    货物裸装，请联系业务部确认是否可以操作;货物超长超重，请联系业务部确认是否可以操作
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="最外层包装数量	" prop="goodsNumber">
                <el-input v-model.trim="form.goodsNumber" placeholder="请输入最外层包装数量	" />
              </el-form-item>
            </el-col>
            <el-col :span="10" offset="4">
              <el-form-item label="总体积(CBM)" >
                {{form.goodsCbm}}
                <!-- <el-input v-model.trim="form.goodsCbm" placeholder="请输入总体积(CBM)" /> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="总毛重(KGS)">
                {{form.goodsKgs}}
                <!-- <el-input v-model.trim="form.goodsKgs" placeholder="请输入总毛重(KGS)" /> -->
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <template v-if="goodsList.length">
              <el-row>
              <el-col :span="24">
                <el-divider content-position="left">货物规格信息(长*宽*高*数量/单件重量)</el-divider>
              </el-col>
              </el-row>
              <el-row>
                <el-col :span="23" :offset="1">
                  <span v-for="(goodsItem,index) in goodsList" :key="index" >
                    <span> 
                          {{goodsItem.goodsLength}}cm*{{goodsItem.goodsWidth}}cm*{{goodsItem.goodsHeight}}cm*{{goodsItem.goodsAmount}}/{{goodsItem.goodsWeight}}kg<span v-if="index !== (goodsList.length-1)">;&nbsp;&nbsp;</span>
                    </span>
                  </span>
                </el-col>
              </el-row>
              <el-row>
               <el-col :span="24">
                  <el-divider />
                </el-col>
              </el-row>
            </template>
            <!-- <el-col :span="12">
              <el-form-item label="规格(CM)">
                 <span v-for="(item,index) in goodsList" :key="index">{{item.goodsName}} : {{item.goodsLength}} * {{item.goodsWidth}} * {{item.goodsHeight}} <br/></span>
                <span class="msgSpancss0 redTxt">* 填写规则:L*W*H</span>
              </el-form-item>
            </el-col> -->
          </el-row>

          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col :span="10">
              <el-form-item label="是否需要装箱方案">
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="10">
              <el-form-item label="是否派监装员">
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col> -->
            <el-col v-if="form.shipOrderIsdispatch === '1'" :span="10">
              <el-form-item label="监装费用" prop="shipJzCost">
                <el-input v-model.trim="form.shipJzCost" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo'">
             <el-col :span="10">
              <el-form-item label="危险品备注" prop="nameRemark" v-if="form.nameRemark!=null">
                <el-input v-model.trim="form.nameRemark" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
             <el-col  :span="20">
              <el-form-item label="特殊单证备注" v-if="!!form.hsbz" prop="noteRemark" >
                <el-input v-model.trim="form.hsbz" placeholder v-if="!!form.hsbz" :disabled="true" type="textarea" :autosize="{ minRows: 2}"  />
              </el-form-item>
               <el-form-item label="品名" v-if="!!form.goodsbz" prop="noteRemark" >
                <el-input v-model.trim="form.goodsbz" placeholder v-if="form.goodsbz!=null" :disabled="true" type="textarea" :autosize="{ minRows: 2}"  />
              </el-form-item>
            </el-col>
             <!-- <el-col :span="20" v-if="form.noteColor === '1'">
              <el-form-item label="">
                <el-input v-model.trim="form.hsbz" type="textarea" :autosize="{ minRows: 2}" />
              </el-form-item>
            </el-col>  -->
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input v-model.trim="form.remark" type="textarea" :autosize="{ minRows: 2}" />

                <!-- <el-button @click="open_fjDownloadDialog(form.id)">附件</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row v-if="currentFormStatus === 'zhuandai'">
          <el-col :span="20">
            <el-form-item label="转待原因" prop="examInfo">
              <el-input v-model.trim="form.examInfo" type="textarea" :autosize="{ minRows: 2}" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </div>
      <el-dialog width="60%" title="审核失败原因" :visible.sync="innerVisible" append-to-body>
        <el-row>
            <el-col :span="22">
            <el-select v-model="checkFailReason" placeholder="请选择" style="width:660px" @change="checkFailReasonChange">
              <el-option
                v-for="item in checkFailReasons"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-input v-model.trim="form.examInfo" type="textarea" :autosize="{ minRows: 2}" />
          </el-col>
          <el-col :span="2" :offset="9">
            <el-button type="primary" :disabled="shenheFail" ref="shenheFail" @click="submitForm('1','shenheFail')">确 定</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <!-- 待审核状态 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'shenhe'" slot="footer" align="center">
        <el-button
          type="primary"
          v-hasPermi="['order:shippingorder:export']"
          @click="handleExport"
        >导出</el-button>
        <el-button type="primary" ref="shenheSuccess" :disabled="shenheSuccess" @click="submitForm('0','shenheSuccess')">审核通过</el-button>
        <el-button type="primary" @click="innerVisible = true">审核失败</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <!-- 委托书修改状态 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'edit'" slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-hasPermi="['order:shippingorder:export']"
          @click="handleExport"
        >导出</el-button>
        <el-button type="primary" ref="editOrder" :disabled="editOrder" @click="submitForm('2','editOrder')">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>

      <!-- 委托书转待审核状态 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'zhuandai'" slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-hasPermi="['order:shippingorder:export']"
          @click="handleExport"
        >导出</el-button>
        <!-- <el-button type="primary" ref="zhuandaiAudit" :disabled="zhuandaiAudit" @click="submitForm('3','zhuandaiAudit')">转待审核</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>

      <!-- 委托书查看详情 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'detailInfo'" slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-hasPermi="['order:shippingorder:export']"
          @click="handleExport"
        >导出</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>


    </el-dialog>

    <!-- 审核弹框中的“下载附件”列表弹框 -->
    <el-dialog
      width="65%"
      title="跟单员-选择"
      :visible.sync="fjDownloadDialog"
      append-to-body
      :destroy-on-close="true"
    >
      <el-table
        ref="multipleTable0"
        v-loading="loading"
        :data="datalist0"
        @selection-change="handleSelectionChange0"
      >
        <el-table-column label="文件名" align="center" prop="num" />
        <el-table-column label="操作" align="center" prop="name">
          <template>
            <a>下载</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total0>0"
        :total="total0"
        :page.sync="queryParams0.pageNum"
        :limit.sync="queryParams0.pageSize"
        @pagination="getList0"
      />
      <el-row>
        <el-col :span="24">
          <el-button type="info" @click="close_fjDownloadDialog()">关 闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 转待原因 弹框 -->
    <el-dialog
      title="委托书转待失败信息-列表"
      :visible.sync="zhuandaiReasonDialog"
      width="45%"
      :destroy-on-close="true"
    >
      <el-table
        ref="multipleTable0"
        v-loading="loading"
        :data="datalist1"
        @selection-change="handleSelectionChange0"
      >
        <el-table-column label="审核时间" align="center" prop="examDate" />
        <el-table-column label="失败原因" align="center" prop="examInfo" />
      </el-table>
      <pagination
        v-show="total1>0"
        :total="total1"
        :page.sync="queryParams1.pageNum"
        :limit.sync="queryParams1.pageSize"
        @pagination="getList1"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="zhuandaiReasonDialog=false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 改单费编辑 弹框 -->
    <el-dialog title="改单费-编辑" :visible.sync="gaidanDialog" width="25%" :destroy-on-close="true">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="是否有改单费">
          <el-radio v-model.trim="isGaidan" label="是">是</el-radio>
          <el-radio v-model.trim="isGaidan" label="否">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gaidanFn()">保 存</el-button>
        <el-button @click="gaidanDialog=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 舱位号修改 弹框 -->
    <el-dialog title="舱位号-修改" :visible.sync="cangweiDialog" width="35%" :destroy-on-close="true">
      <el-form ref="form" :model="form1" label-width="150px">
        <el-form-item label="原委托书编号:">{{form1.orderNumber}}</el-form-item>
        <el-form-item label="委托书编号修改为:">
          <el-input v-model.trim="form1.orderNumberEdit" />
        </el-form-item>
        <el-form-item label="原班列编号:">{{form1.orderClassBh}}</el-form-item>
        <el-form-item label="班列编号更改为:">
          <el-input v-model.trim="form1.orderClassBhEdit" />
        </el-form-item>
        <el-form-item label="堆场地址" prop="stationid" v-if="form1.classEastandwest==='1'">
                <el-select v-model.trim="form1.stationid" filterable clearable >
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in changzhanList1"
                    :key="index"
                    :label="item.statioin"
                    :value="item.stationId"
                  ></el-option>
                </el-select>
              </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" ref="cangweihaoBtn0" @click="cangweiDialogFn('cangweihaoBtn0')">保 存</el-button>
        <el-button @click="cangweiDialog=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 箱量修改 弹框 -->
    <el-dialog title="箱量-修改" :visible.sync="xlDialog" width="35%" :destroy-on-close="true">
      <el-form ref="form" :model="form2" label-width="150px">
        <el-form-item label="原始箱量:">{{yscontainerBoxamount}}</el-form-item>
        <el-form-item label="目标箱量:">
          <el-input v-model.trim="form2.containerBoxamount" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" ref="xlBtn0" @click="xlDialogFn('xlBtn0')">保 存</el-button>
        <el-button @click="xlDialog=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 审核失败详情 弹框 -->
    <el-dialog
      :title="title1"
      :visible.sync="shsbisupdateListDialog"
      width="45%"
      :destroy-on-close="true"
    >
      <ul v-for="(item,index) in isupdateList" :key="index" class="tsisupdateListULCss0">
        <li class="tsisupdateListLICss0">{{index}}:{{item.title}}</li>
        <li v-for="(item1,index1) in item.list" :key="index1">{{item1}}</li>
      </ul>
    </el-dialog>
    <!-- 委托书信息更新列表 和 审核失败详情 弹框 -->
    <el-dialog
      :title="title1"
      :visible.sync="isupdateListDialog"
      width="45%"
      :destroy-on-close="true"
    >
      <ul v-for="(item,index) in isupdateList" :key="index" class="tsisupdateListULCss0">
        <li class="tsisupdateListLICss0">{{index}}:{{item.title}}</li>
        <li v-for="(item1,index1) in item.contentList" :key="index1"
        >
         {{item1.record}}
         </li>
      </ul>
    </el-dialog>

    <!-- 班列列表 弹框 -->
    <el-dialog
      title="班列-选择"
      :visible.sync="classesDialog"
      width="55%"
      :destroy-on-close="true"
      append-to-body
    >
      <el-table
        v-loading="loading"
        class="el-tableCss0"
        :data="classesList"
        border
        @selection-change="handleSelectionChange1"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="班列号" align="center">
          <template slot-scope="scope">{{scope.row.classNumber}}</template>
        </el-table-column>
        <el-table-column label="班列编号" align="center" prop="classBh" />
        <el-table-column label="往返" align="center" prop="classEastandwest">
          <template slot-scope="scope">
            <!-- {{scope.row.classEastandwest}} -->
            <span v-if="scope.row.classEastandwest === '0'">西向</span>
            <span v-if="scope.row.classEastandwest === '1'">东向</span>
          </template>
        </el-table-column>
        <el-table-column label="始发站" align="center" prop="classStationofdepartureName" />
        <el-table-column label="目的地" align="center" prop="classStationofdestinationName" />
        <el-table-column label="班列日期" align="center" prop="classStime" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="single1" @click="classSubmit">确 定</el-button>
        <el-button @click="classesDialog=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 转待审核 弹框 -->
    <el-dialog :title="title" :visible.sync="open5" width="55%">
      <el-form ref="form5" :model="form5" :rules="rules1" label-width="180px">
          <div class="h5Css0">转待审核</div>
              <el-row>
                <p v-if="form5.examType   === '更改信息' || !form5.examType  " style="color:#f00;line-height:30px;word-space:5px; width:90%; margin-left:5%;">
                  选择取消订舱并说明原因，提交后，后台会根据订舱情况进行审核，无费用（具体费用可咨询推荐人）产生后台将直接进行订单取消，客户无需再操作。
                </p>
                <p v-if="form5.examType   === '撤舱'" style="color:#f00;line-height:30px;word-space:5px; width:90%; margin-left:5%;">
                  如您需要更改信息，请说明需要更改的项目，我司同意转待审核之后，需要再次编辑提交。
                </p>
                <p v-if="form5.examType   === '提前/推迟班次'" style="color:#f00;line-height:30px;word-space:5px; width:90%; margin-left:5%;">
                  选择推迟或提前订舱并说明原因，提交后，后台会根据订舱情况进行审核，后台审核通过后此订单会转为未完成订单的草稿状态，客户需在此草稿上进行委托书编辑提交即可，不要选择再次订舱。
                </p>

                 <el-col :span="24">
                   <!-- 整箱显示 -->
                  <el-form-item label="" prop="examType">
                    <el-radio v-model.trim="form5.examType" label="更改信息" >更改信息</el-radio>
                    <el-radio v-model.trim="form5.examType" label="撤舱">撤舱</el-radio>
                    <el-radio v-model.trim="form5.examType" label="提前/推迟班次">提前/推迟班次</el-radio>
                    <!-- <span class="msgSpancss0 redTxt">提示：默认起运港收费，目的港收费(请特别备注)，发车后，不再更改。</span> -->
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="转待原因" prop="examInfo">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2}"
                      placeholder="请输入转待失败原因"
                      v-model.trim="form5.examInfo"
                    ></el-input>
                  </el-form-item>
                </el-col>

              </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doZhuanDai1()"  >确定</el-button>
        <el-button @click="open5 = false">关 闭</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {
  fetchList,
  detailapi,
  updateapi,
  orderCancelapi,
  deleteapi,
  orderListMy,
  downLoadExcel,
  getSiteByOrderId,
  orderCheckApplyapi,
  orderSpaceEditapi,
  orderxlEditapi,
  historyEditRecord,
  examInfoListApi,
  boxAmountTotal,
  classesApi,
  getOrderNumberApi,
  stationList,
  inquiryInfo,
  goodsInfo,
  getInfoByBh,
  exportOrders
} from "@/api/classOrder/orders";
import {
  validatePhone,
  validateTelphone,
  validateEMail
} from "@/api/validator";
import { parseTime} from "@/utils/zhonghao";

import { resolveBlob } from "@/utils/zipdownload";
import "@/assets/styles/selfCss0.css";
import {khServiceIp } from "@/api/common";


const cityOptions = [
  { name: "汉堡", code: "49_20066" },
  { name: "慕尼黑", code: "49_80200" },
  { name: "列日", code: "32_20182" },
  { name: "亨克", code: "32_20183" },
  { name: "里昂", code: "33_750002" },
  { name: "杜伊斯堡", code: "49_47044" },
  { name: "巴黎", code: "33_75001" },
  { name: "马尔默", code: "46_04640" },
  { name: "赫尔辛基", code: "358_00002" },
  { name: "赫尔辛堡", code: "46_0464555" }
];
const cityOptions1 = [
  { name: "霍尔果斯", code: "86_835221" },
  { name: "阿拉木图1", code: "327_050000" },
  { name: "阿拉木图2", code: "998_021" },
  { name: "梅杰乌", code: "998_05" },
  { name: "热特苏", code: "700308" },
  { name: "塔什干", code: "998" },
  { name: "丘库尔赛", code: "998_01" },
  { name: "谢尔盖利", code: "998_02" },
  { name: "阿腾科里", code: "707701" }
];
const cityOptions2 = [{ name: "河内", code: "006_565" }];
const cityOptions3 = [
  { name: "马拉", code: "48_21500" },
  { name: "库特诺", code: "48_000000" },
  { name: "波兹南", code: "48_60111" },
  { name: "华沙", code: "48_00686" },
  { name: "布拉格", code: "420_10003" },
  { name: "布达佩斯", code: "36_1007" },
  { name: "米兰", code: "39_20121" },
  { name: "卡托维兹", code: "48_00032" }
];
const cityOptions4 = [
  { name: "布列斯特", code: "375_220072" },
  { name: "莫斯科", code: "7_109807" },
  { name: "明斯克", code: "375_220071" },
  { name: "圣彼得堡", code: "007_190121" },
  { name: "克拉斯诺亚尔斯克", code: "007-3" },
  { name: "丘诺亚尔", code: "007-2" },
  { name: "伊尔库茨克", code: "007-6" },
  { name: "沃尔西诺", code: "183502" }
];
export default {
  name: 'Orders',
  data() {
    return {
      timeout:null,
      title1:'',
      zhuandaiAudit:false,
      shenheFail:false,
      shenheSuccess:false,
      editOrder:false,
      orderNumberBack:'',
      noRoNameHistory: [],  //定义一个存放舱位号历史搜索记录的数组
      classNumberHistory: [], // 班列号
      orderClassBhHistory: [], // 班列编号
      dcfHistory: [],  //定义一个存放订舱方历史搜索记录的数组
      tjrHistory: [],
      ywbhHistory: [],
      ywybhHistory: [],
      czmcHistory: [],
      gdyHistory: [],
      hwpmHistory: [],
      baoguanAddressW:'',
      baoguanAddressE:'',
      classesDialog: false,
      arrs1: [],
      // 非单个禁用
      single1: true,
      // 非多个禁用
      multiple1: true,
      // 站点复选框
      //汉堡
      checkAll: false,
      //  checkedCities: [0,3], // 存的是城市index
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,

      //中亚
      checkAll1: false,
      checkedCities1: [],
      cities1: cityOptions1,
      isIndeterminate1: true,

      //中越
      checkAll2: false,
      checkedCities2: [],
      cities2: cityOptions2,
      isIndeterminate2: true,

      //波兰
      checkAll3: false,
      checkedCities3: [],
      cities3: cityOptions3,
      isIndeterminate3: true,

      //白俄
      checkAll4: false,
      checkedCities4: [],
      cities4: cityOptions4,
      isIndeterminate4: true,

      // *************************************** 下载附件 *********************************************************
      fjDownloadDialog: false, // 下载附件 弹框状态
      // 附件下载列表 查询参数
      queryParams0: {
        pageNum: 1,
        pageSize: 10,
        isexamline: ""
      },
      // 附件下载列表 总条数
      total0: 0,
      datalist0: [], // 附件下载 列表list数据
      // **************************************** 转待原因 ************************************************************
      // 转待原因列表 查询参数
      queryParams1: {
        pageNum: 1,
        pageSize: 10
      },
      // 转待原因列表 总条数
      total1: 0,
      datalist1: [], // 转待审核列表list数据
      zhuandaiReasonDialog: false, // 转待原因 弹框打开状态
       open5:false, // 转待审核弹框是否显示
      form5:{
      }, // 转待审核表单数据
      // *************************************** 托书修改、审核 *********************************************************
      currentFormStatus: "",
      form: {}, // 客户审核信息form表单
      formDisabled: false,
      // 表单校验
      rules1:{
        examType: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
      },
      rules: {
        orderMerchandiser: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        dictId: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientTjr: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        classNumber: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        classEastandwest: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        classDate: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        orderUploadsite: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        orderUnloadsite: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        classSite: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        orderIsticket: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        putoffClass: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        dcGaidanState: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
         stationid: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        sitecost: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientUnit: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientAddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientContacts: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientTel: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientEmail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsCannotpileup: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsFragile: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsGeneral: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        orderAuditBelongto: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientOrderBindingway: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        lineName: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        ywNumber: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientOrderBindingaddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        containerType: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientOrderBindingway: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        containerBoxamount: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrederName: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        consignorc: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrederContacts: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrederPhone: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrederAddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrederEmail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrderBinningway: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrderUnloadaddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrederContacts: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrderUnloadway: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrderUnloadwayEmail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipThTypeId: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrderUnloadtime: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrderUnloadaddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        detailedAddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipThCost: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipThCostNo: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipOrderSendtime: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipZsTypeId: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderName: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderContacts: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderPhone: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderMail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderAddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderIsclearance: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveQgCost: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderIspart: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        // distributionType: [
        //   {
        //     required: true,
        //     message: "*必填项",
        //     trigger: "blur"
        //   }
        // ],
        receiveOrderZihcontacts: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderZihemail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderPartaddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderZihtel: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveShCost: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveShCostId: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveXgCost: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveHxAddress: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        clientBgCost: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderReceiveemail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderMail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        receiveOrderEmail: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsMark: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        ywNumber: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsName: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsEnName: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsInReport: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsReport: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsOutClearance: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsClearance: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsPacking: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsNumber: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsCbm: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsKgs: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsStandard: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        goodsIsscheme: [
          {
            required: true,
            message: "*必填项 是否需要装箱方案",
            trigger: "blur"
          }
        ],
        shipOrderIsdispatch: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        shipJzCost: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
        examInfo: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ]
      },
      title: "", // 弹出层标题
      open: false, // 客户审核弹框是否显示
      zdState: false, // 查询条件中 “站点” 模块显示状态
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
      // 查询参数
      queryParams: {
        deptCode: null,
        pageNum: 1,
        pageSize: 100,
        orderNumber: null,
        clientTjr: null,
        orderMerchandiser: null,
        clientUnit: null,
        classDate: null,
        classNumber: null,
        orderClassBh: null,
        isexamline: null,
        isconsolidation: null,
        classEastandwest: null,
        lineTypeid: null,
        station: null,
        yuyan: null,
        isphone: null,
        shipOrderBinningway: null,
        receiveOrderIspart: null,
        isupdate: null,
        goodsName: null,
        organizationCode: null,
        siteCode: null,
        clientYwNumber: null,
        ywNumber: null

      },
      box20: 0,
      box40: 0,
      box45: 0,
      boxV: 0,
      boxKG: 0,
      total: 0, // 总条数
      list: [], // 订舱托书列表数据
      // ******************************************* 其他字段 *****************************************************
      // 展开-收起 更多查询条件
      moreQueryParams: false,
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
      // 托书当前 拼/整箱、去/回程字段
      //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；
      pzqh: "0",
      xlString: "zy", // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
      // ******************************************* 改单费编辑 字段 *****************************************************
      gaidanDialog: false, // 改单费编辑弹框
      isGaidan: "0", // 是否改单 字段
      // ******************************************* 舱位号修改 字段 *****************************************************
      cangweiDialog: false,
      xlDialog: false,
      yscontainerBoxamount:null,
      form1: {
        val1: ""
      },
      form2: {
        val1: ""
      },
      myList: [], //贸易方式 列表数据
      apiStr: null,
      goodsPacking1: null, // 最外层包装形式 输入框值
      sitelistupList: [], //上货站
      sitelistdownList: [], //下货站
      isupdateList: null, // 修改记录
      isupdateListDialog: false, // 修改记录弹框
      shsbisupdateListDialog: false, // 审核失败弹框
      classesList: [], // 可选择的班列列表
      txAddressList: [],
      hxAddressList: [],
      gdLabel: "0",
      gdVal: null,
      innerVisible: false,
      examInfo: null,
      changzhanList:[], //场站数据
      changzhanList1:[], //舱位号修改中场站数据
      disabledStr:'', // N-1中午12：00前后可编辑字段状态值
      goodsList:[],
      heightScreen:null,
      checkFailReason:'',
      checkFailReasons : [
        '尊敬的客户，您好，请再次确认下此票货的中文/英文品名！',

'尊敬的客户，您好，请再次确认下此票货的最外层包装规格！',

'尊敬的客户，您好，请再次确认下此票货的最外层包装形式！',

'尊敬的客户，您好，请再次确认下此票货的最外层包装数量！',

'尊敬的客户，您好，请再次确认下此票货的提送货时间！',

'尊敬的客户，您好，请将提货信息补充完整！',

'尊敬的客户，您好，请确认下提货费报价编号！',

'尊敬的客户，您好，请再次确认下此票货的站到站运费（可直接按照运费标准填写，并请注意单位的填写）！',

'尊敬的客户，您好，请再次确认下此票货的清关费（请注意单位的填写）！',

 '尊敬的客户，您好，请再次确认下此票货的清关费，若分拨费包含清关费，请在清关费处写明包含在分拨费中！',

'尊敬的客户，您好，请再次确认下此票货的分拨费（请注意单位的填写）！ ',

'尊敬的客户，您好，请补充完整发货人/收货人信息！',

'尊敬的客户，您好，请再次确认下此票货的报关费（请注意单位的填写）！',

'尊敬的客户，您好，请再次确认下此票货的报关费，若提货费中包含报关费，请在报关费处写明包含在提货费中！',

'尊敬的客户，您好，请再次确认下此票货的送货费（请注意单位的填写）！',

'尊敬的客户，您好，请与我司业务部再次确认下此票货物是否是危险品，是否可以正常运输，谢谢！'
      ]
    };
  },
  watch: {
    examInfo: {
      handler: function(val) {
        if (val) {
          this.form.examInfo = val;
        }
      }
    },
    gdVal: {
      handler: function(val) {
        if (val) {
          if (this.gdLabel === "0") {
            this.queryParams["classNumber"] = this.gdVal;
            this.queryParams["orderClassBh"] = null;
          } else if (this.gdLabel === "1") {
            this.queryParams["classNumber"] = null;
            this.queryParams["orderClassBh"] = this.gdVal;
          }
        }else{
          this.queryParams["classNumber"] = null;
          this.queryParams["orderClassBh"] = null;
        }
      }
    },
    gdLabel: {
      handler: function(val) {
        if (val) {
          if (val === "0") {
            this.queryParams["classNumber"] = this.gdVal;
            this.queryParams["orderClassBh"] = null;
          } else if (val === "1") {
            this.queryParams["classNumber"] = null;
            this.queryParams["orderClassBh"] = this.gdVal;
          }
        }else{
          this.queryParams["classNumber"] = null;
          this.queryParams["orderClassBh"] = null;
        }
      }
    },

    goodsPacking1: {
      handler: function(val) {
        if (val) {
          this.form.goodsPacking = null;
        }
      }
    },
    form: {
      handler: function(val) {
        if (val.goodsPacking) {
          this.goodsPacking1 = null;
        }
      },
      deep: true
    }
  },
  created() {
    
    this.queryParams['userid'] = this.$store.getters.id;
    this.queryParams.deptCode = this.$store.getters.deptCode;
    this.getList();
    // this.boxAmountTotalFn()
    this.orderListMyFn();
    
    this.apiStr = process.env.VUE_APP_BASE_API;
    
    
  },
  mounted() {
     if(window.screen.height >800){
        this.heightScreen = 590
      }else{
        this.heightScreen = 460
      }
    //组件加载后给noRoNameHistory 赋值
    this.noRoNameHistory = this.setIntoStorage('0')
    this.classNumberHistory = this.cnsetIntoStorage()
    this.orderClassBhHistory = this.ocbsetIntoStorage()
    this.dcfHistory = this.dcfsetIntoStorage()
    this.hwpmHistory = this.hwpmsetIntoStorage()
    this.gdyHistory = this.gdysetIntoStorage()
    this.czmcHistory = this.czmcsetIntoStorage()
    this.ywybhHistory = this.ywybhsetIntoStorage()
    this.ywbhHistory = this.ywbhsetIntoStorage()
    this.tjrHistory = this.tjrsetIntoStorage()
  },
  methods: {
    querySearch(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let noRoNameHistory = JSON.parse(localStorage.getItem('orderNumber'))
          let results = queryString ? noRoNameHistory.filter(this.createFilter(queryString)) : noRoNameHistory
          cb(results);
      },
      createFilter(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      querySearchCn(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let classNumberHistory = JSON.parse(localStorage.getItem('classNumber'))
          let results = queryString ? classNumberHistory.filter(this.createFilter(queryString)) : classNumberHistory
          cb(results);
      },
      querySearchOcb(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let orderClassBhHistory = JSON.parse(localStorage.getItem('orderClassBh'))
          let results = queryString ? orderClassBhHistory.filter(this.createFilter(queryString)) : orderClassBhHistory
          cb(results);
      },
      querySearchDcf(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let dcfHistory = JSON.parse(localStorage.getItem('clientUnit'))
          let results = queryString ? dcfHistory.filter(this.createFilterDcf(queryString)) : dcfHistory
          cb(results);
      },
      createFilterDcf(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      querySearchHwpm(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let hwpmHistory = JSON.parse(localStorage.getItem('goodsName'))
          let results = queryString ? hwpmHistory.filter(this.createFilterHwpm(queryString)) : hwpmHistory
          cb(results);
      },
      createFilterHwpm(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      querySearchGdy(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let gdyHistory = JSON.parse(localStorage.getItem('orderMerchandiser'))
          let results = queryString ? gdyHistory.filter(this.createFilterGdy(queryString)) : gdyHistory
          cb(results);
      },
      createFilterGdy(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      querySearchCzmc(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let czmcHistory = JSON.parse(localStorage.getItem('station'))
          let results = queryString ? czmcHistory.filter(this.createFilterCzmc(queryString)) : czmcHistory
          cb(results);
      },
      createFilterCzmc(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      querySearchYwybh(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let ywybhHistory = JSON.parse(localStorage.getItem('ywNumber'))
          let results = queryString ? ywybhHistory.filter(this.createFilterYwybh(queryString)) : ywybhHistory
          cb(results);
      },
      createFilterYwybh(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      querySearchYwbh(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let ywbhHistory = JSON.parse(localStorage.getItem('clientYwNumber'))
          let results = queryString ? ywbhHistory.filter(this.createFilterYwbh(queryString)) : ywbhHistory
          cb(results);
      },
      createFilterYwbh(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      querySearchTjr(queryString, cb) {
          // 调用 callback 返回建议列表的数据
          let tjrHistory = JSON.parse(localStorage.getItem('clientTjr'))
          let results = queryString ? tjrHistory.filter(this.createFilterTjr(queryString)) : tjrHistory
          cb(results);
      },
      createFilterTjr(queryString) {
          return (item) => {
              return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          }
      },
      setIntoStorage(obj) {
        let noArr;
        if(JSON.parse(localStorage.getItem('orderNumber'))){
          noArr = JSON.parse(localStorage.getItem('orderNumber'))// 历史记录数组
        }else{
          localStorage.setItem("orderNumber", "[]");
          return
        }
        let value;
        if(obj === '0'){
          value = this.queryParams.orderNumber
        }else if(obj === '1'){
          value = this.form.orderNumber
        }

        const orderNumber = 'orderNumber'
        let abc = {};
        if(value){
          abc = { "value": value, "type": orderNumber };
        }
        if (JSON.parse(localStorage.getItem(orderNumber))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(orderNumber, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('orderNumber'))
  },
  cnsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('classNumber'))){
          noArr = JSON.parse(localStorage.getItem('classNumber'))// 历史记录数组
        }else{
          localStorage.setItem("classNumber", "[]");
          return
        }
        let value;
          value = this.queryParams.classNumber
        const classNumber = 'classNumber'
        let abc = {};
        if(value){
          abc = { "value": value, "type": classNumber };
        }
        if (JSON.parse(localStorage.getItem(classNumber))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            noArr.push(abc);
            localStorage.setItem(classNumber, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('classNumber'))
  },
  ocbsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('orderClassBh'))){
          noArr = JSON.parse(localStorage.getItem('orderClassBh'))// 历史记录数组
        }else{
          localStorage.setItem("orderClassBh", "[]");
          return
        }
        let value;
          value = this.queryParams.orderClassBh
        const orderClassBh = 'orderClassBh'
        let abc = {};
        if(value){
          abc = { "value": value, "type": orderClassBh };
        }
        if (JSON.parse(localStorage.getItem(orderClassBh))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            noArr.push(abc);
            localStorage.setItem(orderClassBh, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('orderClassBh'))
  },
  dcfsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('clientUnit'))){
          noArr = JSON.parse(localStorage.getItem('clientUnit'))// 历史记录数组
        }else{
          localStorage.setItem("clientUnit", "[]");
          return
        }
        let value;
          value = this.queryParams.clientUnit
        const clientUnit = 'clientUnit'
        let abc = {};
        if(value){
          abc = { "value": value, "type": clientUnit };
        }
        if (JSON.parse(localStorage.getItem(clientUnit))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(clientUnit, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('clientUnit'))

  },
  hwpmsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('goodsName'))){
          noArr = JSON.parse(localStorage.getItem('goodsName'))// 历史记录数组
        }else{
          localStorage.setItem("goodsName", "[]");
          return
        }
        let value;
          value = this.queryParams.goodsName
        const goodsName = 'goodsName'
        let abc = {};
        if(value){
          abc = { "value": value, "type": goodsName };
        }
        if (JSON.parse(localStorage.getItem(goodsName))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(goodsName, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('goodsName'))

  },
  gdysetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('orderMerchandiser'))){
          noArr = JSON.parse(localStorage.getItem('orderMerchandiser'))// 历史记录数组
        }else{
          localStorage.setItem("orderMerchandiser", "[]");
          return
        }
        let value;
          value = this.queryParams.orderMerchandiser
        const orderMerchandiser = 'orderMerchandiser'
        let abc = {};
        if(value){
          abc = { "value": value, "type": orderMerchandiser };
        }
        if (JSON.parse(localStorage.getItem(orderMerchandiser))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(orderMerchandiser, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('orderMerchandiser'))

  },
  czmcsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('station'))){
          noArr = JSON.parse(localStorage.getItem('station'))// 历史记录数组
        }else{
          localStorage.setItem("station", "[]");
          return
        }
        let value;
          value = this.queryParams.station
        const station = 'station'
        let abc = {};
        if(value){
          abc = { "value": value, "type": station };
        }
        if (JSON.parse(localStorage.getItem(station))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(station, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('station'))

  },
  ywybhsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('ywNumber'))){
          noArr = JSON.parse(localStorage.getItem('ywNumber'))// 历史记录数组
        }else{
          localStorage.setItem("ywNumber", "[]");
          return
        }
        let value;
          value = this.queryParams.ywNumber
        const ywNumber = 'ywNumber'
        let abc = {};
        if(value){
          abc = { "value": value, "type": ywNumber };
        }
        if (JSON.parse(localStorage.getItem(ywNumber))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(ywNumber, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('ywNumber'))

  },
  ywbhsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('clientYwNumber'))){
          noArr = JSON.parse(localStorage.getItem('clientYwNumber'))// 历史记录数组
        }else{
          localStorage.setItem("clientYwNumber", "[]");
          return
        }
        let value;
          value = this.queryParams.clientYwNumber
        const clientYwNumber = 'clientYwNumber'
        let abc = {};
        if(value){
          abc = { "value": value, "type": clientYwNumber };
        }
        if (JSON.parse(localStorage.getItem(clientYwNumber))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(clientYwNumber, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('clientYwNumber'))

  },
  tjrsetIntoStorage() {
        let noArr;
        if(JSON.parse(localStorage.getItem('clientTjr'))){
          noArr = JSON.parse(localStorage.getItem('clientTjr'))// 历史记录数组
        }else{
          localStorage.setItem("clientTjr", "[]");
          return
        }
        let value;
          value = this.queryParams.clientTjr
        const clientTjr = 'clientTjr'
        let abc = {};
        if(value){
          abc = { "value": value, "type": clientTjr };
        }
        if (JSON.parse(localStorage.getItem(clientTjr))) {
            if(!value) {
              return
            }
            // 判断是否已有xxx查询记录的localStorage
            var currentValue = noArr.filter((item) => {
                            return item.value == value;
                        });
            if (currentValue.length > 0) {
              // 判断是否已有此条查询记录，若已存在，则不需再存储
                return;
            }
            // 数量多于几个剔除其中一个
            // let arrLength = 0;
            // for(var a in noArr){
            //   arrLength++;
            // }
            // if (arrLength >= 5) {
            //   noArr.pop()
            // }
            noArr.push(abc);
            localStorage.setItem(clientTjr, JSON.stringify(noArr))
        }
        console.log(localStorage.getItem('clientTjr'))

  },
  handleSelect(item) {
        console.log(item);
      },
    // 导出托书汇总表
    // exportFn(){
    //   exportOrders(this.queryParams).then(response=>{
    //     //将 Blob对象 读成字符串
    //     let that=this
    //     var reader = new FileReader();
    //     reader.readAsText(response, 'utf-8');
    //     reader.onload = function (e) {
    //         let fileName=JSON.parse(reader.result).msg
    //         that.download(fileName)
    //     }
    //   })
    // },
    stationListFn(){
      let isReportStr=null
      if(this.form.clientOrderBindingway){
        if(this.form.clientOrderBindingway === '0'){
            isReportStr = '1'
        }else if(this.form.clientOrderBindingway === '1'){
            isReportStr = '0'
        }
      }
      let params={
        isconsolidation:this.form.isconsolidation,
        orderUploadcode:this.form.orderUploadcode,
      }
      stationList(params).then(res=>{
        if(res.code === 200){
          this.changzhanList=res.rows
        }else{
          this.msgError(res.msg)
        }
      })
    },
    dictIdNameFn(){
     this.myList.filter(item=>{
       if(item.id === this.form.dictId){
         this.form.dictName=item.mcheng
       }
     })
    //  console.log( this.form)
    },
    // 修改班列信息
    classesFn() {
      let that = this;
      // http://171.15.132.243:8087/bi/classes?inquiryRecordId=132&language=ch
      // XMLHttpRequest对象用于在后台与服务器交换数据
      var xhr = new XMLHttpRequest();
      let inquiryRecordIdStr = this.form.inquiryRecordId;
      // alert(inquiryRecordIdStr)
      xhr.open(
        "GET",
        khServiceIp +
          "/bi/classes?inquiryRecordId=" +
          inquiryRecordIdStr +
          "&language=ch&orderId="+this.form.orderId,
        true
      );
      xhr.onreadystatechange = function() {
        // readyState == 4说明请求已完成
        if ((xhr.readyState == 4 && xhr.status == 200) || xhr.status == 304) {
          // console.log(xhr.responseText)

          // 从服务器获得数据
          // fn.call(this, xhr.responseText);
          that.getClasses(xhr.responseText);
        }
      };
      xhr.send();
    },

    // 获取提还箱地址
    getHxaddressFn(obj) {
      let that = this;
      //  obj === '0' 表示提箱地， obj === '1' 表示还箱地
      if (obj === "0") {
        that.txAddressList = [];
      } else if (obj === "1") {
        that.hxAddressList = [];
      }
      var xhr = new XMLHttpRequest();
      let inquiryRecordIdStr = this.form.inquiryRecordId;

      // 国内外 1国内（去程，提箱地是国内） 0国外（回程，还箱地是国内）
      let intra = this.form.classEastandwest == '0' ? '1':'0'
      let containerType = this.form.containerType
      xhr.open(
        "GET",
        khServiceIp + "/busiBoxfee/boxList?type=" + obj + "&language=ch"+ obj + "&containerType="+containerType + "&intra=" + intra,
        true
      );
      xhr.onreadystatechange = function() {
        // readyState == 4说明请求已完成
        if ((xhr.readyState == 4 && xhr.status == 200) || xhr.status == 304) {
          let res = JSON.parse(xhr.responseText);
          //  obj === '0' 表示提箱地， obj === '1' 表示还箱地
          if (obj === "0") {
            that.txAddressList = res.data;  // 详情调用此方法，参数传0，先获取提箱地，然后再下方传1调用此方法，获取还箱地
            that.getHxaddressFn("1");
          } else if (obj === "1") {
            that.hxAddressList = res.data;
          }
        }
      };
      xhr.send();
    },

    getClasses(res) {
      // console.log(res +"&&")
      let obj = JSON.parse(res);
      this.classesList = obj.data;
      this.classesDialog = true;
    },
    classSubmit() {
      this.form["classId"] = this.arrs1[0].classId;
      this.form["classDate"] = this.arrs1[0].classStime;
      this.form["orderClassBh"] = this.arrs1[0].classBh;
      this.form["classNumber"] = this.arrs1[0].classNumber;

      this.classesDialog = false;
    },
    boxAmountTotalFn() {
      boxAmountTotal(this.queryParams).then(res => {
        if (res.code === 200) {
          this.box20 = res.data["20t"];
          this.box40 = res.data["40t"];
          this.box45 = res.data["45t"];
          this.boxV = res.data.v;
          this.boxKG = res.data.w;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 修改记录弹框列表数据获取
    handleisupdateDetail(obj,obj1) {
      if(obj1 == '0'){
          this.title1='委托书审核失败原因'
          detailapi(obj.orderId).then(res=>{
              let str=!!res.data.examInfo?res.data.examInfo:'暂无数据'
              this.isupdateList=[{title:str}]
              this.shsbisupdateListDialog = true;
          })
      }else if(obj1 == '1'){
            this.title1='委托书信息更新列表'
            let params = { orderId: obj.orderId };
            historyEditRecord(params).then(res => {
              if (res.code === 200) {
                this.isupdateList = res.rows;
                this.isupdateListDialog = true;
              } else {
                this.$message.error(res.msg);
              }
            });
      }

    },

      // 转待审核申请
    orderCheckApplyapiFn1() {
      let row = this.arrs[0];
      this.form5['orderId']=row.orderId
      // this.form5['examType']='更改信息'
      let isexamlineStr = row.isexamline;
      let turncountStr = row.turncount;
      if (isexamlineStr !== "1") {
        this.$message.error("抱歉,已审核托书才能执行此操作");
      } else if (turncountStr >= 2) {
        this.$message.error("抱歉,一天内最多允许执行两次转待操作");
      } else {
        this.open5=true
      }
    },

    // 转待审核申请
    orderCheckApplyapiFn() {
      let row = this.arrs[0];
      let isexamlineStr = row.isexamline;
      let turncountStr = row.turncount;
      if (isexamlineStr !== "1") {
        this.$message.error("抱歉,已审核托书才能执行此操作");
      } else if (turncountStr >= 2) {
        this.$message.error("抱歉,一天内最多允许执行两次转待操作");
      } else {
        this.handleUpdate("zhuandai");
      }
    },
     doZhuanDai1() {
      let params = {};
      params["createuserid"] = this.$store.getters.id;
      params["createusername"] = this.$store.getters.name;
      params["examInfo"] = this.form5.examInfo // 申请转待原因
      params["orderId"] = this.form5.orderId; // 订单id
      params["examType"] = this.form5.examType; // 订单id

      if(!!this.form5.examType && !!this.form5.examInfo){
            orderCheckApplyapi(params).then(res => {
              if (res.code === 200) {
                this.getList();
                this.msgSuccess("操作成功");
                this.open5 = false;
              } else {
                this.$message.error("操作失败：" + res.msg);
                this.open5 = false;
              }
            });
      }else if(!this.form5.examType){
        this.$message.error("请选择更改信息、撤舱或者提前/推迟班次");
      }else if(!this.form5.examInfo){
        this.$message.error("请填写转待原因");
      }

    },

    doZhuanDai(dataObj,obj1) {
      let params = dataObj;
      params["createuserid"] = this.$store.getters.id;
      params["createusername"] = this.$store.getters.name;
      params.examInfo = this.form.examInfo // 申请转待原因
      params.isexamline = "4"; // 操作状态（传定值4）
      params.orderId = this.ids[0]; // 订单id

      orderCheckApplyapi(params).then(res => {
          this[obj1]=true
        if (res.code === 200) {
          this.getList();
          this.msgSuccess("操作成功");
          this.open = false;
        } else {
          this.$message.error("操作失败：" + res.msg);
          this.open = false;
        }
      });
    },
    // 获取上下货站
    getSiteByOrderIdFn(obj) {
      let params = {
        classId: this.form.classId,
        orderId: this.form.orderId
      };
      this.open = true;
      this.title = obj;
      this.sitelistupList = [];
      this.sitelistdownList = [];
      getSiteByOrderId(params).then(res => {
        if (res.code === 200) {
          this.sitelistupList = res.data.sitelistup;
          this.sitelistdownList = res.data.sitelistdown;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //获取托书详情中 贸易方式 下拉列表数据
    orderListMyFn() {
      orderListMy().then(res => {
        if (res.code === 200) {
          this.myList = res.rows;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 汉堡
    handleCheckAllChange(val) {
      let arr = cityOptions.map((item, index) => index);
      this.checkedCities = val ? arr : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },

    // 中亚
    handleCheckAllChange1(val) {
      let arr = cityOptions1.map((item, index) => index);
      this.checkedCities1 = val ? arr : [];
      this.isIndeterminate1 = false;
    },
    handleCheckedCitiesChange1(value) {
      let checkedCount = value.length;
      this.checkAll1 = checkedCount === this.cities1.length;
      this.isIndeterminate1 =
        checkedCount > 0 && checkedCount < this.cities1.length;
    },

    // 中越
    handleCheckAllChange2(val) {
      let arr = cityOptions2.map((item, index) => index);
      this.checkedCities2 = val ? arr : [];
      this.isIndeterminate2 = false;
    },
    handleCheckedCitiesChange2(value) {
      let checkedCount = value.length;
      this.checkAll2 = checkedCount === this.cities2.length;
      this.isIndeterminate2 =
        checkedCount > 0 && checkedCount < this.cities2.length;
    },

    // 波兰
    handleCheckAllChange3(val) {
      let arr = cityOptions3.map((item, index) => index);
      this.checkedCities3 = val ? arr : [];
      this.isIndeterminate3 = false;
    },
    handleCheckedCitiesChange3(value) {
      let checkedCount = value.length;
      this.checkAll3 = checkedCount === this.cities3.length;
      this.isIndeterminate3 =
        checkedCount > 0 && checkedCount < this.cities3.length;
    },

    // 白俄
    handleCheckAllChange4(val) {
      let arr = cityOptions4.map((item, index) => index);
      this.checkedCities4 = val ? arr : [];
      this.isIndeterminate4 = false;
    },
    handleCheckedCitiesChange4(value) {
      let checkedCount = value.length;
      this.checkAll4 = checkedCount === this.cities4.length;
      this.isIndeterminate4 =
        checkedCount > 0 && checkedCount < this.cities4.length;
    },

    /** 查询客户管理列表 */
    getList() {
      this.loading = true;
      let code = [];
      let arr = this.checkedCities.map(item => cityOptions[item].code);
      let arr1 = this.checkedCities1.map(item => cityOptions1[item].code);
      let arr2 = this.checkedCities2.map(item => cityOptions2[item].code);
      let arr3 = this.checkedCities3.map(item => cityOptions3[item].code);
      let arr4 = this.checkedCities4.map(item => cityOptions4[item].code);
      if (arr.length !== 0) {
        code.push(arr.join(","));
      }
      if (arr1.length !== 0) {
        code.push(arr1.join(","));
      }
      if (arr2.length !== 0) {
        code.push(arr2.join(","));
      }
      if (arr3.length !== 0) {
        code.push(arr3.join(","));
      }
      if (arr4.length !== 0) {
        code.push(arr4.join(","));
      }

      this.queryParams.siteCode =  code.length > 0 ? code.join(",") : null;

      fetchList(this.queryParams).then(res => {
        if (res.code === 200) {
          this.list = res.rows;
          this.total = res.total;
          this.loading = false;
        } else {
          this.$message.info(res.msg);
        }
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
      this.form = {};
      this.form2 = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.boxAmountTotalFn();
      this.setIntoStorage('0');
      this.cnsetIntoStorage();
      this.ocbsetIntoStorage();
      this.dcfsetIntoStorage();
      this.hwpmsetIntoStorage();
      this.gdysetIntoStorage();
      this.czmcsetIntoStorage();
      this.ywybhsetIntoStorage();
      this.ywbhsetIntoStorage();
      this.tjrsetIntoStorage();
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.gdVal=null;
      this.queryParams["classNumber"] = null;
      this.queryParams["orderClassBh"] = null;
      this.handleQuery();
    },
    //全选时间执行清空操作
    onSelectAll() {
        this.$refs.multipleTable.clearSelection();
      },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   
    //   this.arrs = selection.map(item => item);
    //   this.ids = selection.map(item => item.orderId);
    //   this.single = selection.length !== 1;
    //   this.multiple = !selection.length;
    // },
    //只能单选
    handleSelectionChange(rows) {
      
        if (rows.length > 1) {
          var newRows = rows.filter((it, index) => {
            if (index == rows.length - 1) {
              this.$refs.multipleTable.toggleRowSelection(it, true);
              return true;
            } else {
              this.$refs.multipleTable.toggleRowSelection(it, false);
              return false;
            }
          });
          
        } else {
           this.arrs = rows.map(item => item);
           this.ids = rows.map(item => item.orderId);
          this.multipleSelection = rows;
          this.single = rows.length !== 1;
          this.multiple = !rows.length;
        }
      },
    handleRow(obj) {
      this.$refs.multipleTable.toggleRowSelection(obj);
    },
    // 班列 多选框选中数据
    handleSelectionChange1(selection) {
      this.arrs1 = selection.map(item => item);
      this.single1 = selection.length !== 1;
      this.multiple1 = !selection.length;
    },
    handleSelectionChange0(selection) {},

    /* 打开 下载附件弹框 */
    open_fjDownloadDialog(id) {
      this.fjDownloadDialog = true;
    },
    /* 下载附件弹框 列表数据的获取 */
    getList0() {
      this.dataList0 = [];
    },

    /* 关闭 下载附件弹框 */
    close_fjDownloadDialog() {
      this.fjDownloadDialog = false;
    },
    handleDetail(obj) {
      this.handleShenhe(obj, "托书详情");
      this.currentFormStatus = "detailInfo";
    },
    /** 获取托书编号 */
    getOrderNumberFn(obj) {
      getOrderNumberApi(obj).then(res => {
        if (res.code === 200) {
          this.form.orderNumber = res.msg;
          this.getInfoByBhFn()
        } else {
          this.msgError(res.msg);
        }
      });
    },
    /** 审核按钮操作 */
    handleShenhe(row, obj1) {
      let rowData = row || this.arrs[0];
      if (rowData.isexamline !== "0" && !obj1) {
        if (rowData.isexamline === "4") {
            this.$message.error(
              "请到转待审核列表审核."
            );
        } else {
          this.$message.error(
              "当前托书状态不能执行审核操作。"
          );
        }
        // let cunrrentState = null;
        // if (rowData.isexamline === "1") {
        //   cunrrentState = "已审核通过";
        // }
        // if (rowData.isexamline === "2") {
        //   cunrrentState = "已审核失败";
        // }
        // if (rowData.isexamline === "3") {
        //   cunrrentState = "取消托书";
        // }
        // if (rowData.isexamline === "4") {
        //   cunrrentState = "转待审核中";
        // }
        // if (rowData.isexamline === "5") {
        //   cunrrentState = "草稿";
        // }
        return false;
      }
      this.currentFormStatus = "shenhe";
      this.form = {};
      const orderIdObj = rowData.orderId;
      detailapi(orderIdObj).then(res => {
        this.form = res.data;
        if(this.form.orderNumber){
        this.orderNumberBack = this.form.orderNumber
        }
        // 提货时间不早于当前审核时间,提货时间为当前审核时间+1,系统修改暂时不做
        // let dateTime00 = this.form.shipOrderUnloadtime.substring(0,10);
        // var datec = new Date();
        // var yearc = datec.getFullYear();
        // var monthc = datec.getMonth() + 1;
        // var dayc = datec.getDate();
        // var dayf = datec.getDate() + 1;
        // var timc = yearc + "-" + monthc + "-" + dayc;
        // var ssffmm = this.form.shipOrderUnloadtime.substring(11,16);
        // if(!this.orderNumberBack&&(dateTime00<timc)){
        //  this.form.shipOrderUnloadtime = yearc + "-" + monthc + "-" + dayf + " " + ssffmm;
        // }

        // if(this.currentFormStatus !== "detailInfo"){
        //   this.getInfoByBhFn()
        // }//0912辛怡注释,审核时,舱位号存在,不修改时,不调用判重接口
        let inquiryRecordId=res.data.inquiryRecordId;
        // 获取货物 规格数据
        goodsInfo(inquiryRecordId).then(res=>{
          this.goodsList=res.rows
        })
        //获取场站下拉列表数据
        this.stationListFn()

        this.getHxaddressFn("0");  // 先获取提箱地，

        if (!this.form.orderNumber && obj1 !== '托书详情') {
          this.getOrderNumberFn(this.form.orderId);
        }
        // 获取上下货站
        if (obj1) {
          this.getSiteByOrderIdFn(obj1);
        } else {
          this.getSiteByOrderIdFn("审核");

        }

        // classEastandwest: 0为去程 1为回程
        // isconsolidation: 整拼箱 0整柜 1拼箱
        //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；

        if (
          res.data.classEastandwest === "0" &&
          res.data.isconsolidation === "1"
        ) {
          this.pzqh = "0";
        } else if (
          res.data.classEastandwest === "1" &&
          res.data.isconsolidation === "1"
        ) {
          this.pzqh = "1";
        } else if (
          res.data.classEastandwest === "0" &&
          res.data.isconsolidation === "0"
        ) {
          this.pzqh = "2";
        } else if (
          res.data.classEastandwest === "1" &&
          res.data.isconsolidation === "0"
        ) {
          this.pzqh = "3";
        }
        // 线路类型：0中欧 2中亚 3中越 4中俄
        // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
        if (res.data.lineTypeid === "2") {
          this.xlString = "zy";
        } else {
          this.xlString = "fzy";
        }

      });
    },
    /* 托书修改按钮 操作 */
    handleUpdate(obj) {
      // 0\1\4\
      // console.log(this.arrs[0])

      if (obj === "edit") {
        if (
          this.arrs[0].isexamline === "1" ||
          this.arrs[0].isexamline === "4"
        ) {
          // let cunrrentState = null;
          // if (this.arrs[0].isexamline === "0") {
          //   cunrrentState = "未审核";
          // }
          // if (this.arrs[0].isexamline === "1") {
          //   cunrrentState = "已审核通过";
          // }
          // if (this.arrs[0].isexamline === "2") {
          //   cunrrentState = "已审核失败";
          // }
          // if (this.arrs[0].isexamline === "3") {
          //   cunrrentState = "取消托书";
          // }
          // if (this.arrs[0].isexamline === "4") {
          //   cunrrentState = "转待审核";
          // }
          // if (this.arrs[0].isexamline === "5") {
          //   cunrrentState = "草稿";
          // }
          this.$message.error(
            '请选择"未审核"、"取消托书"、"已审核失败"、"草稿"的托书进行操作,当前托书状态不能执行修改操作。'
          );
          return false;
        }
        this.currentFormStatus = "edit";
      } else if (obj === "zhuandai") {
        this.currentFormStatus = "zhuandai";
        this.title = "转待审核";
        if (this.arrs[0].isexamline !== "1") {
          let cunrrentState = null;
          if (this.arrs[0].isexamline === "0") {
            cunrrentState = "未审核";
          }
          if (this.arrs[0].isexamline === "1") {
            cunrrentState = "已审核通过";
          }
          if (this.arrs[0].isexamline === "2") {
            cunrrentState = "已审核失败";
          }
          if (this.arrs[0].isexamline === "3") {
            cunrrentState = "取消托书";
          }
          if (this.arrs[0].isexamline === "4") {
            cunrrentState = "转待审核";
          }
          if (this.arrs[0].isexamline === "5") {
            cunrrentState = "草稿";
          }
          this.$message.error(
            '请选择"已审核失败"的托书进行操作,当前托书状态:' +
              cunrrentState +
              ",不能执行审核操作。"
          );
          return false;
        }

        // 比较时间的大小

        let dateTime = this.arrs[0].classDate
        dateTime = new Date(dateTime)
        dateTime=dateTime.setDate(dateTime.getDate()-1);
        dateTime=new Date(dateTime);
        let dateTime0  = new Date()  // 当前时间
        dateTime = parseTime(dateTime)
        dateTime = dateTime.substring(0,(dateTime.length-8)) +"12:00:00" // (N-1) 12:00:00
        // dateTime0 = parseTime(dateTime0)
        // alert(dateTime0 +"**"+dateTime)
        dateTime = new Date(dateTime);

        if(dateTime0.getTime() > dateTime.getTime()){
          // N-1中午12：00前，修改托书，如果只是涉及收货方信息更改，包括还箱地
          this.disabledStr='0'
        } else {
          // 修改托书范围：仅限于收货方信息（含还箱地）、下货站、运踪到站接收邮箱，其他信息不能修改
          this.disabledStr='1'
        }


      }

      this.formDisabled = false;
      this.pzqh = null;
      this.form = {};
      const orderId = this.ids[0];
      detailapi(orderId).then(response => {
        this.form = response.data;

        let inquiryRecordId=response.data.inquiryRecordId;
        // 获取货物 规格数据
        goodsInfo(inquiryRecordId).then(res=>{
          this.goodsList=res.rows
        })
        //获取场站下拉列表数据
        this.stationListFn()

        if (obj === "zhuandai") {
          this.getSiteByOrderIdFn("转待审核");
        } else if (obj === "edit") {
          this.getSiteByOrderIdFn("托书修改");
        }

        // classEastandwest: 0为去程 1为回程
        // isconsolidation: 整拼箱 0整柜 1拼箱
        //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；

        if (
          response.data.classEastandwest === "0" &&
          response.data.isconsolidation === "1"
        ) {
          this.pzqh = "0";
        } else if (
          response.data.classEastandwest === "1" &&
          response.data.isconsolidation === "1"
        ) {
          this.pzqh = "1";
        } else if (
          response.data.classEastandwest === "0" &&
          response.data.isconsolidation === "0"
        ) {
          this.pzqh = "2";
        } else if (
          response.data.classEastandwest === "1" &&
          response.data.isconsolidation === "0"
        ) {
          this.pzqh = "3";
        }
        // 线路类型：0中欧 2中亚 3中越 4中俄
        // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
        if (response.data.lineTypeid === "2") {
          this.xlString = "zy";
        } else {
          this.xlString = "fzy";
        }

      });
      this.open = true;
      if (obj === "edit") {
        this.currentFormStatus = "edit";
      } else if (obj === "zhuandai") {
        this.currentFormStatus = "zhuandai";
      }
    },
    // 校验托书编号
    getInfoByBhFn(){
      this.setIntoStorage('1')
      let params={
        orderNumber:this.form.orderNumber
      }
      getInfoByBh(params).then(res=>{
          if(res.code !== 200){
            this.$message.error(res.msg)
          }
      })
    },

    /** 提交按钮 */
    submitForm: function(obj,obj1) {
      this[obj1]=true
       if(this.form.classEastandwest === '0'){
         this.shenheSuccess = false
          this.form.orderMerchandiserId=this.form.merchandiserIdW
          this.form.orderMerchandiser=this.form.merchandiserW
      }
      if (obj === "0") {
        if(!this.form.orderNumber){
           this.msgError("抱歉，当前托书中委托书编号为空")
           this.shenheSuccess = false
           return false
        }
        if(!this.orderNumberBack&&this.form.shipOrderUnloadtime&&this.form.classEastandwest=='0'&&this.form.shipOrderBinningway=='0'){
        var datec = new Date();
        var yearc = datec.getFullYear();
        var monthc = datec.getMonth() + 1;
        var dayc = datec.getDate() + 1;
        var hourc = datec.getHours();
        if (monthc < 10) {
        monthc = "0" + monthc;
        }
        if (dayc < 10) {
        dayc = "0" + dayc;
        }
        if (hourc < 10) {
        hourc = "0" + hourc;
        }
        var timc = yearc + "-" + monthc + "-" + dayc+ " " + hourc;
        var ssffmm = this.form.shipOrderUnloadtime.substring(0,13);
        debugger
        if(timc>=ssffmm){
          this.msgError("请修改提货时间")
           this.shenheSuccess = false
         return false
        }
        }
        
        // 审核通过
        this.form["operateType"] = "0";
        this.form["isexamline"] = "1";
      } else if (obj === "1") {
        if (!this.form.examInfo) {
          this.msgError("请填写审核失败原因");
          return false;
        }
        // 审核失败
        this.form["operateType"] = "0";
        this.form["isexamline"] = "2";
      } else if (obj === "2") {

        // 委托书修改
        this.form["operateType"] = "1";
        this.form["isexamline"] = "0";
      }
      if (obj !== "1") {
        this.shenheSuccess = false
        this.$refs["form"].validate(valid => {
          if (valid) {
            let dictId = this.form.dictId;
            this.form["dictName"] = this.myList.filter(
              item => item.id === dictId
            )[0]['mcheng'];

            let params = this.form;

            if (this.goodsPacking1) {
              params.goodsPacking = this.goodsPacking1;
            }
            if (obj !== "3") {
              params["createusername"] = this.$store.getters.name;
              params["createuserid"] = this.$store.getters.id;
               updateapi(params).then(response => {
                this[obj1]=false
                if (response.code === 200) {
                  // this.msgSuccess(response.msg);
                  const h = this.$createElement;
                  this.$notify({
                    title: '提示：',
                    message: h('i', { style: 'font-style:normal'}, response.msg)
                  });
                  this.shenheSuccess = false
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                  this.shenheSuccess = flase
                }
              }).catch(e=>{
                this.shenheSuccess = flase
              });
            } else {
              if (valid) {
                this.doZhuanDai(params,obj1);
              }

            }
          }else{
            this[obj1]=false
          }
        });
      } else {
        let dictId = this.form.dictId;
        this.form["dictName"] = this.myList.filter(
          item => item.id === dictId
        )[0]['mcheng'];
        let params = this.form;
        if (this.goodsPacking1) {
          params.goodsPacking = this.goodsPacking1;
        }
        if (obj !== "3") {
          params["createusername"] = this.$store.getters.name;
          params["createuserid"] = this.$store.getters.id;

          updateapi(params).then(response => {
            //审核失败,第二次按钮被禁用问题,优化true改为flase,xinyi2020/0923
            this[obj1]=false
            if (response.code === 200) {
              this.msgSuccess("操作成功");
              this.open = false;
              this.innerVisible = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        } else {
          this.doZhuanDai(params,obj1);
        }
      }
    },
    /* 审核弹框中 “导出” 操作 */
    handleExport() {
      let obj = this.form.orderId;
      let orderNum = this.form.orderNumber ? this.form.orderNumber : '暂无托书编号';
      let classEastandwest = this.form.classEastandwest === "0" ? "西向" : "东向";
      let isconsolidation = this.form.isconsolidation === "0" ? "整箱" : "拼箱";

      downLoadExcel(obj).then(response => {
        let blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download =
          orderNum +
          "-" +
          classEastandwest +
          "-" +
          isconsolidation +
          "-" +
          "-托书.docx"; // xxx.xls/xxx.xlsx
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        this.$notify({
          title: "成功",
          message: "导出成功",
          type: "success",
          duration: 2000
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderId = row.orderId || this.ids;
      this.$confirm(
        '是否确认删除订单编号为"' + orderId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return deleteapi(orderId);
        })
        .then((res) => {
          if(res.code === 200){
            this.getList();
            this.msgSuccess("删除成功");
          }else{
            this.msgError(res.msg)
          }
        })
        .catch(function() {});
    },
    /** 取消托书 按钮操作 */
    handleCancelOrder(row) {
      if (
        this.arrs[0].isexamline === "1" ||
        this.arrs[0].isexamline === "3" ||
        this.arrs[0].isexamline === "4"
      ) {
        let cunrrentState = null;
        if (this.arrs[0].isexamline === "0") {
          cunrrentState = "未审核";
        }
        if (this.arrs[0].isexamline === "1") {
          cunrrentState = "已审核通过";
        }
        if (this.arrs[0].isexamline === "2") {
          cunrrentState = "已审核失败";
        }
        if (this.arrs[0].isexamline === "3") {
          cunrrentState = "取消托书";
        }
        if (this.arrs[0].isexamline === "4") {
          cunrrentState = "转待审核中";
        }
        if (this.arrs[0].isexamline === "5") {
          cunrrentState = "草稿";
        }
        // if(this.arrs[0].isexamline === '6'){ cunrrentState='转待审核失败'}
        this.$message.error(
          '请选择"未审核"、"已审核失败"的托书进行操作,当前托书状态:' +
            cunrrentState +
            ",不能执行审核操作。"
        );
        return false;
      }

      const orderId = row.orderId || this.ids[0];
      let params = {
        orderId,
        isexamline: "3",
        createuserid: this.$store.getters.id,
        createusername: this.$store.getters.name
      };

      this.$confirm("是否确认取消托书?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return orderCancelapi(params);
        })
        .then(res => {
          if (res.code === 200) {
            this.getList();
            this.msgSuccess("操作成功");
          } else {
            this.msgError(res.msg);
          }
        })
        .catch(function() {});
    },

    /** 转待原因 弹框打开 **/
    handleZhuanDai_Reason() {
      let params = {
        orderId: this.ids[0]
      };
      examInfoListApi(params).then(res => {
        if (res.code === 200) {
          this.datalist1 = res.rows;
          this.zhuandaiReasonDialog = true;
        } else {
          this.$messgae.error(res.msg);
        }
      });
    },
    /* 转待原因列表数据的获取 */
    getList1() {
      this.dataList1 = [];
    },
    /* 打开 改单费编辑弹框  */
    openGaidan() {
      this.gaidanDialog = true;
    },
    /* 改单费编辑弹框确定按钮 */
    gaidanFn() {
      const params = this.isGaidan; // 是否有改单费字段
      this.gaidanDialog = false;
    },
    /* 舱位号修改 */
    handleCangweiDialog() {
      const id = this.ids;
      this.form1 = this.arrs[0];
      let dccs={
        isconsolidation:this.arrs[0].isconsolidation,
        orderUploadcode:this.arrs[0].orderUploadcode,
      }
      stationList(dccs).then(res=>{
        if(res.code === 200){
          this.changzhanList1=res.rows
        }else{
          this.msgError(res.msg)
        }
      })
      this.cangweiDialog = true;
    },
     /* 箱量修改 */
    handlexlDialog() {
      this.reset();
      const id = this.ids;
      this.form2.orderId = this.arrs[0].orderId;
      this.yscontainerBoxamount=this.arrs[0].containerBoxamount;
      this.xlDialog = true;
    },
    cangweiDialogFn(obj) {
       this.$refs[obj].disabled=true

      let params = {
        createuserid: this.$store.getters.id,
        createusername: this.$store.getters.name,
        orderClassBh: this.form1.orderClassBhEdit,
        orderNumberEdit: this.form1.orderNumberEdit,
        stationid: this.form1.stationid,
        orderId: this.form1.orderId
      };

      orderSpaceEditapi(params).then(res => {
        this.$refs[obj].disabled=false
        if (res.code === 200) {
          this.cangweiDialog = false;
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    xlDialogFn(obj) {
       this.$refs[obj].disabled=true

      let params = {
        createuserid: this.$store.getters.id,
        createusername: this.$store.getters.name,
        containerBoxamount: this.form2.containerBoxamount,
        orderId: this.form2.orderId
      };

      orderxlEditapi(params).then(res => {
        this.$refs[obj].disabled=false
        if (res.code === 200) {
          this.xlDialog = false;
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    checkFailReasonChange(val){
      if(this.form.examInfo == null || this.form.examInfo == 'null'){
        this.form.examInfo = ''
      }
      this.form.examInfo += val
    }
  }
};
</script>
<style scoped>
.orderForm input{
  text-align:left !important;
}
 </style>
 <style>
 .orderForm input{
  text-align:left !important;
}
.detailCss0 {
  color: #1890ff;
  cursor: pointer;
}
.tsisupdateListULCss0 li {
  border-bottom: 1px solid#000;
  height: auto;
  line-height: 35px;
  list-style: none;
}
.xin th > .cell {
  white-space:pre-line;
}
.tsisupdateListULCss0 li.tsisupdateListLICss0 {
  background: #eee;
  border-bottom: none;
}
.red {
  color:red;
}
.noteColor1{
border:5px solid blue;
}
.noteColor1 .el-input__inner{
color:red;font-size:16px;
}
.noteColor2 .el-input__inner{
  color:green;font-size:16px;
}
.preLabel span::before{
  content: ":";
  padding: 0 10px 0 0px;
  }
.preLabel span{
  color: #666;
  word-break: break-word;
}
.tsdialog{
            height:460px !important;
            overFlow:auto;
}
.dtsdialog{
            height:700px !important;
            overFlow:auto;
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


.yan2 .cell {
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
.yan1 .cell {
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
</style>