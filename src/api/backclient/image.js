import request from '@/utils/request'

// 查询轮播图列表
export function listImage(query) {
  return request({
    url: '/backclient/image/list',
    method: 'get',
    params: query
  })
}

// 查询轮播图详细
export function getImage(id) {
  return request({
    url: '/backclient/image/' + id,
    method: 'get'
  })
}

// 新增轮播图
export function addImage(data) {
  return request({
    url: '/backclient/image',
    method: 'post',
    data: data
  })
}

// 修改轮播图
export function updateImage(data) {
  return request({
    url: '/backclient/image',
    method: 'put',
    data: data
  })
}

// 删除轮播图
export function delImage(id) {
  return request({
    url: '/backclient/image/' + id,
    method: 'delete'
  })
}

// 导出轮播图
export function exportImage(query) {
  return request({
    url: '/backclient/image/export',
    method: 'get',
    params: query
  })
}