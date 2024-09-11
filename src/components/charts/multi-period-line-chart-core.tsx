'use client'
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

const MultiPeriodLineChartCore = ({
  data,
  options,
}: MultiPeriodLineChartCoreProps) => {
  const chartRef = useRef(null)
  const echartRef = useRef<null | echarts.ECharts>(null)

  const dataSorted = useMemo(() => {
    const sortedData = data.toSorted(function (a, b) {
      return b.value - a.value
    })

    return sortedData
  }, [data])

  const barOption: EChartsOption = useMemo(
    () => ({
      tooltip: {
        formatter: `{b}: {c} ${options.unidade}`,
        trigger: 'axis',
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
        data: data.map(function (item) {
          return item.name
        }),
      },
      height: '70%',
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
      backgroundColor: 'transparent',
      visualMap: {
        right: '2%',
        top: '15%',
        min:
          dataSorted.length > 1
            ? Math.ceil(dataSorted[dataSorted.length - 1].value)
            : Math.floor(dataSorted[0].value),
        max: Math.floor(dataSorted[0].value),
        orient: 'vertical',
        text: ['', options.unidade],
        realtime: true,
        calculable: true,
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

  return <div ref={chartRef} className="h-big-chart w-full" />
}

export default MultiPeriodLineChartCore