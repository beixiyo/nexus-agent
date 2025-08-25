import { Http } from '@jl-org/http'
import { DEFAULT_CONNECTION_CONFIG } from '@/config'

/** 创建 HTTP 实例 */
export function createHttpInstance(baseUrl?: string) {
  return new Http({
    baseUrl: baseUrl || `${DEFAULT_CONNECTION_CONFIG.serverUrl}/api`,
    timeout: 1000 * 60 * 5,
    respInterceptor(resp) {
      return resp.data
    },
  })
}

/** 默认 HTTP 实例 */
export const http = createHttpInstance()
