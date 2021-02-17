import request from '@/utils/request'

// 查询单证要求列表
export function listRequired(query) {
  return request({
    url: '/backclient/required/list',
    method: 'get',
    params: query
  })
}

// 查询单证要求详细
export function getRequired(id) {
  return request({
    url: '/backclient/required/' + id,
    method: 'get'
  })
}

// 新增单证要求
export function addRequired(data) {
  return request({
    url: '/backclient/required',
    method: 'post',
    data: data
  })
}

// 修改单证要求
export function updateRequired(data) {
  return request({
    url: '/backclient/required',
    method: 'put',
    data: data
  })
}

// 删除单证要求
export function delRequired(id) {
  return request({
    url: '/backclient/required/' + id,
    method: 'delete'
  })
}

// 导出单证要求
export function exportRequired(query) {
  return request({
    url: '/backclient/required/export',
    method: 'get',
    params: query
  })
}