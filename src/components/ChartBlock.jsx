import { useState, useEffect } from 'react'
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// 饼图配色
const COLORS = [
  '#4361ee',
  '#3a0ca3',
  '#7209b7',
  '#f72585',
  '#4cc9f0',
  '#4895ef',
  '#560bad',
  '#b5179e',
]

/**
 * 自定义图表渲染组件
 * 从 ```chart 代码块中解析 JSON 配置并渲染
 *
 * 支持类型: pie, bar, line, area, radar
 *
 * 配置格式:
 * ```chart
 * {
 *   "type": "bar",
 *   "title": "标题",
 *   "data": [{ "name": "A", "value": 10 }, ...],
 *   "xField": "name",
 *   "yField": "value"
 * }
 * ```
 */
export default function ChartBlock({ rawData }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  let config

  try {
    config = JSON.parse(rawData)
  } catch {
    // 尝试 YAML 风格的简写（简单兼容）
    try {
      const lines = rawData.trim().split('\n')
      const parsed = {}
      for (const line of lines) {
        const [key, ...rest] = line.split(':')
        if (key && rest.length) {
          parsed[key.trim()] = rest.join(':').trim()
        }
      }
      config = parsed
    } catch {
      return (
        <div className="chart-wrapper" style={{ color: '#e74c3c' }}>
          图表配置解析失败，请检查 JSON 格式
        </div>
      )
    }
  }

  if (!config || !config.data || !config.type) {
    return (
      <div className="chart-wrapper" style={{ color: '#888' }}>
        图表配置缺少必要字段 (type, data)
      </div>
    )
  }

  const {
    type,
    title,
    data,
    xField = 'name',
    yField = 'value',
    angleField = 'value',
    colorField = 'name',
  } = config

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return renderPieChart(data, angleField, colorField, title)
      case 'bar':
        return renderBarChart(data, xField, yField, title)
      case 'line':
        return renderLineChart(data, xField, yField, title)
      case 'area':
        return renderAreaChart(data, xField, yField, title)
      case 'radar':
        return renderRadarChart(data, xField, yField, title)
      default:
        return <div style={{ color: '#888' }}>不支持的图表类型: {type}</div>
    }
  }

  return (
    <div className="chart-wrapper">
      <div style={{ width: '100%', maxWidth: 600 }}>
        {title && (
          <h4 style={{ textAlign: 'center', marginBottom: 16, color: 'var(--text-primary)' }}>
            {title}
          </h4>
        )}
        {mounted ? renderChart() : <div style={{ height: 320 }} />}
      </div>
    </div>
  )
}

function renderPieChart(data, angleField, colorField, title) {
  const isDonut = title?.includes('环形') || title?.includes('donut')
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={120}
          innerRadius={isDonut ? 50 : 0}
          fill="#8884d8"
          dataKey={angleField}
          nameKey={colorField}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

function renderBarChart(data, xField, yField, title) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e8" />
        <XAxis dataKey={xField} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey={yField} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function renderLineChart(data, xField, yField, title) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e8" />
        <XAxis dataKey={xField} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={yField}
          stroke={COLORS[0]}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function renderAreaChart(data, xField, yField, title) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e8" />
        <XAxis dataKey={xField} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey={yField}
          stroke={COLORS[0]}
          fill={COLORS[0]}
          fillOpacity={0.2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function renderRadarChart(data, xField, yField, title) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#e0e0e8" />
        <PolarAngleAxis dataKey={xField} tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 10 }} />
        <Radar
          name={title || yField}
          dataKey={yField}
          stroke={COLORS[0]}
          fill={COLORS[0]}
          fillOpacity={0.3}
        />
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}
