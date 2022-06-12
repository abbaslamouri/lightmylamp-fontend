<script setup>
const emit = defineEmits(['toggleProductFiltersSlideout'])

const listType = ref('tile')
</script>

<template>
  <section class="flex-row items-center justify-between w-996p p-2">
    <button
      class="bg-white border border-slate-300 br-3 flex-row items-center gap-3 px-3 py-1 cursor-pointer"
      @click="$emit('toggleProductFiltersSlideout')"
    >
      <span>Filter</span>
      <IconsFilter />
    </button>
    <div class="flex-col items-center gap-1">
      <span>View</span>
      <div class="icons flex-row gap-1">
        <IconsListTiled
          @click="listType = 'tile'"
          class="icon fill-slate-400 cursor-pointer"
          :class="{ selected: listType === 'tile' }"
        />
        <IconsListBulleted
          @click="listType = 'list'"
          class="icon fill-slate-400 cursor-pointer"
          :class="{ selected: listType === 'list' }"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.icon {
  &.selected {
    fill: $slate-800;
  }
}
</style>
