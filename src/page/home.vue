<template>
  <div class="main">
    <headModule/>
    <div class="first-sidebar" v-show="!iconMenuShow" @mouseleave="leaveIcon">
      <el-menu :default-active="'/' + currModule" router>
        <el-menu-item
          v-for="m in modules"
          :key="m.path"
          :index="'/' + m.path"
          class="menu-no-icon-item"
          @click="handleMenuHide"
        >
          <el-badge
            v-if="m.path === 'contract'"
            :is-dot="m.path === 'contract' && contractCount > 0"
          >
            <img :src="m.src" class="first-sidebar-icon">
            {{ m.meta.title }}
          </el-badge>
          <el-badge v-if="m.path === 'invoice'" :is-dot="m.path === 'invoice' && invoiceCount > 0">
            <img :src="m.src" class="first-sidebar-icon">
            {{ m.meta.title }}
          </el-badge>
          <el-badge v-if="m.path === 'payment'" :is-dot="m.path === 'payment' && paymentCount > 0">
            <img :src="m.src" class="first-sidebar-icon">
            {{ m.meta.title }}
          </el-badge>
          <el-badge v-if="m.path === 'inform'" :is-dot="m.path === 'inform' && noticeCount > 0">
            <img :src="m.src" class="first-sidebar-icon">
            {{ m.meta.title }}
          </el-badge>
          <img
            v-if="m.path !== 'contract' && m.path !== 'invoice' && m.path !== 'payment' && m.path !== 'inform'"
            :src="m.src"
            class="first-sidebar-icon"
          >
          <span
            v-if="m.path !== 'contract' && m.path !== 'invoice' && m.path !== 'payment' && m.path !== 'inform'"
          >{{ m.meta.title }}</span>
        </el-menu-item>
      </el-menu>
      <div class="menu-show">
        <i class="el-icon-d-arrow-left left-icon-menu" @click="handleMenuHide"/>
      </div>
    </div>
    <div v-show="iconMenuShow" class="first-icon-sidebar" @mouseenter="iconEnter">
      <el-menu :default-active="'/' + currModule" router>
        <el-menu-item
          v-for="m in modules"
          :key="m.path"
          :index="'/' + m.path"
          class="menu-item menu-icon-item"
        >
          <el-badge
            v-if="m.path === 'contract'"
            :is-dot="m.path === 'contract' && contractCount > 0"
          >
            <img :src="m.src" class="first-sidebar-icon">
          </el-badge>
          <el-badge v-if="m.path === 'invoice'" :is-dot="m.path === 'invoice' && invoiceCount > 0">
            <img :src="m.src" class="first-sidebar-icon">
          </el-badge>
          <el-badge v-if="m.path === 'payment'" :is-dot="m.path === 'payment' && paymentCount > 0">
            <img :src="m.src" class="first-sidebar-icon">
          </el-badge>
          <el-badge v-if="m.path === 'inform'" :is-dot="m.path === 'inform' && noticeCount > 0">
            <img :src="m.src" class="first-sidebar-icon">
          </el-badge>
          <img
            v-if="m.path !== 'contract' && m.path !== 'invoice' && m.path !== 'payment' && m.path !== 'inform'"
            :src="m.src"
            class="first-sidebar-icon"
          >
        </el-menu-item>
      </el-menu>
      <div class="menu-icon-show">
        <i class="el-icon-d-arrow-right right-icon-menu" @click="handleMenuShow"/>
      </div>
    </div>
    <div class="system-menu">
      <div
        v-for="item in systemMenuList"
        :key="item.id"
        :class="{'active': active === item.id}"
        class="system-menu-item"
        @click="systemMenu(item)"
      >{{ item.name }}</div>
    </div>
    <div class="modules">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { Menu, MenuItem, Button, Badge, Icon } from "element-ui";
import auth from "service/auth";
import { Cookies, getAuditingCount, notificationStats } from "service";

const CDN_URL = process.env.CDN_URL;
const NODE_ENV = process.env.NODE_ENV;

export default {
  name: "Home",
  components: {
    "el-menu": Menu,
    "el-menu-item": MenuItem,
    "el-button": Button,
    "el-badge": Badge
  },
  data() {
    return {
      iconMenuShow: true,
      visible: false,
      setIntervalValue: "",
      CDN_URL: CDN_URL + "process/img/",
      systemMenuList: [
        {
          id: "zhongtai",
          name: "中台系统"
        },
        {
          id: "liucheng",
          name: "流程管理"
        }
      ],
      active: "liucheng"
    };
  },
  computed: {
    modules() {
      let items = [];
      for (let route of this.$router.options.routes) {
        if (route.path === "/") {
          for (let m of route["children"]) {
            if (!auth.checkPathPermission(m) || !m.meta || !m.meta.title) {
              continue;
            }
            switch (m.path) {
              case "company":
                m.src = this.CDN_URL + "company_icon.png";
                break;
              case "contract":
                m.src = this.CDN_URL + "contract_icon.png";
                break;
              case "invoice":
                m.src = this.CDN_URL + "bill_icon.png";
                break;
              case "payment":
                m.src = this.CDN_URL + "payment_icon.png";
                break;
<<<<<<< HEAD
=======
              case "storage":
                m.src = this.CDN_URL + "purchase_icon.png";
                break;
>>>>>>> develop
              case "inform":
                m.src = this.CDN_URL + "notification-icon.png";
                break;
              default:
                m.src = "";
                break;
            }
            items.push(m);
          }
        }
      }
      return items;
    },
    currModule() {
      let path = this.$store.getters.currRoute.path;
      for (let m of this.modules) {
        if (path.indexOf("/" + m.path) == 0) {
          return m.path;
        }
      }
      return "";
    },
    noticeCount() {
      return this.$store.state.notificationCount.noticeCount;
    },
    contractCount() {
      return this.$store.state.processState.contractCount;
    },
    invoiceCount() {
      return this.$store.state.processState.invoiceCount;
    },
    paymentCount() {
      return this.$store.state.processState.paymentCount;
    }
  },
  created() {
    let userInfo = JSON.parse(Cookies.get("user_info"));
    this.$store.commit("setCurUserInfo", userInfo);
    this.notificationStats();
    this.getAuditingCount();
  },
  methods: {
    leaveIcon() {
      this.iconMenuShow = true;
    },
    iconEnter() {
      this.iconMenuShow = false;
    },
    handleMenuShow() {
      this.iconMenuShow = false;
    },
    handleMenuHide() {
      this.iconMenuShow = true;
    },
    systemMenu(item) {
      this.active = item.id;
      switch (item.id) {
        case "zhongtai":
          this.linkRedirect("ad");
          break;
        case "liucheng":
          this.linkRedirect("flow");
          break;
      }
    },
    linkRedirect(type) {
<<<<<<< HEAD
      localStorage.removeItem("permissions");
      // let permissions = this.$cookie.get('permissions')
=======
      let permissions = this.$cookie.get("permissions");
>>>>>>> develop
      let userInfo = this.$cookie.get("user_info");
      let jwt_ttl = this.$cookie.get("jwt_ttl");
      let token = this.$cookie.get("jwt_token");
      let jwt_begin_time = this.$cookie.get("jwt_begin_time");
      window.location.href =
        process.env.SERVER_URL +
<<<<<<< HEAD
        "/api/system_skip?user_info=" +
=======
        "/api/system_skip?permissions=" +
        permissions +
        "&user_info=" +
>>>>>>> develop
        userInfo +
        "&type=" +
        type +
        "&token=" +
        token +
        "&jwt_ttl=" +
        jwt_ttl +
        "&jwt_begin_time=" +
        jwt_begin_time;
    },
    getAuditingCount() {
      getAuditingCount(this)
        .then(res => {
          this.$store.commit("saveProcessState", res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    notificationStats() {
      notificationStats(this)
        .then(response => {
          response.setIntervalValue = this.setIntervalValue;
          this.$store.commit("saveNotificationState", response);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
@import "../assets/css/pcCommon.less";
.menu-icon-show {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  .right-icon-menu {
    color: #fff;
  }
}
.menu-show {
  font-size: 18px;
  font-weight: 600;
  text-align: right;
  margin-right: 10px;
  .left-icon-menu {
    color: #fff;
  }
}

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
  box-shadow: 0 1px 0 #ccc8c8;
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
