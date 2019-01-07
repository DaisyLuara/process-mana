import auth from 'service/auth'

let router = {
  path: 'company',
  // redirect: 'company/customers',
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
      name: '公司管理',
      meta: {
        title: '公司管理',
        permission: 'company.customers'
      },
      component: () =>
        import(/* webpackChunkName: "page/company/customers/routerView" */ 'page/company/customers/routerView'),
      children: [
        {
          path: '/',
          name: '公司管理列表',
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
          name: '新增公司',
          meta: {
            permission: 'company.customers.create'
          }
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/customerSave" */ 'page/company/customers/customerSave'),
          name: '修改公司',
          meta: {
            permission: 'company.customers.update'
          }
        },
        {
          path: 'contacts',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contacts/contactList" */ 'page/company/customers/contacts/contactList'),
          name: '联系人详情列表',
          meta: {
            title: '联系人详情列表',
            permission: 'company.customers.contacts'
          }
        },
        {
          path: 'contacts/add',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contacts/contactSave" */ 'page/company/customers/contacts/contactSave'),
          name: '新增联系人',
          meta: {
            permission: 'company.customers.contacts.create'
          }
        },
        {
          path: 'contacts/edit',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contacts/contactSave" */ 'page/company/customers/contacts/contactSave'),
          name: '修改联系人',
          meta: {
            permission: 'company.customers.contacts.update'
          }
        },
        {
          path: 'perms/add',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contacts/contactSave" */ 'page/company/customers/contacts/contactSave'),
          name: '新增权限',
          meta: {}
        },
        {
          path: 'perms/edit',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/contacts/contactSave" */ 'page/company/customers/contacts/contactSave'),
          name: '修改权限',
          meta: {}
        }
      ]
    },
    {
      path: 'perms',
      redirect: 'perms',
      meta: {
        title: ''
      },
      component: () =>
        import(/* webpackChunkName: "page/company/customers/routerView" */ 'page/company/customers/routerView'),
      children: [
        {
          path: 'add',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/perms" */ 'page/company/customers/perms'),
          name: '新增权限',
          meta: {}
        },
        {
          path: 'edit/:uid',
          component: () =>
            import(/* webpackChunkName: "page/company/customers/perms" */ 'page/company/customers/perms'),
          name: '修改权限',
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
      return 'company/' + route.path
    }
  }
}

export default router
