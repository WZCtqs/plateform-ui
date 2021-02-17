import request from '@/utils/request'

// 查询班列模板列表
export function listTemplate (query) {
  return request({
    url: '/trains/template/temlist',
    method: 'get',
    params: query
  })
}

// 查询班列模板详细
export function getTemplate (classTId) {
  return request({
    url: '/trains/template/getInfo/' + classTId,
    method: 'get'
  })
}

// 新增班列模板
export function addTemplate (data) {
  return request({
    url: '/trains/template/temAdd',
    method: 'post',
    data: data
  })
}

// 修改班列模板
export function updateTemplate (data) {
  return request({
    url: '/trains/template/temEdit',
    method: 'put',
    data: data
  })
}

// 删除班列模板
export function delTemplate (classTId) {
  return request({
    url: '/trains/template/temDel/' + classTId,
    method: 'delete'
  })
}

// 导出班列模板
export function exportTemplate (query) {
  return request({
    url: '/trains/template/export',
    method: 'get',
    params: query
  })
}