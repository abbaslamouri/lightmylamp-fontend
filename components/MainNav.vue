<script setup>
const navLinkItems = ref([
  {
    title: 'Home',
    show: false,
  },
  {
    title: 'Our parts',
    show: false,
  },
  {
    title: 'Capabilities',
    show: false,
  },
  {
    title: 'News',
    show: false,
  },
  {
    title: 'About ACS',
    show: false,
  },
  {
    title: 'Account',
    show: false,
  },
  {
    title: 'Contact',
    show: false,
  },
])
</script>

<template>
  <div class="flex-row justify-center bg-slate-800">
    <ul class="w-996p flex-row justify-center">
      <li class="item w-full text-slate-50" v-for="item in navLinkItems" :key="item.title">
        <div class="menu-item text-center py-1 text-sm uppercase">
          <component :is="item.icon"></component>
          <div>{{ item.title }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.item {
  border-left: 1px solid $slate-600;
  border-right: 1px solid $slate-600;
  margin-right: -1px;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: $slate-800;
  }
}
</style>
