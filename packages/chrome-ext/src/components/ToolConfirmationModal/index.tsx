import React, { memo, useState } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import { Modal } from '../Modal'
import { cn } from '@/utils'
import type { ToolCall } from '@jl-org/nexus-agent'
import { ToolRiskLevel } from '@/utils/toolDetector'
import {
  isWriteFileParameters,
  isDeleteFileParameters,
  isCopyFileParameters,
  isMoveFileParameters,
  isDeleteDirectoryParameters,
  isReplaceFileContentParameters,
  isAppendFileParameters,
  isInsertFileContentParameters,
  isRunCommandParameters,
  isSetEnvVariableParameters,
} from '@jl-org/nexus-agent'

export interface ToolConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  tools: ToolCall[]
}

export const ToolConfirmationModal = memo<ToolConfirmationModalProps>((props) => {
  const { isOpen, onClose, onConfirm, tools } = props
  const [confirmedTools, setConfirmedTools] = useState<Set<string>>(new Set())

  const handleToolToggle = (toolId: string) => {
    const newConfirmed = new Set(confirmedTools)
    if (newConfirmed.has(toolId)) {
      newConfirmed.delete(toolId)
    } else {
      newConfirmed.add(toolId)
    }
    setConfirmedTools(newConfirmed)
  }

  const handleConfirm = () => {
    onConfirm()
    setConfirmedTools(new Set())
  }

  const handleClose = () => {
    onClose()
    setConfirmedTools(new Set())
  }

  const allConfirmed = tools.length > 0 && confirmedTools.size === tools.length

  const getRiskLevelColor = (level: ToolRiskLevel) => {
    switch (level) {
      case ToolRiskLevel.HIGH:
        return 'text-red-600 bg-red-50 border-red-200'
      case ToolRiskLevel.MEDIUM:
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskLevelText = (level: ToolRiskLevel) => {
    switch (level) {
      case ToolRiskLevel.HIGH:
        return '高风险'
      case ToolRiskLevel.MEDIUM:
        return '中等风险'
      default:
        return '低风险'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onOk={handleConfirm}
      titleText="⚠️ 工具执行确认"
      okText="确认执行"
      cancelText="取消"
      width={600}
      variant="warning"
      showCloseBtn
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">检测到以下工具需要您的确认：</p>
            <p>这些操作可能会修改您的文件或系统，请仔细检查后确认执行。</p>
          </div>
        </div>

        <div className="space-y-3">
          {tools.map((tool) => {
            const isConfirmed = confirmedTools.has(tool.id)
            const riskLevel = getRiskLevel(tool.name)

            return (
              <div
                key={tool.id}
                className={cn(
                  'p-4 border rounded-lg cursor-pointer transition-all duration-200',
                  isConfirmed
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
                onClick={() => handleToolToggle(tool.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isConfirmed ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {getToolDisplayName(tool.name)}
                      </span>
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full border',
                        getRiskLevelColor(riskLevel)
                      )}>
                        {getRiskLevelText(riskLevel)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {getToolDescription(tool)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            已选择 {confirmedTools.size} / {tools.length} 个工具
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!allConfirmed}
              className={cn(
                'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                allConfirmed
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-300 cursor-not-allowed'
              )}
            >
              确认执行
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
})

ToolConfirmationModal.displayName = 'ToolConfirmationModal'

// 辅助函数
function getRiskLevel(toolName: string): ToolRiskLevel {
  const highRiskTools = ['write_file', 'delete_file', 'delete_directory', 'run_command', 'set_env_variable']
  const mediumRiskTools = ['copy_file', 'move_file', 'replace_file_content', 'append_file', 'insert_file_content']

  if (highRiskTools.includes(toolName)) {
    return ToolRiskLevel.HIGH
  }
  if (mediumRiskTools.includes(toolName)) {
    return ToolRiskLevel.MEDIUM
  }
  return ToolRiskLevel.SAFE
}

function getToolDisplayName(toolName: string): string {
  const nameMap: Record<string, string> = {
    write_file: '写入文件',
    delete_file: '删除文件',
    copy_file: '复制文件',
    move_file: '移动文件',
    delete_directory: '删除目录',
    replace_file_content: '替换文件内容',
    append_file: '追加文件内容',
    insert_file_content: '插入文件内容',
    run_command: '执行命令',
    set_env_variable: '设置环境变量',
  }

  return nameMap[toolName] || toolName
}

function getToolDescription(tool: ToolCall): React.ReactNode {
  const { name, parameters } = tool

  switch (name) {
    case 'write_file':
      if (isWriteFileParameters(parameters)) {
        return (
          <div>
            <div>文件路径: <code className="bg-gray-100 px-1 rounded">{parameters.filePath}</code></div>
            <div>内容长度: {parameters.content?.length || 0} 字符</div>
          </div>
        )
      }
      return <div>工具: {name}</div>
    case 'delete_file':
      if (isDeleteFileParameters(parameters)) {
        return <div>文件路径: <code className="bg-gray-100 px-1 rounded">{parameters.filePath}</code></div>
      }
      return <div>工具: {name}</div>
    case 'copy_file':
      if (isCopyFileParameters(parameters)) {
        return (
          <div>
            <div>源文件: <code className="bg-gray-100 px-1 rounded">{parameters.sourcePath}</code></div>
            <div>目标文件: <code className="bg-gray-100 px-1 rounded">{parameters.targetPath}</code></div>
          </div>
        )
      }
      return <div>工具: {name}</div>
    case 'move_file':
      if (isMoveFileParameters(parameters)) {
        return (
          <div>
            <div>源文件: <code className="bg-gray-100 px-1 rounded">{parameters.sourcePath}</code></div>
            <div>目标文件: <code className="bg-gray-100 px-1 rounded">{parameters.targetPath}</code></div>
          </div>
        )
      }
      return <div>工具: {name}</div>
    case 'delete_directory':
      if (isDeleteDirectoryParameters(parameters)) {
        return <div>目录路径: <code className="bg-gray-100 px-1 rounded">{parameters.dirPath}</code></div>
      }
      return <div>工具: {name}</div>
    case 'replace_file_content':
      if (isReplaceFileContentParameters(parameters)) {
        return <div>文件路径: <code className="bg-gray-100 px-1 rounded">{parameters.filePath}</code></div>
      }
      return <div>工具: {name}</div>
    case 'append_file':
      if (isAppendFileParameters(parameters)) {
        return <div>文件路径: <code className="bg-gray-100 px-1 rounded">{parameters.filePath}</code></div>
      }
      return <div>工具: {name}</div>
    case 'insert_file_content':
      if (isInsertFileContentParameters(parameters)) {
        return (
          <div>
            <div>文件路径: <code className="bg-gray-100 px-1 rounded">{parameters.filePath}</code></div>
            <div>插入位置: {parameters.position}</div>
          </div>
        )
      }
      return <div>工具: {name}</div>
    case 'run_command':
      if (isRunCommandParameters(parameters)) {
        return <div>命令: <code className="bg-gray-100 px-1 rounded">{parameters.command}</code></div>
      }
      return <div>工具: {name}</div>
    case 'set_env_variable':
      if (isSetEnvVariableParameters(parameters)) {
        return (
          <div>
            <div>变量名: <code className="bg-gray-100 px-1 rounded">{parameters.name}</code></div>
            <div>变量值: <code className="bg-gray-100 px-1 rounded">{parameters.value}</code></div>
          </div>
        )
      }
      return <div>工具: {name}</div>
    default:
      return <div>工具: {name}</div>
  }
}