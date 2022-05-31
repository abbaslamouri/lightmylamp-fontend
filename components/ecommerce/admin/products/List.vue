<script setup>
const props = defineProps({
  products: {
    type: Array,
  },
  totalCount: {
    type: Number,
  },
})
const emit = defineEmits(['deleteProduct'])

const config = useRuntimeConfig()

const router = useRouter()

const showActionKeys = ref([])

const resetActions = () => {
  for (const prop in props.products) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}

// const handleEditProduct = (slug) => {
//   resetActions()
//   router.push({ name: 'ecommerce-products-slug', params: { slug } })
// }

const deleteProduct = (productId) => {
  emit('deleteProduct', productId)
  resetActions()
}
</script>

<template>
  <table class="text-xs shadow-md">
    <thead>
      <tr class="bg-slate-200">
        <th>Image</th>
        <th>Product</th>
        <th>Price</th>
        <th>Sale Price</th>
        <th>Stock Qty.</th>
        <th>Orders</th>
        <th>Sales</th>
        <th class="text-right min-w-12">actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products" :key="product._id">
        <td class="flex-row justify-center">
          <div class="w-5 h-5">
            <img
              class="w-full hfull contain"
              v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
              :src="`${config.backendUrl}/${product.gallery[0].path}/${product.gallery[0].name}`"
            />
            <img v-else class="w-full hfull contain" :src="`/placeholder.png`" />
          </div>
        </td>
        <td>{{ product.name }}</td>
        <td class=" ">{{ product.price }}</td>
        <td class=" ">{{ product.salePrice }}</td>
        <td class=" ">{{ product.stockQty }}</td>
        <td class=" ">{{ product.orders }}</td>
        <td class=" ">{{ product.sales }}</td>
        <td class="minw12">
          <EcommerceAdminRowActions
            :showAction="showActionKeys[index]"
            :showEdit="true"
            @moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
            @deleteAction="deleteProduct(product.id)"
            @editAction="router.push({ name: 'admin-ecommerce-products-slug', params: { slug: product.slug } })"
            @cancel="resetActions"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped></style>
