import request from '@/utils/request'

// 查询推荐人管理列表
export function listReference(query) {
  return request({
    url: '/clients/reference/list',
    method: 'get',
    params: query
  })
}

// 查询推荐人管理详细
export function getReference(id) {
  return request({
    url: '/clients/reference/' + id,
    method: 'get'
  })
}

// 新增推荐人管理
export function addReference(data) {
  return request({
    url: '/clients/reference',
    method: 'post',
    data: data
  })
}

// 修改推荐人管理
export function updateReference(data) {
  return request({
    url: '/clients/reference',
    method: 'put',
    data: data
  })
}

// 删除推荐人管理
export function delReference(id) {
  return request({
    url: '/clients/reference/' + id,
    method: 'delete'
  })
}

// 导出推荐人管理
export function exportReference(query) {
  return request({
    url: '/clients/reference/export',
    method: 'get',
    params: query
  })
}