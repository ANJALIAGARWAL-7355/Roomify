function RiskHeatmap({ rooms }) {
    const getRiskColor = (score) => {
        if (score < 30) return 'var(--success)'
        if (score < 60) return 'var(--warning)'
        return 'var(--danger)'
    }

    const getRiskLevel = (score) => {
        if (score < 30) return 'Low'
        if (score < 60) return 'Medium'
        return 'High'
    }

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Conflict Risk Heatmap</h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem'
            }}>
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        style={{
                            background: 'var(--bg-tertiary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: `4px solid ${getRiskColor(room.riskScore)}`,
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                        }}
                        className="room-card"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)'
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem'
                        }}>
                            {room.number}
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: getRiskColor(room.riskScore),
                            marginBottom: '0.25rem'
                        }}>
                            {room.riskScore}%
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {getRiskLevel(room.riskScore)} Risk
                        </div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            marginTop: '0.5rem'
                        }}>
                            {room.occupants} occupants
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--success)'
                    }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Low (0-30%)
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--warning)'
                    }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Medium (30-60%)
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--danger)'
                    }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        High (60-100%)
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RiskHeatmap
