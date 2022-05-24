const useHttp = () => {
  const config = useRuntimeConfig()
  const { errorMsg, message } = useAppState()

  const fetchAll = async (resource, params) => {
    errorMsg.value = null
    message.value = null
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/${resource}`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      })
      // console.log(data.value)
      if (error.value) throw error.value
      if (data.value && data.value.status === 'fail') {
        // console.log('DATAT', data.value.message)
        if (process.client) errorMsg.value = data.value.message
        // return { docs: [], totalCount: 0 }
        return false
      }
      return data.value
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
        // return { docs: [], totalCount: 0 }
        return false
      }
    }
  }

  const fetchDoc = async (resource, id) => {
    errorMsg.value = null
    message.value = null
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      const { data, pending, error } = await useFetch(`${config.API_URL}/${resource}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // console.log(data.value)
      if (error.value) throw error.value
      if (data.value && data.value.status === 'fail') {
        // console.log('DATAT', data.value.message)
        if (process.client) errorMsg.value = data.value.message
        // return { docs: [], totalCount: 0 }
        return false
      }
      return data.value.doc
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
        // return { docs: [], totalCount: 0 }
        return false
      }
    }
  }

  const saveDoc = async (resource, payload) => {
    errorMsg.value = null
    message.value = null
    let response = null
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      if (payload.id) {
        response = await useFetch(`${config.API_URL}/${resource}/${payload.id}`, {
          method: 'PATCH',
          body: payload,
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        response = await useFetch(`${config.API_URL}/${resource}`, {
          method: 'POST',
          body: payload,
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      if (response.error.value) throw response.error.value
      if (response.data.value.status === 'fail') {
        console.log('DATAT', response.data.value.message)
        if (process.client) errorMsg.value = response.data.value.message
        return false
      }
      return response.data.value.doc ? response.data.value.doc : {}
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  return { fetchAll, fetchDoc, saveDoc }
}

export default useHttp
