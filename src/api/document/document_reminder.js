// export const documentReminder = [{
//   id: 1,
//   status: 0,
//   blrq: '20200320',
//   wtsbh: 'ZIHEB200129LHX16',
//   tsshtgsj: '2020/03/20 11:06:01',
//   dzmc: '报关单据',
//   dzlltgsj: '2020/03/20 11:02:06',
//   jdndztgsj: '0',
//   xxfszt: '发送失败',
//   dzsjtgsj: '2020/03/20 11:16:11'
// }, {
//   id: 2,
//   status: 1,
//   blrq: '20200126',
//   wtsbh: 'ZIHWB202029LHX16',
//   tsshtgsj: '2020/01/15 11:06:01',
//   dzmc: '报关单据',
//   dzlltgsj: '2020/01/26 11:16:06',
//   jdndztgsj: '1',
//   xxfszt: '发送成功',
//   dzsjtgsj: '2020/03/29 10:26:11'
// }]
import request from '@/utils/request'
// 查询提醒设置列表
export function listRemind(query) {
  return request({
    url: '/document/remind/list',
    method: 'get',
    params: query
  })
}
// 获取一级单证分类
export function getParentTypeList() {
  return request({
    url: '/document/type/getParentTypeList',
    method: 'get'
  })
}

// 获取二级单证分类
export function getSonTypeList(stage) {
  return request({
    url: '/document/type/getSonTypeList/' + stage,
    method: 'get'
  })
}
// 根据舱位号验证是否存在订单
export function getOrderByNumber(orderNumber) {
  return request({
    url: '/document/type/getOrderByNumber/' + orderNumber,
    method: 'get'
  })
}
// 根据单证类型和班列时间获取单证提醒时间
export function getRemindTime(data) {
  return request({
    url: '/document/type/getRemindTime',
    method: 'get',
    params: data
  })
}
// 新增节点维护
export function addRemind(data) {
  return request({
    url: '/document/remind',
    method: 'post',
    data: data
  })
}
