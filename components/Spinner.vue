<script setup>
defineProps({
  width: String,
  height: String,
})
</script>

<template>
  <div class="spinner"></div>
</template>

<style scoped>
.spinner {
  display: block;
  width: v-bind(width);
  height: v-bind(height);
  /* margin: 30px auto; */
  border: 2px solid transparent;
  border-radius: 50%;
  border-top-color: #f8fafc;
  border-left-color: #f8fafc;
  border-right-color: #f8fafc;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotateZ(360deg);
  }
}
</style>
