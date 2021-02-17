import request from '@/utils/request'

// 查询特殊单证物品列表
export function listGoodsnote(query) {
  return request({
    url: '/basic/goodsnote/noteList',
    method: 'get',
    params: query
  })
}

// 查询特殊单证物品详细
export function getGoodsnote(id) {
  return request({
    url: '/basic/goodsnote/getInfo/?id=' + id,
    method: 'get'
  })
}

// 新增特殊单证物品
export function addGoodsnote(data) {
  return request({
    url: '/basic/goodsnote/noteAdd',
    method: 'post',
    data: data
  })
}

// 修改特殊单证物品
export function updateGoodsnote(data) {
  return request({
    url: '/basic/goodsnote/noteEdit',
    method: 'put',
    data: data
  })
}

// 删除特殊单证物品
export function delGoodsnote(ids) {
  return request({
    url: '/basic/goodsnote/noteDel/?ids=' + ids,
    method: 'get'
  })
}

// 导出特殊单证物品
export function exportGoodsnote(query) {
  return request({
    url: '/basic/goodsnote/export',
    method: 'get',
    params: query
  })
}