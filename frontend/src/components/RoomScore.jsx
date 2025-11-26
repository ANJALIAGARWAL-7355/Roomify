function RoomScore({ score, history }) {
    const getRiskLevel = (score) => {
        if (score < 30) return { level: 'low', text: 'Healthy Vibes', emoji: '🟢' }
        if (score < 60) return { level: 'medium', text: 'Minor Tension', emoji: '🟡' }
        return { level: 'high', text: 'High Risk', emoji: '🔴' }
    }

    const risk = getRiskLevel(score)

    return (
        <div className="glass-card score-display">
            <h2 style={{ marginBottom: '1rem' }}>Room Harmony Score</h2>
            <div className={`score-value score-${risk.level}`}>
                {risk.emoji} {score}%
            </div>
            <div className={`risk-badge risk-${risk.level}`}>
                {risk.text}
            </div>

            {history && history.length > 0 && (
                <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent Trend</h3>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'flex-end',
                        height: '100px'
                    }}>
                        {history.slice(-7).map((value, index) => {
                            const height = Math.max(10, value);
                            const riskLvl = getRiskLevel(value);
                            return (
                                <div
                                    key={index}
                                    style={{
                                        flex: 1,
                                        height: `${height}%`,
                                        background: riskLvl.level === 'low'
                                            ? 'var(--success)'
                                            : riskLvl.level === 'medium'
                                                ? 'var(--warning)'
                                                : 'var(--danger)',
                                        borderRadius: '4px 4px 0 0',
                                        opacity: 0.7 + (index * 0.05),
                                        transition: 'all var(--transition-normal)'
                                    }}
                                    title={`Day ${index + 1}: ${value}%`}
                                />
                            )
                        })}
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                    }}>
                        <span>7 days ago</span>
                        <span>Today</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RoomScore
