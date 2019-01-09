import auth from 'service/auth'

let router = {
  path: 'company',
  name: '公司',
  meta: {
    title: '公司',
    permission: 'company'
  },
  component: () =>
    import(/* webpackChunkName: "page/company/companyView" */ 'page/company/companyView'),
  children: [
    {
      path: 'customers',
      meta: {
        title: '公司管理',
        permission: 'company.customers'
      },
      component: () =>
        import(/* webpackChunkName: "page/company/customers/routerView" */ 'page/company/customers/routerView'),
      children: [
        {
          path: '/',
          // name: '公司管理列表',
          meta: {
            title: '公司管理列表',
            permission: 'company.customers.read'
          },
          component: () =>
            import(/* webpackChunkName: "page/company/customers/index" */ 'page/company/customers/index')
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/customerSave" */ 'page/company/customers/customerSave'),
          // name: '新增公司',
          meta: {
            title: '新增公司',
            permission: 'company.customers.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/customerSave" */ 'page/company/customers/customerSave'),
          meta: {
            title: '修改公司',
            permission: 'company.customers.update'
          }
        },
        {
          path: 'contacts',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contactList" */ 'page/company/customers/contactList'),
          // name: '联系人详情列表',
          meta: {
            title: '联系人详情列表',
            permission: 'company.customers.contacts_read'
          }
        },
        {
          path: 'c_add',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contactSave" */ 'page/company/customers/contactSave'),
          meta: {
            title: '新增联系人',
            permission: 'company.customers.contacts_create'
          }
        },
        {
          path: 'c_edit',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contactSave" */ 'page/company/customers/contactSave'),
          meta: {
            title: '修改联系人',
            permission: 'company.customers.contacts_update'
          }
        }
      ]
    },
    {
      // 角色主页，也是角色列表页
      path: 'role',
      component: () =>
        import(/* webpackChunkName: "page/company/role/roleView" */ 'page/company/role/roleView'),
      meta: {
        title: '角色管理',
        permission: 'company.role'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/company/role/roleList" */ 'page/company/role/roleList'),
          name: '角色管理',
          meta: {
            permission: 'company.role.read'
          }
        },
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/company/role/roleSave" */ 'page/company/role/roleSave'),
          name: '新增角色',
          meta: {
            permission: 'company.role.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/company/role/roleSave" */ 'page/company/role/roleSave'),
          name: '修改角色',
          meta: {
            permission: 'company.role.update'
          }
        }
      ]
    },
    {
      // 角色主页，也是角色列表页
      path: 'permission',
      component: () =>
        import(/* webpackChunkName: "page/company/perms/permsView" */ 'page/company/perms/permsView'),
      meta: {
        title: '权限管理',
        permission: 'company.permission'
      },
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "page/company/perms/permsList" */ 'page/company/perms/permsList'),
          name: '权限管理',
          meta: {
            permission: 'company.permission.read'
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
      return 'company/' + route.path
    }
  }
}

export default router
