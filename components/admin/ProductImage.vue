<script setup>
defineProps({
  gallery: {
    type: Array,
    required: true,
  },
})
// const emit = defineEmits(['setGalleryImage', 'removeGalleryImage', 'selectFromProductGallery'])

const config = useRuntimeConfig()

const { showMediaSelector, mediaReference, galleryMedia } = useAppState()

const showMediaUploader = () => {
  mediaReference.value = 'productMedia'
  showMediaSelector.value = true
}
</script>

<template>
  <div>
    <div class="flex-row items-center justify-between text-sm mb-2">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Product Image</div>
      <div></div>
    </div>
    <div class="flex-col items-center gap-3">
      <section class="flex-col gap-1">
        <span class="px-3 text-xs text-center">{{ gallery[0].originalName }}</span>
        <div class="">
          <img
            class="w-full h-full cover"
            :src="`${config.backendUrl}/${gallery[0].path}`"
            :alt="`${gallery[0].originalName} Photo`"
            draggable="false"
          />
          <span class="link" @click.prevent="$emit('removeGalleryImage')">Remove Image</span>
        </div>
      </section>
      <button class="btn btn__image-select text-xs" @click.prevent="showMediaUploader">
        <IconsImage />
        <span> Select New Images </span>
      </button>
      <p class="text-sm">PNG, JPG, and GIF Accepted</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
</style>
