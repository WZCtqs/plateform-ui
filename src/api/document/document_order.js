import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listDocument(query) {
  return request({
    url: '/document/order/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getDocument(id) {
  return request({
    url: '/document/order/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addDocument(data) {
  return request({
    url: '/document/order',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateDocument(data) {
  return request({
    url: '/document/order',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delDocument(id) {
  return request({
    url: '/document/order/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportDocument(query) {
  return request({
    url: '/document/order/export',
    method: 'get',
    params: query
  })
}
