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
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/invoice/list/routerView" */ 'page/invoice/list/routerView'),
      meta: {
        title: '开票管理',
        permission: 'invoice.list'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/index" */ 'page/invoice/list/index'),
          name: '开票列表',
          meta: {
            permission: 'invoice.list.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/save" */ 'page/invoice/list/save'),
          name: '新增开票',
          meta: {
            permission: 'invoice.list.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/save" */ 'page/invoice/list/save'),
          name: '开票再次提交',
          meta: {
            permission: 'invoice.list.create'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/list/detail" */ 'page/invoice/list/detail'),
          name: '票据详情',
          meta: {
            permission: ''
          }
        }
      ]
    },
    {
      path: 'invoice_company',
      component: () =>
        import(/* webpackChunkName: "page/invoice/invoiceCompany/routerView" */ 'page/invoice/invoiceCompany/routerView'),
      meta: {
        title: '开票公司',
        permission: 'invoice.invoiceCompany'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/invoiceCompany/index" */ 'page/invoice/invoiceCompany/index'),
          name: '开票公司列表',
          meta: {
            permission: 'invoice.invoiceCompany.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/invoice/invoiceCompany/save" */ 'page/invoice/invoiceCompany/save'),
          name: '新增开票公司',
          meta: {
            permission: 'invoice.invoiceCompany.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/invoiceCompany/save" */ 'page/invoice/invoiceCompany/save'),
          name: '修改开票公司',
          meta: {
            permission: 'invoice.invoiceCompany.update'
          }
        }
      ]
    },
    {
      path: 'receipt',
      component: () =>
        import(/* webpackChunkName: "page/invoice/receipt/routerView" */ 'page/invoice/receipt/routerView'),
      meta: {
        title: '收款管理',
        permission: 'invoice.receipt'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/receipt/index" */ 'page/invoice/receipt/index'),
          name: '收款列表',
          meta: {
            permission: 'invoice.receipt.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/invoice/receipt/save" */ 'page/invoice/receipt/save'),
          name: '新增收款',
          meta: {
            permission: 'invoice.receipt.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/receipt/save" */ 'page/invoice/receipt/save'),
          name: '修改收款',
          meta: {
            permission: 'invoice.receipt.update'
          }
        }
      ]
    },
    {
      path: 'history',
      component: () =>
        import(/* webpackChunkName: "page/invoice/history/routerView" */ 'page/invoice/history/routerView'),
      meta: {
        title: '我已审批的',
        permission: 'invoice.history'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/invoice/history/index" */ 'page/invoice/history/index'),
          name: '票据已审批的列表',
          meta: {
            permission: 'invoice.history.read'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/invoice/history/detail" */ 'page/invoice/history/detail'),
          name: '票据审批详情',
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
      return '/invoice/' + route.path
    }
  }
}
export default router
