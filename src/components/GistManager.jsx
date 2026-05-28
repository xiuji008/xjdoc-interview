/**
 * Gist 数据可视化查看与编辑页面
 *
 * 按数据类型分类展示：
 * - 阅读量数据：表格 + 排序
 * - 修仙数据：卡片详情
 * - 其他数据：分类列出
 * - 同时支持原始 JSON 预览和编辑
 *
 * 破坏性操作按钮（清空、删除、修改）默认隐藏，
 * 需在顶部导航栏连击3次 ⚙️ 灵蕴天碑 后才会显示。
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { loadAllGistData, saveAllGistData, isGistConfigured } from '../utils/gistStore'
import { verifyPassword } from '../utils/passwordGuard'

export default function GistManager() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [rawOpen, setRawOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [formatError, setFormatError] = useState('')

  // 密码模态框
  const [passwordModal, setPasswordModal] = useState({ open: false, action: null })
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // 修改阅读量模态框
  const [editViewsModal, setEditViewsModal] = useState({ open: false, slug: '', currentViews: 0 })
  const [editViewsInput, setEditViewsInput] = useState('')

  const configured = isGistConfigured()

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const d = await loadAllGistData()
      setData(d)
      setEditContent(JSON.stringify(d, null, 2))
    } catch (err) {
      setError(`加载失败: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // 按类型分类数据
  const { pageViews, cultivationData, otherData } = useMemo(() => {
    if (!data) return { pageViews: [], cultivationData: {}, otherData: {} }
    const pv = []
    const cult = {}
    const other = {}
    for (const [k, v] of Object.entries(data)) {
      if (k === '_cultivation_previousScore') cult.previousScore = v
      else if (k === '_cultivation_history') cult.history = v
      else if (k.startsWith('_')) other[k] = v
      else if (typeof v === 'number') pv.push({ slug: k, views: v })
    }
    pv.sort((a, b) => b.views - a.views)
    return { pageViews: pv, cultivationData: cult, otherData: other }
  }, [data])

  const totalSize = data ? new Blob([JSON.stringify(data)]).size : 0

  const handleToggleRaw = () => {
    if (rawOpen && editing) { setEditing(false) }
    setRawOpen(!rawOpen)
  }

  const handleEdit = () => { setEditing(true); setFormatError('') }

  const handleCancelEdit = () => {
    setEditing(false)
    setEditContent(JSON.stringify(data, null, 2))
    setFormatError('')
  }

  const handleSave = async () => {
    setSaving(true); setMsg(''); setFormatError('')
    try {
      const parsed = JSON.parse(editContent)
      await saveAllGistData(parsed)
      setData(parsed); setEditing(false)
      setMsg('✅ 保存成功！')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setFormatError(`JSON 格式错误: ${err.message}`)
    } finally { setSaving(false) }
  }

  // ===== 带密码保护的破坏性操作 =====

  const handleDeleteKey = (key) => {
    setPasswordModal({ open: true, action: { type: 'deleteKey', key } })
  }

  const handleClearViews = () => {
    setPasswordModal({ open: true, action: { type: 'clearViews' } })
  }

  const handleModifyViews = (slug, currentViews) => {
    setPasswordModal({ open: true, action: { type: 'modifyViews', slug, currentViews } })
  }

  // 密码确认后执行
  const executeWithPassword = async () => {
    const ok = await verifyPassword(passwordInput)
    if (!ok) {
      setPasswordError('密码错误，请重试')
      return
    }
    setPasswordError('')
    setPasswordInput('')

    const { action } = passwordModal
    setPasswordModal({ open: false, action: null })

    if (!action) return

    if (action.type === 'clearViews') {
      const d = {}
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith('_')) d[k] = v
      }
      await saveAllGistData(d)
      setData(d)
      setEditContent(JSON.stringify(d, null, 2))
      setMsg('✅ 已清空阅读量')
    } else if (action.type === 'deleteKey' && action.key) {
      const d = { ...data }
      delete d[action.key]
      await saveAllGistData(d)
      setData(d)
      setEditContent(JSON.stringify(d, null, 2))
      setMsg(`✅ 已删除「${action.key}」`)
    } else if (action.type === 'modifyViews') {
      // 密码正确后打开修改阅读量弹窗
      setEditViewsModal({ open: true, slug: action.slug, currentViews: action.currentViews })
      setEditViewsInput(String(action.currentViews))
    }
    setTimeout(() => setMsg(''), 3000)
  }

  // 保存修改后的阅读量
  const handleSaveViews = async () => {
    const newVal = parseInt(editViewsInput, 10)
    if (isNaN(newVal) || newVal < 0) {
      setMsg('❌ 请输入有效的非负整数')
      setTimeout(() => setMsg(''), 3000)
      return
    }
    const slug = editViewsModal.slug
    const d = { ...data }
    d[slug] = newVal
    await saveAllGistData(d)
    setData(d)
    setEditContent(JSON.stringify(d, null, 2))
    setEditViewsModal({ open: false, slug: '', currentViews: 0 })
    setMsg(`✅ 已将「${slug}」阅读量改为 ${newVal}`)
    setTimeout(() => setMsg(''), 3000)
  }

  const notConfigured = !configured && !data

  return (
    <div className="gist-manager">
      <h2
        className="gist-manager-title"
        style={{ cursor: 'default' }}
        onClick={(e) => {
          if (e.detail === 3) setShowActions(!showActions)
        }}
      >
        ⚙️ 灵蕴天碑{showActions ? ' 🔓' : ''}
      </h2>
      <p className="gist-manager-subtitle">
        {configured ? 'Gist 已连接 · 数据可视化查看' : 'localStorage 降级模式 · 数据仅本地保存'}
        {showActions && (
          <span style={{ marginLeft: 8, color: '#f44336', fontWeight: 600 }}>🔓 管理模式已激活</span>
        )}
      </p>
      {msg && <div className="gist-manager-msg">{msg}</div>}

      {loading && (
        <div className="gist-manager-loading">
          <div className="loading-spinner" />
          <p>读取中...</p>
        </div>
      )}

      {error && (
        <div className="gist-manager-error">
          <p>{error}</p>
          <button className="gist-btn" onClick={loadData}>🔄 重试</button>
        </div>
      )}

      {notConfigured && (
        <div className="gist-manager-warning">
          <h2>Gist 未配置</h2>
          <p>请在 <code>.env</code> 设置 <code>VITE_GIST_ID</code> 和 <code>VITE_GIST_TOKEN</code></p>
        </div>
      )}

      {data && (
        <>
          {/* 概览卡片 */}
          <div className="gist-summary-cards">
            <div className="gist-summary-card">
              <span className="gist-summary-label">阅读量条目</span>
              <span className="gist-summary-value">{pageViews.length}</span>
            </div>
            <div className="gist-summary-card">
              <span className="gist-summary-label">修仙数据</span>
              <span className="gist-summary-value">{Object.keys(cultivationData).length}</span>
            </div>
            <div className="gist-summary-card">
              <span className="gist-summary-label">总数据量</span>
              <span className="gist-summary-value">{totalSize < 1024 ? `${totalSize} B` : `${(totalSize / 1024).toFixed(1)} KB`}</span>
            </div>
          </div>

          {/* 阅读量表格 */}
          {pageViews.length > 0 && (
            <section className="gist-card">
              <div className="gist-card-header">
                <h3 className="gist-card-title">👁️ 阅读量排行</h3>
                <div className="gist-card-actions">
                  <span className="gist-card-count">{pageViews.length} 条</span>
                  {showActions && (
                    <button className="gist-btn gist-btn-danger" onClick={handleClearViews}>🗑️ 清空</button>
                  )}
                </div>
              </div>
              <div className="gist-table-wrap">
                <table className="gist-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>文档标识</th>
                      <th>阅读量</th>
                      {showActions && <th>操作</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {pageViews.map((item, i) => (
                      <tr key={item.slug}>
                        <td className="gist-td-num">{i + 1}</td>
                        <td><code>{item.slug}</code></td>
                        <td className="gist-td-num"><strong>{item.views}</strong></td>
                        {showActions && (
                          <td style={{ display: 'flex', gap: 4, padding: '6px 14px' }}>
                            <button className="gist-btn-sm" onClick={() => handleModifyViews(item.slug, item.views)}>修改</button>
                            <button className="gist-btn-sm gist-btn-danger" onClick={() => handleDeleteKey(item.slug)}>删除</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 修仙数据 */}
          {Object.keys(cultivationData).length > 0 && (
            <section className="gist-card">
              <div className="gist-card-header">
                <h3 className="gist-card-title">⚡ 修仙数据</h3>
              </div>
              <div className="gist-cult-grid">
                {cultivationData.previousScore !== undefined && (
                  <div className="gist-cult-item">
                    <span className="gist-cult-label">上次修为值</span>
                    <span className="gist-cult-value">{cultivationData.previousScore}</span>
                  </div>
                )}
                {cultivationData.history && (
                  <div className="gist-cult-item">
                    <span className="gist-cult-label">突破记录</span>
                    <span className="gist-cult-value">{Array.isArray(cultivationData.history) ? cultivationData.history.length : 0} 条</span>
                  </div>
                )}
              </div>
              {cultivationData.history && Array.isArray(cultivationData.history) && cultivationData.history.length > 0 && (
                <details className="gist-details">
                  <summary>查看突破详情</summary>
                  <pre className="gist-pre-sm">{JSON.stringify(cultivationData.history, null, 2)}</pre>
                </details>
              )}
            </section>
          )}

          {/* 其他数据 */}
          {Object.keys(otherData).length > 0 && (
            <section className="gist-card">
              <div className="gist-card-header">
                <h3 className="gist-card-title">📦 其他数据</h3>
                <span className="gist-card-count">{Object.keys(otherData).length} 条</span>
              </div>
              <div className="gist-table-wrap">
                <table className="gist-table">
                  <thead>
                    <tr>
                      <th>键名</th>
                      <th>类型</th>
                      <th>数据预览</th>
                      {showActions && <th>操作</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(otherData).map(([k, v]) => (
                      <tr key={k}>
                        <td><code>{k}</code></td>
                        <td>{Array.isArray(v) ? `数组[${v.length}]` : typeof v}</td>
                        <td className="gist-td-preview">{JSON.stringify(v).slice(0, 60)}{JSON.stringify(v).length > 60 ? '...' : ''}</td>
                        {showActions && (
                          <td>
                            <button className="gist-btn-sm gist-btn-danger" onClick={() => handleDeleteKey(k)}>删除</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 空数据 */}
          {pageViews.length === 0 && Object.keys(cultivationData).length === 0 && Object.keys(otherData).length === 0 && (
            <div className="gist-card gist-card-empty">
              <p>Gist 中暂无数据</p>
            </div>
          )}

          {/* 原始 JSON */}
          <div className="gist-card">
            <div className="gist-card-header">
              <h3 className="gist-card-title">
                {rawOpen ? (editing ? '📝 编辑模式' : '🔍 原始 JSON') : '📄 原始数据'}
              </h3>
              <div className="gist-card-actions">
                <button className="gist-btn" onClick={handleToggleRaw}>
                  {rawOpen ? '📋 收起' : '📋 查看原始 JSON'}
                </button>
                {rawOpen && !editing && (
                  <button className="gist-btn" onClick={handleEdit}>✏️ 编辑</button>
                )}
                {rawOpen && editing && (
                  <>
                    <button className="gist-btn gist-btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? '⏳...' : '💾 保存'}
                    </button>
                    <button className="gist-btn" onClick={handleCancelEdit}>取消</button>
                  </>
                )}
                <button className="gist-btn" onClick={loadData}>🔄 刷新</button>
              </div>
            </div>
            {rawOpen && (
              <>
                {formatError && <div className="gist-format-error">{formatError}</div>}
                {editing ? (
                  <textarea className="gist-textarea" value={editContent} onChange={(e) => { setEditContent(e.target.value); setFormatError('') }} spellCheck={false} />
                ) : (
                  <pre className="gist-pre">{editContent}</pre>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* 密码确认弹窗 */}
      {passwordModal.open && (
        <div className="password-overlay" onClick={() => setPasswordModal({ open: false, action: null })}>
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <span>🔐 权限确认</span>
              <button className="password-close" onClick={() => setPasswordModal({ open: false, action: null })}>✕</button>
            </div>
            <div className="password-modal-body">
              <p className="password-desc">
                {passwordModal.action?.type === 'clearViews' && '即将清空所有阅读量数据，此操作不可撤销。'}
                {passwordModal.action?.type === 'deleteKey' && `即将删除「${passwordModal.action.key}」，此操作不可撤销。`}
                {passwordModal.action?.type === 'modifyViews' && `即将修改「${passwordModal.action.slug}」的阅读量，请输入管理密码确认。`}
              </p>
              <p className="password-label">请输入管理密码以继续：</p>
              <input
                className="password-input"
                type="password"
                placeholder="请输入密码"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') executeWithPassword() }}
                autoFocus
              />
              {passwordError && <div className="password-error">{passwordError}</div>}
            </div>
            <div className="password-modal-footer">
              <button className="gist-btn" onClick={() => setPasswordModal({ open: false, action: null })}>取消</button>
              <button className="gist-btn gist-btn-primary" onClick={executeWithPassword}>确认</button>
            </div>
          </div>
        </div>
      )}

      {/* 修改阅读量弹窗 */}
      {editViewsModal.open && (
        <div className="password-overlay" onClick={() => setEditViewsModal({ open: false, slug: '', currentViews: 0 })}>
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <span>✏️ 修改阅读量</span>
              <button className="password-close" onClick={() => setEditViewsModal({ open: false, slug: '', currentViews: 0 })}>✕</button>
            </div>
            <div className="password-modal-body">
              <p className="password-desc">
                文档：<code>{editViewsModal.slug}</code>
              </p>
              <p className="password-desc">
                当前阅读量：<strong>{editViewsModal.currentViews}</strong>
              </p>
              <p className="password-label">新阅读量：</p>
              <input
                className="password-input"
                type="number"
                min="0"
                placeholder="输入新阅读量"
                value={editViewsInput}
                onChange={(e) => setEditViewsInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveViews() }}
                autoFocus
              />
            </div>
            <div className="password-modal-footer">
              <button className="gist-btn" onClick={() => setEditViewsModal({ open: false, slug: '', currentViews: 0 })}>取消</button>
              <button className="gist-btn gist-btn-primary" onClick={handleSaveViews}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
