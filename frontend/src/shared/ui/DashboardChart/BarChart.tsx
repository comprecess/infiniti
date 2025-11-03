import './BarChart.scss'

import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner'

export interface DataJson {
  [key: string]: any
}

interface DashboardChartProps {
  data: DataJson
  namesKeys:
    | ['admin-dashboard-page-bar-chart-legend-1', 'admin-dashboard-page-bar-chart-legend-2']
    | ['admin-dashboard-page-bar-chart-legend-3', 'admin-dashboard-page-bar-chart-legend-4']
}

export const BarChart = ({ data, namesKeys }: DashboardChartProps) => {
  const [chartData, setChartData] = useState<any>(null)

  const { t } = useTranslation()

  useEffect(() => {
    const typedDataJson = Object.fromEntries(Object.entries(data).reverse())
    const labels = Object.keys(typedDataJson)

    const allKeys = new Set<string>()
    labels.forEach(label => {
      Object.keys(typedDataJson[label] || {}).forEach(key => allKeys.add(key))
    })

    const colorPalette = ['#5965E7', '#DC286A']
    const typePalette = ['column', 'area']

    const series = Array.from(allKeys).map((key, index) => ({
      name: t(namesKeys[index]),
      type: typePalette[index],
      data: labels.map(label => typedDataJson[label]?.[key] ?? 0),
      color: colorPalette[index],
    }))

    setChartData({
      options: {
        chart: {
          height: '100%',
          stacked: false,
          toolbar: {
            show: false, // Отключаем панель управления
          },
          zoom: {
            enabled: false, // Отключаем масштабирование
          },
          pan: {
            enabled: false, // Отключаем перемещение графика
          },
          events: {
            click: () => {},
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            columnWidth: '35%',
            dataLabels: {
              position: 'top', // Позиция меток данных
              enabled: false, // Отключаем метки данных
            },
          },
        },
        stroke: {
          width: [0, 3], // Сначала ширина линии (для area), потом для bar (0)
          curve: 'smooth', // Для плавности линии
        },
        xaxis: {
          categories: labels,
          type: 'datetime',
          labels: {
            style: {
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '21px',
              letterSpacing: '-0.03em',
              colors: '#666984',
            },
          },
          tickPlacement: 'on',
          tickAmount: labels.length, // Количество вертикальных полосок
          tickWidth: 10, // Увеличиваем ширину вертикальных полосок
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#666984',
            height: 12, // Увеличиваем высоту вертикальных полосок
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '21px',
              letterSpacing: '-0.03em',
              colors: '#666984',
            },
          },
        },
        tooltip: {
          enabled: true, // Включаем подсказки
          shared: true,
          intersect: false,
          style: {
            fontSize: '14px',
            fontWeight: 400,
          },
          marker: {
            show: true,
          },
          background: '#1b1e29', // Устанавливаем цвет фона подсказок
          theme: 'dark', // Устанавливаем темную тему для подсказок
          x: {
            show: false,
            formatter: undefined,
          },
          y: {
            formatter(val: number) {
              if (typeof val !== 'undefined') {
                return val.toFixed(0)
              }

              return val
            },
          },
        },
        grid: {
          borderColor: '#666984',
          yaxis: {
            lines: {
              show: true,
              colors: '#666984',
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 0,
            opacityFrom: 1,
            opacityTo: 0.08,
            type: 'vertical',
            stops: [0, 100],
          },
        },
        legend: {
          show: false,
        },
      },
      series,
    })
  }, [])

  if (!chartData) {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingSpinner size='xl' />
      </div>
    )
  }

  return (
    <div className='wrapper'>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type='line'
        height={282}
      />
    </div>
  )
}
