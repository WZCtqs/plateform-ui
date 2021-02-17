import request from '@/utils/request'

// 订舱组界面列表
export function fetchList(obj) {
  return request({
    url: '/order/orderGoodsStatus/trackDczList',
    method: 'get',
    params:obj
  })
}

// 订舱组箱量统计接口
// export function boxAmount(obj) {
//   return request({
//     url: '/order/orderGoodsStatus/boxAmountTotalDcz',
//     method: 'get',
//     params:obj
//   })
// }

// 进展跟踪记录删除
export function delApi(obj) {
  return request({
    url: '/order/orderGoodsStatus/' + obj,
    method: 'delete'
  })
}

// 跟踪记录详情
export function detailApi(obj) {
  return request({
    url: '/order/orderGoodsStatus/getInfo',
    method: 'get',
    params:obj
  })
}
// 班列号修改记录
export function classBhEecord(obj) {
  return request({
    url: '/order/orderGoodsStatus/classBhEecord?id='+obj,
    method: 'get'
  })
}
// 发运时间编辑
export function editApi(obj) {
  return request({
    url: '/order/orderGoodsStatus/runTimeAdd',
    method: 'put',
    data:obj
  })
}

// 班列号
export function classBhAdd(obj) {
  return request({
    url: '/order/orderGoodsStatus/classBhAdd',
    method: 'put',
    data:obj
  })
}

// 箱量统计
export function boxAmountTotalApi(obj) {
  return request({
    url: '/order/orderGoodsStatus/boxAmountTotalDcz',
    method: 'get',
    params:obj
  })
}

// 申请代码编辑
export function applyCodeApi(obj) {
  return request({
    url: '/order/orderGoodsStatus/applyCode',
    method: 'put',
    data:obj
  })
}

// 下载模板
export function downLoadExcel() {
  return request({
    url: '/order/orderGoodsStatus/download',
    method: 'get',
    responseType: 'blob', //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }

  })
}



// 导出列表
export function exportTrack(data) {
  return request({
    url: '/order/orderGoodsStatus/exportTrackZo',
    method: 'get',
    params:data
  })
}


// 导出多联列表
// export function exportTrackDl(data) {
//   return request({
//     url: '/order/orderGoodsStatus/exportTrackDl',
//     method: 'get',
//     params:data
//   })
// }

// 发运时间导入
export function importTrackTime(obj) {
  return request({
    url: '/order/orderGoodsStatus/importTrackTime',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'multipartfile'
    }
  })
}

// 舱位号修改
export function orderBlEdit(obj) {
  return request({
    url: '/order/orderGoodsStatus/orderBlEdit',
    method: 'put',
    data:obj
  })
}

// 删除
export function deleteApi(obj) {
  return request({
    url: '/order/orderGoodsStatus/deleteTrack',
    method: 'put',
    data:obj
  })
}







