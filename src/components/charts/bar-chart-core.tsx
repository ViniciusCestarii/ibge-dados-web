'use client'
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

const BarChartCore = ({ data, options }: BarChartCoreProps) => {
  const chartRef = useRef(null)
  const echartRef = useRef<null | echarts.ECharts>(null)

  const dataSorted = useMemo(() => {
    data.sort(function (a, b) {
      return a.value - b.value
    })

    const dataReversed = data.slice().reverse()
    return dataReversed
  }, [data])

  const barOption: EChartsOption = useMemo(
    () => ({
      tooltip: {
        formatter: `{b}: {c} ${options.unidade}`,
      },
      title: {
        text: options.title,
        left: '1%',
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
      backgroundColor: 'transparent',
      visualMap: {
        right: '2%',
        top: '15%',
        min: data.length > 1 ? Math.ceil(data[data.length - 1].value) : 0,
        max: Math.floor(data[0].value),
        orient: 'vertical',
        text: ['', options.unidade],
        inRange: {
          color: ['#FFFFFF', '#A9A9A9', '#808080', '#696969', '#2F2F2F'],
        },
      },
      dataZoom: [
        {},
        {
          type: 'inside',
        },
      ],
      toolbox: {
        show: true,
        left: 'right',
        top: 'top',
        feature: {
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {},
        },
      },
    }),
    [dataSorted, data, options],
  )

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
