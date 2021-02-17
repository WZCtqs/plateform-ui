import request from '@/utils/request'

// 查询邮件配置列表
export function listEmailSet(query) {
  return request({
    url: '/system/emailSet/list',
    method: 'get',
    params: query
  })
}

// 查询邮件配置详细
export function getEmailSet(id) {
  return request({
    url: '/system/emailSet/' + id,
    method: 'get'
  })
}

// 新增邮件配置
export function addEmailSet(data) {
  return request({
    url: '/system/emailSet',
    method: 'post',
    data: data
  })
}

// 发送测试邮件
export function sendEmailSet(params) {
  return request({
    url: '/system/emailSet/sendTest',
    method: 'post',
    params: params
  })
}

// 修改邮件配置
export function updateEmailSet(data) {
  return request({
    url: '/system/emailSet',
    method: 'put',
    data: data
  })
}

// 删除邮件配置
export function delEmailSet(id) {
  return request({
    url: '/system/emailSet/' + id,
    method: 'delete'
  })
}

// 导出邮件配置
export function exportEmailSet(query) {
  return request({
    url: '/system/emailSet/export',
    method: 'get',
    params: query
  })
}