<template>
  <div class="custom-root">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'CustomView',
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .custom-root {
    height: 100%;
    background-color: #EFF2F7;
  }
</style>
