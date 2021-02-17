import request from '@/utils/request'

// 查询运踪_班列运行时间统计列表
export function listCensus (query) {
  return request({
    url: '/track/census/list',
    method: 'get',
    params: query
  })
}

// 查询运踪_班列运行时间统计详细
export function getSite (query) {
  return request({
    url: '/track/census/details',
    method: 'get',
    params: query
  })
}

// 新增运踪_班列运行时间统计
export function addSite (data) {
  return request({
    url: '/track/census',
    method: 'post',
    data: data
  })
}

// 修改运踪_班列运行时间统计
export function updateSite (data) {
  return request({
    url: '/track/census',
    method: 'put',
    data: data
  })
}

// 删除运踪_班列运行时间统计
export function delCensus (id) {
  return request({
    url: '/track/census/' + id,
    method: 'delete'
  })
}

// 导出
export function exportCensus (query) {
  return request({
    url: '/track/census/export',
    method: 'get',
    params: query
  })
}

//运行分析
export function exportCensusT (query) {
  return request({
    url: '/track/census/exportCensus',
    method: 'get',
    params: query
  })
}