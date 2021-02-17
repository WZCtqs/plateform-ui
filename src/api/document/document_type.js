import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listType(query) {
  return request({
    url: '/document/type/list',
    method: 'get',
    params: query
  })
}

// 查询 新增时获取没有父级类型的单证类型信息
export function getNoParentDocType() {
  return request({
    url: '/document/type/getNoParentDocType',
    method: 'get',
  })
}

// 查询【请填写功能名称】详细
export function getType(id) {
  return request({
    url: '/document/type/' + id,
    method: 'get'
  })
}

//更新一级时父级分类时查询子单证及未分配单证
export function getENoParentDocType(fileOrderStage) {
  return request({
    url: '/document/type/getNoParentDocType/' + fileOrderStage,
    method: 'get'
  })
}

//单证类型管理二级编辑时查询一级集合
export function getParentList() {
  return request({
    url: '/document/type/getparentlist',
    method: 'get',
  })
}

// 新增【请填写功能名称】
export function addType(data) {
  return request({
    url: '/document/type/stage',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateType(data) {
  return request({
    url: '/document/type',
    method: 'put',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateTypeStage(data) {
  return request({
    url: '/document/type/stage',
    method: 'put',
    data: data
  })
}

//修改二级单证类型管理 
export function updateSecTypeStage(data) {
  return request({
    url: '/document/type',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delType(id) {
  return request({
    url: '/document/type/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportType(query) {
  return request({
    url: '/document/type/export',
    method: 'get',
    params: query
  })
}
