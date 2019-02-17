<template>
  <el-card class="box">
    <build-bread level1="权限管理" level2="权限列表"></build-bread>
  </el-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = this.$http.get("rights/list");
      console.log(res);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
