import request from '@/utils/request'

// 查询售后列表
export function listMessage(query) {
  return request({
    url: '/customerservice/message/list',
    method: 'get',
    params: query
  })
}

// 查询售后详细
export function getMessage(id) {
  return request({
    url: '/customerservice/message/' + id,
    method: 'get'
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

// 根据orderid查询箱号列表,params用对象接收参数,或页面使用(row.orderId),服务(orderId接收参数)
export function listContainer(query) {
  return request({
    url: '/customerservice/status/boxNums',
    method: 'get',
    params: query
  })
}

//导入
export function importObj(obj) {
  return request({
    url: '/customerservice/message/importData',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}

// 新增售后
export function addMessage(data) {
  return request({
    url: '/customerservice/message',
    method: 'post',
    data: data
  })
}

// 修改售后
export function updateMessage(data) {
  return request({
    url: '/customerservice/message',
    method: 'put',
    data: data
  })
}

// 删除售后
export function delMessage(id) {
  return request({
    url: '/customerservice/message/' + id,
    method: 'delete'
  })
}

// 导出售后
export function exportMessage(query) {
  return request({
    url: '/customerservice/message/export',
    method: 'get',
    params: query
  })
}