import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
    const isAuthenticated = () => {
        return sessionStorage.getItem('userType') !== null
    }

    return (
        <Router>
            <div className="app">
                <nav className="navbar">
                    <div className="navbar-content">
                        <div className="navbar-brand">Roomify</div>
                        <ul className="navbar-nav">
                            <li><Link to="/" className="nav-link">Home</Link></li>
                            {isAuthenticated() ? (
                                <>
                                    {sessionStorage.getItem('userType') === 'student' && (
                                        <li><Link to="/student" className="nav-link">Dashboard</Link></li>
                                    )}
                                    {sessionStorage.getItem('userType') === 'admin' && (
                                        <li><Link to="/admin" className="nav-link">Dashboard</Link></li>
                                    )}
                                </>
                            ) : (
                                <li><Link to="/login" className="nav-link">Login</Link></li>
                            )}
                        </ul>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
