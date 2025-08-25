import type { ToolCall, ToolName } from 'nexus-common'
import { AlertTriangle, FileText, Shield, Terminal } from 'lucide-react'
import { memo, useState } from 'react'
import { Checkbox } from '@/components/Checkbox'
import { cn } from '@/utils'

export const DangerousToolsConfirm = memo<DangerousToolsConfirmProps>((props) => {
  const { dangerousTools, onToolAutoConfirmChange, onToolConfirmChange } = props
  const [autoConfirmStates, setAutoConfirmStates] = useState<Record<ToolName, boolean>>({} as any)
  const [confirmStates, setConfirmStates] = useState<Record<ToolName, boolean>>({} as any)

  const handleToolAutoConfirmChange = (toolName: ToolName, checked: boolean) => {
    setAutoConfirmStates(prev => ({
      ...prev,
      [toolName]: checked,
    }))
    onToolAutoConfirmChange?.(toolName, checked)
  }

  const handleToolConfirmChange = (toolName: ToolName, checked: boolean) => {
    setConfirmStates(prev => ({
      ...prev,
      [toolName]: checked,
    }))
    onToolConfirmChange?.(toolName, checked)
  }

  /** 根据工具类型获取图标和样式 */
  const getToolStyle = (toolName: string) => {
    const isFileTool = toolName.includes('file') || toolName.includes('write')
    const isSystemTool = toolName.includes('command') || toolName.includes('exec') || toolName.includes('run')

    if (isFileTool) {
      return {
        icon: <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />,
        className: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
      }
    }

    if (isSystemTool) {
      return {
        icon: <Terminal className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />,
        className: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
      }
    }

    return {
      icon: <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />,
      className: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    }
  }

  return (
    <div className="p-2 space-y-4">
      {/* 工具列表 */ }
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium dark:text-gray-300">
          <Shield className="h-4 w-4" />
          检测到的工具：
        </div>

        <div className="max-h-60 overflow-y-auto space-y-3">
          { dangerousTools.map((tool, index) => {
            const toolStyle = getToolStyle(tool.name)

            return (
              <div
                key={ `${tool.name}-${index}` }
                className={ cn(
                  'p-3 rounded-lg border',
                  toolStyle.className,
                ) }
              >
                <div className="mb-3 flex items-start gap-3">
                  { toolStyle.icon }
                  <div className="min-w-0 flex-1">
                    <div className="break-words text-sm text-gray-900 font-medium dark:text-gray-100">
                      { tool.name }
                    </div>
                    { tool.parameters && (
                      <div className="mt-1 break-words text-xs text-gray-600 dark:text-gray-400">
                        参数:
                        { ' ' }
                        { JSON.stringify(tool.parameters) }
                      </div>
                    ) }
                  </div>
                </div>

                {/* 每个工具的确认选项 */ }
                <div className="ml-7 space-y-2">
                  <Checkbox
                    checked={ confirmStates[tool.name] !== false }
                    onChange={ checked => handleToolConfirmChange(tool.name, checked) }
                    label="执行此工具"
                    labelClassName="text-xs text-gray-700 dark:text-gray-300 font-medium"
                    size={ 16 }
                  />
                  <Checkbox
                    checked={ autoConfirmStates[tool.name] || false }
                    onChange={ checked => handleToolAutoConfirmChange(tool.name, checked) }
                    label="以后都默认执行此类工具，不再询问"
                    labelClassName="text-xs text-gray-600 dark:text-gray-400"
                    size={ 16 }
                  />
                </div>
              </div>
            )
          }) }
        </div>
      </div>

      {/* 安全提醒 */ }
      <div className="border border-blue-200 rounded-lg bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
        <div className="flex items-start gap-2">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <div className="mb-1 font-medium">安全提醒</div>
            <div>这些操作可能会修改您的文件系统或执行系统命令，请仔细确认后再执行。</div>
          </div>
        </div>
      </div>
    </div>
  )
})

DangerousToolsConfirm.displayName = 'DangerousToolsConfirm'

export type DangerousToolsConfirmProps = {
  /** 危险工具列表 */
  dangerousTools: ToolCall[]
  /** 工具自动确认状态改变时的回调函数 */
  onToolAutoConfirmChange?: (toolName: ToolName, checked: boolean) => void
  /** 工具确认状态改变时的回调函数 */
  onToolConfirmChange?: (toolName: ToolName, checked: boolean) => void
}
