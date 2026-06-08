import { useOutletContext } from 'react-router-dom'
import styles from './AnalyticsPage.module.scss'
import { ProjectViewPageContext } from '../../../../../app/constants/constants'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

export const AdminProjectsAnalyticsPage = () => {
  const context = useOutletContext<ProjectViewPageContext>()
  const projectInfo = context?.projectInfo
  const aiFinancials = projectInfo?.aiFinancials || null
  const aiTeam = projectInfo?.users?.aiTeam || []
  const budget = projectInfo?.budget || { value: 0, format: '$0' }
  const expense = projectInfo?.expense || { value: 0, format: '$0' }
  const remaining = budget.value - expense.value

  // Format currency
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  const formatHours = (value: number) => {
    return `${value.toFixed(1)}h`
  }

  // Bar chart config for hours by worker
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '60%',
      },
    },
    colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}h`,
      style: { fontSize: '12px', colors: ['#374151'] },
      offsetX: 20,
    },
    xaxis: {
      categories: aiFinancials?.breakdown?.map(w => w.name) || [],
      labels: { style: { fontSize: '12px' } },
      title: { text: 'Hours', style: { fontSize: '12px', color: '#6b7280' } },
    },
    yaxis: {
      labels: { style: { fontSize: '12px' } },
    },
    grid: { borderColor: '#f3f4f6' },
    tooltip: {
      y: { formatter: (val: number) => `${val} hours` },
    },
  }

  const barChartSeries = [
    {
      name: 'Hours',
      data: aiFinancials?.breakdown?.map(w => w.actual_hours) || [],
    },
  ]

  // Donut chart config for cost distribution
  const donutChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    labels: aiFinancials?.breakdown?.map(w => w.name) || [],
    colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      formatter: (seriesName: string, opts: any) => {
        const val = opts.w.globals.series[opts.seriesIndex]
        return `${seriesName}: $${val}`
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Cost',
              formatter: () => formatCurrency(aiFinancials?.actual_ai_cost || 0),
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val: number) => `$${val}` },
    },
  }

  const donutChartSeries = aiFinancials?.breakdown?.map(w => w.actual_cost) || []

  // Calculate savings percentage
  const savingsPercent = aiFinancials && aiFinancials.equivalent_human_cost > 0
    ? Math.round((aiFinancials.saved_budget / aiFinancials.equivalent_human_cost) * 100)
    : 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>AI Workforce Analytics</h2>
        <span className={styles.subtitle}>Financial performance and workforce utilization</span>
      </div>

      {/* Budget Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Project Budget</h3>
        <div className={styles.metricsRow}>
          <div className={`${styles.metricCard} ${styles.budgetCard}`}>
            <span className={styles.metricLabel}>Total Budget</span>
            <span className={styles.metricValue}>{budget.format}</span>
          </div>
          <div className={`${styles.metricCard} ${styles.spentCard}`}>
            <span className={styles.metricLabel}>Spent</span>
            <span className={styles.metricValue}>{expense.format}</span>
          </div>
          <div className={`${styles.metricCard} ${styles.remainingCard}`}>
            <span className={styles.metricLabel}>Remaining</span>
            <span className={styles.metricValue}>{formatCurrency(remaining)}</span>
          </div>
        </div>
        {budget.value > 0 && (
          <div className={styles.progressBar}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min((expense.value / budget.value) * 100, 100)}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {Math.round((expense.value / budget.value) * 100)}% utilized
            </span>
          </div>
        )}
      </div>

      {/* AI Workforce Metrics */}
      {aiFinancials && (
        <>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>AI Workforce Cost Efficiency</h3>
            <div className={styles.metricsRow}>
              <div className={`${styles.metricCard} ${styles.aiCostCard}`}>
                <span className={styles.metricLabel}>AI Cost</span>
                <span className={styles.metricValue}>{formatCurrency(aiFinancials.actual_ai_cost)}</span>
              </div>
              <div className={`${styles.metricCard} ${styles.humanCostCard}`}>
                <span className={styles.metricLabel}>Equivalent Human Cost</span>
                <span className={styles.metricValue}>{formatCurrency(aiFinancials.equivalent_human_cost)}</span>
              </div>
              <div className={`${styles.metricCard} ${styles.savedCard}`}>
                <span className={styles.metricLabel}>Saved Budget</span>
                <span className={styles.metricValue}>{formatCurrency(aiFinancials.saved_budget)}</span>
                <span className={styles.metricBadge}>-{savingsPercent}%</span>
              </div>
              <div className={`${styles.metricCard} ${styles.hoursCard}`}>
                <span className={styles.metricLabel}>Total AI Hours</span>
                <span className={styles.metricValue}>{formatHours(aiFinancials.ai_hours)}</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className={styles.chartsRow}>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Hours by AI Worker</h3>
              <ReactApexChart
                options={barChartOptions}
                series={barChartSeries}
                type="bar"
                height={Math.max(200, (aiFinancials.breakdown?.length || 1) * 50)}
              />
            </div>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Cost Distribution</h3>
              <ReactApexChart
                options={donutChartOptions}
                series={donutChartSeries}
                type="donut"
                height={300}
              />
            </div>
          </div>

          {/* Detailed Table */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Workforce Comparison</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Type</th>
                    <th>Hours</th>
                    <th>Rate</th>
                    <th>AI Cost</th>
                    <th>Human Equivalent</th>
                    <th>Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {aiFinancials.breakdown?.map((worker) => {
                    const humanEquiv = worker.actual_hours * 200
                    const savings = humanEquiv - worker.actual_cost
                    const aiWorkerInfo = aiTeam.find(w => w.id === worker.id)
                    return (
                      <tr key={worker.id}>
                        <td className={styles.workerCell}>
                          {aiWorkerInfo?.img && (
                            <img
                              src={`${aiWorkerInfo.img}?width=32&height=32`}
                              alt={worker.name}
                              className={styles.workerAvatar}
                            />
                          )}
                          <span>{worker.name}</span>
                        </td>
                        <td>
                          <span className={styles.typeBadge}>
                            {aiWorkerInfo?.jobTitle || 'AI Worker'}
                          </span>
                        </td>
                        <td>{formatHours(worker.actual_hours)}</td>
                        <td>{formatCurrency(worker.hourly_rate)}/h</td>
                        <td>{formatCurrency(worker.actual_cost)}</td>
                        <td>{formatCurrency(humanEquiv)}</td>
                        <td className={styles.savingsCell}>
                          {formatCurrency(savings)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className={styles.totalRow}>
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td><strong>{formatHours(aiFinancials.ai_hours)}</strong></td>
                    <td></td>
                    <td><strong>{formatCurrency(aiFinancials.actual_ai_cost)}</strong></td>
                    <td><strong>{formatCurrency(aiFinancials.equivalent_human_cost)}</strong></td>
                    <td className={styles.savingsCell}>
                      <strong>{formatCurrency(aiFinancials.saved_budget)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {!aiFinancials && (
        <div className={styles.emptyState}>
          <img src="/icons/elements.svg" alt="" className={styles.emptyIcon} />
          <h3>No AI Workforce Data</h3>
          <p>Assign AI workers to this project and log time to see analytics here.</p>
        </div>
      )}
    </div>
  )
}
