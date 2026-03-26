import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'

const app = new Hono()

// 允许开发环境跨域（如果你直接访问后端 API 进行调试）
app.use('/api/*', cors())

// Session ID 缓存：Key 为 Transmission URL, Value 为 Session ID
const sessionCache = new Map<string, string>()

/**
 * 通用转发函数：自动处理 409 Session ID 过期逻辑
 */
async function transmissionRPC(url: string, auth: string, method: string, args: any = {}) {
  let sessionId = sessionCache.get(url) || ''

  const getOptions = (sid: string) => ({
    method: 'POST',
    signal: AbortSignal.timeout(10000), // 10秒超时
    headers: {
      'Authorization': auth.startsWith('Basic ') ? auth : `Basic ${auth}`,
      'X-Transmission-Session-Id': sid,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ method, arguments: args })
  })

  let response: Response
  try {
    response = await fetch(url, getOptions(sessionId))
  } catch (error: any) {
    console.error(`[Network Error] Failed to connect to ${url}`)
    console.error(`  Error: ${error.message}`)
    console.error(`  Code: ${error.code || 'N/A'}`)
    throw new Error(`Cannot reach Transmission server at ${url}. Check if server is running and network is accessible.`)
  }

  // 409 代表 Session ID 失效，需要从 Header 拿新的并重试
  if (response.status === 409) {
    sessionId = response.headers.get('X-Transmission-Session-Id') || ''
    if (sessionId) {
      sessionCache.set(url, sessionId)
      try {
        response = await fetch(url, getOptions(sessionId))
      } catch (error: any) {
        console.error(`[Network Error] Retry failed for ${url}`)
        throw error
      }
    }
  }

  return response.json()
}

// --- 路由 ---

// 1. 测试连通性
app.get('/api/ping', (c) => c.text('Sanemi is breathing...'))

// 2. 诊断工具：测试与 Transmission 的直接连接
app.get('/api/diagnose', async (c) => {
  const targetUrl = 'http://192.168.1.109:49092/transmission/rpc'
  
  try {
    // 尝试建立基本连接
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ method: 'session-get', arguments: {} })
    })
    
    clearTimeout(timeout)
    
    return c.json({
      status: 'ok',
      message: 'Connection successful',
      httpStatus: response.status,
      headers: Object.fromEntries(response.headers)
    })
  } catch (error: any) {
    return c.json({
      status: 'error',
      message: error.message,
      code: error.code,
      errno: error.errno
    }, 500)
  }
})

// 2. 统一代理接口
app.post('/api/proxy', async (c) => {
  const targetUrl = c.req.header('x-target-url') // 前端传来的 RPC 地址
  const targetAuth = c.req.header('x-target-auth') // 前端传来的加密 Auth

  if (!targetUrl || !targetAuth) {
    return c.json({ error: '缺少认证信息 (x-target-url, x-target-auth)' }, 400)
  }

  try {
    const { method, arguments: args } = await c.req.json()
    const result = await transmissionRPC(targetUrl, targetAuth, method, args)
    return c.json(result)
  } catch (e: any) {
    console.error('Proxy Error:', e)
    return c.json({ result: 'error', message: e.message || '连接 Transmission 失败' }, 500)
  }
})

// 启动服务器
const port = 3000
console.log(`🌪️  Sanemi Backend 启动在 http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})