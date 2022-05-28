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
const perPage = ref(4)
const fields = '-updatedAt'
const keyword = ref('')
const sort = reactive({
  field: 'sortOrder',
  order: '',
})

let response = null
const sortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
  { key: 'createAt', name: 'Date Created' },
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

const pages = computed(() =>
  totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
)

const fetchAllCategories = async () => {
  response = await fetchAll('categories', params.value)
  categories.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
  console.log(response)
}

const resetActions = () => {
  for (const prop in categories.value) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
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

// Set current page
const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllCategories()
}

const deleteCategory = async (attributeId) => {
  if (!confirm('Are you sure you want to delete this category? Y')) return
  fetchAllCategories()
  message.value = 'Attributes and attribute terms deleted succesfully'
  resetActions()
}

// const esc = encodeURIComponent
// const query = Object.keys(params.value)
//   .map((k) => esc(k) + '=' + esc(params.value[k]))
//   .join('&')

// console.log('ESC', esc)
// console.log('QUERY', query)

// response = await fetch(`${config.apiUrl}/categories?${query}`, {
//   method: 'GET',
// })
// const jsonRes = await response.json()
// console.log(jsonRes)
// categories.value = jsonRes.docs
// count.value = jsonRes.results
// totalCount.value = jsonRes.totalCount

// onMounted(async () => {
// const { data: categories, pending, refresh, error } = useLazyFetch(`${config.apiUrl}/categories`)
// if (error.value && error.value.data) {
//   console.log('MYERROR', error.value.data)
//   errorMsg.value = ''
//   for (const prop in error.value.data.errors) {
//     errorMsg.value = `${errorMsg.value}<li>${error.value.data.errors[prop].message}</li>`
//   }
//   errorMsg.value = `<ul>${errorMsg.value}</ul>`
// } else {
//   console.log(categories.value)
//   // categories.value = data.value.docs
//   // count.value = data.value.results
//   // totalCount.value = data.value.totalCount
//   // console.log('CAT', categories.value)
// }
// })

// Fetch all
// response = await fetchAll('categories', params.value)

// count.value = response.count
// console.log(categories.value)
// const topLevel = categories.value.filter((c) => !c.parent)
// for (const i in topLevel) {
//   topLevel[i].children = categories.value.filter((c) => c.parent && c.parent._id == topLevel[i]._id)
//   for (const j in topLevel[i].children) {
//     topLevel[i].children[j].children = categories.value.filter(
//       (c) => c.parent && c.parent._id == topLevel[i].children[j]._id
//     )
//     for (const k in topLevel[i].children[j].children)
//       topLevel[i].children[j].children[k].children = categories.value.filter(
//         (c) => c.parent && c.parent._id == topLevel[i].children[j].children[k]._id
//       )
//   }
// }

// categories.value = topLevel
// console.log('PPPPP', categories.value)

// const setPage = async (currentPage) => {
//   page.value = currentPage
//   await fetchAll()
// }

// const handleSearch = async (searchKeyword) => {
//   keyword.value = searchKeyword
//   page.value = 1
//   await fetchAll(params.value)
// }

// const deleteCategory = async (doc) => {
//   const category = categories.value.find((c) => c._id == categoryToDeleteId.value)
//   if (!category)
//     return (errorMsg.value = `We are not able to find a category with this ID: ${categoryToDeleteId.value} `)

//   response = await deleteById('categories', category._id)
//   categoryToDeleteId.value = null
//   alert.value.show = false
//   alert.value.action = ''
//   message.value = `Category ${category.name} deleted succesfully`
//   response = await fetchAll('categories', params.value)
//   categories.value = response.docs
// }

// const showDeleteCategoryAlert = (categoryId) => {
//   categoryToDeleteId.value = categoryId
//   showAlert('Are you sure you want to delete this category?', '', 'deleteCategory', true)
// }

// const showAlert = (heading, paragraph, action, showCancelBtn) => {
//   alert.value.heading = heading
//   alert.value.paragraph = paragraph
//   alert.value.action = action
//   alert.value.showCancelBtn = showCancelBtn
//   alert.value.show = true
// }

// watch(categories, (newCategories) => {
//   console.log('PPPP', newCategories)
//   // Because posts starts out null, you won't have access
//   // to its contents immediately, but you can watch it.
// })

// watch(
//   () => alert.value.show,
//   (currentVal) => {
//     if (currentVal === 'ok' && alert.value.action === 'deleteCategory') deleteCategory()
//   }
//   // { deep: true }
// )

await fetchAllCategories()
</script>

<template>
  <div class="p-3">
    <Title>{{ title }}</Title>
    <div class="flex-col items-center gap-3">
      <header class="flex-row items-center justify-between w-full">
        <h3 class="title">Categories</h3>
        <NuxtLink :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: 'new' } }">
          <button class="btn btn__primary btn__pill px-2 py-05">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header>
      <main class="flex-1 max-width-130 w-full flex-col gap-3">
        <div class="flex-col gap-3 flex-col br-5">
          <div class="flex-row items-center gap-3" v-if="totalCount">
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
    </div>
    <footer class="w-full max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </footer>
  </div>
</template>

<style lang="scss" scoped></style>
