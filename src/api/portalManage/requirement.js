import request from '@/utils/request'

// 查询铁路要求列表
export function listRequirement(query) {
  return request({
    url: '/backclient/requirement/list',
    method: 'get',
    params: query
  })
}

// 查询铁路要求详细
export function getRequirement(id) {
  return request({
    url: '/backclient/requirement/' + id,
    method: 'get'
  })
}

// 新增铁路要求
export function addRequirement(data) {
  return request({
    url: '/backclient/requirement',
    method: 'post',
    data: data
  })
}

// 修改铁路要求
export function updateRequirement(data) {
  return request({
    url: '/backclient/requirement',
    method: 'put',
    data: data
  })
}

// 删除铁路要求
export function delRequirement(id) {
  return request({
    url: '/backclient/requirement/' + id,
    method: 'delete'
  })
}

// 导出铁路要求
export function exportRequirement(query) {
  return request({
    url: '/backclient/requirement/export',
    method: 'get',
    params: query
  })
}