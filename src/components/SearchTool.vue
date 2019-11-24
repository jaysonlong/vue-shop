<template>
  <el-row :gutter="20">
    <el-col :span="span">
      <el-input :placeholder="placeholder"
        :value="value"
        @input="handleInput"
        clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
    </el-col>
    <slot></slot>
  </el-row>
</template>

<script>

export default {
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    span: {
      type: Number,
      default: 8
    }
  },
  methods: {
    handleInput (newVal) {
      this.$emit('input', newVal)
    },
    handleSearch () {
      this.$emit('search')
    }
  }
}
</script>

<style>
</style>
