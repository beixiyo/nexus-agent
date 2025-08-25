export * from './permission'

export const THEME_KEY = 'theme'

/** 连接配置存储键名 */
export const CONNECTION_CONFIG_KEY = 'connectionConfig'

/** 默认连接配置 */
export const DEFAULT_CONNECTION_CONFIG = {
  serverUrl: 'http://localhost:3000',
  timeout: 10000,
  retryCount: 3,
}
