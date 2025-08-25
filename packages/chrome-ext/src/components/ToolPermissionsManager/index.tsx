import type { ToolPermissions } from '@/config'
import { memo, useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { DANGEROUS_TOOLS, TOOL_RISK_CONFIG, ToolRiskLevel } from '@/config'
import { ChromeStorage } from '@/utils'

export const ToolPermissionsManager = memo(() => {
  const [permissions, setPermissions] = useState<ToolPermissions>({
    authorizedTools: [],
    autoConfirm: false,
    lastUpdated: Date.now(),
  })
  const [loading, setLoading] = useState(true)

  /** 加载权限设置 */
  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = async () => {
    try {
      const storedPermissions = await ChromeStorage.getToolPermissions()
      setPermissions(storedPermissions)
    }
    catch (error) {
      console.error('加载权限设置失败:', error)
    }
    finally {
      setLoading(false)
    }
  }

  /** 切换工具授权状态 */
  const toggleToolAuthorization = async (toolName: string) => {
    const isAuthorized = permissions.authorizedTools.includes(toolName as any)

    if (isAuthorized) {
      await ChromeStorage.revokeToolAuthorization(toolName as any)
    }
    else {
      await ChromeStorage.authorizeTool(toolName as any)
    }

    await loadPermissions()
  }

  /** 切换自动确认状态 */
  const toggleAutoConfirm = async () => {
    const newAutoConfirm = !permissions.autoConfirm
    await ChromeStorage.setAutoConfirm(newAutoConfirm)
    await loadPermissions()
  }

  /** 重置所有设置 */
  const resetAll = async () => {
    await ChromeStorage.clearAll()
    await loadPermissions()
  }

  /** 获取风险等级图标 */
  const getRiskIcon = (level: ToolRiskLevel) => {
    switch (level) {
      case ToolRiskLevel.HIGH:
        return '🔴'
      case ToolRiskLevel.MEDIUM:
        return '🟡'
      case ToolRiskLevel.SAFE:
        return '🟢'
      default:
        return '⚪'
    }
  }

  /** 获取风险等级文本 */
  const getRiskText = (level: ToolRiskLevel) => {
    switch (level) {
      case ToolRiskLevel.HIGH:
        return '高风险'
      case ToolRiskLevel.MEDIUM:
        return '中等风险'
      case ToolRiskLevel.SAFE:
        return '安全'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">加载中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 自动确认设置 */ }
      <Card className="w-full" shadow="sm" rounded="md" padding="sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-800 font-medium dark:text-white">
              🤖 自动确认
            </h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              启用后，已授权的工具将自动执行，不再弹窗确认
            </p>
          </div>
          <Checkbox
            checked={ permissions.autoConfirm }
            onChange={ toggleAutoConfirm }
            size={ 20 }
          />
        </div>
      </Card>

      {/* 工具权限列表 */ }
      <Card className="w-full" shadow="sm" rounded="md" padding="sm">
        <div className="mb-3">
          <h3 className="text-sm text-gray-800 font-medium dark:text-white">
            🛠️ 工具权限管理
          </h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            勾选以下工具表示您同意其执行，将不再弹窗确认
          </p>
        </div>

        <div className="space-y-2">
          { DANGEROUS_TOOLS.map((toolName) => {
            const riskLevel = TOOL_RISK_CONFIG[toolName]
            const isAuthorized = permissions.authorizedTools.includes(toolName)

            return (
              <div
                key={ toolName }
                className="flex items-center justify-between border border-gray-200 rounded p-2 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{ getRiskIcon(riskLevel) }</span>
                  <div>
                    <span className="text-xs text-gray-800 font-medium dark:text-white">
                      { toolName }
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        { getRiskText(riskLevel) }
                      </span>
                      { isAuthorized && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          ✓ 已授权
                        </span>
                      ) }
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={ isAuthorized }
                  onChange={ () => toggleToolAuthorization(toolName) }
                  size={ 16 }
                />
              </div>
            )
          }) }
        </div>
      </Card>

      {/* 操作按钮 */ }
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={ resetAll }
          className="text-xs"
        >
          🔄 重置所有设置
        </Button>
      </div>
    </div>
  )
})

ToolPermissionsManager.displayName = 'ToolPermissionsManager'
