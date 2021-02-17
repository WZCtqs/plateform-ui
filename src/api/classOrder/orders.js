import request from "@/utils/request";

export function fetchList(obj) {
  return request({
    url: "/order/shippingorder/orderList",
    method: "get",
    params: obj
  });
}

// 箱量统计
export function boxAmountTotal(obj) {
  return request({
    url: "/order/shippingorder/boxAmountTotal",
    method: "get",
    params: obj
  });
}

// 转待审核列表
export function fetchList1(obj) {
  return request({
    url: "/order/shippingorder/checkList",
    method: "get",
    params: obj
  });
}

// 订舱公告列表
export function fetchList2(obj) {
  return request({
    url: "/order/examinfo/examList",
    method: "get",
    params: obj
  });
}

// 查看订单修改记录
export function historyEditRecord(obj) {
  return request({
    url: "/order/shippingorder/historyEditRecord",
    method: "get",
    params: obj
  });
}

// 查看订单转待修改记录
export function zdhistoryEditRecord(obj) {
  return request({
    url: "/order/examinfo/oneEditRecord",
    method: "get",
    params: obj
  });
}

export function detailapi(obj) {
  return request({
    url: "/order/shippingorder/" + obj,
    method: "get"
  });
}
export function updateapi(data) {
  return request({
    url: "/order/shippingorder/orderEdit",
    method: "put",
    data: data
  });
}

export function orderCancelapi(data) {
  return request({
    url: "/order/shippingorder/orderCancel",
    method: "put",
    data: data
  });
}

export function deleteapi(obj) {
  return request({
    url: "/order/shippingorder/" + obj,
    method: "delete"
  });
}

// 贸易方式列表数据
export function orderListMy() {
  return request({
    url: "/basic/busidict/listMy",
    method: "get"
  });
}
// 最新上货站编号堆场地址
export function stationNewNum(orderId) {
  return request({
    url: "/order/shippingorder/orderSiteCode",
    method: "get",
    params: { orderId }
  });
}

// 堆场地址列表数据
export function stationList(obj) {
  return request({
    url: "/order/shippingorder/stationList",
    method: "get",
    params: obj
  });
}

// 询价详情接口，转待审核托书弹框中显示询价详情内容
export function inquiryInfo(obj) {
  return request({
    url: "/order/shippingorder/inquiryInfo?inquiryRecordId=" + obj,
    method: "get"
  });
}

// 货物商品详情：
export function goodsInfo(obj) {
  return request({
    url: "/order/shippingorder/goodsInfo?inquiryRecordId=" + obj,
    method: "get"
  });
}

// 导出
export function downLoadExcel(obj) {
  return request({
    url: "/order/shippingorder/orderExport?orderId=" + obj,
    method: "get",
    responseType: "blob", //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

// 修改班列
export function classesApi() {
  return request({
    url: "/bi/classes?inquiryRecordId=132&language=ch",
    method: "get"
  });
}

// 上下货站
export function getSiteByOrderId(obj) {
  return request({
    url: "/order/shippingorder/getSiteByOrderId",
    method: "get",
    params: obj
  });
}

// 转待审核申请
export function orderCheckApplyapi(data) {
  return request({
    url: "/order/shippingorder/orderCheckApply",
    method: "put",
    data: data
  });
}

// 转待审核申请
export function orderCheckReplyapi(data) {
  return request({
    url: "/order/shippingorder/orderCheckReply",
    method: "put",
    data: data
  });
}

// 修改舱位号
export function orderSpaceEditapi(data) {
  return request({
    url: "/order/shippingorder/orderSpaceEdit",
    method: "put",
    data: data
  });
}

// 箱量修改
export function orderxlEditapi(data) {
  return request({
    url: "/order/shipOrder/zgCountChange",
    method: "put",
    data: data
  });
}

// 添加订舱组备注
export function addRemark(data) {
  return request({
    url: "/order/examinfo/addRemark",
    method: "put",
    data: data
  });
}

// 转待审核修改记录
export function checkEditRecord(obj) {
  return request({
    url: "/order/shippingorder/checkEditRecord",
    method: "get",
    params: obj
  });
}

// 托书转待原因 列表
export function examInfoListApi(obj) {
  return request({
    url: "/order/examinfo/examInfoList",
    method: "get",
    params: obj
  });
}

// 转待审核修改记录
export function getOrderNumberApi(obj) {
  return request({
    url: "/order/shippingorder/getOrderNumber?orderId=" + obj,
    method: "get"
  });
}

// 转待审核 标记已读
export function addIsRead(obj) {
  return request({
    url: "/order/examinfo/addIsRead",
    method: "put",
    data: obj
  });
}

// 转待审核记录 标记已读
export function addIsRead1(obj) {
  return request({
    url: "/order/examinfo/addRemark",
    method: "put",
    data: obj
  });
}

// 转待审核 标记已读
export function getInfoByBh(obj) {
  return request({
    url: "/order/shippingorder/getInfoByBh",
    method: "get",
    params: obj
  });
}

// 撤舱列表
export function cancelCheckList(obj) {
  return request({
    url: "/order/shippingorder/cancelCheckList",
    method: "get",
    params: obj
  });
}
// 撤舱审核
export function cancelCheckReply(obj) {
  return request({
    url: "/order/shippingorder/cancelCheckReply",
    method: "put",
    data: obj
  });
}

// 托书汇总表列表查询
export function listCollect(obj) {
  return request({
    url: "/order/shippingorder/listCollect",
    method: "get",
    params: obj
  });
}

// 导出托书汇总表
// export function exportOrders(obj) {
//   return request({
//     url: "/order/shippingorder/export",
//     method: "get",
//     params: obj,
//     responseType: "blob", //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
//     headers: {
//       "Content-Type": "application/json;charset=UTF-8"
//     }
//   });
// }
export function exportOrders(query) {
  return request({
    url: "/order/shipOrder/export",
    method: "get",
    params: query
  });
}

// 随车组导出
export function scExportOrders(query) {
  return request({
    url: "/order/shippingorder/scExport",
    method: "get",
    params: query,
    responseType: "blob", //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

// 托书汇总表页面 上下货站列表数据
export function siteListCollect() {
  return request({
    url: "/trains/site/siteListCollect",
    method: "get"
  });
}
