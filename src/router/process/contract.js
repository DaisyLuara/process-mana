import auth from 'service/auth'
let router = {
  path: 'contract',
  name: '合同',
  component: () =>
    import(/* webpackChunkName: "page/contract/contractView" */ 'page/contract/contractView'),
  meta: {
    title: '合同',
    permission: 'contract'
  },
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/contract/list/routerView" */ 'page/contract/list/routerView'),
      meta: {
        title: '合同管理',
        permission: 'contract.list'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/index" */ 'page/contract/list/index'),
          name: '合同列表',
          meta: {
            permission: 'contract.list.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/save" */ 'page/contract/list/save'),
          name: '新增合同',
          meta: {
            permission: 'contract.list.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/save" */ 'page/contract/list/save'),
          name: '修改合同',
          meta: {
            permission: 'contract.list.update'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/contract/list/detail" */ 'page/contract/list/detail'),
          name: '合同详情',
          meta: {
            permission: 'contract.list.detail'
          }
        }
      ]
    },
    {
      path: 'collection',
      component: () =>
        import(/* webpackChunkName: "page/contract/collection/routerView" */ 'page/contract/collection/routerView'),
      meta: {
        title: '收款合同',
        permission: 'contract.collection'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/contract/collection/index" */ 'page/contract/collection/index'),
          name: '收款合同列表',
          meta: {
            permission: 'contract.collection.read'
          }
        }
      ]
    },
    {
      path: 'history',
      component: () =>
        import(/* webpackChunkName: "page/contract/history/routerView" */ 'page/contract/history/routerView'),
      meta: {
        title: '我已审批的',
        permission: 'contract.history'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/contract/history/index" */ 'page/contract/history/index'),
          name: '我已审批的列表',
          meta: {
            permission: 'contract.history.read'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/contract/history/detail" */ 'page/contract/history/detail'),
          name: '详情',
          meta: {
            permission: 'contract.history.detail'
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
      return '/contract/' + route.path
    }
  }
}

export default router
