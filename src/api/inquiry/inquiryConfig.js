import request from '@/utils/request'

// 查询询价系统设置列表
export function listInquiryConfig(query) {
  return request({
    url: '/inquiryConfig/list',
    method: 'get',
    params: query
  })
}

export function getInquiryConfig() {
  return request({
    url: '/inquiryConfig/getNextMonthInquiryConfig',
    method: 'get'
  })
}

// 查询询价系统设置详细
// export function getInquiryConfig(id) {
//   return request({
//     url: '/inquiryConfig/' + id,
//     method: 'get'
//   })
// }

// 新增询价系统设置
export function addInquiryConfig(data) {
  return request({
    url: '/inquiryConfig',
    method: 'post',
    data: data
  })
}

// 修改询价系统设置
export function updateInquiryConfig(data) {
  return request({
    url: '/inquiryConfig',
    method: 'put',
    data: data
  })
}

// 删除询价系统设置
export function delInquiryConfig(id) {
  return request({
    url: '/inquiryConfig/' + id,
    method: 'delete'
  })
}

// 导出询价系统设置
export function exportInquiryConfig(query) {
  return request({
    url: '/inquiryConfig/export',
    method: 'get',
    params: query
  })
}
