<script setup>
const emit = defineEmits(['toggleProductFiltersSlideout'])
const router = useRouter()
// const { cart, updateLocalStorage } = useCart()
// const { showCartSlideout } = useAppState()
const { saveDoc } = useHttp()
// const showfiltersSlideout

// const checkout = async () => {
//   showCartSlideout.value = false
//   cart.value.status = 'cart'
//   const order = await saveDoc('orders', cart.value)
//   console.log(order)
//   if (order) {
//     cart.value.id = order._id
//     updateLocalStorage()
//     router.push({ name: 'ecommerce-checkout' })
//   }
// }
</script>

<template>
  <div>
    <div class="fixed inset-0 w-100vw h-100vh z-99 bg-slate-900 opacity-70"></div>
    <div class="fixed top-0 right-0 h-100vh z-99 max-w-415p w-100-percent text-slate-800">
      <ClientOnly>
        <div class="h-100vh flex-col justify-between bg-white">
          <div class="bg-stone-300 p-1 flex-row items-center justify-between py-1 px-2">
            <h3 class="font-bold text-md uppercase">Shopping Bag</h3>
            <button class="btn btn__close" @click.prevent="$emit('toggleProductFiltersSlideout')">
              <IconsClose />
            </button>
          </div>
          <div class="flex-1 p-2 flex-col gap-2">
            <div class="flex-row gap-1 items-center">
              <IconsCoffee class="w-4 h-4" />
              <div>
                <div class="font-bold">Free Coffee Samples with all orders.</div>
                <div>Add at Checkout</div>
              </div>
            </div>
            <div>
              <span>Free shipping from $35</span>
            </div>
            <div>
              <!-- <EcommerceCheckoutCartItemList /> -->
              <!-- <EcommerceCheckoutCartTotal /> -->
              <p class="text-xs">(Shipping costs, special offers not included)</p>
            </div>
            <!-- <EcommerceCheckoutEmptyCart v-else class="bg-slate-50 p3" /> -->
          </div>
          <div class="p-1 bg-stone-300">
            <div class="flex-row justify-end px-3">
              <button class="btn btn__checkout px-3 py-1" @click="checkout">Checkout</button>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
