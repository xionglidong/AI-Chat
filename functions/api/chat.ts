/**
 * AI聊天API接口
 * 
 * 这个文件实现了与OpenAI API的通信接口，处理聊天请求和响应。
 * 支持流式和非流式两种响应模式，并提供GraphQL风格的API接口。
 * 
 * 主要功能：
 * - 验证请求格式和内容类型
 * - 处理聊天消息和模型参数
 * - 调用OpenAI API获取AI回复
 * - 支持流式响应以提高用户体验
 * - 错误处理和状态码管理
 */

// 定义API函数类型，接收包含OPENAI_API_KEY的环境变量
export const onRequestPost: PagesFunction<{ OPENAI_API_KEY: string }> = async (context) => {
  try {
    // 验证请求体格式：期望 { query, variables }
    const contentType = context.request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ errors: [{ message: 'Expected application/json' }] }), { status: 400 })
    }
    
    // 解析请求体JSON数据
    const body = await context.request.json()
    const variables = body.variables || {}
    
    // 设置默认参数：模型和消息
    const model = variables.model || 'gpt-4o-mini'  // 默认使用GPT-4o-mini模型
    const messages = variables.messages || [{ role: 'user', content: 'Hello' }]  // 默认消息
    const stream = Boolean(variables.stream)  // 是否启用流式响应

    // 构建发送给OpenAI的请求载荷
    const payload: any = { model, messages }
    if (stream) payload.stream = true  // 流式响应参数
    if (variables.temperature !== undefined) payload.temperature = variables.temperature  // 温度参数（控制回复随机性）

    // 调用OpenAI API
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,  // 使用环境变量中的API密钥
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    // 处理API错误响应
    if (!apiRes.ok) {
      const txt = await apiRes.text()
      return new Response(txt, { status: apiRes.status, headers: { 'Content-Type': 'text/plain' } })
    }

    // 处理流式响应
    if (stream) {
      // 直接转发流式数据，保持text/event-stream格式
      const ct = apiRes.headers.get('Content-Type') || 'text/event-stream'
      return new Response(apiRes.body, { headers: { 'Content-Type': ct } })
    }

    // 处理非流式响应
    const data = await apiRes.json()
    // 返回GraphQL风格的响应格式：{ data: ... }
    return new Response(JSON.stringify({ data }), { headers: { 'Content-Type': 'application/json' } })

  } catch (err: any) {
    // 统一错误处理，返回标准错误格式
    return new Response(JSON.stringify({ errors: [{ message: err.message || String(err) }] }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
