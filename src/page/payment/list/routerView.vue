<template>
  <div class="payment-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'PointView'
}
</script>

<style lang="less" scoped>
.payment-root {
  height: 100%;
  margin: 10px;
  background-color: #eff2f7;
}
</style>