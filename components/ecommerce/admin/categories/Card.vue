<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  showAction: {
    type: Boolean,
  },
})
const emit = defineEmits(['setActions', 'categoryUpdated', 'deleteCategory'])

const config = useRuntimeConfig()
</script>

<template lang="">
  <tr class="border border-b-stone-300 py-05">
    <td>{{ category.sortOrder }}</td>
    <td class="flex-row justify-center">
      <div class="w-5 h-5">
        <img
          class="w-full h-full contain"
          v-if="category.gallery.length && category.gallery[0] && category.gallery[0].mimetype.includes('image')"
          :src="`${config.backendUrl}/${category.gallery[0].path}/${category.gallery[0].name}`"
        />
        <img v-else class="w-full h-full contain" :src="`/placeholder.png`" />
      </div>
    </td>
    <td>
      <div>{{ category.name }}</div>
    </td>
    <td>{{ category.slug }}</td>
    <td>
      <span v-if="category.parent">
        {{ category.parent.name }}
      </span>
      <span v-else>-</span>
    </td>
    <td class="minw-12">
      <EcommerceAdminRowActions
        :showAction="showAction"
        @moreHoriz="$emit('setActions', { index: index, action: !showAction })"
        @deleteAction="$emit('deleteAttribute', attribute._id)"
        @cancel="$emit('setActions', { index: index, action: false })"
      />
    </td>
  </tr>
</template>

<style lang="scss">
@import '@/assets/scss/variables';

td {
  border-bottom: 1px solid $stone-300;
  padding: 2rem;
  text-align: center;
}
</style>
