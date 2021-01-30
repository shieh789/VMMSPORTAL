import request from '@/utils/request'
import qs from 'qs'
export function addParts(data) {
  return request({
    url: 'api/parts/addParts',
    method: 'post',
    data
  })
}

export function findParts(page,size,params) {
  let queryString =  qs.stringify(params);
  return request({
    url: 'api/parts/list/'+page+'/'+size+'?'+queryString,
    method: 'get'
  })
}
