import request from '@/utils/request'
export function findBrand(data) {
  return request({
    url: 'api/brand/findBrand',
    method: 'post',
    data
  })
}
