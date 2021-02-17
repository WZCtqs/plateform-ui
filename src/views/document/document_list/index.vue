<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
    >
      <el-form-item prop="orderClassBh">
        <el-input
          v-model.trim="queryParams.orderClassBh"
          placeholder="请输入班列编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="containerNo" style="width:185px;">
        <el-input
          v-model.trim="queryParams.containerNo"
          placeholder="请输入箱号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="classEastAndWest" style="width:100px;">
        <el-select
          v-model.trim="queryParams.classEastAndWest"
          clearable
          placeholder="班列方向"
          size="mini"
        >
          <el-option
            v-for="item in e_w_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="classDate" >
        <el-date-picker
          v-model.trim="queryParams.classDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="班列日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="clientUnit">
        <el-input
          v-model.trim="queryParams.clientUnit"
          placeholder="请输入订舱方"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="isBeyond" style="width:120px;">
        <el-select
          v-model.trim="queryParams.isBeyond"
          clearable
          placeholder="是否超节点"
          size="mini"
        >
          <el-option
            v-for="item in jd_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="orderNumber">
        <el-input
          v-model.trim="queryParams.orderNumber"
          placeholder="请输入委托书编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 跟单员 -->
       <el-form-item prop="orderMerchandiser">
        <el-input v-model.trim="queryParams.orderMerchandiser"
                  placeholder="请输入跟单员"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"

        >查询
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >


      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="documentList">
      <el-table-column width="55" align="center"/>
      <el-table-column label="班列编号" align="center" prop="orderClassBh"/>
      <el-table-column label="委托书编号" align="center" prop="orderNumber"/>
      <el-table-column label="箱号" align="center">
        <template slot-scope="scope">
           <el-button
            size="mini"
            type="text"
            v-if="scope.row.classEastAndWest === '0'"
            @click.prevent="handle3Msg(scope.row)"
          >查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="往返" align="center" prop="classEastAndWest">
        <template slot-scope="scope">
          <span v-if="scope.row.classEastAndWest == '0'">西向</span>
          <span v-else>东向</span>
        </template>
      </el-table-column>
      <el-table-column label="订舱方" align="center" prop="clientUnit"/>
      <el-table-column label="整柜/拼箱" align="center" prop="isConsolidation">
        <template slot-scope="scope">
          <span v-if="scope.row.isConsolidation == '0'">整柜</span>
          <span v-else>拼箱</span>
        </template>
      </el-table-column>
      <el-table-column label="是否超节点" align="center" prop="isBeyond">
        <template slot-scope="scope">
          <span v-if="scope.row.isBeyond == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提货时间"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleSee1(scope.row)"
          >查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="入仓核实单"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.classEastAndWest == '0' && scope.row.pxInBoxCheck" size="mini" type="text"
                     @click.prevent="handleSee2(scope.row)">查看
          </el-button>
          <el-button size="mini" v-else-if="scope.row.classEastAndWest==='1' && !!scope.row.gwczArrivalGoods" type="text"
                     @click.prevent="handleSee6(scope.row)">查看
          </el-button>
          <span v-else style="color: red">无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="装柜清单(件重尺)"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.isConsolidation == '1'" type="text"
                     @click.prevent="handleSee3(scope.row)">查看
          </el-button>
          <span v-else style="color: red">无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="重箱进站表"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.prevent="handleSee4(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="拼箱出入库表"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.isConsolidation == '1'" type="text"
                     @click.prevent="handleSee5(scope.row)">查看
          </el-button>
          <span v-else style="color: red">无</span>
        </template>
      </el-table-column>
      <el-table-column label="超节点单证" align="center" prop="beyondDocs" width="150">
        <template slot-scope="scope">
           <el-button
           v-if="scope.row.isBeyond === 1"
            size="mini"
            type="text"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <span v-else style="color: red">无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.prevent="handleSee(scope.row)"
            v-hasPermi="['document:order:query']"
          >单证查看
          </el-button>
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

      <!-- 箱号、铅封号、上传装箱照 -->
    <el-dialog title="箱号、铅封号、上传装箱照" :visible.sync="dialog3Msg" width="65%" :destroy-on-close="true">
      <div style="padding-bottom:50px;">

         <el-table
          :data="list3Msg"
          style="width: 100%">
          <el-table-column
            prop="containerNo"
            label="箱号"
            width="180" >
           <template slot-scope="scope">
               <el-input v-model.trim="scope.row.containerNo" :disabled="scope.row.conSealStatus === 2 && !(scope.row.shipOrderBinningWay === '1' && scope.row.isConsolidation === '0')" />
             </template>
          </el-table-column>
          <el-table-column
            prop="sealNumber"
            label="铅封号"
            width="180"  >
            <template slot-scope="scope">
               <el-input v-model.trim="scope.row.sealNumber" :disabled="scope.row.conSealStatus === 2 && !(scope.row.shipOrderBinningWay === '1' && scope.row.isConsolidation === '0')" />
             </template>
          </el-table-column>
          <el-table-column
            prop="zhuangxaingzhao"
            label="装箱照">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="uploadZhuangxiangzhao(scope.row)"
              > 查看
              </el-button>
             </template>
          </el-table-column>
          <el-table-column
            prop="zhuangxaingzhao"
            label="箱号审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.conSealStatus === 0">
                 <span v-if="scope.row.classEastAndWest === '0'"> 待审核</span>
                 <span v-if="scope.row.classEastAndWest === '1'"> 解锁</span>
              </span>
              <span v-else-if="scope.row.conSealStatus === 1">
                <span v-if="scope.row.classEastAndWest === '0'"> 失败(审核失败原因:{{scope.row.conSealFail}}) </span>
                <span v-else-if="scope.row.classEastAndWest === '1'"> 解锁</span>
              </span>
              <span v-else-if="scope.row.conSealStatus === 2">
                <span v-if="scope.row.classEastAndWest === '0'"> 成功 </span>
                <span v-if="scope.row.classEastAndWest === '1'"> 锁定</span>
              </span>
             </template>
          </el-table-column>
          <el-table-column
            prop="zhuangxaingzhao"
             width="180"
            label="操作">
            <template slot-scope="scope">
              <el-button
                v-hasPermi="['document:boxphoto:save']"
                type="primary"
                size="mini"
                @click="uploadData1(scope.row)"
              > 保存
              </el-button>
              <!-- <el-button
                v-hasPermi="['document:jsboxphoto:delete']"
                type="primary"
                size="mini"
                @click="deleteData(scope.row)"
              > 删除
              </el-button> -->
             </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog title="上传装箱照" :visible.sync="dialogZhuangxaingzhao" append-to-body width="60%" :destroy-on-close="true">
      <div style="padding-bottom:50px;">
        <!-- 待审核、审核未通过状态下，可以修改图片 -->
        <el-upload
          v-if="this.rowData0['boxingphotoStatus'] !== 2"
          class="upload-demo"
          ref="upload"
          action=""
          :on-change="onChangeZhuangxiangzhao"
          :on-remove="handleRemoveZhuangxiangzhao"
          :file-list="fileList"
          list-type="picture"
          :multiple="true"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取图片文件</el-button>
          <el-button style="margin-left: 10px;"  v-if="this.rowData0.shipOrderBinningWay === '0' && this.rowData0.isConsolidation === '0' && this.rowData0.classEastAndWest === '1'" :disabled="this.rowData0['boxingphotoStatus'] === 2" size="small" type="success" @click="submitUploadZhuangxiangzhao">上传到服务器</el-button>
          <div v-if="this.rowData0.boxingphotoStatus === 1">
            装箱照审核失败原因:{{rowData0.boxingphotoFail}}
          </div>
          <div slot="tip" class="el-upload__tip">
            <a>只能上传jpg/png文件</a>
            <a href="/zxImgDetail.docx" v-if="this.rowData0.classEastAndWest === '0'" download="装箱照片拍摄要求及注意事项.doc" style="cursor:pointer;text-decoration:underline;color:#1890ff;">
                装箱照片拍摄要求及注意事项
            </a>
             <a href="/backZh.pdf" v-if="this.rowData0.classEastAndWest === '1'" download="装箱照片拍摄要求及注意事项.doc" style="cursor:pointer;text-decoration:underline;color:#1890ff;">
                装箱照片拍摄要求及注意事项
            </a>

          </div>

        </el-upload>
        <!-- 审核通过状态下，只能查看图片 -->
        <el-row  v-if="this.rowData0['boxingphotoStatus'] === 2">
          <el-col :span="4" v-for="(o, index) in fileList" :key="o" >
            <el-card :body-style="{ padding: '0px' }" :key="index">
              <img :src="o.url" style="width:100%;height:100px;">
              <div style="padding: 14px;">
                <span>{{o.name}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      </el-dialog>
    </el-dialog>

    <!-- 单证查看对话框 -->
    <el-dialog :visible.sync="open" width="1000px">
      <el-tabs v-model.trim="fileOrderStage" >
        <el-tab-pane
          v-for="(item, index) in docTypeList"
          :key="item.index"
          :label="item.fileTypeText"
          :name="item.id.toString()"
        />
      </el-tabs>
      <el-table :data="DocumentDetailList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="fileTypeText" label="类型" width="180"/>
        <el-table-column prop="fileNames" label="链接" width="380">
          <template slot-scope="scope">
              <span v-if="scope.row.fileName != null && scope.row.fileName != ''">
                <a :href="scope.row.fileUrl" :download="scope.row.fileName" target="_blank" class="filecss0">{{scope.row.fileName}} </a>
              </span>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" width="180"/>
        <el-table-column prop="confirmRemark" label="备注"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="down" icon="edit"
                   v-hasPermi="['document:order:download']"
        >批量下载
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 提货时间查看-->
    <el-dialog :visible.sync="open9" width="500px">
      <span>·国内··············</span>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>提货时间</span>
        </div>
        <el-row>
          <p>{{pickGoodsTimec}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>提货联系人</span>
        </div>
        <el-row>
          <p>{{pickGoodsContacts}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>提货详细地址</span>
        </div>
        <el-row>
          <p>{{pickGoodsAddress}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>联系方式</span>
        </div>
        <el-row>
          <p>{{pickGoodsPhone}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <el-row>
          <el-tag v-if="pickGoodsTimecConfirm==0" type="danger">未确认</el-tag>
          <el-button v-if="pickGoodsTimecConfirm==0" type="warning"
          icon="el-icon-star-on" size="mini" @click="handleConfirm">提醒客户确认</el-button>
          <el-tag v-if="pickGoodsTimecConfirm==1" >已确认</el-tag>
        </el-row>
      </el-card>
      <span>·国外··············</span>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span v-if="isConsolidation==='1'">预计提货时间</span>
          <span v-else>提箱资料发送时间</span>
        </div>
        <el-row>
          <p>{{abroadPlanPickTime}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span v-if="isConsolidation==='1'">提货时间</span>
          <span v-else>提箱时间</span>
        </div>
        <el-row>
          <p>{{abroadPickTime}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>对接人</span>
        </div>
        <el-row>
          <p>{{operator}}</p>
        </el-row>
      </el-card>
    </el-dialog>

    <el-dialog title="超节点单证" :visible.sync="isupdateListDialog" width="500px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <li v-for="(item,index) in isupdateList1" :key="index">{{item.fileTypeText}}</li>
        </div>
      </el-card>
    </el-dialog>

    <!-- 入仓核实单查看-->
    <el-dialog :visible.sync="open10" width="500px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>入货日期</span>
        </div>
        <el-row>
          <p>{{px_arriveYardTime}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>包装方式</span>
        </div>
        <el-row>
          <p>{{px_packing}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>数量</span>
        </div>
        <el-row>
          <p>{{px_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>规格（长*宽*高*件数）</span>
        </div>
        <el-row>
          <p>{{px_box_type}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>单件重量 毛重</span>
        </div>
        <el-row>
          <p>{{px_box_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>总重</span>
        </div>
        <el-row>
          <p>{{px_LongAndWide}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>实际体积（m3）</span>
        </div>
        <el-row>
          <p>{{px_volume}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>结算体积（m3）</span>
        </div>
        <el-row>
          <p>{{px_Settlement_volume}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>特殊货物收费（USD）</span>
        </div>
        <el-row>
          <p>{{px_car_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>其他费用人民币</span>
        </div>
        <el-row>
          <p>{{px_otherCharge}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>备注</span>
        </div>
        <el-row>
          <p>{{px_lead_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>标签粘贴</span>
        </div>
        <el-row>
          <p>{{px_Checkman}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>接货员</span>
        </div>
        <el-row>
          <p>{{px_enter_time}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>托书数量</span>
        </div>
        <el-row>
          <p>{{px_order_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>托书总体积</span>
        </div>
        <el-row>
          <p>{{px_order_ztj}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>托书总重量</span>
        </div>
        <el-row>
          <p>{{px_order_zzl}}</p>
        </el-row>
      </el-card>

    </el-dialog>
    <!-- 装柜清单查看-->
    <el-dialog :visible.sync="open11" width="500px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>包装方式</span>
        </div>
        <el-row>
          <p>{{px_packing}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>数量13</span>
        </div>
        <el-row>
          <p>{{px_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>规格（长*宽*高*件数）</span>
        </div>
        <el-row>
          <p>{{px_box_type}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>单件重量</span>
        </div>
        <el-row>
          <p>{{px_box_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>总重</span>
        </div>
        <el-row>
          <p>{{px_LongAndWide}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>实际体积</span>
        </div>
        <el-row>
          <p>{{px_volume}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>结算体积</span>
        </div>
        <el-row>
          <p>{{px_Settlement_volume}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>特殊货物收费（USD）</span>
        </div>
        <el-row>
          <p>{{px_car_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>其他费用人民币</span>
        </div>
        <el-row>
          <p>{{px_otherCharge}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>备注</span>
        </div>
        <el-row>
          <p>{{px_lead_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>箱号</span>
        </div>
        <el-row>
          <p>{{xianghao}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>箱型</span>
        </div>
        <el-row>
          <p>{{xiangxing}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>责任人</span>
        </div>
        <el-row>
          <p>{{px_weight}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>到货情况</span>
        </div>
        <el-row>
          <p>{{px_person_charge}}</p>
        </el-row>
      </el-card>
    </el-dialog>
    <!-- 重箱进站表查看-->
    <el-dialog :visible.sync="open12" width="1000px">
      <el-table :data="pxYardLoadedInlist">
    <el-table-column property="xianghao" label="箱号" ></el-table-column>
    <el-table-column property="xiangxing" label="箱型" ></el-table-column>
    <el-table-column property="px_entry_date" label="入场日期"></el-table-column>
    <el-table-column property="px_entry_time" label="入场时间" ></el-table-column>
    <el-table-column property="px_enter_car" label="进站日期/出场日期" ></el-table-column>
    <el-table-column property="px_enter_lead_number" label="进站时间/出场时间"></el-table-column>
    <el-table-column property="edit_remark" label="备注" ></el-table-column>
    <el-table-column property="cepian_result" label="正面吊测偏结果" ></el-table-column>
    <el-table-column property="is_jg" label="是否加固"></el-table-column>

    <!-- <el-table-column property="is_jg" label="是否加固">
    <template slot-scope="scope">
    <span v-if="is_jg==0">否</span>
    <span v-else>是</span>
    </template>
    </el-table-column> -->
    <el-table-column property="ISJZ_LDbus" label="是否直接进站" ></el-table-column>
    <!-- 20210126 17:00 新增 重量 zx_weight; 位置 Position -->
    <el-table-column property="zx_weight" label="重量" ></el-table-column>
    <el-table-column property="Position" label="位置" ></el-table-column>
  </el-table>
    </el-dialog>
    <!-- 拼箱出入库表查看-->
    <el-dialog :visible.sync="open13" width="500px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>箱号</span>
        </div>
        <el-row>
          <p>{{containerNum}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>从中心站调回时间</span>
        </div>
        <el-row>
          <p>{{Repatriate_time}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>计划拆箱时间</span>
        </div>
        <el-row>
          <p>{{PlanCX_time}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>拆箱时间</span>
        </div>
        <el-row>
          <p>{{CX_time}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>库内位置</span>
        </div>
        <el-row>
          <p>{{Store_station}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>车牌号</span>
        </div>
        <el-row>
          <p>{{car_number}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>实际提货时间</span>
        </div>
        <el-row>
          <p>{{REPick_time}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>车辆入区时间</span>
        </div>
        <el-row>
          <p>{{Car_intime}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>车辆出区时间</span>
        </div>
        <el-row>
          <p>{{Car_outtime}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>装车开票</span>
        </div>
        <el-row>
          <p>{{Load_KP}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>堆存时间</span>
        </div>
        <el-row>
          <p>{{Storage_days}}</p>
        </el-row>
      </el-card>
    </el-dialog>
    <!-- 国外场站到货数据查看-->
    <el-dialog :visible.sync="open14" width="500px">
      <el-card class="box-card">

        <div slot="header" class="clearfix">
          <span>总重</span>
        </div>
        <el-row>
          <p v-if="!!seeRowdata.gwczArrivalGoods">{{seeRowdata.gwczArrivalGoods.pxWeight}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>体积</span>
        </div>
        <el-row>
          <p v-if="!!seeRowdata.gwczArrivalGoods">{{seeRowdata.gwczArrivalGoods.pxVolume}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>结算体积</span>
        </div>
        <el-row>
          <p v-if="!!seeRowdata.gwczArrivalGoods">{{seeRowdata.gwczArrivalGoods.pxSettlementVolume}}</p>
        </el-row>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>箱号</span>
        </div>
        <el-row>
          <p>{{gwczFormcontainerNum}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>到堆场时间</span>
        </div>
        <el-row>
          <p>{{gwczFormarriveTime}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>实际到货</span>
        </div>
        <el-row>
          <p>{{gwczFormarriveInfoactual}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>测量尺寸</span>
        </div>
        <el-row>
          <p>{{gwczFormmeasureDimention}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>对接人</span>
        </div>
        <el-row>
          <p>{{gwczFormReceiver}}</p>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>备注</span>
        </div>
        <el-row>
          <p>{{gwczFormremark}}</p>
        </el-row>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listDocument,
    getBeyondDocs,
    getPickUpGoodsTime,
    getParentList,
    listDocumentDetail,
    downloadDocument,
    confirmClients,
    getConList,
    docOrderDocumentAdd0,
    saveConAndSeal
  } from "@/api/document/document_list";
  import Editor from "@/components/Editor";
  import JSZip from 'jszip';
  import FileSaver from 'file-saver';
  import { getToken } from '@/utils/auth'

  export default {
    name: "Document_list",
    components: {
      Editor
    },
    data() {
      return {
      seeRowdata:{
          gwczArrivalGoods:{
            pxSettlementVolume:null,
            pxVolume:null,
            pxWeight:null
          }
        },
      rowData0:{},
      headers: {
        Authorization: 'Bearer ' + getToken() // 从cookie里获取token，并赋值  Authorization ，而不是token
      },
      dialogZhuangxaingzhao:false,
      // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      fileList: [],
      fileList1:[],
      dialog3Msg:false,
      list3Msg:[],
        multipleSelectionDownloads: [],
        pickGoodsTimec: '',
        pickGoodsContacts: '',
        pickGoodsAddress: '',
        pickGoodsPhone: '',
        pickGoodsTimecConfirm:'',
        pxYardLoadedInlist:[],
        //提货人、提箱人
        operator:'',
        //提货时间、提箱时间
        abroadPickTime:'',
        //预计提货时间、提醒资料发送时间
        abroadPlanPickTime:'',
        //装柜清单件重尺
        //包装方式12
        px_packing: '',
        //数量13
        px_number: '',
        //规格（长*宽*高*件数）14
        px_box_type: '',
        //单件重量15 毛重
        px_box_number: '',
        //总重16
        px_LongAndWide: '',
        //实际体积（m3）
        px_volume: '',
        //结算体积（m3）
        px_Settlement_volume: '',
        //特殊货物收费（USD）
        px_car_number: '',
        //其他费用人民币
        px_otherCharge: '',
        //备注
        px_lead_number: '',
        //箱号
        xianghao: '',
        //箱型
        xiangxing: '',
        //责任人
        px_weight: '',
        //到货情况
        px_person_charge: '',
        //入仓核实单、到货信息
        //入货日期
        px_arriveYardTime: '',
        //包装方式12
        px_packing: '',
        //数量13
        px_number: '',
        //规格（长*宽*高*件数）14
        px_box_type: '',
        //单件重量15 毛重
        px_box_number: '',
        //总重16
        px_LongAndWide: '',
        //实际体积（m3）
        px_volume: '',
        //结算体积（m3）
        px_Settlement_volume: '',
        //特殊货物收费（USD）
        px_car_number: '',
        //其他费用人民币
        px_otherCharge: '',
        //备注
        px_lead_number: '',
        //标签粘贴
        px_Checkman: '',
        //接货员
        px_enter_time: '',
        //托书数量
        px_order_number: '',
        //托书总体积
        px_order_ztj: '',
        //托书总重量
        px_order_zzl: '',
        //重箱进站表
        /**
         * 舱位号
         */
        order_number: '',
        /**
         * 箱号
         */
        xianghao: '',
        /**
         * 箱型
         */
        xiangxing: '',
        /**
         * 入场日期
         */
        xianghao_place: '',
        /**
         * 入场日期
         */
        px_entry_date: '',
        /**
         * 入场时间
         */
        px_entry_time: '',
        /**
         * 进站日期/出场日期
         */
        px_enter_car: '',
        /**
         * 进站时间/出场时间
         */
        px_enter_lead_number: '',
        /**
         * 备注
         */
        edit_remark: '',
        /**
         * 正面吊测偏结果
         */
        cepian_result: '',
        /**
         * 是否加固
         */
        is_jg: '',
        /**
         * 是否直接进站
         */
        ISJZ_LDbus: '',
        //拼箱出入库表
        /**
         *箱号
         */
        containerNum: '',
        /**
         *从中心站调回时间
         */
        Repatriate_time: '',
        /**
         *计划拆箱时间
         */
        PlanCX_time: '',
        /**
         *拆箱时间
         */
        CX_time: '',
        /**
         *库内位置
         */
        Store_station: '',
        /**
         *车牌号
         */
        car_number: '',
        /**
         *实际提货时间
         */
        REPick_time: '',
        /**
         *车辆入区时间
         */
        Car_intime: '',
        /**
         *车辆出区时间
         */
        Car_outtime: '',
        /**
         *装车开票
         */
        Load_KP: '',
        /**
         *堆存时间
         */
        Storage_days: '',
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
        // 单证列表数据
        documentList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        open9: false,
        open10: false,
        open11: false,
        open12: false,
        open13: false,
        open14: false,
        isupdateListDialog: false,
        isupdateList1:[],
        list: [
          {
            fileName: "",
            fileUrl: ""
          }
        ],
        //单证一级类型
        docTypeList: [],
        docTypeName : '',
        //超节点单证
        beyondDocsList: [],
        //一级页签下单证
        DocumentDetailList: [],
        fileOrderStage: null,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          containerNo:null,
          orderClassBh: undefined,
          clientUnit: undefined,
          orderNumber: undefined,
          orderId: undefined,
          isBeyond: undefined,
          classEastAndWest: undefined,
          classDate:undefined,
          orderMerchandiser: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        jd_options: [
          {
            value: 1,
            label: "是"
          },
          {
            value: 0,
            label: "否"
          }
        ],
        e_w_options: [
          {
            value: 0,
            label: "西向"
          },
          {
            value: 1,
            label: "东向"
          }
        ],
        gwczFormcontainerNum:undefined,
        gwczFormarriveTime:undefined,
        gwczFormarriveInfoactual:undefined,
        gwczFormmeasureDimention:undefined,
        gwczFormReceiver:undefined,
        gwczFormremark:undefined
      };
    },
    watch: {
      fileOrderStage: {
        handler: function (val) {
          this.getfileFn(val);
        }
      }
    },

    created() {
      this.getList();
    },
    methods: {
      // 箱号、铅封号、装箱照 删除接口
    deleteData(row){
      let data={
        docId:row.docId,
        orderId:row.orderId
      }
       docSendGoodsSelfDelete(data).then(res=>{
          if(res.msg !=='success'){
            this.$message.error(res.msg)
          }
          this.dialog3Msg=false
          this.getList()
       })
    },
     // 箱号、铅封号、装箱照 保存接口
     uploadData1(row){
       console.log(row)
         // row.docId 为空时，表示此操作为新增操作，不为空时，为修改操作
      let data={
        orderId:row.orderId,
        docId:row.docId,
        orderNumber:row.orderNumber,
        containerNo:row.containerNo,
        sealNumber:row.sealNumber,
        classEastAndWest:row.classEastAndWest,
        urlList:this.fileList1
        }
      if(!!row.containerNo && !!row.sealNumber && !!this.fileList1 && this.fileList1.length>=6){
        saveConAndSeal(data).then(res=>{
          if(res.msg === 'con error'){
            this.$message.error('箱号不对')
          }else if(res.msg === 'success'){
            this.$message.success('操作成功')
          }
          this.dialog3Msg=false
          this.getList()
        })
      }else{
        if(!this.fileList1 || this.fileList1.length<6){
           this.$message.error('请上传装箱照')
        }
        if(!row.containerNo || !row.sealNumber){
           this.$message.error('箱号和铅封号不能为空')
        }

      }

     },

    // 打开弹框：上传装箱照
    uploadZhuangxiangzhao(row){
       this.dialogZhuangxaingzhao=true
       this.rowData0=row
       this.fileList1=[]
       this.fileList=[]
       this.fileList=!row.urlList?[]:row.urlList
       this.fileList1=!row.urlList?[]:row.urlList
    },
    // 上传装箱照submit
     submitUploadZhuangxiangzhao() {
       if(this.fileList.length<6){
          this.$message.error('装箱照数量必须为6张及以上')
       }else{
          // this.$refs.upload.submit();
          var zipFormData = new FormData()
          this.fileList1=[]
          this.fileList.forEach(item=>{
            if(item.status === 'ready'){
              item=item.raw
              item['fileName']=item.name
            }else{
              this.fileList1.push(item)
            }
            zipFormData.append('file', item) // file对应传输的文件
          })

          const params = {
            data: zipFormData,
            headers: this.headers
          }
          debugger
          docOrderDocumentAdd0(params.data, params.headers).then(res=>{
            if(this.fileList1 === null){this.fileList1=[]}
            if(!!res.data && res.data.length >0){
              res.data.forEach(item=>{
                this.fileList1.push(item)
              })
            }
            this.dialogZhuangxaingzhao=false
          })
       }
      },
      // 删除装箱照
      handleRemoveZhuangxiangzhao(file, fileList) {
        // console.log(file, fileList);
        this.fileList=fileList
      },
      // 本地选择要上传的装箱照
      onChangeZhuangxiangzhao(file,fileList) {
        //  console.log(file,fileList)
         this.fileList=fileList
      },/*  */

    handle3Msg(row){
        // console.log(row)
        this.dialog3Msg=true
        let data={
          orderId:row.orderId,
          containerCount:row.containerCount,
          orderNumber:row.orderNumber
        }
        getConList(data).then(res=>{
          this.list3Msg=res
        })
    },

      /** 查询单证列表 */
      getList() {
        this.loading = true;

        listDocument(this.queryParams).then(response => {
          this.documentList = response.rows;
          this.total = response.total;

          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelectionDownloads = val;
      },
      /** 提货时间查看 this指向数据需要初始化定义*/
      handleSee1(row) {
        let params = {
          orderId: row.orderId
        }
        getPickUpGoodsTime(params).then(res=>{
          this.pickGoodsTimec = res.pickGoodsTimec ? res.pickGoodsTimec : '';
          this.pickGoodsContacts = res.pickGoodsContacts ? res.pickGoodsContacts : '';
          this.pickGoodsAddress = res.pickGoodsAddress ? res.pickGoodsAddress : '';
          this.pickGoodsPhone = res.pickGoodsPhone ? res.pickGoodsPhone : '';
          this.pickGoodsTimecConfirm = res.pickGoodsTimecConfirm ? res.pickGoodsTimecConfirm : '';
          this.operator = res.operator ? res.operator : '';
          this.abroadPickTime = res.abroadPickTime ? res.abroadPickTime : '';
          this.abroadPlanPickTime = res.abroadPlanPickTime ? res.abroadPlanPickTime : '';
          this.orderNumber=row.orderNumber;
          this.orderId=row.orderId;
          this.open9 = true;
        })
      },
      //提醒客户确认提货时间
      handleConfirm(){
        const orderNumber = this.orderNumber;
        const orderId = this.orderId;
        confirmClients({orderNumber,orderId}).then(response=>{
        if(response.code===200){
        this.msgSuccess("提醒客户成功");
        this.open9=false;
        this.getList();
        }else{
        this.msgError(response.msg);
           }
        });
       },
      //入仓核实单
      handleSee2(row) {

        this.px_arriveYardTime = row.pxInBoxCheck ? row.pxInBoxCheck.px_arriveYardTime : '';
        this.px_packing = row.pxInBoxCheck ? row.pxInBoxCheck.px_packing : '';
        this.px_number = row.pxInBoxCheck ? row.pxInBoxCheck.px_number : '';
        this.px_box_type = row.pxInBoxCheck ? row.pxInBoxCheck.px_box_type : '';
        this.px_volume = row.pxInBoxCheck ? row.pxInBoxCheck.px_volume : '';
        this.px_Settlement_volume = row.pxInBoxCheck ? row.pxInBoxCheck.px_Settlement_volume : '';
        this.px_car_number = row.pxInBoxCheck ? row.pxInBoxCheck.px_car_number : '';
        this.px_otherCharge = row.pxInBoxCheck ? row.pxInBoxCheck.px_otherCharge : '';
        this.px_lead_number = row.pxInBoxCheck ? row.pxInBoxCheck.px_lead_number : '';
        this.px_Checkman = row.pxInBoxCheck ? row.pxInBoxCheck.px_Checkman : '';
        this.px_enter_time = row.pxInBoxCheck ? row.pxInBoxCheck.px_enter_time : '';
        this.px_order_number = row.pxInBoxCheck ? row.pxInBoxCheck.px_order_number : '';
        this.px_order_ztj = row.pxInBoxCheck ? row.pxInBoxCheck.px_order_ztj : '';
        this.px_order_zzl = row.pxInBoxCheck ? row.pxInBoxCheck.px_order_zzl : '';
        this.px_box_number = row.pxInBoxCheck ? row.pxInBoxCheck.px_box_number : '';
        this.px_LongAndWide = row.pxInBoxCheck ? row.pxInBoxCheck.px_LongAndWide : '';
        if (row.pxInBoxCheck) {
          this.open10 = true;
        } else {
          this.$message.error("暂无信息");
        }
      },
      //装柜清单(件重尺)
      handleSee3(row) {

        this.px_packing = row.pxBoxingList ? row.pxBoxingList.px_packing : '';
        this.px_number = row.pxBoxingList ? row.pxBoxingList.px_number : '';
        this.px_box_type = row.pxBoxingList ? row.pxBoxingList.px_box_type : '';
        this.px_box_number = row.pxBoxingList ? row.pxBoxingList.px_box_number : '';
        this.px_LongAndWide = row.pxBoxingList ? row.pxBoxingList.px_LongAndWide : '';
        this.px_volume = row.pxBoxingList ? row.pxBoxingList.px_volume : '';
        this.px_Settlement_volume = row.pxBoxingList ? row.pxBoxingList.px_Settlement_volume : '';
        this.px_car_number = row.pxBoxingList ? row.pxBoxingList.px_car_number : '';
        this.px_otherCharge = row.pxBoxingList ? row.pxBoxingList.px_otherCharge : '';
        this.px_lead_number = row.pxBoxingList ? row.pxBoxingList.px_lead_number : '';
        this.xianghao = row.pxBoxingList ? row.pxBoxingList.xianghao : '';
        this.xiangxing = row.pxBoxingList ? row.pxBoxingList.xiangxing : '';
        this.px_weight = row.pxBoxingList ? row.pxBoxingList.px_weight : '';
        this.px_person_charge = row.pxBoxingList ? row.pxBoxingList.px_person_charge : '';
        if (row.pxBoxingList) {
          this.open11 = true;
        } else {
          this.$message.error("暂无信息");
        }
      },
      //重箱进站表
      handleSee4(row) {
        this.pxYardLoadedInlist = row.pxYardLoadedIn
        // this.xianghao = row.pxYardLoadedIn ? row.pxYardLoadedIn.xianghao : '';
        // this.xiangxing = row.pxYardLoadedIn ? row.pxYardLoadedIn.xiangxing : '';
        // this.px_entry_date = row.pxYardLoadedIn ? row.pxYardLoadedIn.px_entry_date : '';
        // this.px_entry_time = row.pxYardLoadedIn ? row.pxYardLoadedIn.px_entry_time : '';
        // this.px_enter_car = row.pxYardLoadedIn ? row.pxYardLoadedIn.px_enter_car : '';
        // this.px_enter_lead_number = row.pxYardLoadedIn ? row.pxYardLoadedIn.px_enter_lead_number : '';
        // this.edit_remark = row.pxYardLoadedIn ? row.pxYardLoadedIn.edit_remark : '';
        // this.cepian_result = row.pxYardLoadedIn ? row.pxYardLoadedIn.cepian_result : '';
        // this.is_jg = row.pxYardLoadedIn ? row.pxYardLoadedIn.is_jg : '';
        // this.ISJZ_LDbus = row.pxYardLoadedIn ? row.pxYardLoadedIn.ISJZ_LDbus : '';
        if (row.pxYardLoadedIn) {
          this.open12 = true;
        } else {
          this.$message.error("暂无信息");
        }
      },
      //拼箱出入库表
      handleSee5(row) {

        this.containerNum = row.pxGoodsInOut ? row.pxGoodsInOut.containerNum : '';
        this.Repatriate_time = row.pxGoodsInOut ? row.pxGoodsInOut.Repatriate_time : '';
        this.PlanCX_time = row.pxGoodsInOut ? row.pxGoodsInOut.PlanCX_time : '';
        this.CX_time = row.pxGoodsInOut ? row.pxGoodsInOut.CX_time : '';
        this.Store_station = row.pxGoodsInOut ? row.pxGoodsInOut.Store_station : '';
        this.car_number = row.pxGoodsInOut ? row.pxGoodsInOut.car_number : '';
        this.REPick_time = row.pxGoodsInOut ? row.pxGoodsInOut.REPick_time : '';
        this.Car_intime = row.pxGoodsInOut ? row.pxGoodsInOut.Car_intime : '';
        this.Car_outtime = row.pxGoodsInOut ? row.pxGoodsInOut.Car_outtime : '';
        this.Load_KP = row.pxGoodsInOut ? row.pxGoodsInOut.Load_KP : '';
        this.Storage_days = row.pxGoodsInOut ? row.pxGoodsInOut.Storage_days : '';

        if (row.pxGoodsInOut) {
          this.open13 = true;
        } else {
          this.$message.error("暂无信息");
        }
      },
      //国外场站到货数据
      handleSee6(row) {

        this.seeRowdata={
          gwczArrivalGoods:{
            pxSettlementVolume:row.gwczArrivalGoods.pxSettlementVolume,
            pxVolume:row.gwczArrivalGoods.pxVolume,
            pxWeight:row.gwczArrivalGoods.pxWeight
          }
        }
        this.gwczFormcontainerNum = row.gwczArrivalGoods? row.gwczArrivalGoods.containerNum :'';
        this.gwczFormarriveTime = row.gwczArrivalGoods? row.gwczArrivalGoods.arriveTime :'';
        this.gwczFormarriveInfoactual = row.gwczArrivalGoods? row.gwczArrivalGoods.arriveInfoactual: '';
        this.gwczFormmeasureDimention = row.gwczArrivalGoods? row.gwczArrivalGoods.measureDimention :'';
        this.gwczFormReceiver = row.gwczArrivalGoods? row.gwczArrivalGoods.receiver :'';
        this.gwczFormremark = row.gwczArrivalGoods? row.gwczArrivalGoods.remark :'';
        if (row.gwczArrivalGoods) {
          this.open14 = true;
        } else {
          this.$message.error("暂无信息");
        }
      },
      // 取消按钮
      cancel() {
        this.DocumentDetailList = [];
        this.open = false;
        this.reset();
      },
      handleDetail(obj){
        let params = {
          orderId: obj.orderId
        }
        getBeyondDocs(params).then(response => {
          debugger
          this.isupdateList1=response
          this.isupdateListDialog=true
        })

    },
      // 表单重置
      reset() {
        this.list = [{fileName: "", fileUrl: ""}];
        this.form = {
          classDate: undefined,
          classEastAndWest: undefined,
          clientUnit: undefined,
          isConsolidation: undefined,
          orderClassBh: undefined,
          orderId: undefined,
          orderNumber: undefined,
          isBeyond: undefined,
          beyondDocs: []
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
      /** 单证查看 */
      handleSee(row) {
        getParentList(row.orderId).then(response => {
          this.orderId = row.orderId;
          this.order_number = row.orderNumber;
          this.docTypeList = response.data;
          if (this.docTypeList.length > 0) {
            this.fileOrderStage = response.data[0].id;
            this.getfileFn(this.fileOrderStage);
            this.open = true;
          } else {
            this.$message.error('暂无单证信息,请进行单证一级类型维护')
          }
        });
      },
      getfileFn(id) {
        let params = {
          fileOrderStage: id,
          orderId: this.orderId
        }
        listDocumentDetail(params).then(res => {
          this.DocumentDetailList = []
          res.data.forEach(doc => {
            if(doc.fileUrl){
              this.DocumentDetailList.push(doc);
            }
          })
        });
        this.docTypeList.forEach(type => {
          if(type.id === id){
            this.docTypeName = type.fileTypeText;
          }
        })
      },
      //批量下载
      handleExport0() {
        this.list = [];
        // console.log(this.DocumentDetailList);
        this.DocumentDetailList.map(item => {
          return this.list.push({
            fileName: item.fileName,
            fileUrl: item.fileUrl
          })
        })
        // console.log(this.list);
        downloadDocument(this.list).then(response => {
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          var nowDate = year + "-" + month + "-" + day;
          let blob = new Blob([response], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });

          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = nowDate + ".rar"; // xxx.xls/xxx.xlsx
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
          this.$notify({
            title: "成功",
            message: "下载成功",
            type: "success",
            duration: 2000
          });
        });
      },
      down() {
        let temp
        if(this.multipleSelectionDownloads.length === 0){
          return this.$message.error('请选择需要下载的文件')
        }else {
          temp = this.multipleSelectionDownloads
        }
        let urls = []
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].fileUrl != null && temp[i].fileUrl != '') {
            let a = {
              fileUrl: temp[i].fileUrl,
              renameFileName: temp[i].fileName
            }
            urls.push(a)
          }
        }
        // console.log(urls)
        this.filesToRar(urls)
      },
      /**文件打包
       * arrImages:文件list:[{fileUrl:文件url,renameFileName:文件名}]
       * filename 压缩包名
       * */
      filesToRar(arrImages) {
        let _this = this;
        let zip = new JSZip();
        let cache = {};
        let promises = [];
        _this.title = '正在加载压缩文件';

        for (let item of arrImages) {
          const promise = _this.getImgArrayBuffer(item.fileUrl).then(data => {
            // 下载文件, 并存成ArrayBuffer对象(blob)
            zip.file(item.renameFileName, data, {
              binary: true
            }); // 逐个添加文件
            cache[item.renameFileName] = data;
          });
          promises.push(promise);
        }

        Promise.all(promises).then(() => {
          zip.generateAsync({
            type: "blob"
          }).then(content => {
            _this.title = '正在压缩';
            // 生成二进制流
            FileSaver.saveAs(content, this.order_number); // 利用file-saver保存文件  自定义文件名
            _this.title = '压缩完成';
          });
        }).catch(res => {
          _this.$message.error('文件压缩失败');
        });
      },
      //获取文件blob
      getImgArrayBuffer(url) {
        let _this = this;
        return new Promise((resolve, reject) => {
          //通过请求获取文件blob格式
          let xmlhttp = new XMLHttpRequest();
          xmlhttp.open("GET", url, true);
          xmlhttp.responseType = "blob";
          xmlhttp.onload = function() {
            if (this.status == 200) {
              resolve(this.response);
            } else {
              reject(this.status);
            }
          }
          xmlhttp.send();
        });
      },
    }
  };
</script>

<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  a.filecss0 {
    height: 35px;
    line-height: 35px;
    color: #000;
    text-decoration: underline;
  }

  a:hover {
    color: blue;
  }
</style>

