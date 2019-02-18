<template>
  <el-card class="box">
    <build-bread level1="权限管理" level2="权限列表" class="bb"></build-bread>

    <el-table :data="formdata" height="650" border style="width: 100%">
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="680"></el-table-column>
      <el-table-column prop="path" label="路径" width="680"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      formdata: [
        {
          authName: "",
          path: ""
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await this.$http.get("rights/list");
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.formdata = data;
      }
      console.log(this.formdata);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.bb {
  margin-bottom: 30px;
}
</style>
