<template>
  <el-card class="box-card">
    <!-- 面包写导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="search">
      <el-col>
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" v-model="query" class="searchInput">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :data="list" style="width: 100%">
      <!-- 1. label 控制的是当前列的表头
      2. prop 控制的是当前列单元格的数据,prop 的值来源于外层 data 绑定的数据 tableData 数组中对象的 key 名-->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="role_name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140"></el-table-column>
      <el-table-column label="操作" width="200"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
// create_time: 1486720211
// email: "adsfad@qq.com"
// id: 500
// mg_state: true
// mobile: "12345678"
// role_name: "主管"
// username: "admin"
export default {
  data() {
    return {
      query: "",
      list: [],
      //当前页码
      pagenum: 1,
      //每页显示条数
      pagesize: 5
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data.users;
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.search {
  margin-top: 20px;
  margin-bottom: 20px;
}
.searchInput {
  width: 400px;
}
</style>
