'use client'
import useAppliedTheme from '@/hooks/use-applied-theme'
import { generateChartOptions } from '@/lib/utils'
import { ChartCoreProps } from '@/types/chart'
import { EChartsOption } from 'echarts'
import { LineChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { useEffect, useMemo, useRef } from 'react'
import langPtBr from 'echarts/i18n/langPT-br-obj.js'

echarts.registerLocale('pt-br', langPtBr)

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  ToolboxComponent,
  SVGRenderer,
  GridComponent,
  DataZoomComponent,
])

const MultiPeriodLineChartCore = (props: ChartCoreProps) => {
  const { data, options } = props

  const chartRef = useRef(null)
  const echartRef = useRef<null | echarts.ECharts>(null)

  const dataSorted = useMemo(() => {
    const sortedData = data.toSorted(function (a, b) {
      return b.value - a.value
    })

    return sortedData
  }, [data])

  const lineOption: EChartsOption = useMemo(() => {
    const basicOptions = generateChartOptions(props)
    return {
      ...basicOptions,
      tooltip: {
        ...basicOptions.tooltip,
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          rotate: 30,
        },
        data: data.map(function (item) {
          return item.name
        }),
      },
      height: '77.5%',
      series: {
        id: `line-${options.title}`,
        type: 'line',
        data: data.map(function (item) {
          return item.value
        }),
        emphasis: {
          itemStyle: {
            borderColor: '#808080',
            borderWidth: 6,
          },
        },
        universalTransition: true,
      },
      dataZoom: [
        {},
        {
          type: 'inside',
        },
      ],
    }
  }, [dataSorted, data, options])

  const theme = useAppliedTheme()

  useEffect(() => {
    echartRef.current?.dispose()

    const wasDisposed = echartRef.current?.isDisposed()

    const myChart = echarts.init(chartRef.current, theme, {
      renderer: 'svg',
      locale: 'pt-br',
    })

    if (wasDisposed) {
      myChart.setOption(lineOption, true)
    }

    echartRef.current = myChart

    const handleResize = () => myChart.resize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      myChart.dispose()
    }
  }, [theme])

  useEffect(() => {
    if (echartRef.current) {
      echartRef.current.setOption(lineOption, true)
    }
  }, [lineOption])

  return <div ref={chartRef} className="h-big-chart w-full" />
}

export default MultiPeriodLineChartCore
