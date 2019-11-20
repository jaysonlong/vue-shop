<template>
  <el-card>
    <h1>Welcome</h1>
  </el-card>
</template>

<script>
export default {
  inject: ['setActivePath'],
  created () {
    this.setActivePath('/')
  }
}
</script>

<style scoped>
.el-card{
  text-align: center;
  height: 100%;
  font-size: 50px;
}
</style>
