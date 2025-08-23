import { memo, useState } from 'react'
import { AlertTriangle, Shield, FileText, Terminal } from 'lucide-react'
import { cn } from '@/utils'
import { Checkbox } from '@/components/Checkbox'
import type { ToolCall, ToolName } from '@jl-org/nexus-agent'

export const DangerousToolsConfirm = memo<DangerousToolsConfirmProps>((props) => {
  const { dangerousTools, onToolAutoConfirmChange, onToolConfirmChange } = props
  const [autoConfirmStates, setAutoConfirmStates] = useState<Record<ToolName, boolean>>({} as any)
  const [confirmStates, setConfirmStates] = useState<Record<ToolName, boolean>>({} as any)

  const handleToolAutoConfirmChange = (toolName: ToolName, checked: boolean) => {
    setAutoConfirmStates(prev => ({
      ...prev,
      [toolName]: checked
    }))
    onToolAutoConfirmChange?.(toolName, checked)
  }

  const handleToolConfirmChange = (toolName: ToolName, checked: boolean) => {
    setConfirmStates(prev => ({
      ...prev,
      [toolName]: checked
    }))
    onToolConfirmChange?.(toolName, checked)
  }

  // 根据工具类型获取图标和样式
  const getToolStyle = (toolName: string) => {
    const isFileTool = toolName.includes('file') || toolName.includes('write')
    const isSystemTool = toolName.includes('command') || toolName.includes('exec') || toolName.includes('run')

    if (isFileTool) {
      return {
        icon: <FileText className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />,
        className: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
      }
    }

    if (isSystemTool) {
      return {
        icon: <Terminal className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />,
        className: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
      }
    }

    return {
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />,
      className: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
    }
  }

  return (
    <div className="space-y-4 p-2">
      {/* 工具列表 */ }
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Shield className="w-4 h-4" />
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
                  toolStyle.className
                ) }
              >
                <div className="flex items-start gap-3 mb-3">
                  { toolStyle.icon }
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                      { tool.name }
                    </div>
                    { tool.parameters && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 break-words">
                        参数: { JSON.stringify(tool.parameters) }
                      </div>
                    ) }
                  </div>
                </div>

                {/* 每个工具的确认选项 */ }
                <div className="ml-7 space-y-2">
                  <Checkbox
                    checked={ confirmStates[tool.name] !== false }
                    onChange={ (checked) => handleToolConfirmChange(tool.name, checked) }
                    label="执行此工具"
                    labelClassName="text-xs text-gray-700 dark:text-gray-300 font-medium"
                    size={ 16 }
                  />
                  <Checkbox
                    checked={ autoConfirmStates[tool.name] || false }
                    onChange={ (checked) => handleToolAutoConfirmChange(tool.name, checked) }
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
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <div className="font-medium mb-1">安全提醒</div>
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