import request from '@/utils/request'

// 查询场站地址列表
export function listStation(query) {
  return request({
    url: '/document/station/list',
    method: 'get',
    params: query
  })
}

//查询新增变价上货站下拉框信息
export function siteList() {
  return request({
    url: '/document/station/sitelist',
    method: 'get',
  })
}
// 查询场站地址详细
export function getStation(stationId) {
  return request({
    url: '/document/station/' + stationId,
    method: 'get'
  })
}

// 新增场站地址
export function addStation(data) {
  return request({
    url: '/document/station',
    method: 'post',
    data: data
  })
}

// 修改场站地址
export function updateStation(data) {
  return request({
    url: '/document/station',
    method: 'put',
    data: data
  })
}

// 删除场站地址
export function delStation(stationId) {
  return request({
    url: '/document/station/' + stationId,
    method: 'delete'
  })
}

// 导出场站地址
export function exportStation(query) {
  return request({
    url: '/document/station/export',
    method: 'get',
    params: query
  })
}
export function changeStationEnable(stationId,isenabled) {
  return request({
    url: '/document/station/changeStationEnable',
    method: 'put',
    data: {
      stationId,isenabled
    }
  })
}
