import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/xcheck' + '/' + 'common';

export async function dictionaryQuery() {
  return request(`${path}/dictionary/query`, {
    method: 'GET',
  });
}





