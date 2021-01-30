import request from '@/utils/request'
import qs from 'qs'
export function addCar(data) {
    return request({
      url: 'api/car/addCar',
      method: 'post',
      data
    })
}

export function findCar(page,size,params) {
  let queryString =  qs.stringify(params);
  return request({
    url: 'api/car/list/'+page+'/'+size+'?'+queryString,
    method: 'get'
  })
}
