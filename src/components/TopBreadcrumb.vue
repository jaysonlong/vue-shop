<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="(title, index) in titles"
      :key="index"
      :to="paths[index] ? { path: paths[index] } : null"
      >{{title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    titles: Array,
    paths: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style>
</style>
