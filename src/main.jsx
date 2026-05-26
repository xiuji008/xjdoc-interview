import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './App.css'
import 'katex/dist/katex.min.css'

// 全局错误捕获（仅开发调试用）
window.addEventListener('error', (e) => {
  console.error('[Global Error]', e.error || e.message, e.filename, e.lineno)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Rejection]', e.reason)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
