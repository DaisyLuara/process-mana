<template>
  <div 
    class="main">
    <div>页面不存在</div>
    <div>
      <router-link 
        :to="{ path: '/inform/list' }">返回通知</router-link>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
