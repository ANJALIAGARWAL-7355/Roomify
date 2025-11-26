import '../index.css'

function Home() {
    return (
        <div className="container">
            <div className="hero" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                    Welcome to Roomify
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '700px',
                    margin: '0 auto 3rem'
                }}>
                    AI-powered roommate conflict prediction system that identifies tensions before they escalate.
                    Create peaceful living spaces through data-driven insights.
                </p>

                <div className="grid grid-2" style={{ marginTop: '4rem' }}>
                    <div className="glass-card fade-in">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-light)' }}>For Students</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Take weekly vibe checks, view your room's harmony score, and get personalized peace tips.
                        </p>
                        <a href="/login" className="btn btn-primary">Student Login</a>
                    </div>

                    <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>For Admins</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Monitor all rooms, identify high-risk conflicts, and intervene proactively with data-driven insights.
                        </p>
                        <a href="/login" className="btn btn-primary">Admin Login</a>
                    </div>
                </div>

                <div className="glass-card" style={{ marginTop: '4rem', textAlign: 'left' }}>
                    <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>How It Works</h2>
                    <div className="grid grid-3">
                        <div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'var(--primary)',
                                marginBottom: '0.5rem'
                            }}>01</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Weekly Vibe Check</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Students anonymously share their room experience through a 2-minute survey
                            </p>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'var(--secondary)',
                                marginBottom: '0.5rem'
                            }}>02</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>AI Analysis</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                AI analyzes patterns, sentiment, and trends to predict conflict risks
                            </p>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'var(--accent)',
                                marginBottom: '0.5rem'
                            }}>03</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Proactive Action</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Get personalized tips and alerts before conflicts escalate
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
