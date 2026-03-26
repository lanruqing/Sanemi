import React, { useState } from 'react'
import axios from 'axios'

// 定义种子数据结构
interface Torrent {
  id: number
  name: string
  percentDone: number
  rateDownload: number
  status: number
}

export default function TransmissionExample() {
  // --- 1. 初始化服务器信息 (State) ---
  const [config, setConfig] = useState({
    rpcUrl: 'http://192.168.50.109:49092/transmission/rpc', // 默认值
    username: 'qnap',
    password: 'qnap'
  })

  const [torrents, setTorrents] = useState<Torrent[]>([])
  const [loading, setLoading] = useState(false)

  // --- 2. 获取种子列表 (Axios 请求) ---
  const fetchTorrents = async () => {
    if (!config.rpcUrl || !config.username || !config.password) {
      alert('请先完善服务器配置')
      return
    }

    setLoading(true)
    
    // 生成 Basic Auth (Base64编码 username:password)
    // 注意：这里是在前端生成，通过 Header 传给后端代理
    const auth = btoa(`${config.username}:${config.password}`)

    try {
      // 请求指向本地 Hono 后端
      const response = await axios.post('http://localhost:3000/api/proxy', {
        method: 'torrent-get',
        arguments: {
          fields: ['id', 'name', 'percentDone', 'rateDownload', 'status']
        }
      }, {
        headers: {
          // 核心：告诉后端代理去连接哪里
          'x-target-url': config.rpcUrl,
          'x-target-auth': auth
        }
      })

      const data = response.data
      if (data.result === 'success') {
        setTorrents(data.arguments.torrents)
      } else {
        console.error('RPC Error:', data)
        alert('Transmission 返回错误: ' + data.result)
      }
    } catch (error: any) {
      console.error('Network Error:', error)
      alert('请求失败: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  // --- 3. 渲染 UI (Braun Style) ---
  return (
    <div className="min-h-screen bg-[#EBEBEB] p-8 font-sans text-[#202020]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* 标题 */}
        <h1 className="text-2xl font-bold tracking-tight text-[#202020]">Sanemi Protocol</h1>

        {/* 配置卡片 */}
        <div className="bg-[#F5F5F5] border border-[#C0C0C0] rounded-[2px] p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#707070] mb-4 border-b border-[#C0C0C0] pb-2">
            Connection Setup
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">RPC URL</label>
              <input 
                type="text" 
                className="w-full bg-[#EBEBEB] border border-[#C0C0C0] p-2 text-sm rounded-[2px] focus:outline-none focus:border-[#8AA68A]"
                value={config.rpcUrl}
                onChange={e => setConfig({...config, rpcUrl: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">USERNAME</label>
                <input 
                  type="text" 
                  className="w-full bg-[#EBEBEB] border border-[#C0C0C0] p-2 text-sm rounded-[2px] focus:outline-none focus:border-[#8AA68A]"
                  value={config.username}
                  onChange={e => setConfig({...config, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">PASSWORD</label>
                <input 
                  type="password" 
                  className="w-full bg-[#EBEBEB] border border-[#C0C0C0] p-2 text-sm rounded-[2px] focus:outline-none focus:border-[#8AA68A]"
                  value={config.password}
                  onChange={e => setConfig({...config, password: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={fetchTorrents}
              disabled={loading}
              className="bg-[#FF4500] text-white px-6 py-2 text-sm font-bold uppercase tracking-wide rounded-[2px] hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect & Fetch'}
            </button>
          </div>
        </div>

        {/* 列表展示区域 */}
        <div className="bg-[#F5F5F5] border border-[#C0C0C0] rounded-[2px] overflow-hidden">
          <div className="px-4 py-2 bg-[#EBEBEB] border-b border-[#C0C0C0] flex justify-between items-center">
            <span className="text-xs font-bold text-[#707070]">TORRENT LIST</span>
            <span className="text-xs font-mono text-[#707070]">{torrents.length} ITEMS</span>
          </div>
          
          {torrents.length === 0 ? (
            <div className="p-8 text-center text-[#707070] text-sm">No active torrents found.</div>
          ) : (
            <ul className="divide-y divide-[#C0C0C0]">
              {torrents.map(t => (
                <li key={t.id} className="p-4 hover:bg-[#EBEBEB] transition-colors">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm truncate pr-4">{t.name}</span>
                    <span className="text-xs font-mono text-[#707070]">{(t.rateDownload / 1024).toFixed(1)} KB/s</span>
                  </div>
                  {/* 进度条 (Sanemi Wind Color) */}
                  <div className="h-1 w-full bg-[#E0E0E0] rounded-[1px] overflow-hidden">
                    <div 
                      className="h-full bg-[#8AA68A]" 
                      style={{ width: `${t.percentDone * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
