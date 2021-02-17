<template>
  <div :class="classObj"
       class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened"
         class="drawer-bg"
         @click="handleClickOutside" />
    <sidebar class="sidebar-container"
             v-if="isRouterAlive" />
    <div :class="{hasTagsView:needTagsView}"
         class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <div class="topMenucss">
          <span :class="current === '1'?'topMenucss0':''"
                @click="changeRoutes('1')">操作中心</span>
          <span :class="current === '0'?'topMenucss0':''"
                @click="changeRoutes('0')">维护中心</span>
          <span :class="current === '2'?'topMenucss0':''"
                @click="changeRoutes('2')">系统管理</span>
        </div>
        <div style="height:50px;width:100%;"></div>
        <!-- 横向 顶部 菜单 -->
        <!-- <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <template v-for="(route,index) in permission_routes">
            <template v-if="!route.hidden">
              <el-menu-item
                v-if="hasOneShowingChild(route.children,route) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!route.alwaysShow"
                :index="onlyOneChild.path"
              >
                <template v-if="onlyOneChild.meta">
                  <svg-icon
                    :icon-class="(onlyOneChild.meta && onlyOneChild.meta.icon)?onlyOneChild.meta.icon:''"
                  />
                <span @click="goPage('/index')">{{onlyOneChild.meta.title}}</span>
                </template>
              </el-menu-item>
            </template>

            <el-submenu
              :index="resolvePath(route.path)"
              v-if="!route.hidden && ((route.children.length !== 1) || (route.children.length === 1 && route.children[0].meta.title !== '首页'))"
            >
              <template slot="title">
                <item
                  v-if="route.meta"
                  :icon="route.meta && route.meta.icon"
                  :title="route.meta.title"
                />
              </template>

              <el-menu-item
                v-for="(child,childIndex) in route.children"
                :index="route.path+'/'+child.path"
              >
                <template slot="title">
                  <svg-icon :icon-class="(child.meta && child.meta.icon)?child.meta.icon:''" />
                 <span @click="goPage(route.path+'/'+child.path)">{{child.meta.title}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu> -->

        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import path from "path";
import RightPanel from "@/components/RightPanel";
import {
  AppMain,
  Navbar,
  Settings,
  Test,
  Sidebar,
  TagsView
} from "./components";
import Item from "./components/Sidebar/Item";
import { isExternal } from "@/utils/validate";
import { getRouters } from '@/api/menu'
import Cookies from 'js-cookie'
import router from '../router'

import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Layout",
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    this.onlyOneChild = null;
    return {
      basePath: "",
      current: '1',
      isRouterAlive: true
    };
  },

  components: {
    AppMain,
    Navbar,
    Test,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Item
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu () {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    isCollapse () {
      return !this.sidebar.opened;
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  mounted: function () {
    this.current = Cookies.get('modelId')
  },
  methods: {
    isRouterAliveFn () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        //  this.isRouterAlive=true
      })
    },
    changeRoutes (obj) {
      this.current = obj
      Cookies.remove('modelId')
      Cookies.set('modelId', obj, { expires: 30 })
      let roles = this.$store.getters.roles
      this.$store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
        // 测试 默认静态页 面
        // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
        // 根据roles权限生成可访问的路由表
        router.addRoutes(accessRoutes) // 动态添加可访问路由表
        this.$router.push('/')
        // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      })
      // Cookies.remove('modelId')
      // Cookies.set('modelId', obj, { expires: 30 })
      // this.$router.push('/')
      // location.reload()

    },



    handleSelect (key, keyPath) {

    },
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },

    goPage (obj) {
      this.$router.push({ path: obj });
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    handleClickOutside () {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.topMenucss {
  background: #2b2f3a;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  width: 100%;
  position: fixed;
  z-index: 10;
}
.topMenucss span {
  padding: 10px 50px;
  color: #999;
  cursor: pointer;
}
.topMenucss .topMenucss0 {
  color: #fff;
}
</style>
