export default {
  path: 'purchase',
  name: '采购',
  component: () =>
    import(/* webpackChunkName: "page/purchase/purchaseView" */ 'page/purchase/purchaseView'),
  meta: {
    title: '采购',
    permission: ''
  },
  redirect: 'purchase/list',
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/purchase/list/routerView" */ 'page/purchase/list/routerView'),
      meta: {
        title: '采购管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/purchase/list/index" */ 'page/purchase/list/index'),
          name: '采购列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/purchase/list/save" */ 'page/purchase/list/save'),
          name: '新增硬件',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/purchase/list/save" */ 'page/purchase/list/save'),
          name: '修改硬件',
          meta: {}
        },
        // {
        //   path: 'detail/:uid',
        //   component: () =>
        //     import(/* webpackChunkName: "page/purchase/list/detail" */ 'page/purchase/list/detail'),
        //   name: '付款详情',
        //   meta: {}
        // }
      ]
    }
  ]
}
