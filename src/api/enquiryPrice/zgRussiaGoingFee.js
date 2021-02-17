import request from '@/utils/request'

// 查询俄线提货费列表
export function listZgRussiaGoingFee(query) {
  return request({
    url: '/enquiry/zgRussiaGoingFee/list',
    method: 'get',
    params: query
  })
}

// 查询俄线提货费详细
export function getZgRussiaGoingFee(id) {
  return request({
    url: '/enquiry/zgRussiaGoingFee/' + id,
    method: 'get'
  })
}

// 新增俄线提货费
export function addZgRussiaGoingFee(data) {
  return request({
    url: '/enquiry/zgRussiaGoingFee',
    method: 'post',
    data: data
  })
}

// 修改俄线提货费
export function updateZgRussiaGoingFee(data) {
  return request({
    url: '/enquiry/zgRussiaGoingFee',
    method: 'put',
    data: data
  })
}

// 删除俄线提货费
export function delZgRussiaGoingFee(id) {
  return request({
    url: '/enquiry/zgRussiaGoingFee/' + id,
    method: 'delete'
  })
}

// 导出俄线提货费
export function exportZgRussiaGoingFee(query) {
  return request({
    url: '/enquiry/zgRussiaGoingFee/export',
    method: 'get',
    params: query
  })
}

// 下载俄线提货费用导入模板
export function downloadMessage(type) {
  return request({
    url: '/enquiry/zgRussiaGoingFee/downLoadExcel',
    method: 'get',
    params:{type},
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 导入俄线提货费
export function importObj(obj) {
  return request({
    url: '/enquiry/zgRussiaGoingFee/importExcel',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}
