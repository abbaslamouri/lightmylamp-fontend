<script setup>
const product = useState('product')
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Next Higher Assembly</div>
      <div></div>
    </div>
    <div class="flex-row wrap gap-1">
      <div v-for="(nextHigherAssembly, i) in product.nextHigherAssemblies" :key="`next-higher-assembly-${i}`">
        <div class="text-xs text-slate-50 border border-slate-400 bg-slate-600 px-1 py-02 br-3">
          {{ nextHigherAssembly.name }}
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
