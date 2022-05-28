const useHttp = () => {
  const config = useRuntimeConfig()
  const { errorMsg, message } = useAppState()

  const getErrorStr = (errors) => {
    console.log('MYERROR', errors)
    let errorStr = ''
    for (const prop in errors) {
      errorStr = `${errorStr}<li>${errors[prop].message}</li>`
    }
    return `<ul>${errorStr}</ul>`
  }

  const fetchAll = async (resource, params) => {
    errorMsg.value = null
    message.value = null
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      const esc = encodeURIComponent
      const query = Object.keys(params)
        .map((k) => esc(k) + '=' + esc(params[k]))
        .join('&')
      const response = await fetch(`${config.apiUrl}/${resource}?${query}`, {
        method: 'GET',
      })
      console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return { docs: [], count: 0, totalCount: 0 }
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
        response = await fetch(`${config.apiUrl}/${resource}/${payload.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            // { Authorization: `Bearer ${token}` }
          },
        })
      } else {
        response = await fetch(`${config.apiUrl}/${resource}`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            // { Authorization: `Bearer ${token}` }
          },
        })
      }
      console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return {}
    }
  }

  const deleteDocs = async (resource, payload) => {
    errorMsg.value = null
    message.value = null
    let response = null
    const token =
      useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
        ? useCookie('auth').value.token
        : null
    try {
      response = await fetch(`${config.apiUrl}/${resource}/delete-many`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return {}
    }
  }

  return { fetchAll, fetchDoc, saveDoc, deleteDocs }
}

export default useHttp
