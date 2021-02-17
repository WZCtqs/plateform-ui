import request from '@/utils/request'

// 查询班列号列表
export function listNumber(query) {
  return request({
    url: '/trains/Number/list',
    method: 'get',
    params: query
  })
}

// 查询班列号详细
export function getNumber(classTId) {
  return request({
    url: '/trains/Number/getInfo/?classTId=' + classTId,
    method: 'get'
  })
}

// 新增班列号
export function addNumber(data) {
  return request({
    url: '/trains/Number/numberAdd',
    method: 'post',
    data: data
  })
}

// 修改班列号
export function updateNumber(data) {
  return request({
    url: '/trains/Number/numberEdit',
    method: 'put',
    data: data
  })
}

// 删除班列号
export function delNumber(classTIds) {
  return request({
    url: '/trains/Number/numberDel/?classTIds=' + classTIds,
    method: 'get'
  })
}

// 导出班列号
export function exportNumber(query) {
  return request({
    url: '/trains/Number/export',
    method: 'get',
    params: query
  })
}