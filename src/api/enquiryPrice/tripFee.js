import request from '@/utils/request'

// 查询郑欧线整柜去程费用列表
export function listTripFee(query) {
  return request({
    url: '/enquiry/tripFee/list',
    method: 'get',
    params: query
  })
}

// 查询郑欧线整柜去程费用详细
export function getTripFee(id) {
  return request({
    url: '/enquiry/tripFee/' + id,
    method: 'get'
  })
}

// 新增郑欧线整柜去程费用
export function addTripFee(data) {
  return request({
    url: '/enquiry/tripFee',
    method: 'post',
    data: data
  })
}

// 修改郑欧线整柜去程费用
export function updateTripFee(data) {
  return request({
    url: '/enquiry/tripFee',
    method: 'put',
    data: data
  })
}

// 删除郑欧线整柜去程费用
export function delTripFee(id) {
  return request({
    url: '/enquiry/tripFee/' + id,
    method: 'delete'
  })
}

// 导出郑欧线整柜去程费用
export function exportTripFee(query) {
  return request({
    url: '/enquiry/tripFee/export',
    method: 'get',
    params: query
  })
}
// 导入郑欧线整柜去程费用
export function importZgdivision(obj) {
  return request({
    url: '/enquiry/tripFee/importExcel',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'MultipartFile'
    }
  })
}
// 下载郑欧线整柜去程费用
export function downLoadExcel() {
  return request({
    url: '/enquiry/tripFee/downLoadExcel',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })
}