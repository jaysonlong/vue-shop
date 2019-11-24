<template>
  <div>
    <TopBreadcrumb :titles="['权限管理', '权限列表']"></TopBreadcrumb>

    <el-card>
      <!-- 权限列表 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '1'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },

  created () {
    this.getRightsList()
  },

  methods: {
    // 获取所有的权限
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }

      this.rightsList = res.data
    }
  }
}
</script>

<style>
</style>
