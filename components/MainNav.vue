<script setup>
const navLinkItems = ref([
  {
    name: 'Home',
    show: false,
    link: 'index',
  },
  {
    name: 'Our parts',
    show: false,
    link: 'ecommerce-products',
  },
  {
    name: 'Capabilities',
    show: false,
  },
  {
    name: 'News',
    show: false,
  },
  {
    name: 'About ACS',
    show: false,
  },
  {
    name: 'Account',
    show: false,
  },
  {
    name: 'Contact',
    show: false,
  },
])
</script>

<template>
  <div class="flex-row justify-center bg-slate-800">
    <ul class="w-996p flex-row justify-center">
      <li class="item w-full text-slate-50 flex-row justify-center items-center uppercase py-2" v-for="item in navLinkItems" :key="item.title">
        <NuxtLink :to="{ name: item.link }">
          <!-- <button class="btn btn__primary btn__pill px-2 py-05"> -->
          {{ item.name }}
          <!-- </button> -->
        </NuxtLink>
        <!-- <div class="menu-item text-center py-1 text-sm uppercase">
          <div>{{ item.title }}</div>
        </div> -->
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
