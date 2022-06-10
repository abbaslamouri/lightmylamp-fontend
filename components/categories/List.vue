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

const deleteCategory = (categoryId) => {
  emit('deleteCategory', categoryId)
  resetActions()
}
</script>

<template>
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
        @deleteCategory="deleteCategory"
        @editCategory="router.push({ name: 'admin-ecommerce-categories-slug', params: { slug: $event } })"
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

th {
  border-bottom: 1px solid $stone-300;
  padding: 1rem;
}
</style>
