import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: 'http://172.17.209.191:8000/api'
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('ACCESS_TOKEN')

  if (token) {
    config.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  return config
}, (error) => {
  console.log('error setting axios config: ', error.message)
})

export const loginViaCredentials = async (email, password) => {
  try {
    const response = await api.post('/login', {email, password})
    const { user, token: { access_token } } = response.data
    console.log(response)

    await SecureStore.setItemAsync('ACCESS_TOKEN', access_token)
  } catch (err) {
    console.log(err)
  }
}

export const getUser = async () => {
  try {
    const response = await api.get('/me')
    const user = response.data
    console.log(user)
  } catch (err) {
    console.log(err)
  }
}

export const loginViaQr = async (loginKey) => {
  try {
    const response = await api.post('/login-via-qr', {
      key: loginKey
    })

    console.log(response.data)
  } catch (err) {
    console.log(err)
  }
}