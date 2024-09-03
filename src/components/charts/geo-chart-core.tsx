'use client'
import { ChartData, ChartOptions } from '@/types/map'
import { EChartsOption } from 'echarts'
import { MapChart } from 'echarts/charts'
import {
  DataZoomComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useMemo, useRef } from 'react'

echarts.use([
  MapChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  ToolboxComponent,
  CanvasRenderer,
  DataZoomComponent,
])

interface GeoChartCoreProps {
  data: ChartData
  geoJson: object
  options: ChartOptions
}

const GeoChartCore = ({ data, geoJson, options }: GeoChartCoreProps) => {
  const chartRef = useRef(null)
  const echartRef = useRef<null | echarts.ECharts>(null)

  const mapOption: EChartsOption = useMemo(
    () => ({
      tooltip: {
        formatter: `{b}: {c} ${options.unidade}`,
      },
      title: {
        text: options.title,
        left: '1%',
      },
      visualMap: {
        right: '10%',
        top: '15%',
        min: Math.ceil(data[data.length - 1].value),
        max: Math.floor(data[0].value),
        orient: 'vertical',
        text: ['', options.unidade],
        realtime: true,
        calculable: true,
        inRange: {
          color: ['#CAF0F8', '#90E0EF', '#0077B6', '#023E8A'],
        },
      },
      backgroundColor: 'transparent',
      series: {
        id: 'population',
        name: 'Poulação 2020',
        type: 'map',
        map: 'geo-map',
        roam: true,
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: '#023E8A',
            borderColor: '#111A48',
            borderWidth: 1,
          },
        },
        selectedMode: false,
        data,
      },
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
    [data, options],
  )

  useEffect(() => {
    const myChart = echarts.init(chartRef.current, 'dark')
    echarts.registerMap('geo-map', {
      geoJSON: geoJson,
    } as any)

    echartRef.current = myChart

    return () => {
      myChart.dispose()
    }
  }, [geoJson])

  useEffect(() => {
    if (echartRef.current) {
      echartRef.current.setOption(mapOption, true)
    }
  }, [mapOption])

  return <div ref={chartRef} style={{ height: '600px', width: '100%' }} />
}

export default GeoChartCore
