<script setup>
const title = ref('Main | YRL')
const config = useRuntimeConfig()

const { fetchAll } = useHttp()

const carouselGallery = ref([])

const counters = [
  { target: 98, suffix: '% +', text: 'On-time delivery' },
  { target: 850, suffix: ' +', text: 'PMA Parts' },
  { target: 20, suffix: ' +', text: 'Countries served' },
  { target: 500, suffix: ' +', text: 'Valued customers' },
]

const response = await fetchAll('galleries', { name: 'Carousel' })
console.log(response)
if (response) carouselGallery.value = response.docs[0]
</script>

<template>
  <div class="flex-1 leading-6 tracking-wide">
    <Title>{{ title }}</Title>
    <div
      class="flex-col gap-4 justify-center items-center min-h-40 bg-center bg-no-repeat bg-size-cover"
      :style="{ backgroundImage: `url('${config.backendUrl}/uploads/acshomepage-1654948453809.jpg')` }"
    >
      <h3 class="text-4xl text-slate-50 tracking-wider uppercase">Aviation Component Solutions</h3>
      <h4 class="text-md text-slate-50 tracking-wider uppercase">
        Delivering the Difference Through Innovation and Integrity
      </h4>
    </div>
    <section class="flex-row justify-center py-4">
      <div class="w-996p flex-col gap-1 items-center">
        <h3 class="text-xl uppercase">Creation of Value</h3>
        <IconsMonitoring class="fill-slate-500" />
        <p>
          ACS is a leading supplier of OEM alternative parts. We realize there’s more to our customer’s purchasing
          decision than just price. This is why ACS seeks not only to provide the best pricing in the industry, but to
          create value using any means available to us. Stocking 100% of our inventory for next day delivery, offering
          eCommerce solutions for online customers, utilizing the latest data management technology, and offering the
          latest manufacturing / design solutions are some of the many methods we’ve adopted to create value for our
          customers. All ACS parts are FAA-PMA approved.
        </p>
      </div>
    </section>
    <section class="flex-row justify-center py-4">
      <div class="w-996p flex-row justify-center gap-2 py-2">
        <div class="flex-1 flex-col gap-1 items-center">
          <div class="flex-row items-center gap-1 items-self-start">
            <IconsLightBulb class="fill-slate-500" />
            <h3 class="text-md uppercase">Design & Engineering</h3>
          </div>
          <p>
            To assure customers that the parts we provide will perform as promised, both functional and dimensional
            analyses are critical to our design process.
          </p>
        </div>
        <div class="flex-1 flex-col gap-1 items-center">
          <div class="flex-row items-center gap-1 items-self-start">
            <IconsHighQuality class="fill-slate-500" />
            <h3 class="text-md uppercase">Quality Control</h3>
          </div>
          <p>
            The driving force behind our approach to quality control is simple - to assure that our customers receive
            the highest quality, airworthy parts, every single time they order.
          </p>
        </div>
        <div class="flex-1 flex-col gap-1 items-center">
          <div class="flex-row items-center gap-1 items-self-start">
            <IconsScience class="fill-slate-500" />
            <h3 class="text-md uppercase">Materials Testing</h3>
          </div>
          <p>
            Our partnership with some of the industry's most sophisticated Materials Labs provides us with the ability
            to investigate chemical, mechanical, and metallurgical properties of the candidate part to match material,
            hardness, and strength.
          </p>
        </div>
      </div>
    </section>
    <AnimatedCounters :counters="counters" />
    <!-- <div> -->
    <Carousel
      :slides="carouselGallery.gallery"
      indicators
      controls
      interval="5"
      height="30"
      :slidesToDisplayCount="6"
    />
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
// img {
//   box-sizing: border-box;
//   transform: scale(1.1);
// }
</style>
