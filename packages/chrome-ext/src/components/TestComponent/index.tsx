import { cn } from '@/utils'
import { Modal } from '@/components/Modal'
import { detectDangerousTools, generateToolDescription } from '@/utils/toolDetector'
import { memo, useState } from 'react'

export const TestComponent = memo<TestComponentProps>((props) => {
  const {
    style,
    className,
  } = props

  const [testXml, setTestXml] = useState(`<tools>
[
  {
    "name": "write_file",
    "parameters": {
      "filePath": "test.txt",
      "content": "Hello World"
    }
  },
  {
    "name": "run_command",
    "parameters": {
      "command": "echo 'test'"
    }
  }
]
</tools>`)

  const handleTestDetection = () => {
    const dangerousTools = detectDangerousTools(testXml)
    const descriptions = dangerousTools.map(generateToolDescription).join('\n')

    Modal.warning({
      titleText: '工具检测测试',
      children: `检测到以下危险工具：\n\n${descriptions}`,
      onOk: () => console.log('用户确认了工具执行'),
      onClose: () => console.log('用户取消了工具执行'),
    })
  }

  const handleTestModal = () => {
    Modal.success({
      titleText: '成功测试',
      okText: '确定',
      children: '这是一个成功提示的测试',
      onOk: () => console.log('成功测试确认'),
    })
  }

  return (
    <div
      className={cn(
        'TestComponentContainer',
        'max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6',
        className,
      )}
      style={style}
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        工具检测和 Modal 测试
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            测试 XML 内容：
          </label>
          <textarea
            value={testXml}
            onChange={(e) => setTestXml(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="输入包含工具的 XML 内容"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleTestDetection}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            测试工具检测
          </button>
          <button
            onClick={handleTestModal}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            测试 Modal
          </button>
        </div>
      </div>
    </div>
  )
})

TestComponent.displayName = 'TestComponent'

export type TestComponentProps = React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>