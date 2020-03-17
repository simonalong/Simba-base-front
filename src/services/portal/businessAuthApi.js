import request from '@/utils/request';
import {getUserInfo} from "@/utils/userInfo";

// eslint-disable-next-line no-useless-concat
const path = '/portal/business/auth';

export async function add(params) {
  console.log('businessAuthApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function addAuth(params) {
  console.log('businessAuthApi.addAuth 发送的参数');
  console.log(JSON.stringify(params));
  const userInfo = getUserInfo();
  let paramsFinal={
    ...params,
    // 授权者
    createUserName: userInfo.displayName,
    // 当前中间件名
    middlewareName: localStorage.getItem('appName'),
  };

  // 如果用户没有设置被授权者，则认为自己就是被授权者
  if(paramsFinal.beAuthUserName == null){
    paramsFinal={
      ...paramsFinal,
      beAuthUserName: userInfo.displayName,
    }
  }

  console.log('businessAuthApi.addAuth2 发送的参数');
  console.log(JSON.stringify(paramsFinal));

  return request(`${path}/addAuth`, {
    method: 'POST',
    body: {
      ...paramsFinal,
    },
  });
}

export async function deleteData(params) {
  console.log('businessAuthApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('businessAuthApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('businessAuthApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('businessAuthApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





