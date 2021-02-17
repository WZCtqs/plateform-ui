import request from '@/utils/request'

// 查询运踪图标列表
export function listIcon(query) {
  return request({
    url: '/track/icon/list',
    method: 'get',
    params: query
  })
}

// 查询运踪图标详细
export function getIcon(id) {
  return request({
    url: '/track/icon/' + id,
    method: 'get'
  })
}

// 新增运踪图标
export function addIcon(data) {
  return request({
    url: '/track/icon',
    method: 'post',
    data: data
  })
}

// 修改运踪图标
export function updateIcon(data) {
  return request({
    url: '/track/icon',
    method: 'put',
    data: data
  })
}

// 删除运踪图标
export function delIcon(id) {
  return request({
    url: '/track/icon/' + id,
    method: 'delete'
  })
}

// 导出运踪图标
export function exportIcon(query) {
  return request({
    url: '/track/icon/export',
    method: 'get',
    params: query
  })
}