import { memo } from 'react'
import { Card } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { ToolPermissionsManager } from '@/components/ToolPermissionsManager'

export interface SettingsPageProps {
  onBack: () => void
  tools: Array<{
    id: string
    name: string
    enabled: boolean
    icon: string
  }>
  onToggleTool: (id: string) => void
}

export const SettingsPage = memo<SettingsPageProps>((props) => {
  const { onBack, tools, onToggleTool } = props

  return (
    <div className="max-w-xs min-w-[300px] w-full bg-gray-50 p-3 dark:bg-gray-900">
      <Card
        className="w-full"
        shadow="md"
        rounded="md"
        padding="sm"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ←
            </button>
            <h1 className="text-lg text-gray-800 font-bold dark:text-white">设置</h1>
          </div>
        </div>

        {/* 连接设置 */}
        <div className="mb-4">
          <h2 className="mb-2 text-sm text-gray-700 font-medium dark:text-gray-300">🔗 连接设置</h2>
          <div className="border border-gray-200 rounded bg-white p-3 space-y-2 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">服务器地址:</label>
              <input
                type="text"
                defaultValue="http://localhost:3000"
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* 工具权限管理 */}
        <div className="mb-4">
          <h2 className="mb-2 text-sm text-gray-700 font-medium dark:text-gray-300">🔐 工具权限管理</h2>
          <ToolPermissionsManager />
        </div>
      </Card>
    </div>
  )
})

SettingsPage.displayName = 'SettingsPage'