<template>
  <div class="app-container">
    <!-- 询价三个状态的tabs选项卡 -->
    <!-- {{activeName}}  ** {{activeName === '0'}} -->
    <div>
      <template>
        <el-tabs v-model.trim="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane>
            <span slot="label" name="0">
              报价中
              <!-- <el-badge :value="12"
              class="item"></el-badge>-->
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" name="1">
              待审核
              <!-- <el-badge :value="50"
              class="item"></el-badge>-->
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" name="2">
              已报价
              <!-- <el-badge :value="1"
              class="item"></el-badge>-->
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" name="3">
              驳回
              <!-- <el-badge :value="1"
              class="item"></el-badge>-->
            </span>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" name="4">
              已过期
              <!-- <el-badge :value="1"
              class="item"></el-badge>-->
            </span>
          </el-tab-pane>
        </el-tabs>
      </template>

      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="收货地">
          <el-input
            v-model.trim="queryParams.receiptPlace"
            placeholder="请输入收货地"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="发货地" prop="shipmentPlace">
          <el-input
            v-model.trim="queryParams.shipmentPlace"
            placeholder="请输入发货地"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="客户姓名" prop="shipmentPlace">
          <el-input
            v-model.trim="queryParams.clientUnit"
            placeholder="请输入客户姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="公路报价编号" prop="roadNum" v-if="activeName == '2'||activeName == '4'">
          <el-input
            v-model.trim="queryParams.roadNum"
            placeholder="请输入公路报价编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="集疏报价编号" prop="jsNum" v-if="activeName == '2'||activeName == '4'">
          <el-input
            v-model.trim="queryParams.jsNum"
            placeholder="请输入集疏报价编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="整/拼箱" prop="goodsType">
          <el-select v-model.trim="queryParams.goodsType" clearable>
            <el-option key="0" value="0" label="整箱"></el-option>
            <el-option key="1" value="1" label="拼箱"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="询价日期" prop="createdate">
          <el-date-picker
            v-model.trim="createdate"
            type="daterange"
            range-separator="-"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            v-hasPermi="['clients:clients:query']"
          >搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :class="this.heightScreen===600?'xj1 el-tableCss0':'xj2 el-tableCss0'"
        v-loading="loading"
        :data="clientsList"
        border
        @selection-change="handleSelectionChange"
        :height="heightScreen"
      >
        <!-- <el-table-column type="selection" width="55" align="center"  /> -->
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="客户" align="center" min-width="20.00%">
          <template slot-scope="scope">
            <a
              @click="handleDetail(scope.row)"
              class="cursorA"
              title="点击查看详情"
            >{{ scope.row.clientUnit }}</a>
          </template>
        </el-table-column>
        <el-table-column label="服务" align="center" min-width="10.00%">
          <template slot-scope="scope">
            <span v-if="scope.row.bookingService === '0'">门到门</span>
            <span v-else-if="scope.row.bookingService === '1'">门到站</span>
            <span v-else-if="scope.row.bookingService === '2'">站到站</span>
            <span v-else-if="scope.row.bookingService === '3'">站到门</span>
          </template>
        </el-table-column>
        <el-table-column label="发货地-收货地" align="center"  min-width="30.00%">
          <template slot-scope="scope">
            <span
              v-if="scope.row.bookingService === '0'"
            >{{ scope.row.shipmentPlace }}-{{ scope.row.receiptPlace }}</span>
            <span
              v-else-if="scope.row.bookingService === '1'"
            >{{ scope.row.shipmentPlace }}-{{ scope.row.dropStation }}</span>
            <span
              v-else-if="scope.row.bookingService === '2'"
            >{{ scope.row.uploadStation }}-{{ scope.row.dropStation }}</span>
            <span
              v-else-if="scope.row.bookingService === '3'"
            >{{ scope.row.uploadStation }}-{{ scope.row.receiptPlace }}</span>
          </template>
        </el-table-column>
        <el-table-column label="询价日期" align="center" min-width="10.00%">
          <template slot-scope="scope">
          <span>{{scope.row.inquiryTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="整拼箱" align="center" min-width="10.00%">
          <template slot-scope="scope">
            <span v-if="scope.row.goodsType === '0'">整柜</span>
            <span v-else-if="scope.row.goodsType === '1'">拼箱</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="线路" align="center" min-width="5.00%">
          <template slot-scope="scope">
            <span v-if="scope.row.lineType === '0'">中欧</span>
            <span v-else-if="scope.row.lineType === '2'">中亚</span>
            <span v-else-if="scope.row.lineType === '3'">中越</span>
            <span v-else-if="scope.row.lineType === '4'">中俄</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          min-width="10.00%"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="activeName == '1'"
              @click="handleSend(scope.row, '0')"
              v-hasPermi="['clients:clients:edit']"
            >发送客户</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="activeName == '1'"
              @click="handleSend(scope.row, '1')"
              v-hasPermi="['clients:clients:edit']"
            >驳回</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleScheme(scope.row)"
              v-hasPermi="['clients:clients:programme']"
            >询价方案</el-button>
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
    </div>

    <el-dialog width="30%" title="驳回原因" :visible.sync="bohuiDialog">
      <el-input v-model="bohuiInfo" placeholder="请输入内容"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleSend1()">确 定</el-button>
        <el-button @click="bohuiDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 询价详情 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="85%">
      <el-form ref="form" :model="form" label-width="120px" :disabled="formDisabled">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称:">
              <span v-if="form.clientUnit">{{ form.clientUnit }}</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
          <el-form-item label="询价类型:" v-if="!!form.bookingTimeFlag">
          <span v-if="form.bookingTimeFlag==='0'">当月({{ this.currentMonth }}月)</span>
          <span v-if="form.bookingTimeFlag==='1'">次月({{ this.nextMonth }}月)</span>
          </el-form-item>  
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item
              label="提货方式:"
              v-if="
                form.goodsType === '0' &&
                  (form.bookingService == 0 || form.bookingService == 1)
              "
            >
              <span v-if="form.deliveryType === '1'">散货到堆场</span>
              <span v-else-if="form.deliveryType === '0'">整柜到堆场</span>
              <span v-else>-</span>
            </el-form-item>
            <el-form-item
              label="自送货方式:"
              v-if="
                form.goodsType === '0' &&
                  (form.bookingService == 2 || form.bookingService == 3)
              "
            >
              <span v-if="form.deliverySelfType === '0'">散货到堆场</span>
              <span v-else-if="form.deliverySelfType === '1'">整柜到堆场</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="委托送货方式" v-if="!!form.distributionType&&form.goodsType==='0'">
            <span v-if="form.distributionType === '1'">散货派送</span>
            <span v-else-if="form.distributionType === '0'">整柜派送</span>  
            </el-form-item>  
            </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="公路询价编码:">{{ formResult.inquiryNumber }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集疏询价编码:">{{ formResult.inquiryNum }}</el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="委托ZIH报关:">
              <span v-if="form.isOrderCustoms === '1'">否</span>
              <span v-else-if="form.isOrderCustoms === '0'">是</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="委托ZIH提货:">
              <span v-if="form.isPickUp === '0'">是</span>
              <span v-else-if="form.isPickUp === '1'">否</span>
              <span v-else-if="form.isPickUp === '2'">铁路到货</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="委托ZIH清关:">
              <span v-if="form.isClearCustoms === '1'">是</span>
              <span v-else-if="form.isClearCustoms === '0'">否</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="由ZIH代理送货:">
              <span v-if="form.isDelivery === '0'">否</span>
              <span v-else-if="form.isDelivery === '1'">是</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="箱属:">
              <span v-if="form.containerBelong === '0'">委托zih</span>
              <span v-else-if="form.containerBelong === '1'">自备</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="整拼箱:">
              <span v-if="form.goodsType === '0'">整柜</span>
              <span v-else-if="form.goodsType === '1'">拼箱</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 整柜特有字段 -->
        <el-row v-if="form.goodsType === '0'">
          <el-col :span="8">
            <el-form-item label="箱型:">{{ form.containerType }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="箱量:">{{ form.containerNum }}</el-form-item>
          </el-col>
        </el-row>
        <!-- 拼箱特有字段 /散货派送也是要显示货物信息||form.distributionType === '1'-->
        <el-row v-if="form.goodsType === '1'||form.distributionType === '1'">
          <el-col :span="6">
            <el-form-item label="包装方式:">
              <span v-if="form.packageType">{{ form.packageType }}</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否堆叠:">
              <span v-if="form.isStack === '1'">是</span>
              <span v-else-if="form.isStack === '0'">否</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否易碎:">
              <span v-if="form.goodsFragile === '1'">是</span>
              <span v-else-if="form.goodsFragile === '0'">否</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="是否超长超重:">
              <span v-if="form.goodsGeneral === '1'">是</span>
              <span v-else-if="form.goodsGeneral === '0'">否</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col> -->
          <el-row
             v-for="(item, index) in form.bookingInquiryGoodsDetailsList" :key="index"
            >
            <el-col  :span="4" >
              <el-form-item label="品名:">
                <span v-if="item.goodsName">{{ item.goodsName }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="单件数量:">
                <span v-if="item.goodsAmount">{{ item.goodsAmount }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="单件重量(KG):">
                <span v-if="item.goodsWeight">{{ item.goodsWeight }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="长:">
                <span v-if="item.goodsLength">{{ item.goodsLength }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="宽:">
                <span v-if="item.goodsWidth">{{ item.goodsWidth }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="高:">
                <span v-if="item.goodsHeight">{{ item.goodsHeight }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-col :span="8">
            <el-form-item label="总数量:">
              <span v-if="form.totalAmount">{{ form.totalAmount }}</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总重量:">
              <span v-if="form.totalWeight">{{ form.totalWeight }}</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总体积:">
              <span v-if="form.totalVolume">{{ form.totalVolume }}</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="发货地址:">
              <span>
                {{ form.senderProvince }}{{ form.senderCity
                }}{{ form.senderArea }}{{ form.shipmentPlace }}
              </span>
              <!-- <span v-if="form.shipmentPlace">{{form.shipmentPlace}}</span> -->
              <!-- <span v-else>-</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="收货地址:">
              <span>
                {{ form.receiveProvince }}{{ form.receiveCity
                }}{{ form.receiveArea }}{{ form.receiptPlace }}
              </span>
              <!-- <span v-if="form.receiptPlace">{{form.receiptPlace}}</span> -->
              <!-- <span v-else>-</span> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 询价方案弹框 -->
    <el-dialog title="询价方案" :visible.sync="inquirySchemeBox" width="60%" :destroy-on-close="true">
      <el-card
        class="box-card"
        v-for="item in listScheme"
        style="margin-bottom:15px"
        :key="item.id"
      >
        <div>
          <div class="basic-data">
            <div>
              <h3 v-if="item.pickUpAddress" class="trace-city">{{ item.pickUpAddress }}</h3>
              <h3 v-else class="trace-city">{{ item.bookingInquiry.uploadStation }}</h3>
              <p class="trace-country">发货地</p>
            </div>
            <div class="middle-arrow">
              <img src="@/assets/image/row.png" alt srcset class="trace-arrow" />
            </div>
            <div>
              <h3 v-if="item.deliveryAddress" class="trace-city">{{ item.deliveryAddress }}</h3>
              <h3 v-else class="trace-city">{{ item.bookingInquiry.dropStation }}</h3>
              <p class="trace-country">收货地</p>
            </div>
            <div>
              <el-button
                type="success"
                style="margin-top:20px;"
                @click="enquiryDetails(item.id)"
              >询价详情</el-button>
            </div>
          </div>
          <div style="border-top:2px dashed #ddd;margin-bottom:30px"></div>
          <div>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">上货站：{{ item.uploadStation }}</div>
              </el-col>
              <!-- 门到门去程   公路费+铁路费+集疏 回程 集疏+铁路+公路 -->
              <el-col :span="8" v-if="item.bookingInquiry.bookingService == 0">
                <div class="grid-content">
                  总价：{{ item.pickUpFees }}{{ item.pickUpCurrencyType }}

                  <span v-if="!!item.deliveryFees && !!item.pickUpFees ">+</span>
                  {{ item.deliveryFees }}{{ item.deliveryCurrencyType }}

                  <span v-if="!!item.railwayFees">+</span>
                  {{ item.railwayFees }}{{ item.railwayCurrencyType }}

                  <span v-if="!!item.pickUpBoxFee && item.pickUpBoxFee!= '€ 0' ">+{{item.pickUpBoxFee}}</span>
                  <span v-if="!!item.returnBoxFee && item.returnBoxFee!= '€ 0' ">+{{item.returnBoxFee}}</span>
                </div>
              </el-col>
              <!-- 门到站 去程：包含公路费+铁路费 回程：集疏+铁路费 -->
              <el-col :span="8" v-if="item.bookingInquiry.bookingService == 1">
                <div class="grid-content">
                  总价：{{ item.pickUpFees }}{{ item.pickUpCurrencyType }}

                  <span v-if="!!item.railwayFees && !!item.pickUpFees">+</span>
                  {{ item.railwayFees }}{{ item.railwayCurrencyType }}

                 <span v-if="!!item.pickUpBoxFee && item.pickUpBoxFee!= '€ 0' ">+{{item.pickUpBoxFee}}</span>
                  <span v-if="!!item.returnBoxFee && item.returnBoxFee!= '€ 0' ">+{{item.returnBoxFee}}</span>
                </div>
              </el-col>
              <!-- 站到站后期加上场站费用的话。去程：整柜散货到堆场：国内场站费+铁路运费 整柜到堆场:只有铁路运费
              回程： 整柜散货到堆场：国外场站费+铁路运费 整柜到堆场:只有铁路运费-->
              <el-col :span="8" v-if="item.bookingInquiry.bookingService == 2">
                <div class="grid-content">
                  总价：{{ item.railwayFees }}{{ item.railwayCurrencyType }}

                  <span v-if="!!item.pickUpBoxFee && item.pickUpBoxFee!= '€ 0' && !!item.railwayFees ">+ {{item.pickUpBoxFee}}</span>
                  <span v-if="!!item.returnBoxFee && item.returnBoxFee!= '€ 0' ">+{{item.returnBoxFee}}</span>
                </div>
              </el-col>
              <!-- 站到门 去程：国内场站费+铁路运费+集疏
              回程：国外场站费+铁路运费+公路 只有铁路运费+公路-->
              <!-- 去程：国内场站费+铁路运费+集疏 -->
              <el-col :span="8" v-if="item.bookingInquiry.bookingService == 3">
                <div class="grid-content">
                  总价：
                  {{ item.deliveryFees}}{{ item.deliveryCurrencyType }}

                  <span v-if="!!item.railwayFees && !!item.deliveryFees"> +</span>
                  {{ item.railwayFees}}{{ item.railwayCurrencyType }}
                  <span v-if="!!item.pickUpBoxFee && item.pickUpBoxFee!= '€ 0' "> +{{item.pickUpBoxFee}} </span>
                  <span v-if="!!item.returnBoxFee && item.returnBoxFee!= '€ 0' "> +{{item.returnBoxFee}} </span>
                </div>
              </el-col>
              <!-- 去程：整柜到堆场:只有铁路运费+公路 -->
              <!-- <el-col :span="8"
                      v-if="item.bookingInquiry.bookingService==3&&item.bookingInquiry.deliveryType==0&&item.bookingInquiry.eastOrWest==0">
                <div class="grid-content">总价：{{item.pickUpFees}}{{item.pickUpCurrencyType}}+{{item.railwayFees}}{{item.railwayCurrencyType}}</div>
              </el-col>-->
              <!-- 回程： 散货到堆场：国外场站费+铁路运费+公路 -->
              <!-- <el-col :span="8"
                      v-if="item.bookingInquiry.bookingService==3&&item.bookingInquiry.deliveryType==1&&item.bookingInquiry.eastOrWest==1">
                <div class="grid-content">总价：{{item.deliveryFees}}{{item.deliveryCurrencyType}}+{{item.railwayFees}}{{item.railwayCurrencyType}}</div>
              </el-col>-->
              <!-- 回程： 只有铁路运费+公路 -->
              <!-- <el-col :span="8"
                      v-if="item.bookingInquiry.bookingService==3&&item.bookingInquiry.eastOrWest==1">
                <div class="grid-content">总价：{{item.deliveryFees}}{{item.deliveryCurrencyType}}+{{item.railwayFees}}{{item.railwayCurrencyType}}</div>
              </el-col>-->
              <el-col :span="8">
                <div class="grid-content">下货站：{{ item.dropStation }}</div>
              </el-col>
            </el-row>
          </div>
          <!-- <el-button
            v-if="item.enquiryState == 1 || item.enquiryState == 2"
            type="primary"
            style="margin-top:20px;margin-left:46%"
            @click="sentFix(item)"
          >确认</el-button> -->
        </div>
      </el-card>

      <!-- 询价方案详情 -->
      <el-dialog
        :title="titleResult"
        append-to-body
        :visible.sync="openResult"
        width="85%"
        :destroy-on-close="true"
      >
        <el-form
          ref="formResult"
          :model="formResult"
          label-width="120px"
          class="adjustment"
          :disabled="ResultDisabled"
        >
          <el-row v-if="formResult.bookingInquiry">
            <el-col :span="8">
              <el-form-item label="客户名称:">
                <span
                  v-if="formResult.bookingInquiry.clientUnit"
                >{{ formResult.bookingInquiry.clientUnit }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            <el-form-item label="询价类型:" v-if="!!formResult.bookingInquiry.bookingTimeFlag">
            <span v-if="formResult.bookingInquiry.bookingTimeFlag==='0'">当月({{ this.currentMonth }}月)</span>
            <span v-if="formResult.bookingInquiry.bookingTimeFlag==='1'">次月({{ this.nextMonth }}月)</span>
            </el-form-item>  
            </el-col>
          </el-row>

          <el-row v-if="formResult.bookingInquiry">
            <el-col :span="20">
              <el-form-item
                label="提货方式:"
                v-if="
                formResult.bookingInquiry.goodsType === '0' &&
                  (formResult.bookingInquiry.bookingService == 0 ||
                    formResult.bookingInquiry.bookingService == 1)
              "
              >
                <span v-if="formResult.bookingInquiry.deliveryType === '1'">散货到堆场</span>
                <span v-else-if="formResult.bookingInquiry.deliveryType === '0'">整柜到堆场</span>
                <span v-else>-</span>
              </el-form-item>
              <el-form-item
                label="自送货方式:"
                v-if="
                formResult.bookingInquiry.goodsType === '0' &&
                  (formResult.bookingInquiry.bookingService == 2 ||
                    formResult.bookingInquiry.bookingService == 3)
              "
              >
                <span v-if="formResult.bookingInquiry.deliverySelfType === '0'">散货到堆场</span>
                <span v-else-if="formResult.bookingInquiry.deliverySelfType === '1'">整柜到堆场</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="20">
            <el-form-item label="委托送货方式" v-if="!!formResult.bookingInquiry.distributionType&&formResult.bookingInquiry.goodsType==='0'">
            <span v-if="formResult.bookingInquiry.distributionType === '1'">散货派送</span>
            <span v-else-if="formResult.bookingInquiry.distributionType === '0'">整柜派送</span>  
            </el-form-item>  
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="公路询价编码:">{{ formResult.inquiryNumber }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="集疏询价编码:">{{ formResult.inquiryNum }}</el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="委托ZIH报关:">
                <span v-if="formResult.bookingInquiry.isOrderCustoms === '1'">否</span>
                <span v-else-if="formResult.bookingInquiry.isOrderCustoms === '0'">是</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="委托ZIH提货:">
                <span v-if="formResult.bookingInquiry.isPickUp === '0'">是</span>
                <span v-else-if="formResult.bookingInquiry.isPickUp === '1'">否</span>
                <span v-else-if="formResult.bookingInquiry.isPickUp === '2'">铁路到货</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="委托ZIH清关:">
                <span v-if="formResult.bookingInquiry.isClearCustoms === '1'">是</span>
                <span v-else-if="formResult.bookingInquiry.isClearCustoms === '0'">否</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="由ZIH代理送货:">
                <span v-if="formResult.bookingInquiry.isDelivery === '0'">否</span>
                <span v-else-if="formResult.bookingInquiry.isDelivery === '1'">是</span>
                <span v-else>-</span>
              </el-form-item>
              </el-col>
            <el-col :span="8">
              <el-form-item label="箱属:">
                <span v-if="formResult.bookingInquiry.containerBelong === '1'">自备</span>
                <span v-else-if="formResult.bookingInquiry.containerBelong === '0'">委托zih</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="整拼箱:">
                <span v-if="formResult.bookingInquiry.goodsType === '0'">整柜</span>
                <span v-else-if="formResult.bookingInquiry.goodsType === '1'">拼箱</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 整柜特有字段 -->
          <el-row
            v-if="
            formResult.bookingInquiry &&
              formResult.bookingInquiry.goodsType === '0'
          "
          >
            <el-col :span="8">
              <el-form-item label="箱型:">{{ formResult.bookingInquiry.containerType }}</el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="箱量:">{{ formResult.bookingInquiry.containerNum }}</el-form-item>
            </el-col>
          </el-row>
          <!-- 拼箱特有字段 /散货派送也要显示||
              (formResult.bookingInquiry &&
              formResult.bookingInquiry.distributionType === '1')-->
          <el-row
            v-if="
            (formResult.bookingInquiry &&
              formResult.bookingInquiry.goodsType === '1') ||
              (formResult.bookingInquiry &&
                formResult.bookingInquiry.bookingService == 2 &&
                formResult.bookingInquiry.deliverySelfType === '0') ||
              (formResult.bookingInquiry &&
                formResult.bookingInquiry.bookingService == 3 &&
                formResult.bookingInquiry.deliverySelfType === '0') ||
              (formResult.bookingInquiry &&
                formResult.bookingInquiry.bookingService == 0 &&
                formResult.bookingInquiry.deliveryType === '1') ||
              (formResult.bookingInquiry &&
                formResult.bookingInquiry.bookingService == 1 &&
                formResult.bookingInquiry.deliveryType === '1')||
              (formResult.bookingInquiry &&
              formResult.bookingInquiry.distributionType === '1')
          "
          >
            <el-col :span="8">
              <el-form-item label="包装方式:">
                <span v-if="formResult.bookingInquiry.packageType">
                  {{
                  formResult.bookingInquiry.packageType
                  }}
                </span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否堆叠:">
                <span v-if="formResult.bookingInquiry.isStack === '1'">是</span>
                <span v-else-if="formResult.bookingInquiry.isStack === '0'">否</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否易碎:">
                <span v-if="formResult.bookingInquiry.goodsFragile === '1'">是</span>
                <span v-else-if="formResult.bookingInquiry.goodsFragile === '0'">否</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="是否超长超重:">
                <span v-if="form.goodsGeneral === '1'">是</span>
                <span v-else-if="form.goodsGeneral === '0'">否</span>
                <span v-else>-</span>
              </el-form-item>
            </el-col> -->
            <el-row
              v-for="(item, index) in formResult.bookingInquiry
              .bookingInquiryGoodsDetailsList"
              :key="index"
            >
              <el-col :span="4">
                <el-form-item label="品名:">
                  <span v-if="item.goodsName">{{ item.goodsName }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="单件数量:">
                  <span v-if="item.goodsAmount">{{ item.goodsAmount }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="单件重量(KG):">
                  <span v-if="item.goodsWeight">{{ item.goodsWeight }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label="长:">
                  <span v-if="item.goodsLength">{{ item.goodsLength }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="宽:">
                  <span v-if="item.goodsWidth">{{ item.goodsWidth }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="高:">
                  <span v-if="item.goodsHeight">{{ item.goodsHeight }}</span>
                  <span v-else>-</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-col :span="6">
              <el-form-item label="总数量:">
                <span v-if="formResult.bookingInquiry.totalAmount">
                  {{
                  formResult.bookingInquiry.totalAmount
                  }}
                </span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总重量:">
                <span v-if="formResult.bookingInquiry.totalWeight">
                  {{
                  formResult.bookingInquiry.totalWeight
                  }}
                </span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总体积:">
                <span v-if="formResult.bookingInquiry.totalVolume">
                  {{
                  formResult.bookingInquiry.totalVolume
                  }}
                </span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计费体积:" v-if="formResult.bookingInquiry.goodsType === '1'">
                <span v-if="formResult.bookingInquiry.billableVolume">
                  {{
                  formResult.bookingInquiry.billableVolume
                  }}
                </span>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="formResult.bookingInquiry">
            <el-col :span="20">
              <el-form-item label="发货地址:">
                <span v-if="formResult.pickUpAddress">
                  {{ formResult.bookingInquiry.senderProvince
                  }}{{ formResult.bookingInquiry.senderCity
                  }}{{ formResult.bookingInquiry.senderArea
                  }}{{ formResult.bookingInquiry.shipmentPlace }}
                </span>
                <!-- <span v-else-if="formResult.bookingInquiry.shipmentPlace">{{formResult.bookingInquiry.shipmentPlace}}</span> -->
                <span v-else>{{ formResult.bookingInquiry.uploadStation }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="收货地址:">
                <span v-if="formResult.deliveryAddress">
                  {{ formResult.bookingInquiry.receiveProvince
                  }}{{ formResult.bookingInquiry.receiveCity
                  }}{{ formResult.bookingInquiry.receiveArea
                  }}{{ formResult.bookingInquiry.receiptPlace }}
                </span>
                <!-- <span v-if="formResult.bookingInquiry.receiptPlace">{{formResult.bookingInquiry.receiptPlace}}</span> -->
                <span v-else>{{ formResult.bookingInquiry.dropStation }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formResult.bookingInquiry&&
          (formResult.bookingInquiry.bookingService === '0' ||
          (formResult.bookingInquiry.bookingService === '1' &&
          formResult.bookingInquiry.eastOrWest === '0') ||
          (formResult.bookingInquiry.bookingService === '3' &&
          formResult.bookingInquiry.eastOrWest === '1'))">
          <el-col :span="20">
          <el-form-item label="国内运输车辆类型:">
          <span v-if="formResult.bookingInquiry.truckType==='0'">普通车</span>
          <span v-if="formResult.bookingInquiry.truckType==='1'">普卡专车</span>
          <span v-if="formResult.bookingInquiry.truckType==='2'">白卡专车</span>
          </el-form-item>  
          </el-col>
          </el-row>
          <!-- 国内场站报价信息 -->
          <!-- <el-row v-if="formResult.bookingInquiry&&formResult.bookingInquiry.domesticFlag=='1'">
           <el-col :span="10">
           <el-form-item label="国内超长超重费">{{formResult.bookingInquiry.domesticOverFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国内超长超重费币种（默认美元）">{{formResult.bookingInquiry.domesticOverFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国内抛物理货费">{{formResult.bookingInquiry.domesticTallyFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国内抛物理货费币种">{{formResult.bookingInquiry.domesticTallyFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国内装箱费">{{formResult.bookingInquiry.domesticPackFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国内装箱费币种">{{formResult.bookingInquiry.domesticPackFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国内拆箱费">{{formResult.bookingInquiry.domesticUnPackFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国内拆箱费币种">{{formResult.bookingInquiry.domesticUnPackFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国内拼箱场站报价单号">{{formResult.bookingInquiry.domesticNumber}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国内拼箱场站报价备注">{{formResult.bookingInquiry.domesticRemark}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国内拼箱场站报价反馈时间">{{formResult.bookingInquiry.domesticFeedbackTime}}</el-form-item>  
           </el-col>
          </el-row> -->
          <!-- 国外场站报价信息 -->
          <!-- <el-row v-if="formResult.bookingInquiry&&formResult.bookingInquiry.foreignFlag=='1'">
           <el-col :span="10">
           <el-form-item label="国外超长超重费">{{formResult.bookingInquiry.foreignOverFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国外超长超重费币种（默认美元）">{{formResult.bookingInquiry.foreignOverFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国外抛物理货费">{{formResult.bookingInquiry.foreignTallyFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国外抛物理货费币种">{{formResult.bookingInquiry.foreignTallyFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国外装箱费">{{formResult.bookingInquiry.foreignPackFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国外装箱费币种">{{formResult.bookingInquiry.foreignPackFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国内拆箱费">{{formResult.bookingInquiry.domesticUnPackFee}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国外拆箱费">{{formResult.bookingInquiry.foreignUnPackFee}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国外拆箱费币种">{{formResult.bookingInquiry.foreignUnPackFeeCurrencyType}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国外场站报价单号">{{formResult.bookingInquiry.foreignNumber}}</el-form-item>  
           </el-col>
           <el-col :span="10">
           <el-form-item label="国外场站报价备注">{{formResult.bookingInquiry.foreignRemark}}</el-form-item>  
           </el-col>
           <el-col :span="12">
           <el-form-item label="国外场站报价反馈时间">{{formResult.bookingInquiry.foreignFeedbackTime}}</el-form-item>  
           </el-col>
          </el-row>  -->
          
          <!-- 备注 -->
          <el-row v-if="formResult.bookingInquiry">
            <el-col :span="8">
              <el-form-item label="客户备注:">{{ formResult.bookingInquiry.remark }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务备注:">
                <el-input type="textarea" :rows="2" placeholder v-model="formResult.businessRemark"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="formResult.bookingInquiry.bookingService === '0'&&
formResult.bookingInquiry.eastOrWest == '1'&&containerTypeHasRF">
              <el-form-item label="总价:">
                <el-input  :rows="2" placeholder="请输入币种或选择币种" v-model.trim="formResult.totalFees" ></el-input>
                <el-radio v-model.trim="formResult.fictitiousCurrency"  label="人民币">*人民币</el-radio>
                <el-radio v-model.trim="formResult.fictitiousCurrency"  label="美金">*美金</el-radio>
                <el-radio v-model.trim="formResult.fictitiousCurrency"  label="欧元">*欧元</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 询价方案报价费用 -->
        <div v-if="formResult.bookingInquiry">
          <div style="background:#eee;padding:10px 0;margin-left:15px;font-size:14px">报价费用：</div>
          <!--门到门或者门到站去程或者站到门（回程）显示公路部报价-->
          <div
            v-if="
            formResult.bookingInquiry.bookingService === '0' ||
              (formResult.bookingInquiry.bookingService === '1' &&
                formResult.bookingInquiry.eastOrWest === '0') ||
              (formResult.bookingInquiry.bookingService === '3' &&
                formResult.bookingInquiry.eastOrWest === '1')
          "
          >
            <div style="padding:15px 30px;font-size:16px">公路部报价费用：</div>
            <el-table :data="tableData1" stripe style="width: 100%">
              <el-table-column prop="eastOrWest" align="center" label="东/西向">
                <template slot-scope="scope">
                  <span v-if="scope.row.eastOrWest == '0'">西向</span>
                  <span v-else-if="scope.row.eastOrWest == '1'">东向</span>
                </template>
              </el-table-column>
              <el-table-column prop="inquiryNumber" align="center" label="公路询价编码">
              </el-table-column>
              <el-table-column prop="pickUpAddress" label="提/送货地址"></el-table-column>
              <el-table-column
                v-if="formResult.bookingInquiry.goodsType === '1'"
                prop="isStack"
                align="center"
                label="是否可堆叠"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.isStack == 0">否</span>
                  <span v-else-if="scope.row.isStack == 1">是</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="formResult.bookingInquiry.goodsType === '1'"
                prop="goodsWeight"
                align="center"
                label="重量(KGS)"
              ></el-table-column>
              <el-table-column
                v-if="formResult.bookingInquiry.goodsType === '1'"
                prop="totalVolume"
                align="center"
                label="体积（CBM）"
              ></el-table-column>
<!-- 公路 箱属委托zih
去程 整柜 整柜到堆场 门到门/门到站 特种箱 （显示提箱地选择）
回程 整柜 站到门/门到门 （显示还箱地、还箱平衡费，没有值要可选） -->
<!-- 箱属自备箱①去回程整柜门到门,整柜到堆场-显示提还箱地
②去回程整柜门到站,整柜到堆场-显示提箱地信息
③去回程整柜站到站,客户自送货方式-不显示提还箱地信息
④去回程整柜站到门,客户自送货方式-显示还箱地信息 -->
              <el-table-column
                v-if="
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '1' &&
                  formResult.bookingInquiry.bookingService === '0'&&
                  formResult.bookingInquiry.containerBelong === '0') ||
                  (formResult.bookingInquiry.goodsType === '0' &&
                    formResult.bookingInquiry.eastOrWest == '1' &&
                    formResult.bookingInquiry.bookingService === '3'&&
                    formResult.bookingInquiry.containerBelong === '0')
              "
                align="center"
                label="还箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-if="scope.row.hxAddress"
                    v-model.trim="scope.row.hxAddress"
                    disabled
                  />
                  <el-select
                    v-else
                    v-model.trim="params.hxAddress"
                    filterable
                    clearable
                    style="width: 180px"
                    placeholder="请选择"
                    :disabled="activeName !== '1'"
                    @change="hxAddressEdit(params.hxAddress)"
                  >
                    <el-option
                      v-for="(item, index) in returnOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 自备箱还箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '1'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.deliveryType == '0'&&
              formResult.bookingInquiry.bookingService === '0'&&
              formResult.bookingInquiry.containerBelong === '1'"
                align="center"
                label="还箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.hxAddress"
                    disabled
                  />
                </template>
              </el-table-column>
              <!-- 自备箱还箱地站到门,客户自送货方式,显示还箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '1'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.bookingService === '3'&&
              formResult.bookingInquiry.deliverySelfType === '1'&&
              formResult.bookingInquiry.containerBelong === '1'"
                align="center"
                label="还箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.hxAddress"
                    disabled
                  />
                </template>
              </el-table-column>

              <el-table-column
                v-if="
                formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '0' &&
                  formResult.bookingInquiry.deliveryType == '0'&&
                  formResult.bookingInquiry.containerBelong === '0'&&
                  (formResult.bookingInquiry.bookingService === '0' ||
                    formResult.bookingInquiry.bookingService === '1') &&
                  (containerTypeHasRF || containerTypeHasOT || containerTypeHasHT || containerTypeHasMT)
              "
                align="center"
                label="提箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-if="scope.row.txAddress"
                    v-model.trim="scope.row.txAddress"
                    disabled
                  />
                  <el-select
                    v-else
                    v-model.trim="params.txAddress"
                    filterable
                    clearable
                    style="width: 160px"
                    placeholder="请选择"
                    @change="txAddressEdit(params.txAddress)"
                  >
                    <el-option
                      v-for="(item, index) in pickUpOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 自备箱提箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '0'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.deliveryType == '0'&&
              formResult.bookingInquiry.bookingService === '0'&&
              formResult.bookingInquiry.containerBelong === '1'
              "
                align="center"
                label="提箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.txAddress"
                    disabled
                  />
                 </template>
              </el-table-column>
              <!-- 自备箱门到站提箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '0'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.deliveryType == '0'&&
              formResult.bookingInquiry.bookingService === '1'&&
              formResult.bookingInquiry.containerBelong === '1'
              "
                align="center"
                label="提箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.txAddress"
                    disabled
                  />
                 </template>
              </el-table-column>

              <el-table-column
                v-if="
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '1' &&
                  formResult.bookingInquiry.containerBelong === '0'&&
                  formResult.bookingInquiry.bookingService === '0') ||
                  (formResult.bookingInquiry.goodsType === '0' &&
                    formResult.bookingInquiry.eastOrWest == '1' &&
                    formResult.bookingInquiry.containerBelong === '0'&&
                    formResult.bookingInquiry.bookingService === '3')
              "
                align="center"
                label="还箱平衡费"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-if="scope.row.returnBoxFee"
                    v-model.trim="scope.row.returnBoxFee"
                    disabled
                  />
                  <el-input size="mini" v-else v-model.trim="params.returnBoxFee" disabled />
                </template>
              </el-table-column>
              <!-- 20210123 10:00 公路部报价费用新增提箱平衡费显示，显示条件：整柜、去程、整柜到堆场、门到门/门到站、特种箱 -->
              <el-table-column
                v-if="
                formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '0' &&
                  formResult.bookingInquiry.deliveryType == '0'&&
                  (formResult.bookingInquiry.bookingService === '0' ||
                    formResult.bookingInquiry.bookingService === '1') &&
                  (containerTypeHasRF || containerTypeHasOT || containerTypeHasHT || containerTypeHasMT)
              "
                align="center"
                label="提箱平衡费"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-if="scope.row.pickUpBoxFee"
                    v-model.trim="scope.row.pickUpBoxFee"
                    disabled
                  />
                  <el-input size="mini" v-else v-model.trim="params.pickUpBoxFee" disabled />
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格">
                <template slot-scope="scope" >
                  <el-input
                    v-if="scope.row.eastOrWest === '0'&&scope.row.enquiryState!=='3'"
                    size="mini"
                    v-model.trim="params.pickUpFees"
                    @mouseover.native="jiru(scope.row)"
                    class="Colorx"
                    :disabled="activeName !== '1'"
                    @change="pickUpFeesEdit(params.pickUpFees)"
                  />
                  <el-input
                    v-else-if="scope.row.eastOrWest === '0'"
                    size="mini"
                    v-model.trim="params.pickUpFees"
                    @mouseover.native="jiru(scope.row)"
                    :disabled="activeName !== '1'"
                    @change="pickUpFeesEdit(params.pickUpFees)"
                  />
                  <el-input
                    v-if="scope.row.eastOrWest === '1'&&scope.row.enquiryState!='3'"
                    size="mini"
                    v-model.trim="params.deliveryFees"
                    @mouseover.native="jiru(scope.row)"
                    class="Colorx"
                    :disabled="activeName !== '1'"
                    @change="deliveryFeesEdit(params.deliveryFees)"
                  />
                  <el-input
                    v-else-if="scope.row.eastOrWest ==='1'"
                    size="mini"
                    v-model.trim="params.deliveryFees"
                    @mouseover.native="jiru(scope.row)"
                    :disabled="activeName !== '1'"
                    @change="deliveryFeesEdit(params.deliveryFees)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="pickUpCurrencyType" align="center" label="币种"></el-table-column>
              <el-table-column prop="xxyoRemark" align="center" label="备注">
              <template slot-scope="scope">
              <el-input
                    v-if="scope.row.eastOrWest ==='1'&&scope.row.goodsType ==='0'&&
                    (scope.row.lineType === '2'||scope.row.lineType === '3'||scope.row.lineType === '4')"
                    size="mini"
                    v-model.trim="params.xxyoRemark"
                    :disabled="activeName !== '1'"
                    @change="xxyoRemarkEdit(params.xxyoRemark)"
                  />
              <span v-else>{{scope.row.xxyoRemark}}</span>    
              </template>  
              </el-table-column>
              <el-table-column v-if="formResult.bookingInquiry.eastOrWest === '0' && params.pickUpFees!=null"  align="center" label="有效期">
              <template slot-scope="scope">
              <span v-if="scope.row.pickUpExpiration">{{scope.row.pickUpExpiration}}</span>
              </template>
              </el-table-column>
              <el-table-column v-if="formResult.bookingInquiry.eastOrWest === '1' &&  params.deliveryFees!=null"  align="center" label="有效期">
                <template slot-scope="scope">
                  <!-- <el-input
                    v-if="scope.row.eastOrWest ==='1'&&scope.row.goodsType ==='0'&&scope.row.deliveryExpiration&&
                    (scope.row.lineType === '2'||scope.row.lineType === '3'||scope.row.lineType === '4')"
                    size="mini"
                    v-model.trim="params.deliveryExpiration"
                    :disabled="activeName !== '1'"
                    @change="deliveryExpirationEdit(params.deliveryExpiration)"
                  /> -->
                  <el-date-picker
                   v-if="scope.row.eastOrWest ==='1'&&scope.row.goodsType ==='0'&&
                    (scope.row.lineType === '2'||scope.row.lineType === '3'||scope.row.lineType === '4')"
                  clearable
                  size="mini"
                  v-model.trim="params.deliveryExpiration"
                  :disabled="activeName !== '1'"
                  class="lj"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择日期"
                  >
                  </el-date-picker>
              <span v-else-if="scope.row.deliveryExpiration">{{scope.row.deliveryExpiration}}</span>
              </template>
              </el-table-column>
            </el-table>
          </div>
          <!--门到门或者门到站回程或者站到门（去程都是）显示集疏部报价 -->
          <div
            v-if="
            formResult.bookingInquiry.bookingService === '0' ||
              (formResult.bookingInquiry.bookingService === '1' &&
                formResult.bookingInquiry.eastOrWest === '1') ||
              (formResult.bookingInquiry.bookingService === '3' &&
                formResult.bookingInquiry.eastOrWest === '0')
          "
          >
            <div style="padding:15px 30px;font-size:16px">集疏部报价费用：</div>
            <el-table :data="tableData2" stripe style="width: 100%">
              <el-table-column prop="deliveryAddress" align="center" label="提/送货地"></el-table-column>
              <!-- <el-table-column
              prop="deliveryDistance"
              align="center"
              label="距离（KM）"
              >  </el-table-column>-->
              <el-table-column prop="inquiryNum" align="center" label="集疏询价编码"></el-table-column>
              <el-table-column prop="deliveryAging" align="center" label="时效（天）"></el-table-column>
              <!-- 集疏
                  去程 整柜 门到门/站到门 （显示还箱地、还箱平衡费）
                  回程 整柜 门到站/门到门 整柜到堆场（显示提箱地、提箱平衡费） -->

              <el-table-column
                v-if="
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '0' &&
                  formResult.bookingInquiry.containerBelong === '0'&&
                  formResult.bookingInquiry.bookingService === '0') ||
                  (formResult.bookingInquiry.goodsType === '0' &&
                    formResult.bookingInquiry.eastOrWest == '0' &&
                    formResult.bookingInquiry.containerBelong === '0'&&
                    formResult.bookingInquiry.bookingService === '3')
              "
                prop="hxAddress"
                align="center"
                label="还箱地"
              ></el-table-column>
              <!-- 自备箱还箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '0'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.deliveryType == '0'&&
              formResult.bookingInquiry.bookingService === '0'&&
              formResult.bookingInquiry.containerBelong === '1'"
                align="center"
                label="还箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.hxAddress"
                    disabled
                  />
                </template>
              </el-table-column>
              <!-- 自备箱还箱地站到门,客户自送货方式,显示还箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '0'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.bookingService === '3'&&
              formResult.bookingInquiry.deliverySelfType === '1'&&
              formResult.bookingInquiry.containerBelong === '1'"
                align="center"
                label="还箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.hxAddress"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column
                v-if="
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '0' &&
                  formResult.bookingInquiry.containerBelong === '0'&&
                  formResult.bookingInquiry.bookingService === '0') ||
                  (formResult.bookingInquiry.goodsType === '0' &&
                    formResult.bookingInquiry.eastOrWest == '0' &&
                    formResult.bookingInquiry.containerBelong === '0'&&
                    formResult.bookingInquiry.bookingService === '3')
              "
                prop="returnBoxFee"
                align="center"
                label="还箱平衡费"
              ></el-table-column>
             
              <el-table-column
                v-if="
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '1' &&
                  formResult.bookingInquiry.deliveryType == '0' &&
                  formResult.bookingInquiry.containerBelong === '0'&&
                  formResult.bookingInquiry.bookingService === '0') ||
                  (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '1' &&
                  formResult.bookingInquiry.deliveryType == '0' &&
                  formResult.bookingInquiry.containerBelong === '0'&&
                    formResult.bookingInquiry.bookingService === '1')
              "
                prop="txAddress"
                align="center"
                label="提箱地"
              ></el-table-column>
              <!-- 自备箱提箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '1'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.deliveryType == '0'&&
              formResult.bookingInquiry.bookingService === '0'&&
              formResult.bookingInquiry.containerBelong === '1'
              "
                align="center"
                label="提箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.txAddress"
                    disabled
                  />
                 </template>
              </el-table-column>
              <!-- 自备箱门到站提箱地 -->
              <el-table-column
                v-if="
              formResult.bookingInquiry.eastOrWest == '1'&&
              formResult.bookingInquiry.goodsType === '0'&&
              formResult.bookingInquiry.deliveryType == '0'&&
              formResult.bookingInquiry.bookingService === '1'&&
              formResult.bookingInquiry.containerBelong === '1'
              "
                align="center"
                label="提箱地"
              >
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model.trim="scope.row.txAddress"
                    disabled
                  />
                 </template>
              </el-table-column>
              <el-table-column
                 v-if="
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '1' &&
                  formResult.bookingInquiry.deliveryType == '0' &&
                  formResult.bookingInquiry.containerBelong === '0'&&
                  formResult.bookingInquiry.bookingService === '0') ||
                  (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest == '1' &&
                  formResult.bookingInquiry.deliveryType == '0' &&
                  formResult.bookingInquiry.containerBelong === '0'&&
                    formResult.bookingInquiry.bookingService === '1')
              "
                prop="pickUpBoxFee"
                align="center"
                label="提箱平衡费"
              ></el-table-column>
              <el-table-column align="center" label="集疏价格">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.eastOrWest == '1'"
                    size="mini"
                    v-model.trim="params.pickUpFees"
                    :disabled="activeName !== '1'"
                    @change="pickUpFeesEdit(params.pickUpFees)"
                  />
                  <el-input
                    v-if="scope.row.eastOrWest == '0'"
                    size="mini"
                    v-model.trim="params.deliveryFees"
                    :disabled="activeName !== '1'"
                    @change="deliveryFeesEdit(params.deliveryFees)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="deliveryCurrencyType" align="center" label="币种"></el-table-column>
              <el-table-column prop="jsBidder" align="center" label="报价人"></el-table-column>
              <el-table-column prop="deliveryRemark" align="center" label="备注"></el-table-column>
            <el-table-column v-if="formResult.bookingInquiry.eastOrWest === '1' && params.pickUpFees!=null"  align="center" label="有效期">
               <template slot-scope="scope">
            <span v-if="scope.row.pickUpExpiration">{{scope.row.pickUpExpiration}}</span>
            </template>
            </el-table-column>
              <el-table-column v-if="formResult.bookingInquiry.eastOrWest === '0' && params.deliveryFees!=null"  align="center" label="有效期">
                <template slot-scope="scope">
            <span v-if="scope.row.deliveryExpiration">{{scope.row.deliveryExpiration}}</span>
            </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 铁路报价一直都显示 -->
          <div style="padding:15px 30px;font-size:16px">铁路报价费用：</div>
          <el-table :data="tableData3" stripe style="width: 100%">
            <el-table-column prop="uploadStation" align="center" label="上货站"></el-table-column>
            <el-table-column prop="dropStation" align="center" label="下货站"></el-table-column>
            <el-table-column prop="railwayAging" align="center" label="时效"></el-table-column>
            <el-table-column align="center" label="价格">
              <template slot-scope="scope">
                <el-input
                  size="mini"
                  v-if="scope.row.bookingInquiry.clientType == 1&&params.railwayFees==='0'"
                  v-model.trim="params.railwayFees"
                  class="Colorx"
                  :disabled="activeName !== '1'"
                  @change="railwayFeesEdit(params.railwayFees)"
                />
                <el-input
                    v-else-if="scope.row.bookingInquiry.eastOrWest ==='1'&&scope.row.bookingInquiry.goodsType ==='0'&&params.railwayFees==='0'&&
                    (scope.row.bookingInquiry.lineType === '2'||scope.row.bookingInquiry.lineType === '3'||scope.row.bookingInquiry.lineType === '4')"
                    size="mini"
                    v-model.trim="params.railwayFees"
                    class="Colorx"
                    :disabled="activeName !== '1'"
                    @change="railwayFeesEdit(params.railwayFees)"
                  />
                  <el-input
                    v-else-if="scope.row.bookingInquiry.eastOrWest ==='1'&&scope.row.bookingInquiry.goodsType ==='0'&&
                    (scope.row.bookingInquiry.lineType === '2'||scope.row.bookingInquiry.lineType === '3'||scope.row.bookingInquiry.lineType === '4')"
                    size="mini"
                    v-model.trim="params.railwayFees"
                    :disabled="activeName !== '1'"
                    @change="railwayFeesEdit(params.railwayFees)"
                  />
                <el-input
                  size="mini"
                  v-else-if="scope.row.bookingInquiry.clientType == 1"
                  v-model.trim="params.railwayFees"
                  :disabled="activeName !== '1'"
                  @change="railwayFeesEdit(params.railwayFees)"
                />
                
                 <el-input
                  size="mini"
                  v-else-if="params.railwayFees==='0'"
                  v-model.trim="params.railwayFees"
                  class="Colorx"
                  :disabled="railwayFeesOld !== '0'||activeName !== '1'"
                  @change="railwayFeesEdit(params.railwayFees)"
                />
                <el-input
                  size="mini"
                  v-else
                  v-model.trim="params.railwayFees"
                  :disabled="railwayFeesOld !== '0'||activeName !== '1'"
                  @change="railwayFeesEdit(params.railwayFees)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="railwayCurrencyType" align="center" label="币种"></el-table-column>
            <el-table-column
              v-if="
              (formResult.bookingInquiry.goodsType === '0' &&
                formResult.bookingInquiry.deliverySelfType === '1' &&
                formResult.bookingInquiry.bookingService === '2'&&
                formResult.bookingInquiry.containerBelong === '0') ||
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.deliverySelfType === '1' &&
                  formResult.bookingInquiry.bookingService === '3'&&
                  formResult.bookingInquiry.containerBelong === '0')
            "
              prop="txAddress"
              align="center"
              label="提箱地"
            ></el-table-column>
            <!-- 20210122 16:30 提箱平衡费新增一种现实情况：去程、整柜、欧线、陆港箱（箱属：委托zih） -->
            <el-table-column
              v-if="
              (formResult.bookingInquiry.goodsType === '0' &&
                formResult.bookingInquiry.deliverySelfType === '1' &&
                formResult.bookingInquiry.bookingService === '2'&&
                formResult.bookingInquiry.containerBelong === '0') ||
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.deliverySelfType === '1' &&
                  formResult.bookingInquiry.bookingService === '3'&&
                  formResult.bookingInquiry.containerBelong === '0') ||
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.eastOrWest === '0' && 
                  formResult.bookingInquiry.containerBelong === '0' &&
                  formResult.bookingInquiry.lineType === '0' &&
                  !(containerTypeHasRF || containerTypeHasOT || containerTypeHasHT || containerTypeHasMT)
                ) || (formResult.bookingInquiry.goodsType === '0' && ( formResult.bookingInquiry.distributionType === '1' ||  formResult.bookingInquiry.deliveryType === '1' ))
            "
              prop="pickUpBoxFee"
              align="center"
              label="提箱平衡费"
            ></el-table-column>
            <el-table-column
              v-if="
              (formResult.bookingInquiry.goodsType === '0' &&
                formResult.bookingInquiry.bookingService === '1'&&
                formResult.bookingInquiry.containerBelong === '0') ||
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.bookingService === '2'&&
                  formResult.bookingInquiry.containerBelong === '0')
            "
              prop="hxAddress"
              align="center"
              label="还箱地"
            ></el-table-column>
            <el-table-column
              v-if="
              (formResult.bookingInquiry.goodsType === '0' &&
                formResult.bookingInquiry.bookingService === '1'&&
                formResult.bookingInquiry.containerBelong === '0') ||
                (formResult.bookingInquiry.goodsType === '0' &&
                  formResult.bookingInquiry.bookingService === '2'&&
                  formResult.bookingInquiry.containerBelong === '0')
            "
              prop="returnBoxFee"
              align="center"
              label="还箱平衡费"
            ></el-table-column>
            <el-table-column  align="center" label="备注">
            <template slot-scope="scope">
            <el-input
                    v-if="scope.row.bookingInquiry.eastOrWest ==='1'&&scope.row.bookingInquiry.goodsType ==='0'&&
                    (scope.row.bookingInquiry.lineType === '2'||scope.row.bookingInquiry.lineType === '3'||scope.row.bookingInquiry.lineType === '4')"
                    size="mini"
                    v-model.trim="params.railwayRemark"
                    :disabled="activeName !== '1'"
                    @change="railwayRemarkEdit(params.railwayRemark)"
                  />
            <span v-else>{{scope.row.railwayRemark}}</span>      
            </template>  
            </el-table-column>
            <el-table-column    align="center" label="有效期" width="110px"> 
            <template slot-scope="scope" >
              <!-- <el-input
                    v-if="scope.row.eastOrWest ==='1'&&scope.row.goodsType ==='0'&&scope.row.railwayExpiration&&
                    (scope.row.lineType === '2'||scope.row.lineType === '3'||scope.row.lineType === '4')"
                    size="mini"
                    v-model.trim="params.railwayExpiration"
                    :disabled="activeName !== '1'"
                    @change="railwayExpirationEdit(params.railwayExpiration)"
                  /> -->
               <el-date-picker
              v-if="scope.row.bookingInquiry.eastOrWest ==='1'&&scope.row.bookingInquiry.goodsType ==='0'&&
                    (scope.row.bookingInquiry.lineType === '2'||scope.row.bookingInquiry.lineType === '3'||scope.row.bookingInquiry.lineType === '4')"
               clearable
               size="mini"
               v-model.trim="params.railwayExpiration"
               :disabled="activeName !== '1'"
               class="lj"
               type="date"
               value-format="yyyy-MM-dd"
               placeholder="请选择日期"
              >
              </el-date-picker>
            <span v-else-if="scope.row.railwayExpiration">{{scope.row.railwayExpiration}}</span>
            <!-- <span v-else-if="railwayFeesOld==='0'" >
            <el-date-picker
                  v-model.trim="params.railwayExpiration"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
            </el-date-picker>
            </span> -->
            </template>
            </el-table-column>
          </el-table>
          <div v-if="formResult.bookingInquiry && formResult.bookingInquiry.domesticFlag=='1'">
            <div style="padding:15px 30px;font-size:16px">国内场站报价信息：</div>
            <el-table :data="tableData3" stripe style="width: 100%">
              <el-table-column prop="domesticOverFee" align="center" label="国内超长超重费"></el-table-column>
              <el-table-column prop="domesticOverFeeCurrencyType" align="center" label="国内超长超重费币种（默认美元）"></el-table-column>
              <el-table-column prop="domesticTallyFee" align="center" label="国内抛物理货费"></el-table-column>
			        <el-table-column prop="domesticTallyFeeCurrencyType" align="center" label="国内抛物理货费币种"></el-table-column>
              <el-table-column prop="domesticPackFee" align="center" label="国内装箱费"></el-table-column>
              <el-table-column prop="domesticPackFeeCurrencyType" align="center" label="国内装箱费币种"></el-table-column>
			        <el-table-column prop="domesticUnPackFee" align="center" label="国内拆箱费"></el-table-column>
              <el-table-column prop="domesticUnPackFeeCurrencyType" align="center" label="国内拆箱费币种"></el-table-column>
              <el-table-column prop="domesticNumber" align="center" label="国内拼箱场站报价单号"></el-table-column>
			        <el-table-column prop="domesticRemark" align="center" label="国内拼箱场站报价备注"></el-table-column>
              <el-table-column prop="domesticFeedbackTime" align="center" label="国内拼箱场站报价反馈时间"></el-table-column>
            </el-table>
          </div>
		  
        <div v-if="formResult.bookingInquiry && formResult.bookingInquiry.foreignFlag=='1'">
          <div style="padding:15px 30px;font-size:16px">国外场站报价信息：</div>
            <el-table :data="tableData3" stripe style="width: 100%">
              <el-table-column prop="foreignOverFee" align="center" label="国外超长超重费"></el-table-column>
              <el-table-column prop="foreignOverFeeCurrencyType" align="center" label="国外超长超重费币种（默认美元）"></el-table-column>
              <el-table-column prop="foreignTallyFee" align="center" label="国外抛物理货费"></el-table-column>
			        <el-table-column prop="foreignTallyFeeCurrencyType" align="center" label="国外抛物理货费币种"></el-table-column>
              <el-table-column prop="foreignPackFee" align="center" label="国外装箱费"></el-table-column>
              <el-table-column prop="foreignPackFeeCurrencyType" align="center" label="国外装箱费币种"></el-table-column>
			        <el-table-column prop="foreignUnPackFee" align="center" label="国外拆箱费"></el-table-column>
              <el-table-column prop="foreignUnPackFeeCurrencyType" align="center" label="国外拆箱费币种"></el-table-column>
              <el-table-column prop="foreignNumber" align="center" label="国外场站报价单号"></el-table-column>
			        <el-table-column prop="foreignRemark" align="center" label="国外场站报价备注"></el-table-column>
              <el-table-column prop="foreignFeedbackTime" align="center" label="国外场站报价反馈时间"></el-table-column>
            </el-table>
          </div>  
          <p>{{ formResult.jsRemark }}</p>
          <p v-if="formResult.bookingInquiry.qgfy">清关费用标准:{{ formResult.bookingInquiry.qgfy }}</p>
          <p v-if="formResult.bookingInquiry.czfy">场站费用标准:{{ formResult.bookingInquiry.czfy }}</p>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            v-if="activeName !== '2'&&activeName !== '4'"
            @click="submitFees"
            v-hasPermi="['clients:clients:submit']"
          >确定修改</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  getDetail,
  InquiryResult,
  editResult,
  detailResult,
  sendCustomers,
  returnList,
  pickList,
  judgeTxAddress
} from "@/api/enquiryPrice/enquiryPrice";
import {
  validatePhone,
  validateTelphone,
  validateEMail
} from "@/api/validator";
import "@/assets/styles/selfCss0.css";

export default {
  name: "EnquiryPrice",
  data() {
    return {
      railwayFeesOld:null,
      pickUpFeesOld:null,
      currentMonth:0,
      nextMonth:0,
      deliveryFeesOld:null,
      fictitiousCurrency:"人民币",
      containerTypeHasRF: false,
      containerTypeHasOT: false,
      containerTypeHasHT:false,
      containerTypeHasMT:false,
      bookingTimeFlag:null,
      distributionType:null,
      bohuiRow: null,
      bohuiDialog: false,
      bohuiInfo: null,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      returnOptions: [],
      pickUpOptions: [],
      params: {
        id: "",
        pickUpFees: "",
        deliveryFees: "",
        railwayFees: "",
        xxyoRemark:"",
        railwayRemark:"",
        pickUpExpiration:"",  
        deliveryExpiration:"", 
        railwayExpiration:"",
        businessRemark: "",
        totalFees: "",
        fictitiousCurrency: "",
        hxAddress: "",
        returnBoxFee: "",
        txAddress: "",
        pickUpBoxFee: "",
        inquiryId: ""
      },
      listScheme: {},
      activeName: "0",
      value6: null,
      benginToend: [], //客户审核弹框中 合同的有效期限时间段数组
      inquirySchemeBox: false, // 询价方案 弹框状态
      ids0: [],
      currentDirection: null,
      heightScreen:null,
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
      //询价方案详情弹出层标题
      titleResult: "",
      // 询价详情是否显示弹出层
      open: false,
      // 询价方案详情是否显示弹出层
      openResult: false,
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
        inquiryState: "0",
        clientUnit: null
      },
      createdate: [], // 查询条件中的注册时间 是个时间段数组，
      // 表单参数
      form: {},
      //询价方案表单参数
      formResult: {},
      benginToend0: [], //客户新增、修改 弹框中 合同的有效期限时间段数组
      formDisabled: false,
      ResultDisabled: false,
      // 表单校验
      rules: {
        showEdit1: [],
        showEdit2: []
      },
      starLevel0: 0,
      starLevel: 0,
      currentStatus: null //当前列表显示状态
    };
  },
  created() {
    this.queryParams["deptCode"] = this.$store.getters.deptCode;
    this.getList();
  },
  mounted() {
    if(window.screen.height > 800){
        this.heightScreen = 600
      }else{
        this.heightScreen = 500
      }
    // let d = new Date();
    // let n = d.getMonth()
    // this.currentMonth=n+1
    // this.currentMonth= this.currentMonth + '月'
    // this.nextMonth=n+2
    // this.nextMonth= this.nextMonth + '月'
  },
  watch: {
    createdate: {
      handler: function(val) {
        if (val && val.length > 0) {
          this.queryParams.inquiryStartTime = val[0];
          this.queryParams.inquiryEndTime = val[1];
        } else {
          this.queryParams.inquiryStartTime = null;
          this.queryParams.inquiryEndTime = null;
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
    open1: {
      handler: function(val) {
        if (val === false) {
          this.benginToend = [];
        }
      }
    },

    open: {
      handler: function(val) {
        if (val === false) {
          this.benginToend0 = [];
        }
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /**  询价方案 打开弹框 */
    handleScheme(row) {
      const id = row.id;
      InquiryResult(id).then(response => {
        if (response.data.length == 0) {
          this.$message({
            message: "暂无报价信息",
            type: "warning"
          });
        } else {
          this.listScheme = response.data;
          this.inquirySchemeBox = true;
        }
      });
    },
    /**  询价方案 确定按钮 */
    sentFix(item) {
      const idar = {
        id: item.id,
        enquiryState: item.enquiryState
      };
      editResult(idar).then(response => {
        if (response.code === 200) {
          this.msgSuccess("操作成功");
          this.inquirySchemeBox = false;
        } else {
          this.msgError(response.msg);
        }
      });
    },

    /**  询价方案 驳回 */
    handleSend1() {
      // if(this.bohuiInfo){
      let row = this.bohuiRow;
      let idarr = {};
      // 驳回 参数
      idarr = {
        id: row.id,
        orderId: row.orderId,
        inquiryState: "4",
        turndownReason: this.bohuiInfo
      };

      sendCustomers(idarr).then(response => {
        if (response.code === 200) {
          this.bohuiDialog = false;
          this.msgSuccess("驳回成功");
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
      // }else{
      //    this.msgError('请填写驳回原因')
      // }
    },

    /**  询价方案 发送客户 */
    handleSend(row, obj) {
      // 1、箱属： containerBelong （0：自备；1：zih）
      // 2、整拼箱 ：goodsType （0：整柜；1：拼箱）
      // 3、是否由ZIH提货：isPickUp （0是 1否  2铁路到货）
      // 4、提货方式是： deliveryType    （0整柜到堆场，1散货到堆场）
      // 4、自送货方式是： deliverySelfType    （0整柜到堆场，1散货到堆场）
      // 5、提箱地：txAddress
      // 6、还箱地：hxAddress

      //   还箱地点显示条件：
      //          1、箱属：委托ZIH（0）
      //          3、整柜

      // if(row.containerBelong === '1' && row.goodsType === '0' && !row.hxAddress){
      //   this.$message.error('抱歉,还箱地不能为空')
      //   return false
      // }

      //  提箱地显示情况
      //            1、由ZIH提货：是，提货方式是：整箱到车站
      //            2、由ZIH提货：否，箱属：委托zih，自送货方式是：整箱到车站
      // if(row.isPickUp === '0' && row.goodsType === '0' && row.deliveryType === '0' && !row.txAddress){
      //   this.$message.error('抱歉,提箱地不能为空')
      //   return false
      // }else if(row.containerBelong === '1' && row.isPickUp === '1' && row.deliverySelfType === '0' && row.goodsType === '0' && !row.txAddress){
      //   this.$message.error('抱歉,提箱地不能为空')
      //   return false
      // }
      if(obj === "0"){
      judgeTxAddress(row.id).then(response => {
        if (response.code === 200) {
            let idarr = {};
        // 发送客户 参数
        idarr = {
          id: row.id,
          orderId: row.orderId,
          inquiryState: "3"
        };

        sendCustomers(idarr).then(response => {
          if (response.code === 200) {
            this.msgSuccess("发送成功");
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
          } else {
            this.msgError(response.msg);
          }
      });
      }else if(obj === "1"){
      this.bohuiRow = row;
      this.bohuiDialog = true;
      }
      },

    //  if(row.containerType!=null&&(row.containerType.includes(
    //         "RF"
    //       )||row.containerType.includes(
    //         "OT"
    //       ))){
    //     if(row.goodsType === '0' &&
    //               row.eastOrWest == '0' &&
    //               row.deliveryType == '0'&&
    //               (row.bookingService === '0' ||
    //                 row.bookingService === '1') &&
    //               (row.containerType || row.containerType)&&!row.txAddress){
    //      this.$message.error('抱歉,询价方案中公路报价-提箱地不能为空')
    //      return false
    //   }
    //       }

      

      
    
    /**  询价方案 查看报价详情 */
    enquiryDetails(id) {
      this.titleResult = "询价详情";
      detailResult(id).then(response => {
        this.formResult = response.data;
        if (response.data.bookingInquiry.eastOrWest == "0") {
            this.openResult = true;

          // 西向
          let tiHuo = {
            eastOrWest: response.data.bookingInquiry.eastOrWest,
            goodsType: response.data.bookingInquiry.goodsType,
            lineType: response.data.bookingInquiry.lineType,
            isStack: response.data.bookingInquiry.isStack,
            pickUpAddress: response.data.pickUpAddress,
            goodsWeight: response.data.bookingInquiry.totalWeight,
            totalVolume: response.data.bookingInquiry.totalVolume,
            billableVolume: response.data.bookingInquiry.billableVolume,
            pickUpFees: response.data.pickUpFees,
            pickUpFeesOld: response.data.pickUpFees,
            txAddress: response.data.txAddress,
            pickUpBoxFee: response.data.pickUpBoxFee,
            pickUpCurrencyType: response.data.pickUpCurrencyType,
            xxyoRemark: response.data.xxyoRemark,
            pickUpExpiration:response.data.pickUpExpiration,
            deliveryExpiration:response.data.deliveryExpiration,
            enquiryState:response.data.enquiryState,
            inquiryNumber:response.data.inquiryNumber
          };
          this.tableData1[0] = tiHuo;

          let songHuo = {
            eastOrWest: response.data.bookingInquiry.eastOrWest,
            deliveryAddress: response.data.deliveryAddress,
            deliveryDistance: response.data.deliveryDistance,
            deliveryAging: response.data.deliveryAging,
            hxAddress: response.data.hxAddress,
            returnBoxFee: response.data.returnBoxFee,
            deliveryFees: response.data.deliveryFees,
            deliveryCurrencyType: response.data.deliveryCurrencyType,
            deliveryRemark: response.data.deliveryRemark,
            jsBidder: response.data.jsBidder,
            pickUpExpiration:response.data.pickUpExpiration,
            deliveryExpiration:response.data.deliveryExpiration,
            enquiryState:response.data.enquiryState,
            inquiryNum:response.data.inquiryNum
          };
          this.tableData2[0] = songHuo;
        } else {
          // 东向
          let tiHuo = {
            eastOrWest: response.data.bookingInquiry.eastOrWest,
            deliveryAddress: response.data.pickUpAddress,
            deliveryDistance: response.data.pickUpDistance,
            deliveryAging: response.data.pickUpAging,
            txAddress: response.data.txAddress,
            pickUpFees: response.data.pickUpFees,
            pickUpBoxFee: response.data.pickUpBoxFee,
            deliveryCurrencyType: response.data.pickUpCurrencyType,
            deliveryRemark: response.data.pickUpRemark,
            jsBidder: response.data.jsBidder,
            pickUpExpiration:response.data.pickUpExpiration,
            deliveryExpiration:response.data.deliveryExpiration,
            enquiryState:response.data.enquiryState,
            inquiryNum:response.data.inquiryNum
          };
          this.tableData2[0] = tiHuo;

          let songHuo = {
            eastOrWest: response.data.bookingInquiry.eastOrWest,
            goodsType: response.data.bookingInquiry.goodsType,
            lineType: response.data.bookingInquiry.lineType,
            isStack: response.data.bookingInquiry.isStack,
            pickUpAddress: response.data.deliveryAddress,
            goodsWeight: response.data.bookingInquiry.totalWeight,
            totalVolume: response.data.bookingInquiry.totalVolume,
            billableVolume: response.data.bookingInquiry.billableVolume,
            deliveryFees: response.data.deliveryFees,
            deliveryFeesOld: response.data.deliveryFees,
            pickUpCurrencyType: response.data.deliveryCurrencyType,
            hxAddress: response.data.hxAddress,
            returnBoxFee: response.data.returnBoxFee,
            xxyoRemark: response.data.xxyoRemark,
            pickUpExpiration:response.data.pickUpExpiration,
            deliveryExpiration:response.data.deliveryExpiration,
            enquiryState:response.data.enquiryState,
            inquiryNumber:response.data.inquiryNumber
          };

          this.tableData1[0] = songHuo;
        }
        debugger
        // 判断箱型是否是特殊箱
        if (response.data.bookingInquiry.containerType) {
          this.containerTypeHasRF = response.data.bookingInquiry.containerType.includes(
            "RF"
          );
          this.containerTypeHasOT = response.data.bookingInquiry.containerType.includes(
            "OT"
          );
           this.containerTypeHasHT = response.data.bookingInquiry.containerType.includes(
            "HT"
          );
           this.containerTypeHasMT = response.data.bookingInquiry.containerType.includes(
            "MT"
          );
           
        }
        //判断询价当月次月日期
         if(!!response.data.bookingInquiry.bookingTimeFlag && response.data.bookingInquiry.bookingTimeFlag === '0'){
            this.currentMonth=Number(response.data.bookingInquiry.inquiryTime.split('-')[1])
        }else if(!!response.data.bookingInquiry.bookingTimeFlag && response.data.bookingInquiry.bookingTimeFlag === '1'){
          this.nextMonth =  Number(response.data.bookingInquiry.inquiryTime.split('-')[1])+1
          if(this.nextMonth === 13){ this.nextMonth = 1}
        }
        this.params.id = response.data.id;
        this.params.pickUpFees = response.data.pickUpFees;
        this.params.deliveryFees = response.data.deliveryFees;
        this.params.railwayFees = response.data.railwayFees;
        this.params.railwayRemark = response.data.railwayRemark;
        this.params.xxyoRemark = response.data.xxyoRemark;
        this.params.railwayExpiration = response.data.railwayExpiration;
        this.params.deliveryExpiration = response.data.deliveryExpiration;
        this.railwayFeesOld= response.data.railwayFees;
        this.params.inquiryId = response.data.inquiryId;
        this.tableData3[0] = response.data;
        this.openResult = true;
        this.getReturn();
        this.getPick();
      });
    },
    /** 查询还箱地下拉框列表 */
    getReturn() {

      const idarr = {
        containerType: this.formResult.bookingInquiry.containerType,
        containerNum: this.formResult.bookingInquiry.containerNum
      };
      returnList(idarr).then(response => {
        this.returnOptions = response.data;
        this.params.hxAddress = response.data.hxAddress;
        this.params.returnBoxFee = response.data.cost;
      });
    },
    /** 查询提箱地下拉框列表 */
    getPick() {
      const idarr = {
        containerType: this.formResult.bookingInquiry.containerType,
        containerNum: this.formResult.bookingInquiry.containerNum,
        // 20210223 15:00 添加当月次月参数
        bookingTimeFlag:this.form.bookingTimeFlag
      };
      pickList(idarr).then(response => {
        this.pickUpOptions = response.data;
        this.params.txAddress = response.data.txAddress;
        this.params.pickUpBoxFee = response.data.cost;
      });
    },
    // 修改提货费用
    pickUpFeesEdit(e) {
      this.params.pickUpFees = e;
    },
    // 修改派送费用
    deliveryFeesEdit(e) {
      this.params.deliveryFees = e;
    },
    //修改公路备注
    xxyoRemarkEdit(e) {
      this.params.xxyoRemark = e;
    },
    //修改铁路备注
    railwayRemarkEdit(e) {
      this.params.railwayRemark = e;
    },
    //修改公路有效期
    deliveryExpirationEdit(e) {
      this.params.deliveryExpiration = e;
    },
    //修改铁路有效期
    railwayExpirationEdit(e) {
      this.params.railwayExpiration = e;
    },
    //修改铁路费用
    railwayFeesEdit(e) {
      this.params.railwayFees = e;
    },
    //铁路费用修改时,校验提还箱地是否选择,鼠标移入事件
    jiru(val) {
      
      if(!this.formResult.hxAddress&&this.formResult.bookingInquiry.goodsType === '0' &&
      this.formResult.bookingInquiry.eastOrWest == '1' &&this.formResult.bookingInquiry.containerBelong === '0'&&
      (this.formResult.bookingInquiry.bookingService === '0'||this.formResult.bookingInquiry.bookingService === '3')){
      if(!this.params.hxAddress){
      this.$message.error('请先选择还箱地')
      this.params.deliveryFees = deliveryFeesOld;
      }
      }

      if(!this.formResult.txAddress&&this.formResult.bookingInquiry.containerType!=null&&(this.formResult.bookingInquiry.containerType.includes(
            "RF"
          )||this.formResult.bookingInquiry.containerType.includes(
            "OT"
          ))){
      let containerTypeHasRF = this.formResult.bookingInquiry.containerType.includes(
            "RF"
          );
      let containerTypeHasOT = this.formResult.bookingInquiry.containerType.includes(
            "OT"
          );
      let containerTypeHasHT = this.formResult.bookingInquiry.containerType.includes(
            "HT"
          );
      let containerTypeHasMT = this.formResult.bookingInquiry.containerType.includes(
            "MT"
          );
          
          
      if(this.formResult.bookingInquiry.goodsType === '0' &&
      this.formResult.bookingInquiry.containerBelong === '0'&&
                  this.formResult.bookingInquiry.eastOrWest == '0' &&
                  this.formResult.bookingInquiry.deliveryType == '0'&&
                  (this.formResult.bookingInquiry.bookingService === '0' ||
                    this.formResult.bookingInquiry.bookingService === '1') &&
                  (containerTypeHasRF || containerTypeHasOT || containerTypeHasHT || containerTypeHasMT)&&!this.params.txAddress){
         this.$message.error('请先选择提箱地')
         this.params.pickUpFees = pickUpFeesOld;
      }
      }
    },
    //还箱地选择修改
    hxAddressEdit(e) {
      this.params.hxAddress = e;
      let data = this.returnOptions.filter(function(item) {
        return item.name == e;
      });
      this.params.returnBoxFee = data[0].cost;
    },
    //提箱地选择修改
    txAddressEdit(e) {
      this.params.txAddress = e;
      let data = this.pickUpOptions.filter(function(item) {
        return item.name == e;
      });
      this.params.pickUpBoxFee = data[0].cost;
    },
    /**  询价方案 修改集疏报价 */
    submitFees: function() {
      if(this.formResult.bookingInquiry.containerType!=null&&this.formResult.bookingInquiry.containerType.includes(
            "RF"
          )&&this.formResult.bookingInquiry.eastOrWest == '1'&&this.params.railwayFees==='0'){
          this.$message.error('抱歉,铁路报价不能为0,请编辑维护价格')
          return false  
          }
      
      if(!this.formResult.hxAddress&&this.formResult.bookingInquiry.goodsType === '0' &&
      this.formResult.bookingInquiry.eastOrWest == '1' &&this.formResult.bookingInquiry.containerBelong === '0'&&
      (this.formResult.bookingInquiry.bookingService === '0'||this.formResult.bookingInquiry.bookingService === '3')){
      if(!this.params.hxAddress){
      this.$message.error('抱歉,公路报价-还箱地不能为空')
      return false
      }
      }

      if(!this.formResult.txAddress&&this.formResult.bookingInquiry.containerType!=null&&(this.formResult.bookingInquiry.containerType.includes(
            "RF"
          )||this.formResult.bookingInquiry.containerType.includes(
            "OT"
          ))){
      let containerTypeHasRF = this.formResult.bookingInquiry.containerType.includes(
            "RF"
          );
      let containerTypeHasOT = this.formResult.bookingInquiry.containerType.includes(
            "OT"
          );
      let containerTypeHasHT = this.formResult.bookingInquiry.containerType.includes(
            "HT"
          );
      let containerTypeHasMT = this.formResult.bookingInquiry.containerType.includes(
            "MT"
          );
           
      if(this.formResult.bookingInquiry.goodsType === '0' &&
      this.formResult.bookingInquiry.containerBelong === '0'&&
                  this.formResult.bookingInquiry.eastOrWest == '0' &&
                  this.formResult.bookingInquiry.deliveryType == '0'&&
                  (this.formResult.bookingInquiry.bookingService === '0' ||
                    this.formResult.bookingInquiry.bookingService === '1') &&
                  (containerTypeHasRF || containerTypeHasOT || containerTypeHasHT || containerTypeHasMT) && !this.params.txAddress){
         this.$message.error('抱歉,公路报价-提箱地不能为空')
         return false
      }
      }

      if(this.formResult.bookingInquiry.goodsType === '0' && this.params.deliveryFees!=null &&
      this.formResult.bookingInquiry.eastOrWest == '1' &&this.formResult.deliveryExpiration &&
      (this.formResult.bookingInquiry.lineType === '2'||this.formResult.bookingInquiry.lineType === '3'||this.formResult.bookingInquiry.lineType === '4')){
      if(!this.params.deliveryExpiration){
      this.$message.error('抱歉,公路报价-有效期不能为空')
      return false
      }
      }

      if(this.formResult.bookingInquiry.goodsType === '0' && this.railwayFeesOld!=null &&
      this.formResult.bookingInquiry.eastOrWest == '1' &&
      (this.formResult.bookingInquiry.lineType === '2'||this.formResult.bookingInquiry.lineType === '3'||this.formResult.bookingInquiry.lineType === '4')){
      if(!this.params.railwayExpiration){
      this.$message.error('抱歉,铁路报价-有效期不能为空')
      return false
      }
      }
      
      this.ResultDisabled = false;
      this.params.businessRemark = this.formResult.businessRemark;
      let fictitiousCurrency = this.formResult.fictitiousCurrency;
      this.params.totalFees = this.formResult.totalFees + fictitiousCurrency;
      if (this.params.id != undefined) {
        editResult(this.params).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.openResult = false;
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },

    /** 查询客户管理列表 */
    getList() {
      this.loading = true;
      if (this.activeName === "0") {
        this.queryParams.inquiryState = "1";
      }
      if (this.activeName === "1") {
        this.queryParams.inquiryState = "2";
      }
      if (this.activeName === "2") {
        this.queryParams.inquiryState = "3";
      }
      if (this.activeName === "3") {
        this.queryParams.inquiryState = "4";
      }
      if (this.activeName === "4") {
        this.queryParams.inquiryState = "5";
      }
      if (this.createdate) {
        this.queryParams.inquiryStartTime = this.createdate[0];
        this.queryParams.inquiryEndTime = this.createdate[1];
      } else {
        this.queryParams.inquiryStartTime = null;
        this.queryParams.inquiryEndTime = null;
      }
      fetchList(this.queryParams)
        .then(response => {
          this.clientsList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.openResult = false;
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
      this.queryParams.pageSize = 10;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.createdate = [];
      this.queryParams = {};
      this.queryParams["deptCode"] = this.$store.getters.deptCode;
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.arrs = selection.map(item => item);
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 查看按钮操作 */
    handleDetail(row) {
      this.reset();
      const id = row.id;
      getDetail(id).then(response => {
        debugger
        this.form = response.data;
        // this.formDisabled = true;
        this.open = true;
        this.title = "询价详情";
      });
    },
    /** 提醒报价按钮操作 */
    handleUpdate(row) {
      this.formDisabled = false;
      this.reset();
      const id = row.id || this.ids;
      getClients(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "询价详情";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
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

//     dateFormat(row,column,cellValue){
// return cellValue?fecha.format(new Date(cellValue),'yyyy-MM-dd'):'';
// },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delClients(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>
import rowpng from '@/assets/image/row.png'
<style lang="scss">
//询价详情信息间距调整
.adjustment .el-form-item--medium .el-form-item__label {
  line-height: 20px;
}
.adjustment .el-form-item--medium .el-form-item__content {
  line-height: 20px;
}
a.cursorA {
  cursor: pointer;
  text-decoration: underline;
}
a.cursorA:hover {
  color: #34a8f3;
}
.enquiryItem {
  margin-top: 20px;
  border-top: 2px solid #34a8f3;
}
.basic-data {
  display: flex;
  align-items: center;
  vertical-align: middle;
  justify-content: space-around;

  .trace-city {
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    line-height: 28px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .middle-arrow {
    text-align: center;

    .trace-price {
      margin-top: 8px;
    }

    .trace-arrow {
      max-width: 160px;
    }
  }

  .trace-country {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }

  .trace-step {
    padding: 24px 0;
    border-top: 1px solid #eee;
  }

  .trace-bottom-content {
    // padding: 10px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;

    .trace-table-content {
      flex: 1;
    }

    .trace-step-detail {
      flex: 0 0 350px;
      height: 100%;

      .trace-step-content {
        color: #333333;
        display: flex;
        justify-content: space-between;
      }

      .el-step:last-of-type {
        padding-right: 10%;
      }

      .trace-step-title {
        margin: 0;
      }
    }
  }
}
.Colorx .el-input__inner{
color:red;font-size:16px;
}
.lj.el-input--prefix .el-input__inner {
    padding-left: 0px !important;
}
.lj.el-input--suffix .el-input__inner {
    padding-right: 80px !important;
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


.xj2 .cell {
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
.xj1 .cell {
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