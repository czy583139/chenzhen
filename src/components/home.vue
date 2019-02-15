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
        <el-menu :unique-opened="true" :router="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //在home组件渲染完之前触发，如果当home组件渲染完毕，则表示登录了，所以严格来说必须在这个函数里面
  //也不需要写else，因为钩子函数自动触发，如果登录成功
  beforeMount() {
    if (!localStorage.getItem("token")) {
      this.$router.push({
        name: "login"
      });
      this.$message.warning("请登录");
    }
  },
  methods: {
    getOut() {
      localStorage.clear();
      this.$router.push({
        name: "login"
      });
      this.$message.success("退出成功");
    }
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
  background-color: green;
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
