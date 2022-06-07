<script setup>
const props = defineProps({
  pages: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['pageSet'])
const active = ref(1)

const setCurrentPage = async (p) => {
  if (p < 1) {
    p = 1
    return
  }
  if (p > props.pages) {
    p = props.pages
    return
  }
  active.value = p
  emit('pageSet', p)
}
</script>

<template>
  <nav class="flex-row justify-center items-center gap-4">
    <div class="pagination flex-row justify-center gap-05">
      <span class="page" @click="setCurrentPage(1)" :class="{ disabled: page == 1 }">
        <IconsDoubleArrowLeft />
      </span>
      <span class="page" @click="setCurrentPage(page - 1)" :class="{ disabled: page == 1 }">
        <IconsChevronLeft />
      </span>
      <span v-if="page == 18" class="page" @click="setCurrentPage(page - 4)" :class="{ active: active == page - 4 }">
        {{ page - 4 }}
      </span>
      <span
        v-if="page == 17 || page == 18"
        class="page"
        @click="setCurrentPage(page - 3)"
        :class="{ active: active == page - 3 }"
      >
        {{ page - 3 }}
      </span>

      <span v-if="page > 2" class="page" @click="setCurrentPage(page - 2)" :class="{ active: active == page - 2 }">
        {{ page - 2 }}
      </span>
      <span v-if="page > 1" class="page" @click="setCurrentPage(page - 1)" :class="{ active: active == page - 1 }">
        {{ page - 1 }}
      </span>
      <span class="page" @click="setCurrentPage(page)" :class="{ active: active == page }">
        {{ page }}
      </span>
      <span
        v-if="pages > 1 && page <= pages - 1"
        class="page"
        @click="setCurrentPage(page + 1)"
        :class="{ active: active == page + 1 }"
      >
        {{ page + 1 }}
      </span>
      <span
        v-if="pages > 2 && page <= pages - 2"
        class="page"
        @click="setCurrentPage(page + 2)"
        :class="{ active: active == page + 2 }"
      >
        {{ page + 2 }}
      </span>
      <span
        v-if="(pages > 3 && page == 1) || page == 2"
        class="page"
        @click="setCurrentPage(page + 1)"
        :class="{ active: active == page + 3 }"
      >
        {{ page + 3 }}
      </span>
      <span
        v-if="pages > 4 && page == 1"
        class="page"
        @click="setCurrentPage(page + 4)"
        :class="{ active: active == page + 2 }"
      >
        {{ page + 4 }}
      </span>
      <span class="page" @click="setCurrentPage(page + 1)" :class="{ disabled: page >= pages }">
        <IconsChevronRight />
      </span>
      <span class="page" @click="setCurrentPage(pages)" :class="{ disabled: page >= pages }">
        <IconsDoubleArrowRight />
      </span>
    </div>
    <div class="flex-row items-center gap-1 text-sm">
      <span class="">Go&nbsp;to</span>
      <label class="base-select min-w-6">
        <select class="select min-h-20" v-model="page" @change="setCurrentPage(parseInt($event.target.value))">
          <option v-for="p in pages" :key="p" :value="p">{{ p }}</option>
        </select>
      </label>
      <span class="" v-if="pages > 1">of&nbsp;{{ pages }}&nbsp;pages</span>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.base-select {
  select {
    min-height: 3.1rem;
    padding: 0 1rem;
  }
  &::after {
    content: '';
    bottom: 0.75rem;
  }
}

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $slate-400;
  width: 3rem;
  height: 3rem;
  border-radius: 2px;
  font-size: 1.2rem;
  cursor: pointer;

  svg {
    width: 2rem;
  }

  &.disabled {
    cursor: not-allowed;

    svg {
      fill: #ccc;
    }
  }

  &.active {
    background-color: $slate-400;
    color: $slate-50;
  }
}
</style>
