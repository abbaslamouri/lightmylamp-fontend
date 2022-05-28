<script setup>
// useMeta({
//   title: 'Attributes | YRL',
// })
definePageMeta({
  layout: 'admin',
})

const title = ref('Attributes | YRL')

const config = useRuntimeConfig()
const { errorMsg, message, alert } = useAppState()
// const { $fetchAll } = useNuxtApp()
const showActionKeys = ref([])
const attributes = ref([])
const termToDeleteId = ref('')
const attributeToDeleteId = ref('')
const totalCount = ref(0) // Total item count in the database
const count = ref(0)
const keyword = ref('')
const page = ref(1)
const perPage = ref(3)
const sort = reactive({
  field: 'sortOrder',
  order: '',
})
let response = null

const fields = '-updatedAt'
const sortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'name' },
  { key: 'createAt', name: 'Date Created' },
]

const params = computed(() => {
  const params = {
    fields,
    page: page.value,
    limit: perPage.value,
    sort: `${sort.order}${sort.field}`,
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

// const esc = encodeURIComponent
// const query = Object.keys(params.value)
//   .map((k) => esc(k) + '=' + esc(params.value[k]))
//   .join('&')

// console.log('ESC', esc)
// console.log('QUERY', query)

// response = await fetch(`${config.apiUrl}/attributes?${query}`, {
//   method: 'GET',
// })
// const jsonRes = await response.json()
// console.log(jsonRes)
// attributes.value = jsonRes.docs
// count.value = jsonRes.results
// totalCount.value = jsonRes.totalCount

const fetchAll = async () => {
  // const response = await $fetchAll('attributes', params.value)
  // attributes.value = response.docs
  // totalCount.value = response.totalCount
  // console.log(attributes.value)
  const esc = encodeURIComponent
  const query = Object.keys(params.value)
    .map((k) => esc(k) + '=' + esc(params.value[k]))
    .join('&')

  console.log('ESC', esc)
  console.log('QUERY', query)

  response = await fetch(`${config.apiUrl}/attributes?${query}`, {
    method: 'GET',
  })
  const jsonRes = await response.json()
  console.log(jsonRes)
  attributes.value = jsonRes.docs
  count.value = jsonRes.results
  totalCount.value = jsonRes.totalCount
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
  await fetchAll()
}

const toggleSort = async (event) => {
  sort.field = event.field
  sort.order = event.order
  await fetchAll()
}

// Set current page
const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAll()
}

const addNewAttribute = () => {
  attributes.value.push({ name: '', sortOrder: 0, terms: [] })
  // totalCount.value++
}

const showDeleteAttributeAlert = (attributeId) => {
  attributeToDeleteId.value = attributeId
  console.log(attributeToDeleteId.value)
  showAlert(
    'Are you sure you want to delete this attribute?',
    'You must also delete all product variants containing this attribute if any',
    'deleteAttribute',
    true
  )
}

const deleteAttribute = async () => {
  // errorMsg.value = ''
  // message.value = ''
  try {
    console.log('LLLLLLLL')
    await $fetchAll('attributes', {}, 'DELETE', attributeToDeleteId.value)

    // const {
    //   data: attributeData,
    //   pending: attributePending,
    //   error: attributeError,
    // } = await useFetch(`${config.API_URL}/attributes/${attributeToDeleteId.value}`, {
    //   method: 'DELETE',
    // })
    // if (attributeError.value) throw attributeError.value
    const {
      data: attributeTermsData,
      pending: attributeTermsPending,
      error: attributeTermsError,
    } = await useFetch(`${config.API_URL}/attributeterms/deleteMany`, {
      method: 'DELETE',
      body: { parent: attributeToDeleteId.value },
    })
    if (attributeTermsError.value) throw attributeTermsError.value
  } catch (err) {
    console.log(err)
    errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
  }
  alert.value.action = ''
  alert.value.show = false
  fetchAll()
}

const showDeleteTermAlert = (termId) => {
  termToDeleteId.value = termId
  showAlert(
    'Are you sure you want to delete this attribute term?',
    'You must also delete all variants containig this term',
    'deleteTerm',
    true
  )
}

const deleteTerm = async () => {
  errorMsg.value = ''
  message.value = ''
  try {
    const { data, pending, error } = await useFetch(`${config.API_URL}/attributeterms/${termToDeleteId.value}`, {
      method: 'DELETE',
    })
    if (error.value) throw error.value
  } catch (err) {
    console.log(err)
    errorMsg.value = err.message ? err.message : err.data && err.data.message ? err.data.message : ''
  }
  termToDeleteId.value = ''
  alert.value.action = ''
  alert.value.show = false
  fetchAll()
}

const showAlert = (heading, paragraph, action, showCancelBtn) => {
  alert.value.heading = heading
  alert.value.paragraph = paragraph
  alert.value.action = action
  alert.value.showCancelBtn = showCancelBtn
  alert.value.show = true
}

watch(
  () => alert.value.show,
  (currentVal) => {
    if (currentVal === 'ok' && alert.value.action === 'deleteAttribute') deleteAttribute()

    if (currentVal === 'ok' && alert.value.action === 'deleteTerm') deleteTerm()
  }
)

await fetchAll()
</script>

<template>
  <div class="h-full flex-col items-center gap-2 p-3">
    <Title>{{ title }}</Title>
    <div class="flex-row items-center justify-between w-full max-w-130">
      <h3>Attributes</h3>
      <button class="btn btn__primary btn__pill px-2 py-05 flex-row" @click="addNewAttribute">
        <IconsPlus class="w-2 h-2" />
        Add New
      </button>
    </div>
    <div class="flex-1 max-w-130 w-full flex-col gap-3">
      {{ attributes }}
      <div class="flex-col gap-2 br-5" v-if="attributes.length">
        <div class="flex-row items-center gap-3">
          <!-- <Search class="flex-1" @searchKeywordSelected="handleSearch" /> -->
          <!-- <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="toggleSort" /> -->
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
          <tbody v-if="attributes.length">
            <EcommerceAdminAttributesCard
              v-for="(attribute, index) in attributes"
              :key="attribute._id"
              :attribute="attribute"
              :index="index"
              :showAction="showActionKeys[index]"
              @setActions="setActions"
              @attributeUpdated="fetchAll"
              @deleteAttribute="showDeleteAttributeAlert"
              @deleteTerm="showDeleteTermAlert"
            />
          </tbody>
        </table>
      </div>
      <EcommerceAdminAttributesEmptyMsg v-else />
    </div>
    <div class="w-full max-width-130">
      <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
