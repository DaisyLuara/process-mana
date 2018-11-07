<template>
  <div class="bill-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'PointView'
}
</script>

<style lang="less" scoped>
.bill-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>