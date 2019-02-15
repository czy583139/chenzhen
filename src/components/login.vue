<template>
  <div class="box">
    <el-form label-position="top" label-width="80px" :model="formdata" class="login">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model=" formdata.username" ref="input"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model=" formdata.password"></el-input>
      </el-form-item>
      <el-button type="success" class="btn" @click.prevent="getLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async getLogin() {
      const res = await this.$http.post(`login`, this.formdata);
      const {
        data: {
          data,
          meta: { msg, status }
        }
      } = res;
      if (status === 200) {
        this.$message.success(msg);
        localStorage.setItem("token", data.token);
        this.$router.push({
          name: "home"
        });
      } else {
        this.$message.error(msg);
      }
    }
  },
  mounted() {
    this.$refs.input.focus();
  }
};
</script>

<style>
.box {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  background-color: #ffffff;
  border-radius: 5px;
  width: 400px;
  padding: 30px;
}
.btn {
  width: 100%;
}
</style>
