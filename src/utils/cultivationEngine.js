/**
 * 修仙成神引擎 v4
 *
 * 修为值 = 文档数×0.3 + 顶级分类数×0.2 + 子分类数×0.1 + 标签数×0.05
 * （结果四舍五入取整）
 *
 * 翻倍规则（平滑晋级）：
 *   练气期   0 ~ 19     (20)
 *   筑基期   20 ~ 59     (40)
 *   金丹期   60 ~ 139    (80)
 *   元婴期   140 ~ 299   (160)
 *   化神期   300 ~ 619   (320)
 *   炼虚期   620 ~ 1259  (640)
 *   合体期   1260 ~ 2539 (1280)
 *   大乘期   2540 ~ 5099 (2560)
 *   渡劫期   5100 ~ 10219 (5120)
 *   飞升成神 10220+
 */

function evenlySplit(total, count) {
  const per = Math.floor(total / count)
  const arr = []
  for (let i = 0; i < count; i++) {
    const s = i * per
    const e = i === count - 1 ? total - 1 : s + per - 1
    arr.push({ scoreStart: s, scoreEnd: e, index: i })
  }
  return arr
}

const REALM_DEFS = [
  {
    id: 'lianqi', name: '练气期', motto: '感知天地灵气，初入道途',
    color: '#4FC3F7', colorDark: '#0c3a5c', pattern: 'line-1',
    span: 20,
    stageNames: [
      '灵气感知', '引气入体', '气脉初通', '灵气循环',
      '气脉小成', '气海初开', '气海充盈', '灵气化液',
      '灵液汇聚', '灵液成池', '气海如渊', '筑基有望',
      '半步筑基',
    ],
  },
  { id: 'zhuji', name: '筑基期', motto: '筑就道基，脱胎换骨',    color: '#66BB6A', colorDark: '#0d2410', pattern: 'line-2',    span: 40,   stageNames: ['初期', '中期', '后期', '大圆满'] },
  { id: 'jindan', name: '金丹期', motto: '凝丹成金，超凡入圣',    color: '#FFD700', colorDark: '#2a1f00', pattern: 'diamond',  span: 80,   stageNames: ['初期', '中期', '后期', '大圆满'] },
  { id: 'yuanying', name: '元婴期', motto: '元婴出窍，神通自成',   color: '#AB47BC', colorDark: '#1a0a24', pattern: 'diamond-star-1', span: 160,  stageNames: ['初期', '中期', '后期', '大圆满'] },
  { id: 'huashen', name: '化神期', motto: '化神悟道，天人合一',   color: '#FF7043', colorDark: '#2a0a00', pattern: 'diamond-star-2', span: 320,  stageNames: ['初期', '中期', '后期', '大圆满'] },
  { id: 'lianxu', name: '炼虚期', motto: '炼虚合道，虚空破碎',   color: '#78909C', colorDark: '#101418', pattern: 'diamond-star-3', span: 640,  stageNames: ['初期', '中期', '后期', '大圆满'] },
  { id: 'heti', name: '合体期', motto: '万法归一，道我合一',     color: '#EC407A', colorDark: '#2a0a18', pattern: 'star-2',   span: 1280, stageNames: ['初期', '中期', '后期', '大圆满'] },
  { id: 'dacheng', name: '大乘期', motto: '功德圆满，半步渡劫',   color: '#FFA726', colorDark: '#2a1800', pattern: 'star-3',   span: 2560, stageNames: ['初期', '中期', '后期', '半步渡劫'] },
  { id: 'dujie', name: '渡劫期', motto: '天劫降临，九死一生',     color: '#EF5350', colorDark: '#2a0000', pattern: 'star-3-bolt', span: 5120, stageNames: ['第一波天劫', '第二波天劫', '最终天劫'] },
]

const REALMS = REALM_DEFS.map((def, idx) => {
  const scoreStart = idx === 0 ? 0 : REALM_DEFS.slice(0, idx).reduce((s, r) => s + r.span, 0)
  const scoreEnd = scoreStart + def.span - 1

  // 生成小层级
  const counts = def.stageNames.length
  const segments = evenlySplit(def.span, counts)
  const stages = segments.map((seg, i) => ({
    name: def.stageNames[i],
    scoreStart: scoreStart + seg.scoreStart,
    scoreEnd: scoreStart + seg.scoreEnd,
    index: i,
  }))

  return {
    ...def,
    scoreStart,
    scoreEnd,
    stages,
    glowColor: `rgba(${hexToRgb(def.color)}, 0.5)`,
  }
})

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

const GOD_REALM = {
  id: 'god', name: '飞升成神',
  motto: '历经天劫，飞升成神！全栈之道，已达化境',
  color: '#00E5FF', colorDark: '#001a2e',
  glowColor: 'rgba(0, 229, 255, 0.8)',
  pattern: 'sun-star',
  scoreStart: 10220, scoreEnd: Infinity,
}

const SKILL_MAP = {
  java: { name: 'Java根基', type: '根基功法', icon: '☕' },
  web: { name: 'Web功法', type: '攻伐仙术', icon: '🌐' },
  redis: { name: 'Redis秘籍', type: '身法仙术', icon: '🔴' },
  kafka: { name: 'Kafka仙术', type: '传音功法', icon: '📨' },
  es: { name: 'ES神识', type: '探查功法', icon: '🔍' },
  ai: { name: 'AI天机', type: '天机推演', icon: '🤖' },
  database: { name: '数据库道法', type: '封印功法', icon: '🗄️' },
  spring: { name: 'Spring心法', type: '防御心法', icon: '🍃' },
  docker: { name: 'Docker法器', type: '炼器之术', icon: '🐳' },
  linux: { name: 'Linux剑诀', type: '剑道功法', icon: '🐧' },
  network: { name: '网络神通', type: '遁术神通', icon: '🌍' },
  system: { name: '系统大道', type: '天道法则', icon: '⚙️' },
  algorithm: { name: '算法仙诀', type: '推演仙术', icon: '🧮' },
}

// ===== 统计提取 =====
function extractStats(tree) {
  let docCount = 0
  const majorCategories = new Set()
  const subCategories = new Set()
  const allTags = new Set()
  const docs = []

  function walk(node, parentPath = '') {
    if (node.type === 'file') {
      docCount++
      docs.push(node)
      if (node.tags && Array.isArray(node.tags)) node.tags.forEach((t) => allTags.add(t))
      return
    }
    if (node.type === 'directory') {
      if (parentPath === '') majorCategories.add(node.name)
      else subCategories.add(node.name)
      for (const child of node.children || []) walk(child, node.name)
    }
  }
  walk(tree)
  return { docCount, majorCategories: majorCategories.size, subCategories: subCategories.size, tagCount: allTags.size, docs }
}

function calculateScore(dc, mc, sc, tc) {
  return Math.round(dc * 0.3 + mc * 0.2 + sc * 0.1 + tc * 0.05)
}

function getCurrentRealm(score) {
  for (const r of REALMS) { if (score >= r.scoreStart && score <= r.scoreEnd) return r }
  return score > REALMS[REALMS.length - 1].scoreEnd ? GOD_REALM : REALMS[0]
}

function getCurrentStage(realm, score) {
  if (realm.id === 'god') return null
  for (const s of realm.stages) { if (score >= s.scoreStart && score <= s.scoreEnd) return s }
  const p = (score - realm.scoreStart) / (realm.scoreEnd - realm.scoreStart)
  const i = Math.min(Math.floor(p * realm.stages.length), realm.stages.length - 1)
  return realm.stages[i]
}

function getRealmProgress(realm, score) {
  if (realm.id === 'god') return 100
  const range = realm.scoreEnd - realm.scoreStart
  return range <= 0 ? 100 : Math.min(100, Math.round(((score - realm.scoreStart) / range) * 100))
}

function getScoreToNextRealm(score) {
  for (const r of REALMS) { if (score >= r.scoreStart && score <= r.scoreEnd) return Math.max(0, r.scoreEnd - score) }
  return 0
}

function calculateSpiritSpeed(dc, mc, sc, tc, docs) {
  const b = dc * 0.15; const m = mc * 0.1; const s = sc * 0.05; const t = tc * 0.025
  const now = Date.now(); const d30 = 30 * 24 * 60 * 60 * 1000
  const updates = docs.filter((d) => d.updated && now - new Date(d.updated).getTime() < d30).length
  const p = updates * 0.5
  const total = Math.round((b + m + s + t + p) * 100) / 100
  return {
    total, absorption: Math.round(b * 100) / 100, purification: Math.round(p * 100) / 100,
    newSkills: s, newTechnique: m,
    speedLevel: total > 20 ? '极速' : total > 10 ? '高速' : total > 5 ? '中速' : total > 2 ? '低速' : '缓慢',
  }
}

function getKnownSkills(tree) {
  const sk = []
  function w(n, d = 0) {
    if (n.type === 'directory') {
      if (d === 1) {
        const m = SKILL_MAP[n.name]
        sk.push({ name: n.name, displayName: m?.name || n.name, type: m?.type || '功法', icon: m?.icon || '📜', docCount: countDocs(n), depth: 0 })
      } else if (d >= 2) {
        sk.push({ name: n.name, displayName: n.name, type: '子技能', icon: '🔖', docCount: countDocs(n), depth: d - 1 })
      }
      for (const c of n.children || []) w(c, d + 1)
    }
  }
  w(tree); return sk
}

function countDocs(n) {
  if (!n) return 0
  if (n.type === 'file') return 1
  return (n.children || []).reduce((s, c) => s + countDocs(c), 0)
}

// ===== 历史追踪（与 Gist/Storage 解耦，由外部提供存储函数） =====
let storageProvider = null

export function setStorageProvider(provider) {
  storageProvider = provider
}

function getHistory() {
  return storageProvider?.getHistory?.() ?? []
}

function saveHistory(h) {
  storageProvider?.saveHistory?.(h)
}

function checkLevelChange(previousScore, currentScore, currentRealm, currentStage) {
  const prevRealm = getCurrentRealm(previousScore)
  const prevStage = getCurrentStage(prevRealm, previousScore)
  const changed = prevRealm.id !== currentRealm.id || (prevStage && currentStage && prevStage.index !== currentStage.index)
  if (!changed) return { changed: false, isNewLevel: false, entry: null }

  const history = getHistory()
  const entry = {
    timestamp: new Date().toISOString(), prevScore: previousScore, newScore: currentScore,
    prevRealm: prevRealm.name, prevRealmId: prevRealm.id, prevStage: prevStage?.name || '',
    newRealm: currentRealm.name, newRealmId: currentRealm.id, newStage: currentStage?.name || '',
    isRealmBreakthrough: prevRealm.id !== currentRealm.id,
  }
  history.push(entry)
  saveHistory(history)
  return { changed: true, isNewLevel: prevRealm.id !== currentRealm.id, entry, history }
}

// ===== 主 API =====
export function calculateCultivation(tree) {
  const stats = extractStats(tree)
  const { docCount, majorCategories, subCategories, tagCount, docs } = stats
  const score = calculateScore(docCount, majorCategories, subCategories, tagCount)
  const realm = getCurrentRealm(score)
  const stage = getCurrentStage(realm, score)
  const realmProgress = getRealmProgress(realm, score)
  const scoreToNext = getScoreToNextRealm(score)
  const spiritSpeed = calculateSpiritSpeed(docCount, majorCategories, subCategories, tagCount, docs)
  const skills = getKnownSkills(tree)

  return {
    score, realm, stage, realmProgress, scoreToNext, spiritSpeed,
    stats: { docCount, majorCategories, subCategories, tagCount },
    skills, history: getHistory(),
  }
}

export function detectLevelUp(previousScore, tree) {
  const current = calculateCultivation(tree)
  return checkLevelChange(previousScore, current.score, current.realm, current.stage)
}

export { REALMS, GOD_REALM, SKILL_MAP }
