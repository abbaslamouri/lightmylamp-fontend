<script setup>
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('Product | YRL')

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, saveMedia, saveDoc, deleteDocs } = useHttp()
const route = useRoute()
const router = useRouter()

// const product = ref()
const showAttributesSlideout = ref(false)
const showVariantsSlideout = ref(false)
const showDropZone = ref(false)
const galleryIntro = 'This image gallery contains all images associated with this product including its variants.'
let response = null
const product = useState('product', () => {
  return { productType: 'variable', gallery: [], categories: [], attributes: [], variants: [] }
})
const slug = route.params.slug === '_' ? null : route.params.slug

if (slug) {
  response = await fetchAll('products', { slug })
  if (response.docs) product.value = response.docs[0]
  if (product.value.id) {
    response = await fetchAll('variants', { product: product.value.id })
    if (response.docs) product.value.variants = response.docs
  }
}
const setImageGallery = async (gallery) => {
  if (!gallery.length) return
  const formData = new FormData()
  for (const prop in gallery) {
    formData.append('gallery', gallery[prop])
  }
  response = await saveMedia(formData)
  console.log(response)
  if (!Object.values(response).length) return
  for (const prop in response.media) {
    product.value.gallery.push(response.media[prop])
  }
}
console.log(product.value)

const saveProduct = async () => {
  console.log(product.value)
  if (!product.value.name) return (errorMsg.value = 'Product name is required')
  // const id = product.value.id ? product.value.id : null
  const newProduct = await saveDoc('products', product.value)
  console.log('newProduct', newProduct)
  if (!Object.values(newProduct).length) return
  // slug = newProduct.slug
  message.value = 'product saved succesfully'
  // response = await deleteDocs('variants', { product: newProduct.id })
  // if (!response) return
  // if (product.value.variants.length) response = await $saveDoc('variants', product.value.variants)
  router.push({ name: 'admin-ecommerce-products-slug', params: { slug: newProduct.slug } })
  message.value = 'product saved succesfully'
  // response = await $fetchBySlug('products', slug)
  // if (response) product.value = response
}

// const handleNewMediaSelectBtnClicked = () => {
//   mediaReference.value = 'productMedia'
//   showMediaSelector.value = true
// }

// Set category gallery
// const setImageGallery = async (media) => {
//   // console.log('mediap', media)
//   // console.log(product.value)
//   for (const prop in media) {
//     const index = product.value.gallery.findIndex((el) => el._id == media[prop]._id)
//     if (index === -1) {
//       product.value.gallery.push(media[prop])
//     }
//   }
//   // console.log(product.value.gallery)
// }

// watch(
//   () => galleryMedia.value,
//   (currentVal) => {
//     console.log(currentVal)
//     if (mediaReference.value === 'productMedia') setImageGallery(currentVal)
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="hfull flex-col items-center gap-2 p-3">
    <Title>{{ pageTitle }}</Title>
    <!-- {{ product }} -->
    <header class="flex-col gap-2 w-full max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'admin-ecommerce-products' }">
          <IconsArrowWest /><span>Products</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Product</h3>
    </header>
    <main class="main flex-1 max-width-130 w-full">
      <div class="left-sidebar shadow-md">
        <EcommerceAdminProductLeftSidebar :product="product" />
      </div>
      <div class="flex-col gap-2">
        <EcommerceAdminProductGeneralInfo
          :product="product"
          @updateGeneralInfo="product.value = { ...product.value, ...$event }"
        />
        <EcommerceAdminProductPrice :product="product" @updatePrice="product.value = { ...product.value, ...$event }" />
        <EcommerceAdminProductStockManagement
          :product="product"
          @updateStock="product.value = { ...product.value, ...$event }"
        />
        <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
          <EcommerceAdminImageGallery
            :gallery="product.gallery"
            :galleryIntro="galleryIntro"
            @removeGalleryImage="product.gallery.splice($event, 1)"
            @setGalleryImage="product.gallery[$event.index] = $event.value"
            @mediaSelected="setImageGallery"
          />
        </section>
        <EcommerceAdminProductAttributesContent
          v-if="product.id && product.productType === 'variable'"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
        />
        <EcommerceAdminProductAttributesSlideout
          v-if="showAttributesSlideout"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
          @saveAttributes="saveProduct"
        />

        <EcommerceAdminProductVariantsContent
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          v-if="product.id && product.productType === 'variable' && product.attributes.length"
        />
        <EcommerceAdminProductVariantsSlideout
          v-if="showVariantsSlideout"
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          @saveVariants="saveProduct"
        />
        <!-- <EcommerceProductDetails :product="product" @updateDetails="product.value = { ...product.value, ...$event }" /> -->

        <!-- <EcommerceProductShippingOptions :product="product" /> -->
        <!-- <EcommerceProductDigitalDelivery :product="product" /> -->
        <!-- <EcommerceProductExtraFields :product="product" /> -->
        <!-- <EcommerceProductSeo :product="product" /> -->
        <!-- <EcommerceProductMisc :product="product" /> -->
      </div>
      <div class="right-sidebar">
        <EcommerceAdminProductRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" />
      </div>
    </main>
    <div class="w-full flex-row justify-end px-4 sticky bottom-4 go-to-top">
      <a href="#product-go-back" class="btn btn__secondary px-2 py-1">Go To Top</a>
    </div>
    <!-- <footer class="w-full max-width-130 bg-slate-300 px-2 py-1 br-5 flex-row justify-center text-2xl">Footer</footer> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.main {
  display: grid;
  grid-template-columns: 18rem 1fr 25rem;
  gap: 2rem;
  align-items: flex-start;

  .left-sidebar {
    position: sticky;
    top: 10rem;
    background-color: white;
    border: 1px solid $slate-100;
    border-radius: 3px;
    padding: 2rem 0.5rem;
  }

  .right-sidebar {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

// .go-to-top {
//   position: sticky;
//   bottom: 4rem;
// }
</style>
