export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      // 演示使用
      {
        path: '/sequence',
        name: 'sequence',
        icon: 'fire',
        authority: ['admin', 'snowflakeNamespaceList', 'snowflakeNamespaceManager'],
        routes: [
          // 演示用例
          {
            path: '/sequence/snowflakeNamespace',
            name: 'snowflakeNamespace',
            icon: 'setting',
            authority: ['admin', 'snowflakeNamespaceList'],
            component: './sequence/SnowflakeNamespaceList',
          },
        ],
      },
      // 403
      {
        component: '403',
      },
      // 404
      {
        component: '404',
      },
    ],
  },
];
