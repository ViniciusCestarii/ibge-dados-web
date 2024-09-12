'use client'
import { generateChartOptions } from '@/lib/utils'
import { ChartData, ChartOptions } from '@/types/map'
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
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useMemo, useRef } from 'react'

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  ToolboxComponent,
  CanvasRenderer,
  GridComponent,
  DataZoomComponent,
])

interface MultiPeriodLineChartCoreProps {
  data: ChartData
  options: ChartOptions
}

const MultiPeriodLineChartCore = (props: MultiPeriodLineChartCoreProps) => {
  const { data, options } = props

  const chartRef = useRef(null)
  const echartRef = useRef<null | echarts.ECharts>(null)

  const dataSorted = useMemo(() => {
    const sortedData = data.toSorted(function (a, b) {
      return b.value - a.value
    })

    return sortedData
  }, [data])

  const barOption: EChartsOption = useMemo(() => {
    const basicOptions = generateChartOptions(props)
    return {
      ...basicOptions,
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
      series: {
        id: `line-${options.title}`,
        type: 'line',
        data: data.map(function (item) {
          return item.value
        }),
        emphasis: {
          itemStyle: {
            borderColor: '#000000',
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

  useEffect(() => {
    const myChart = echarts.init(chartRef.current, 'dark')

    echartRef.current = myChart

    window.onresize = function () {
      myChart.resize()
    }

    return () => {
      myChart.dispose()
    }
  }, [])

  useEffect(() => {
    if (echartRef.current) {
      echartRef.current.setOption(barOption, true)
    }
  }, [barOption])

  return <div ref={chartRef} className="h-big-chart w-full" />
}

export default MultiPeriodLineChartCore
