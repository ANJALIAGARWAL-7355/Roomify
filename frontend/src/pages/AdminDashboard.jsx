import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RiskHeatmap from '../components/RiskHeatmap'
import TrendGraph from '../components/TrendGraph'
import SubmissionsManager from '../components/SubmissionsManager'

function AdminDashboard() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [activeTab, setActiveTab] = useState('dashboard')

    // Check authentication on mount
    useEffect(() => {
        const userType = sessionStorage.getItem('userType')
        const storedUsername = sessionStorage.getItem('username')

        if (userType !== 'admin' || !storedUsername) {
            navigate('/login')
            return
        }

        setUsername(storedUsername)
    }, [navigate])

    const [rooms] = useState([
        { id: 1, number: '301', riskScore: 18, occupants: 3, trend: 'stable' },
        { id: 2, number: '302', riskScore: 45, occupants: 2, trend: 'increasing' },
        { id: 3, number: '303', riskScore: 22, occupants: 3, trend: 'decreasing' },
        { id: 4, number: '304', riskScore: 72, occupants: 4, trend: 'increasing' },
        { id: 5, number: '305', riskScore: 15, occupants: 2, trend: 'stable' },
        { id: 6, number: '306', riskScore: 38, occupants: 3, trend: 'stable' },
        { id: 7, number: '307', riskScore: 65, occupants: 2, trend: 'increasing' },
        { id: 8, number: '308', riskScore: 28, occupants: 3, trend: 'decreasing' },
        { id: 9, number: '309', riskScore: 12, occupants: 2, trend: 'stable' },
        { id: 10, number: '310', riskScore: 55, occupants: 4, trend: 'increasing' },
        { id: 11, number: '311', riskScore: 20, occupants: 3, trend: 'stable' },
        { id: 12, number: '312', riskScore: 8, occupants: 2, trend: 'stable' },
    ])

    const [trendData] = useState([
        { week: 1, conflicts: 12, satisfaction: 75 },
        { week: 2, conflicts: 15, satisfaction: 72 },
        { week: 3, conflicts: 10, satisfaction: 78 },
        { week: 4, conflicts: 18, satisfaction: 68 },
        { week: 5, conflicts: 14, satisfaction: 74 },
        { week: 6, conflicts: 11, satisfaction: 76 },
        { week: 7, conflicts: 9, satisfaction: 80 },
    ])

    const highRiskRooms = rooms.filter(room => room.riskScore >= 60)
    const mediumRiskRooms = rooms.filter(room => room.riskScore >= 30 && room.riskScore < 60)
    const lowRiskRooms = rooms.filter(room => room.riskScore < 30)

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

    if (!username) {
        return <div className="container">Loading...</div>
    }

    return (
        <div className="container">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Admin Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Welcome, {username} • Monitor and manage all hostel rooms
                    </p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                </button>
            </div>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: 'var(--spacing-xl)',
                borderBottom: '2px solid var(--border)'
            }}>
                <button
                    onClick={() => setActiveTab('dashboard')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'dashboard' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    📊 Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('submissions')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'submissions' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'submissions' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'submissions' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    📝 All Submissions
                </button>
            </div>

            {activeTab === 'dashboard' ? (
                <>
                    {/* Stats Overview */}
                    <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏠</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                {rooms.length}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>Total Rooms</div>
                        </div>

                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'var(--danger)',
                                marginBottom: '0.25rem'
                            }}>
                                {highRiskRooms.length}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>High Risk Rooms</div>
                        </div>

                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'var(--success)',
                                marginBottom: '0.25rem'
                            }}>
                                {lowRiskRooms.length}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>Healthy Rooms</div>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    {
                        highRiskRooms.length > 0 && (
                            <div style={{
                                padding: 'var(--spacing-lg)',
                                background: 'hsla(0, 85%, 65%, 0.1)',
                                border: '1px solid var(--danger)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-xl)'
                            }}>
                                <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
                                    🚨 High Risk Alerts
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {highRiskRooms.map(room => (
                                        <div key={room.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 'var(--spacing-sm)',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-sm)'
                                        }}>
                                            <div>
                                                <strong>Room {room.number}</strong>
                                                <span style={{
                                                    marginLeft: '1rem',
                                                    color: 'var(--text-muted)',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    Risk Score: {room.riskScore}%
                                                </span>
                                            </div>
                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                                Intervene
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    {/* Heatmap */}
                    <RiskHeatmap rooms={rooms} />

                    {/* Trends */}
                    <div style={{ marginTop: 'var(--spacing-xl)' }}>
                        <TrendGraph data={trendData} />
                    </div>

                    {/* Recommendations */}
                    <div className="glass-card" style={{ marginTop: 'var(--spacing-xl)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>AI Recommendations</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                borderLeft: '4px solid var(--danger)'
                            }}>
                                <strong style={{ color: 'var(--danger)' }}>Immediate Action Required</strong>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    Room 304 and 307 show consistently high conflict scores for 3+ weeks.
                                    Consider scheduling mediation sessions or room changes.
                                </p>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                borderLeft: '4px solid var(--warning)'
                            }}>
                                <strong style={{ color: 'var(--warning)' }}>Trending Patterns</strong>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    Common issues: Noise complaints (45%), Cleanliness conflicts (32%), Privacy concerns (18%).
                                    Consider hostel-wide quiet hours policy.
                                </p>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                borderLeft: '4px solid var(--success)'
                            }}>
                                <strong style={{ color: 'var(--success)' }}>Positive Trend</strong>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    Overall satisfaction increased by 8% this week. Rooms 305, 309, and 312
                                    show excellent harmony scores.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <SubmissionsManager />
            )}
        </div>
    )
}

export default AdminDashboard
