import request from '@/utils/request'

// 查询郑欧整柜回程送货费用列表
export function listZgReturnfee(query) {
  return request({
    url: '/enquiry/zgReturnfee/list',
    method: 'get',
    params: query
  })
}

// 查询郑欧整柜回程送货费用详细
export function getZgReturnfee(id) {
  return request({
    url: '/enquiry/zgReturnfee/' + id,
    method: 'get'
  })
}

// 新增郑欧整柜回程送货费用
export function addZgReturnfee(data) {
  return request({
    url: '/enquiry/zgReturnfee',
    method: 'post',
    data: data
  })
}

// 修改郑欧整柜回程送货费用
export function updateZgReturnfee(data) {
  return request({
    url: '/enquiry/zgReturnfee',
    method: 'put',
    data: data
  })
}

// 删除郑欧整柜回程送货费用
export function delZgReturnfee(id) {
  return request({
    url: '/enquiry/zgReturnfee/' + id,
    method: 'delete'
  })
}

// 导出郑欧整柜回程送货费用
export function exportZgReturnfee(query) {
  return request({
    url: '/enquiry/zgReturnfee/export',
    method: 'get',
    params: query
  })
}
// 导入郑欧线整柜回程费用
export function importZgdivision(obj) {
  return request({
    url: '/enquiry/zgReturnfee/importExcel',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'MultipartFile'
    }
  })
}
// 下载郑欧线整柜回程费用
export function downLoadExcel() {
  return request({
    url: '/enquiry/zgReturnfee/downLoadExcel',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })
}