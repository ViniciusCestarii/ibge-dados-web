'use client'
import { fetchGeoJsonMap } from '@/lib/fetch-data'
import { getGeoFilename } from '@/lib/utils'
import { NivelId } from '@/types/agregado'
import { ChartData, ChartOptions, GeoJson } from '@/types/map'
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
  const [geoJson, setGeoJson] = useState<GeoJson | null>(null)

  // Calculate the average coordinates from geoJson
  const calculateGeoJsonCenter = useCallback(
    (geoJson: GeoJson) => {
      let totalLat = 0
      let totalLon = 0
      let count = 0

      geoJson.features.forEach((feature) => {
        if (
          !feature.geometry?.coordinates ||
          !feature.properties.name ||
          !data.some(({ name }) => name === feature.properties.name) ||
          !feature.geometry.coordinates[0][0] ||
          feature.geometry.coordinates[0][0].length !== 2
        )
          return

        feature.geometry.coordinates.forEach((coord) => {
          coord.forEach((c) => {
            const [lat, lon] = c
            totalLat += lat
            totalLon += lon
            count++
          })
        })
      })

      return [totalLat / count, totalLon / count] // [latitude, longitude]
    },
    [data],
  )

  const mapCenter = useMemo(() => {
    if (!geoJson || getGeoFilename(nivelGeografico) !== 'municipios')
      return undefined

    return calculateGeoJsonCenter(geoJson)
  }, [calculateGeoJsonCenter, geoJson, nivelGeografico])

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
        right: '2%',
        top: '15%',
        min: data.length > 1 ? Math.ceil(data[data.length - 1].value) : 0,
        max: Math.floor(data[0].value),
        orient: 'vertical',
        text: ['', options.unidade],
        realtime: getGeoFilename(nivelGeografico) !== 'municipios',
        calculable: true,
        inRange: {
          color: ['#CACACA', '#A9A9A9', '#808080', '#696969', '#2F2F2F'],
        },
      },
      backgroundColor: 'transparent',
      series: {
        zoom: getGeoFilename(nivelGeografico) === 'municipios' ? 5 : 1.1,
        center: mapCenter,
        id: `geo-${options.title}`,
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
    [data, options, mapCenter],
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
      const geoJsonData = await fetchGeoJsonMap(nivelGeografico)
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
