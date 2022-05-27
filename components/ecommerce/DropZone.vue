<script setup>
const emit = defineEmits(['mediaSelected', 'hideDropZone'])

const fileRef = ref(null)
const dragged = ref(false)
const itemsToUpload = ref([])

const handleItemsDropped = (event) => {
  dragged.value = false
  itemsToUpload.value = Array.from(event.dataTransfer.files).map((item) => item)
  emit('mediaSelected', Array.from(itemsToUpload.value))
}

const handleItemsSelected = (event) => {
  itemsToUpload.value = Array.from(event.target.files).map((item) => item)
  emit('mediaSelected', Array.from(itemsToUpload.value))
}
</script>
<template>
  <div
    class="flex-col items-center justify-center gap-1 min-h-20 bg-slate-100"
    :class="{ 'dragged-over': dragged }"
    @dragover.prevent="dragged = true"
    @dragleave.prevent="dragged = false"
    @drop.prevent="handleItemsDropped"
  >
    <IconsBackupFill />
    <a class="link text-lg font-bold" href="#" @click="fileRef.click()">Or click here to choose your files</a>
    <form enctype="multipart/form-data">
      <input
        class="hidden"
        id="upload"
        type="file"
        accept="image/*, application/pdf"
        :multiple="true"
        ref="fileRef"
        @change="handleItemsSelected"
      />
    </form>
    <button class="btn btn__secondary py-05 px-2" @click="$emit('hideDropZone')">
      <span>Cancel</span>
    </button>
  </div>
</template>

<style lang="scss"></style>
