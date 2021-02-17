<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="85px">
      <el-form-item label="委托书编号" prop="orderNumber" label-width="90px">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班列日期"
                    prop="classDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        v-model.trim="queryParams.classDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
      </el-form-item>
       <el-form-item label="时间段查询"
                    prop="validStartDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        :picker-options="startTimePicker"
                        v-model.trim="queryParams.classDateStart"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
        -
      </el-form-item>
      <el-form-item label=""
                    prop="validEndDate">
        <el-date-picker clearable
                        size="small"
                        style="width: 150px"
                        v-model.trim="queryParams.classDateEnd"
                        type="date"
                        :picker-options="endTimePicker"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
      </el-form-item>

       <el-form-item label>
        <el-input placeholder="请输入内容" v-model.trim="gdVal" clearable class="input-with-select">
          <el-select v-model.trim="gdLabel" slot="prepend" placeholder="请选择" style="width:100px;">
            <el-option label="班列号" value="0" />
            <el-option label="班列编号" value="1" />
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item label="上货站">
         <el-select v-model.trim="queryParams.orderUploadcode" filterable clearable >
           <el-option
             v-for="(item,index) in siteListCollectList"
             :key="index"
             :label="item.nameCn"
             :value="item.code"
            ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="下货站">
        <el-select v-model.trim="queryParams.orderUnloadcode" filterable clearable>
           <el-option
             v-for="(item,index) in siteListCollectList"
             :key="index"
             :label="item.nameCn"
             :value="item.code"
           ></el-option>
         </el-select>
      </el-form-item>

       <el-form-item label="线路" prop="lineTypeid">
            <el-select v-model.trim="queryParams.lineTypeid" placeholder="请选择" clearable size="small">
              <el-option label="-请选择-" value />
              <el-option label="中欧" value="0" />
              <el-option label="中亚" value="2" />
              <el-option label="中越" value="3" />
              <el-option label="中俄" value="4" />
            </el-select>
      </el-form-item>
      <el-form-item label="操作代理" prop="station" label-width="90px">
        <el-input
          v-model.trim="queryParams.station"
          placeholder="请输入操作代理"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 国内外客户，0是国内，1国外 -->
      <el-form-item label="订单状态" prop="isexamline">
        <el-select v-model.trim="queryParams.isexamline" placeholder="-请选择-" clearable size="small">
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

       <el-form-item label="拼/整箱" prop="isconsolidation">
            <el-select
              v-model.trim="queryParams.isconsolidation"
              placeholder="-请选择-"
              clearable
              size="small"
            >
              <el-option label="拼箱" value="1" />
              <el-option label="整箱" value="0" />
            </el-select>
      </el-form-item>

      <el-form-item label="往返" prop="classEastandwest">
            <el-select
              v-model.trim="queryParams.classEastandwest"
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option label="西向" value="0" />
              <el-option label="东向" value="1" />
            </el-select>
      </el-form-item>

      <el-form-item label="跟单员" prop="orderMerchandiser">
            <el-input
              v-model.trim="queryParams.orderMerchandiser"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
      </el-form-item>

      <i class="el-icon-circle-plus" v-if="!moreQueryParams" @click="moreQueryParams=true"></i>
      <!-- 展开更多查询条件 -->
      <el-collapse-transition>
        <div v-if="moreQueryParams">
           <el-form-item label="跟单员工号" prop="orderMerchandiserNumber">
            <el-input
              clearable
              size="small"
              v-model.trim="queryParams.orderMerchandiserNumber"
              @keyup.enter.native="handleQuery"
            />
      </el-form-item>

       <el-form-item label="推荐人" prop="clientTjr">
        <el-input
          v-model.trim="queryParams.clientTjr"
          placeholder="请输入推荐人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="订舱方" prop="clientUnit">
            <el-input
              v-model.trim="queryParams.clientUnit"
              placeholder="请输入订舱方"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
     </el-form-item>

      <el-form-item label="发货方" prop="shipOrederName">
            <el-input
              placeholder="请输入发货方"
              clearable
              size="small"
              v-model.trim="queryParams.shipOrederName"
              @keyup.enter.native="handleQuery"
            />
     </el-form-item>

      <el-form-item label="送货方" prop="receiveOrderName">
            <el-input
              placeholder="请输入送货方"
              clearable
              size="small"
              v-model.trim="queryParams.receiveOrderName"
              @keyup.enter.native="handleQuery"
            />
     </el-form-item>

      <el-form-item label="货物品名" prop="goodsName">
            <el-input
              v-model.trim="queryParams.goodsName"
              placeholder="请输入货物品名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
      </el-form-item>
      <!-- 去程提箱地 -->
       <el-form-item label="提箱地点" prop="shipFhSite" v-if="queryParams.classEastandwest === '0'">
            <el-input
              placeholder="请输入提箱地点"
              clearable
              size="small"
              v-model.trim="queryParams.shipFhSite"
              @keyup.enter.native="handleQuery"
            />
      </el-form-item>
      <!-- 回程提箱地 -->
       <el-form-item label="提箱地点" prop="shipHyd" v-if="queryParams.classEastandwest === '1'">
            <el-input
              placeholder="请输入提箱地点"
              clearable
              size="small"
              v-model.trim="queryParams.shipFhSite"
              @keyup.enter.native="handleQuery"
            />
      </el-form-item>

      <el-form-item label="还箱地点" prop="receiveHxAddress">
            <el-input
              v-model.trim="queryParams.receiveHxAddress"
              placeholder="请输入还箱地点"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
      </el-form-item>

      <el-form-item label="是否ZIH提货" prop="shipOrderBinningway" label-width="120px">
          <el-select
              v-model.trim="queryParams.shipOrderBinningway"
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option label="是" value="0" />
              <el-option label="否" value="1" />
            </el-select>
      </el-form-item>

      <el-form-item label="是否ZIH送货" prop="receiveOrderIspart" label-width="120px">
          <el-select
              v-model.trim="queryParams.receiveOrderIspart"
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
      </el-form-item>

      <el-form-item label="是否可提前班列" prop="putoffClass" label-width="120px">
          <el-select
              v-model.trim="queryParams.putoffClass"
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option label="是" value="0" />
              <el-option label="否" value="1" />
            </el-select>
      </el-form-item>

      <el-form-item label="订单来源" prop="yuyan">
            <el-select v-model.trim="queryParams.yuyan" placeholder="请选择" clearable size="small">
              <el-option label="-请选择-" value />
              <el-option label="国内订单" value="0" />
              <el-option label="国外订单" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="提货方式" prop="shipThTypeId">
            <el-select v-model.trim="queryParams.shipThTypeId" placeholder="请选择" clearable size="mini">
            <el-option label="整柜到堆场" value="0"/>
            <el-option label="散货到堆场" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="自送货方式" prop="shipZsTypeId">
          <el-select v-model.trim="queryParams.shipZsTypeId" placeholder="请选择" clearable size="mini">
          <el-option label="整柜到堆场" value="1"/>
          <el-option label="散货到堆场" value="0"/>
          </el-select>
          </el-form-item>


          <i class="el-icon-remove" v-if="moreQueryParams" @click="moreQueryParams=false"></i>
          <!-- 收起更多查询条件 -->
        </div>
      </el-collapse-transition>

      <el-form-item>
        <el-button
          v-hasPermi="['order:shippingorder:listCollect']"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
        <el-button
          v-hasPermi="['order:shippingorder:export']"
          type="success"
          size="mini"
          @click="exportFn"
        >托书汇总表导出</el-button>
        <el-button
          v-hasPermi="['order:shippingorder:scExport']"
          type="success"
          size="mini"
          @click="scExportFn"
        >随车组导出</el-button>
      </el-form-item>


    </el-form>

    <el-table
      v-loading="loading"
      :class="this.heightScreen===590?'x1 orderTable':'x2 orderTable'"
      :data="list"
      border
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      @row-click="handleRow"
      :height="heightScreen"
    >
      <el-table-column type="selection"  fixed="left" />
      <!-- <el-table-column label="委托书编号" width="140" prop="orderNumber" fixed="left" align="center" /> -->
      <el-table-column label="委托书编号" width="95" prop="orderNumber" fixed="left">
      <template slot-scope="scope">
        <span @click="handleDetail(scope.row)" style="cursor:pointer;text-decoration: underline;">
          {{scope.row.orderNumber}}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdate" fixed="left">
        <template slot-scope="scope">
          <span style="cursor:pointer;text-decoration: underline;" @click="handleDetail(scope.row)">{{scope.row.createdate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="托书状态" align="center" prop="isexamline" width="80" fixed="left">
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
      <el-table-column label="推荐人" align="center" prop="clientTjr" fixed="left">
        <template slot-scope="scope">
          <span style="cursor:pointer;">{{scope.row.clientTjr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="跟单员" align="center" prop="orderMerchandiser" fixed="left"/>
      <el-table-column label="箱量" align="center" prop="containerBoxamount" />
      <el-table-column label="箱型" align="center" prop="containerType" />
      <el-table-column label="提箱地" align="center" prop="shipFhSite" />
      <el-table-column label="还箱地" align="center" prop="receiveHxAddress" />
      <el-table-column label="货物品名" align="center" prop="goodsName" />
      <el-table-column label="发货方" align="center" prop="shipOrederName" />
      <el-table-column label="收货方" align="center" prop="receiveOrderName" />
      <el-table-column label="上货站" align="center" prop="orderUploadsite" />
      <el-table-column label="下货站" align="center" prop="orderUnloadsite" />
      <el-table-column label="下货站" align="center" prop="orderUnloadsite" />
      <!-- <el-table-column label="操作代理" align="center" prop="" /> -->
      <el-table-column label="是否分拨" align="center" prop="receiveOrderIspart" >
        <template slot-scope="scope">
          <span v-if="scope.row.receiveOrderIspart === '0'">否</span>
          <span v-else-if="scope.row.receiveOrderIspart === '1'">是</span>
        </template>
      </el-table-column>
      <el-table-column label="送货方式" align="center" prop="distributionType"/>
      <el-table-column label="代理清关" align="center" prop="receiveOrderIsclearance" >
        <template slot-scope="scope">
          <span v-if="scope.row.receiveOrderIsclearance === '0'">否</span>
          <span v-else-if="scope.row.receiveOrderIsclearance === '1'">是</span>
        </template>
      </el-table-column>
      <el-table-column label="国内Hscode" align="center" prop="goodsReport" />
      <el-table-column label="国外Hscode" align="center" prop="goodsClearance" />
      <el-table-column label="外包装形式" align="center" prop="goodsPacking" />
      <!-- <el-table-column label="件数" align="center" prop="goodsPacking" /> -->
      <el-table-column label="规格" align="center" prop="goodsStandard" >
        <template slot-scope="scope">
          <div v-for="item in scope.row.goodsStandards">
            <span>{{item}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单件重量" align="center" prop="oneWeight">
        <template slot-scope="scope">
          <div v-for="item in scope.row.oneWeights">
            <span>{{item}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否可堆叠" align="center" prop="goodsCannotpileup" >
        <template slot-scope="scope">
          <span v-if="scope.row.goodsCannotpileup === '0'">否</span>
          <span v-else-if="scope.row.goodsCannotpileup === '1'">是</span>
          <span v-else-if="scope.row.goodsCannotpileup === '2'">仅可自叠</span>
        </template>
      </el-table-column>
      <el-table-column label="毛重（kg）" align="center" prop="goodsKgs" />
      <el-table-column label="体积（m3）" align="center" prop="goodsCbm" />
      <el-table-column label="是否需要装箱方案" align="center" prop="goodsIsscheme" >
        <template slot-scope="scope">
          <span v-if="scope.row.goodsIsscheme === '1'">否</span>
          <span v-else-if="scope.row.goodsIsscheme === '0'">是</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可提前班列" align="center" prop="putoffClass" >
        <template slot-scope="scope">
          <span v-if="scope.row.putoffClass == 1">否</span>
          <span v-else-if="scope.row.putoffClass == 0">是</span>
        </template>
      </el-table-column>
      <el-table-column label="在途信息接收邮箱" align="center" prop="receiveOrderReceiveemail" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改托书或审核托书，共用此对话框 -->
    <el-dialog :title="title" :visible.sync="open" v-if="open" width="100%">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px" :disabled="formDisabled">

        <h5 class="h5Css1">班列信息</h5>
        <div class="graycss0">
          <el-row>
            <el-col :span="10">
              <el-form-item label="委托书编号">
                <el-input v-model.trim="form.orderNumber" @change="getInfoByBhFn()" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
            <el-col :span="12">
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
            <el-col :span="12">
              <el-form-item label="往返">
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
              </el-form-item>
            </el-col>
            <el-col :span="12" />
          </el-row>

          <el-row>
            <el-col :span="10">

              <el-form-item label="上货站">
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
            <el-col :span="12">
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

            <el-col :span="12" v-if="(pzqh === '1') || (pzqh === '3')">
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


            <el-col v-if="(pzqh === '1') || (pzqh === '3')" :span="10">
              <el-form-item label="开行班列">
                <el-input v-model.trim="form.lineName" placeholder="请输入开行班列" :disabled="true" />
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
            <el-col :span="12">
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
            <el-col :span="12">
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
          </el-row>

          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1') " :span="23" :offset="1">
              <el-form-item label="可堆叠(货物属性)" prop="goodsCannotpileup">
                <el-radio v-model.trim="form.goodsCannotpileup" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsCannotpileup" :disabled="true" label="0">否</el-radio>
                <span class="msgSpancss0 redTxt">提示：货物高度不足1.8米按1.8米算，超过1.8米以实际高度为准.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="23" :offset="1">
              <el-form-item label="易碎品(货物属性)" prop="goodsFragile">
                <el-radio v-model.trim="form.goodsFragile" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsFragile" :disabled="true" label="0">否</el-radio>
                <span class="msgSpancss0 redTxt">提示：结算体积按照测量体积的1.3倍计算.</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="23" :offset="1">
              <el-form-item label="单件超长超重" prop="goodsGeneral">
                <el-radio v-model.trim="form.goodsGeneral" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsGeneral" :disabled="true" label="0">否</el-radio>
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
            <el-col :span="12">
              <el-form-item label="箱量" prop="containerBoxamount">
                <el-input v-model.trim="form.containerBoxamount" :disabled="true">
                  <template slot="append">*</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="箱型" prop="containerType">
                <el-input v-model.trim="form.containerType" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="10">
              <el-form-item label="报关地点" prop="clientOrderBindingaddress" v-if="form.classEastandwest === '0' || (form.lineTypeid !== '3' && form.classEastandwest === '1')">
                <el-radio v-if="form.classEastandwest === '0'" v-model.trim="form.clientOrderBindingaddress.trim()" label="郑州">郑州</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '汉堡')" v-model.trim="form.clientOrderBindingaddress.trim()" label="汉堡">汉堡</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '慕尼黑')" v-model.trim="form.clientOrderBindingaddress.trim()" label="慕尼黑">慕尼黑</el-radio>
                <el-radio v-model.trim="form.clientOrderBindingaddress.trim()" label="属地">属地</el-radio>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="业务编号">
                <el-input v-model.trim="form.ywNumber" placeholder="请输入业务编号" />
                <span class="msgSpancss0 redTxt">（提示：如有需要，可在此填写业务编号）</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="委托ZIH报关" prop="clientOrderBindingway">
                <el-radio v-model.trim="form.clientOrderBindingway" label="0">是</el-radio>
                <el-radio
                  v-if="(pzqh === '1') || (pzqh === '3')"
                  v-model.trim="form.clientOrderBindingway"
                  label="1"
                >否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="form.clientOrderBindingway === '0'" :span="12">
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
            <el-col :span="12">
              <el-form-item label="发货方(中英文)" prop="shipOrederName">
                <el-input v-model.trim="form.shipOrederName" placeholder="请输入发货方(中英文)" />

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
            <el-col :span="12">
              <el-form-item label="联系电话" prop="shipOrederPhone">
                <el-input v-model.trim="form.shipOrederPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="通讯地址(中英文)" prop="shipOrederAddress">
                <el-input v-model.trim="form.shipOrederAddress" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10">
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
            <el-col v-if="(pzqh === '0') || (pzqh === '1')" :span="10">
              <el-form-item label="联系人(中英文)" prop="shipOrderUnloadcontacts">
                <el-input v-model.trim="form.shipOrderUnloadcontacts" placeholder="请输入联系人(中英文)" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="联系方式" prop="shipOrderUnloadway">
                <el-input v-model.trim="form.shipOrderUnloadway" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="联系邮箱" prop="shipOrderUnloadwayEmail">
                <el-input v-model.trim="form.shipOrderUnloadwayEmail" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货方式" prop="shipThTypeId">
                <el-radio v-model.trim="form.shipThTypeId" label="0" v-if="(pzqh === '2') || (pzqh === '3')">整箱到车站</el-radio>
                <el-radio v-model.trim="form.shipThTypeId" label="1" >散货到堆场</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货时间" prop="shipOrderUnloadtime">
                 <el-date-picker v-model.trim="form.shipOrderUnloadtime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH" value-format="yyyy-MM-dd HH:00:00"  />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货地址" prop="shipOrderUnloadaddress">
                <el-input v-model.trim="form.shipOrderUnloadaddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="(pzqh === '0') || (pzqh === '2')">
              <el-form-item label="详细地址" >
                <el-input v-model.trim="form.detailedAddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货费用">
                <el-input v-model.trim="form.shipThCost" placeholder :disabled="true" >
                  <template slot="append" v-if="form.zxThcostCurrency === '$'">*[美金]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '￥'">*[人民币]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '€'">*[欧元]</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货费报价编号">
                <el-input v-model.trim="form.shipThCostNo" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.shipOrderBinningway === '1'">
            <el-col :span="10">
              <el-form-item label="自送货时间" prop="shipOrderSendtime">
                <el-date-picker v-model.trim="form.shipOrderSendtime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH" value-format="yyyy-MM-dd HH:00:00" />
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10">
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
            <el-col :span="12">
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
            <el-col :span="12">
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
            <el-col :span="12">
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
            <el-col :span="10" v-if="form.receiveOrderIspart === '1'">
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
            <el-col :span="10">
              <el-form-item label="Email" prop="receiveOrderZihemail">
                <el-input v-model.trim="form.receiveOrderZihemail" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="送货地址(中英文)" prop="receiveOrderPartaddress">
                <el-input v-model.trim="form.receiveOrderPartaddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="送货详细地址(中英文)" prop="detailedAddress">
                <el-input v-model.trim="form.detailedAddress" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="电话" prop="receiveOrderZihtel">
                <el-input v-model.trim="form.receiveOrderZihtel" placeholder />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="送货费用">
                <el-input v-model.trim="form.receiveShCost" placeholder :disabled="true" />
                <el-radio v-if="pzqh == '1' || pzqh == '3'" v-model.trim="form.shCostcurrency" :disabled="true" label="￥">人民币</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="$">美金</el-radio>
                <el-radio v-if="pzqh == '0' || pzqh == '2'" v-model.trim="form.shCostcurrency" :disabled="true" label="€">欧元</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
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
            <el-col :span="10">
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
            <el-col :span="4">
              <el-form-item label="到站提箱公司" >
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="中文发货人" prop="consignorc" >
                <el-input v-model.trim="form.consignorc" placeholder="请输入中文发货人" />
              </el-form-item>
              <el-form-item label="发货人声明" >
                <el-input v-model.trim="form.econsignorstate" placeholder="" />
              </el-form-item>
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
            <el-col :span="12">
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
            <el-col :span="12" v-if="pzqh === '0' || pzqh === '2'">
              <el-form-item label="国内报关HS" prop="goodsInReport">
                <el-input v-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '0'" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '1'" class="noteColor1" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else-if="(currentFormStatus === 'shenhe' || currentFormStatus === 'detailInfo') && form.noteColor === '2'" class="noteColor2" v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
                <el-input v-else v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="pzqh === '1' || pzqh === '3'">
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

            <el-col :span="12">
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
            <el-col :span="12">
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

           <template v-if="goodsList.length">
              <el-col :span="24">
                <el-divider content-position="left">货物规格信息</el-divider>
              </el-col>
              <el-col v-for="(goodsItem,index) in goodsList" :key="index" :span="24">
                <el-col :span="4">
                  <!-- 数量 -->
                  <el-form-item class="preLabel" label="数量">
                    <span>{{ goodsItem.goodsAmount }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <!-- 长度 -->
                  <el-form-item class="preLabel" label="长(cm)">
                    <span>{{ goodsItem.goodsLength }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <!-- 宽度 -->
                  <el-form-item class="preLabel" label="宽(cm)">
                    <span>{{ goodsItem.goodsWidth }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <!-- 高度 -->
                  <el-form-item class="preLabel" label="高(cm)">
                    <span>{{ goodsItem.goodsHeight }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- 重量 -->
                  <el-form-item class="preLabel" label="单件重量(kg)">
                    <span>{{ goodsItem.goodsWeight }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-divider />
                </el-col>
              </el-col>
            </template>
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
      <el-dialog width="30%" title="审核失败原因" :visible.sync="innerVisible" append-to-body>
        <el-row>
          <el-col :span="20">
            <el-input v-model.trim="form.examInfo" type="textarea" :autosize="{ minRows: 2}" />
          </el-col>
          <el-col :span="2" :offset="9">
            <el-button type="primary" :disabled="shenheFail" ref="shenheFail" @click="submitForm('1','shenheFail')">确 定</el-button>
          </el-col>
        </el-row>
      </el-dialog>


      <!-- 委托书查看详情 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'detailInfo'" slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
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



  </div>
</template>

<script>
import {
  listCollect,
  detailapi,
  orderListMy,
  getSiteByOrderId,
  historyEditRecord,
  examInfoListApi,
  boxAmountTotal,
  stationList,
  exportOrders,
  scExportOrders,
  siteListCollect,
  goodsInfo
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



export default {
  name: 'Orders',
  data() {
    return {
      title1:'',
      zhuandaiAudit:false,
      shenheFail:false,
      shenheSuccess:false,
      editOrder:false,

      baoguanAddressW:'',
      baoguanAddressE:'',
      classesDialog: false,
      arrs1: [],
      // 非单个禁用
      single1: true,
      // 非多个禁用
      multiple1: true,

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
         distributionType: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          }
        ],
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
        validStartDate:null,
        validEndDate:null,
        deptCode: null,
        pageNum: 1,
        pageSize: 10,
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
        shipThTypeId:null,
        shipZsTypeId:null,
        isphone: null,
        shipOrderBinningway: null,
        receiveOrderIspart: null,
        isupdate: null,
        goodsName: null,
        organizationCode: null,
        siteCode: null
      },
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
      form1: {
        val1: ""
      },
      myList: [], //贸易方式 列表数据
      goodsPacking1: null, // 最外层包装形式 输入框值
      sitelistupList: [], //上货站
      sitelistdownList: [], //下货站
      isupdateList: null, // 修改记录
      isupdateListDialog: false, // 修改记录弹框
      classesList: [], // 可选择的班列列表
      txAddressList: [],
      hxAddressList: [],
      gdLabel: "0",
      gdVal: null,
      innerVisible: false,
      examInfo: null,
      changzhanList:[], //场站数据
      disabledStr:'', // N-1中午12：00前后可编辑字段状态值
      goodsList:[],
      heightScreen:null,
      siteListCollectList:[],
    };
  },
  computed: {
    startTimePicker () {
      return {
        disabledDate: time => (this.queryParams.validEndDate ? time.getTime() > new Date(this.queryParams.validEndDate).getTime() : false),
      };
    },
    endTimePicker () {
      return {
        disabledDate: time => (this.queryParams.validStartDate ? time.getTime() < new Date(this.queryParams.validStartDate).getTime() : false),
      };
    },
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
    this.siteListCollectFn()
    this.getList();
    this.orderListMyFn();
  },
  mounted() {
     if(window.screen.height >800){
        this.heightScreen = 590
      }else{
        this.heightScreen = 470
      }
  },
  methods: {
    // 获取查询条件中的上下货站
    siteListCollectFn(){
      siteListCollect().then(res=>{
        this.siteListCollectList=res.rows
      })
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
    exportFn(){
    const queryParams = this.queryParams;
    this.queryParams.pageNum = null
    this.queryParams.pageSize = null
      this.$confirm("是否确认导出?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportOrders(queryParams);
        })
        .then(response => {
          if(response.code == 200){
          this.download(response.msg)
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
          } else {
            this.$notify({
            title: "失败",
            message: response.msg,
            type: "error",
            duration: 2000
          });
          }
          

        })
        .catch(function() {});
    },
    // 导出随车组托书汇总表
    scExportFn(){
    const queryParams = this.queryParams;
      this.$confirm("是否确认导出?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return scExportOrders(queryParams);
        })
        .then(response => {
          let blob = new Blob([response], {
          type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });

          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = "随车组导出.xls"; // xxx.xls/xxx.xlsx
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          });

        })
        .catch(function() {});
    },
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

    classSubmit() {
      this.form["classId"] = this.arrs1[0].classId;
      this.form["classDate"] = this.arrs1[0].classStime;
      this.form["orderClassBh"] = this.arrs1[0].classBh;
      this.form["classNumber"] = this.arrs1[0].classNumber;

      this.classesDialog = false;
    },

    // 修改记录弹框列表数据获取
    handleisupdateDetail(obj,obj1) {
      if(obj1 == '0'){
          this.title1='委托书审核失败原因'
          detailapi(obj.orderId).then(res=>{
              let str=!!res.data.examInfo?res.data.examInfo:'暂无数据'
              this.isupdateList=[{title:str}]
              this.isupdateListDialog = true;
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



    /** 查询客户管理列表 */
    getList() {
      this.loading = false;
      listCollect(this.queryParams).then(res => {
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.arrs = selection.map(item => item);
      this.ids = selection.map(item => item.orderId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
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


    /* 下载附件弹框 列表数据的获取 */
    getList0() {
      this.dataList0 = [];
    },


    handleDetail(obj) {
      this.handleShenhe(obj, "托书详情");
      this.currentFormStatus = "detailInfo";
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
        if(this.currentFormStatus !== "detailInfo"){
          this.getInfoByBhFn()
        }
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
    }

  }
};
</script>
<style>
.detailCss0 {
  color: #1890ff;
  cursor: pointer;
}
.isupdateListULCss0 li {
  border-bottom: 1px solid#000;
  height: auto;
  line-height: 35px;
  list-style: none;
}
.orderTable th > .cell {
  white-space:nowrap;
}
.isupdateListULCss0 li.isupdateListLICss0 {
  background: #eee;
  border-bottom: none;
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


.x2 .cell {
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
.x1 .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 27px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}
</style>
