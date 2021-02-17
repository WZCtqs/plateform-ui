import request from '@/utils/request'

// 查询运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址列表
export function listGoStation(query) {
  return request({
    url: '/track/goStation/list',
    method: 'get',
    params: query
  })
}

// 查询运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址详细
export function getGoStation(id) {
  return request({
    url: '/track/goStation/' + id,
    method: 'get'
  })
}

// 新增运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址
export function addGoStation(data) {
  return request({
    url: '/track/goStation',
    method: 'post',
    data: data
  })
}

// 修改运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址
export function updateGoStation(data) {
  return request({
    url: '/track/goStation',
    method: 'put',
    data: data
  })
}

// 删除运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址
export function delGoStation(id) {
  return request({
    url: '/track/goStation/' + id,
    method: 'delete'
  })
}

// 导出运踪_去程整柜场站地址--去程整柜客户查看,编辑车站地址
export function exportGoStation(query) {
  return request({
    url: '/track/goStation/export',
    method: 'get',
    params: query
  })
}

//导入
export function importObj(obj) {
  return request({
    url: '/track/goStation/import',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}
