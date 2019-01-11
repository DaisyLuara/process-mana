<template>
  <div class="location-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'LocationView'
}
</script>

<style lang="less" scoped>
.location-root {
  height: 100%;
  background-color: #eff2f7;
}
</style>