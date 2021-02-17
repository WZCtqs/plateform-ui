import request from '@/utils/request'

// 查询班列列表
export function listClasses(query) {
  return request({
    url: '/trains/classes/classesList',
    method: 'get',
    params: query
  })
}

// 查询班列详细
export function getClasses(classId) {
  return request({
    url: '/trains/classes/getInfo/?classId=' + classId,
    method: 'get'
  })
}

// 新增班列
export function addClasses(data) {
  return request({
    url: '/trains/classes/classesAdd',
    method: 'post',
    data: data
  })
}

// 修改班列
export function updateClasses(data) {
  return request({
    url: '/trains/classes/classesEdit',
    method: 'put',
    data: data
  })
}

// 删除班列
export function delClasses(classIds) {
  return request({
    url: '/trains/classes/classIds/?classIds=' + classIds,
    method: 'get'
  })
}
// 导出班列
export function exportClasses(query) {
  return request({
    url: '/trains/classes/export',
    method: 'get',
    params: query
  })
}
// 拼箱状态是否可修改
export function statesModif(classId, pxentryState) {
  return request({
    url: '/trains/classes/changeStatus/?classId=' + classId + '&pxentryState=' + pxentryState,
    method: 'put',
  })
}
// 查询班列管理查询线路下站点
export function lineTypeid(id) {
  return request({
    url: '/trains/site/listByLine/?id=' + id,
    method: 'get',
  })
}
// 班列管理新增编辑校对班列编号
export function squadNumber(classBh) {
  return request({
    url: '/trains/classes/isClasses/?classBh=' + classBh,
    method: 'get',
  })
}
