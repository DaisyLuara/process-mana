export default {
  path: 'payment',
  name: '付款',
  component: () =>
    import(/* webpackChunkName: "page/payment/paymentView" */ 'page/payment/paymentView'),
  meta: {
    title: '付款',
    permission: 'payments'
  },
  redirect: 'payment/list',
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/payment/list/routerView" */ 'page/payment/list/routerView'),
      meta: {
        title: '付款管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/index" */ 'page/payment/list/index'),
          name: '付款列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/save" */ 'page/payment/list/save'),
          name: '新增付款',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/save" */ 'page/payment/list/save'),
          name: '修改付款',
          meta: {}
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/detail" */ 'page/payment/list/detail'),
          name: '付款详情',
          meta: {}
        }
      ]
    },
    {
      path: 'payee',
      component: () =>
        import(/* webpackChunkName: "page/payment/payee/routerView" */ 'page/payment/payee/routerView'),
      meta: {
        title: '收款人管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/payment/payee/index" */ 'page/payment/payee/index'),
          name: '收款人列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/payment/payee/save" */ 'page/payment/payee/save'),
          name: '新增收款人',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/payment/payee/save" */ 'page/payment/payee/save'),
          name: '修改收款人',
          meta: {}
        }
      ]
    }
  ]
}
