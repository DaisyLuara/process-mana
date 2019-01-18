import auth from 'service/auth'
let router = {
  path: 'payment',
  name: '付款',
  component: () =>
    import(/* webpackChunkName: "page/payment/paymentView" */ 'page/payment/paymentView'),
  meta: {
    title: '付款',
    permission: 'payment'
  },
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/payment/list/routerView" */ 'page/payment/list/routerView'),
      meta: {
        title: '付款管理',
        permission: 'payment.list'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/index" */ 'page/payment/list/index'),
          name: '付款列表',
          meta: {
            permission: 'payment.list.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/save" */ 'page/payment/list/save'),
          name: '新增付款',
          meta: {
            permission: 'payment.list.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/save" */ 'page/payment/list/save'),
          name: '付款再次提交',
          meta: {
            permission: 'payment.list.create'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/payment/list/detail" */ 'page/payment/list/detail'),
          name: '付款详情',
          meta: {
            permission: ''
          }
        }
      ]
    },
    {
      path: 'payee',
      component: () =>
        import(/* webpackChunkName: "page/payment/payee/routerView" */ 'page/payment/payee/routerView'),
      meta: {
        title: '收款人管理',
        permission: 'payment.payee'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/payment/payee/index" */ 'page/payment/payee/index'),
          name: '收款人列表',
          meta: {
            permission: 'payment.payee.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/payment/payee/save" */ 'page/payment/payee/save'),
          name: '新增收款人',
          meta: {
            permission: 'payment.payee.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/payment/payee/save" */ 'page/payment/payee/save'),
          name: '修改收款人',
          meta: {
            permission: 'payment.payee.update'
          }
        }
      ]
    },
    {
      path: 'history',
      component: () =>
        import(/* webpackChunkName: "page/payment/history/routerView" */ 'page/payment/history/routerView'),
      meta: {
        title: '我已审批的',
        permission: 'payment.history'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/payment/history/index" */ 'page/payment/history/index'),
          name: '付款已审批的列表',
          meta: {
            permission: 'payment.history.read'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/payment/history/detail" */ 'page/payment/history/detail'),
          name: '付款审批详情',
          meta: {
            permission: ''
          }
        }
      ]
    }
  ]
}


router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/payment/' + route.path
    }
  }
}
export default router
