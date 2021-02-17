import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/zhonghao";



// 修改开票信息
export function updateInvoice(data) {
  return request({
    url: '/system/user/updateInvoice',
    method: 'put',
    data: data
  })
}

// 修改开票信息
export function getInvoiceInfo(data) {
  return request({
    url: '/system/user/getInvoiceInfo',
    method: 'get',
    data: data
  })
}





