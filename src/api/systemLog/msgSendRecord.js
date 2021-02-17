import request from '@/utils/request'

// 查询消息提醒列表
export function listMessage(query) {
  return request({
    url: '/monitor/message/list',
    method: 'get',
    params: query
  })
}

// 查询消息提醒详细
export function getMessage(id) {
  return request({
    url: '/monitor/message/' + id,
    method: 'get'
  })
}

// 新增消息提醒
export function addMessage(data) {
  return request({
    url: '/monitor/message',
    method: 'post',
    data: data
  })
}

// 修改消息提醒
export function updateMessage(data) {
  return request({
    url: '/monitor/message',
    method: 'put',
    data: data
  })
}

// 删除消息提醒
export function delMessage(id) {
  return request({
    url: '/monitor/message/' + id,
    method: 'delete'
  })
}

// 导出消息提醒
export function exportMessage(query) {
  return request({
    url: '/monitor/message/export',
    method: 'get',
    params: query
  })
}