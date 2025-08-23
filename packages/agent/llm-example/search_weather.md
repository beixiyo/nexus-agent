<user_task>深圳今天天气怎么样？</user_task>
<thinking>我需要获取深圳今天的天气信息。可以使用 search_web 工具搜索"深圳今天天气"来获取相关信息。</thinking>
<tools>
[
  {
    "id": "1",
    "name": "search_web",
    "parameters": {
      "query": "深圳今天天气"
    }
  }
]
</tools>
<tools_result>
[
  {
    "id": "1",
    "result": "{\\n  \\"success\\": true,\\n  \\"data\\": \\"今天深圳气温31度，多云\\"\\n}"
  }
]
</tools_result>
<thinking>搜索结果显示了深圳今天的天气情况，数据清晰明确。</thinking>
<final_answer>今天深圳的天气是多云，气温31度。</final_answer>
