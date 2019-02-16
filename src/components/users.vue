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
        <!-- clearable有一个点击清除输入框内容后，渲染刷新数据
        clear	在点击由 clearable 属性生成的清空按钮时触发
        -->
        <el-input
          @clear="getAllUsers()"
          clearable
          class="searchInput"
          placeholder="请输入内容"
          v-model="query"
        >
          {{query}}
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="success" plain @click="showDiaAddUser()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :data="list" style="width: 100%">
      <!-- 1. label 控制的是当前列的表头
      2. prop 控制的是当前列单元格的数据,prop 的值来源于外层 data 绑定的数据 tableData 数组中对象的 key 名-->
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="140">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="Updateshow(scope.row)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="deleteList(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器部分 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1,3,5]"
      :page-size="2"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="putList()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑方框弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleUpdate">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="UpdateList()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
  </el-card>
</template>

<script>
//  分页
//     @size-change 每页条数改变时
//     @current-change 页码改变时 (当前1页 点击2页 )
//     current-page 当前显示第几页 页码
//     page-sizes 每页条数的不同情况的数组
//     layout 附加功能
//     total 一共数据的条数

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
      dialogFormVisibleUpdate: false,
      // 对话框
      dialogFormVisibleAdd: false,
      // 表单数据-> 将来发送post请求->请求体->
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      query: "",
      list: [],
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 1,
      total: -1 // 当为-1时，表示请求条数失败了，如果写1那么写死了不太好
    };
  },

  created() {
    this.getList();
  },
  methods: {
    async getList() {
      // 获得token中的权限
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      // 采用拼接字符串的方法设置请求体
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // 解构赋值

      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
      }
    },
    // element中的方法，下面是自己写的代码
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);

      this.pagenum = val;
      this.getList();
    },
    searchUser() {
      // qurey已经绑定了这个组件，是嵌套关系，所以直接影响
      this.getList();
    },
    getAllUsers() {
      this.getList();
    },
    showDiaAddUser() {
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    async putList() {
      const res = await this.$http.post("users", this.formdata);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.getList();
        this.dialogFormVisibleAdd = false;
        this.$message.success("添加成功");
      }
    },
    deleteList(user) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.getList();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.info("取消成功");
        });
    },
    async UpdateList() {
      const res = await this.$http.put(`users/${this.formdata.id}`,this.formdata);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        console.log(res);
        this.getList();
        this.dialogFormVisibleUpdate = false;
      }
    },
    Updateshow(user) {
      this.formdata = user;

      this.dialogFormVisibleUpdate = true;
    }
  },
  watch: {
    query(newval, oldval) {
      if (this.query === "") {
        this.getList();
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
