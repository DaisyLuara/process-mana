<template>
  <div class="history-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'PaymentHistoryView'
}
</script>

<style lang="less" scoped>
.history-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>