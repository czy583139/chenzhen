<template>
  <el-container class="content">
    <el-header>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">2</div>
        </el-col>
        <el-col :span="19">
          <div class="grid-content bg-purple-light">3</div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">4</div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
</style>
