import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/sequence/sequence/snowflake';

export async function add(params) {
  console.log('snowflakeNamespaceApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('snowflakeNamespaceApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('snowflakeNamespaceApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('snowflakeNamespaceApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('snowflakeNamespaceApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function workerNodeCount(params) {
  console.log('snowflakeNamespaceApi.workerNodeCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/workerNodeCount`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function workerNodePageList(params) {
  console.log('snowflakeNamespaceApi.workerNodePageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/workerNodePageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function nameExist(params) {
  console.log('snowflakeNamespaceApi.nameExist 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/namespaceExist`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getManagerInfo(params) {
  console.log('snowflakeNamespaceApi.getManagerInfo 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/namespace/getManagerInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





