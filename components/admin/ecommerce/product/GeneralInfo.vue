<script setup>
const product = useState('product')
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb05">General Info</div>
      <div></div>
    </div>
    <div class="flex-row gap-2">
      <!-- <FormsBaseSelect
        nullOption="Select Product Type"
        label="Product Type"
        :options="[
          { key: 'variable', name: 'Variable' },
          { key: 'simple', name: 'Simple' },
        ]"
        v-model="product.productType"
      /> -->
    </div>
    <div class="flex-1 flex-row gap-2">
      <div class="flex-1">
        <FormsBaseInput label="ACS Part Number" placeholder="ACS Part Number" :required="true" v-model="product.name" />
      </div>
      <div class="flex-1">
        <FormsBaseInput label="OEM" placeholder="OEM" :required="true" v-model="product.oemPartNumber.parent.name" />
      </div>
      <FormsBaseInput
        label="OEM Part Number"
        placeholder="OEM Part Number"
        :required="true"
        v-model="product.oemPartNumber.name"
      />
    </div>
    <FormsBaseInput label="Description" placeholder="Description" :required="true" v-model="product.description" />
  </section>
</template>

<style lang="scss" scoped></style>
