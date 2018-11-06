<template>
  <div class="collection-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'CollectionView'
}
</script>

<style lang="less" scoped>
.collection-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>