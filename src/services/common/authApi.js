import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/robot/auth';

export async function getAuthOfUser() {
  return request(`${path}/getAuthOfUser`);
}


export async function toTest() {
  return request(`${path}/listAll`);
}






