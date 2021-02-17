import request from '@/utils/request'

// 查询售后文件列表
export function listServiceFile(query) {
  return request({
    url: '/customerservice/serviceFile/list',
    method: 'get',
    params: query
  })
}

// 查询售后文件详细
export function getServiceFile(id) {
  return request({
    url: '/customerservice/serviceFile/' + id,
    method: 'get'
  })
}

// 新增售后文件
export function addServiceFile(data) {
  return request({
    url: '/customerservice/serviceFile',
    method: 'post',
    data: data
  })
}

// 修改售后文件
export function updateServiceFile(data) {
  return request({
    url: '/customerservice/serviceFile',
    method: 'put',
    data: data
  })
}

// 删除售后文件
export function delServiceFile(id) {
  return request({
    url: '/customerservice/serviceFile/' + id,
    method: 'delete'
  })
}

// 导出售后文件
export function exportServiceFile(query) {
  return request({
    url: '/customerservice/serviceFile/export',
    method: 'get',
    params: query
  })
}