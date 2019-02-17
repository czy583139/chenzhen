<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "buildBread",
  props: ["level1", "level2"]
};
//data中的值只能来源于本身，数据到声明如果来源于外部，此时数据声明不能卸载data中
//props的值可以是字符串数组，数据的用法和data一样，1：插值表达式 2：bind属性
//props中的数据是数据声明，也就是自定义标签的属性
//props中的数据将来使用组件时通过属性赋值使用，也就是说声明的这两个属性，通过外部赋值使用

/*使用封装组件步骤
 * 1.将组件进行封装后，导入在main.js中
 * 2.
 *
 *
 */
</script>

<style>
</style>
