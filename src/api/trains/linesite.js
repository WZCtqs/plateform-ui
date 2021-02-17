import request from '@/utils/request'

// 查询线路列表
export function listLinesite (query) {
  return request({
    url: '/trains/linesite/list',
    method: 'get',
    params: query
  })
}

// 查询线路详细
export function getLinesite (id) {
  return request({
    url: '/trains/linesite/getInfo/?id=' + id,
    method: 'get'
  })
}

// 新增线路
export function addLinesite (data) {
  return request({
    url: '/trains/linesite/lineAdd',
    method: 'post',
    data: data
  })
}

// 修改线路
export function updateLinesite (data) {
  return request({
    url: '/trains/linesite/lineEdit',
    method: 'put',
    data: data
  })
}

// 删除线路
export function delLinesite (id) {
  return request({
    url: '/trains/linesite/lineDel/?id=' + id,
    method: 'get'
  })
}

// 导出线路
export function exportLinesite (query) {
  return request({
    url: '/trains/linesite/export',
    method: 'get',
    params: query
  })
}

// 查询线路类别下站点
export function lineTypeid (query) {
  return request({
    url: '/trains/site/listByPort',
    method: 'get',
    params: query
  })
}

// 列表修改状态
export function changeStatus (query) {
  return request({
    url: '/trains/linesite/changeStatus',
    method: 'get',
    params: query
  })
}