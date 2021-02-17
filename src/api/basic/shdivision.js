import request from '@/utils/request'

// 查询散货铁路运费列表
export function listShdivision(query) {
  return request({
    url: '/cost/shRailWayCost/list',
    method: 'get',
    params: query
  })
}

// 查询散货铁路运费详细
export function getShdivision(id) {
  return request({
    url: '/cost/shRailWayCost/' + id,
    method: 'get'
  })
}

// 新增散货铁路运费
export function addShdivision(data) {
  return request({
    url: '/cost/shRailWayCost',
    method: 'post',
    data: data
  })
}

// 修改散货铁路运费
export function updateShdivision(data) {
  return request({
    url: '/cost/shRailWayCost',
    method: 'put',
    data: data
  })
}

// 删除散货铁路运费
export function delShdivision(ids) {
  return request({
    url: '/cost/shRailWayCost/' + ids,
    method: 'delete'
  })
}

// 导出散货铁路运费
export function exportShdivision(query) {
  return request({
    url: '/cost/shRailWayCost/export',
    method: 'get',
    params: query
  })
}
// 导入散货铁路运费
export function importShRailWayCost(obj) {
  return request({
    url: '/cost/shRailWayCost/importExcel',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'MultipartFile'
    }
  })
}
// 下载散货铁路运费导入模板
export function downLoadExcel() {
  return request({
    url: '/cost/shRailWayCost/downLoadExcel',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })
}