<template>
  <div class="inform-root">
    <second-sidebar module="inform"/>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'InformView'
}
</script>

<style lang="less" scoped>
.inform-root {
  height: 100%;
  background-color: #eff2f7;
  .topbar {
    position: absolute;
    top: 120px;
    left: 200px;
    right: 0;
    height: 75px;
    line-height: 75px;
    border-bottom: 1px solid #d3dce6;
    background-color: #fff;
    z-index: 98;
    font-size: 16px;
    color: #5e6d82;
    padding-left: 35px;
  }
}
</style>
