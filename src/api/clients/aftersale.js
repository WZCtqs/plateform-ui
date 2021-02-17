import request from '@/utils/request'

// 查询客户管理列表
export function listClients(query) {
  return request({
    url: '/clients/clients/list',
    method: 'get',
    params: query
  })
}

// 查询客户管理详细
export function getClients(clientId) {
  return request({
    url: '/clients/clients/' + clientId,
    method: 'get'
  })
}

// 新增客户管理
export function addClients(data) {
  return request({
    url: '/clients/clients',
    method: 'post',
    data: data
  })
}

// 修改客户管理
export function updateClients(data) {
  return request({
    url: '/clients/clients',
    method: 'put',
    data: data
  })
}

// 删除客户管理
export function delClients(clientId) {
  return request({
    url: '/clients/clients/' + clientId,
    method: 'delete'
  })
}
// 导入
export function importObj(obj) {
  return request({
    url: '/common/owner/uploadExcel',//待提供导入接口地址
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}

// 导出客户管理
export function exportClients(query) {
  return request({
    url: '/clients/clients/export',
    method: 'get',
    params: query
  })
}