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
// 中亚境外
export function getAbroad (query) {
  return request({
    url: '/track/abroad/list',
    method: 'get',
    params: query
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

// 中亚境外信息详情
export function abquery (id) {
  return request({
    url: '/track/abroad/' + id,
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

// 中亚境外修改
export function updateAbroad (data) {
  return request({
    url: '/track/abroad',
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

// 下载
export function download () {
  return request({
    url: '/track/abroad/download',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
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

// 查询 班列日期
export function findClassDate (id) {
  return request({
    url: '/customerservice/status/findClassDate?actualClassId=' + id,
    method: 'get'
  })
}
