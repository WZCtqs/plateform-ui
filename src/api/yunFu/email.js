import request from '@/utils/request'

// 查询城市站点列表
export function listSite (query) {
  return request({
    url: '/track/goStation/mailList',
    method: 'get',
    params: query
  })
}

// 查询城市站点详细
export function getSite (id) {
  return request({
    url: '/trains/site/getInfo/?id=' + id,
    method: 'get'
  })
}

// 新增城市站点
export function addSite (data) {
  return request({
    url: '/trains/site',
    method: 'post',
    data: data
  })
}

// 修改城市站点
export function updateSite (data) {
  return request({
    url: '/track/goStation/editMail',
    method: 'put',
    data: data
  })
}

// 删除城市站点
export function delSite (id) {
  return request({
    url: '/trains/site/' + id,
    method: 'delete'
  })
}

// 导出城市站点
export function exportSite (query) {
  return request({
    url: '/trains/site/export',
    method: 'get',
    params: query
  })
}