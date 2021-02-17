<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="classDate">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model.trim="queryParams.classDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择班列日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="整/拼箱" prop="isConsolidation">
        <el-select
          v-model.trim="queryParams.isConsolidation"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in zpxOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="往返" prop="classEastAndWest">
        <el-select
          v-model.trim="queryParams.classEastAndWest"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in wfOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>



    <el-table
      v-loading="loading"
      :data="NoticeList"

    >
      <el-table-column  width="55" align="center" />
      <el-table-column label="委托书编号" align="center" prop="orderNumber" >
      <template slot-scope="scope">
      <span @click="handleDetail(scope.row)" style="cursor:pointer;">
          {{scope.row.orderNumber}}
        </span>
      </template>
      </el-table-column>
      <el-table-column label="站点" align="center" prop="classSite" >
        <template slot-scope="scope">
          {{scope.row.classSite + '(' + scope.row.classNumber + ')'}}
        </template>
      </el-table-column>
      <el-table-column label="班列日期" align="center" prop="classDate" />
      <el-table-column label="往返" align="center" prop="classEastAndWest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastAndWest == '0'">西向</span>
          <span v-else>东向</span>
        </template>
      </el-table-column>
      <el-table-column label="订舱方" align="center" prop="clientUnit" />
      <el-table-column label="发货方" align="center" prop="consignor" />
      <el-table-column label="接收方" align="center" prop="consignee" />
      <el-table-column label="装箱" align="center" prop="isConsolidation">
        <template slot-scope="scope">
          <span v-if="scope.row.isConsolidation == '0'">整箱</span>
          <span v-else>拼箱</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="isExamline">
        <template slot-scope="scope">
          <span v-if="scope.row.isExamline == '0'">未审核</span>
          <span v-else-if="scope.row.isExamline == '1'">已审核通过</span>
          <span v-else-if="scope.row.isExamline == '2'">已审核未通过</span>
          <span v-else-if="scope.row.isExamline == '3'">已取消的委托</span>
          <span v-else-if="scope.row.isExamline == '4'">转待审核</span>
          <span v-else-if="scope.row.isExamline == '5'">草稿</span>
          <span v-else-if="scope.row.isExamline == '6'">转待失败</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发送状态"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            @click.prevent="handleSee(scope.row)"
            >查看
          </el-button> -->
          <div v-if="scope.row.fileUrl">
            <a :href="scope.row.fileUrl" :download="scope.row.fileName" target="_blank" class="filecss0" style="color:blue">{{scope.row.fileName}}</a>
            <el-button size="mini"  icon="el-icon-edit"
                       @click.prevent="handleCreatePDF(scope.row)">
              重新生成</el-button>
          </div>
          <div v-else>
            <a style="color:red">暂无单据</a>
          </div>
<!--          <a v-if="scope.row.fileUrl" :href="scope.row.fileUrl" :download="scope.row.fileName" target="_blank" class="filecss0" style="color:blue">{{scope.row.fileName}}</a>-->
<!--          <a v-else style="color:red">暂无单据</a>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

<!-- 修改托书或审核托书，共用此对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="90%">
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
          </el-row> -->
          <el-row>
            <el-col :span="10">
              <el-form-item label="委托书编号">
                  <el-input v-model.trim="form.orderNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="跟单员" >
                <el-input v-model.trim="form.orderMerchandiser" placeholder="请输入跟单员"  :disabled="true"  />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="贸易方式" prop="dictId">
                <el-select v-model.trim="form.dictId">
                  <el-option value>-请选择-</el-option>
                  <el-option v-for="item in myList" :key="item.id" :label="item.mcheng" :value="item.id"></el-option>
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
              <el-form-item label="班列号" >
                <el-input v-model.trim="form.classNumber" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="往返" >
                <!-- <el-input v-model.trim="form.classEastAndWest" :disabled="true" /> -->

                 <span v-if="form.classEastandwest === '0'">西向</span>
                 <span v-else-if="form.classEastandwest === '1'">东向</span>
                 <span v-else></span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="班列日期" >
                <el-date-picker
                  v-model.trim="form.classDate"
                  type="date"
                  :disabled="true"
                  placeholder="选择日期">
                </el-date-picker>
              <!-- <span style="cursor:pointer;" v-if="this.form.isexamline === '6' || this.form.isexamline === '3' || this.form.isexamline === '5'" @click="classesFn">修改班列</span> -->

              <span style="cursor:pointer;" v-if="this.form.isexamline === '0' || this.form.isexamline === '2' || this.form.isexamline === '6' || this.form.isexamline === '3' || this.form.isexamline === '5'" @click="classesFn">修改班列</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" />
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="上货站" >
                <el-select v-model.trim="form.orderUploadsite" filterable clearable  :disabled="true" >
                  <el-option value >-请选择-</el-option>
                  <el-option v-for="item in sitelistupList" :key="item.code" :label="item.nameCn" :value="item.code"></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option v-for="item in sitelistupList" :key="item.code" :label="item.nameEn" :value="item.code" v-if="form.yuyan === '1'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下货站">
                 <el-select v-model.trim="form.orderUnloadsite" filterable clearable  :disabled="true" >
                  <el-option value v-if="form.yuyan === '0'">-请选择-</el-option>
                  <el-option v-for="item in sitelistdownList" :key="item.code" :label="item.nameCn" :value="item.code" v-if="form.yuyan === '0'"></el-option>
                  <el-option value v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option v-for="item in sitelistdownList" :key="item.code" :label="item.nameEn" :value="item.code" v-if="form.yuyan === '1'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '1') || (pzqh === '3')" :span="10">
              <el-form-item label="开行班列">
                <el-input v-model.trim="form.lineName" placeholder="请输入开行班列"  :disabled="true"  />
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
                <el-radio v-model.trim="form.putoffClass" :label='0'>否</el-radio>
                <el-radio v-model.trim="form.putoffClass" :label='1'>是</el-radio>
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
              <el-form-item label="站到站运费" >
                <el-input
                  v-model.trim="form.sitecost"
                  :disabled="true"
                  placeholder="请输入站到站运费"
                  style="width:260px !important;"
                />
                <el-radio v-model.trim="form.sitecostCurrency" :disabled="true" label="0">[美金]</el-radio>
                <el-radio v-model.trim="form.sitecostCurrency" :disabled="true" label="1">[人民币]</el-radio>
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
              <el-form-item label="易碎品(货物属性)"  prop="goodsFragile">
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
                <el-radio v-model.trim="form.orderAuditBelongto" :disabled="true"  label="0">委托ZIH </el-radio>
                <el-radio v-if="xlString === 'fzy'" v-model.trim="form.orderAuditBelongto" :disabled="true" label="1">自备</el-radio>
                <el-radio v-if="xlString === 'zy'" v-model.trim="form.orderAuditBelongto" :disabled="true" label="2">自备铁路箱</el-radio>
                <el-radio v-if="xlString === 'zy'" v-model.trim="form.orderAuditBelongto" :disabled="true" label="3">自备非铁路箱</el-radio>
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
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="0">郑州</el-radio>
                <el-radio v-model.trim="form.clientOrderBindingaddress" label="1">属地</el-radio>
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
                <el-radio v-if="(pzqh === '1') || (pzqh === '3')" v-model.trim="form.clientOrderBindingway" label="1">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="form.clientOrderBindingway === '0'" :span="12">
              <el-form-item label="报关费用" >
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
              <el-form-item label="由ZIH提货" >
                <el-radio v-model.trim="form.shipOrderBinningway" :disabled="true" label="0">是</el-radio>
                <el-radio v-model.trim="form.shipOrderBinningway" :disabled="true" label="1">否</el-radio>
                <el-radio v-if="pzqh === '2'" v-model.trim="form.shipOrderBinningway" :disabled="true" label="2">铁路到货</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10">
            <!-- 提箱地显示情况 -->
            <!-- 1、由ZIH提货：是，提货方式是：整箱到车站 -->
            <!-- 2、箱属：委托zih，由ZIH提货：否，提货方式是：整箱到车站 -->
              <template v-if="(form.shipOrderBinningway === '0' && form.shipThType === '0') || (form.shipOrderBinningway === '1' && form.shipThType === '0' && form.orderAuditBelongto === '0')">
                <template>
                  <el-form-item label="提箱地" prop="shipOrderUnloadaddress">
                    <el-select v-model.trim="form.shipHyd" filterable clearable  v-if="pzqh === '0' || pzqh === '2'" > <!-- 去程提箱地 -->
                      <el-option value >-请选择-</el-option>
                      <el-option v-for="item in txAddressList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>

                    <el-select v-model.trim="form.shipFhSite" filterable clearable v-if="pzqh === '1' || pzqh === '3'" > <!-- 回程发货提箱地 -->
                      <el-option value >-请选择-</el-option>
                      <el-option v-for="item in txAddressList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
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
                <el-input v-model.trim="form.shipOrderUnloadway" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="(pzqh === '1') || (pzqh === '3')">
              <el-form-item label="联系邮箱" prop="shipOrderUnloadwayEmail">
                <el-input v-model.trim="form.shipOrderUnloadwayEmail" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货方式" prop="shipThType">
                <el-radio v-model.trim="form.shipThType" label="0">整箱到车站</el-radio>
                <el-radio v-model.trim="form.shipThType" label="1">散货到堆场</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货时间" prop="shipOrderUnloadtime">
                <el-input v-model.trim="form.shipOrderUnloadtime" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货地址" prop="shipOrderUnloadaddress">
                <el-input v-model.trim="form.shipOrderUnloadaddress" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="详细地址" prop="detailedAddress">
                <el-input v-model.trim="form.detailedAddress" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货费用" >
                <el-input v-model.trim="form.shipThCost" placeholder="" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="提货费报价编号">
                <el-input v-model.trim="form.shipThCostNo" placeholder="" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.shipOrderBinningway === '1'">
            <el-col :span="10">
              <el-form-item label="自送货时间" prop="shipOrderSendtime">
                <el-date-picker v-model.trim="form.shipOrderSendtime" type="date" placeholder="选择日期" />
              </el-form-item>
            </el-col>
            <el-col v-if="(pzqh === '2') || (pzqh === '3')" :span="10">
              <el-form-item label="自送货方式" prop="shipThTypeId">
                <el-radio v-model.trim="form.shipThTypeId" label="0"> 整箱到车站</el-radio>
                <el-radio v-model.trim="form.shipThTypeId" label="1"> 散货到堆场</el-radio>
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
              <el-form-item label="由ZIH代理清关" >
                <el-radio v-model.trim="form.receiveOrderIsclearance" :disabled="true" label="0">否</el-radio>
                <el-radio v-model.trim="form.receiveOrderIsclearance" :disabled="true" label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="form.receiveOrderIsclearance !== '0'">
              <el-form-item label="清关费用">
                <el-input v-model.trim="form.receiveQgCost" placeholder="请输入清关费用" />
                <el-radio v-model.trim="form.qgCostcurrency" :disabled="true" label="美金">*美金</el-radio>
                <el-radio v-model.trim="form.qgCostcurrency" :disabled="true" label="人民币">*人民币</el-radio>
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
                <el-input v-model.trim="form.receiveOrderZihcontacts" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="Email" prop="receiveOrderZihemail">
                <el-input v-model.trim="form.receiveOrderZihemail" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="送货地址(中英文)" prop="receiveOrderPartaddress">
                <el-input v-model.trim="form.receiveOrderPartaddress" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="电话" prop="receiveOrderZihtel">
                <el-input v-model.trim="form.receiveOrderZihtel" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="送货费用">
                <el-input v-model.trim="form.receiveShCost" placeholder=""  :disabled="true" />
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="美金">美金</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="欧元">欧元</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="送货费报价编号" >
                <el-input v-model.trim="form.receiveShCostId" :disabled="true" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 箱管费、还箱地点显示条件：
             1、箱属：委托ZIH（0）
             2、由ZIH代理分拨：是
             3、整柜 -->
          <el-row v-if="(form.receiveOrderIspart === '1') && (pzqh === '2' || pzqh === '3') && (form.orderAuditBelongto === '0') ">
            <el-col :span="10">
              <el-form-item label="箱管费"  >
                <el-input v-model.trim="form.receiveXgCost" placeholder="" :disabled="true" />
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="美金">美金</el-radio>
                <el-radio v-model.trim="form.shCostcurrency" :disabled="true" label="欧元">欧元</el-radio>
                提示：（包含还箱平衡费用、重货箱损押金）
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="还箱地点" prop="receiveHxAddress">

                <el-select v-model.trim="form.receiveHxAddress" filterable clearable :disabled="true"> <!-- 去程提箱地 -->
                  <el-option value >-请选择-</el-option>
                  <el-option v-for="item in hxAddressList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>

                <el-input v-if="form.receiveHxAddress === ''" v-model.trim="form.receiveHxAddress" placeholder="" :disabled="true" />
                (选择一项或者自己填写)
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
                 <el-select v-model.trim="form.goodsPacking" :disabled="!(goodsPacking1 == '' || goodsPacking1 == null)" clearable>
                  <el-option value="" v-if="form.yuyan === '0'">-请选择-</el-option>
                  <el-option value="托盘" label="托盘" v-if="form.yuyan === '0'"> 托盘</el-option>
                  <el-option value="纸箱" label="纸箱" v-if="form.yuyan === '0'"> 纸箱</el-option>
                  <el-option value="木箱" label="木箱" v-if="form.yuyan === '0'"> 木箱</el-option>
                  <el-option value="裸装" label="裸装" v-if="form.yuyan === '0'"> 裸装</el-option>

                  <el-option value="" v-if="form.yuyan === '1'">-please select-</el-option>
                  <el-option value="Pallets" label="Pallets" v-if="form.yuyan === '1'"> Pallets</el-option>
                  <el-option value="Cartons" label="Cartons" v-if="form.yuyan === '1'"> Cartons</el-option>
                  <el-option value="Wooden box" label="Wooden box" v-if="form.yuyan === '1'"> Wooden box</el-option>
                  <el-option value="Nuded cargo" label="Nuded cargo" v-if="form.yuyan === '1'"> Nuded cargo</el-option>
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
            <el-col :span="12">
              <el-form-item label="总体积(CBM)" prop="goodsCbm">
                {{form.goodsCbm}}
                <!-- <el-input v-model.trim="form.goodsCbm" placeholder="请输入总体积(CBM)" /> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="总毛重(KGS)" prop="goodsKgs">
                  {{form.goodsKgs}}
                <!-- <el-input v-model.trim="form.goodsKgs" placeholder="请输入总毛重(KGS)" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格(CM)">
                <el-input
                  v-model.trim="form.goodsStandard"
                  placeholder="请输入规格(CM)"
                  :disabled="true"
                  style="width:200px !important;"
                />
                <span class="msgSpancss0 redTxt">* 填写规则:L*W*H</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="(pzqh === '2') || (pzqh === '3')">
            <el-col :span="10">
              <el-form-item label="是否需要装箱方案" >
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.goodsIsscheme" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="是否派监装员" >
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="1">是</el-radio>
                <el-radio v-model.trim="form.shipOrderIsdispatch" :disabled="true" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="form.shipOrderIsdispatch === '1'" :span="10">
              <el-form-item label="监装费用" prop="shipJzCost">
                <el-input v-model.trim="form.shipJzCost" placeholder="" :disabled="true" />
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

           <el-row v-if="currentFormStatus === 'zhuandai'">
            <el-col :span="20">
              <el-form-item label="转待原因" prop="examInfo">
                <el-input v-model.trim="form.examInfo" type="textarea" :autosize="{ minRows: 2}" />
              </el-form-item>
            </el-col>
          </el-row>

           <el-row v-if="currentFormStatus === 'shenhe'">
            <el-col :span="20">
              <el-form-item label="审核原因">
                <el-input v-model.trim="form.examInfo" type="textarea" :autosize="{ minRows: 2}" />
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>


      <!-- 待审核状态 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'shenhe'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('0')">审核通过</el-button>
        <el-button type="primary" @click="submitForm('1')">审核失败</el-button>
        <el-button type="primary" v-hasPermi="['order:shippingorder:export']" @click="handleExport">导出</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <!-- 委托书修改状态 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'edit'" slot="footer" class="dialog-footer">
         <el-button type="primary" @click="submitForm('2')">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>

      </div>

        <!-- 委托书修改状态 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'zhuandai'" slot="footer" class="dialog-footer">
         <el-button type="primary" @click="submitForm('3')">转待审核</el-button>
        <el-button @click="cancel">取 消</el-button>

      </div>

        <!-- 委托书查看详情 弹框中的操作按钮 -->
      <div v-if="currentFormStatus === 'detailInfo'" slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>




    </el-dialog>

    <!-- 入货通知书查看对话框 a标签不需要key,for循环需要加key-->
    <!-- <el-dialog title="入货通知书查看" :visible.sync="open" width="500px">
      <el-card class="2">
        <div slot="header" class="clearfix">
        <span>入货通知书</span>
        </div>
        <el-row>
          <el-col>
            <a
              :href="fileUrl"
              :download="fileName"
              target="_blank"
              class="filecss0"
              >{{ fileName }}
            </a>
          </el-col>
        </el-row>
       </el-card>
    </el-dialog> -->
  </div>
</template>

<script>
import { listDocumentNotice, createPDFAgain} from "@/api/document/document_notice";
import {
  validatePhone,
  validateTelphone,
  validateEMail
} from "@/api/validator";
import { fetchList, detailapi, updateapi,orderCancelapi, deleteapi, orderListMy, downLoadExcel, getSiteByOrderId, orderCheckApplyapi, orderSpaceEditapi, historyEditRecord, examInfoListApi, boxAmountTotal,classesApi, getOrderNumberApi } from "@/api/classOrder/orders";

import { parseTime} from "@/utils/zhonghao";
import { resolveBlob} from '@/utils/zipdownload'
import '@/assets/styles/selfCss0.css'
import {khServiceIp } from "@/api/common";


const cityOptions = [
  {name:'汉堡',code:'49_20066'}
  ,{name:'慕尼黑',code:'49_80200'}
  ,{name:'列日',code:'2_20182'}
  ,{name:'亨克',code:'32_20183'}
  ,{name:'里昂',code:'33_750002'}
  ,{name:'杜伊斯堡',code:'49_47044'}
  ,{name:'巴黎',code:'33_75001'}
  ,{name:'马尔默',code:'46_04640'}
  ,{name:'赫尔辛基',code:'358_00002'}
  ,{name:'赫尔辛堡',code:'46_0464555'}]
const cityOptions1 = [
  {name:'霍尔果斯',code:'86_835221'}
  ,{name:'阿拉木图1',code:'327_050000'}
  ,{name:'阿拉木图2',code:'998_021'}
  ,{name:'梅杰乌',code:'998_05'}
  ,{name:'热特苏',code:'700308'}
  ,{name:'塔什干',code:'998'}
  ,{name:'丘库尔赛',code:'998_01'}
  ,{name:'谢尔盖利',code:'998_02'}
  ,{name:'阿腾科里',code:'707701'}]
const cityOptions2 = [
  {name:'河内',code:'006_565'}]
const cityOptions3 = [
  {name:'马拉',code:'48_21500'}
  ,{name:'库特诺',code:'48_000000'}
  ,{name:'波兹南',code:'48_60111'}
  ,{name:'华沙',code:'48_00686'}
  ,{name:'布拉格',code:'420_10003'}
  ,{name:'布达佩斯',code:'36_1007'}
  ,{name:'米兰',code:'39_20121'}]
const cityOptions4 = [
  {name:'布列斯特',code:'375_220072'}
  ,{name:'莫斯科',code:'7_109807'}
  ,{name:'明斯克',code:'375_220071'}
  ,{name:'圣彼得堡',code:'007_190121'}
  ,{name:'克拉斯诺亚尔斯克',code:'007-3'}
  ,{name:'丘诺亚尔',code:'007-2'}
  ,{name:'伊尔库茨克',code:'007-6'}
  ,{name:'沃尔西诺',code:'183502'}]
export default {
  name: "Document_notice",
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
      // 办事处信息表格数据
      NoticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
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
       isIndeterminate:true,

        //中亚
       checkAll1: false,
       checkedCities1: [],
       cities1: cityOptions1,
       isIndeterminate1:true,

       //中越
       checkAll2: false,
       checkedCities2: [],
       cities2: cityOptions2,
       isIndeterminate2:true,

        //波兰
       checkAll3: false,
       checkedCities3: [],
       cities3: cityOptions3,
       isIndeterminate3:true,

       //白俄
       checkAll4: false,
       checkedCities4: [],
       cities4: cityOptions4,
       isIndeterminate4:true,
      open: false,
      zpxOptions: [
        {
          value: "0",
          label: "整箱"
        },
        {
          value: "1",
          label: "拼箱"
        }
      ],
      wfOptions: [
        {
          value: "0",
          label: "西向"
        },
        {
          value: "1",
          label: "东向"
        }
      ],
      sfOptions: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "0",
          label: "否"
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        classDate: undefined,
        isConsolidation: undefined,
        classEastAndWest: undefined,
        isSign: undefined
      },
      // 表单参数
       total1: 0,
      datalist1: [], // 转待审核列表list数据
      zhuandaiReasonDialog: false, // 转待原因 弹框打开状态
      // *************************************** 托书修改、审核 *********************************************************
      currentFormStatus: '',
      form: {}, // 客户审核信息form表单
      formDisabled: false,
      //form: {},
      // 表单校验
      rules: {
        email: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          },
          {
            validator: validateEMail,
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "*必填项",
            trigger: "blur"
          },
          {
            validator: validatePhone,
            trigger: "blur"
          }
        ]
      },
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
      isupdateListDialog:false, // 修改记录弹框
      classesList:[], // 可选择的班列列表
      txAddressList:[],
      hxAddressList:[],
      gdLabel:'0',
      gdVal:null,
    };
  },
  created() {
    this.getList();
     this.orderListMyFn()
  },
  methods: {
    /** 查询办事处信息列表 */
    getList() {
      this.loading = true;
      listDocumentNotice(this.queryParams).then(response => {

        this.NoticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(()=>{
          this.loading = false;
      });
    },
    /** 入货通知书查看 */
    handleCreatePDF(row) {
      this.$confirm(
        '是否重新生成入货通知书?',
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }
      ).then(function () {
        return createPDFAgain({orderId: row.orderId});
      }).then(response => {
        if (response.code === 200) {
          this.msgSuccess("生成成功！");
          this.getList();
        } else {
          this.msgError("生成失败！");
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        orderNumber: undefined,
        classSite: undefined,
        classNumber: undefined,
        classDate: undefined,
        classEastAndWest: undefined,
        clientUnit: undefined,
        consignor: undefined,
        clientEmail: undefined,
        consignee: undefined,
        isConsolidation: undefined,
        isExamline: undefined,
        isSign: undefined,
        fileUrl: undefined,
        fileName: undefined
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

    /** 提交按钮 */
    submitForm1: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.officeId != undefined) {
            updateOffice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addOffice(this.form).then(response => {
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
     handleDetail(obj){

      this.handleShenhe(obj,'托书详情')
      this.currentFormStatus = 'detailInfo'
    },
    /** 审核按钮操作 */
    handleShenhe(row,obj1) {

      let rowData=row || this.arrs[0]
      if(rowData.isexamline !== '0' && !obj1){
        let cunrrentState=null
        if(rowData.isexamline === '1'){ cunrrentState='已审核通过'}
        if(rowData.isexamline === '2'){ cunrrentState='已审核失败'}
        if(rowData.isexamline === '3'){ cunrrentState='取消托书'}
        if(rowData.isexamline === '4'){ cunrrentState='转待审核'}
        // if(rowData.isexamline === '5'){ cunrrentState='草稿'}
        // if(rowData.isexamline === '6'){ cunrrentState='转待审核失败'}
        this.$message.error('当前托书状态:'+ cunrrentState +',不能执行审核操作。')
        return false
      }
      this.currentFormStatus = 'shenhe'
      this.form = {}
      const orderIdObj = rowData.orderId
      detailapi(orderIdObj).then(res => {
        this.form = res.data
        this.getHxaddressFn('0')

        if(!this.form.orderNumber){
          this.getOrderNumberFn(this.form.orderId)
        }
        // 获取上下货站
        if(obj1){
          this.getSiteByOrderIdFn(obj1)
        }else{
          this.getSiteByOrderIdFn('审核')
        }

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
    // 获取提还箱地址
    getHxaddressFn(obj){


      let that=this
      //  obj === '0' 表示提箱地， obj === '1' 表示还箱地
      if(obj === '0') {
         that.txAddressList =[]
      }else if(obj === '1') {
         that.hxAddressList = []
      }
      var xhr = new XMLHttpRequest();
      let inquiryRecordIdStr=this.form.inquiryRecordId
      xhr.open('GET', khServiceIp+'/busiBoxfee/boxList?type='+obj+'&language=ch', true);
      xhr.onreadystatechange = function() {
        // readyState == 4说明请求已完成
        if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
          let res=JSON.parse(xhr.responseText)
          //  obj === '0' 表示提箱地， obj === '1' 表示还箱地
          if(obj === '0') {
            that.txAddressList=res.data
            that.getHxaddressFn('1')
          }else if(obj === '1') {
             that.hxAddressList=res.data
          }
        }
      };
      xhr.send();
    },
     /** 获取托书编号 */
    getOrderNumberFn(obj){
      getOrderNumberApi(obj).then(res=>{
        if(res.code === 200){
            this.form.orderNumber=res.msg
        }else{
            this.msgError(res.msg)
        }
      })

    },
    // 获取上下货站
    getSiteByOrderIdFn(obj){

      let params={
        classId:this.form.classId,
        orderId:this.form.orderId
      }
      this.open = true
      this.title = obj
      this.sitelistupList=[]
      this.sitelistdownList=[]
      getSiteByOrderId(params).then(res=>{
        if(res.code === 200){
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

     /** 提交按钮 */
    submitForm: function(obj) {

      if (obj === '0') {
        // 审核通过
        this.form['operateType']='0'
        this.form['isexamline']='1'
      } else if (obj === '1') {
        if(!this.form.examInfo){
           this.msgError('请填写审核原因')
           return false
        }
        // 审核失败
         this.form['operateType']='0'
         this.form['isexamline']='2'
      } else if (obj === '2') {
        // 委托书修改
         this.form['operateType']='1'
      }
      if( obj !== '1'){
         this.$refs['form'].validate(valid => {
            if (valid) {
              let dictId = this.form.dictId
              this.form['dictName']=this.myList.filter(item => item.id === dictId)[0].mcheng
              let params=this.form

              if(this.goodsPacking1){
                params.goodsPacking=this.goodsPacking1
              }
              if(obj !== '3'){
                params['createusername']=this.$store.getters.name
                params['createuserid']=this.$store.getters.id

                updateapi(params).then(response => {
                  if (response.code === 200) {
                    // eslint-disable-next-line quotes
                    this.msgSuccess("操作成功")
                    this.open = false
                    this.getList()
                  } else {
                    this.msgError(response.msg)
                  }
                })
              }else{
                this.doZhuanDai(params)
              }

            }
          })
      }else{
           let dictId = this.form.dictId
          this.form['dictName']=this.myList.filter(item => item.id === dictId)[0].mcheng
          let params=this.form
          if(this.goodsPacking1){
            params.goodsPacking=this.goodsPacking1
          }
          if(obj !== '3'){
            params['createusername']=this.$store.getters.name
            params['createuserid']=this.$store.getters.id

             updateapi(params).then(response => {
              if (response.code === 200) {
                // eslint-disable-next-line quotes
                this.msgSuccess("操作成功")
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }else{
            this.doZhuanDai(params)
          }
      }

    }

  }
};
</script>
<style>
  .box-card2 {
    width: 480px;
  }
</style>
