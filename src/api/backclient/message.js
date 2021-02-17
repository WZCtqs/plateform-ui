import request from '@/utils/request'

// 查询新闻信息列表
export function listMessage (query) {
  return request({
    url: '/backclient/message/list',
    method: 'get',
    params: query
  })
}

// 查询新闻信息详细
export function getMessage (query) {
  return request({
    url: '/backclient/message/getDetail',
    method: 'get',
    params: query
  })
}

// 新增新闻信息
export function addMessage (data) {
  return request({
    url: '/backclient/message',
    method: 'post',
    data: data
  })
}

// 修改新闻信息
export function updateMessage (data) {
  return request({
    url: '/backclient/message',
    method: 'put',
    data: data
  })
}

// 删除新闻信息
export function delMessage (id) {
  return request({
    url: '/backclient/message/' + id,
    method: 'delete'
  })
}

// 导出新闻信息
export function exportMessage (query) {
  return request({
    url: '/backclient/message/export',
    method: 'get',
    params: query
  })
}