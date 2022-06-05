<script setup>
definePageMeta({
  layout: 'admin',
})
const title = ref('Categories | YRL')

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, deleteDoc, deleteDocs } = useHttp()

const categories = ref([])
const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params
const showActionKeys = ref([])
const page = ref(1)
const perPage = ref(5)
const fields = '-updatedAt'
const keyword = ref('')
const sort = reactive({
  field: 'createdAt',
  order: '-',
})

let response = null
const sortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
  { key: 'createdAt', name: 'Date Created' },
]

const params = computed(() => {
  const params = {
    fields,
    page: page.value,
    limit: perPage.value,
    sort: `${sort.order}${sort.field}, _id `,
    keyword: keyword.value ? keyword.value : null,
  }
  if (!keyword.value) delete params.keyword
  return params
})

const pages = computed(() => {
  return totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
})

const fetchAllCategories = async () => {
  response = await fetchAll('categories', params.value)
  categories.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAllCategories()
}

const toggleSort = async (event) => {
  sort.field = event.field
  sort.order = event.order
  await fetchAllCategories()
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllCategories()
}

const deleteCategory = async (categoryId) => {
  if (!confirm('Are you sure you want to delete this category?')) return
  if (!(await deleteDoc('categories', categoryId))) return
  const category = categories.value.find((c) => c.id == categoryId)
  fetchAllCategories()
  message.value = `Category ${category.name} deleted succesfully`
}

await fetchAllCategories()
</script>

<template>
  <div class="flex-1 flex-col p-3">
    <Title>{{ title }}</Title>
    <div class="flex-1 flex-col justify-between gap-3" v-if="totalCount">
      <header class="flex-row items-center justify-between w-full">
        <h3 class="title">Categories</h3>
        <NuxtLink :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: '_' } }">
          <button class="btn btn__primary btn__pill px-2 py-05">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header>
      <main class="flex-1 max-width-130 w-full flex-col gap-3">
        <div class="flex-col gap-3 flex-col br-5">
          <div class="flex-row gap-3" v-if="totalCount">
            <Search class="flex-1" @searchKeywordSelected="handleSearch" />
            <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="toggleSort" />
          </div>
          <EcommerceAdminCategoriesList
            :categories="categories"
            :totalCount="totalCount"
            @deleteCategory="deleteCategory"
          />
        </div>
      </main>
      <footer class="w-full max-width-130">
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" />
      </footer>
    </div>
    <EcommerceAdminEmptyMsg v-else>
      <template #header>Add categories and subcategories</template>
      <template #default>
        <div class="">Create nested product categories with category images and descriptions</div>
        <NuxtLink
          class="btn btn__primary btn__pill px-3 py-05 text-xs items-self-end"
          :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: '_' } }"
        >
          <IconsPlus class="w-2 h-2" />
          <span>Add</span>
        </NuxtLink>
      </template>
    </EcommerceAdminEmptyMsg>
  </div>
</template>

<style lang="scss" scoped></style>
