'use client'
import { generateChartOptions } from '@/lib/utils'
import { ChartData, ChartOptions } from '@/types/map'
import { EChartsOption } from 'echarts'
import { BarChart } from 'echarts/charts'
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
  BarChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  ToolboxComponent,
  CanvasRenderer,
  GridComponent,
  DataZoomComponent,
])

interface BarChartCoreProps {
  data: ChartData
  options: ChartOptions
}

const BarChartCore = (props: BarChartCoreProps) => {
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
      visualMap: {
        ...basicOptions.visualMap,
        calculable: false,
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          rotate: 30,
        },
        data: dataSorted.map(function (item) {
          return item.name
        }),
      },
      height: '70%',
      series: {
        id: `bar-${options.title}`,
        type: 'bar',
        data: dataSorted.map(function (item) {
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
  }, [dataSorted, options])

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

  return <div ref={chartRef} className="h-chart w-full" />
}

export default BarChartCore
