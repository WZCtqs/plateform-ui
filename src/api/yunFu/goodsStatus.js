import request from '@/utils/request'

// 查询运踪_货物状态--以舱位号为单位，标记是否发车列表
export function listGoodsStatus (query) {
  return request({
    url: '/track/goodsStatus/list',
    method: 'get',
    params: query
  })
}

// 查询
export function getGoodsStatus (id) {
  return request({
    url: '/track/goodsStatus/' + id,
    method: 'get'
  })
}

// 新增运踪_货物状态--以舱位号为单位，标记是否发车
export function addGoodsStatus (data) {
  return request({
    url: '/track/goodsStatus',
    method: 'post',
    data: data
  })
}

// 修改
export function updateGoodsStatus (data) {
  return request({
    url: '/track/goodsStatus',
    method: 'put',
    data: data
  })
}

// 拼箱修改
export function updatePxGoodsStatus (data) {
  return request({
    url: '/track/goodsStatus/update',
    method: 'put',
    data: data
  })
}

// 删除
export function delGoodsStatus (id) {
  return request({
    url: '/track/goodsStatus/' + id,
    method: 'delete'
  })
}

// 导出
export function exportGoodsStatus (query) {
  return request({
    url: '/track/goodsStatus/export',
    method: 'get',
    params: query
  })
}

// 导入
export function importGoodsStatus(obj) {
  return request({
    url: '/track/goodsStatus/import',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'MultipartFile'
    }
  })
}