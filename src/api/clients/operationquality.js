import request from '@/utils/request'

// 查询操作质量投诉列表
export function listOperationquality(query) {
  return request({
    url: '/clients/operationquality/list',
    method: 'get',
    params: query
  })
}

// 查询操作质量投诉详细
export function getOperationquality(qualityId) {
  return request({
    url: '/clients/operationquality/' + qualityId,
    method: 'get'
  })
}

// 新增操作质量投诉
export function addOperationquality(data) {
  return request({
    url: '/clients/operationquality',
    method: 'post',
    data: data
  })
}

// 修改操作质量投诉
export function updateOperationquality(data) {
  return request({
    url: '/clients/operationquality',
    method: 'put',
    data: data
  })
}

// 删除操作质量投诉
export function delOperationquality(qualityId) {
  return request({
    url: '/clients/operationquality/' + qualityId,
    method: 'delete'
  })
}

// 导出操作质量投诉
export function exportOperationquality(query) {
  return request({
    url: '/clients/operationquality/export',
    method: 'get',
    params: query
  })
}