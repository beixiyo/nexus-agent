export * from './permission'
export * from './prompt'

export const THEME_KEY = 'theme'

/** 连接配置存储键名 */
export const CONNECTION_CONFIG_KEY = 'connectionConfig'

/** Agent 启用状态存储键名 */
export const AGENT_ENABLED_KEY = 'agentEnabled'

/** 最近活动记录存储键名 */
export const RECENT_ACTIVITIES_KEY = 'recentActivities'

/** 默认连接配置 */
export const DEFAULT_CONNECTION_CONFIG = {
  serverUrl: 'http://localhost:3000',
  timeout: 10000,
  retryCount: 3,
}

/** 默认 Agent 启用状态 */
export const DEFAULT_AGENT_ENABLED = false

/** 默认最近活动记录数量 */
export const MAX_RECENT_ACTIVITIES = 10
