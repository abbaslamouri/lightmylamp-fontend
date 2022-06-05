<script setup>
const props = defineProps({
  media: {
    type: Array,
  },
  folders: Array,
  sortOptions: {
    type: Array,
    required: true,
  },
  sort: {
    type: Object,
  },
  selectedFolder: {
    type: Object,
  },
})

const emit = defineEmits(['savedFolder', 'toggleSort', 'deleteFolder'])
const config = useRuntimeConfig()

const { fetchAll } = useHttp()

const { message, errorMsg, alert } = useAppState()
const showForm = ref(false)
// const folderToDelete = ref(null)
const newFolder = ref({})

const editFolder = () => {
  newFolder.value.name = props.selectedFolder.name
  newFolder.value.id = props.selectedFolder.id
  showForm.value = true
}

const cancelEditFolder = () => {
  newFolder.value = {}
  showForm.value = false
}

const saveNewFolder = async () => {
  emit('savedFolder', newFolder.value)
  showForm.value = false
  newFolder.value = {}
}
</script>

<template>
  <div class="flex-row items-center justify-between">
    <div class="flex-row items-center gap-2">
      <button class="btn btn__new-media gap-1 text-xs" @click="showForm = true">
        <IconsFolderPlus />
        <span> New Folder </span>
      </button>
      <transition name="folder-form">
        <form class="flex-row items-center gap-2" v-if="showForm" @submit.prevent="saveNewFolder">
          <FormsBaseInput type="text" label="Folder" placeholder="Folder" v-model="newFolder.name" />
          <div class="flex-row gap-1">
            <button class="btn btn__primary py-05 px-1" type="submit">OK</button>
            <button class="btn btn__secondary py-05 px-1" @click.prevent="cancelEditFolder">Cancel</button>
          </div>
        </form>
      </transition>
    </div>
    <div class="text-sm flex-row gap-3">
      <div class="flex-row items-center">
        <!-- <span>Sort Order</span> -->
        <Sort
          :sort="sort"
          :sortOptions="sortOptions"
          @toggleSort="$emit('toggleSort', $event)"
          v-if="folders.length > 1"
        />
      </div>
      <div class="flex-row items-center gap-1" v-if="selectedFolder.id">
        <button class="btn" @click="editFolder">
          <IconsEditFill class="fill-green-800" />
        </button>
        <button class="btn" @click="$emit('deleteFolder')">
          <IconsDeleteFill class="fill-red-600" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
