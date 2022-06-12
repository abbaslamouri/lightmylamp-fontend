<script setup>
const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
  slidesToDisplayCount: {
    type: Number,
    default: 1,
  },
  controls: {
    type: Boolean,
    default: false,
  },
  indicators: {
    type: Boolean,
    default: false,
  },
  interval: {
    type: [String, Number],
    default: 1,
  },
  height: {
    type: [String, Number],
    default: 10,
  },
})

const config = useRuntimeConfig()

// const slidesToDisplay = ref([])
// const props.slidesToDisplayCount(4)
const currentSlide = ref(0)
const slideInterval = ref('')
const direction = ref('')
const transitionName = computed(() => (direction.value === 'right' ? 'carousel-ltr' : 'carousel-rtl'))
const carouselHeight = computed(() => `${props.height * 1}rem`)
const imageContainerHeight = computed(() => `${props.height * 0.7}rem`)

const slidesToDisplay = computed(() => {
  if (props.slides.length <= props.slidesToDisplayCount) return props.slides
  const images = []
  let index = currentSlide.value
  while (index < currentSlide.value + props.slidesToDisplayCount) {
    if (index < props.slides.length) images.push(props.slides[index])
    else images.push(props.slides[currentSlide.value + props.slidesToDisplayCount - index])
    index = index + 1
  }
  return images
})

const setCurrentSlide = (index) => {
  currentSlide.value = index
}

const next = (step = 1) => {
  const index = currentSlide.value < props.slides.length - 1 ? currentSlide.value + step : 0
  setCurrentSlide(index)
  direction.value = 'right'

  // startCarouselInterval()
}

const prevSlide = (step) => {
  const index = currentSlide.value > 0 ? currentSlide.value + step : props.slides.length - 1
  setCurrentSlide(index)
  direction.value = 'left'
  startCarouselInterval()
}

const nextSlide = (step) => {
  next(step)
  startCarouselInterval()
}

const switchSlide = (index) => {
  const step = index - currentSlide.value
  if (step > 0) nextSlide(step)
  else prevSlide(step)
}

const startCarouselInterval = () => {
  stopCarouselInterval()
  slideInterval.value = setInterval(() => {
    next()
  }, props.interval * 1000)
}

const stopCarouselInterval = () => {
  clearInterval(slideInterval.value)
}

onMounted(() => {
  startCarouselInterval()
})

onUnmounted(() => {
  stopCarouselInterval()
})
</script>

<template>
  <div class="carousel">
    <!-- {{ slidesToDisplay }}==={{ slides.length }} -->
    <div class="inner">
      <div class="controls-left" v-if="controls">
        <button @click="prevSlide(-1)" class="btn control left"><IconsChevronLeft /></button>
      </div>
      <div class="slides" v-for="(slide, index) in slides" :key="`slide-${index}`">
        <transition :name="transitionName">
          <div
            v-show="currentSlide === index"
            class="items"
            @mouseenter="stopCarouselInterval"
            @mouseleave="startCarouselInterval"
          >
            <div v-for="image in slidesToDisplay" class="item">
              <div class="w-full h-full">
                <img class="w-full h-full" :src="`${config.backendUrl}/${image.path}`" alt="" />
              </div>
            </div>
            <!-- <img :src="`${config.backendUrl}/${slide.path}`" alt="" /> -->
          </div>
        </transition>
      </div>
      <div class="controls-right" v-if="controls">
        <button @click="nextSlide(1)" class="btn control right"><IconsChevronRight /></button>
      </div>
      <div class="indicators" v-if="indicators">
        <button
          class="indicator"
          :class="{ active: currentSlide === index }"
          v-for="(item, index) in slides.length"
          :key="`indicator-${item}`"
          @click="switchSlide(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: v-bind(carouselHeight);
  background-color: #fff;
  // padding: 4rem;
  // border: 3px solid red;

  .inner {
    display: grid;
    grid-template-columns: 5rem 1fr 5rem;
    grid-template-rows: 1fr 5rem;
    height: 100%;
    width: 100%;
    // position: relative;
    // width: 100%;
    // overflow: hidden;
    // padding: 2rem;
    // border: 5px solid pink;

    .slides {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      height: 100%;
      width: 100%;
      // border: 5px solid green;
      overflow: hidden;

      .items {
        display: flex;
        gap: 2rem;
        justify-content: center;
        align-items: center;
        // max-height: 50%;
        // border: 5px solid yellow;
        height: 100%;
        width: 100%;

        .item {
          // border: 5px solid pink;
          height: v-bind(imageContainerHeight);

          // position: absolute;
          // inset: 0;
          // padding: 0 1rem 3rem 1rem;
          // max-height: 100%;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }

    .controls-left {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 1px solid blue;
    }

    .controls-right {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 1px solid blue;
    }

    .indicators {
      grid-column: 1 / 4;
      grid-row: 2 / 3;
      display: flex;
      justify-content: center;
      align-items: center;
      // position: absolute;
      // bottom: 0;
      // z-index: 2;
      // transform: translateX(-50%);
      // left: 50%;
      // border: 3px solid green;

      .indicator {
        border: none;
        padding: 0;
        width: 15px;
        height: 15px;
        background: $slate-400;
        border-radius: 50%;
        opacity: 0.5;
        margin: 0.2em;
        cursor: pointer;

        &.active {
          opacity: 1;
        }
      }
    }
  }

  // &__controls {
  //   border: 1px solid blue;

  //   .control {
  //     border: none;
  //     background-color: $slate-900;
  //     opacity: 0.6;
  //     // position: absolute;
  //     // height: 50px;
  //     // width: 40px;
  //     // border: 1px solid red;
  //     // top: 50%;
  //     // transform: translateY(-50%);
  //     // color: white;
  //     transition: 0.3s;

  //     svg {
  //       width: 3rem;
  //       height: 3rem;
  //       cursor: pointer;

  //       &:hover {
  //         // background-color: $slate-900;
  //         fill: $slate-400;
  //       }
  //     }
  //   }

  //   .left {
  //     // left: 0;
  //     grid-column: 1 / 2;
  //   }
  //   .right {
  //     // right: 0;
  //     grid-column: 3 / 4;
  //   }
  // }
}
</style>
