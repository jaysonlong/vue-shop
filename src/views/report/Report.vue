<template>
  <div>
    <TopBreadcrumb :titles="['数据统计', '数据报表']"></TopBreadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <div id="charts"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      // 自定义的选项
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },

  // 该钩子在渲染完成并挂载完成后触发
  async mounted () {
    var myChart = echarts.init(document.getElementById('charts'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取统计数据失败')
    }

    const result = _.merge(res.data, this.options)
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
#charts {
  width: 750px;
  height: 400px;
}
</style>
