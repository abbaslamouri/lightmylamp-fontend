<script setup>
defineEmits(['saveGallery'])
</script>

<template>
  <div class="flex-col gap-2">
    <div class="p-2 br-5 shadow-md">
      <button class="btn btn__checkout w-full py-1 flex-row justify-center" @click.prevent="$emit('saveGallery')">
        Save Changes
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
