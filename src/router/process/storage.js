let router = {
  path: 'storage',
  name: '仓库',
  component: () =>
    import(/* webpackChunkName: "page/storage/storageView" */ 'page/storage/storageView'),
  meta: {
    title: '仓库',
    permission: ''
  },
  // redirect: 'storage/list',
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/storage/list/routerView" */ 'page/storage/list/routerView'),
      meta: {
        title: '库存明细'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/list/index" */ 'page/storage/list/index'),
          name: '库存明细列表',
          meta: {}
        }
      ]
    },
    {
      path: 'records',
      component: () =>
        import(/* webpackChunkName: "page/storage/records/routerView" */ 'page/storage/records/routerView'),
      meta: {
        title: '调拨记录'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/records/index" */ 'page/storage/records/index'),
          name: '调拨记录列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/records/save" */ 'page/storage/records/save'),
          name: '调拨记录增加',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/records/save" */ 'page/storage/records/save'),
          name: '调拨记录修改',
          meta: {}
        }
      ]
    },
    {
      path: 'store',
      component: () =>
        import(/* webpackChunkName: "page/storage/store/routerView" */ 'page/storage/store/routerView'),
      meta: {
        title: '仓库管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/store/index" */ 'page/storage/store/index'),
          name: '仓库管理列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/store/save" */ 'page/storage/store/save'),
          name: '仓库管理增加',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/store/save" */ 'page/storage/store/save'),
          name: '仓库管理修改',
          meta: {}
        }
      ]
    },
    {
      path: 'location',
      component: () =>
        import(/* webpackChunkName: "page/storage/location/routerView" */ 'page/storage/location/routerView'),
      meta: {
        title: '库位管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/location/index" */ 'page/storage/location/index'),
          name: '库位管理列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/location/save" */ 'page/storage/location/save'),
          name: '库位管理增加',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/location/save" */ 'page/storage/location/save'),
          name: '库位管理修改',
          meta: {}
        }
      ]
    },
    {
      path: 'product',
      component: () =>
        import(/* webpackChunkName: "page/storage/product/routerView" */ 'page/storage/product/routerView'),
      meta: {
        title: '产品管理'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/product/index" */ 'page/storage/product/index'),
          name: '产品管理列表',
          meta: {}
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/product/save" */ 'page/storage/product/save'),
          name: '产品管理增加',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/product/save" */ 'page/storage/product/save'),
          name: '产品管理修改',
          meta: {}
        }
      ]
    }
  ]
}

router.redirect = () => {
  let routes = router.children
  for (let route of routes) {
    return '/storage/' + route.path
  }
}
export default router
