import { useState } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    setLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'mutation { chat { choices { message { content } } } }',
          variables: {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: input }],
            stream: false
          }
        })
      })
      if (!res.ok) {
        const txt = await res.text()
        setOutput('Error: ' + txt)
      } else {
        const json = await res.json()
        // Note: Pages function wraps response as { data: { data } } in our template; adjust if needed
        const maybeData = json.data || json
        const content = maybeData?.choices?.[0]?.message?.content || maybeData?.chat?.choices?.[0]?.message?.content || JSON.stringify(json)
        setOutput(content)
      }
    } catch (e: any) {
      setOutput('Fetch error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: 'auto', padding: 20 }}>
      <h1>Cloudflare Pages + OpenAI (GraphQL)</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        style={{ width: '100%', fontSize: 16 }}
        placeholder="输入你的问题..."
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={sendMessage} disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? '发送中...' : '发送'}
        </button>
      </div>

      <h3>回复：</h3>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f8fa', padding: 12, borderRadius: 6 }}>{output}</pre>
      <p style={{ color: '#666' }}>注意：部署到 Cloudflare Pages 后，请在 Pages settings 添加环境变量 <code>OPENAI_API_KEY</code></p>
    </div>
  )
}

export default App
