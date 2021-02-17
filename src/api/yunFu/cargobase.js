import request from '@/utils/request'

// 查询货物知识库列表
export function listCargobase(query) {
  return request({
    url: '/order/cargobase/list',
    method: 'get',
    params: query
  })
}

// 查询货物知识库详细
export function getCargobase(id) {
  return request({
    url: '/order/cargobase/' + id,
    method: 'get'
  })
}

// 新增货物知识库
export function addCargobase(data) {
  return request({
    url: '/order/cargobase',
    method: 'post',
    data: data
  })
}

// 修改货物知识库
export function updateCargobase(data) {
  return request({
    url: '/order/cargobase',
    method: 'put',
    data: data
  })
}

// 删除货物知识库
export function delCargobase(id) {
  return request({
    url: '/order/cargobase/' + id,
    method: 'delete'
  })
}

// 导出货物知识库
export function exportCargobase(query) {
  return request({
    url: '/order/cargobase/export',
    method: 'get',
    params: query
  })
}

// 下载散货铁路运费导入模板
export function downloadWest() {
  return request({
    url: '/order/cargobase/downLoadExcelWest',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 下载散货铁路运费导入模板
export function downloadEast() {
  return request({
    url: '/order/cargobase/downLoadExcelEast',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 导入俄线提货费
export function importExcel(obj) {
  return request({
    url: '/order/cargobase/importExcel',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}

