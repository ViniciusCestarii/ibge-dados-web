import BarChart from '@/components/charts/bar-chart'
import GeoChart from '@/components/charts/geo-chart'
import MultiPeriodLineChart from '@/components/charts/multi-period-line-chart'
import { ChartProps } from '@/types/chart'

const ChartVisualization = (props: ChartProps) => {
  const { fetchParams } = props

  const moreThanOnePeriod = fetchParams.periodos.length > 1

  if (moreThanOnePeriod) {
    return <MultiPeriodLineChart {...props} />
  }

  const usingMultiClassificacao = Object.values(
    fetchParams.classificacao ?? {},
  ).some((classificacao) => classificacao.length > 1)

  if (usingMultiClassificacao) {
    return <BarChart {...props} />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <BarChart {...props} />
      <GeoChart {...props} />
    </div>
  )
}

export default ChartVisualization
