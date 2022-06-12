<script setup>
const props = defineProps({
  product: {
    type: Object,
    // required: true
  },
  minVal: {
    type: Number,
    required: true,
  },
  maxVal: {
    type: Number,
    required: true,
  },
  stepVal: {
    type: Number,
    required: true,
  },
  btnText: {
    type: [String, Number],
  },
  showQuantitySelector: {
    type: Boolean,
  },
  parentComponent: {
    type: String,
  },
})

const emit = defineEmits(['toggleQuantitySelectors', 'cancel'])
const { addItem } = useCart()
const uuid = useUniqueId().getId()
const quantity = ref(null)
const quantitySelectorPosition = ref(null)
const quantityArr = ref([])
const quantitySelectorOffset = ref(null)
const cartQuantitySelectorOffset = ref(null)

let i = props.minVal
while (i <= props.maxVal) {
  quantityArr.value.push(i)
  i += props.stepVal
}
if (quantityArr.value.length <= 5) {
  quantitySelectorOffset.value = `-110px`
  cartQuantitySelectorOffset.value = `-30px`
} else if (quantityArr.value.length > 5 && quantityArr.value.length <= 10) {
  quantitySelectorOffset.value = `-150px`
  cartQuantitySelectorOffset.value = `-50px`
} else if (quantityArr.value.length > 10 && quantityArr.value.length <= 15) {
  quantitySelectorOffset.value = `-190px`
  cartQuantitySelectorOffset.value = `-70px`
} else if (quantityArr.value.length > 15 && quantityArr.value.length <= 20) {
  quantitySelectorOffset.value = `-230px`
  cartQuantitySelectorOffset.value = `-90px`
} else if (quantityArr.value.length > 20 && quantityArr.value.length <= 25) {
  quantitySelectorOffset.value = `-270px`
  cartQuantitySelectorOffset.value = `-110px`
} else if (quantityArr.value.length > 25 && quantityArr.value.length <= 30) {
  quantitySelectorOffset.value = `-310px`
  cartQuantitySelectorOffset.value = `-130px`
} else {
  quantitySelectorOffset.value = `-350px`
  cartQuantitySelectorOffset.value = `-150px`
}

if (process.client) {
  document.addEventListener('click', (event) => {
    if (
      !event.target.closest(`.quantity-selector-${uuid}`) &&
      !event.target.classList.contains(`quantity-selector-input`)
    ) {
      emit('cancel')
    }
  })
}
const setQuantitySelectorPosition = (event) => {
  const position = event.target.getBoundingClientRect().y
  if (position < 320) quantitySelectorPosition.value = 'below'
  else quantitySelectorPosition.value = null
  emit('toggleQuantitySelectors', !props.showQuantitySelector)
}

const setQuantity = (qty) => {
  emit('toggleQuantitySelectors', false)
  addItem(props.product, qty)
  quantity.value = null
}
</script>

<template>
  <div class="quantity-selector relative" :class="{ cart: parentComponent === 'cart' }">
    <button class="btn btn__quantity-selector" @click.stop="setQuantitySelectorPosition">
      <client-only>
        <div class="" v-if="btnText">{{ btnText }}</div>
        <IconsPlus v-else class="fill-slate-50" />
      </client-only>
    </button>
    <div
      class="selector absolute bg-stone-200 z-9 p-1 br-3"
      v-if="showQuantitySelector"
      :class="quantitySelectorPosition"
    >
      <ul class="flex-row wrap">
        <li
          class="quantity flex-row gap-1 items-center justify-center text-xs w-4 h-4 ml--1 cursor-pointer"
          v-for="n in quantityArr"
          :key="`predefined-quantity-${n}`"
          @click="setQuantity(n)"
        >
          <span>{{ n }}</span>
        </li>
      </ul>
      <div class="flex-row">
        <input
          :class="`px-1 text-xs flex-1 quantity-selector-input`"
          type="text"
          v-model="quantity"
          placeholder="Add custom quantity"
          @change="setQuantity(quantity)"
        />
        <button class="btn btn__quantity-selector" @click="setQuantity(quantity)">OK</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.quantity-selector {
  .selector {
    top: v-bind(quantitySelectorOffset);
    left: 50%;
    width: 215px;
    transform: translateX(-50%);
    background-color: $stone-200;

    &.below {
      top: 130%;
      &::before {
        top: -20px;
        border-color: transparent transparent $stone-200 transparent;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px;
      border-style: solid;
      border-color: $stone-200 transparent transparent transparent;
    }

    .quantity {
      border-right: 1px solid $stone-400;
      span {
        padding: 0.5rem;
        border-radius: 3px;
        width: 30px;
        height: 30px;
        text-align: center;
      }

      &:hover {
        span {
          border: 1px solid $stone-400;
        }
      }

      &:nth-of-type(5n) {
        border-right: none;
      }
    }
  }

  &.cart {
    .selector {
      top: v-bind(cartQuantitySelectorOffset);
      left: -115px;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 210px;
        transform: translateY(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent transparent $stone-200;
      }
    }
  }
}
</style>
