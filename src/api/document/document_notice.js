import request from '@/utils/request'

// 查询入货通知书列表
export function listDocumentNotice(query) {
  return request({
    url: '/document/notice/list',
    method: 'get',
    params: query
  })
}

export function createPDFAgain(query) {
  return request({
    url: '/document/notice/createPDFAgain',
    method: 'get',
    params: query
  })
}


