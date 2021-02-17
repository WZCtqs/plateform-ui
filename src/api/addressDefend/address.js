import request from '@/utils/request'

// 查询运踪_位置地名管理--沿途运踪使用列表
export function listAddress(query) {
  return request({
    url: '/track/address/list',
    method: 'get',
    params: query
  })
}

// 查询运踪_位置地名管理--沿途运踪使用详细
export function getAddress(id) {
  return request({
    url: '/track/address/' + id,
    method: 'get'
  })
}

// 新增运踪_位置地名管理--沿途运踪使用
export function addAddress(data) {
  return request({
    url: '/track/address',
    method: 'post',
    data: data
  })
}

// 修改运踪_位置地名管理--沿途运踪使用
export function updateAddress(data) {
  return request({
    url: '/track/address',
    method: 'put',
    data: data
  })
}

// 删除运踪_位置地名管理--沿途运踪使用
export function delAddress(id) {
  return request({
    url: '/track/address/' + id,
    method: 'delete'
  })
}

// 导出运踪_位置地名管理--沿途运踪使用
export function exportAddress(query) {
  return request({
    url: '/track/address/export',
    method: 'get',
    params: query
  })
}