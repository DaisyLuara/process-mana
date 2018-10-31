<template>
  <div
    class="main">
    <headModule/>
    <div
      class="first-sidebar">
      <el-menu
        :default-active="'/' + currModule"
        router>
        <el-menu-item
          v-for="m in modules"
          v-if="m.path != 'inform'"
          :key="m.path"
          :index="'/' + m.path"
          class="menu-item">
          <img
            :src="m.src"
            class="first-sidebar-icon">
          {{ m.meta.title }}
        </el-menu-item>
        <el-menu-item
          class="menu-item"
          index="/inform">
          <el-badge
            :value="noticeCount"
            :max="99"
            class="item">
            <img
              src="../assets/images/icons/notification-icon.png"
              class="first-sidebar-icon"
              style="padding-right: 3px;">
            通知
          </el-badge>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="system-menu">
      <div
        v-for="item in systemMenuList"
        :key="item.id"
        :class="{'active': active === item.id}"
        class="system-menu-item"
        @click="systemMenu(item)">{{ item.name }}
      </div>
    </div>
    <div
      class="modules">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { Menu, MenuItem, Button, Badge, Icon } from 'element-ui'
import auth from 'service/auth'
import { Cookies } from 'service'
import notice from 'service/notice'

const CDN_URL = process.env.CDN_URL
const NODE_ENV = process.env.NODE_ENV

export default {
  name: 'Home',
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-button': Button,
    'el-badge': Badge
  },
  data() {
    return {
      visible: false,
      setIntervalValue: '',
      CDN_URL: CDN_URL + 'process/img/',
      systemMenuList: [
        {
          id: 'zhongtai',
          name: '中台系统'
        },
        {
          id: 'liucheng',
          name: '流程管理'
        }
      ],
      active: 'liucheng'
    }
  },
  computed: {
    modules() {
      let items = []
      for (let route of this.$router.options.routes) {
        if (route.path === '/') {
          for (let m of route['children']) {
            if (!auth.checkPathPermission(m) || !m.meta || !m.meta.title) {
              continue
            }
            switch (m.path) {
              case 'company':
                m.src = this.CDN_URL + 'company_icon.png'
                break
              case 'contract':
                m.src = this.CDN_URL + 'contract_icon.png'
                break
              case 'invoice':
                m.src = this.CDN_URL + 'bill_icon.png'
                break
              case 'payment':
                m.src = this.CDN_URL + 'payment_icon.png'
                break
              default:
                m.src = ''
                break
            }
            items.push(m)
          }
        }
      }
      return items
    },
    currModule() {
      let path = this.$store.getters.currRoute.path
      for (let m of this.modules) {
        if (path.indexOf('/' + m.path) == 0) {
          return m.path
        }
      }
      return ''
    },
    noticeCount() {
      return this.$store.state.notificationCount.noticeCount
    }
  },
  created() {
    let userInfo = JSON.parse(Cookies.get('user_info'))
    this.$store.commit('setCurUserInfo', userInfo)
    this.notificationStats()
  },
  methods: {
    systemMenu(item) {
      this.active = item.id
      let permissions = this.$cookie.get('permissions')
      let userInfo = this.$cookie.get('user_info')
      let jwt_ttl = this.$cookie.get('jwt_ttl')
      let token = this.$cookie.get('jwt_token')
      let jwt_begin_time = this.$cookie.get('jwt_begin_time')
      switch (item.id) {
        case 'zhongtai':
          window.location.href =
            process.env.SERVER_URL +
            '/api/system_skip?permissions=' +
            permissions +
            '&user_info=' +
            userInfo +
            '&type=ad&token=' +
            token +
            '&jwt_ttl=' +
            jwt_ttl +
            '&jwt_begin_time=' +
            jwt_begin_time
          break
        case 'liucheng':
          window.location.href =
            process.env.SERVER_URL +
            '/api/system_skip?permissions=' +
            permissions +
            '&user_info=' +
            userInfo +
            '&type=flow&token=' +
            token +
            '&jwt_ttl=' +
            jwt_ttl +
            '&jwt_begin_time=' +
            jwt_begin_time
          break
      }
    },
    notificationStats() {
      return notice
        .notificationStats(this)
        .then(response => {
          response.setIntervalValue = this.setIntervalValue
          this.$store.commit('saveNotificationState', response)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less">
@import '../assets/css/pcCommon.less';

.system-menu {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  padding-left: 90px;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 0 #ccc8c8;
  z-index: 300;
  .system-menu-item {
    margin-right: 35px;
    height: 60px;
    line-height: 60px;
    display: inline-block;
    cursor: pointer;
    &.active {
      border-bottom: 2px solid #2196f3;
    }
  }
}

.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.el-badge__content {
  border: none;
}

.el-badge__content.is-fixed {
  top: 10px;
  right: 45px;
}

.logo-wrap {
  .logo {
    margin-top: 15px;
  }
}

.modules-top {
  padding-top: 0;
}

.first-sidebar-icon {
  padding-right: 8px;
  margin-left: -3px;
  height: 16px;
}

.sidebar-user {
  position: absolute;
  bottom: 0;
  display: table;
  width: 100%;
  height: 90px;
  text-align: center;
  // background: #20a0ff url(../assets/images/user-bg.png) no-repeat center 5px;
  color: #fff;
  cursor: pointer;
  .avatar {
    width: 100%;
  }
}

.sidebar-user-block {
  position: absolute;
  z-index: 33;
  top: 10%;
  left: 16%;
  right: 16%;
  color: #000;
  font-weight: 600;
  // display: table-cell;
  // vertical-align: middle;
}

.sidebar-user-item {
  max-width: 90px;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  &.sidebar-user-item-main {
    font-size: 20px;
  }
  &.sidebar-user-item-sub {
    font-size: 14px;
  }
}
</style>
