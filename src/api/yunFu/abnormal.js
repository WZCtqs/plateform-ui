import request from '@/utils/request'

// 外部列表
export function orderList (query) {
  return request({
    url: '/track/abnormalBox/orderList',
    method: 'get',
    params: query
  })
}

// 查询跟踪信息详情
export function listAbroad (id) {
  return request({
    url: '/track/abnormalBox/' + id,
    method: 'get'
  })
}

// 跟踪信息列表
export function abnormalBox (query) {
  return request({
    url: '/track/abnormalBox/list',
    method: 'get',
    params: query
  })
}

// 新增跟踪信息
export function abnormalB (data) {
  return request({
    url: '/track/abnormalBox',
    method: 'post',
    data: data
  })
}

// 修改跟踪信息
export function updateAbroad (data) {
  return request({
    url: '/track/abnormalBox',
    method: 'put',
    data: data
  })
}

// 删除运踪_中亚境外
export function delAbroad (ids) {
  return request({
    url: '/track/abnormalBox/' + ids,
    method: 'delete'
  })
}

// 拼箱运综录入详情
export function abd (query) {
  return request({
    url: '/track/abnormalBox/detail',
    method: 'get',
    params: query
  })
}

// 订单详情
export function order (id) {
  return request({
    url: '/track/abnormalBox/order?orderId=' + id,
    method: 'get'
  })
}

// 详情导出
export function orderExport (id) {
  return request({
    url: '/order/shippingorder/orderExport?orderId=' + id,
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 日报导出
export function exportDay (query) {
  return request({
    url: '/track/abnormalBox/exportDay',
    method: 'get',
    params: query
  })
}
// 月报导出
export function exportMonth (query) {
  return request({
    url: '/track/abnormalBox/exportMonth',
    method: 'get',
    params: query
  })
}
// 年报导出
export function exportYear (query) {
  return request({
    url: '/track/abnormalBox/exportYear',
    method: 'get',
    params: query
  })
}
// 年报导出
export function intellectTracking (canshu) {
  return request({
    url: '/track/abnormalBox/intellectTracking?classNum=' + canshu,
    method: 'get'
  })
}

// 获取邮箱
export function getEmails (id) {
  return request({
    url: '/track/abnormalBox/getEmails?isBcc=0&orderId=' + id,
    method: 'get'
  })
}

// 获取邮箱
export function getEmails1 (id) {
  return request({
    url: '/track/abnormalBox/getEmails?isBcc=1&orderId=' + id,
    method: 'get'
  })
}

// 新增保存发送
export function addAndSend (data) {
  return request({
    url: '/track/abnormalBox/addAndSend',
    method: 'post',
    data: data
  })
}

// 编辑保存发送
export function editAndSend (data) {
  return request({
    url: '/track/abnormalBox/editAndSend',
    method: 'post',
    data: data
  })
}