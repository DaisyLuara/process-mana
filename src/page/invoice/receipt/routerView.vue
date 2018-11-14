<template>
  <div class="invoice-company-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'InvoiceView'
}
</script>

<style lang="less" scoped>
.invoice-company-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>