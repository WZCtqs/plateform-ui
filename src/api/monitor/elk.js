import request from '@/utils/request'

// 查询服务器详细
export function getELKServer() {
  return request({
    url: '/monitor/elkserver',
    method: 'get'
  })
}
