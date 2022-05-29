<script setup>
definePageMeta({
  layout: 'admin',
})
const title = ref('Attributes | YRL')

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, deleteDoc, deleteDocs } = useHttp()

const attributes = ref([])
const totalCount = ref(0) // Total item count in the database
const count = ref(0)
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

const fetchAllAttributes = async () => {
  response = await fetchAll('attributes', params.value)
  attributes.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
  console.log(response)
}

const resetActions = () => {
  for (const prop in attributes.value) {
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
  await fetchAllAttributes()
}

const toggleSort = async (event) => {
  sort.field = event.field
  sort.order = event.order
  await fetchAllAttributes()
}

// Set current page
const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllAttributes()
}

const addNewAttribute = () => {
  attributes.value.push({ name: '', sortOrder: 0, terms: [] })
}

const deleteAttribute = async (attributeId) => {
  if (
    !confirm(
      'Are you sure you want to delete this attribute? You must also delete all the product variants associated with this term'
    )
  )
    return
  if (await deleteDoc('attributes', attributeId)) {
    response = await deleteDocs('attributeterms', { parent: attributeId })
    console.log('DAT', response)
    if (response.deletedCount || response.deletedCount == 0) {
      fetchAllAttributes()
      message.value = 'Attributes and attribute terms deleted succesfully'
    }
  }
  resetActions()
}

const deleteTerm = async (termId) => {
  if (
    !confirm(
      'Are you sure you want to delete this term? You must also delete all the product variants associated with this term'
    )
  )
    return
  errorMsg.value = ''
  message.value = ''
  try {
    response = await fetch(`${config.apiUrl}/attributeterms/${termId}`, {
      method: 'DELETE',
    })
  } catch (err) {
    console.log(err)
    errorMsg.value = err.message ? err.message : err.data && err.data.message ? err.data.message : ''
  }
  fetchAllAttributes()
}

await fetchAllAttributes()
</script>

<template>
  <div class="h-full flex-col items-center gap-2 p-3">
    <Title>{{ title }}</Title>
    <div class="flex-row items-center justify-between w-full max-w-130">
      <h3>Attributes</h3>
      {{ page }}
      <button class="btn btn__primary btn__pill px-2 py-05 flex-row" @click="addNewAttribute">
        <IconsPlus class="w-2 h-2" />
        Add New
      </button>
    </div>
    <div class="flex-1 max-w-130 w-full flex-col gap-3">
      <div class="flex-col gap-2 br-5" v-if="totalCount">
        <div class="flex-row items-center gap-3">
          <Search class="flex-1" @searchKeywordSelected="handleSearch" />
          <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="toggleSort" />
        </div>
        <table class="shadow-md border border-slate-300">
          <thead class="bg-slate-300">
            <tr>
              <th>order</th>
              <th>Attribute Name</th>
              <th>Attribute Terms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <EcommerceAdminAttributesCard
              v-for="(attribute, index) in attributes"
              :key="attribute._id"
              :attribute="attribute"
              :index="index"
              :showAction="showActionKeys[index]"
              @setActions="setActions"
              @attributeUpdated="fetchAllAttributes"
              @deleteAttribute="deleteAttribute"
              @deleteTerm="deleteTerm"
            />
          </tbody>
        </table>
        <div class="text-center p-2 text-lg" v-if="!attributes.length">No results found</div>
      </div>
      <EcommerceAdminEmptyMsg v-else>
        <template #header>Add attributes</template>
        <template #default>
          <div class="">Create attrubutes and attribute terms</div>
          <NuxtLink
            class="btn btn__primary btn__pill px-3 py-05 text-xs items-self-end"
            :to="{ name: 'admin-ecommerce-categories-slug', params: { slug: '_' } }"
          >
            <IconsPlus class="w2 h2" />
            <span>Add</span>
          </NuxtLink>
        </template>
      </EcommerceAdminEmptyMsg>
    </div>
    <div class="w-full max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
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
