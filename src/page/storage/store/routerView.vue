<template>
  <div class="store-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "StoreView"
};
</script>

<style lang="less" scoped>
.store-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>