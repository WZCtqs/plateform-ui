import request from '@/utils/request'

// 查询部门考核管理列表
export function listEvaluation(query) {
  return request({
    url: '/system/evaluation/list',
    method: 'get',
    params: query
  })
}

// 查询部门考核管理详细
export function getEvaluation(evaluationId) {
  return request({
    url: '/system/evaluation/' + evaluationId,
    method: 'get'
  })
}

// 新增部门考核管理
export function addEvaluation(data) {
  return request({
    url: '/system/evaluation',
    method: 'post',
    data: data
  })
}

// 修改部门考核管理
export function updateEvaluation(data) {
  return request({
    url: '/system/evaluation',
    method: 'put',
    data: data
  })
}

// 删除部门考核管理
export function delEvaluation(evaluationId) {
  return request({
    url: '/system/evaluation/' + evaluationId,
    method: 'delete'
  })
}

// 导出考核详细信息
export function exportEvaluation(query) {
  return request({
    url: '/system/evaluation/export',
    method: 'get',
    params: query
  })
}
// 导出部门考核管理
export function exportEvaluationSimple(query) {
  return request({
    url: '/system/evaluation/exportSimple',
    method: 'get',
    params: query
  })
}
export function userlist(query) {
  return request({
    url:'/system/evaluation/userlist',
    method:'get',
    params: query
  })
}
