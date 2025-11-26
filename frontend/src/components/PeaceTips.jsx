function PeaceTips({ tips }) {
    const getTipIcon = (priority) => {
        switch (priority) {
            case 'high': return '🔴'
            case 'medium': return '🟡'
            default: return '💡'
        }
    }

    if (!tips || tips.length === 0) {
        return (
            <div className="glass-card">
                <h3 style={{ marginBottom: '1rem' }}>Peace Tips</h3>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                    <p>Everything looks great! Keep up the positive vibes.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Peace Tips for Your Room</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tips.map((tip, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: `4px solid ${tip.priority === 'high'
                                    ? 'var(--danger)'
                                    : tip.priority === 'medium'
                                        ? 'var(--warning)'
                                        : 'var(--primary)'
                                }`
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.5rem'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{getTipIcon(tip.priority)}</span>
                            <strong style={{ color: 'var(--text-primary)' }}>{tip.title}</strong>
                        </div>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            marginLeft: '2.25rem'
                        }}>
                            {tip.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PeaceTips
