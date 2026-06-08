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

  // ISSUE 1 FIX: Budget Spent must include AI cost from ProjectFinancialService
  const aiCost = aiFinancials?.actual_ai_cost || 0
  const totalSpent = expense.value + aiCost
  const remaining = Math.max(budget.value - totalSpent, 0)
  const budgetUtilization = budget.value > 0 ? Math.min((totalSpent / budget.value) * 100, 100) : 0

  // ISSUE 6 FIX: Standardized number formatting with commas and decimals
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatHours = (value: number) => {
    return value % 1 === 0 ? `${value}h` : `${value.toFixed(1)}h`
  }

  // ISSUE 5 FIX: Savings percentage shown as positive
  const savingsPercent = aiFinancials && aiFinancials.equivalent_human_cost > 0
    ? Math.round((aiFinancials.saved_budget / aiFinancials.equivalent_human_cost) * 100)
    : 0

  // Bar chart config - dark theme
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Space Grotesk, Inter, sans-serif',
      background: 'transparent',
    },
    theme: { mode: 'dark' },
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
      style: { fontSize: '12px', colors: ['#c5c6d4'] },
      offsetX: 20,
    },
    xaxis: {
      categories: aiFinancials?.breakdown?.map(w => w.name) || [],
      labels: { style: { fontSize: '12px', colors: '#9ea0b7' } },
      title: { text: 'Hours', style: { fontSize: '12px', color: '#666984' } },
    },
    yaxis: {
      labels: { style: { fontSize: '12px', colors: ['#c5c6d4'] } },
    },
    grid: { borderColor: 'rgba(255,255,255,0.06)' },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => `${val} hours` },
    },
  }

  const barChartSeries = [
    {
      name: 'Hours',
      data: aiFinancials?.breakdown?.map(w => w.actual_hours) || [],
    },
  ]

  // Donut chart config - dark theme
  const donutChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Space Grotesk, Inter, sans-serif',
      background: 'transparent',
    },
    theme: { mode: 'dark' },
    labels: aiFinancials?.breakdown?.map(w => w.name) || [],
    colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: { colors: '#9ea0b7' },
      formatter: (seriesName: string, opts: any) => {
        const val = opts.w.globals.series[opts.seriesIndex]
        return `${seriesName}: ${formatCurrency(val)}`
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: { colors: ['#fff'] },
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
              color: '#9ea0b7',
              formatter: () => formatCurrency(aiFinancials?.actual_ai_cost || 0),
            },
          },
        },
      },
    },
    stroke: { colors: ['#1b1e29'] },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => formatCurrency(val) },
    },
  }

  const donutChartSeries = aiFinancials?.breakdown?.map(w => w.actual_cost) || []

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
            <span className={styles.metricValue}>{formatCurrency(budget.value)}</span>
          </div>
          <div className={`${styles.metricCard} ${styles.spentCard}`}>
            <span className={styles.metricLabel}>Spent</span>
            <span className={styles.metricValue}>{formatCurrency(totalSpent)}</span>
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
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {Math.round(budgetUtilization)}% utilized
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
                <span className={styles.metricBadge}>{savingsPercent}% saved</span>
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
              <div className={styles.chartTotalBelow}>
                <span className={styles.chartTotalBelowLabel}>Total Cost</span>
                <span className={styles.chartTotalBelowValue}>{formatCurrency(aiFinancials?.actual_ai_cost || 0)}</span>
              </div>
            </div>
          </div>

          {/* ISSUE 4 FIX: Desktop table + Mobile cards */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Workforce Comparison</h3>

            {/* Desktop Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Role</th>
                    <th>Hours</th>
                    <th>Rate</th>
                    <th>AI Cost</th>
                    <th>Human Equiv.</th>
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

            {/* Mobile Cards */}
            <div className={styles.mobileCards}>
              {aiFinancials.breakdown?.map((worker) => {
                const humanEquiv = worker.actual_hours * 200
                const savings = humanEquiv - worker.actual_cost
                const aiWorkerInfo = aiTeam.find(w => w.id === worker.id)
                return (
                  <div key={worker.id} className={styles.workerCard}>
                    <div className={styles.workerCardHeader}>
                      {aiWorkerInfo?.img && (
                        <img
                          src={`${aiWorkerInfo.img}?width=40&height=40`}
                          alt={worker.name}
                          className={styles.workerCardAvatar}
                        />
                      )}
                      <div className={styles.workerCardInfo}>
                        <span className={styles.workerCardName}>{worker.name}</span>
                        <span className={styles.workerCardRole}>
                          {aiWorkerInfo?.jobTitle || 'AI Worker'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.workerCardMetrics}>
                      <div className={styles.workerCardMetric}>
                        <span className={styles.workerCardMetricLabel}>Hours</span>
                        <span className={styles.workerCardMetricValue}>{formatHours(worker.actual_hours)}</span>
                      </div>
                      <div className={styles.workerCardMetric}>
                        <span className={styles.workerCardMetricLabel}>Rate</span>
                        <span className={styles.workerCardMetricValue}>{formatCurrency(worker.hourly_rate)}/h</span>
                      </div>
                      <div className={styles.workerCardMetric}>
                        <span className={styles.workerCardMetricLabel}>AI Cost</span>
                        <span className={styles.workerCardMetricValue}>{formatCurrency(worker.actual_cost)}</span>
                      </div>
                      <div className={styles.workerCardMetric}>
                        <span className={styles.workerCardMetricLabel}>Human Equiv.</span>
                        <span className={styles.workerCardMetricValue}>{formatCurrency(humanEquiv)}</span>
                      </div>
                      <div className={`${styles.workerCardMetric} ${styles.workerCardSavings}`}>
                        <span className={styles.workerCardMetricLabel}>Savings</span>
                        <span className={styles.workerCardMetricValue}>{formatCurrency(savings)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {!aiFinancials && (
        <div className={styles.emptyState}>
          <h3>No AI Workforce Data</h3>
          <p>Assign AI workers to this project and log time to see analytics here.</p>
        </div>
      )}
    </div>
  )
}
