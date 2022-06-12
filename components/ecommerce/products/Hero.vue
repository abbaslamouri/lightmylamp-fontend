<script setup>
const route = useRoute()

const heroBgImage = computed(() =>
  route.name === 'ecommerce-coffee' ? '/assets/hero-original.webp' : '/assets/hero-virtuo.webp'
)
</script>

<template>
  <section
    class="hero w-full flex-col justify-center gap-3 px-3 text-slate-50 bg-norepeat bg-cover minh-40 uppercase"
    :style="{ backgroundImage: `url(${heroBgImage})` }"
  >
    <div class="links flex-row gap-2">
      <NuxtLink class="link" :to="{ name: 'index', params: { slug: ' ' } }">
        <button class="btn btn__hero gap-1">
          <IconsCoffee />
          <span :class="{ active: route.name === 'index' }">Original</span>
        </button>
      </NuxtLink>
      <NuxtLink class="link" :to="{ name: 'index', params: { slug: ' ' } }">
        <button class="btn btn__hero gap-1">
          <IconsCoffeeMaker />
          <span :class="{ active: route.name === 'vertuo-coffee-pods' }">Virtuo</span>
        </button>
      </NuxtLink>
    </div>
    <div class="content flex-col items-center justify-center gap-3">
      <div class="tracking-wider">Original</div>
      <h1 class="text-5xl text-center tracking-widest">The Classic Espresso Experience</h1>
      <NuxtLink class="flex-row items-center gap-1" :to="{ name: 'index', params: { slug: ' ' } }">
        <span class="tracking-wider">Learn more about the original system</span>
        <IconsChevronRight class="fill-slate-50" />
      </NuxtLink>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
