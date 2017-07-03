<template>
<div>
  <div class="section">
    <h4 class="title is-4">个人信息</h4>
    <div class="columns is-mobile">
      <div class="column is-4">头像</div>
      <div class="column"></div>
    </div>
    <div class="columns is-mobile">
      <div class="column is-4">昵称</div>
      <div class="column"></div>
    </div>
    <div class="columns is-mobile">
      <div class="column is-4">性别</div>
      <div class="column"></div>
    </div>
    <div class="columns is-mobile">
      <div class="column is-4">手机号码</div>
      <div class="column"></div>
    </div>
  </div>
  <hr>
  <div class="section">
    <h4 class="title is-4">商品信息</h4>
    <div class="columns is-mobile">
      <div class="column is-4">名称</div>
      <div class="column"></div>
    </div>
    <div class="columns is-mobile">
      <div class="column is-4">价格</div>
      <div class="column"></div>
    </div>
        <div class="columns is-mobile">
      <div class="column is-4">有效期</div>
      <div class="column"></div>
    </div>  
  </div>
</div>  
</template>

<script>
export default {
  name: 'Payment',
  props: {
    seriesId: {
      type: String,
      required: true
    }
  }
}
</script>

<style>

</style>

