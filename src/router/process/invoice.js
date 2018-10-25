export default {
  path: 'invoice',
  name: '票据',
  component: () =>
    import(/* webpackChunkName: "page/invoice/invoiceView" */ 'page/invoice/invoiceView'),
  meta: {
    title: '票据',
    permission: 'invoice'
  },
  redirect: 'invoice/list',
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/invoice/list/routerView" */ 'page/invoice/list/routerView'),
      meta: {
        title: '开票管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/index" */ 'page/invoice/list/index'),
          name: '开票列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/save" */ 'page/invoice/list/save'),
          name: '新增开票',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/save" */ 'page/invoice/list/save'),
          name: '修改开票',
          meta: {}
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/detail" */ 'page/invoice/list/detail'),
          name: '票据详情',
          meta: {}
        }
      ]
    }
  ]
}
