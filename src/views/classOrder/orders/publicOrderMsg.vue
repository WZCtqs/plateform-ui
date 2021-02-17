<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
          <el-form-item label="委托书编号" prop="orderNumber" >
            <el-input
              v-model.trim="queryParams.orderNumber"
              placeholder="请输入委托书编号"
              style="width: 220px"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
       
          <el-form-item label="订舱方" prop="clientUnit" label-width="60px">
            <el-input
              v-model.trim="queryParams.clientUnit"
              placeholder="请输入订舱方"
              clearable
              size="mini"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
       
          <el-form-item label="是否委托ZIH提货" prop="shipOrderBinningway"  label-width="120px">
            <el-select v-model.trim="queryParams.shipOrderBinningway" placeholder="请选择" clearable style="width: 90px" size="mini">
              <el-option label="-请选择-" value />
              <el-option label="是" value="0" />
              <el-option label="否" value="1" />
            </el-select>
          </el-form-item>
         
          <el-form-item label="托书状态" prop="isexamline" >
            <el-select v-model.trim="queryParams.isexamline" placeholder="-请选择-" clearable style="width: 160px" size="mini">
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
       
           <el-form-item label="修改状态" prop="changeType">
            <el-select v-model.trim="queryParams.changeType" placeholder="请选择" style="width: 110px" clearable size="mini">
              <el-option label="-请选择-" value />
              <el-option label="发车前更改" value="0" />
              <el-option label="发车后更改" value="1" />
            </el-select>
          </el-form-item>
      
          <el-form-item label="整/拼箱" prop="isconsolidation" label-width="60px">
            <el-select v-model.trim="queryParams.isconsolidation" placeholder="请选择" style="width: 90px" clearable size="mini">
              <el-option label="-请选择-" value />
              <el-option label="整箱" value="0" />
              <el-option label="拼箱" value="1" />
            </el-select>
          </el-form-item>

          
        
           <el-form-item label="班列日期" prop="classDate" >
                <el-date-picker
                  @focus="disabledStr='0'"
                  v-model.trim="queryParams.classDate"
                  type="date"
                  :disabled="disabledStr === '1' || disabledStr === '2'"
                  placeholder="选择日期"
                  style="width: 140px"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  >
              </el-date-picker>
           </el-form-item>
            <el-form-item label="方向" prop="classEastandwest" label-width="50px">
               <el-select @change="disabledStr='0'" v-model.trim="queryParams.classEastandwest" placeholder="请选择" style="width: 90px" clearable size="mini" :disabled="disabledStr === '1' || disabledStr === '2'">
                <el-option label="-请选择-" value />
                <el-option label="西向" value="0" />
                <el-option label="东向" value="1" />
              </el-select>
           </el-form-item>
            <el-form-item label="西向(N-4)" prop="classDateFour" >
                <el-date-picker
                  @focus="disabledStr='1'"
                  v-model.trim="queryParams.classDateFour"
                  type="date"
                  placeholder="选择日期"
                  style="width: 140px"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="disabledStr === '0' || disabledStr === '2'">
              </el-date-picker>
           </el-form-item>

            <el-form-item label="东向(N-5)" prop="classDateFive" >
               <el-date-picker
                   @focus="disabledStr='2'"
                  v-model.trim="queryParams.classDateFive"
                  type="date"
                  placeholder="选择日期"
                  style="width: 140px"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="disabledStr === '0' || disabledStr === '1'">
              </el-date-picker>
           </el-form-item>

           <el-form-item label="路线" prop="lineTypeid">
            <el-select v-model.trim="queryParams.lineTypeid" placeholder="请选择" style="width:90px;" clearable size="mini">
              <el-option label="-请选择-" value />
              <el-option label="中欧" value="0" />
              <el-option label="中亚" value="2" />
              <el-option label="中越" value="3" />
              <el-option label="中俄" value="4" />
            </el-select>
          </el-form-item>
  
           <el-form-item>
            <el-button type="primary" icon="el-icon-search" v-hasPermi="['classOrder:publicOrderMsg:query']" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleEdit"
              v-hasPermi="['classOrder:publicOrderMsg:edit']"
            >编辑</el-button>
          </el-form-item>
         
      </el-form>
     

    <el-table
      v-loading="loading"
       :class="this.heightScreen===600?'x11 xy':'x22 xy'"
      :data="list"
      border
       ref="multipleTable"
      @selection-change="handleSelectionChange"
      @row-click="handleRow"
      :height="heightScreen"
    >
      <el-table-column type="selection"  align="center"  />
      <el-table-column label="委托书编号" align="center" >
        <template slot-scope="scope">
          <a @click="handleDetail(scope.row)" class="cursorColumn"> {{scope.row.orderNumber}} </a>
        </template>
      </el-table-column>
      <el-table-column label="班列日期" align="center" >
        <template slot-scope="scope">
          <span v-if="scope.row.classDate && scope.row.classDate.length >9">{{scope.row.classDate.substring(0,10)}}</span>
          <span v-else> {{scope.row.classDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核日期" align="center" prop="examDate"   />
     
      <el-table-column label="托书状态" align="center" prop="change" >
         <template slot-scope="scope">
          <span v-if="scope.row.isexamline === '0'">未审核</span>
          <span v-else-if="scope.row.isexamline === '1'">已审核通过</span>
          <span v-else-if="scope.row.isexamline === '2'">已审核未通过</span>
          <span v-else-if="scope.row.isexamline === '3'">已取消的委托</span>
          <span v-else-if="scope.row.isexamline === '4'">转待审核</span>
          <span v-else-if="scope.row.isexamline === '5'">草稿</span>
          <span v-else-if="scope.row.isexamline === '6'">转待失败</span>
          <span v-else-if="scope.row.isexamline === '7'">箱管部未审核</span>
          <span v-else-if="scope.row.isexamline === '8'">箱管部审核失败</span>
          <span v-else-if="scope.row.isexamline === '9'">报价中</span>
          <span v-else-if="scope.row.isexamline === '10'">客户确认中</span>
          <span v-else-if="scope.row.isexamline === '11'">公路审核中</span>
          <span v-else-if="scope.row.isexamline === '12'">集疏审核中</span>
          <span v-else-if="scope.row.isexamline === '13'">撤舱待审核</span>
          <span v-else>{{scope.row.isexamline}} </span>
        </template>
      </el-table-column>
       <el-table-column label="状态" align="center" prop="change" >
         <template slot-scope="scope">
          <span v-if="scope.row.changeType === '0'">发车前更改</span>
          <span v-if="scope.row.changeType === '1'"> 发车后更改</span>
        </template>
      </el-table-column>
      
       <el-table-column label="驳回原因" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <span v-if="!!scope.row.refuseInfo">{{scope.row.refuseInfo}}</span>
          <span v-if="!scope.row.refuseInfo">暂无</span>
        </template>
      </el-table-column>
       <el-table-column label="箱管驳回原因" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <span v-hasPermi="['classOrder:publicOrderMsg:edit']" style="color:#f00;cursor:pointer;" v-if="!!scope.row.xgRefuseInfo && scope.row.isread === '0'" @click="bohuiReason(scope.row)">未读</span>
          <span v-hasPermi="['classOrder:publicOrderMsg:edit']" style="color:green;cursor:pointer;" v-if="!!scope.row.xgRefuseInfo && scope.row.isread === '1'" @click="bohuiReason(scope.row)">已读</span>
          <span v-if="!scope.row.xgRefuseInfo">暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="转待修改记录" align="center" prop="editRecord">
       <template slot-scope="scope">
         <span v-if="scope.row.editRecord" class="detailCss0" @click="handlezdupdateDetail(scope.row)" style="cursor:pointer;">详情</span>
         <span v-else>无</span>
        </template> 
      </el-table-column>
      <el-table-column label="修改记录" align="center" prop="isupdate">
         <template slot-scope="scope">
           <!-- {{scope.row.isupdate}} -->
         <span v-if="scope.row.isupdate === '0'">无</span>
         <span v-if="scope.row.isupdate === '1'" class="detailCss0" @click="handleisupdateDetail(scope.row)" style="cursor:pointer;">详情</span>
        </template>
      </el-table-column>
       <el-table-column label="申请原因" align="center" prop="examInfo" />
      <el-table-column label="订舱组备注信息(注意事项)" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 编辑 弹框 -->
    <el-dialog :title="title1" :visible.sync="open1" width="45%">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="180px">
          <h5 class="h5Css0">转待审核</h5>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="备注信息" prop="isNormal">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2}"
                      placeholder="请输入转待原因"
                      v-model.trim="form1.examinfo"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
      </el-form>
     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">提 交</el-button>
        <el-button @click="cancel1">关 闭</el-button>
      </div>
    
    </el-dialog>

    <!-- 托书详情 对话框 -->
     <el-dialog :title="title" :visible.sync="open" width="100%">
           <el-form ref="form" :model="form" :rules="rules" label-width="180px" :disabled="formDisabled">

        <!-- <el-form-item>
          <el-radio v-model.trim="pzqh" label="0">拼箱西向</el-radio>
          <el-radio v-model.trim="pzqh" label="1">拼箱东向</el-radio>
          <el-radio v-model.trim="pzqh" label="2">整柜西向</el-radio>
          <el-radio v-model.trim="pzqh" label="3">整柜东向</el-radio>
          {{ pzqh === '0' }} ***
          {{ pzqh === '1' }} ***
          {{ (pzqh === '0') || (pzqh === '1') }}
        </el-form-item> -->

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
                <el-input v-model.trim="form.orderNumber" />
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

                <!-- <span
                  style="cursor:pointer;"
                  v-if="this.form.isexamline === '0' || this.form.isexamline === '2' || this.form.isexamline === '6' || this.form.isexamline === '3' || this.form.isexamline === '5'"
                >修改班列</span> -->
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
              <el-form-item label="堆场地址">
                <el-select v-model.trim="form.stationid" filterable clearable :disbled="true">
                  <el-option value>-请选择-</el-option>
                  <el-option
                    v-for="(item,index) in changzhanList"
                    :key="index"
                    :label="item.station"
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
                <!-- <el-radio v-model.trim="form.goods_cannotPileUp" label="2">仅可自堆叠</el-radio> -->
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
                  label="2"
                >自备铁路箱</el-radio>
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
            <el-col v-if="form.clientOrderBindingway === '0'" :span="12">
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
              <el-form-item label="报关地点" prop="clientOrderBindingaddress">
                 <el-radio v-if="form.classEastandwest === '0'" v-model.trim="form.clientOrderBindingaddress" label="郑州">郑州</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '汉堡')" v-model.trim="form.clientOrderBindingaddress" label="汉堡">汉堡</el-radio>
                <el-radio v-if="form.classEastandwest === '1' && (form.lineTypeid === '0') && (form.orderUploadsite === '慕尼黑')" v-model.trim="form.clientOrderBindingaddress" label="慕尼黑">慕尼黑</el-radio>
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="属地">属地</el-radio>
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
              <!-- 1、由ZIH提货：是，提货方式是：整箱到车站 -->
              <!-- 2、箱属：委托zih，由ZIH提货：否，提货方式是：整箱到车站 -->
              <template
                v-if="(form.shipOrderBinningway === '0' && form.shipThTypeId === '0') || (form.shipOrderBinningway === '1' && form.shipThTypeId === '0' && form.orderAuditBelongto === '0')"
              >
                <template>
                  <el-col :span="16">
                    <el-form-item label="提箱地" prop="shipHyd">
                      <span v-if="pzqh === '0' || pzqh === '2'"> {{form.shipHyd}}</span>
                      <span v-if="pzqh === '0' || pzqh === '2'"> {{form.shipFhSite}}</span>
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
                <el-input v-model.trim="form.shipThCost" placeholder :disabled="true" />
               
                  <template slot="append" v-if="form.zxThcostCurrency === '0'">*[美金]</template>
                  <template slot="append" v-if="form.zxThcostCurrency === '1'">*[人民币]</template>
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
              <el-form-item label="邮箱" prop="receiveOrderMail">
                <el-input v-model.trim="form.receiveOrderMail" placeholder="请输入邮箱" />
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
                <el-radio v-model.trim="form.qgCostcurrency"  label="人民币">*人民币</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="由ZIH代理分拨" prop="receiveOrderIspart">
                <el-radio v-model.trim="form.receiveOrderIspart" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.receiveOrderIspart" :disabled="true" label="0">否</el-radio>
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
                 <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="￥">人民币</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="$">美金</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="€">欧元</el-radio>
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
             2、由ZIH代理分拨：是
             3、整柜-->
          <el-row
            v-if="(form.receiveOrderIspart === '1') && (pzqh === '2' || pzqh === '3') && (form.orderAuditBelongto === '0') "
          >
             
            <el-col :span="10">
              <el-form-item label="还箱费">
                <el-input v-model.trim="form.returnBoxFee" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
           
            <el-col :span="10">
              <el-form-item label="还箱地点" prop="receiveHxAddress">
                   {{form.receiveHxAddress}}
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
                <el-input v-model.trim="form.goodsName" placeholder="请输入货品中文名称" />
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
                <el-input v-model.trim="form.goodsInReport" placeholder="请输入国内报关HS" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="pzqh === '1' || pzqh === '3'">
              <el-form-item label="国外报关HS" prop="goodsReport">
                <el-input v-model.trim="form.goodsReport" placeholder="请输入国外报关HS" />
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
                  <el-option value="Pallets" label="Pallets" v-if="form.yuyan === '1'">Pallets</el-option>
                  <el-option value="Cartons" label="Cartons" v-if="form.yuyan === '1'">Cartons</el-option>
                  <el-option
                    value="Wooden box"
                    label="Wooden box"
                    v-if="form.yuyan === '1'"
                  >Wooden box</el-option>
                  <el-option
                    value="Nuded cargo"
                    label="Nuded cargo"
                    v-if="form.yuyan === '1'"
                  >Nuded cargo</el-option>
                </el-select>
                <el-input
                  :disabled="!(form.goodsPacking == '' || form.goodsPacking == null)"
                  v-model.trim="goodsPacking1"
                  placeholder="请输入最外层包装形式"
                  style="width:200px !important;"
                />
                <span class="msgSpancss0 redTxt">* 选择一项或者自己填写</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="最外层包装数量	" prop="goodsNumber">
                <el-input v-model.trim="form.goodsNumber" placeholder="请输入最外层包装数量	" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="pzqh !== '2'">
              <el-form-item label="总体积(CBM)" >
                {{form.goodsCbm}}
                <!-- <el-input v-model.trim="form.goodsCbm" placeholder="请输入总体积(CBM)" /> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="总毛重(KGS)">
                {{form.goodsKgs}}
                <!-- <el-input v-model.trim="form.goodsKgs" placeholder="请输入总毛重(KGS)" /> -->
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="规格(CM)">
                <span v-for="(item,index) in goodsList" :key="index">{{item.goodsName}} : {{item.goodsLength}} * {{item.goodsWidth}} * {{item.goodsHeight}} <br/></span>
                <span class="msgSpancss0 redTxt">* 填写规则:L*W*H</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col :span="10">
              <el-form-item label="是否需要装箱方案">
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="0">需要</el-radio>
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="1">不需要</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="是否派监装员">
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="form.shipOrderIsdispatch === '1'" :span="10">
              <el-form-item label="监装费用" prop="shipJzCost">
                <el-input v-model.trim="form.shipJzCost" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
             <el-col :span="10">
              <el-form-item label="危险品备注" prop="nameRemark">
                <el-input v-model.trim="form.nameRemark" placeholder :disabled="true" />
              </el-form-item>
            </el-col>
             <el-col  :span="10">
              <el-form-item label="特殊单证备注" prop="noteRemark">
                <el-input v-model.trim="form.noteRemark" placeholder :disabled="true" />
              </el-form-item>
            </el-col> 
          
             <el-col :span="20" v-if="form.noteColor === '1'">
              <el-form-item label="">
                <el-input v-model.trim="form.hsbz" type="textarea" :autosize="{ minRows: 2}" />
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="备注">
                <el-input v-model.trim="form.goodsbz" type="textarea" :autosize="{ minRows: 2}" />
                <!-- <el-button @click="open_fjDownloadDialog(form.id)">附件</el-button> -->
              </el-form-item>
            </el-col>
          </el-row>
        </div>

         
      </el-form>
      
        <!-- 委托书查看详情 弹框中的操作按钮 -->
      <div slot="footer" class="dialog-footer">
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

    <!-- 委托书转待信息更新列表 弹框 -->
    <el-dialog title="委托书转待信息更新列表" :visible.sync="zdupdateListDialog" 
     width="45%" :destroy-on-close="true">
       <ul  class="zddcggisupdateListULCss0" v-if="!!zdupdateList">
         <li class="dcggisupdateListLICss0">{{zdupdateList.title}}</li>
         <li v-for="(item1,index1) in zdupdateList.list" :key="index1">
         {{item1}}
         </li>
       </ul>
    </el-dialog>

     <!-- 委托书信息更新列表 弹框 -->
    <el-dialog title="委托书信息更新列表" :visible.sync="isupdateListDialog" width="45%" :destroy-on-close="true">
       <ul v-for="(item,index) in isupdateList" :key="index" class="dcggisupdateListULCss0">
         <li class="dcggisupdateListLICss0">{{index}}:{{item.title}}</li>
         <li v-for="(item1,index1) in item.contentList" :key="index1"
         :class="item1.flag == 1? 'red':'green' ">
         {{item1.record}}
         </li>
       </ul>
    </el-dialog>
    
  </div>
</template>

<script>
import { fetchList2 as fetchList, detailapi, updateapi,orderCancelapi, deleteapi, orderListMy, downLoadExcel, getSiteByOrderId, orderCheckApplyapi, orderSpaceEditapi, historyEditRecord,zdhistoryEditRecord,addRemark,stationList,goodsInfo,addIsRead1 } from "@/api/classOrder/orders";
// import { validatePhone, validateTelphone, validateEMail} from '@/api/validator'
import { resolveBlob} from '@/utils/zipdownload'

import '@/assets/styles/selfCss0.css'

export default {
  name: 'PublicOrderMsg',
  data() {
    return {
      // *************************************** 编辑弹框 *********************************************************
      open1: false, // 客户审核弹框是否显示
      // 表单校验
      rules1: {},
      title1:null,
      // *************************************** 下载附件 *********************************************************
      fjDownloadDialog: false, // 下载附件 弹框状态
      // 附件下载列表 查询参数
      queryParams0: {
        pageNum: 1,
        pageSize: 10,
        isexamline: '',
      },
      // 附件下载列表 总条数
      total0: 0,
      datalist0: [], // 附件下载 列表list数据
     
      // *************************************** 托书详情 *********************************************************
      currentFormStatus: '',
      form: {}, // 客户审核信息form表单
      formDisabled: false,
      // 表单校验
      rules: {},
      title: '', // 弹出层标题
      open: false, // 客户审核弹框是否显示
      zdState: false, // 查询条件中 “站点” 模块显示状态
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
      // 查询参数
      queryParams: {
        deptCode:111,
        pageNum: 1,
        pageSize: 10,
        orderNumber:null,  
        clientTjr:null,   
        orderMerchandiser:null,  
        clientUnit:null,  
        classDate:null,  
        classNumber:null,
        classBh:null,  
        isexamline:null,   
        isconsolidation:null,   
        classEastandwest:null,   
        lineTypeid:null,   
        station:null,   
        yuyan:null,  
        isPhone:null,  
        shipOrderBinningway:null,   
        isupdate:null,
        editRecord:null,  
        goodsName:null,
        organizationCode:null,
        siteCode:null
      },
      total: 0, // 总条数
      list: [], // 订舱托书列表数据
      // ******************************************* 其他字段 *****************************************************
      // 展开-收起 更多查询条件
      moreQueryParams:false,
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
      pzqh: '0',
      xlString: 'zy', // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
      // ******************************************* 改单费编辑 字段 *****************************************************
      gaidanDialog: false, // 改单费编辑弹框
      isGaidan: '0', // 是否改单 字段
      // ******************************************* 舱位号修改 字段 *****************************************************
      cangweiDialog: false,
      form1: {
        val1: ''
      },
      myList:[], //贸易方式 列表数据
      apiStr:null,
      goodsPacking1:null, // 最外层包装形式 输入框值
      sitelistupList:[], //上货站
      sitelistdownList:[],//下货站
      isupdateList:null, // 修改记录
      zdupdateList:null, // 修改记录
      heightScreen:null,
      isupdateListDialog:false, // 修改记录弹框
      zdupdateListDialog:false, // 转待修改记录弹框
       //查询条件控制字段
      disabledStr:null ,
      goodsList:[],
      changzhanList:[],
    }
  },
  watch: {
     queryParams: {
      handler: function(val) {
        if (!val.classDate && !val.classEastandwest && !val.classDateFour && !val.classDateFive){
         this.disabledStr = null
        }
        // if (val.classDate || val.classEastandwest) {
        //   this.disabledStr = '0'
        // }else if (val.classDateFour) {
        //    this.disabledStr = '1'
        // }else if (val.classDateFive) {
        //    this.disabledStr = '2'
        // }else{
        //    this.disabledStr = null
        // }
      },
      deep: true
    },
   
    goodsPacking1: {
      handler: function(val) {
        if(val){
          this.form.goodsPacking = null
        }
      }
    },
    form: {
      handler: function(val) {
        if(val.goodsPacking){
          this.goodsPacking1 = null
        }
      },
      deep: true
    },

    disabledStr: {
      handler: function(val) {
        if(val === '0'){
          this.classDateFour=null   
          this.classDateFive=null
        }else if(obj === '1'){
          this.classDate=null
          this.classEastandwest=null   
          this.classDateFive=null
        }else if(obj === '2'){
          this.classDate=null
          this.classEastandwest=null   
          this.classDateFour=null
        }
      },
    },

     
    
  },
  created() {
    this.queryParams['userid'] = this.$store.getters.id; 
    this.queryParams.deptCode = this.$store.getters.deptCode
    this.getList()
    this.orderListMyFn()
    this.apiStr=process.env.VUE_APP_BASE_API
  },
  mounted() {    
     if(window.screen.height >800){
        this.heightScreen = 600
      }else{
        this.heightScreen = 500
      }
  },
  methods: {
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
        isenabled:'0',
        isReport:isReportStr
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
  
    },

    /*  查看驳回原因 */
    bohuiReason(obj){
      let rowData=obj
      debugger
      let str=!!rowData.xgRefuseInfo?rowData.xgRefuseInfo:'暂无数据'
      if(obj.isread === '0'){
        let params={
          // orderId:obj.orderId
          isread: 1,  
          examId:rowData.examId
        }
        addIsRead1(params).then(res=>{
          if(res.code === 200){
            const h = this.$createElement;
            this.$notify({
              title: '驳回原因',
              message: h('i', { style: 'color: teal'}, str)
            });
            this.getList()
          }else{
            this.$message.error(res.msg)
          }
        })
      }else{
        const h = this.$createElement;
            this.$notify({
              title: '驳回原因',
              message: h('i', { style: 'color: teal'}, str)
            });
      
      }
    },
// 转待修改记录弹框列表数据获取
    handlezdupdateDetail(obj){
      let params={examId:obj.examId}
      zdhistoryEditRecord(params).then(res=>{
        if(res.code === 200){
            this.zdupdateList=res.data
            this.zdupdateListDialog=true
        }else{
           this.$message.error(res.msg)
        }
      })
    },
    // 修改记录弹框列表数据获取
    handleisupdateDetail(obj){
      let params={orderId:obj.orderId}
      historyEditRecord(params).then(res=>{
        if(res.code === 200){
            this.isupdateList=res.rows
            this.isupdateListDialog=true
        }else{
           this.$message.error(res.msg)
        }
      })
    },
    
    // 获取上下货站
    getSiteByOrderIdFn(obj){
       
      let params={
        classId:this.form.classId,
        orderId:this.form.orderId
      }
      getSiteByOrderId(params).then(res=>{
        if(res.code === 200){
          this.open = true
          this.title = obj

          this.sitelistupList=res.data.sitelistup
          this.sitelistdownList=res.data.sitelistdown
        }else{
          this.$message.error(res.msg)
        }
       
      })
    },

     //获取托书详情中 贸易方式 下拉列表数据
     orderListMyFn(){
       orderListMy().then(res=>{
         if(res.code === 200){
            this.myList=res.rows
         }else{
            this.$message.error(res.msg)
         }
       })
     },

     
    /** 查询客户管理列表 */
    getList() {
      this.loading = true
    
      fetchList(this.queryParams).then(res => {
        if (res.code === 200) {
          this.list = res.rows
          this.total = Number(res.total)
          this.loading = false;
        }else{
          this.$message.info(res.msg);
        }
      }).catch(()=>{
          this.loading = false;
      });
 
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },

    // 表单重置
    reset() {
      this.form = {}
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
      this.arrs = selection.map(item => item)
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
     handleRow(obj){
      this.$refs.multipleTable.toggleRowSelection(obj);
    },
    handleSelectionChange0(selection) {
      
    },

    /* 打开 下载附件弹框 */
    open_fjDownloadDialog(id) {
      this.fjDownloadDialog = true
    },
    /* 下载附件弹框 列表数据的获取 */
    getList0() {
      this.dataList0 = []
    },

    /* 关闭 下载附件弹框 */
    close_fjDownloadDialog() {
      this.fjDownloadDialog = false
    },
   
    /** 编辑按钮操作 */
    handleEdit(row) {
      const orderId = row.orderId || this.ids;
       detailapi(orderId).then(res => {
        if(res.code === 200){
          this.form1 = res.data;
          
          this.open1 = true;
          this.title1 = "编辑";
        }else{
          this.$message.error(res.msg)
        }
      });
    },
    /* 托书详情按钮 操作 */
    handleDetail(row) {
      this.currentFormStatus = "detailInfo";
      this.formDisabled = true;
      this.reset();
      const orderId = row.orderId || this.ids;
      
       detailapi(orderId).then(res => {
        this.form = res.data
           // 获取货物 规格数据 
        let inquiryRecordId=res.data.inquiryRecordId;
        goodsInfo(inquiryRecordId).then(res=>{
          this.goodsList=res.rows
        })

         //获取场站下拉列表数据
         this.stationListFn()

        // 获取上下货站
         this.getSiteByOrderIdFn('查看')
        // classEastandwest: 0为去程 1为回程
        // isconsolidation: 整拼箱 0整柜 1拼箱
         //  pzqh:0表示拼箱去程 ;  pzqh:1表示拼箱回程 ;  pzqh:2表示整箱去程 ;  pzqh:3表示整箱回程 ；
    
        if(res.data.classEastandwest === '0' && res.data.isconsolidation === '1'){
          this.pzqh='0'
        }else if(res.data.classEastandwest === '1' && res.data.isconsolidation === '1'){
          this.pzqh='1'
        }else if(res.data.classEastandwest === '0' && res.data.isconsolidation === '0'){
          this.pzqh='2'
        }else if(res.data.classEastandwest === '1' && res.data.isconsolidation === '0'){
          this.pzqh='3'
        }
        // 线路类型：0中欧 2中亚 3中越 4中俄
        // xlString='zy'表示中亚线路，xlString=‘fzy’表示非中亚线路
        if(res.data.lineTypeid === '2' ){
          this.xlString='zy'
        }else{
          this.xlString='fzy'
        }
       
      })
    },
    /** 编辑提交按钮 */
    submitForm1: function() {
      let row=this.arrs[0]
      let params={
        examId:row.examId,
        remark:this.form1.examinfo
      }
      addRemark(params).then(res=>{
        this.open1=false
        if(res.code === 200){
          this.$message.success('操作成功')
          this.getList()
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    cancel1:function(){
      this.open1=false
    }
    
     
  }
}
</script>
<style>
.xy th > .cell {
  white-space:pre-line;
}
.detailCss0{
  color:#1890ff;
}
.dcggisupdateListULCss0 li{
  border-bottom:1px solid#000;
  height:auto;
  line-height:35px;
  list-style:none;
}
.dcggisupdateListULCss0 li.dcggisupdateListLICss0{
  background:rgb(255, 255, 0) !important;
  border-bottom:none;
}
.zddcggisupdateListULCss0 li{
  border-bottom:1px solid#000;
  height:auto;
  line-height:35px;
  list-style:none;
}
.zddcggisupdateListULCss0 li.dcggisupdateListLICss0{
  background:#eee !important;
  border-bottom:none;
}
.red {
  color:red;
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


.x22 .cell {
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
.x11 .cell {
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
