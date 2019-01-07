<template>
  <div class="records-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'RecordsView'
}
</script>

<style lang="less" scoped>
.records-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>