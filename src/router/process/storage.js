import auth from 'service/auth'
let router = {
  path: 'storage',
  name: '仓库',
  component: () =>
    import(/* webpackChunkName: "page/storage/storageView" */ 'page/storage/storageView'),
  meta: {
    title: '仓库',
    permission: 'storage'
  },
  // redirect: 'storage/list',
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/storage/list/routerView" */ 'page/storage/list/routerView'),
      meta: {
        title: '库存明细',
        permission: 'storage.list'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/list/index" */ 'page/storage/list/index'),
          meta: {
            title: '库存明细列表',
            permission: 'storage.list.read'
          }
        }
      ]
    },
    {
      path: 'records',
      component: () =>
        import(/* webpackChunkName: "page/storage/records/routerView" */ 'page/storage/records/routerView'),
      meta: {
        title: '调拨记录',
        permission: 'storage.records'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/records/index" */ 'page/storage/records/index'),
          meta: {
            title: '调拨记录列表',
            permission: 'storage.records.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/records/save" */ 'page/storage/records/save'),
          meta: {
            title: '调拨记录增加',
            permission: 'storage.records.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/records/save" */ 'page/storage/records/save'),
          meta: {
            title: '调拨记录修改',
            permission: 'storage.records.update'
          }
        }
      ]
    },
    {
      path: 'store',
      component: () =>
        import(/* webpackChunkName: "page/storage/store/routerView" */ 'page/storage/store/routerView'),
      meta: {
        title: '仓库管理',
        permission: 'storage.store'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/store/index" */ 'page/storage/store/index'),
          meta: {
            title: '仓库管理列表',
            permission: 'storage.store.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/store/save" */ 'page/storage/store/save'),
          meta: {
            title: '仓库管理增加',
            permission: 'storage.store.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/store/save" */ 'page/storage/store/save'),
          meta: {
            name: '仓库管理修改',
            permission: 'storage.store.update'
          }
        }
      ]
    },
    {
      path: 'location',
      component: () =>
        import(/* webpackChunkName: "page/storage/location/routerView" */ 'page/storage/location/routerView'),
      meta: {
        title: '库位管理',
        permission: 'storage.location'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/location/index" */ 'page/storage/location/index'),
          meta: {
            titl: '库位管理列表',
            permission: 'storage.location.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/location/save" */ 'page/storage/location/save'),
          meta: {
            title: '库位管理增加',
            permission: 'storage.location.read'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/location/save" */ 'page/storage/location/save'),
          meta: {
            title: '库位管理修改',
            permission: 'storage.location.read'
          }
        }
      ]
    },
    {
      path: 'product',
      component: () =>
        import(/* webpackChunkName: "page/storage/product/routerView" */ 'page/storage/product/routerView'),
      meta: {
        title: '产品管理',
        permission: 'storage.product'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/storage/product/index" */ 'page/storage/product/index'),
          meta: {
            title: '产品管理列表',
            permission: 'storage.product.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/storage/product/save" */ 'page/storage/product/save'),
          meta: {
            title: '产品管理增加',
            permission: 'storage.product.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/product/save" */ 'page/storage/product/save'),
          meta: {
            title: '产品管理修改',
            permission: 'storage.product.update'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/storage/product/save" */ 'page/storage/product/save'),
          meta: {
            title: '产品管理详情',
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
      return '/storage/' + route.path
    }
  }
}
export default router
