import { useState, useEffect } from 'react'
import './IncidentReports.css'

function IncidentReports() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // 'all', 'pending', 'resolved'
    const [typeFilter, setTypeFilter] = useState('all')
    const [selectedPhoto, setSelectedPhoto] = useState(null)

    const fetchReports = async () => {
        try {
            let url = `http://localhost:3000/api/admin/incident-reports?status=${filter}`
            if (typeFilter !== 'all') {
                url += `&type=${encodeURIComponent(typeFilter)}`
            }

            const response = await fetch(url)
            const data = await response.json()
            if (data.reports) {
                setReports(data.reports)
            }
        } catch (error) {
            console.error('Error fetching incident reports:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [filter, typeFilter])

    const handleResolve = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/incident-reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'resolved',
                    actionTaken: 'Reviewed by admin'
                })
            })

            if (response.ok) {
                fetchReports()
            }
        } catch (error) {
            alert('Failed to resolve incident')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

    return (
        <div className="incident-reports-container">
            <div className="panel-header">
                <h3>📋 Incident Reports</h3>
                <div className="filters-wrapper">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="type-select"
                    >
                        <option value="all">All Types</option>
                        <option value="Suspicious Item">Suspicious Items</option>
                        <option value="Drug Related">Drug Related</option>
                        <option value="Other Safety Concern">Other Concerns</option>
                    </select>

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
            </div>

            {loading ? (
                <div className="loading-state">Loading reports...</div>
            ) : reports.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📝</span>
                    <p>No incident reports found</p>
                </div>
            ) : (
                <div className="reports-list">
                    {reports.map(report => (
                        <div key={report.id} className={`report-card ${report.status}`}>
                            <div className="report-content">
                                <div className="report-header">
                                    <div className="report-title">
                                        <span className={`type-badge ${report.incidentType.toLowerCase().replace(' ', '-')}`}>
                                            {report.incidentType}
                                        </span>
                                        <span className="report-time">{formatDate(report.timestamp)}</span>
                                    </div>
                                    <div className="reporter-info">
                                        Reported by <strong>{report.username}</strong> (Room {report.roomId})
                                    </div>
                                </div>

                                <p className="report-description">{report.description}</p>

                                {report.photoUrl && (
                                    <div className="report-photo-preview">
                                        <img
                                            src={`http://localhost:3000${report.photoUrl}`}
                                            alt="Evidence"
                                            onClick={() => setSelectedPhoto(`http://localhost:3000${report.photoUrl}`)}
                                        />
                                        <span className="photo-label">📷 Click to view evidence</span>
                                    </div>
                                )}
                            </div>

                            <div className="report-actions">
                                <div className="status-badge-wrapper">
                                    <span className={`status-badge ${report.status}`}>
                                        {report.status === 'pending' ? 'Needs Review' : 'Resolved'}
                                    </span>
                                </div>

                                {report.status === 'pending' && (
                                    <button
                                        className="resolve-btn"
                                        onClick={() => handleResolve(report.id)}
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                                {report.status === 'resolved' && (
                                    <span className="resolved-text">
                                        Action Taken: {report.actionTaken || 'Resolved'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox for photo viewing */}
            {selectedPhoto && (
                <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
                    <div className="lightbox-content">
                        <img src={selectedPhoto} alt="Full size evidence" />
                        <button className="close-lightbox">×</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default IncidentReports
