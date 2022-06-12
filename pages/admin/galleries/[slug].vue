<script setup>
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('Slider | YRL')

const config = useRuntimeConfig()
const { errorMsg, message, galleryMedia, mediaReference } = useAppState()
const { fetchAll, saveMedia, saveDoc } = useHttp()
const route = useRoute()
const router = useRouter()

// const sliders = ref([])
// const gallery = ref()
const showDropZone = ref(false)
const galleryIntro = ref('This image gallery contains all images associated with this gallery.')

let response = null
const gallery = useState('gallery', () => {
  return { sortOrder: 0, gallery: [] }
})
const slug = route.params.slug === '_' ? null : route.params.slug

response = await fetchAll('galleries', { slug })
console.log(response)
if (response.docs.length) gallery.value = response.docs[0]
// else gallery.value = { sortOrder: 0, gallery: [] }

// response = await fetchAll('sliders')
// sliders.value = response.docs

console.log(gallery.value)

const addImagesToGallery = async (images) => {
  if (!images.length) return
  for (const prop in images) {
    const i = gallery.value.gallery.findIndex((m) => m.id == images[prop].id)
    if (i === -1) gallery.value.gallery.push(images[prop])
  }
}

const saveGallery = async () => {
  if (!gallery.value.name) return (errorMsg.value = 'Gallery name is required')
  response = await saveDoc('galleries', gallery.value)
  console.log(response)
  if (!response) return
  router.push({ name: 'admin-galleries' })
}

watch(
  () => galleryMedia.value,
  (currentVal) => {
    if (mediaReference.value === 'galleryMedia') addImagesToGallery(currentVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="hfull flex-col items-center gap-2 p-3">
    <Title>{{ pageTitle }}</Title>
    <header class="flex-col gap-2 w-full max-width-130">
      <!-- {{ gallery }} -->
      <div class="go-back" id="product-go-back">
        <NuxtLink class="link" :to="{ name: 'admin-galleries' }">
          <IconsArrowWest />
          <span>Gallery</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Gallery</h3>
    </header>
    <!-- {{ product }} -->
    <main class="main flex-1 max-width-130 w-full">
      <div class="center-col flex-col gap-2">
        <AdminGalleriesDetails />
        <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
          <AdminImageGallery
            :gallery="gallery.gallery"
            :galleryIntro="galleryIntro"
            mediaReference="galleryMedia"
            @removeGalleryImage="gallery.gallery.splice($event, 1)"
            @setGalleryImage="gallery.gallery[$event.index] = $event.value"
          />
        </section>
      </div>
      <div class="right-col">
        <AdminGalleriesRightNav :gallery="gallery" @saveGallery="saveGallery" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

main {
  display: grid;
  grid-template-columns: 1fr 30rem;
  gap: 2rem;
  align-items: flex-start;

  .center-col {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .right-col {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}
</style>
