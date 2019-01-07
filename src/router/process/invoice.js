import auth from 'service/auth'

let router = {
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
    },
    {
      path: 'invoice_company',
      component: () =>
        import(/* webpackChunkName: "page/invoice/invoiceCompany/routerView" */ 'page/invoice/invoiceCompany/routerView'),
      meta: {
        title: '开票公司'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/invoiceCompany/index" */ 'page/invoice/invoiceCompany/index'),
          name: '开票公司列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/invoice/invoiceCompany/save" */ 'page/invoice/invoiceCompany/save'),
          name: '新增开票公司',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/invoiceCompany/save" */ 'page/invoice/invoiceCompany/save'),
          name: '修改开票公司',
          meta: {}
        }
      ]
    },
    {
      path: 'receipt',
      component: () =>
        import(/* webpackChunkName: "page/invoice/receipt/routerView" */ 'page/invoice/receipt/routerView'),
      meta: {
        title: '收款管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/receipt/index" */ 'page/invoice/receipt/index'),
          name: '收款列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/invoice/receipt/save" */ 'page/invoice/receipt/save'),
          name: '新增收款',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/receipt/save" */ 'page/invoice/receipt/save'),
          name: '修改收款',
          meta: {}
        }
      ]
    },
    {
      path: 'history',
      component: () =>
        import(/* webpackChunkName: "page/invoice/history/routerView" */ 'page/invoice/history/routerView'),
      meta: {
        title: '我已审批的'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/history/index" */ 'page/invoice/history/index'),
          name: '票据已审批的列表',
          meta: {}
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/history/detail" */ 'page/invoice/history/detail'),
          name: '票据审批详情',
          meta: {}
        }
      ]
    }
  ]
}
router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    if (auth.checkPathPermission(route)) {
      return '/invoice/' + route.path
    }
  }
}
export default router
