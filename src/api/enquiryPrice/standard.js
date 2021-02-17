import request from '@/utils/request'

// 查询收费标准列表
export function listStandard(query) {
  return request({
    url: '/backclient/standard/list',
    method: 'get',
    params: query
  })
}

// 查询收费标准详细
export function getStandard(id) {
  return request({
    url: '/backclient/standard/' + id,
    method: 'get'
  })
}

// 新增收费标准
export function addStandard(data) {
  return request({
    url: '/backclient/standard',
    method: 'post',
    data: data
  })
}

// 修改收费标准
export function updateStandard(data) {
  return request({
    url: '/backclient/standard',
    method: 'put',
    data: data
  })
}

// 删除收费标准
export function delStandard(id) {
  return request({
    url: '/backclient/standard/' + id,
    method: 'delete'
  })
}

// 导出收费标准
export function exportStandard(query) {
  return request({
    url: '/backclient/standard/export',
    method: 'get',
    params: query
  })
}