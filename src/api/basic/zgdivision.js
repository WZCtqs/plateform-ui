import request from '@/utils/request'

// 查询整柜铁路运费列表
export function listZgdivision(query) {
  return request({
    url: '/cost/zgRailWayCost/list',
    method: 'get',
    params: query
  })
}

// 查询整柜铁路运费详细
export function getZgdivision(id) {
  return request({
    url: '/cost/zgRailWayCost/' + id,
    method: 'get'
  })
}

// 新增整柜铁路运费
export function addZgdivision(data) {
  return request({
    url: '/cost/zgRailWayCost',
    method: 'post',
    data: data
  })
}

// 修改整柜铁路运费
export function updateZgdivision(data) {
  return request({
    url: '/cost/zgRailWayCost',
    method: 'put',
    data: data
  })
}

// 删除整柜铁路运费
export function delZgdivision(ids) {
  return request({
    url: '/cost/zgRailWayCost/' + ids,
    method: 'delete'
  })
}

// 导入整柜铁路运费
export function importZgdivision(obj) {
  return request({
    url: '/cost/zgRailWayCost/importExcel',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'MultipartFile'
    }
  })
}
// 下载整柜铁路运费模板
export function downLoadExcel() {
  return request({
    url: '/cost/zgRailWayCost/downLoadExcel',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })
}