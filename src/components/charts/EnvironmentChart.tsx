import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'
import { ChartDataPoint } from '@/types'

interface EnvironmentChartProps {
  data: ChartDataPoint[]
  type?: 'line' | 'area' | 'bar'
  dataKey?: string
  color?: string
  secondaryData?: { data: ChartDataPoint[]; dataKey: string; color: string; name: string }
  height?: number
  showGrid?: boolean
  animate?: boolean
}

export default function EnvironmentChart({
  data,
  type = 'line',
  dataKey = 'value',
  color = '#22c55e',
  secondaryData,
  height = 300,
  showGrid = true,
  animate = true,
}: EnvironmentChartProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8'
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0'
  const tooltipBg = theme === 'dark' ? '#1e293b' : '#ffffff'
  const tooltipBorder = theme === 'dark' ? '#334155' : '#e2e8f0'

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-xl shadow-lg border"
          style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
        >
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name || dataKey}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const commonProps = {
    data,
    margin: { top: 10, right: 10, left: -10, bottom: 0 },
  }

  const commonAxisProps = {
    xAxis: (
      <XAxis
        dataKey="time"
        tick={{ fill: axisColor, fontSize: 12 }}
        axisLine={{ stroke: gridColor }}
        tickLine={{ stroke: gridColor }}
      />
    ),
    yAxis: (
      <YAxis
        tick={{ fill: axisColor, fontSize: 12 }}
        axisLine={{ stroke: gridColor }}
        tickLine={{ stroke: gridColor }}
      />
    ),
    grid: showGrid && (
      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
    ),
    tooltip: <Tooltip content={<CustomTooltip />} />,
    legend: secondaryData && <Legend />,
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...commonProps}>
          {commonAxisProps.grid}
          {commonAxisProps.xAxis}
          {commonAxisProps.yAxis}
          {commonAxisProps.tooltip}
          {commonAxisProps.legend}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            {secondaryData && (
              <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryData.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={secondaryData.color} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill="url(#colorGradient)"
            strokeWidth={2}
            isAnimationActive={animate}
            animationDuration={1000}
          />
          {secondaryData && (
            <Area
              type="monotone"
              data={secondaryData.data}
              dataKey={secondaryData.dataKey}
              name={secondaryData.name}
              stroke={secondaryData.color}
              fill="url(#colorGradient2)"
              strokeWidth={2}
              isAnimationActive={animate}
              animationDuration={1000}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart {...commonProps}>
          {commonAxisProps.grid}
          {commonAxisProps.xAxis}
          {commonAxisProps.yAxis}
          {commonAxisProps.tooltip}
          {commonAxisProps.legend}
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            isAnimationActive={animate}
            animationDuration={1000}
          />
          {secondaryData && (
            <Bar
              data={secondaryData.data}
              dataKey={secondaryData.dataKey}
              name={secondaryData.name}
              fill={secondaryData.color}
              radius={[4, 4, 0, 0]}
              isAnimationActive={animate}
              animationDuration={1000}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...commonProps}>
        {commonAxisProps.grid}
        {commonAxisProps.xAxis}
        {commonAxisProps.yAxis}
        {commonAxisProps.tooltip}
        {commonAxisProps.legend}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={animate}
          animationDuration={1000}
        />
        {secondaryData && (
          <Line
            type="monotone"
            data={secondaryData.data}
            dataKey={secondaryData.dataKey}
            name={secondaryData.name}
            stroke={secondaryData.color}
            strokeWidth={2}
            dot={{ fill: secondaryData.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={animate}
            animationDuration={1000}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
