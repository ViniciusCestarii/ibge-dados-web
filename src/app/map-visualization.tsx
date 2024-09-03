'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import brasilEstados from '@/json/geo/brasil/estados.json'
import * as echarts from 'echarts/core'
import { BarChart, MapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  MapChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  ToolboxComponent,
  CanvasRenderer,
  GridComponent,
  DataZoomComponent,
])

interface AnimatedSantaCatarinaMapEchartUsingJsonProps {
  data: { name: string; value: number }[]
}

const AnimatedSantaCatarinaMapEchartUsingJson = ({
  data,
}: AnimatedSantaCatarinaMapEchartUsingJsonProps) => {
  const chartRef = useRef(null)
  const echartRef = useRef<null | echarts.ECharts>(null)
  const [isMap, setIsMap] = useState(true)

  const dataSorted = useMemo(() => {
    data.sort(function (a, b) {
      return a.value - b.value
    })

    const dataReversed = data.slice().reverse()
    return dataReversed
  }, [data])

  const mapOption = {
    tooltip: {
      formatter: '{b}: {c} mil',
    },
    title: {
      text: 'População 2020 (mil)',
      left: '1%',
    },
    visualMap: {
      right: '10%',
      top: '15%',
      min: Math.ceil(data[data.length - 1].value),
      max: Math.floor(data[0].value),
      orient: 'vertical',
      text: ['', 'População (mil)'],
      realtime: true,
      calculable: true,
      inRange: {
        color: ['#CAF0F8', '#90E0EF', '#0077B6', '#023E8A'],
      },
    },
    series: {
      id: 'population',
      name: 'Poulação 2020',
      type: 'map',
      map: 'Santa_Catarina_Json_map',
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
      universalTransition: true,
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
  }

  const barOption = {
    tooltip: {
      formatter: '{b}: {c} mil',
    },
    title: {
      text: 'População 2020 (mil)',
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
      id: 'population',
      type: 'bar',
      data: dataSorted.map(function (item) {
        return item.value
      }),
      emphasis: {
        itemStyle: {
          color: '#023E8A',
          borderColor: '#111A48',
          borderWidth: 1,
        },
      },
      universalTransition: true,
    },
    visualMap: {
      right: '2%',
      top: '15%',
      min: Math.ceil(data[data.length - 1].value),
      max: Math.floor(data[0].value),
      orient: 'vertical',
      text: ['', 'População (mil)'],
      inRange: {
        color: ['#CAF0F8', '#90E0EF', '#0077B6', '#023E8A'],
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
  }

  useEffect(() => {
    const myChart = echarts.init(chartRef.current, 'dark')
    echarts.registerMap('Santa_Catarina_Json_map', {
      geoJSON: brasilEstados,
    } as any)

    echartRef.current = myChart

    return () => {
      myChart.dispose()
    }
  }, [])

  useEffect(() => {
    if (echartRef.current) {
      const currentOption: any = isMap ? mapOption : barOption
      echartRef.current.setOption(currentOption, true)
    }
  }, [isMap])

  return (
    <>
      <button
        onClick={() => setIsMap(!isMap)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        mudar tipo de gráfico
      </button>

      <div ref={chartRef} style={{ height: '600px', width: '100%' }} />
    </>
  )
}

export default AnimatedSantaCatarinaMapEchartUsingJson
