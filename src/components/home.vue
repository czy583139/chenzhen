<template>
  <el-container class="content">
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click="getOut()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <!-- 1 -->
          <el-submenu :index="itme.order+ ''" v-for="(itme) in list" :key="itme.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{itme.authName}}</span>
            </template>

            <el-menu-item :index="itme1.path + ''" v-for="(itme1) in itme.children" :key="itme1.id">
              <i class="el-icon-menu"></i>
              <span>{{itme1.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <!-- 这里得单独给主体部分提供容器，因为App.vue的容器是给login页面和home页面提供的整个容器 -->
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 在home组件渲染完之前触发，如果当home组件渲染完毕，则表示登录了，所以严格来说必须在这个函数里面
  // 也不需要写else，因为钩子函数自动触发，如果登录成功
  beforeMount() {
    // if (!localStorage.getItem("token")) {
    //   this.$router.push({
    //     name: "login"
    //   });
    //   this.$message.warning("请登录");
    // }
  },
  data() {
    return {
      list: []
    };
  },
  methods: {
    getOut() {
      localStorage.clear();
      this.$router.push({
        name: "login"
      });
      this.$message.success("退出成功");
    },
    async getmuens() {
      const res = await this.$http.get(`menus`);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  },
  created() {
    this.getmuens();
  }
};
</script>

<style>
.content {
  height: 100%;
  background-color: #b3c0d1;
}
.aside {
  background-color: #ffff;
}

.main {
  background-color: #eeee;
}

h2 {
  line-height: 60px;
  text-align: center;
  color: #ffffff;
  width: 100%;
}
.logout {
  line-height: 60px;
  text-decoration: none;
  width: 100%;
}
el-col {
  width: 100%;
}
</style>
