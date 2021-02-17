import request from '@/utils/request'

// 查询问题反馈列表
export function listFeedback(query) {
  return request({
    url: '/customerservice/feedback/list',
    method: 'get',
    params: query
  })
}

//导入
export function importObj(obj) {
  return request({
    url: '/customerservice/file/insertfile',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}

// 根据type查询0投诉文件1回复文件2补传资料,params用对象接收参数,或页面使用(row.orderId),服务(orderId接收参数)
export function listComplaintInfo(query) {
  return request({
    url: '/customerservice/file/list',
    method: 'get',
    params: query
  })
}

// 查询问题反馈详细
export function getFeedback(problemId) {
  return request({
    url: '/customerservice/feedback/' + problemId,
    method: 'get'
  })
}

// 新增问题反馈
export function addFeedback(data) {
  return request({
    url: '/customerservice/feedback',
    method: 'post',
    data: data
  })
}

// 修改问题反馈
export function updateFeedback(data) {
  return request({
    url: '/customerservice/feedback',
    method: 'put',
    data: data
  })
}

// 删除问题反馈
export function delFeedback(problemId) {
  return request({
    url: '/customerservice/feedback/' + problemId,
    method: 'delete'
  })
}

// 导出问题反馈
export function exportFeedback(query) {
  return request({
    url: '/customerservice/feedback/export',
    method: 'get',
    params: query
  })
}