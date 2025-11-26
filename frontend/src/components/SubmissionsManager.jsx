import { useState, useEffect } from 'react'

function SubmissionsManager() {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState({ roomId: '', username: '' })
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        fetchSubmissions()
    }, [])

    const fetchSubmissions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admin/submissions')
            const data = await response.json()
            setSubmissions(data.submissions || [])
        } catch (error) {
            console.error('Failed to fetch submissions:', error)
            showNotification('Failed to load submissions', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSubmission = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/submissions/${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()

            if (data.success) {
                setSubmissions(prev => prev.filter(s => s.id !== id))
                showNotification('Submission deleted successfully', 'success')
            } else {
                showNotification('Failed to delete submission', 'error')
            }
        } catch (error) {
            console.error('Failed to delete submission:', error)
            showNotification('Failed to delete submission', 'error')
        } finally {
            setDeleteConfirm(null)
        }
    }

    const handleDeleteUserRecords = async (username) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/users/${username}`, {
                method: 'DELETE'
            })
            const data = await response.json()

            if (data.success) {
                setSubmissions(prev => prev.filter(s => s.username !== username))
                showNotification(`Deleted ${data.deletedCount} record(s) from user ${username}`, 'success')
            } else {
                showNotification('Failed to delete user records', 'error')
            }
        } catch (error) {
            console.error('Failed to delete user records:', error)
            showNotification('Failed to delete user records', 'error')
        } finally {
            setDeleteConfirm(null)
        }
    }

    const showNotification = (message, type) => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    const filteredSubmissions = submissions.filter(sub => {
        if (filter.roomId && !sub.roomId.includes(filter.roomId)) return false
        if (filter.username && !sub.username.toLowerCase().includes(filter.username.toLowerCase())) return false
        return true
    })

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getDisagreementColor = (level) => {
        switch (level) {
            case 'none': return 'var(--success)'
            case 'minor': return 'var(--warning)'
            case 'moderate': return 'var(--danger)'
            case 'major': return 'var(--danger)'
            default: return 'var(--text-secondary)'
        }
    }

    if (loading) {
        return <div className="glass-card">Loading submissions...</div>
    }

    return (
        <div>
            {notification && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    background: notification.type === 'success'
                        ? 'hsla(145, 75%, 55%, 0.2)'
                        : 'hsla(0, 85%, 65%, 0.2)',
                    border: `1px solid ${notification.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)',
                    color: notification.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    {notification.type === 'success' ? '✅' : '❌'} {notification.message}
                </div>
            )}

            {deleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-card" style={{ maxWidth: '500px', width: '90%' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Confirm Deletion</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            {deleteConfirm.type === 'user'
                                ? `Are you sure you want to delete ALL submissions from user "${deleteConfirm.value}"? This action cannot be undone.`
                                : `Are you sure you want to delete this submission? This action cannot be undone.`
                            }
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1, background: 'var(--danger)' }}
                                onClick={() => {
                                    if (deleteConfirm.type === 'user') {
                                        handleDeleteUserRecords(deleteConfirm.value)
                                    } else {
                                        handleDeleteSubmission(deleteConfirm.value)
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-lg)',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <h2>All Submissions ({filteredSubmissions.length})</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Filter by room..."
                            className="input-field"
                            style={{ padding: '0.5rem 1rem', minWidth: '150px' }}
                            value={filter.roomId}
                            onChange={(e) => setFilter(prev => ({ ...prev, roomId: e.target.value }))}
                        />
                        <input
                            type="text"
                            placeholder="Filter by username..."
                            className="input-field"
                            style={{ padding: '0.5rem 1rem', minWidth: '150px' }}
                            value={filter.username}
                            onChange={(e) => setFilter(prev => ({ ...prev, username: e.target.value }))}
                        />
                    </div>
                </div>

                {filteredSubmissions.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                        No submissions found.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem 0.5rem' }}>Username</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Room</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Peace</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Noise</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Clean</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Privacy</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Conflicts</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.map((submission) => (
                                    <tr key={submission.id} style={{
                                        borderBottom: '1px solid var(--border)',
                                        transition: 'background 0.2s ease'
                                    }}>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <strong>{submission.username}</strong>
                                            <button
                                                className="btn btn-secondary"
                                                style={{
                                                    marginLeft: '0.5rem',
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '0.75rem'
                                                }}
                                                onClick={() => setDeleteConfirm({ type: 'user', value: submission.username })}
                                                title="Delete all records from this user"
                                            >
                                                Delete All
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{submission.roomId}</td>
                                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {formatDate(submission.timestamp)}
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{submission.peacefulness}/10</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{submission.noiseLevel}/10</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{submission.cleanliness}/10</td>
                                        <td style={{ padding: '1rem 0.5rem' }}>{submission.privacyRespect}/10</td>
                                        <td style={{
                                            padding: '1rem 0.5rem',
                                            color: getDisagreementColor(submission.disagreements),
                                            fontWeight: '500'
                                        }}>
                                            {submission.disagreements}
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                onClick={() => setDeleteConfirm({ type: 'single', value: submission.id })}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubmissionsManager
