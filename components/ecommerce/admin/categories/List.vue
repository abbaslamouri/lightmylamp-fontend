<script setup>
const props = defineProps({
  categories: {
    type: Array,
  },
  totalCount: {
    type: Number,
  },
})
const emit = defineEmits(['deleteCategory'])
const config = useRuntimeConfig()
const router = useRouter()

const showActionKeys = ref([])

// const showActionKeys = ref([])
const showActions = ref(true)
const editAction = ref(false)

const resetActions = () => {
  for (const prop in props.categories) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}
const handleEditProduct = (slug) => {
  resetActions()
  router.push({ name: 'ecommerce-categories-slug', params: { slug } })
}

const deleteCategory = (categoryId) => {
  resetActions()
  emit('deleteCategory', categoryId)
}
</script>

<template>
  <div>
    <div v-if="totalCount">
      <table class="text-xs shadow-md">
        <thead>
          <tr class="bg-slate-200">
            <th>Order</th>
            <th>Image</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Parent</th>
            <th class="text-right min-w-12">actions</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <EcommerceAdminCategoriesCard
            v-for="(category, index) in categories"
            :key="category._id"
            :category="category"
            :index="index"
            :showAction="showActionKeys[index]"
            @setActions="setActions"
            @deletecategory="deleteCategory"
          />
        </tbody>
      </table>
    </div>
    <div v-else class="h-60vh flex-row items-center justify-center shadow-md">
      <div class="empty-categories flex-col gap-2 bg-slate-50 p-4 br-5">
        <h3 class="">Add categories and subcategories</h3>
        <div class="">Create nested product categories with category images and descriptions</div>
        <NuxtLink
          class="btn btn__primary btn__pill px-3 py-05 text-xs items-self-end"
          :to="{ name: 'index', params: { slug: ' ' } }"
        >
          <IconsPlus class="w2 h2" />
          <span>Add</span>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="h-60vh flex-row items-center justify-center shadow-md">
      <div class="empty-categories flex-col gap-2 bg-slate-50 p-4 br-5">
        <h3 class="">Add categories and subcategories</h3>
        <div class="">Create nested product categories with category images and descriptions</div>
        <NuxtLink
          class="btn btn__primary btn__pill px-3 py-05 text-xs items-self-end"
          :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: ' ' } }"
        >
          <IconsPlus class="w-2 h-2" />
          <span>Add</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

th {
  border-bottom: 1px solid $stone-300;
  padding: 1rem;
}
</style>
