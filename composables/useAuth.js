const useAuth = () => {
  const { errorMsg, message } = useAppState()
  const config = useRuntimeConfig()

  const user = useState('user', () =>
    useCookie('auth').value && useCookie('auth').value.user ? useCookie('auth').value.user : {}
  )
  const token = useState('token', () =>
    useCookie('auth').value && useCookie('auth').value.token ? useCookie('auth').value.token : null
  )

  const isAuthenticated = useState('isAuthenticated', () => (token && token.value ? true : false))

  const isAdmin = useState('isAdmin', () => (user.value && user.value.role === 'admin' ? true : false))

  const signup = async (user) => {
    errorMsg.value = ''
    try {
      const { data, pending, error } = await useFetch(`http://localhost:5000/v1/auth/signup`, {
        method: 'POST',
        body: { ...user },
      })
      if (error.value) throw error.value
      return data.value
    } catch (err) {
      console.log('MYERROR', err.data)
      errorMsg.value = ''
      for (const prop in err.data.errors) {
        errorMsg.value = `<li>${err.data.errors[prop].message}</li>`
      }
      errorMsg.value = `<ul>${errorMsg.value}</ul>`
      return false
    }
  }

  const finishSignup = async (user, token) => {
    errorMsg.value = ''
    message.value = ''
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/auth/completeSignup/${token}`, {
        method: 'PATCH',
        body: { ...user },
      })
      if (error.value) throw error.value
      if (data.value && data.value.status === 'fail') {
        if (process.client) errorMsg.value = data.value.message
        return false
      }
      return data.value
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      return false
    }
  }

  const signin = async (user) => {
    errorMsg.value = ''
    message.value = ''
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/auth/signin`, {
        method: 'POST',
        body: user,
      })
      if (error.value) throw error.value
      if (data.value && data.value.status === 'fail') {
        if (process.client) errorMsg.value = data.value.message
        return false
      }
      return data.value
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      return false
    }
  }

  const fetchLoggedInUser = async () => {
    errorMsg.value = null
    message.value = null
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/users/fetchLoggedIn`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (error.value) throw error.value
      if (data.value.status === 'fail') {
        if (process.client) errorMsg.value = data.value.message
        return false
      }
      console.log('FETCH Loggedin', data.value)
      return data.value.doc
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  const updateLoggedInUserData = async (payload) => {
    errorMsg.value = ''
    message.value = ''
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/users/updateLoggedInData`, {
        method: 'PATCH',
        body: payload,
        headers: { Authorization: `Bearer ${token}` },
      })
      if (error.value) throw error.value
      if (data.value && data.value.status === 'fail') {
        if (process.client) errorMsg.value = data.value.message
        return false
      }
      return data.value.doc
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      return false
    }
  }

  const forgotPassword = async (email) => {
    errorMsg.value = ''
    message.value = ''
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/auth/forgotpassword`, {
        method: 'POST',
        body: {
          email,
          passwordResetUrl: `${config.BASE_URL}/auth/resetpassword`,
          emailSubject: 'Your password reset token (valid for 1 hour)',
        },
      })
      console.log('DATA', data.value)
      if (error.value) throw error.value
      if (data.value && data.value.status === 'fail') {
        if (process.client) errorMsg.value = data.value.message
        return false
      }
      return data.value
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
        return false
      }
    }
  }

  const resetPassword = async (payload) => {
    errorMsg.value = ''
    message.value = ''
    console.log(payload)
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/auth/resetpassword/${payload.token}`, {
        method: 'PATCH',
        body: {
          password: payload.password,
        },
      })
      console.log('DATA', data.value)
      if (error.value) throw error.value
      if (data.value && data.value.status === 'fail') {
        if (process.client) errorMsg.value = data.value.message
        return false
      }
      return data.value
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
        return false
      }
    }
  }

  // const login = async (user) => {
  //   console.log('here')
  //   try {
  //     const response = await $fetch('/api/v1/auth/login', {
  //       method: 'POST',
  //       body: user,
  //     })
  //     return response
  //   } catch (error) {
  //     return { ok: false, errorMsg: error.data }
  //   }
  // }
  // const logout = async () => {
  //   try {
  //     await $fetch('/api/v1/auth/logout')
  //     return true
  //   } catch (error) {
  //     return { ok: false, errorMsg: error.data }
  //   }
  // }

  // const forgotPassword = async (email) => {
  //   try {
  //     const response = await $fetch('/api/v1/auth/forgot-password', {
  //       method: 'POST',
  //       body: { email },
  //     })
  //     return response
  //   } catch (error) {
  //     return { ok: false, errorMsg: error.data }
  //   }
  // }

  // const resetPassword = async (payload) => {
  //   console.log(payload)
  //   try {
  //     const response = await $fetch('/api/v1/auth/reset-password', {
  //       method: 'PATCH',
  //       body: payload,
  //     })
  //     return response
  //   } catch (error) {
  //     return { ok: false, errorMsg: error.data }
  //   }
  // }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    signup,
    finishSignup,
    signin,
    fetchLoggedInUser,
    updateLoggedInUserData,
    forgotPassword,
    resetPassword,
  }
}

export default useAuth
