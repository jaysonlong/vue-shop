<template>
  <div>
    <TopBreadcrumb :titles="['商品管理', '添加商品']"></TopBreadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品描述"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules"
        ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'"
          :before-leave="beforeTabLeave" @tab-click="tabClicked">

          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="categoryList"
                :props="cascaderProps"
                v-model="addForm.goods_cat"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="attr in dynamicTableData"
              :label="attr.attr_name" :key="attr.attr_id">
              <el-checkbox-group v-model="attr.attr_vals">
                <el-checkbox v-for="(attr_val, idx) in attr.origin_attr_vals"
                  :label="attr_val" :key="idx" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="attr in staticTableData"
              :label="attr.attr_name" :key="attr.attr_id">
              <el-input v-model="attr.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <el-upload list-type="picture"
              :action="uploadURL"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传图片</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btn-add" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      activeIndex: '0', // 字符串型，以匹配tab标签的name属性
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [], // 商品图片的服务器端临时路径
        goods_introduce: '', // 商品介绍
        attrs: [] // 商品属性
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      categoryList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      dynamicTableData: [],
      staticTableData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },

  computed: {
    categoryId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },

  created () {
    this.getCategoryList()
  },

  methods: {
    // 获取所有商品分类数据
    async getCategoryList () {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }

      this.categoryList = res.data
    },

    // 切出基本属性标签时必须选择商品分类
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 切到参数/属性面板时异步获取数据
    async tabClicked () {
      if (this.activeIndex === '1' && !this.dynamicDataLoaded) {
        // 获取动态参数
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          item.origin_attr_vals = item.attr_vals.slice()
        })
        this.dynamicTableData = res.data
        this.dynamicDataLoaded = true
      } else if (this.activeIndex === '2' && !this.staticDataLoaded) {
        // 获取静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }

        this.staticTableData = res.data
        this.staticDataLoaded = true
      }
    },

    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      } else {
        this.dynamicDataLoaded = false
        this.staticDataLoaded = false
      }
    },

    // 打开图片预览对话框
    handlePreview (file) {
      // file.response.data.url是服务器返回数的地址
      // file.url是本地地址，以blob:http://开头
      this.previewPath = file.url
      this.previewVisible = true
    },

    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const idx = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(idx, 1)
    },

    // 把服务器返回的临时路径保存到表单数据对象
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },

    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }

        // 复制表单数据以避免影响用v-mode绑定的元素
        const form = _.cloneDeep(this.addForm)

        // 转换表单数据
        form.goods_cat = form.goods_cat.join(',')
        this.dynamicTableData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          })
        })
        this.staticTableData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        form.attrs = this.addForm.attrs

        // 后台要求商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }

        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.preview-img {
  width: 100%;
}

.btn-add {
  margin-top: 15px;
}
</style>
