<script setup>
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('Category | YRL')

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, saveMedia, saveDoc } = useHttp()
const route = useRoute()
const router = useRouter()

const categories = ref([])
const category = ref()
const showDropZone = ref(false)
const galleryIntro = ref('This image gallery contains all images associated with this category.')

let response = null
const slug = route.params.slug === '_' ? null : route.params.slug

response = await fetchAll('categories', { slug })
if (!slug) category.value = { gallery: [] }
else category.value = response.docs[0]

response = await fetchAll('categories')
categories.value = response.docs

const addImagesToGallery = async (gallery) => {
  if (!gallery.length) return
  const formData = new FormData()
  for (const prop in gallery) {
    formData.append('gallery', gallery[prop])
  }
  response = await saveMedia(formData)
  console.log(response)
  if (!Object.values(response).length) return
  for (const prop in response.media) {
    category.value.gallery.push(response.media[prop])
  }
}

const SetCategoryParent = (parentId) => {
  const index = categories.value.findIndex((c) => c.id == parentId)
  if (index !== -1) category.value.parent = categories.value[index]
}

const saveCategory = async () => {
  if (!category.value.name) return (errorMsg.value = 'Category name is required')
  response = await saveDoc('categories', category.value)
  console.log(response)
  if (!Object.values(response).length) return
  router.push({ name: 'admin-ecommerce-categories' })
}
</script>

<template>
  <div class="hfull flex-col items-center gap-2 p-3">
    <Title>{{ pageTitle }}</Title>
    <header class="flex-col gap-2 w-full max-width-130">
      <!-- {{ category }} -->
      <div class="go-back" id="product-go-back">
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories' }">
          <IconsArrowWest />
          <span>Categories</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Category</h3>
    </header>
    <!-- {{ product }} -->
    <main class="main flex-1 max-width-130 w-full">
      <div class="center-col flex-col gap-2">
        <EcommerceAdminCategoriesDetails :category="category" @updateDetails="category = { ...category, ...$event }" />
        <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
          <EcommerceAdminImageGallery
            :gallery="category.gallery"
            :galleryIntro="galleryIntro"
            @removeGalleryImage="category.gallery.splice($event, 1)"
            @setGalleryImage="category.gallery[$event.index] = $event.value"
            @mediaSelected="addImagesToGallery"
          />
        </section>
      </div>
      <div class="right-col">
        <EcommerceAdminCategoriesCategoryRightNav
          :categories="categories"
          :category="category"
          @updateParent="SetCategoryParent"
          @saveCategory="saveCategory"
        />
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
