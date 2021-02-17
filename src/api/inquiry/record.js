import request from '@/utils/request'

// 查询询价结果费用修改记录列表
export function listRecord(query) {
  return request({
    url: '/inquiry/record/list',
    method: 'get',
    params: query
  })
}

// 查询询价结果费用修改记录详细
export function getRecord(id) {
  return request({
    url: '/inquiry/record/' + id,
    method: 'get'
  })
}

// 新增询价结果费用修改记录
export function addRecord(data) {
  return request({
    url: '/inquiry/record',
    method: 'post',
    data: data
  })
}

// 修改询价结果费用修改记录
export function updateRecord(data) {
  return request({
    url: '/inquiry/record',
    method: 'put',
    data: data
  })
}

// 删除询价结果费用修改记录
export function delRecord(id) {
  return request({
    url: '/inquiry/record/' + id,
    method: 'delete'
  })
}

// 导出询价结果费用修改记录
export function exportRecord(query) {
  return request({
    url: '/inquiry/record/export',
    method: 'get',
    params: query
  })
}