<script setup>
const route = useRoute()
console.log(route)
const config = useRuntimeConfig()
const { fetchAll, saveMedia, saveDoc, deleteDoc, deleteDocs } = useHttp()
const { message, errorMsg, showMediaSelector, galleryMedia } = useAppState()
const selectedMedia = ref([])
const media = ref([])
const count = ref(0)
const totalCount = ref(0)
const folders = ref([])
const selectedFolder = ref({})
// const folderToDelete = ref(null)
const page = ref(1)
const perPage = ref(50)
// const folderSort. field('name')
// const folderSortOrder = ref('')
// const mediaSortField = ref('name')
// const mediaSortOrder = ref('-')
const keyword = ref('')
const showDropZone = ref(false)
// const showModal = ref(false)
const ulploadItems = ref([])
const folderFields = 'id, name, slug'
const fields = 'id, name, slug, originalName, folder, path, mimetype'
let response = ''

const folderSort = reactive({
  field: 'name',
  order: '',
})
const folderSortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
  { key: 'createdAt', name: 'Date Created' },
]

const mediaSort = reactive({
  field: 'createdAt',
  order: '-',
})
const mediaSortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
  { key: 'createdAt', name: 'Date Created' },
]

const folderParams = computed(() => {
  return {
    fields: folderFields,
    sort: `${folderSort.order}${folderSort.field}`,
  }
})

const params = computed(() => {
  const params = {
    fields,
    page: page.value,
    limit: perPage.value,
    sort: `${mediaSort.order}${mediaSort.field}`,
    folder: Object.values(selectedFolder.value).length ? selectedFolder.value.id : null,
    keyword: keyword.value ? keyword.value : null,
  }
  if (!params.folder) delete params.folder
  if (!keyword.value) delete params.keyword
  return params
})

const pages = computed(() =>
  totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
)

console.log(errorMsg.value)

const fetchFolders = async () => {
  response = await fetchAll('media/folders', folderParams.value)
  folders.value = response.docs
  console.log(folders.value)
}

// const fetchFolders = async () => {
//   errorMsg.value = null
//   message.value = null
//   try {
//     const { data, pending, error } = await useFetch(`${config.API_URL}/media/folders`, {
//       params: folderParams.value,
//     })
//     if (error.value) throw error.value
//     console.log(data.value)
//     folders.value = data.value.docs
//   } catch (err) {
//     console.log(err.data)
//     // errorMsg.value = err.data.message
//   }
// }

const fetchMedia = async () => {
  selectedMedia.value = []
  response = await fetchAll('media', params.value)
  console.log('Media', response)
  media.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

// const overallFileUploadProgress = computed(() => {
//   let sum = 0
//   for (const prop in ulploadItems.value) {
//     sum = sum + ulploadItems.value[prop].progress
//   }
//   return ulploadItems.value.length ? sum / ulploadItems.value.length : 0
// })

// const fetchMedia = async () => {
//   errorMsg.value = null
//   message.value = null
//   try {
//     const { data, pending, error } = await useFetch(`${config.API_URL}/media/`, {
//       params: params.value,
//     })
//     if (error.value) throw error.value
//     console.log(data.value)
//     media.value = data.value.docs
//     totalCount.value = data.value.totalCount
//   } catch (err) {
//     console.log(err)
//     // errorMsg.value = err.data.message
//   }
// }

// Handles upload button click
const toggleDropZone = () => {
  if (!selectedFolder.value.id) errorMsg.value = 'Please selecet a folder'
  else showDropZone.value = !showDropZone.value
}

// Handles meia upload
const handleUplodMedia = async (gallery) => {
  console.log(gallery)
  console.log(selectedFolder.value)
  showDropZone.value = false

  if (gallery.length > 200) return (errorMsg.value = '200 files maximum')

  for (const prop in gallery) {
    media.value.unshift({
      name: 'spinner.gif',
      originalName: gallery[prop].name,
      path: '',
      folder: selectedFolder.value,
      mimetype: gallery[prop].type,
    })
  }

  if (!gallery.length) return
  const formData = new FormData()
  for (const prop in gallery) {
    formData.append('gallery', gallery[prop])
  }
  formData.append('folder', selectedFolder.value.id)

  response = await saveMedia(formData)
  // console.log(response)
  if (!response) return

  for (const prop in media.value) {
    const i = response.media.findIndex((m) => m.originalName == media.value[prop].originalName)
    // console.log(i)
    if (i !== -1) media.value[prop] = response.media[i]
  }
  await fetchMedia()
  // showModal.value = true
  // showDropZone.value = false
  // errorMsg.value = ''
  // message.value = ''
  // ulploadItems.value = []
  // for (const prop in files) {
  //   media.value.unshift({
  //     name: 'spinner.gif',
  //     originalName: files[prop].name,
  //     path: '',
  //     folder: selectedFolder.value,
  //     mimetype: files[prop].type,
  //   })
  // }
  // console.log('XXXXX', media.value)
  // const formData = new FormData()
  // // await Promise.all(
  // // files.map(async (item) => {
  // formData.append('gallery', item)
  // formData.append('folder', selectedFolder.value.id)
  // response = await fetch(`${config.apiUrl}/media`, {
  //   method: 'POST',
  //   body: formData,
  //   // headers: new Headers({
  //   // 'Content-Type': 'application/json',
  //   // Authorization: `Bearer ${token.value}`,
  //   // }),
  // })
  // // response = await saveMedia(formData)
  // console.log(response)
  // if (response) {
  //   const i = media.value.findIndex((m) => m.originalName == response.media.originalName)
  //   console.log(i)
  //   if (i !== -1) media.value[i] = response.media
  // }

  // const { data, pending, error } = await useFetch(`${config.API_URL}/media/${item._id}`, {
  //   method: 'DELETE',
  // })
  // if (error.value) console.log(error.value.data)
  // if (error.value) errorMsg.value += `${error.value.data.message}<br>`
  // else message.value += `${item.name} deleted.<br>`
  // })
  // )

  // for (const prop in Array.from(files)) {
  //   ulploadItems.value[prop] = {}
  //   ulploadItems.value[prop].name = files[prop].name
  //   ulploadItems.value[prop].mimetype = files[prop].type
  //   ulploadItems.value[prop].size = files[prop].size
  //   ulploadItems.value[prop].status = 'uploading'
  //   ulploadItems.value[prop].progress = 0
  //   const xhr = new XMLHttpRequest()
  //   xhr.open('POST', `${config.API_URL}/media`, true)
  //   xhr.responseType = 'json'

  //   const formData = new FormData()
  //   formData.append('file', files[prop], files[prop].name)
  //   formData.append('folder', selectedFolder.value._id)

  //   xhr.onerror = (error) => {
  //     errorMsg.value += `${error.message}<br>`
  //   }

  //   xhr.upload.onprogress = (event) => {
  //     if (ulploadItems.value[prop].status === 'cancelled' || ulploadItems.value[prop].status === 'failed') {
  //       xhr.abort()
  //     } else {
  //       ulploadItems.value[prop].progress = (100 * event.loaded) / event.total
  //     }
  //   }
  //   xhr.onload = () => {
  //     console.log(xhr.response)

  //     if (xhr.response.status === 'fail') {
  //       if (xhr.response.errorCode == 'not-unique') ulploadItems.value[prop].status = 'duplicate'
  //       else ulploadItems.value[prop].status = 'failed'

  //       xhr.abort()
  //     } else {
  //       ulploadItems.value[prop].status = 'complete'
  //     }
  //   }

  //   xhr.send(formData)
  // }
}

const setPage = async (currentPage) => {
  console.log(currentPage)
  page.value = currentPage
  await fetchMedia()
}

const handleSelectFolder = async (folder) => {
  selectedFolder.value = folder
  page.value = 1
  await fetchMedia()
}

//save folder
const savedFolder = async (newFolder) => {
  const response = await saveDoc('media/folders', newFolder)
  console.log(response)
  if (!response) return
  await fetchFolders()
  // const index = folders.value.findIndex((f) => f.id == response.doc.id)
  // if (index !== -1) folders.value.splice(index, 1, folder)
  // folders.value.push(newFolder)
}

// Toggle folder sort
const toggleFolderSort = async (event) => {
  console.log('EE', event)
  folderSort.field = event.field
  folderSort.order = event.order
  await fetchFolders()
}

// Toggle media sort
const toggleMediaSort = async (event) => {
  mediaSort.field = event.field
  mediaSort.order = event.order
  await fetchMedia()
}

// Add file to selected media
const addToSelectedMedia = (file) => {
  const index = media.value.findIndex((m) => m._id == file._id)
  if (index !== -1 && !selectedMedia.value.find((m) => m._id == file._id)) selectedMedia.value.push(file)
}

// Remove file from selected media
const removeFromSelectedMedia = (file) => {
  const index = selectedMedia.value.findIndex((m) => m._id == file._id)
  if (index !== -1) selectedMedia.value.splice(index, 1)
}

// // Delete media
const deleteMedia = async () => {
  if (!confirm('Are you sure you want to delete these files?')) return
  console.log(selectedMedia.value)
  await Promise.all(
    selectedMedia.value.map(async (item) => {
      response = await deleteDoc('media', item.id)
      console.log(response)
    })
  )
  if (!errorMsg.value) {
    await fetchMedia()
    message.value = 'Media deleted succesfully'
    console.log(message.value)
    selectedMedia.value = []
  }
}

// // Move media to a different folder
const moveMediaToFolder = async (folderId) => {
  console.log('FOL', folderId)
  errorMsg.value = ''
  const folder = folders.value.find((f) => f.id == folderId)
  if (!folder) return
  await Promise.all(
    selectedMedia.value.map(async (item) => {
      // try {
      item.folder = folder
      const response = await saveDoc(`media`, item)
      // if (error.value) throw error.value
      console.log(response)
      // } catch (err) {
      //   console.log(err.data)
      // }
    })
  )

  selectedFolder.value = folder
  // selectedMedia.value = []
  await fetchMedia()
}

// const showMediaDeleteAlert = async () => {
//   showAlert('Are you sure you want to delete these files?', '', 'deleteMedia', true)
// }

const handleSearch = async (searchKeyword) => {
  page.value = 1
  keyword.value = searchKeyword
  await fetchMedia()
}

const setSelectedMedia = () => {
  galleryMedia.value = selectedMedia.value
  showMediaSelector.value = false
}

// const handleCloseUploadModal = async () => {
//   await fetchMedia()
//   showModal.value = false
// }

// const showDeleteFolderAlert = async () => {
//   showAlert(
//     'Are you sure you want to delete this folder?',
//     'If your folder conatains files, you will have to move or delete those files first.',
//     'deleteFolder',
//     true
//   )
// }

const deleteFolder = async () => {
  // errorMsg.value = ''
  // alert.value.show = false
  if (
    !confirm(
      'Are you sure you want to delete this folder?  If your folder contains files, you will have to move or delete those files first.'
    )
  )
    return
  if (media.value.filter((m) => m.folder == selectedFolder.value.id).length)
    return (
      (errorMsg.value =
        'You cannot delete non-empty folders.  Please delete or move all media to another folder before deleting folders.'),
      'Error'
    )
  const response = await deleteDoc('media/folders', selectedFolder.value.id)
  if (!response) return (errorMsg.value = `We were not able to delete folder ${selectedFolder.value.name} deleted`)
  fetchFolders()
  message.value = `Folder ${selectedFolder.value.name} deleted succesfully`
  selectedFolder.value = {}

  // try {
  //   const { data, pending, error } = await useFetch(`${config.API_URL}/media/folders/${selectedFolder.value._id}`, {
  //     method: 'DELETE',
  //   })
  //   if (error.value) throw error.value
  //   console.log(data.value)
  //   const index = folders.value.findIndex((f) => f._id == selectedFolder.value._id)
  //   if (index !== -1) folders.value.splice(index, 1)
  //   selectedFolder.value = {}
  //   message.value = `Folder ${selectedFolder.value.name} deleted succesfully`
  // } catch (err) {
  //   console.log(err)
  // }
}

// const showAlert = (heading, paragraph, action, showCancelBtn) => {
//   alert.value.heading = heading
//   alert.value.paragraph = paragraph
//   alert.value.action = action
//   alert.value.showCancelBtn = showCancelBtn
//   alert.value.show = true
// }

// watch(
//   () => alert.value.show,
//   (currentVal) => {
//     if (currentVal === 'ok' && alert.value.action === 'deleteMedia') deleteMedia()
//     if (currentVal === 'ok' && alert.value.action === 'deleteFolder') deleteFolder()
//   }
// )
await fetchFolders()
await fetchMedia()
</script>

<template>
  <div class="media-uploader flex-col h-full">
    <div class="top">
      <!-- <h3 class="title bg-slate-300 p-2 text-center">Media</h3> -->
      <div class="folders flex-col gap-2 p-2 border-b-stone-300">
        <div class="folder__actions">
          <MediaFolderActions
            :selectedFolder="selectedFolder"
            :folders="folders"
            :media="media"
            :sort="folderSort"
            :sortOptions="folderSortOptions"
            @toggleSort="toggleFolderSort"
            @savedFolder="savedFolder"
            @deleteFolder="deleteFolder"
          />
        </div>
        <div class="forlder__list">
          <MediaFolderList
            v-if="folders.length"
            :folders="folders"
            :selectedFolder="selectedFolder"
            @folderSelected="handleSelectFolder"
          />
        </div>
      </div>
      <div class="file-actions">
        <MediaFileActions
          :folders="folders"
          :selectedMedia="selectedMedia"
          :selectedFolder="selectedFolder"
          :sort="mediaSort"
          :sortOptions="mediaSortOptions"
          @toggleSort="toggleMediaSort"
          @fileUploadBtnClicked="toggleDropZone"
          @moveMediaToFolder="moveMediaToFolder"
          @deleteMedia="deleteMedia"
          @searchKeywordSelected="handleSearch"
          @selectAll="selectedMedia = media"
        />
        <transition name="dropZone">
          <MediaDropZone
            v-show="showDropZone"
            :selectedFolder="selectedFolder"
            @cancelFileUpload="toggleDropZone"
            @uploadItemsSelected="handleUplodMedia"
          />
        </transition>
      </div>
    </div>

    <div class="bottom flex-col justify-between gap-1 flex-1 overflow-auto p-2">
      <MediaFileList
        :media="media"
        :selectedMedia="selectedMedia"
        :selectedFolder="selectedFolder"
        @addToSelectedMedia="addToSelectedMedia"
        @removeFromSelectedMedia="removeFromSelectedMedia"
      />
      <div class="pagination">
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" />
      </div>
    </div>
    <!-- <div v-if="showModal">
      <Modal @closeModal="showModal = false">
        <template #header>
          <h3 class="modal-header">File Upload Progress</h3>
          <div>{{ Math.round(overallFileUploadProgress) }}%</div>
        </template>
        <template #default>
          <div class="modal-content">
            <div class="flex-row justify-between items-center" v-for="(file, index) in ulploadItems" :key="file.name">
              <div>
                <span>{{ file.name }}</span
                ><span>({{ file.status }})</span>
              </div>
              <div class="flex-row gap-2 items-center">
                <span> {{ Math.round(file.progress) }}% </span>
                <IconsProgressRing :progress="file.progress" />
              </div>
              <button
                class="btn btn__primary px-1 py-05"
                v-if="file.progress < 100"
                @click="ulploadItems[index].status = 'cancelled'"
              >
                Cancel
              </button>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="modal-footer flex-row justify-end px-3 py-1">
            <button
              class="btn btn__primary px-2 py-05"
              v-if="overallFileUploadProgress == 100"
              @click="handleCloseUploadModal"
            >
              Close
            </button>
          </div>
        </template>
      </Modal>
    </div> -->
    <div class="actions bg-slate-300 py-2 px-4 flex-row gap-2 justify-end" v-if="route.name !== 'admin-media'">
      <button class="btn btn__secondary cancel px-2 py-1" @click="$emit('mediaSelectCancel')">Cancel</button>
      <button class="btn btn__primary px-2 py-1" @click="setSelectedMedia">Select</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
