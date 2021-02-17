import request from '@/utils/request'

// 查询赔款跟踪列表
export function listTracking(query) {
  return request({
    url: '/customerservice/tracking/list',
    method: 'get',
    params: query
  })
}

// 根据orderid查询箱号列表,params用对象接收参数,或页面使用(row.orderId),服务(orderId接收参数)
export function listContainer(query) {
  return request({
    url: '/customerservice/status/boxNums',
    method: 'get',
    params: query
  })
}

// 查询赔款跟踪详细
export function getTracking(id) {
  return request({
    url: '/customerservice/tracking/' + id,
    method: 'get'
  })
}

// 新增赔款跟踪
export function addTracking(data) {
  return request({
    url: '/customerservice/tracking',
    method: 'post',
    data: data
  })
}

// 修改赔款跟踪
export function updateTracking(data) {
  return request({
    url: '/customerservice/tracking',
    method: 'put',
    data: data
  })
}

// 下载模板
export function downloadMessage(type) {
  return request({
    url: '/customerservice/file/download',
    method: 'get',
    params:{type},
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//导入
export function importObj(obj) {
  return request({
    url: '/customerservice/tracking/importData',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}

// 删除赔款跟踪
export function delTracking(id) {
  return request({
    url: '/customerservice/tracking/' + id,
    method: 'delete'
  })
}

// 导出赔款跟踪
export function exportTracking(query) {
  return request({
    url: '/customerservice/tracking/export',
    method: 'get',
    params: query
  })
}