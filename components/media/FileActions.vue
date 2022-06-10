<script setup>
defineProps({
  selectedMedia: {
    type: Array,
  },
  sort: {
    type: Object,
  },
  sortOptions: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits([
  'fileUploadBtnClicked',
  'toggleSort',
  'deleteMedia',
  'searchKeywordSelected',
  'toggleSelectAll',
  'selectMediaType',
  'toggleSlideout',
])

const mediaToDisplay = ref('all')
</script>

<template>
  <div class="bg-white shadow-md">
    <div class="flex-row items-center justify-between gap-2 px-2 py-2 border-b-stone-300 text-xs">
      <button class="btn btn__new-media gap-1 min-w-16" @click="$emit('fileUploadBtnClicked')">
        <IconsUpload />
        <span>Upload Files</span>
      </button>
      <div class="flex-row gap-4">
        <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="$emit('toggleSort', $event)" />
        <div class="flex-row items-center gap-2 min-w-60">
          <button
            class="bg-slate-50 border border-transparent cursor-pointer"
            v-if="selectedMedia.length === 1"
            @click="$emit('toggleSlideout')"
          >
            <IconsEditFill class="fill-green-800" />
          </button>
          <button
            class="bg-slate-50 border border-transparent cursor-pointer"
            v-if="selectedMedia.length"
            @click="$emit('deleteMedia')"
          >
            <IconsDeleteFill class="fill-red-600" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex-row items-center justify-between px-2">
      <div class="px-2 py-1 flex-row items-center gap-2">
        <div class="w-16">
          <FormsBaseSelect
            v-model="mediaToDisplay"
            @update:modelValue="$emit('selectMediaType', mediaToDisplay)"
            label="Media Type"
            :options="[
              { key: 'all', name: 'All Media Items' },
              { key: 'image', name: 'Images' },
              { key: 'pdf', name: 'PDF' },
            ]"
          />
        </div>
        <button class="btn bg-slate-200 px-2 py-1" @click="$emit('toggleSelectAll', true)">Select All</button>
        <button class="btn bg-slate-200 px-2 py-1" @click="$emit('toggleSelectAll', false)">DeSelect All</button>
      </div>
      <Search @searchKeywordSelected="$emit('searchKeywordSelected', $event)" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
