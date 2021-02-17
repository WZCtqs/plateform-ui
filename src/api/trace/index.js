import request from '@/utils/request'
// 运踪列表
export function traceList (query) {
  return request({
    url: '/track/oneLevel/trackList',
    method: 'get',
    params: query
  })
}

// 详情第一个接口
export function getTrainDetail (id) {
  return request({
    url: '/track/oneLevel/getAddress/?orderId=' + id,
    method: 'get'
  })
}

// 第二个接口
export function getOneNode (id, shuju) {
  return request({
    url: '/track/oneLevel/details/?orderId=' + id + '&boxNum=' + shuju,
    method: 'get'
  })
}

// 第三个接口
export function getTwoNode (id,boxNum) {
  return request({
    url: '/track/twoLevel/detailByOrderId/?orderId=' + id+'&boxNum='+boxNum,
    method: 'get'
  })
}

// 第二个接口详情
export function detailByOneId (id,boxNum) {
  return request({
    url: '/track/twoLevel/detailByOneId/?oneId=' + id+'&boxNum='+boxNum,
    method: 'get'
  })
}

// 第四个接口
export function oneLtraceList (query) {
  return request({
    url: '/track/oneLevel/trainList',
    method: 'get',
    params: query
  })
}

// 发送记录接口
export function emailsRecord (query) {
  return request({
    url: '/track/oneLevel/emailsRecord',
    method: 'get',
    params: query
  })
}
