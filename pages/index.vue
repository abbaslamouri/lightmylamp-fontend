<script setup>
const config = useRuntimeConfig()
const ping = ref({})
console.log(config.apiUrl)
const fetchData = async () => {
  const { data } = await useFetch(`/ping`, { baseURL: config.apiUrl })
  console.log(data.value)
}
</script>

<template>
  <div>
    <button @click="fetchData">Fetch Data</button>
    <!-- {{ data }} -->
  </div>
</template>

<style lang=""></style>
