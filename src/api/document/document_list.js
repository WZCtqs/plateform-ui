import request from "@/utils/request";

// 查询单证列表
export function listDocument(query) {
  return request({
    url: "/document/order/orderlist",
    method: "get",
    params: query
  });
}
// 查询超节点单证列表
export function getBeyondDocs(query) {
  return request({
    url: "/document/order/getBeyondDocs",
    method: "get",
    params: query
  });
}

// 查询超节点单证列表
export function getPickUpGoodsTime(query) {
  return request({
    url: "/document/order/getPickUpGoodsTime",
    method: "get",
    params: query
  });
}
//单证类型查询一级集合
export function getParentList() {
  return request({
    url: "/document/type/getparentlist",
    method: "get"
  });
}

// 查询页签下对应的单证
export function listDocumentDetail(query) {
  return request({
    url: "/document/order/list",
    method: "get",
    params: query
  });
}

// 提醒客户确认提货时间
export function confirmClients(params) {
  return request({
    url: "/client/document/emailNotice",
    method: "get",
    params: params
  });
}

// 批量下载
export function downloadDocument(data) {
  return request({
    url: "/document/order/downloadFile",
    method: "post",
    data: data,
    responseType: "blob", //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}


// 箱号、铅封号、上传装箱照 获取列表详情接口
export function getConList(data) {
  return request({
    url: '/docSendGoodsSelf/getConList',
    method: 'get',
    params:data
  })
}

// 上传接口0
export function docOrderDocumentAdd0(data, headers) {
  return request({
    url: '/docSendGoodsSelf/uploadDoc',
    method: 'post',
    data,
    headers
  })
}

// 箱号、铅封号、上传装箱照 提交保存接口
export function saveConAndSeal(params) {
  return request({
    url:'/docSendGoodsSelf/saveConAndSeal',
    method: 'post',
    data:params
  })
}

// 箱号、铅封号、上传装箱照 删除接口
export function docSendGoodsSelfDelete(params) {
  return request({
    url:'/docSendGoodsSelf/'+params.docId+'/'+params.orderId,
    method: 'delete'
  })
}

