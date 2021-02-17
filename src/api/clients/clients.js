import request from "@/utils/request";

// 查询客户管理列表
export function listClients(query) {
  return request({
    url: "/clients/clients/list",
    method: "get",
    params: query
  });
}

// 推荐人列表查询
export function referenceLists() {
  return request({
    url: "/system/user/referenceList",
    method: "get"
  });
}

// 跟单员列表查询
export function merchandiserList(obj) {
  return request({
    url: "/system/user/merchandiserList",
    method: "get",
    params: obj
  });
}

// 国内外客户数量
export function calculateEnOrChNumApi(obj) {
  return request({
    url: "/clients/clients/calculateEnOrChNum",
    method: "get",
    params: obj
  });
}

// 批量修改跟单员
export function updateMerchandiser(obj) {
  return request({
    url: "/clients/clients/updateMerchandiser",
    method: "get",
    params: obj
  });
}

// 批量删除跟单员
export function deleteMore(obj) {
  return request({
    url: "/clients/clients/deleteMore",
    method: "get",
    params: obj
  });
}

// 查询客户管理详细
export function getClients(clientId) {
  return request({
    url: "/clients/clients/" + clientId,
    method: "get"
  });
}

// 新增客户管理
export function addClients(data) {
  return request({
    url: "/clients/clients",
    method: "post",
    data: data
  });
}

// 修改客户管理
export function updateClients(data) {
  return request({
    url: "/clients/clients",
    method: "put",
    data: data
  });
}

//批量新增跟单员
export function groupAddClients(data) {
  return request({
    url: "/clients/clients/editMerByTjr",
    method: "put",
    data: data
  });
}

// 删除客户管理
export function delClients(clientId) {
  return request({
    url: "/clients/clients/" + clientId,
    method: "delete"
  });
}

// 导出客户管理
export function exportClients(query) {
  return request({
    url: "/clients/clients/export",
    method: "get",
    params: query
  });
}

// 客户审核
export function auditClients(data) {
  return request({
    url: "/clients/clients/audit",
    method: "put",
    data: data
  });
}

// 客户审核
export function getMerchandisersInfo(data) {
  return request({
    url: "/clients/clients/getMerchandisersInfo",
    method: "get",
    params: data
  });
}

// 客户 发送邮件
export function sendEmail(data) {
  return request({
    url: "/clients/clients/sendEmail",
    method: "get",
    params: data
  });
}

// 导出客户合同
export function exportContract(query) {
  return request({
    url: "/clients/clients/exportContract",
    method: "get",
    params: query
  });
}

