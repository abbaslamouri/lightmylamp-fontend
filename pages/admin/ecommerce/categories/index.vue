<script setup>
definePageMeta({
  layout: 'admin',
})
const title = ref('Categories | YRL')

const config = useRuntimeConfig()

// const router = useRouter()
const { errorMsg, message } = useAppState()

const categories = ref([])
const categoryToDeleteId = ref(null)
const count = ref(null) // item count taking into account params
const totalCount = ref(null) // Total item count in the database
const keyword = ref('')
const page = ref(1)
const perPage = ref(4)
const sortField = ref('createdAt')
const sortOrder = ref('-')
let response = null

const pages = computed(() =>
  totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
)

const params = computed(() => {
  return {
    page: page.value,
    limit: perPage.value,
    sort: `${sortOrder.value}${sortField.value}`,
    keyword: keyword.value,
  }
})

const esc = encodeURIComponent
const query = Object.keys(params.value)
  .map((k) => esc(k) + '=' + esc(params.value[k]))
  .join('&')

console.log('ESC', esc)
console.log('QUERY', query)

response = await fetch(`${config.apiUrl}/categories?${query}`, {
  method: 'GET',
})
const jsonRes = await response.json()
console.log(jsonRes)
categories.value = jsonRes.docs
count.value = jsonRes.results
totalCount.value = jsonRes.totalCount

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

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll()
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAll(params.value)
}

const deleteCategory = async (doc) => {
  const category = categories.value.find((c) => c._id == categoryToDeleteId.value)
  if (!category)
    return (errorMsg.value = `We are not able to find a category with this ID: ${categoryToDeleteId.value} `)

  response = await deleteById('categories', category._id)
  categoryToDeleteId.value = null
  alert.value.show = false
  alert.value.action = ''
  message.value = `Category ${category.name} deleted succesfully`
  response = await fetchAll('categories', params.value)
  categories.value = response.docs
}

const showDeleteCategoryAlert = (categoryId) => {
  categoryToDeleteId.value = categoryId
  showAlert('Are you sure you want to delete this category?', '', 'deleteCategory', true)
}

const showAlert = (heading, paragraph, action, showCancelBtn) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(categories, (newCategories) => {
  console.log('PPPP', newCategories)
  // Because posts starts out null, you won't have access
  // to its contents immediately, but you can watch it.
})

// watch(
//   () => alert.value.show,
//   (currentVal) => {
//     if (currentVal === 'ok' && alert.value.action === 'deleteCategory') deleteCategory()
//   }
//   // { deep: true }
// )
</script>

<template>
  <div class="p-3">
    <Title>{{ title }}</Title>
    {{ pages }}---{{ count }}===={{ totalCount }}
    <!-- <div v-if="!pending"> -->
    <div class="flex-col items-center gap-2">
      <header class="flex-row items-center justify-between w-full">
        <h3 class="title">Categories</h3>
        <NuxtLink :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: 'new' } }">
          <button class="btn btn__primary btn__pill px-2 py-05">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header>
      <main class="flex-1 max-width-130 w-full flex-col gap3">
        <div class="flex-col gap3 flex-col br5">
          <div class="border-b-slate-300 p2" v-if="totalCount">
            <Search @searchKeywordSelected="handleSearch" />
          </div>
          <EcommerceAdminCategoriesList
            :categories="categories"
            :totalCount="totalCount"
            @deleteCategory="showDeleteCategoryAlert"
          />
        </div>
      </main>
    </div>
    <!-- </div> -->
    <!-- <div v-else>loading ...</div> -->
    <footer class="w-full max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </footer>
  </div>
</template>

<style lang="scss" scoped></style>
