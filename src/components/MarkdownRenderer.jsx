import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import katex from 'katex'
import MermaidBlock from './MermaidBlock'
import ChartBlock from './ChartBlock'

/**
 * 自定义 remark 插件：GitHub Alert 语法
 * > [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING] / [!CAUTION]
 */
function remarkAlert() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'blockquote' && node.children && node.children.length > 0) {
        const first = node.children[0]
        if (first?.type === 'paragraph' && first.children?.[0]?.type === 'text') {
          const text = first.children[0].value
          // 注意：remark 将 blockquote 中所有连续行合并到一个 paragraph 中
          // 所以 text 可能是 "[!NOTE]\n这是笔记提示"
          const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\r?\n/i)
          if (match) {
            const type = match[1].toLowerCase()
            const icons = { note: '📝', tip: '💡', important: '❗', warning: '⚠️', caution: '🚨' }
            const label = type.toUpperCase()
            const icon = icons[type]
            const body = text.slice(match[0].length).trim()
            node.type = 'html'
            node.value =
              `<div class="alert alert-${type}">` +
              `<div class="alert-title">${icon} ${label}</div>` +
              `<div class="alert-body"><p>${body}</p></div></div>`
            node.children = undefined
          }
        }
      }
      if (node.children) {
        for (const child of node.children) walk(child)
      }
    }
    walk(tree)
  }
}

/**
 * 自定义 remark 插件：将 pipe table 语法转为 HTML 表格
 * （替代 remark-gfm，避免 micromark 依赖冲突）
 */
function remarkPipeTable() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'paragraph' && node.children) {
        const text = node.children.map((c) => c.value || '').join('')
        const html = tryConvertTable(text)
        if (html) {
          node.type = 'html'
          node.value = html
          node.children = undefined
          return
        }
      }
      if (node.children) {
        for (const child of node.children) {
          walk(child)
        }
      }
    }
    walk(tree)
  }
}

function tryConvertTable(text) {
  // 检查是否以 | 开头并在同一段内出现至少 3 行（header + separator + body）
  const lines = text.split('\n').filter(Boolean)
  if (lines.length < 2) return null

  // 第一行是表头
  const first = lines[0].trim()
  if (!first.startsWith('|') || !first.endsWith('|')) return null

  // 第二行是分隔行
  const second = lines[1].trim()
  if (!/^\|[-:| ]+\|$/.test(second)) return null

  const headers = parseRow(lines[0])
  const rows = lines.slice(2).map(parseRow)

  let html = '<table><thead><tr>'
  for (const h of headers) html += `<th>${h}</th>`
  html += '</tr></thead><tbody>'
  for (const row of rows) {
    html += '<tr>'
    for (const cell of row) html += `<td>${cell}</td>`
    html += '</tr>'
  }
  html += '</tbody></table>'
  return html
}

function parseRow(line) {
  return line
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/`([^`]+)`/g, '<code>$1</code>'))
}

/**
 * 代码块渲染（原生 <pre><code> + 复制按钮）
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <pre className={`code-block ${language ? `language-${language}` : ''}`}>
      <div className="code-header">
        {language && <span className="code-lang">{language}</span>}
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? '✅ 已复制' : '📋 复制'}
        </button>
      </div>
      <code>{code}</code>
    </pre>
  )
}

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkPipeTable, remarkAlert, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const codeString = String(children).replace(/\n$/, '')

          if (language === 'mermaid' || language === 'sequence') {
            return <MermaidBlock chart={codeString} language={language} />
          }

          if (language === 'chart') {
            return <ChartBlock rawData={codeString} />
          }

          if (language === 'mathjax') {
            let html = ''
            try {
              html = katex.renderToString(codeString, {
                throwOnError: false,
                displayMode: true,
              })
            } catch {
              html = '<pre style="color:#e74c3c;">LaTeX 渲染失败</pre>'
            }
            return (
              <div className="katex-block">
                <div
                  className="katex-display"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            )
          }

          if (!language) {
            const isBlock = Array.isArray(children) || codeString.includes('\n')
            if (isBlock) {
              return <CodeBlock code={codeString} />
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }

          return <CodeBlock code={codeString} language={language} />
        },

        pre({ children }) {
          return children
        },

        a({ href, children, ...props }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
