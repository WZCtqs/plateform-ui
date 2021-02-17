import request from "@/utils/request";

// 中亚运单界面列表
export function zyList(obj) {
  return request({
    url: "/order/zyInfo/boxListPf",
    method: "get",
    params: obj
  });
}

//运单状态导出
export function exportZyInfo(costId) {
  return request({
    url: "/order/zyInfo/exportZyInfo",
    method: "get",
    params: { costId },
    responseType: "blob"
  });
}
