import auth from 'service/auth'
let router = {
  path: 'demand',
  name: '需求',
  component: () =>
    import(/* webpackChunkName: "page/demand/demandView" */ 'page/demand/demandView'),
  meta: {
    title: '需求',
    permission: 'demand'
  },
  children: [
    {
      path: 'list',
      component: () =>
        import(/* webpackChunkName: "page/demand/list/routerView" */ 'page/demand/list/routerView'),
      meta: {
        title: '申请管理',
        permission: 'demand.application'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/demand/list/index" */ 'page/demand/list/index'),
          name: '需求列表',
          meta: {
            permission: 'demand.application.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/demand/list/save" */ 'page/demand/list/save'),
          name: '新增申请',
          meta: {
            permission: 'demand.application.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/demand/list/save" */ 'page/demand/list/save'),
          name: '编辑申请',
          meta: {
            permission: 'demand.application.update'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/demand/list/detail" */ 'page/demand/list/detail'),
          name: '申请详情',
          meta: {}
        }
      ]
    },
    {
      path: 'modify',
      component: () =>
        import(/* webpackChunkName: "page/demand/modify/routerView" */ 'page/demand/modify/routerView'),
      meta: {
        title: '需求修改',
        permission: 'demand.modify'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/demand/modify/index" */ 'page/demand/modify/index'),
          name: '需求修改列表',
          meta: {
            permission: 'demand.modify.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/demand/modify/save" */ 'page/demand/modify/save'),
          name: '新增修改',
          meta: {
            permission: 'demand.modify.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/demand/modify/save" */ 'page/demand/modify/save'),
          name: '修改需求',
          meta: {
            permission: 'demand.modify.update'
          }
        },
        {
          path: 'detail/:uid',
          component: () =>
            import(/* webpackChunkName: "page/demand/modify/detail" */ 'page/demand/modify/detail'),
          name: '需求修改详情',
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
      return '/demand/' + route.path
    }
  }
}
export default router
