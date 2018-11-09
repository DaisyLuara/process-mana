export default {
  path: 'contract',
  name: '合同',
  component: () =>
    import(/* webpackChunkName: "page/contract/contractView" */ 'page/contract/contractView'),
  meta: {
    title: '合同',
    permission: 'contract'
  },
  redirect: 'contract/list',
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/contract/list/routerView" */ 'page/contract/list/routerView'),
      meta: {
        title: '合同管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/index" */ 'page/contract/list/index'),
          name: '合同列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/save" */ 'page/contract/list/save'),
          name: '新增合同',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/save" */ 'page/contract/list/save'),
          name: '修改合同',
          meta: {}
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/detail" */ 'page/contract/list/detail'),
          name: '合同详情',
          meta: {}
        }
      ]
    },
    {
      path: 'collection',
      component: () =>
        import(/* webpackChunkName: "page/contract/collection/routerView" */ 'page/contract/collection/routerView'),
      meta: {
        title: '收款提示'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/contract/collection/index" */ 'page/contract/collection/index'),
          name: '收款提示列表',
          meta: {}
        }
      ]
    },
    {
      path: 'history',
      component: () =>
        import(/* webpackChunkName: "page/contract/history/routerView" */ 'page/contract/history/routerView'),
      meta: {
        title: '审批历史'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/contract/history/index" */ 'page/contract/history/index'),
          name: '审批历史列表',
          meta: {}
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/contract/history/detail" */ 'page/contract/history/detail'),
          name: '详情',
          meta: {}
        }
      ]
    }
  ]
}
