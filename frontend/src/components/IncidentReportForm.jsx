import { useState, useRef } from 'react'
import './IncidentReportForm.css'

function IncidentReportForm({ username, roomId }) {
    const [incidentType, setIncidentType] = useState('Suspicious Item')
    const [description, setDescription] = useState('')
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
    const fileInputRef = useRef(null)

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit')
                return
            }
            setPhoto(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('roomId', roomId)
            formData.append('incidentType', incidentType)
            formData.append('description', description)
            if (photo) {
                formData.append('photo', photo)
            }

            const response = await fetch('http://localhost:3000/api/student/incident-report', {
                method: 'POST',
                body: formData // No Content-Type header needed, browser sets it for FormData
            })

            const data = await response.json()

            if (data.success) {
                setSubmitStatus('success')
                // Reset form
                setIncidentType('Suspicious Item')
                setDescription('')
                setPhoto(null)
                setPhotoPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ''

                // Clear success message after 5 seconds
                setTimeout(() => setSubmitStatus(null), 5000)
            } else {
                setSubmitStatus('error')
                alert('Failed to submit report: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            setSubmitStatus('error')
            alert('Failed to submit report: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="incident-report-container">
            <div className="incident-header">
                <h3>📝 Report an Incident</h3>
                <p>Report drug-related issues or suspicious items anonymously.</p>
            </div>

            {submitStatus === 'success' && (
                <div className="success-banner">
                    ✅ Report submitted successfully. Thank you for keeping the hostel safe.
                </div>
            )}

            <form onSubmit={handleSubmit} className="incident-form">
                <div className="form-group">
                    <label>Incident Type</label>
                    <select
                        value={incidentType}
                        onChange={(e) => setIncidentType(e.target.value)}
                        className="form-select"
                    >
                        <option value="Suspicious Item">Suspicious Item Found</option>
                        <option value="Drug Related">Drug Related Issue</option>
                        <option value="Other Safety Concern">Other Safety Concern</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe what you found and where..."
                        required
                        rows={4}
                        className="form-textarea"
                    />
                </div>

                <div className="form-group">
                    <label>Photo Evidence (Optional)</label>
                    <div className="file-upload-wrapper">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            ref={fileInputRef}
                            className="file-input"
                            id="photo-upload"
                        />
                        <label htmlFor="photo-upload" className="file-upload-btn">
                            {photo ? '📷 Change Photo' : '📷 Upload Photo'}
                        </label>
                        {photo && <span className="file-name">{photo.name}</span>}
                    </div>

                    {photoPreview && (
                        <div className="photo-preview-container">
                            <img src={photoPreview} alt="Preview" className="photo-preview" />
                            <button
                                type="button"
                                className="remove-photo-btn"
                                onClick={() => {
                                    setPhoto(null)
                                    setPhotoPreview(null)
                                    if (fileInputRef.current) fileInputRef.current.value = ''
                                }}
                            >
                                ❌ Remove
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-report-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    )
}

export default IncidentReportForm
