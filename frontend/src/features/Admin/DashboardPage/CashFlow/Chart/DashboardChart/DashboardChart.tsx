import { FC, useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

import styles from './DashboardChart.module.scss'

interface DataEntry {
  Income: number
  Expense: number
}

interface DataJson {
  [key: string]: DataEntry
}

interface DashboardChartProps {
  data: DataJson
}

export const DashboardChart: FC<DashboardChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const typedDataJson = Object.fromEntries(
      Object.entries(data).reverse(),
    )

    const labels = Object.keys(typedDataJson)

    const incomeData = labels.map(label => typedDataJson[label].Income)
    const expenseData = labels.map(label => typedDataJson[label].Expense)

    const series = [
      {
        name: 'Income',
        type: 'bar',
        data: incomeData,
        color: '#5965E7',
      },
      {
        name: 'Expense',
        type: 'area',
        data: expenseData,
        color: '#DC286A',
      },
    ]

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
          labels: {
            style: {
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '21px',
              letterSpacing: '-0.03em',
              color: '#666984',
            },
          },
          tickPlacement: 'on',
          tickAmount: labels.length, // Количество вертикальных полосок
          tickWidth: 10, // Увеличиваем ширину вертикальных полосок
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#35353f',
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
              color: '#666984',
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
            formatter: (val: string) => `Category: ${val}`, // Форматируем значение по оси X
          },
          y: {
            formatter: (val: number) => `Value: ${val}`, // Форматируем значение по оси Y
          },
        },
        grid: {
          borderColor: '#666984',
          yaxis: {
            lines: {
              show: true,
              color: '#666984',
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
    return <div>Loading...</div>
  }

  return (
    <div className={styles.wrapper}>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type='line'
        height='100%'
        width='100%'
      />
    </div>
  )
}
