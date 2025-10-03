<!-- 
<template>
  <nav class="breadcrumb">
    <ul>
      <li v-for="(crumb, index) in crumbs" :key="index">
        <router-link :to="crumb.path">{{ crumb.meta.breadcrumb }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Create breadcrumb array based on route
const crumbs = computed(() => {
  const matched = route.matched
  return matched.map(r => ({
    path: r.path,
    meta: r.meta
  }))
})
</script>

<style scoped>
.breadcrumb ul {
  display: flex;
  list-style: none;
  padding: 0;
}
.breadcrumb li + li::before {
  content: '>';
  margin: 0 8px;
}
</style> -->
