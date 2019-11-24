<template>
  <div>
    <TopBreadcrumb :titles="['商品管理', '参数列表']"></TopBreadcrumb>

    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat-operation">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :options="categoryList"
            :props="cascaderProps"
            v-model="selectedCategoryKeys"
            @change="getParamsData">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="getParamsData">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="dynamic">
          <el-button type="primary" size="mini"
            :disabled="categoryId === null"
            @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="dynamicTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, idx) in scope.row.attr_vals"
                  :key="idx" closable @close="deleteAttrVal(idx, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small"
                  @keyup.enter.native="confirmInput(scope.row)"
                  @blur="confirmInput(scope.row)">
                </el-input>
                <el-button v-else size="small"
                  @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  @click="removeParamsById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="static">
          <el-button type="primary" size="mini"
            :disabled="categoryId === null"
            @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="staticTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, idx) in scope.row.attr_vals"
                  :key="idx" closable @close="deleteAttrVal(idx, scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small"
                  @keyup.enter.native="confirmInput(scope.row)"
                  @blur="confirmInput(scope.row)">
                </el-input>
                <el-button v-else size="small"
                  @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  @click="removeParamsById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/属性的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedCategoryKeys: [],

      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

      activeName: 'dynamic',
      // 动态参数的数据
      dynamicTableData: [],
      // 静态属性的数据
      staticTableData: []
    }
  },

  computed: {
    // 当前选中的三级分类的id
    categoryId () {
      if (this.selectedCategoryKeys.length === 3) {
        return this.selectedCategoryKeys[2]
      }
      return null
    },
    paramsType () {
      return this.activeName === 'dynamic' ? 'many' : 'only'
    },
    titleText () {
      return this.activeName === 'dynamic' ? '动态参数' : '静态属性'
    }
  },

  created () {
    this.getCategoryList()
  },

  methods: {
    // 获取商品分类列表
    async getCategoryList () {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }

      this.categoryList = res.data
    },

    // 获取分类的参数数据
    async getParamsData () {
      if (this.categoryId === null) {
        this.selectedCategoryKeys = []
        // 注意要清空表格数据
        this.dynamicTableData = []
        this.staticTableData = []
        return
      }

      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes`,
        {
          params: { sel: this.paramsType }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeName === 'dynamic') {
        this.dynamicTableData = res.data
      } else {
        this.staticTableData = res.data
      }
    },

    // 删除对应的参数可选项
    deleteAttrVal (idx, attr) {
      attr.attr_vals.splice(idx, 1)
      this.saveAttrVals(attr)
    },

    // 展示文本输入框
    showInput (attr) {
      attr.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 确认输入，按下enter或触发blur
    confirmInput (attr) {
      if (attr.inputValue.trim().length === 0) {
        attr.inputValue = ''
        attr.inputVisible = false
        return
      }

      attr.attr_vals.push(attr.inputValue.trim())
      attr.inputValue = ''
      attr.inputVisible = false
      this.saveAttrVals(attr)
    },

    // 保存参数/属性到服务器
    async saveAttrVals (attr) {
      const { data: res } = await this.$http.put(
        `categories/${this.categoryId}/attributes/${attr.attr_id}`,
        {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr.attr_vals.join(',')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }

      this.$message.success('修改参数成功')
    },

    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    // 添加分类的参数/属性
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.paramsType
          }
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }

        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },

    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.paramsType }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    // 修改参数/属性的信息
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.categoryId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_vals: this.editForm.attr_vals,
            attr_sel: this.paramsType
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }

        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },

    // 根据Id删除参数项
    async removeParamsById (attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('操作已取消')
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.categoryId}/attributes/${attrId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }

      this.$message.success('删除参数成功')
      this.getParamsData()
    }
  }
}
</script>

<style lang="less" scoped>
.cat-operation {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 150px;
}
</style>
