import { TestComponent } from './index'

export function TestComponentDemo() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            工具检测和 Modal 测试
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            测试 toolDetector.ts 和 Modal 组件的功能
          </p>
        </div>

        <TestComponent />
      </div>
    </div>
  )
}