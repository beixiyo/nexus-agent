import type { ToolCall } from 'nexus-common'
import { AlertTriangle, Check } from 'lucide-react'
import {
  isAppendFileParameters,
  isCopyFileParameters,
  isDeleteDirectoryParameters,
  isDeleteFileParameters,
  isInsertFileContentParameters,
  isMoveFileParameters,
  isReplaceFileContentParameters,
  isRunCommandParameters,
  isSetEnvVariableParameters,
  isWriteFileParameters,
} from 'nexus-common'
import React, { memo, useState } from 'react'
import { ToolRiskLevel } from '@/config'
import { cn } from '@/utils'
import { Modal } from '../Modal'

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
    }
    else {
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
      isOpen={ isOpen }
      onClose={ handleClose }
      onOk={ handleConfirm }
      titleText="⚠️ 工具执行确认"
      okText="确认执行"
      cancelText="取消"
      width={ 600 }
      variant="warning"
      showCloseBtn
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 border border-yellow-200 rounded-lg bg-yellow-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            <p className="mb-1 font-medium">检测到以下工具需要您的确认：</p>
            <p>这些操作可能会修改您的文件或系统，请仔细检查后确认执行。</p>
          </div>
        </div>

        <div className="space-y-3">
          { tools.map((tool) => {
            const isConfirmed = confirmedTools.has(tool.id)
            const riskLevel = getRiskLevel(tool.name)

            return (
              <div
                key={ tool.id }
                className={ cn(
                  'p-4 border rounded-lg cursor-pointer transition-all duration-200',
                  isConfirmed
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300',
                ) }
                onClick={ () => handleToolToggle(tool.id) }
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    { isConfirmed
                      ? (
                          <Check className="h-4 w-4 text-green-600" />
                        )
                      : (
                          <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                        ) }
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        { getToolDisplayName(tool.name) }
                      </span>
                      <span className={ cn(
                        'px-2 py-1 text-xs font-medium rounded-full border',
                        getRiskLevelColor(riskLevel),
                      ) }>
                        { getRiskLevelText(riskLevel) }
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      { getToolDescription(tool) }
                    </div>
                  </div>
                </div>
              </div>
            )
          }) }
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-600">
            已选择
            { ' ' }
            { confirmedTools.size }
            { ' ' }
            /
            { ' ' }
            { tools.length }
            { ' ' }
            个工具
          </div>

          <div className="flex gap-2">
            <button
              onClick={ handleClose }
              className="border border-gray-300 rounded-lg bg-white px-4 py-2 text-sm text-gray-700 font-medium transition-colors hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={ handleConfirm }
              disabled={ !allConfirmed }
              className={ cn(
                'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                allConfirmed
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-300 cursor-not-allowed',
              ) }
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

/** 辅助函数 */
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
            <div>
              文件路径:
              <code className="rounded bg-gray-100 px-1">{ parameters.filePath }</code>
            </div>
            <div>
              内容长度:
              { parameters.content?.length || 0 }
              { ' ' }
              字符
            </div>
          </div>
        )
      }
      return <div>
        工具:
        { name }
      </div>
    case 'delete_file':
      if (isDeleteFileParameters(parameters)) {
        return <div>
          文件路径:
          <code className="rounded bg-gray-100 px-1">{ parameters.filePath }</code>
        </div>
      }
      return <div>
        工具:
        { name }
      </div>
    case 'copy_file':
      if (isCopyFileParameters(parameters)) {
        return (
          <div>
            <div>
              源文件:
              <code className="rounded bg-gray-100 px-1">{ parameters.sourcePath }</code>
            </div>
            <div>
              目标文件:
              <code className="rounded bg-gray-100 px-1">{ parameters.targetPath }</code>
            </div>
          </div>
        )
      }
      return <div>
        工具:
        { name }
      </div>
    case 'move_file':
      if (isMoveFileParameters(parameters)) {
        return (
          <div>
            <div>
              源文件:
              <code className="rounded bg-gray-100 px-1">{ parameters.sourcePath }</code>
            </div>
            <div>
              目标文件:
              <code className="rounded bg-gray-100 px-1">{ parameters.targetPath }</code>
            </div>
          </div>
        )
      }
      return <div>
        工具:
        { name }
      </div>
    case 'delete_directory':
      if (isDeleteDirectoryParameters(parameters)) {
        return <div>
          目录路径:
          <code className="rounded bg-gray-100 px-1">{ parameters.dirPath }</code>
        </div>
      }
      return <div>
        工具:
        { name }
      </div>
    case 'replace_file_content':
      if (isReplaceFileContentParameters(parameters)) {
        return <div>
          文件路径:
          <code className="rounded bg-gray-100 px-1">{ parameters.filePath }</code>
        </div>
      }
      return <div>
        工具:
        { name }
      </div>
    case 'append_file':
      if (isAppendFileParameters(parameters)) {
        return <div>
          文件路径:
          <code className="rounded bg-gray-100 px-1">{ parameters.filePath }</code>
        </div>
      }
      return <div>
        工具:
        { name }
      </div>
    case 'insert_file_content':
      if (isInsertFileContentParameters(parameters)) {
        return (
          <div>
            <div>
              文件路径:
              <code className="rounded bg-gray-100 px-1">{ parameters.filePath }</code>
            </div>
            <div>
              插入位置:
              { parameters.position }
            </div>
          </div>
        )
      }
      return <div>
        工具:
        { name }
      </div>
    case 'run_command':
      if (isRunCommandParameters(parameters)) {
        return <div>
          命令:
          <code className="rounded bg-gray-100 px-1">{ parameters.command }</code>
        </div>
      }
      return <div>
        工具:
        { name }
      </div>
    case 'set_env_variable':
      if (isSetEnvVariableParameters(parameters)) {
        return (
          <div>
            <div>
              变量名:
              <code className="rounded bg-gray-100 px-1">{ parameters.name }</code>
            </div>
            <div>
              变量值:
              <code className="rounded bg-gray-100 px-1">{ parameters.value }</code>
            </div>
          </div>
        )
      }
      return <div>
        工具:
        { name }
      </div>
    default:
      return <div>
        工具:
        { name }
      </div>
  }
}
