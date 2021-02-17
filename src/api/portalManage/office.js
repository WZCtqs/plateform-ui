import request from '@/utils/request'

// 查询办事处信息列表
export function listOffice(query) {
  return request({
    url: '/backclient/office/list',
    method: 'get',
    params: query
  })
}

// 查询办事处信息详细
export function getOffice(officeId) {
  return request({
    url: '/backclient/office/' + officeId,
    method: 'get'
  })
}

// 新增办事处信息
export function addOffice(data) {
  return request({
    url: '/backclient/office',
    method: 'post',
    data: data
  })
}

// 修改办事处信息
export function updateOffice(data) {
  return request({
    url: '/backclient/office',
    method: 'put',
    data: data
  })
}

// 删除办事处信息
export function delOffice(officeId) {
  return request({
    url: '/backclient/office/' + officeId,
    method: 'delete'
  })
}

// 导出办事处信息
export function exportOffice(query) {
  return request({
    url: '/backclient/office/export',
    method: 'get',
    params: query
  })
}