import axios from 'axios'

export const lessonHttp = axios.create({
  baseURL: '/api/1.0',
  timeout: 3000,
  auth: {
    username: 'admin',
    password: '111111'
  }
})
