import request from '@/utils/request'

// 查询订单商品列表
export function listOrderGoods(query) {
  return request({
    url: '/track/goodsStatus/goodsList',
    method: 'get',
    params: query
  })
}

// 查询订单商品详细
export function getOrderGoods(goodsId) {
  return request({
    url: '/track/orderGoods/' + goodsId,
    method: 'get'
  })
}

// 新增订单商品
export function addOrderGoods(data) {
  return request({
    url: '/track/orderGoods',
    method: 'post',
    data: data
  })
}

// 修改订单商品
export function updateOrderGoods(data) {
  return request({
    url: '/track/orderGoods',
    method: 'put',
    data: data
  })
}

// 删除订单商品
export function delOrderGoods(goodsId) {
  return request({
    url: '/track/orderGoods/' + goodsId,
    method: 'delete'
  })
}

// 导出订单商品
export function exportOrderGoods(query) {
  return request({
    url: '/track/orderGoods/export',
    method: 'get',
    params: query
  })
}