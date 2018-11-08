<template>
  <div class="payee-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'PayeeView'
}
</script>

<style lang="less" scoped>
.payee-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>