import request from '@/utils/request'

// 查询郑亚、郑越去程整柜提货费列表
export function listZgAsiaFee(query) {
  return request({
    url: '/enquiry/zgAsiaFee/list',
    method: 'get',
    params: query
  })
}

// 查询郑亚、郑越去程整柜提货费详细
export function getZgAsiaFee(id) {
  return request({
    url: '/enquiry/zgAsiaFee/' + id,
    method: 'get'
  })
}

// 新增郑亚、郑越去程整柜提货费
export function addZgAsiaFee(data) {
  return request({
    url: '/enquiry/zgAsiaFee',
    method: 'post',
    data: data
  })
}

// 修改郑亚、郑越去程整柜提货费
export function updateZgAsiaFee(data) {
  return request({
    url: '/enquiry/zgAsiaFee',
    method: 'put',
    data: data
  })
}

// 删除郑亚、郑越去程整柜提货费
export function delZgAsiaFee(id) {
  return request({
    url: '/enquiry/zgAsiaFee/' + id,
    method: 'delete'
  })
}

// 导出郑亚、郑越去程整柜提货费
export function exportZgAsiaFee(query) {
  return request({
    url: '/enquiry/zgAsiaFee/export',
    method: 'get',
    params: query
  })
}

// 导入俄线提货费
export function importObj(obj) {
  return request({
    url: '/enquiry/zgAsiaFee/importExcel',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}

// 下载导入模板
export function downloadMessage(type) {
  return request({
    url: '/enquiry/zgAsiaFee/downLoadExcel',
    method: 'get',
    params:{type},
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
