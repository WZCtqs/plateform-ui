import request from '@/utils/request'

// 查询客户满意度列表
export function listClientsatisfaction(query) {
  return request({
    url: '/clients/clientsatisfaction/list',
    method: 'get',
    params: query
  })
}

// 查询客户满意度详细
export function getClientsatisfaction(satisfactionId) {
  return request({
    url: '/clients/clientsatisfaction/' + satisfactionId,
    method: 'get'
  })
}

// 新增客户满意度
export function addClientsatisfaction(data) {
  return request({
    url: '/clients/clientsatisfaction',
    method: 'post',
    data: data
  })
}

// 修改客户满意度
export function updateClientsatisfaction(data) {
  return request({
    url: '/clients/clientsatisfaction',
    method: 'put',
    data: data
  })
}

// 删除客户满意度
export function delClientsatisfaction(satisfactionId) {
  return request({
    url: '/clients/clientsatisfaction/' + satisfactionId,
    method: 'delete'
  })
}

// 导出客户满意度
export function exportClientsatisfaction(query) {
  return request({
    url: '/clients/clientsatisfaction/export',
    method: 'get',
    params: query
  })
}