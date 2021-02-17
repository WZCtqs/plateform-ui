import request from '@/utils/request'

// 查询售后查询列表
export function listAfterSaleQuery(query) {
  return request({
    url: '/customerservice/shippingorder/getInfoMsg',
    method: 'get',
    params: query
  })
}

// 根据orderid查询箱号列表,params用对象接收参数,或页面使用(row.orderId),服务(orderId接收参数)
export function listContainer(query) {
  return request({
    url: '/customerservice/status/boxNums',
    method: 'get',
    params: query
  })
}

// 根据orderid查询照片列表
export function listImg(query) {
  return request({
    url: '/customerservice/document/urlList',
    method: 'get',
    params: query
  })
}

// 新增售后信息
export function addCustomerService(orderNumber) {
  return request({
    url: '/customerservice/message/addCustomerService',
    method: 'get',
    params:{orderNumber}
  })
}

