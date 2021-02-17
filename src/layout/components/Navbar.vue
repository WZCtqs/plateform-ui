<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item"/>

        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="setting = true">布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import Screenfull from '@/components/Screenfull'
    import SizeSelect from '@/components/SizeSelect'
    import Search from '@/components/HeaderSearch'
    import ZhongHao from '@/components/ZhongHao'

    export default {
        components: {
            Breadcrumb,
            Hamburger,
            Screenfull,
            SizeSelect,
            Search,
            ZhongHao
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar',
                'device'
            ]),
            setting: {
                get() {
                    return this.$store.state.settings.showSettings
                },
                set(val) {
                    this.$store.dispatch('settings/changeSetting', {
                        key: 'showSettings',
                        value: val
                    })
                }
            }
        },
        data() {
            return {
                shopId:'',
                msgt:'title',
                msgw:'',
            }
        },
        // created() { // 页面创建生命周期函数
        //     this.initWebSocket()
        // },
        // destroyed: function () { // 离开页面生命周期函数
        //     this.websocketclose();
        // },
        methods: {
            open3() {
                this.$notify.info({
                    title: this.msgt,
                    message: this.msgw
                });
            },
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            async logout() {
                this.$confirm('确定注销并退出系统吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('LogOut').then(() => {
                        location.reload()
                    })
                })
            },
            collapse: function () {
                this.isCollapse = !this.isCollapse;
                if (this.isCollapse) {
                    this.iconClass = "cebianlanzhankai";
                } else {
                    this.iconClass = "cebianlanshouhui";
                }
            },
            // initWebSocket: function () {
            //     // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
            //     this.websock = new WebSocket("ws://localhost:8080/websocket/DPS007");
            //     this.websock.onopen = this.websocketonopen;
            //     this.websock.onerror = this.websocketonerror;
            //     this.websock.onmessage = this.websocketonmessage;
            //     this.websock.onclose = this.websocketclose;
            // },
            // websocketonopen: function () {
            //     console.log("WebSocket连接成功");
            // },
            // websocketonerror: function (e) {
            //     console.log("WebSocket连接发生错误");
            // },
            // websocketonmessage: function (e) {
            //     console.log(e)
            //     this.msgw = e.data;
            //     this.open3();
            // },
            // websocketclose: function (e) {
            //     console.log("connection closed (" + e + ")");
            // }
        }
    }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
