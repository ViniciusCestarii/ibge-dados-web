'use client'
import { getGeoJsonMap } from '@/lib/get-json'
import { NivelId } from '@/types/agregado'
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
import { useEffect, useMemo, useRef, useState } from 'react'

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
  nivelGeografico: NivelId
  options: ChartOptions
}

const GeoChartCore = ({
  data,
  options,
  nivelGeografico,
}: GeoChartCoreProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const echartRef = useRef<echarts.ECharts | null>(null)
  const [geoJson, setGeoJson] = useState<object | null>(null)

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
          color: ['#CACACA', '#A9A9A9', '#808080', '#696969', '#2F2F2F'],
        },
      },
      backgroundColor: 'transparent',
      series: {
        id: 'population',
        name: 'População 2020',
        type: 'map',
        map: 'geo-map',
        roam: true,
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: '#808080',
            borderColor: '#000000',
            borderWidth: 1.5,
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
    if (!chartRef.current) return

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
    if (geoJson) {
      echarts.registerMap('geo-map', {
        geoJSON: geoJson,
      } as any)
    }
  }, [geoJson])

  useEffect(() => {
    const fetchGeoJson = async () => {
      const geoJsonData = await getGeoJsonMap(nivelGeografico)
      setGeoJson(geoJsonData)
    }

    fetchGeoJson()
  }, [nivelGeografico])

  useEffect(() => {
    if (echartRef.current && geoJson) {
      echartRef.current.setOption(mapOption, true)
    }
  }, [mapOption, geoJson])

  return <div ref={chartRef} className="w-full h-chart px-4 sm:px-0" />
}

export default GeoChartCore
