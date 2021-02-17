import request from '@/utils/request'

// 外部列表
export function listClasses (query) {
  return request({
    url: '/track/train/trainsList',
    method: 'get',
    params: query
  })
}

// 跟踪信息
export function getClasses (query) {
  return request({
    url: '/track/train/list',
    method: 'get',
    params: query
  })
}
//运踪信息匹配英文
export function getAdressEn(name) {
  return request({
    url: '/track/address/getAdress?name=' + name,
    method: 'get'
  })
}

//对应英文添加位置地名信息
export function addTrainEn (query) {
  return request({
    url: '/track/address',
    method: 'post',
    data: query
  })
}
// 新增跟踪信息
export function addTrain (query) {
  return request({
    url: '/track/train',
    method: 'post',
    data: query
  })
}

// 编辑时候查看跟踪信息详情
export function getTrain (id) {
  return request({
    url: '/track/train/' + id,
    method: 'get'
  })
}

// 修改
export function updateTrain (data) {
  return request({
    url: '/track/train',
    method: 'put',
    data: data
  })
}

// 删除
export function delTrain (ids) {
  return request({
    url: '/track/train/' + ids,
    method: 'delete'
  })
}

// 发送全部
export function addAndSend (query) {
  return request({
    url: '/track/train/addAndSend',
    method: 'post',
    data: query
  })
}

// 发送VIP
export function editAndSend (query) {
  return request({
    url: '/track/train/editAndSend',
    method: 'post',
    data: query
  })
}

// 查询班 列日期
export function findClassDate (id) {
  return request({
    url: '/customerservice/status/findClassDate?actualClassId=' + id,
    method: 'get'
  })
}