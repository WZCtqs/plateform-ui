import request from '@/utils/request'

// 查询消息设置列表
export function listMessageSet(query) {
  return request({
    url: '/system/messageSet/list',
    method: 'get',
    params: query
  })
}

// 查询 新增时查询单证类型名称
export function getDocType() {
  return request({
    url: '/system/messageSet/documentList',
    method: 'get',
  })
}

// 查询消息设置详细
export function getMessageSet(id) {
  return request({
    url: '/system/messageSet/' + id,
    method: 'get'
  })
}

// 新增消息设置
export function addMessageSet(data) {
  return request({
    url: '/system/messageSet',
    method: 'post',
    data: data
  })
}

// 修改消息设置
export function updateMessageSet(data) {
  return request({
    url: '/system/messageSet',
    method: 'put',
    data: data
  })
}

// 删除消息设置
export function delMessageSet(id) {
  return request({
    url: '/system/messageSet/' + id,
    method: 'delete'
  })
}

// 导出消息设置
export function exportMessageSet(query) {
  return request({
    url: '/system/messageSet/export',
    method: 'get',
    params: query
  })
}