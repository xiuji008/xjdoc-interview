import { useState } from 'react'

/* ---------- 道纹小图展示 ---------- */
function MiniDaoMark({ pattern, color }) {
  return (
    <span className="manual-dao" style={{ '--c': color }}>
      {pattern === 'line-1' && '⟋'}
      {pattern === 'line-2' && '⟋⟋'}
      {pattern === 'diamond' && '◇'}
      {pattern === 'diamond-star-1' && '◇★'}
      {pattern === 'diamond-star-2' && '◇★★'}
      {pattern === 'diamond-star-3' && '◇★★★'}
      {pattern === 'star-2' && '★★'}
      {pattern === 'star-3' && '★★★'}
      {pattern === 'star-3-bolt' && '★★★⚡'}
      {pattern === 'sun-star' && '☀★'}
    </span>
  )
}

const REALM_DATA = [
  { name: '练气期', range: '0 ~ 19', color: '#4FC3F7', pattern: 'line-1', motto: '感知天地灵气，初入道途', stages: '13层 · 灵气感知→半步筑基' },
  { name: '筑基期', range: '20 ~ 59', color: '#66BB6A', pattern: 'line-2', motto: '筑就道基，脱胎换骨', stages: '4段 · 初期→大圆满' },
  { name: '金丹期', range: '60 ~ 139', color: '#FFD700', pattern: 'diamond', motto: '凝丹成金，超凡入圣', stages: '4段 · 初期→大圆满' },
  { name: '元婴期', range: '140 ~ 299', color: '#AB47BC', pattern: 'diamond-star-1', motto: '元婴出窍，神通自成', stages: '4段 · 初期→大圆满' },
  { name: '化神期', range: '300 ~ 619', color: '#FF7043', pattern: 'diamond-star-2', motto: '化神悟道，天人合一', stages: '4段 · 初期→大圆满' },
  { name: '炼虚期', range: '620 ~ 1,259', color: '#78909C', pattern: 'diamond-star-3', motto: '炼虚合道，虚空破碎', stages: '4段 · 初期→大圆满' },
  { name: '合体期', range: '1,260 ~ 2,539', color: '#EC407A', pattern: 'star-2', motto: '万法归一，道我合一', stages: '4段 · 初期→大圆满' },
  { name: '大乘期', range: '2,540 ~ 5,099', color: '#FFA726', pattern: 'star-3', motto: '功德圆满，半步渡劫', stages: '4段 · 初期→半步渡劫' },
  { name: '渡劫期', range: '5,100 ~ 10,219', color: '#EF5350', pattern: 'star-3-bolt', motto: '天劫降临，九死一生', stages: '3波 · 第一波天劫→最终天劫' },
  { name: '飞升成神', range: '10,220+', color: '#00E5FF', pattern: 'sun-star', motto: '历经天劫，飞升成神', stages: '—' },
]

export default function CultivationManual({ isOpen, onClose }) {
  const [tab, setTab] = useState('realm')

  if (!isOpen) return null

  return (
    <div className="manual-overlay" onClick={onClose}>
      <div className="manual-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="manual-header">
          <div className="manual-title">📜 修炼说明书</div>
          <button className="manual-close" onClick={onClose}>✕</button>
        </div>

        {/* 标签页 */}
        <div className="manual-tabs">
          <button className={`manual-tab ${tab === 'realm' ? 'active' : ''}`} onClick={() => setTab('realm')}>境界总览</button>
          <button className={`manual-tab ${tab === 'score' ? 'active' : ''}`} onClick={() => setTab('score')}>修为规则</button>
          <button className={`manual-tab ${tab === 'dao' ? 'active' : ''}`} onClick={() => setTab('dao')}>道纹图鉴</button>
          <button className={`manual-tab ${tab === 'animation' ? 'active' : ''}`} onClick={() => setTab('animation')}>突破动画</button>
        </div>

        <div className="manual-body">
          {/* === 境界总览 === */}
          {tab === 'realm' && (
            <div className="manual-section">
              <p className="manual-desc">每个大境界修为范围翻倍，越往后越难突破。最高可达飞升成神。</p>
              <table className="manual-table">
                <thead>
                  <tr>
                    <th>境界</th>
                    <th>范围</th>
                    <th>道纹</th>
                    <th>小层级</th>
                  </tr>
                </thead>
                <tbody>
                  {REALM_DATA.map((r) => (
                    <tr key={r.name}>
                      <td><span className="manual-realm-name" style={{ color: r.color }}>{r.name}</span></td>
                      <td className="manual-range">{r.range}</td>
                      <td><MiniDaoMark pattern={r.pattern} color={r.color} /></td>
                      <td className="manual-stages">{r.stages}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="manual-subsection">
                <h4>练气期完整层级</h4>
                <div className="manual-lianqi-grid">
                  {[
                    '灵气感知', '引气入体', '气脉初通', '灵气循环',
                    '气脉小成', '气海初开', '气海充盈', '灵气化液',
                    '灵液汇聚', '灵液成池', '气海如渊', '筑基有望',
                    '半步筑基',
                  ].map((name, i) => (
                    <div key={i} className="manual-lianqi-item" style={{ '--i': i }}>
                      <span className="ml-index">{i + 1}</span>
                      <span className="ml-name">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === 修为规则 === */}
          {tab === 'score' && (
            <div className="manual-section">
              <h4>计算公式</h4>
              <div className="manual-formula">
                修为 = 文档数 × 0.3 + 顶级分类 × 0.2 + 子分类 × 0.1 + 标签数 × 0.05
              </div>

              <h4>来源对照</h4>
              <table className="manual-table">
                <thead>
                  <tr><th>行为</th><th>修仙含义</th><th>修为</th></tr>
                </thead>
                <tbody>
                  <tr><td>新增一篇文档</td><td>吸收灵力</td><td>+0.3</td></tr>
                  <tr><td>新增一个大分类</td><td>学习新功法</td><td>+0.2</td></tr>
                  <tr><td>新增一个小分类</td><td>学习新技能</td><td>+0.1</td></tr>
                  <tr><td>增加一个标签</td><td>拓宽见闻</td><td>+0.05</td></tr>
                  <tr><td>更新文档（30天内）</td><td>提纯灵力</td><td>仅影响速度</td></tr>
                </tbody>
              </table>

              <h4>灵力速度</h4>
              <p className="manual-desc">反映知识库活跃度，分为吸收、提纯、新技能、新功法四个维度。</p>
              <table className="manual-table">
                <thead>
                  <tr><th>速度值</th><th>评级</th></tr>
                </thead>
                <tbody>
                  <tr><td>&gt; 20</td><td>极速 🚀</td></tr>
                  <tr><td>&gt; 10</td><td>高速 ⚡</td></tr>
                  <tr><td>&gt; 5</td><td>中速 🌊</td></tr>
                  <tr><td>&gt; 2</td><td>低速 💧</td></tr>
                  <tr><td>≤ 2</td><td>缓慢 🐢</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* === 道纹图鉴 === */}
          {tab === 'dao' && (
            <div className="manual-section">
              <p className="manual-desc">道纹随境界提升而演化，从单一灵纹到旭日金星。</p>
              <div className="manual-dao-gallery">
                {REALM_DATA.map((r) => (
                  <div key={r.name} className="manual-dao-card" style={{ borderColor: r.color }}>
                    <div className="manual-dao-preview" style={{ background: `linear-gradient(135deg, ${r.color}15, transparent)` }}>
                      <MiniDaoMark pattern={r.pattern} color={r.color} />
                    </div>
                    <div className="manual-dao-info">
                      <div className="manual-dao-name" style={{ color: r.color }}>{r.name}</div>
                      <div className="manual-dao-motto">{r.motto}</div>
                      <div className="manual-dao-pattern">{r.pattern}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === 突破动画 === */}
          {tab === 'animation' && (
            <div className="manual-section">
              <h4>触发时机</h4>
              <p className="manual-desc">每次刷新页面时，系统自动对比上次修为与当前修为。发生变化即触发对应动画。</p>

              <div className="manual-animation-types">
                <div className="manual-anim-card">
                  <div className="manual-anim-icon" style={{ color: '#4FC3F7' }}>◇ 精进 ◇</div>
                  <div className="manual-anim-title">小层级提升</div>
                  <ul className="manual-anim-detail">
                    <li>同一大境界内层级升级</li>
                    <li>显示新境界名 + 新层级</li>
                    <li>粒子特效 + 渐入文字</li>
                  </ul>
                </div>
                <div className="manual-anim-card">
                  <div className="manual-anim-icon" style={{ color: '#FFD700' }}>✦ 突 破 ✦</div>
                  <div className="manual-anim-title">大境界突破</div>
                  <ul className="manual-anim-detail">
                    <li>跨越整个大境界</li>
                    <li>旧境界划掉 → 新境界闪耀</li>
                    <li>80粒子 + 双层光环 + 光柱</li>
                  </ul>
                </div>
              </div>

              <h4>时间线回放</h4>
              <p className="manual-desc">
                面板底部「📜 成神之路 · 突破历程」可查看所有历史记录。
                点击任一节点可回放当时的晋升动画。
              </p>

              <h4>数据存储</h4>
              <p className="manual-desc">
                历程数据存储在 GitHub Gist（跨设备同步），Gist 未配置时自动降级到浏览器 localStorage。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
