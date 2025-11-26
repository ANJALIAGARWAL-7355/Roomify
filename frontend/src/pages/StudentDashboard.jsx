import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VibeCheckForm from '../components/VibeCheckForm'
import RoomScore from '../components/RoomScore'
import PeaceTips from '../components/PeaceTips'

function StudentDashboard() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [roomId, setRoomId] = useState('')

    const [roomData, setRoomData] = useState({
        score: 25,
        history: [30, 28, 32, 26, 24, 22, 25],
        tips: []
    })
    const [showForm, setShowForm] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Check authentication on mount
    useEffect(() => {
        const userType = sessionStorage.getItem('userType')
        const storedUsername = sessionStorage.getItem('username')
        const storedRoomId = sessionStorage.getItem('roomId')

        if (userType !== 'student' || !storedUsername || !storedRoomId) {
            navigate('/login')
            return
        }

        setUsername(storedUsername)
        setRoomId(storedRoomId)
    }, [navigate])

    // Generate tips based on score
    useEffect(() => {
        const generateTips = (score) => {
            const tips = []

            if (score > 50) {
                tips.push({
                    title: 'Schedule a Room Meeting',
                    description: 'Set aside time this week to discuss concerns openly with your roommates.',
                    priority: 'high'
                })
            }

            if (score > 40) {
                tips.push({
                    title: 'Establish Quiet Hours',
                    description: 'Consider agreeing on quiet hours between 11 PM - 7 AM for better sleep.',
                    priority: 'medium'
                })
            }

            if (score > 30) {
                tips.push({
                    title: 'Create a Cleaning Schedule',
                    description: 'A simple rotation system can prevent cleanliness conflicts.',
                    priority: 'medium'
                })
            }

            if (score < 30) {
                tips.push({
                    title: 'Keep Up the Good Work!',
                    description: 'Your room has great harmony. Continue being respectful and communicative.',
                    priority: 'low'
                })
            }

            return tips
        }

        setRoomData(prev => ({ ...prev, tips: generateTips(prev.score) }))
    }, [roomData.score])

    const handleVibeCheckSubmit = async (formData) => {
        console.log('Vibe check submitted:', formData)

        try {
            const response = await fetch('http://localhost:3000/api/student/vibe-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                // Update local score with new risk score from server
                const newScore = data.newRiskScore || roomData.score
                setRoomData(prev => ({
                    ...prev,
                    score: newScore,
                    history: [...prev.history.slice(-6), newScore]
                }))

                setSubmitted(true)
                setShowForm(false)

                setTimeout(() => setSubmitted(false), 3000)
            } else {
                alert('Failed to submit vibe check: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error submitting vibe check:', error)
            alert('Failed to submit vibe check. Please try again.')
        }
    }

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

    if (!roomId) {
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
                        Student Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Room {roomId} • Welcome back, {username}!
                    </p>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                </button>
            </div>

            {submitted && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'hsla(145, 75%, 55%, 0.2)',
                    border: '1px solid var(--success)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)',
                    color: 'var(--success)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    ✅ Thank you! Your vibe check has been submitted.
                </div>
            )}

            <div className="grid grid-2">
                <div>
                    <RoomScore score={roomData.score} history={roomData.history} />

                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        {!showForm ? (
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: 'var(--spacing-md)' }}
                            >
                                📝 Fill Weekly Vibe Check
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowForm(false)}
                                className="btn btn-secondary"
                                style={{ width: '100%', padding: 'var(--spacing-md)' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    {showForm ? (
                        <VibeCheckForm onSubmit={handleVibeCheckSubmit} roomId={roomId} username={username} />
                    ) : (
                        <PeaceTips tips={roomData.tips} />
                    )}
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: '1rem' }}>About Vibe Checks</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    Your weekly vibe check helps us understand how your room is doing.
                    Admins can view submissions to identify potential conflicts early and
                    provide appropriate support. This data helps create a better living
                    environment for everyone in the hostel.
                </p>
            </div>
        </div>
    )
}

export default StudentDashboard
