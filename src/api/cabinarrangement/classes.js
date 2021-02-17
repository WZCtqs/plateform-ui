import request from '@/utils/request'

// 查询排舱管理列表
export function listClasses(query) {
  return request({
    url: '/cabinarrangement/classes/list',
    method: 'get',
    params: query
  })
}

// 查看排舱管理详细上边
export function getClasses(classId) {
  return request({
    url: '/cabinarrangement/classes/' + classId,
    method: 'get'
  })
}
// 查看排舱管理详细下面
export function getDatas(classId) {
  return request({
    url: '/cabinarrangement/classes/smallBox/?classId=' + classId,
    method: 'get'
  })
}
// 新增排舱管理
export function addClasses(data) {
  return request({
    url: '/cabinarrangement/classes',
    method: 'post',
    data: data
  })
}

// 修改排舱管理
export function updateClasses(data) {
  return request({
    url: '/cabinarrangement/classes',
    method: 'put',
    data: data
  })
}

// 删除排舱管理
export function delClasses(classId) {
  return request({
    url: '/cabinarrangement/classes/' + classId,
    method: 'delete'
  })
}
// 导出排舱管理
export function exportClasses(query) {
  return request({
    url: '/cabinarrangement/classes/export',
    method: 'get',
    params: query
  })
}