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

// const currentPage = ref(props.page)

const setCurrentPage = async (p, action) => {
  switch (action) {
    case 'next':
      if (props.page < props.pages) emit('pageSet', props.page + 1)
      break
    case 'prev':
      if (props.page > 1) emit('pageSet', props.page - 1)
      break
    default:
      emit('pageSet', p)
      break
  }
}

</script>

<template>
  <nav class="pagination flex-row justify-center gap-05">
    <span class="page" @click="setCurrentPage(0, 'prev')" :class="{ disabled: page === 1 }">
      <IconsChevronLeft />
    </span>
    <span
      v-if="pages"
      class="page"
      v-for="p in pages"
      :key="p"
      @click="setCurrentPage(p, 'current')"
      :class="{ active: page === p }"
    >
      {{ p }}
    </span>
    <span class="page" @click="setCurrentPage(0, 'next')" :class="{ disabled: page === pages }">
      <IconsChevronRight />
    </span>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $slate-400;
  width: 3rem;
  height: 3rem;
  border-radius: 2px;
  cursor: pointer;

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
