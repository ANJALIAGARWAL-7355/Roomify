import { useState, useEffect } from 'react'
import './SOSAlerts.css'

function SOSAlerts() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // 'all', 'pending', 'resolved'

    const fetchAlerts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/sos-alerts?status=${filter}`)
            const data = await response.json()
            if (data.alerts) {
                setAlerts(data.alerts)
            }
        } catch (error) {
            console.error('Error fetching SOS alerts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
        // Poll for new alerts every 30 seconds
        const interval = setInterval(fetchAlerts, 30000)
        return () => clearInterval(interval)
    }, [filter])

    const handleResolve = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/sos-alerts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'resolved' })
            })

            if (response.ok) {
                // Refresh list
                fetchAlerts()
            }
        } catch (error) {
            alert('Failed to resolve alert')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

    const getTimeAgo = (dateString) => {
        const seconds = Math.floor((new Date() - new Date(dateString)) / 1000)
        if (seconds < 60) return 'Just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        return formatDate(dateString)
    }

    return (
        <div className="sos-alerts-container">
            <div className="panel-header">
                <h3>🚨 Emergency SOS Alerts</h3>
                <div className="filter-controls">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading alerts...</div>
            ) : alerts.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">✅</span>
                    <p>No {filter !== 'all' ? filter : ''} SOS alerts found</p>
                </div>
            ) : (
                <div className="alerts-grid">
                    {alerts.map(alert => (
                        <div key={alert.id} className={`alert-card ${alert.status}`}>
                            <div className="alert-header">
                                <div className="user-info">
                                    <span className="room-badge">Room {alert.roomId}</span>
                                    <span className="username">{alert.username}</span>
                                </div>
                                <span className="time-badge">{getTimeAgo(alert.timestamp)}</span>
                            </div>

                            <div className="alert-message">
                                "{alert.message}"
                            </div>

                            <div className="alert-footer">
                                <div className="alert-meta">
                                    <span className="status-indicator">
                                        {alert.status === 'pending' ? '🔴 Pending Action' : '🟢 Resolved'}
                                    </span>
                                    {alert.roomInfo && (
                                        <span className={`risk-dot risk-${alert.roomInfo.riskScore >= 60 ? 'high' :
                                                alert.roomInfo.riskScore >= 30 ? 'medium' : 'low'
                                            }`}>
                                            Risk: {alert.roomInfo.riskScore}%
                                        </span>
                                    )}
                                </div>

                                {alert.status === 'pending' && (
                                    <button
                                        className="resolve-btn"
                                        onClick={() => handleResolve(alert.id)}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                                {alert.status === 'resolved' && (
                                    <span className="resolved-date">
                                        Resolved: {formatDate(alert.resolvedAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SOSAlerts
