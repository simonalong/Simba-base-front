import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/barrier' + '/' + 'application';
const path1 = '/barrier' + '/' + 'group';

export async function add(params) {
  console.log('applicationApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('applicationApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('applicationApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('applicationApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function searchOc(params) {
  return request(`${path}/searchApp?name=` + params);
}

export async function getAppDetail(params) {
  return request(`${path}/detail?serverName=` + params);
}

export async function addTag(params) {
  return request(`${path}/addTag`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeTag(params) {
  return request(`${path1}/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function setTag(params) {
  return request(`${path1}/set`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function refresh(params) {
  return request(`${path1}/push?serverName=` + params);
}






