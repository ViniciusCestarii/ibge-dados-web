'use client'
import useAppliedTheme from '@/hooks/use-applied-theme'
import { fetchGeoJsonMap } from '@/lib/fetch-data'
import { generateChartOptions, getGeoFilename } from '@/lib/utils'
import { NivelId } from '@/types/agregado'
import { ChartCoreProps, GeoJson } from '@/types/chart'
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
import { useTheme } from 'next-themes'
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
interface GeoChartCoreProps extends ChartCoreProps {
  nivelGeografico: NivelId
}

const GeoChartCore = (props: GeoChartCoreProps) => {
  const { data, nivelGeografico, options } = props

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

  const mapOption: EChartsOption = useMemo(() => {
    const basicOptions = generateChartOptions(props)

    return {
      ...basicOptions,
      visualMap: {
        ...basicOptions.visualMap,
        realtime: getGeoFilename(nivelGeografico) !== 'municipios',
      },
      series: {
        zoom: getGeoFilename(nivelGeografico) === 'municipios' ? 5 : 1.1,
        center: mapCenter,
        id: `geo-${options.title}`,
        name: options.title,
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
    }
  }, [data, options, mapCenter])

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

  const theme = useAppliedTheme()

  useEffect(() => {
    if (!(echartRef.current && geoJson)) return

    echartRef.current?.dispose()

    const wasDisposed = echartRef.current?.isDisposed()

    const myChart = echarts.init(chartRef.current, theme)

    if (wasDisposed) {
      myChart.setOption(mapOption, true)
    }

    echartRef.current = myChart

    const handleResize = () => myChart.resize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      myChart.dispose()
    }
  }, [geoJson])

  useEffect(() => {
    if (echartRef.current && geoJson) {
      echartRef.current.setOption(mapOption, true)
    }
  }, [mapOption, geoJson])

  return <div ref={chartRef} className="w-full h-chart px-4 sm:px-0" />
}

export default GeoChartCore
