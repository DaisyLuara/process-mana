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
    }
  ]
}
