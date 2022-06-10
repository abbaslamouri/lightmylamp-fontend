const useAuth = () => {
  const config = useRuntimeConfig()
  const { errorMsg, message } = useAppState()

  const user = useState('user', () => (useCookie('user') && useCookie('user').value ? useCookie('user').value : {}))

  const token = useState('token', () =>
    useCookie('token') && useCookie('token').value ? useCookie('token').value : ''
  )

  const isAuthenticated = useState('isAuthenticated', () =>
    useCookie('token') && useCookie('token').value ? true : false
  )

  const isAdmin = useState('isAdmin', () =>
    useCookie('user').value && useCookie('user').value.role === 'admin' ? true : false
  )

  const getErrorStr = (errors) => {
    console.log('MYERROR', errors)
    let errorStr = ''
    for (const prop in errors) {
      errorStr = `${errorStr}<li>${errors[prop].message}</li>`
    }
    return `<ul>${errorStr}</ul>`
  }

  const signup = async (payload) => {
    errorMsg.value = ''
    try {
      const { data, pending, error } = await useFetch(`http://localhost:5000/v1/auth/signup`, {
        method: 'POST',
        body: { ...payload },
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

  const signin = async (payload) => {
    errorMsg.value = ''
    message.value = ''
    console.log(payload)
    try {
      const response = await fetch(`${config.apiUrl}/auth/signin`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token.value}`,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        const tokenCookie = useCookie('token', { maxAge: data.cookieExpires * 24 * 60 * 60 })
        const userCookie = useCookie('user', { maxAge: data.cookieExpires * 24 * 60 * 60 })
        tokenCookie.value = data.token
        userCookie.value = data.user
        user.value = userCookie.value
        token.value = tokenCookie.value
        isAuthenticated.value = true
        return true
      }
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  const finishSignup = async (user, token) => {
    errorMsg.value = ''
    message.value = ''
    try {
      const { data, pending, error } = await useFetch(`${config.apiUrl}/auth/completeSignup/${token}`, {
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

  // const signin = async (user) => {
  //   try {
  //     const { data, pending, error } = await useFetch(`${config.apiUrl}/auth/signin`, {
  //       method: 'POST',
  //       body: user,
  //     })
  //     if (error.value) throw error.value
  //     if (data.value && data.value.status === 'fail') {
  //       if (process.client) errorMsg.value = data.value.message
  //       return false
  //     }
  //     return data.value
  //   } catch (err) {
  //     console.log('MYERROR', err)
  //     errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
  //     return false
  //   }
  // }

  const fetchLoggedInUser = async () => {
    errorMsg.value = ''
    message.value = ''
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      const { data, pending, error } = await useFetch(`${config.apiUrl}/users/fetchLoggedIn`, {
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
      const { data, pending, error } = await useFetch(`${config.apiUrl}/users/updateLoggedInData`, {
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
      const { data, pending, error } = await useFetch(`${config.apiUrl}/auth/forgotpassword`, {
        method: 'POST',
        body: {
          email,
          passwordResetUrl: `${config.BASE_Url}/auth/resetpassword`,
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
      const { data, pending, error } = await useFetch(`${config.apiUrl}/auth/resetpassword/${payload.token}`, {
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

  const signout = async () => {
    errorMsg.value = ''
    message.value = ''
    let response
    console.log(config.apiUrl)
    try {
      response = await fetch(`${config.apiUrl}/auth/signout`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token && token.value ? token.value : ''}`,
        }),
      })
      if (response.ok) {
        const tokenCookie = useCookie('token', { maxAge: 0 })
        const userCookie = useCookie('user', { maxAge: 0 })
        tokenCookie.value = ''
        userCookie.value = ''
        user.value = ''
        token.value = ''
        isAuthenticated.value = false
        return true
      }
      if (!response.headers.get('content-type')?.includes('application/json')) throw response.statusText
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      console.log(errorMsg.value)
      return false
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
    signout,
    fetchLoggedInUser,
    updateLoggedInUserData,
    forgotPassword,
    resetPassword,
  }
}

export default useAuth
