import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/barrier' + '/' + 'tag';

export async function add(params) {
  return request(`${path}/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
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

export async function listAll() {
  return request(`${path}/listAll`);
}






