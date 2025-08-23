import type { AgentResponse } from './types'
import { Log } from '@/utils'
import { ParseState } from './types'

const USER_TASK_START_TAG = 'user_task'
const USER_TASK_END_TAG = '/user_task'
const THINKING_START_TAG = 'thinking'
const THINKING_END_TAG = '/thinking'
const TOOLS_START_TAG = 'tools'
const TOOLS_END_TAG = '/tools'
const TOOLS_RESULT_START_TAG = 'tools_result'
const TOOLS_RESULT_END_TAG = '/tools_result'
const FINAL_ANSWER_START_TAG = 'final_answer'
const FINAL_ANSWER_END_TAG = '/final_answer'

/**
 * 状态机 XML 解析器，解析 LLM 输出，返回 AgentResponse 对象
 */
export class XMLStateMachineParser {
  private state: ParseState
  private response: AgentResponse
  private buffer: string
  private inTag: boolean
  private currentTag: string

  constructor() {
    this.state = ParseState.NONE
    this.response = {
      user_task: '',
      thinking: '',
      tools: [],
      tools_result: '',
      final_answer: '',
    }
    this.buffer = ''
    this.inTag = false
    this.currentTag = ''
  }

  /**
   * 处理单个字符
   * @param char - 输入字符
   */
  processChar(char: string): void {
    /** 检查是否进入标签 */
    if (char === '<' && !this.inTag) {
      this.inTag = true
      this.currentTag = ''
      return
    }

    /** 检查是否离开标签 */
    if (char === '>' && this.inTag) {
      this.inTag = false

      /** 确定新状态 */
      if (this.currentTag === USER_TASK_START_TAG) {
        this.state = ParseState.USER_TASK
        this.response.user_task = ''
      }
      else if (this.currentTag === USER_TASK_END_TAG) {
        this.state = ParseState.NONE
      }
      else if (this.currentTag === THINKING_START_TAG) {
        this.state = ParseState.THINKING
        this.response.thinking = ''
      }
      else if (this.currentTag === THINKING_END_TAG) {
        this.state = ParseState.NONE
      }
      else if (this.currentTag === TOOLS_START_TAG) {
        this.state = ParseState.TOOLS
        this.response.tools = []
        this.buffer = ''
      }
      else if (this.currentTag === TOOLS_END_TAG) {
        try {
          const parsed = JSON.parse(this.buffer.trim())
          /** 处理单个工具和多个工具 */
          this.response.tools = Array.isArray(parsed)
            ? parsed
            : [parsed]
        }
        catch (e: any) {
          Log.error(`解析 tools JSON 失败 ${e?.message}`)
        }
        this.state = ParseState.NONE
        this.buffer = ''
      }
      else if (this.currentTag === TOOLS_RESULT_START_TAG) {
        this.state = ParseState.TOOL_RESULT
        this.response.tools_result = ''
      }
      else if (this.currentTag === TOOLS_RESULT_END_TAG) {
        this.state = ParseState.NONE
      }
      else if (this.currentTag === FINAL_ANSWER_START_TAG) {
        this.state = ParseState.FINAL_ANSWER
        this.response.final_answer = ''
      }
      else if (this.currentTag === FINAL_ANSWER_END_TAG) {
        this.state = ParseState.NONE
      }

      return
    }

    /** 在标签内累积标签名 */
    if (this.inTag) {
      this.currentTag += char
      return
    }

    /** 根据当前状态处理内容 */
    switch (this.state) {
      case ParseState.USER_TASK:
        this.response.user_task += char
        break
      case ParseState.THINKING:
        this.response.thinking += char
        break
      case ParseState.TOOLS:
        this.buffer += char
        break
      case ParseState.TOOL_RESULT:
        this.response.tools_result += char
        break
      case ParseState.FINAL_ANSWER:
        this.response.final_answer += char
        break
    }
  }

  /**
   * 处理字符串
   * @param str - 输入字符串
   */
  processString(str: string): void {
    for (let i = 0; i < str.length; i++) {
      this.processChar(str[i])
    }
  }

  /**
   * 获取当前解析结果
   * @returns 解析结果
   */
  getResult(): AgentResponse {
    return { ...this.response }
  }

  /**
   * 重置解析器状态
   */
  reset(): void {
    this.state = ParseState.NONE
    this.response = {
      user_task: '',
      thinking: '',
      tools: [],
      tools_result: '',
      final_answer: '',
    }
    this.buffer = ''
    this.inTag = false
    this.currentTag = ''
  }
}

/**
 * 流式解析 LLM 输出的 XML 内容
 * @param xmlContent - LLM 输出的原始 XML 内容
 * @returns 解析后的 Agent 响应对象
 */
export function parseXMLResponse(xmlContent: string): AgentResponse | null {
  /** 移除可能的代码块标记 */
  const cleanContent = xmlContent.replace(/```xml\s*|\s*```/g, '').trim()

  Log.debug(`开始解析 XML 内容，长度: ${cleanContent.length}`)

  const parser = new XMLStateMachineParser()
  parser.processString(cleanContent)

  const result = parser.getResult()
  const hasPartRes = Object.values(result).some(v => v !== '')

  if (hasPartRes) {
    Log.debug(`XML 解析完成: ${JSON.stringify(result, null, 2)}`)
    return result
  }

  Log.warn('XML 内容为空或无法解析')
  return null
}
