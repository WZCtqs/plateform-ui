import request from '@/utils/request'

// 获取路由
export const getRouters = (obj) => {
  return request({
    url: '/getRouters',
    method: 'get',
    params:obj
  })
}
