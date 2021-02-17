import request from '@/utils/request'

// 查询提还箱地和费用规则列表
export function listBoxfee(query) {
  return request({
    url: '/basic/boxfee/boxfeeList',
    method: 'get',
    params: query
  })
}

// 查询提还箱地和费用规则详细
export function getBoxfee(boxId) {
  return request({
    url: '/basic/boxfee/getInfo/?boxId=' + boxId,
    method: 'get'
  })
}

// 新增提还箱地和费用规则
export function addBoxfee(data) {
  return request({
    url: '/basic/boxfee/boxfeeAdd',
    method: 'post',
    data: data
  })
}

// 修改提还箱地和费用规则
export function updateBoxfee(data) {
  return request({
    url: '/basic/boxfee/boxfeeEdit',
    method: 'put',
    data: data
  })
}

// 删除提还箱地和费用规则
export function delBoxfee(boxIds) {
  return request({
    url: '/basic/boxfee/boxfeeDel/?boxIds=' + boxIds,
    method: 'get'
  })
}
// 查询箱型
export function listBoxtype() {
  return request({
    url: '/basic/boxfee/boxType',
    method: 'get'
  })
}
// 普通箱提还箱平衡费导入
export function boxfeeExportP(obj) {
  return request({
    url: '/basic/boxfee/boxfeeExportP',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'MultipartFile'
    }
  })
}
// 特种箱提还箱平衡费导入
export function boxfeeExportT(obj) {
  return request({
    url: '/basic/boxfee/boxfeeExportT',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'MultipartFile'
    }
  })
}
// 普通箱提还箱平衡费模板下载
export function downloadptExcel() {
  return request({
    url: '/basic/boxfee/downloadPT',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })
}
// 特种箱提还箱平衡费模板下载
export function downloadthExcel() {
  return request({
    url: '/basic/boxfee/downloadTH',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })
}