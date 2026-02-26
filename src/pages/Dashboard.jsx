import { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getRecentData } from '../api/sensorApi'
import './Dashboard.css'

function formatValue(val) {
  if (val == null || val === '') return '—'
  const n = Number(val)
  return Number.isNaN(n) ? String(val) : n
}

function formatNum(val, decimals = 2) {
  if (val == null || val === '') return '—'
  const n = Number(val)
  return Number.isNaN(n) ? '—' : n.toFixed(decimals)
}

function computeG(accelX, accelY) {
  const x = accelX != null ? Number(accelX) : null
  const y = accelY != null ? Number(accelY) : null
  if (x == null || Number.isNaN(x) || y == null || Number.isNaN(y)) return null
  return Math.sqrt(x * x + y * y)
}

export default function Dashboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterHelmetId, setFilterHelmetId] = useState('')
  const [lastFetch, setLastFetch] = useState(null)
  const [alertsPage, setAlertsPage] = useState(1)

  const ALERTS_PER_PAGE = 5

  const fetchData = async () => {
    try {
      setError(null)
      const res = await getRecentData()
      setData(Array.isArray(res.data) ? res.data : [])
      setLastFetch(new Date())
    } catch (e) {
      setError(e.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const latest = useMemo(() => data[0] || {}, [data])

  const chartData = useMemo(() => {
    const slice = data.slice(0, 15).reverse()
    return slice.map((d) => ({
      time: d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : '',
      temp: d.temperature,
      humidity: d.humidity,
    }))
  }, [data])

  const alerts = useMemo(() => data.filter((d) => d.emergency === true), [data])

  const alertsTotalPages = Math.max(1, Math.ceil(alerts.length / ALERTS_PER_PAGE))
  const alertsStart = (alertsPage - 1) * ALERTS_PER_PAGE
  const paginatedAlerts = alerts.slice(alertsStart, alertsStart + ALERTS_PER_PAGE)

  useEffect(() => {
    if (alertsPage > alertsTotalPages) setAlertsPage(1)
  }, [alertsPage, alertsTotalPages])

  const metrics = useMemo(() => {
    const nums = (key) =>
      data
        .map((d) => (d[key] != null ? Number(d[key]) : null))
        .filter((n) => n != null && !Number.isNaN(n))

    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null)

    const temps = nums('temperature')
    const hums = nums('humidity')
    const gases = nums('gasValue')

    const avgTemp = avg(temps)
    const avgHumidity = avg(hums)
    const avgGas = avg(gases)

    const anyEmergency = data.some((d) => d.emergency === true)

    return { avgTemp, avgHumidity, avgGas, anyEmergency }
  }, [data])

  const zones = useMemo(() => data.slice(0, 3), [data])

  const systemStatus =
    metrics.anyEmergency ? 'Emergency' : data.length === 0 ? 'Offline' : 'Online'
  const systemNote =
    systemStatus === 'Emergency'
      ? 'Check active helmet alerts'
      : systemStatus === 'Offline'
        ? 'No recent data – check connection'
        : 'Monitoring – no emergency flags'

  const lastAlert = alerts[0]

  const handleExport = () => {
    if (!data.length) return

    const headers = [
      'temperature',
      'humidity',
      'gasValue',
      'flameStatus',
      'irValue',
      'accelX',
      'accelY',
      'location',
      'emergency',
      'reason',
      'timestamp',
    ]

    const escape = (val) => {
      const str = val == null ? '' : String(val)
      return `"${str.replace(/"/g, '""')}"`
    }

    const rows = data.map((d) =>
      [
        d.temperature,
        d.humidity,
        d.gasValue,
        d.flameStatus,
        d.irValue,
        d.accelX,
        d.accelY,
        d.location,
        d.emergency,
        d.reason,
        d.timestamp,
      ]
        .map(escape)
        .join(',')
    )

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const date = new Date().toISOString().slice(0, 10)
    link.setAttribute('download', `helmet-readings-${date}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-title-row">
          <h1>Helmet Safety Overview</h1>
          <span className="live-badge" aria-hidden>
            Live
          </span>
        </div>
        <div className="dashboard-controls">
          <label className="filter-label">
            <span>Helmet ID</span>
            <input
              type="text"
              placeholder="Filter (optional)"
              value={filterHelmetId}
              onChange={(e) => setFilterHelmetId(e.target.value)}
              className="filter-input"
            />
          </label>
          <button
            type="button"
            className="export-btn"
            onClick={handleExport}
            disabled={!data.length}
          >
            Export
          </button>
          <button
            type="button"
            className="refresh-btn"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
        {lastFetch && (
          <p className="last-update">
            Last updated: {lastFetch.toLocaleTimeString()}
            {latest.timestamp && (
              <> · Latest reading: {new Date(latest.timestamp).toLocaleString()}</>
            )}
          </p>
        )}
      </div>

      {error && (
        <div className="dashboard-error">
          Could not load data: {error}. Check the API at minersgaurdhelmet.onrender.com
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="dashboard-loading">Loading live data…</div>
      ) : (
        <>
          {/* Top summary cards like reference design */}
          <div className="dashboard-summary-row">
            <div className="summary-card summary-temp">
              <div className="summary-header">
                <span className="summary-label">Avg. Temp</span>
                <span className="summary-chip">Optimum: 24°C</span>
              </div>
              <div className="summary-main">
                {formatNum(metrics.avgTemp, 1)}
                <span className="summary-unit">°C</span>
              </div>
              <div className="summary-sub">
                Latest: {formatValue(latest.temperature)}
                °C
              </div>
            </div>

            <div className="summary-card summary-humidity">
              <div className="summary-header">
                <span className="summary-label">Avg. Humidity</span>
                <span className="summary-chip">Optimum: 60%</span>
              </div>
              <div className="summary-main">
                {formatNum(metrics.avgHumidity, 1)}
                <span className="summary-unit">%</span>
              </div>
              <div className="summary-sub">
                Latest: {formatValue(latest.humidity)}
                %
              </div>
            </div>

            <div className="summary-card summary-gas">
              <div className="summary-header">
                <span className="summary-label">Avg. Gas</span>
                <span className="summary-chip">gasValue</span>
              </div>
              <div className="summary-main">
                {formatNum(metrics.avgGas, 1)}
              </div>
              <div className="summary-sub">
                Latest: {formatValue(latest.gasValue)}
              </div>
            </div>

            <div
              className={`summary-card summary-status summary-status-${systemStatus.toLowerCase()}`}
            >
              <div className="summary-header">
                <span className="summary-label">System status</span>
                <span className="summary-chip summary-chip-live">Live</span>
              </div>
              <div className="summary-main">
                {systemStatus}
              </div>
              <div className="summary-sub">{systemNote}</div>
            </div>
          </div>

          {/* Active readings and chart layout similar to “Active Zones” */}
          <section className="zones-section" aria-labelledby="zones-heading">
            <div className="zones-header">
              <h2 id="zones-heading">Active Readings</h2>
              <span className="zones-count">
                {data.length} readings in last fetch
              </span>
            </div>

            <div className="zones-layout">
              <div className="zones-grid">
                {zones.map((reading, index) => {
                  const g = computeG(reading.accelX, reading.accelY)
                  const emergency = reading.emergency === true
                  return (
                    <article key={reading.timestamp || index} className="zone-card">
                      <div className="zone-header">
                        <div>
                          <div className="zone-title">Helmet #{index + 1}</div>
                          <div className="zone-sub">
                            {reading.timestamp
                              ? new Date(reading.timestamp).toLocaleString()
                              : 'No timestamp'}
                          </div>
                        </div>
                        <span
                          className={`zone-chip ${
                            emergency ? 'zone-chip-emergency' : 'zone-chip-ok'
                          }`}
                        >
                          {emergency ? 'Emergency' : 'Monitoring'}
                        </span>
                      </div>

                      <div className="zone-metrics-row">
                        <div className="metric-pill">
                          <span>Temp</span>
                          <strong>{formatValue(reading.temperature)}°C</strong>
                        </div>
                        <div className="metric-pill">
                          <span>Humidity</span>
                          <strong>{formatValue(reading.humidity)}%</strong>
                        </div>
                        <div className="metric-pill">
                          <span>Gas</span>
                          <strong>{formatValue(reading.gasValue)}</strong>
                        </div>
                      </div>

                      <div className="zone-metrics-row">
                        <div className="metric-pill">
                          <span>flameStatus</span>
                          <strong>{formatValue(reading.flameStatus)}</strong>
                        </div>
                        <div className="metric-pill">
                          <span>irValue</span>
                          <strong>{formatValue(reading.irValue)}</strong>
                        </div>
                        <div className="metric-pill">
                          <span>G‑force</span>
                          <strong>{formatNum(g, 2)}</strong>
                        </div>
                      </div>

                      <div className="zone-footer">
                        <span className="zone-label">
                          Location:{' '}
                          <strong>
                            {reading.location || 'Not provided'}
                          </strong>
                        </span>
                        {emergency && (
                          <span className="zone-status-text">
                            {reading.reason || 'Emergency flagged'}
                          </span>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="zones-side">
                <div className="dashboard-card chart-card">
                  <div className="chart-header">
                    <h3>Temperature &amp; Humidity trend</h3>
                    <span className="chart-chip">Last 15 readings</span>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="temp"
                          stroke="var(--accent-dark)"
                          name="Temperature °C"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          stroke="#2196F3"
                          name="Humidity %"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="dashboard-card insights-card">
                  <h3>Safety insights</h3>
                  {alerts.length === 0 ? (
                    <p>
                      No emergency flags in the recent readings. Gas, temperature and
                      movement are within configured bounds.
                    </p>
                  ) : (
                    <>
                      <p>
                        Latest emergency at{' '}
                        {lastAlert.timestamp
                          ? new Date(lastAlert.timestamp).toLocaleString()
                          : 'unknown time'}
                        .
                      </p>
                      <p>
                        Reason: <strong>{lastAlert.reason || 'No reason provided'}</strong>
                      </p>
                      <p>
                        Monitor gasValue, temperature and G‑force closely for this helmet.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            className="dashboard-section alerts-section"
            aria-labelledby="alerts-heading"
          >
            <h2 id="alerts-heading">Critical alerts (emergency + reason)</h2>
            {alerts.length === 0 ? (
              <p className="no-alerts">No emergency alerts in recent data.</p>
            ) : (
              <>
                <ul className="alerts-list">
                  {paginatedAlerts.map((a, i) => (
                    <li key={a.timestamp || i} className="alert-item">
                      <span className="alert-badge">Emergency</span>
                      <span className="alert-reason">
                        {a.reason != null && a.reason !== ''
                          ? a.reason
                          : 'No reason provided'}
                      </span>
                      <span className="alert-time">
                        {a.timestamp ? new Date(a.timestamp).toLocaleString() : ''}
                      </span>
                    </li>
                  ))}
                </ul>
                <nav
                  className="alerts-pagination"
                  aria-label="Critical alerts pagination"
                >
                  <span className="alerts-pagination-info">
                    Showing {alertsStart + 1}–{Math.min(alertsStart + ALERTS_PER_PAGE, alerts.length)} of {alerts.length}
                  </span>
                  <div className="alerts-pagination-controls">
                    <button
                      type="button"
                      className="alerts-pagination-btn"
                      onClick={() => setAlertsPage((p) => Math.max(1, p - 1))}
                      disabled={alertsPage <= 1}
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    <span className="alerts-pagination-pages">
                      Page {alertsPage} of {alertsTotalPages}
                    </span>
                    <button
                      type="button"
                      className="alerts-pagination-btn"
                      onClick={() => setAlertsPage((p) => Math.min(alertsTotalPages, p + 1))}
                      disabled={alertsPage >= alertsTotalPages}
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              </>
            )}
          </section>
        </>
      )}
    </div>
  )
}
