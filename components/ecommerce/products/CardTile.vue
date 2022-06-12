<script setup>
const props = defineProps({
  product: {
    type: Object,
  },
  showQuantitySelector: {
    type: Boolean,
  },
})

const emit = defineEmits([
  'selectQuantityBtnClicked',
  'closeSelectQuantity',
  'toggleQuantitySelectors',
  'resetSelectQuantities',
])

const config = useRuntimeConfig()

const router = useRouter()

// const showQuantitySelector = ref(false)

const getcartItemCount = () => {
  // if (cart.value.items && cart.value.items.length) {
  //   const found = cart.value.items.find((i) => i.product._id == props.product._id)
  //   return found ? found.quantity : 0
  // }
  return 0
}
</script>
<template>
  <div>
    <div class="flex-row gap items-center gap-2 border border-slate-400 p-1 mt--1">
      <div class="w-14 h-14 justify-center items-center overflow-hidden">
        <NuxtLink class="" :to="{ name: 'ecommerce-products-slug', params: { slug: product.slug } }">
          <img
            class="w-full h-full cover br-3 scale"
            v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
            :src="`${config.backendUrl}/${product.gallery[0].path}`"
          />
        </NuxtLink>
      </div>
      <div class="flex-1 flex-col gap-2 p-2 justify-between items-self-stretch">
        <div>
          <NuxtLink class="" :to="{ name: 'ecommerce-products-slug', params: { slug: product.slug } }">
            <div class="font-bold">{{ product.name }}</div>
          </NuxtLink>
          <div class="">{{ product.description }}</div>
        </div>
        <div>
          <div class="text-yellow-700 font-bold text-md">${{ product.price }}</div>
        </div>
      </div>
      <div>
        <NuxtLink
          class="btn btn__primary px-2 py-05 text-xs items-self-end"
          :to="{ name: 'ecommerce-products-slug', params: { slug: product.slug } }"
        >
          <span>View&nbsp;Details</span>
          <IconsArrowEast class="w-4 h-4 fill-slate-50" />
        </NuxtLink>

        <!-- <EcommerceQuantitySelector
          parentComponent="cart"
          :product="product"
          :minVal="0"
          :maxVal="4"
          :stepVal="1"
          :btnText="getcartItemCount()"
          :showQuantitySelector="showQuantitySelector"
          @toggleQuantitySelectors="$emit('toggleQuantitySelectors', $event)"
          @cancel="$emit('resetSelectQuantities')"
        /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

img {
  transform: scale(102%);
}
</style>
