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
      // 中间件组
      {
        path: '/middlewareGroup',
        name: 'middlewareGroup',
        icon: 'appstore',
        authority: ['admin', 'middlewareSystemList', 'middlewareResourceItemList', 'middlewareMemberList'],
        routes: [
          {
            // 中间件系统
            path: '/middlewareGroup/middlewareSystem',
            name: 'middlewareSystemList',
            icon: 'block',
            authority: ['admin', 'middlewareSystemList'],
            component: './portal/MiddlewareSystemList',
          },
          {
            // 资源项
            path: '/middlewareGroup/middlewareResource/middlewareResourceItem',
            name: 'middlewareResourceItemList',
            icon: 'plus-circle',
            authority: ['admin', 'middlewareResourceItemList'],
            component: './portal/MiddlewareResourceItemList',
          },
          {
            // 组员管理
            path: '/middlewareGroup/middlewareMember',
            name: 'middlewareMemberList',
            icon: 'team',
            authority: ['admin', 'middlewareMemberList'],
            component: './portal/MiddlewareMemberList',
          },
          {
            // 接入文档
            path: 'https://wiki.ops.yangege.cn/pages/viewpage.action?pageId=35860814',
            name: '接入文档',
            icon: 'question-circle',
            authority: ['admin', 'middlewareSystemList', 'middlewareResourceItemList', 'middlewareMemberList'],
            target: '_blank' // 打开到新窗口
          }
        ],
      },
      // 授权管理
      {
        path: '/authManager',
        name: 'authManager',
        icon: 'crown',
        authority: ['admin', 'resource_auth'],
        routes: [
          {
            // 资源授权
            path: '/authManager/resourceAuthList',
            name: 'resourceAuthList',
            icon: 'gift',
            authority: ['admin', 'resource_auth'],
            component: './portal/ResourceAuthList',
          },
          {
            // 业务授权
            path: '/authManager/businessAuth',
            name: 'businessAuthList',
            icon: 'money-collect',
            authority: ['admin', 'businessAuthList'],
            component: './portal/BusinessAuthList',
          },
        ]
      },
      // 业务线
      {
        path: '/businessLine',
        name: 'businessLineList',
        icon: 'bar-chart',
        authority: ['admin', 'businessLineList'],
        component: './portal/BusinessLineList',
      },
      // 开关系统
      {
        path: '/juliaSwitch',
        name: 'juliaSwitch',
        icon: 'lock',
        authority: ['admin', 'juliaSwitchGroupList', 'juliaSwitchList'],
        routes: [
          {
            // 开关组
            path: '/juliaSwitch/juliaSwitchGroupList',
            name: 'juliaSwitchGroupList',
            icon: 'hdd',
            authority: ['admin', 'juliaSwitchGroupList'],
            component: './julia/JuliaSwitchGroupList',
          },
          {
            // 开关
            path: '/juliaSwitch/juliaSwitchList',
            name: 'juliaSwitchList',
            icon: 'switcher',
            authority: ['admin', 'juliaSwitchList'],
            component: './julia/JuliaSwitchList',
          },
          {
            // 接入文档
            path: 'https://wiki.ops.yangege.cn/pages/viewpage.action?pageId=35861038',
            name: '接入文档',
            icon: 'question-circle',
            authority: ['admin', 'juliaSwitchGroupList', 'juliaSwitchList'],
            target: '_blank', // 点击新窗口打开
          }
        ],
      },
      // 对账系统
      {
        path: '/xcheck',
        name: 'xcheck',
        icon: 'cloud-sync',
        authority: ['admin', 'xcheckBillList', 'xcheckList', 'xcheckTaskList', 'xcheckDiffList', 'xcheckExecutorNodeList'],
        routes: [
          {
            path: '/xcheck/xcheckBillList',
            name: 'xcheckBillList',
            authority: ['admin', 'xcheckBillList'],
            component: './xcheck/xcheckBillList',
          },
          {
            path: '/xcheck/xcheckList',
            name: 'xcheckList',
            authority: ['admin', 'xcheckList'],
            component: './xcheck/xcheckList',
          },
          {
            path: '/xcheck/xcheckTaskList',
            name: 'xcheckTaskList',
            authority: ['admin', 'xcheckTaskList'],
            component: './xcheck/xcheckTaskList',
          },
          {
            path: '/xcheck/xcheckDiffList',
            name: 'xcheckDiffList',
            authority: ['admin', 'xcheckDiffList'],
            component: './xcheck/xcheckDiffList',
          },
          {
            path: '/xcheck/xcheckExecutorNodeList',
            name: 'xcheckExecutorNodeList',
            authority: ['admin', 'xcheckExecutorNodeList'],
            component: './xcheck/xcheckExecutorNodeList',
          },
        ],
      },
      {
        path: '/barrier',
        name: 'barrier',
        icon: 'deployment-unit',
        routes: [
          // 标签
          {
            path: '/barrier/tag',
            name: 'tagList',
            icon: 'tag',
            // 直连阶段先删除，接入权限时候放开即可
            authority: ['admin', 'tagList'],
            component: './barrier/TagList',
          },
          // 服务分组
          {
            path: '/barrier/application',
            name: 'applicationList',
            icon: 'appstore',
            // 直连阶段先删除，接入权限时候放开即可
            authority: ['admin', 'applicationList'],
            component: './barrier/ApplicationList',
          }],
      },
      // 发号器
      {
        path: '/sequence',
        name: 'sequence',
        icon: 'fire',
        authority: ['admin', 'snowflakeNamespaceList', 'snowflakeNamespaceManager'],
        routes: [
          // // DB发号器
          // {
          //   path: '/sequence/oldSequence',
          //   name: 'oldSequence',
          //   icon: 'tag',
          //   // 直连阶段先删除，接入权限时候放开即可
          //   authority: ['admin', 'tagList'],
          //   component: './sequence/SnowflakeNamespaceList',
          // },
          // 雪花发号器
          {
            path: '/sequence/snowflakeNamespace',
            name: 'snowflakeNamespace',
            icon: 'setting',
            authority: ['admin', 'snowflakeNamespaceList'],
            component: './sequence/SnowflakeNamespaceList',
          },
          // 雪花命名空间监控管理页
          {
            path: '/sequence/SnowflakeNamespaceManager',
            name: 'snowflakeNamespaceManager',
            hideInMenu: true,
            authority: ['admin', 'snowflakeNamespaceManager'],
            component: './sequence/SnowflakeNamespaceManagerList',
          },
          {
            // 接入文档
            path: 'https://wiki.ops.yangege.cn/pages/viewpage.action?pageId=38442335',
            name: '接入文档',
            icon: 'question-circle',
            authority: ['admin', 'snowflakeNamespaceList'],
            target: '_blank', // 点击新窗口打开
          }
        ],
      },
      {
        path: '/city',
        name: 'cityList',
        icon: 'lock',
        // 直连阶段先删除，接入权限时候放开即可
        // authority: ['admin', 'cityList'],
        component: './robot/CityList',
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