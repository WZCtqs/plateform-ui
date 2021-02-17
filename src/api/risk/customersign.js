import request from '@/utils/request'

// 查询客户标记列表
export function listCustomersign(query) {
  return request({
    url: '/basic/customersign/list',
    method: 'get',
    params: query
  })
}

// 查询客户标记详细
export function getCustomersign(signId) {
  return request({
    url: '/basic/customersign/getInfo/?signId=' + signId,
    method: 'get'
  })
}

// 新增客户标记
export function addCustomersign(data) {
  return request({
    url: '/basic/customersign/signAdd',
    method: 'post',
    data: data
  })
}

// 修改客户标记
export function updateCustomersign(data) {
  return request({
    url: '/basic/customersign/signEdit',
    method: 'put',
    data: data
  })
}

// 删除客户标记
export function delCustomersign(signIds) {
  return request({
    url: '/basic/customersign/signDel/?signIds=' + signIds,
    method: 'get'
  })
}

// 导出客户标记
export function exportCustomersign(query) {
  return request({
    url: '/basic/customersign/export',
    method: 'get',
    params: query
  })
}