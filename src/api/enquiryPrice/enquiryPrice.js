import request from "@/utils/request";

// 查询询价反馈结果数据列表
export function fetchList(obj) {
  return request({
    url: "/inquiry/order/list",
    method: "get",
    params: obj
  });
}

// 获取询价反馈结果数据详细信息
export function getDetail(obj) {
  return request({
    url: "/inquiry/order/" + obj,
    method: "get"
  });
}
// 获取询价反馈结果数据详细信息
export function InquiryResult(id) {
  return request({
    url: "/inquiry/result/moreInquiryResult/?inquiryId=" + id,
    method: "get"
  });
}
// 修改询价反馈结果数据
export function editResult(data) {
  return request({
    url: "/inquiry/result",
    method: "put",
    data: data
  });
}
// 发送客户修改状态
export function sendCustomers(data) {
  return request({
    url: "/inquiry/order",
    method: "put",
    data: data
  });
}
// 获取询价反馈结果详细详情数据
export function detailResult(id) {
  return request({
    url: "/inquiry/result/" + id,
    method: "get"
  });
}

// 发送客户前判定公路报价的提箱地是否存在
export function judgeTxAddress(id) {
  return request({
    url: "/inquiry/order/judge?id="+id,
    method: "get"
  });
}
// 查询还箱地
export function returnList(obj) {
  return request({
    url: "/basic/boxfee/addressList",
    method: "get",
    params: obj
  });
}
// 查询提箱地
export function pickList(obj) {
  return request({
    url: "/basic/boxfee/pickList",
    method: "get",
    params: obj
  });
}
