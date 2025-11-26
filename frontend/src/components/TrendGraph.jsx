import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function TrendGraph({ data }) {
    // Transform data for recharts
    const chartData = data.map((item, index) => ({
        week: `Week ${index + 1}`,
        conflicts: item.conflicts || 0,
        satisfaction: item.satisfaction || 0
    }))

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Conflict Trends Over Time</h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="week"
                        stroke="var(--text-muted)"
                        style={{ fontSize: '0.85rem' }}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        style={{ fontSize: '0.85rem' }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: '1rem',
                            fontSize: '0.9rem'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="conflicts"
                        stroke="var(--danger)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--danger)', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Conflict Reports"
                    />
                    <Line
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="var(--success)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--success)', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Satisfaction Score"
                    />
                </LineChart>
            </ResponsiveContainer>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
            }}>
                📊 Tracking weekly trends helps identify patterns before they escalate into major conflicts.
            </div>
        </div>
    )
}

export default TrendGraph
