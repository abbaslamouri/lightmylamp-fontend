<script setup>
// useMeta({
//   title: 'Category | YRL',
// })
definePageMeta({
  layout: 'admin',
})

const pageTitle = ref('Category | YRL')
const config = useRuntimeConfig()

// const { category } = useStore()
const {
  errorMsg,
  message,
  // galleryMedia,
  // mediaReference,
  // showMediaSelector,
  // fetchBySlug,
  // fetchAll,
  // saveDoc,
  // saveDocs,
  // deleteMany,
} = useAppState()

const route = useRoute()
const router = useRouter()
const categories = ref([])
const category = ref({ gallery: [] })
const showDropZone = ref(false)
// const imageGallery = ref([])
const galleryIntro = ref('This image gallery contains all images associated with this category.')

let response = null
const slug = route.params.slug === ' ' ? null : route.params.slug

// const response = await fetch(`${config.apiUrl}/media/`, {
//     method: 'POST',
//     body: formData,
//   })
//   const jsonRes = await response.json()
//   console.log(jsonRes)

const { data, pending, error } = await useFetch(`${config.apiUrl}/categories/`, {
  method: 'GET',
})
if (error.value && error.value.data) {
  console.log('MYERROR', error.value.data)
  errorMsg.value = ''
  for (const prop in error.value.data.errors) {
    errorMsg.value = `${errorMsg.value}<li>${error.value.data.errors[prop].message}</li>`
  }
  errorMsg.value = `<ul>${errorMsg.value}</ul>`
} else {
  categories.value = data.value.docs
  // category.value = {}
  // const xx = categories.value.find((c) => {
  //   console.log('1', c.slug)
  //   console.log('2', slug)
  //   return c.slug == slug
  // })
  // ? categories.value.find((c) => c.slug == slug) : {}
  console.log(categories.value)
  // console.log(category.value)
}

const { data: temp } = await useFetch(`${config.apiUrl}/categories/`, {
  method: 'GET',
  params: { slug },
})
if (error.value && error.value.data) {
  console.log('MYERROR', error.value.data)
  errorMsg.value = ''
  for (const prop in error.value.data.errors) {
    errorMsg.value = `${errorMsg.value}<li>${error.value.data.errors[prop].message}</li>`
  }
  errorMsg.value = `<ul>${errorMsg.value}</ul>`
} else {
  if (temp.value.docs[0]) category.value = temp.value.docs[0]
  // category.value = {}
  // const xx = categories.value.find((c) => {
  //   console.log('1', c.slug)
  //   console.log('2', slug)
  //   return c.slug == slug
  // })
  // ? categories.value.find((c) => c.slug == slug) : {}
  console.log(category.value)
  // console.log(category.value)
}

// category.value = await fetchBySlug('categories', slug)
// console.log(category.value)
// categories.value = (await fetchAll('categories', {})).docs
// console.log(categories.value)

const saveCategory = async () => {
  // console.log(category.value)
  if (!category.value.name) return (errorMsg.value = 'Category name is required')
  // const response = await fetch(`${config.apiUrl}/media/`, {
  //   method: 'POST',
  //   body: formData,
  // })
  // const jsonRes = await response.json()
  // console.log(jsonRes)
  // category.value.slug = slugify(category.value.name, { lower: true })
  // if (!category.value.permalink) category.value.permalink = slugify(category.value.name, { lower: true })
  // let response = null
  if (category.value.id)
    response = await useFetch(`${config.apiUrl}/categories/${category.value.id}`, {
      method: 'PATCH',
      body: category.value,
    })
  else
    response = await useFetch(`${config.apiUrl}/categories`, {
      method: 'POST',
      body: category.value,
    })
  const { data, pending, error } = response
  if (error.value && error.value.data) {
    console.log('MYERROR', error.value.data)
    errorMsg.value = ''
    for (const prop in error.value.data.errors) {
      errorMsg.value = `${errorMsg.value}<li>${error.value.data.errors[prop].message}</li>`
    }
    errorMsg.value = `<ul>${errorMsg.value}</ul>`
  } else {
    // console.log('DDDDDD', data.value)
    // console.log('KKKKK', data.value.doc)
    // category.value = data.value.doc
    router.push({ name: 'admin-ecommerce-categories' })
    message.value = 'Category saved succesfully'
  }
  // const response = await saveDoc('categories', category.value)
  // console.log('SAVE', data.value)
  // if (!response) return

  // message.value = 'Category saved succesfully'

  // if (!category.value.name) return (state.value.errorMsg = 'Category name is required')
  // category.value.slug = slugify(category.value.name, { lower: true })
  // if (!category.value.permalink) category.value.permalink = slugify(category.value.name, { lower: true })
  // await saveDoc(category.value)
  // router.push({ name: 'admin-ecommerce-categories' })
}

const setImageGallery = async (gallery) => {
  console.log('GAL', gallery)
  if (!gallery.length) return
  const formData = new FormData()
  for (const prop in gallery) {
    formData.append('gallery', gallery[prop])
  }

  // for (const prop in category.value) {
  //   console.log(prop)
  //   if (prop !== '_id' && prop !== 'id' && prop !== 'gallery') {
  //     formData.append(prop, category.value[prop])
  //   }
  // }
  // if (!category.value.id) {
  console.log('HHHHHH')
  try {
    const response = await fetch(`${config.apiUrl}/media/`, {
      method: 'POST',
      body: formData,
    })
    const jsonRes = await response.json()
    console.log(jsonRes)
    if (jsonRes.status == 'error' || jsonRes.status == 'fail') {
      let httpErrorMsg = ''
      for (const prop in jsonRes.errors) {
        httpErrorMsg = `${httpErrorMsg}<li>${jsonRes.errors[prop].message}</li>`
      }
      httpErrorMsg = `<ul>${httpErrorMsg}</ul>`
      console.log(httpErrorMsg)
      throw httpErrorMsg
    }
    for (const prop in jsonRes.media) {
      category.value.gallery.push(jsonRes.media[prop])
    }
  } catch (err) {
    errorMsg.value = err
  } finally {
    showDropZone.value = false
  }
}

// const handleNewMediaSelectBtnClicked = () => {
//   category.value.referenceMedia = 'categoryMedia'
//   category.value.showMediaSelector = true
// }

// const selectMediaGallery = async (media) => {
//   if (!category.value.gallery) category.value.gallery = []
//   for (const prop in media) {
//     const index = category.value.gallery.findIndex((el) => el._id === media[prop]._id)
//     if (index === -1) {
//       category.value.gallery.push(media[prop])
//     }
//   }
// }

// watch(
//   () => galleryMedia.value,
//   (currentVal) => {
//     console.log(currentVal)
//     if (mediaReference.value === 'productMedia') setImageGallery(currentVal)
//     // store.showMediaSelector = false
//     // store.galleryMedia = []
//   },
//   { deep: true }
// )

// watch(
//   () => category.value.selectedMedia,
//   (currentVal) => {
//     console.log(currentVal)
//     if (state.value.referenceMedia === 'categoryMedia') selectMediaGallery(currentVal)
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="hfull flex-col items-center gap-2 p-3">
    <Title>{{ pageTitle }}</Title>
    <header class="flex-col gap-2 w-full max-width-130">
      {{ category }}
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
          <div class="flex-row items-center justify-between text-sm mb-1">
            <div class="uppercase inline-block border-b-stone-300 font-bold pb05">Image Gallery</div>
            <div></div>
          </div>
          <div class="flex-col flex-col items-center gap-2">
            <div class="intro flex-row items-center gap-1 bg-slate-200 py-1 px-2 br-3 text-sm" v-if="galleryIntro">
              <IconsInfo class="w-3 h-3 fill-sky-600" />
              <p>{{ galleryIntro }}</p>
            </div>
            <EcommerceAdminImageGallery
              :gallery="category.gallery"
              :galleryIntro="galleryIntro"
              galleryType="product"
              @removeGalleryImage="category.gallery.splice($event, 1)"
              @setGalleryImage="category.gallery[$event.index] = $event.value"
            />
            <div class="w-full flex-col items-center gap-2">
              <button class="btn btn__image-select" @click.prevent="showDropZone = true">
                <IconsImage />
                <span> Select New Images </span>
              </button>
              <EcommerceDropZone
                v-if="showDropZone"
                class="w-full"
                @hideDropZone="showDropZone = false"
                @mediaSelected="setImageGallery"
              />
            </div>
            <p class="text-sm">PNG, JPG, and GIF Accepted</p>
          </div>
        </section>
      </div>
      <div class="right-col">
        <EcommerceAdminCategoriesCategoryRightNav
          :categories="categories"
          :category="category"
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
