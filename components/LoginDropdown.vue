<script setup lang="">
const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()
const { user, token, jwt, isAuthenticated, login } = useAuth()
const { errorMsg, message } = useAppState()
const showAuthDropdown = ref(false)
const formUser = reactive({
  email: '',
  password: '',
})

const signup = async () => {
  router.push({ name: 'auth-signup', query: { redirect: route.name } })
  showAuthDropdown.value = false
}

const signin = async () => {
  showAuthDropdown.value = false
  errorMsg.value = null
  message.value = null
  const {
    data,
    pending: loading,
    error,
  } = await useFetch(`${config.apiUrl}/auth/signin`, {
    method: 'POST',
    body: { ...formUser },
  })
  if (error.value && error.value.data) {
    console.log('MYERROR', error.value.data)
    errorMsg.value = ''
    for (const prop in error.value.data.errors) {
      errorMsg.value = `${errorMsg.value}<li>${error.value.data.errors[prop].message}</li>`
    }
    errorMsg.value = `<ul>${errorMsg.value}</ul>`
  }
  console.log(data.value)
  const tokenCookie = useCookie('token', { maxAge: data.value.cookieExpires * 24 * 60 * 60 })
  const userCookie = useCookie('user', { maxAge: data.value.cookieExpires * 24 * 60 * 60 })
  console.log('COOKIE', tokenCookie.value)
  if (!tokenCookie.value) tokenCookie.value = data.value.auth.token
  if (!userCookie.value) userCookie.value = { name: data.value.auth.user.name }
  message.value = 'Login successful'
  user.value = userCookie.value
  token.value = tokenCookie.value
  isAuthenticated.value = true
}

const forgotPassword = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthDropdown.value = false
}
</script>

<template>
  <div class="relative">
    <div class="overlay" v-if="showAuthDropdown" @click="showAuthDropdown = !showAuthDropdown"></div>
    <div class=" ">
      <div
        class="header flex-row items-center gap-1 text-xs border border-slate-50 py-05 px-1 cursor-pointer br-3 relative z-99"
        :class="{ selected: showAuthDropdown }"
        @click="showAuthDropdown = !showAuthDropdown"
      >
        <IconsPersonFill class="fill-slate-50" />
        <h3 class="font-light uppercase">Sign in / Create acount</h3>
      </div>
      <form class="shadow-md flex-col gap-2 bg-slate-50 p-2 absolute z-99 text-slate-800" v-if="showAuthDropdown">
        <h3 class="title">Sin in</h3>
        <p class="text-xs">Access your account and place an order:</p>
        <div class="flex-col gap-1">
          <FormsBaseInput label="Email" type="email" v-model="formUser.email" required />
          <FormsBaseInput label="Password" type="password" v-model="formUser.password" required />
        </div>

        <div>
          <button class="btn btn__secondary w-full justify-between px-1 py-05 text-xs" @click.prevent="forgotPassword">
            <p>Forgot Password?</p>
            <IconsChevronRight />
          </button>
        </div>
        <button class="btn btn__secondary w-full flex-row justify-between px-1 py-05 text-xs" @click.prevent="signin">
          <p>Sign in</p>
          <IconsChevronRight />
        </button>
        <p class="text-sm">New User?</p>
        <button class="btn btn__secondary w-full justify-between px-1 py-05 text-xs" @click.prevent="signup">
          <p>Create an account</p>
          <IconsChevronRight />
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.header {
  &:hover,
  &.selected {
    background-color: $slate-50;
    color: $slate-800;
    border-radius: 3px 3px 0 0;

    svg {
      fill: $slate-800;
    }
  }
}
</style>
