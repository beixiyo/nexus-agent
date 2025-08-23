import { Http } from '@jl-org/http'

export const http = new Http({
  baseUrl: 'http://localhost:3000/api',
  timeout: 1000 * 60 * 5,
  respInterceptor(resp) {
    return resp.data
  },
})
