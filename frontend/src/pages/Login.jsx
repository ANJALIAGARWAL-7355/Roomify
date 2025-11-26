import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [userType, setUserType] = useState('student')
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        roomId: ''
    })
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        if (userType === 'student') {
            // Simple validation for students
            if (credentials.username && credentials.roomId) {
                // Store in sessionStorage
                sessionStorage.setItem('userType', 'student')
                sessionStorage.setItem('username', credentials.username)
                sessionStorage.setItem('roomId', credentials.roomId)
                navigate('/student')
            } else {
                alert('Please fill in all fields')
            }
        } else {
            // Admin login
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                sessionStorage.setItem('userType', 'admin')
                sessionStorage.setItem('username', credentials.username)
                navigate('/admin')
            } else {
                alert('Invalid admin credentials. Use username: admin, password: admin123')
            }
        }
    }

    return (
        <div className="container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    Login to Roomify
                </h2>

                {/* User Type Selector */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: 'var(--bg-tertiary)',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <button
                        type="button"
                        onClick={() => setUserType('student')}
                        className={userType === 'student' ? 'btn btn-primary' : 'btn btn-secondary'}
                        style={{ flex: 1 }}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setUserType('admin')}
                        className={userType === 'admin' ? 'btn btn-primary' : 'btn btn-secondary'}
                        style={{ flex: 1 }}
                    >
                        Admin
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">
                            {userType === 'student' ? 'Student Name' : 'Admin Username'}
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            placeholder={userType === 'student' ? 'Enter your name' : 'Enter admin username'}
                            required
                        />
                    </div>

                    {userType === 'student' ? (
                        <div className="input-group">
                            <label className="input-label">Room Number</label>
                            <select
                                className="select-field"
                                value={credentials.roomId}
                                onChange={(e) => setCredentials({ ...credentials, roomId: e.target.value })}
                                required
                            >
                                <option value="">Select your room</option>
                                <option value="301">Room 301</option>
                                <option value="302">Room 302</option>
                                <option value="303">Room 303</option>
                                <option value="304">Room 304</option>
                                <option value="305">Room 305</option>
                                <option value="306">Room 306</option>
                                <option value="307">Room 307</option>
                                <option value="308">Room 308</option>
                                <option value="309">Room 309</option>
                                <option value="310">Room 310</option>
                                <option value="311">Room 311</option>
                                <option value="312">Room 312</option>
                                <option value="313">Room 313</option>
                                <option value="314">Room 314</option>
                                <option value="315">Room 315</option>
                            </select>
                        </div>
                    ) : (
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="Enter admin password"
                                required
                            />
                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                marginTop: '0.5rem'
                            }}>
                                Demo credentials: admin / admin123
                            </p>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login as {userType === 'student' ? 'Student' : 'Admin'}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    <strong>Quick Access:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                        <div>👤 Student: Enter any name + select room</div>
                        <div>🔐 Admin: admin / admin123</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
