import request from '@/utils/request'

// 查询危险品列表
export function listGoods(query) {
  return request({
    url: '/basic/goods/goodsList',
    method: 'get',
    params: query
  })
}

// 查询危险品详细
export function getGoods(goodsId) {
  return request({
    url: '/basic/goods/getInfo/?goodsId=' + goodsId,
    method: 'get'
  })
}

// 新增危险品
export function addGoods(data) {
  return request({
    url: '/basic/goods/goodsAdd',
    method: 'post',
    data: data
  })
}

// 修改危险品
export function updateGoods(data) {
  return request({
    url: '/basic/goods/goodsEdit',
    method: 'put',
    data: data
  })
}

// 删除危险品
export function delGoods(goodsIds) {
  return request({
    url: '/basic/goods/goodsDel/?goodsIds=' + goodsIds,
    method: 'get'
  })
}

// 导出危险品
export function exportGoods(query) {
  return request({
    url: '/basic/goods/export',
    method: 'get',
    params: query
  })
}