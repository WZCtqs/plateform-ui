import request from '@/utils/request'

// 查询运踪_菜鸟号站点维护--增删改查维护地名/时区列表
export function listRookieSite (query) {
  return request({
    url: '/track/rookie/list',
    method: 'get',
    params: query
  })
}

// 详情
export function getRookieSite (id) {
  return request({
    url: '/track/rookie/' + id,
    method: 'get'
  })
}

// 新增
export function addRookieSite (data) {
  return request({
    url: '/track/rookie/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateRookieSite (data) {
  return request({
    url: '/track/rookie',
    method: 'put',
    data: data
  })
}

// 删除
export function delRookieSite (id) {
  return request({
    url: '/track/rookie/' + id,
    method: 'delete'
  })
}

// 导出运踪_菜鸟号站点维护--增删改查维护地名/时区
export function exportRookieSite (query) {
  return request({
    url: '/track/rookieSite/export',
    method: 'get',
    params: query
  })
}