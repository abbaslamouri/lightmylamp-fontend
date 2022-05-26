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
    <img src="http://localhost:5000/uploads/1653562126299-Pastels-1024x697.webp" />
    <!-- {{ data }} -->
  </div>
</template>

<style lang=""></style>
