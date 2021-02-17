import request from '@/utils/request'

// 查询消息发送记录列表
export function listRecord(query) {
  return request({
    url: '/message/record/list',
    method: 'get',
    params: query
  })
}

// 查询消息发送记录详细
export function getRecord(id) {
  return request({
    url: '/message/record/' + id,
    method: 'get'
  })
}

// 新增消息发送记录
export function addRecord(data) {
  return request({
    url: '/message/record',
    method: 'post',
    data: data
  })
}

// 修改消息发送记录
export function updateRecord(data) {
  return request({
    url: '/message/record',
    method: 'put',
    data: data
  })
}

// 删除消息发送记录
export function delRecord(id) {
  return request({
    url: '/message/record/' + id,
    method: 'delete'
  })
}

// 导出消息发送记录
export function exportRecord(query) {
  return request({
    url: '/message/record/export',
    method: 'get',
    params: query
  })
}