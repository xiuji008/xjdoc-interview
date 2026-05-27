import { useState, useEffect, useRef, useCallback } from 'react'
import { calculateCultivation, detectLevelUp, setStorageProvider } from '../utils/cultivationEngine'
import { loadPreviousScore, saveCurrentScore, loadHistory, saveHistory } from '../utils/gistCultivation'
import LevelUpAnimation from './LevelUpAnimation'
import CultivationTimeline from './CultivationTimeline'

/* ---------- 道纹渲染 ---------- */
function DaoMark({ pattern, color, size = 'normal' }) {
  const cls = `dao-mark dao-${pattern} ${size === 'large' ? 'dao-mark-lg' : ''}`
  return (
    <div className={cls} style={{ '--dao-color': color }}>
      {pattern === 'line-1' && <div className="dao-line-group"><div className="dao-line" /><div className="dao-line-glow" /></div>}
      {pattern === 'line-2' && <div className="dao-line-group"><div className="dao-line" /><div className="dao-line" /><div className="dao-line-glow" /></div>}
      {pattern === 'diamond' && <div className="dao-diamond"><div className="dao-diamond-inner" /></div>}
      {pattern === 'diamond-star-1' && <div className="dao-diamond-star"><span className="dao-star" /><span className="dao-star" /><div className="dao-diamond-sm" /></div>}
      {pattern === 'diamond-star-2' && <div className="dao-diamond-star"><span className="dao-star" /><span className="dao-star" /><span className="dao-star" /><div className="dao-diamond-sm" /></div>}
      {pattern === 'diamond-star-3' && <div className="dao-diamond-star"><span className="dao-star" /><span className="dao-star" /><span className="dao-star" /><div className="dao-diamond-sm" /></div>}
      {pattern === 'star-2' && <div className="dao-star-pair"><span className="dao-star-lg" /><div className="dao-bar-connector" /><span className="dao-star-lg" /></div>}
      {pattern === 'star-3' && <div className="dao-star-array"><span className="dao-star-lg" /><span className="dao-star-lg" /><span className="dao-star-lg" /><div className="dao-array-base" /></div>}
      {pattern === 'star-3-bolt' && <div className="dao-bolt-group"><span className="dao-star-lg" /><span className="dao-star-lg" /><span className="dao-star-lg" /><div className="dao-bolt">⚡</div></div>}
      {pattern === 'sun-star' && <div className="dao-sun"><div className="dao-sun-ray" /><span className="dao-star-god" /></div>}
    </div>
  )
}

export default function CultivationPanel({ tree }) {
  const [cultivation, setCultivation] = useState(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationEntry, setAnimationEntry] = useState(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const prevScoreRef = useRef(0)

  // 初始化：设置存储提供者 + 加载历史
  useEffect(() => {
    const init = async () => {
      const history = await loadHistory()
      const prevScore = await loadPreviousScore()
      prevScoreRef.current = prevScore

      setStorageProvider({
        getHistory: () => history,
        saveHistory: async (h) => {
          await saveHistory(h)
        },
      })

      setLoaded(true)
    }
    init()
  }, [])

  // 检测升级
  useEffect(() => {
    if (!tree || !loaded) return

    const run = async () => {
      const data = calculateCultivation(tree)
      setCultivation(data)

      const prevScore = prevScoreRef.current
      if (prevScore > 0) {
        const result = detectLevelUp(prevScore, tree)
        if (result.changed) {
          setAnimationEntry(result.entry)
          setShowAnimation(true)
          // 保存更新后的历史
          await saveHistory(result.history)
        }
      }
      await saveCurrentScore(data.score)
    }
    run()
  }, [tree, loaded])

  // 时间线回放
  const handleReplay = useCallback((entry) => {
    setShowTimeline(false)
    setTimeout(() => {
      setAnimationEntry(entry)
      setShowAnimation(true)
    }, 200)
  }, [])

  if (!cultivation) return null

  const { score, realm, stage, realmProgress, scoreToNext, spiritSpeed, stats, skills, history } = cultivation
  const isGod = realm.id === 'god'

  return (
    <>
      {showAnimation && animationEntry && (
        <LevelUpAnimation entry={animationEntry} onClose={() => setShowAnimation(false)} />
      )}
      {showTimeline && (
        <CultivationTimeline
          history={history}
          currentRealm={realm}
          currentStage={stage}
          currentScore={score}
          onClose={() => setShowTimeline(false)}
          onReplay={handleReplay}
        />
      )}

      <div className={`cultivation-panel ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className="cultivation-badge"
          style={{ '--realm-color': realm.color, '--realm-glow': realm.glowColor, '--realm-bg': `linear-gradient(135deg, ${realm.color}15, #f8faff)` }}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="badge-pattern-bg" />
          <div className="badge-glow" />
          <div className="badge-dao-area">
            <DaoMark pattern={realm.pattern} color={realm.color} />
          </div>
          <div className="badge-info">
            <div className="badge-realm-name">
              {realm.name}
              {stage && <span className="badge-stage"> · {stage.name}</span>}
            </div>
            <div className="badge-motto">{realm.motto}</div>
          </div>
          <div className="badge-expand-icon">{expanded ? '▼' : '▲'}</div>
        </div>

        {expanded && (
          <div className="cultivation-details">
            <div className="cultivation-section">
              <div className="section-title">✦ 修为境界</div>
              <div className="score-display">
                <span className="score-value">{score}</span>
                <span className="score-label">修为</span>
              </div>
              {stage && !isGod && (
                <div className={`stage-bar ${realm.stages.length > 6 ? 'stage-bar-scroll' : ''}`}>
                  {realm.stages.map((s, i) => (
                    <div key={i} className={`stage-segment ${realm.stages.length > 6 ? 'stage-segment-sm' : ''} ${s.index === stage.index ? 'active' : ''}`}
                      style={s.index === stage.index ? { background: realm.color, boxShadow: `0 2px 8px ${realm.glowColor}` } : {}}>
                      <span className="stage-seg-label">{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {!isGod ? (
                <>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${realmProgress}%`, background: realm.color }} />
                    <div className="progress-glow" style={{ left: `${realmProgress}%` }} />
                  </div>
                  <div className="progress-info">
                    <span>境界进度 {realmProgress}%</span>
                    <span>距下境界还需 {scoreToNext} 修为</span>
                  </div>
                </>
              ) : (
                <div className="god-status"><span className="god-text">✦ 已飞升成神 ✦</span></div>
              )}
            </div>

            <div className="cultivation-section">
              <div className="section-title">⚡ 灵力修炼</div>
              <div className="spirit-speed">
                <span className="speed-level" style={{ color: realm.color }}>{spiritSpeed.speedLevel}</span>
                <span className="speed-value">{spiritSpeed.total}</span>
              </div>
              <div className="speed-details">
                {[
                  { label: '📖 吸收灵力', val: spiritSpeed.absorption },
                  { label: '🔄 提纯灵力', val: spiritSpeed.purification },
                  { label: '🔖 新技能',   val: spiritSpeed.newSkills },
                  { label: '📜 新功法',   val: spiritSpeed.newTechnique },
                ].map((d) => (
                  <div key={d.label} className="speed-item">
                    <span className="speed-label">{d.label}</span>
                    <span className="speed-num">{d.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cultivation-section">
              <div className="section-title">📜 储备功法（{skills.length}）</div>
              <div className="skills-list">
                {skills.filter((s) => s.depth === 0).map((sk) => (
                  <div key={sk.name} className="skill-item">
                    <span className="skill-icon">{sk.icon}</span>
                    <span className="skill-name">{sk.displayName}</span>
                    <span className="skill-type">{sk.type}</span>
                    <span className="skill-count">{sk.docCount}篇</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cultivation-section">
              <div className="section-title">📊 洞府统计</div>
              <div className="stats-grid">
                {[
                  { label: '典籍', val: stats.docCount },
                  { label: '功法', val: stats.majorCategories },
                  { label: '技能', val: stats.subCategories },
                  { label: '见闻', val: stats.tagCount },
                ].map((s) => (
                  <div key={s.label} className="stat-item">
                    <span className="stat-value">{s.val}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="timeline-btn" onClick={() => setShowTimeline(true)}>
              📜 成神之路 · 突破历程
            </button>
          </div>
        )}
      </div>
    </>
  )
}
