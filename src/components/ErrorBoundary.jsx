import React from 'react'

/**
 * 错误边界 — 捕获子组件渲染错误，防止整个页面崩溃
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 16,
          margin: 16,
          border: '1px solid #f72585',
          borderRadius: 8,
          background: '#fff0f3',
          color: '#e74c3c',
          fontSize: 13,
        }}>
          <strong>⚠️ 渲染异常：</strong>
          <pre style={{ marginTop: 8, fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
          </pre>
          {this.props.fallback || null}
        </div>
      )
    }
    return this.props.children
  }
}
