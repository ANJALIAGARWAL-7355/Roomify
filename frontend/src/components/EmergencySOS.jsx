import { useState } from 'react'
import './EmergencySOS.css'

function EmergencySOS({ username, roomId }) {
    const [showConfirm, setShowConfirm] = useState(false)
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleSOSClick = () => {
        setShowConfirm(true)
    }

    const handleCancel = () => {
        setShowConfirm(false)
        setMessage('')
    }

    const handleConfirm = async () => {
        setIsSubmitting(true)
        try {
            const response = await fetch('http://localhost:3000/api/student/sos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    roomId,
                    message: message || 'Emergency - Need immediate help!'
                })
            })

            const data = await response.json()

            if (data.success) {
                setSubmitSuccess(true)
                setTimeout(() => {
                    setShowConfirm(false)
                    setSubmitSuccess(false)
                    setMessage('')
                }, 3000)
            } else {
                alert('Failed to send SOS: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            alert('Failed to send SOS: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="emergency-sos-container">
            {!showConfirm ? (
                <div className="sos-button-wrapper">
                    <button className="emergency-button" onClick={handleSOSClick}>
                        <span className="sos-icon">🚨</span>
                        <span className="sos-text">SOS EMERGENCY</span>
                        <span className="sos-subtext">Tap for immediate help</span>
                    </button>
                    <p className="safety-info">
                        ⚠️ Use only for genuine emergencies. Admin will be notified immediately.
                    </p>
                </div>
            ) : (
                <div className="sos-confirm-dialog">
                    {!submitSuccess ? (
                        <>
                            <div className="confirm-header">
                                <span className="warning-icon">⚠️</span>
                                <h3>Send Emergency Alert?</h3>
                            </div>
                            <p className="confirm-message">
                                This will immediately notify the hostel admin of an emergency in your room.
                            </p>
                            <textarea
                                className="sos-message-input"
                                placeholder="Optional: Briefly describe the emergency..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={200}
                                rows={3}
                            />
                            <div className="confirm-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-confirm-sos"
                                    onClick={handleConfirm}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : '🚨 Send SOS Alert'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="success-message">
                            <span className="success-icon">✅</span>
                            <h3>Alert Sent Successfully!</h3>
                            <p>Admin has been notified. Help is on the way.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default EmergencySOS
